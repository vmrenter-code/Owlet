import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';

import BackArrow from '../components/BackArrow';
import HomeBg from '../components/HomeBg';
import EmptyStateIllustration from '../assets/emptystate.svg';
import { API_BASE_URL } from '../src/config/apiBaseUrl';
import { useChild } from '../context/ChildContext';

const INDIGO = '#5058b4';
const TEAL = '#49A3BD';

type ScreeningRecord = {
  id: string;
  createdAt: string;
  status?: string;
  hasResults?: boolean;
  date?: string;
};

function formatScreeningDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown date';
  return d
    .toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(' at', ' ·')
    .replace(' AM', ' am')
    .replace(' PM', ' pm');
}

function formatDisplayDate(screening: ScreeningRecord): string {
  if (screening.date) return screening.date;
  return formatScreeningDate(screening.createdAt);
}

function statusLabel(screening: ScreeningRecord): string {
  if (screening.hasResults) return 'Complete';
  const raw = (screening.status ?? 'pending').toLowerCase();
  if (raw.includes('complete') || raw.includes('reviewed')) return 'Complete';
  if (raw.includes('progress') || raw.includes('pending')) return 'In review';
  return screening.status ?? 'In review';
}

function isComplete(screening: ScreeningRecord): boolean {
  if (screening.hasResults) return true;
  const raw = (screening.status ?? '').toLowerCase();
  return raw.includes('complete') || raw.includes('reviewed');
}

export default function PastScreenings() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { selectedChild } = useChild();

  const [hasIncompleteScreening, setHasIncompleteScreening] = useState(false);
  const [incompleteVideoNumber, setIncompleteVideoNumber] = useState(1);
  const [pastScreenings, setPastScreenings] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const childName = selectedChild?.name?.trim() || 'your child';

  useEffect(() => {
    const checkIncompleteScreening = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('screeningProgress');
        if (!savedProgress) return;
        const progress = JSON.parse(savedProgress);
        if (progress.videoNumber && !progress.completed) {
          setHasIncompleteScreening(true);
          setIncompleteVideoNumber(progress.videoNumber);
        }
      } catch {
        // ignore
      }
    };
    checkIncompleteScreening();
  }, []);

  const fetchPastScreenings = useCallback(async () => {
    if (!selectedChild?.id) {
      setPastScreenings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const user = getAuth().currentUser;
      if (!user) {
        setPastScreenings([]);
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(
        `${API_BASE_URL}/screenings?childId=${selectedChild.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.ok) throw new Error('Failed to fetch screenings');

      const data = await response.json();
      if (data.success && Array.isArray(data.screenings)) {
        const sorted = [...data.screenings].sort(
          (a: ScreeningRecord, b: ScreeningRecord) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setPastScreenings(sorted);
      } else {
        setPastScreenings([]);
      }
    } catch (err) {
      console.error('Error fetching past screenings:', err);
      setPastScreenings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChild?.id]);

  useEffect(() => {
    fetchPastScreenings();
  }, [fetchPastScreenings]);

  const handleResumeScreening = () => {
    navigation.navigate('VideoScreen', { videoNumber: incompleteVideoNumber });
  };

  const showEmpty =
    !loading && pastScreenings.length === 0 && !hasIncompleteScreening;

  return (
    <View style={styles.container}>
      <View style={styles.bg} pointerEvents="none">
        <HomeBg />
      </View>

      {navigation.canGoBack() ? <BackArrow /> : null}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + (navigation.canGoBack() ? 56 : 24),
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <Text style={styles.title}>Past screenings</Text>
        <Text style={styles.subtitle}>
          Screening history for {childName}.
        </Text>

        {hasIncompleteScreening && (
          <Pressable
            style={({ pressed }) => [
              styles.resumeCard,
              pressed && styles.resumeCardPressed,
            ]}
            onPress={handleResumeScreening}
            accessibilityRole="button"
            accessibilityLabel="Resume screening"
          >
            <View style={styles.resumeTextWrap}>
              <Text style={styles.resumeTitle}>Resume screening</Text>
              <Text style={styles.resumeSubtitle}>
                Pick up where you left off on video {incompleteVideoNumber}
              </Text>
            </View>
            <View style={styles.resumePlay}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M8 5v14l11-7L8 5z" fill="#ffffff" />
              </Svg>
            </View>
          </Pressable>
        )}

        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={INDIGO} />
            <Text style={styles.loadingText}>Loading screenings…</Text>
          </View>
        )}

        {showEmpty && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIllustration}>
              <EmptyStateIllustration
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            </View>
            <Text style={styles.emptyTitle}>No screenings yet</Text>
            <Text style={styles.emptyBody}>
              When {childName} completes a screening, it will show up here with
              results and clinician notes.
            </Text>
          </View>
        )}

        {!loading && pastScreenings.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>History</Text>
            <View style={styles.listCard}>
              {pastScreenings.map((screening, index) => {
                const complete = isComplete(screening);
                const label = statusLabel(screening);
                const isLast = index === pastScreenings.length - 1;
                const displayDate = formatDisplayDate(screening);

                return (
                  <View
                    key={screening.id}
                    style={[
                      styles.screeningRow,
                      !isLast && styles.screeningRowBorder,
                    ]}
                  >
                    <View style={styles.rowHeader}>
                      <Text style={styles.dateText} numberOfLines={2}>
                        {formatScreeningDate(screening.createdAt)}
                      </Text>
                      <View
                        style={[
                          styles.statusPill,
                          complete
                            ? styles.statusPillComplete
                            : styles.statusPillReview,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
                            complete
                              ? styles.statusPillTextComplete
                              : styles.statusPillTextReview,
                          ]}
                        >
                          {label}
                        </Text>
                      </View>
                    </View>

                    {!complete ? (
                      <Text style={styles.pendingText}>
                        Results will appear once clinician review is complete.
                      </Text>
                    ) : (
                      <View style={styles.actionsRow}>
                        <Pressable
                          style={({ pressed }) => [
                            styles.actionPill,
                            pressed && styles.actionPillPressed,
                          ]}
                          onPress={() =>
                            navigation.navigate('ViewResults', {
                              screeningId: screening.id,
                              date: displayDate,
                            })
                          }
                        >
                          <Text style={styles.actionPillText}>View results</Text>
                        </Pressable>
                        <Pressable
                          style={({ pressed }) => [
                            styles.actionPill,
                            pressed && styles.actionPillPressed,
                          ]}
                          onPress={() =>
                            navigation.navigate('ClinicianNotes', {
                              screeningId: screening.id,
                              date: displayDate,
                            })
                          }
                        >
                          <Text style={styles.actionPillText}>
                            Clinician notes
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({ pressed }) => [
                            styles.actionPill,
                            pressed && styles.actionPillPressed,
                          ]}
                          onPress={() =>
                            navigation.navigate('HeartRateGraph', {
                              screeningId: screening.id,
                              date: displayDate,
                            })
                          }
                        >
                          <Text style={styles.actionPillText}>Heart rate</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'NotoSans-SemiBold',
    color: '#151515',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'NotoSans-Regular',
    color: '#888',
    marginBottom: 20,
    lineHeight: 20,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INDIGO,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    gap: 12,
  },
  resumeCardPressed: {
    opacity: 0.92,
  },
  resumeTextWrap: { flex: 1 },
  resumeTitle: {
    fontSize: 17,
    fontFamily: 'NotoSans-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  resumeSubtitle: {
    fontSize: 13,
    fontFamily: 'NotoSans-Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  resumePlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'NotoSans-Regular',
    color: '#888',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 24,
    alignItems: 'center',
  },
  emptyIllustration: {
    width: '100%',
    height: 140,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'NotoSans-SemiBold',
    color: '#151515',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: 'NotoSans-Regular',
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'NotoSans-SemiBold',
    color: TEAL,
    letterSpacing: 0.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  screeningRow: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  screeningRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'NotoSans-SemiBold',
    color: '#151515',
    lineHeight: 21,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillComplete: {
    backgroundColor: 'rgba(73, 163, 189, 0.15)',
  },
  statusPillReview: {
    backgroundColor: 'rgba(80, 88, 180, 0.12)',
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: 'NotoSans-SemiBold',
  },
  statusPillTextComplete: {
    color: TEAL,
  },
  statusPillTextReview: {
    color: INDIGO,
  },
  pendingText: {
    fontSize: 13,
    fontFamily: 'NotoSans-Regular',
    color: '#888',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionPill: {
    backgroundColor: 'rgba(80, 88, 180, 0.1)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionPillPressed: {
    backgroundColor: 'rgba(80, 88, 180, 0.18)',
  },
  actionPillText: {
    fontSize: 13,
    fontFamily: 'NotoSans-SemiBold',
    color: INDIGO,
  },
});
