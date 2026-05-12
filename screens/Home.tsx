import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeBg from '../components/HomeBg';
import Modal from '../components/Modal';
import Card from '../components/Card';
import ToolButton from '../components/ToolButton';
import ProfileContainer from '../components/ProfileContainer';
import BeginCard from '../components/BeginCard';
import ChildProfileAvatar from '../components/ChildProfileAvatar';
import { Svg, Path, Circle } from 'react-native-svg';
import { useChildProfile } from '../context/ChildProfileContext';
import { formatChildAge } from '../utils/formatChildAge';

export default function Home() {
  const navigation = useNavigation<any>();
  const { activeChildId, activeChild, birthDates, openSwitcher } = useChildProfile();
  const activeAge = formatChildAge(birthDates[activeChildId]);

  return (
    <View style={styles.container}>

      <View style={styles.formatBg} pointerEvents="none">
        <HomeBg />
      </View>

      <ScrollView
        style={styles.bgContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.heroContainer}>

          <Pressable
            style={({ pressed }) => [styles.profileContainer, pressed && styles.profilePressed]}
            onPress={openSwitcher}
            accessibilityRole="button"
            accessibilityLabel={`Switch child profile, currently ${activeChild.name}`}
          >
            <ProfileContainer>
              <ChildProfileAvatar childId={activeChildId} size={34} />
            </ProfileContainer>
            <View style={styles.profileTextWrap}>
              <View style={styles.profileTopRow}>
                <Text style={styles.profileChildName} numberOfLines={1}>
                  {activeChild.name}
                </Text>
                <Text style={styles.profileChevron}>▾</Text>
              </View>
              {activeAge ? (
                <Text style={styles.profileChildMeta}>{activeAge}</Text>
              ) : (
                <Text style={styles.profileChildMetaMuted}>Add birth date</Text>
              )}
            </View>
          </Pressable>

          <View style={styles.iconContainer}>
            <Svg width={24} height={24} viewBox="0 0 27 27" fill="none">
              <Path
                d="M4 5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H8l-4 3V5z"
                stroke="#151515"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx={8} cy={10} r={1.2} fill="#151515" />
              <Circle cx={12} cy={10} r={1.2} fill="#151515" />
              <Circle cx={16} cy={10} r={1.2} fill="#151515" />
            </Svg>

            <Pressable onPress={() => navigation.navigate('NotificationCenter')}>
              <Svg width={24} height={24} viewBox="0 0 30 30" fill="none">
                <Path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zM18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                  stroke="#151515"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Settings')}>
              <Svg width={24} height={24} viewBox="0 0 29 29" fill="none">
                <Path
                  d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.07 7.07 0 0 0-1.7-.98l-.38-2.65a.5.5 0 0 0-.5-.42h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.63.26-1.21.59-1.7.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.23.4.32.64.22l2.49-1c.49.39 1.07.72 1.7.98l.38 2.65c.06.25.26.42.5.42h4c.24 0 .44-.17.5-.42l.38-2.65c.63-.26 1.21-.59 1.7-.98l2.49 1c.24.1.51.01.64-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65z"
                  stroke="#151515"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>

        </View>

        <View>

          <View style={{ marginBottom: 22 }}>
            <BeginCard childName={activeChild.name} />
          </View>

          <Pressable style={styles.row} onPress={() => navigation.navigate('PastScreenings')}>
            <Text style={styles.headerStyle}>Recent History</Text>
            <View style={styles.chevronWrapper}>
              <Svg height={24} width={24} viewBox="0 -960 960 960" fill="none">
                <Path d="M380-720 620-480 380-240 340-280 540-480 340-680Z" fill="#0b0c0c" />
              </Svg>
            </View>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('PastScreenings')}>
            <View style={styles.cardContainer}>
              <Card />
            </View>
          </Pressable>

          <View style={styles.row}>
            <Text style={styles.headerStyle}>Learn More</Text>
            <View style={styles.chevronWrapper}>
              <Svg height={24} width={24} viewBox="0 -960 960 960" fill="none">
                <Path d="M380-720 620-480 380-240 340-280 540-480 340-680Z" fill="#0d0e0d" />
              </Svg>
            </View>
          </View>

          <View style={styles.toolContainer}>

            <View style={styles.toolItem}>
              <ToolButton onPress={() => navigation.navigate('AboutUs')}>
                <View style={styles.toolBox}>
                  <Svg height={28} width={28} viewBox="0 -960 960 960" fill="none">
                    <Path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="#161B1A" />
                  </Svg>

                  <View>
                    <Text style={styles.toolText}>About Us</Text>
                    <Text style={styles.toolSubText}>Our Mission</Text>
                  </View>
                  </View>
                </ToolButton>
            </View>

            <View style={styles.toolItem}>
              <ToolButton onPress={() => navigation.navigate('FAQ')}>
                <View style={styles.toolBox}>
                  <Svg height={28} width={28} viewBox="0 -960 960 960" fill="none">
                    <Path d="M513.5-254.5Q528-269 528-290t-14.5-35.5Q499-340 478-340t-35.5 14.5Q428-311 428-290t14.5 35.5Q457-240 478-240t35.5-14.5ZM442-394h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="#161B1A" />
                  </Svg>

                  <View>
                    <Text style={styles.toolText}>Questions?</Text>
                    <Text style={styles.toolSubText}>Find Answers</Text>
                  </View>
                </View>
              </ToolButton>
            </View>

          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 38
  },

  formatBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  bgContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  heroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  headerStyle: {
    fontSize: 20,
    marginBottom: 12,
    letterSpacing: -0.2,
    fontWeight: '600',
    color: '#161B1A',
    fontFamily: 'NotoSans-SemiBold',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    gap: 8,
  },

  chevronWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  cardContainer: {
    marginTop: 12,
    zIndex: 20,
    marginBottom: 22,
  },

  toolContainer: {
    marginTop: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },

  toolItem: {
    flex: 1,
  },

  toolBox: {
    flexDirection: 'column',
    gap: 12,
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    flexShrink: 1,
  },

  profilePressed: {
    opacity: 0.85,
  },

  profileTextWrap: {
    flexDirection: 'column',
    flexShrink: 1,
  },

  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  profileChildName: {
    fontSize: 22,
    color: '#151515',
    fontFamily: 'NotoSans-SemiBold',
    lineHeight: 26,
    letterSpacing: -0.2,
    flexShrink: 1,
  },

  profileChildMeta: {
    fontSize: 14,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    marginTop: 2,
  },

  profileChildMetaMuted: {
    fontSize: 14,
    color: '#9aa3a3',
    fontFamily: 'NotoSans-Regular',
    fontStyle: 'italic',
    marginTop: 2,
  },

  profileChevron: {
    marginLeft: 8,
    color: '#49A3BD',
    fontSize: 14,
    fontWeight: '700',
  },

  toolText: {
    color: '#161B1A',
    fontSize: 16,
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: -0.2,
    marginBottom: 4,
    marginTop: 8,
  },

  toolSubText: {
    color: '#2E3332',
    fontSize: 14,
    fontFamily: 'NotoSans-Regular',
    lineHeight: 18,
  },

  faqStyles: {
    width: 60,
    height: 60,
  },

  infStyles: {
    width: 60,
    height: 60,
  },
});