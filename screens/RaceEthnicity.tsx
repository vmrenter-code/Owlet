import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChildProfile } from '../context/ChildProfileContext';
import HomeBg from '../components/HomeBg';
import BackArrow from '../components/BackArrow';

/**
 * Combined race & ethnicity categories (single choice).
 */
const OPTIONS: string[] = [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Middle Eastern or North African',
    'Native Hawaiian or Pacific Islander',
    'White',
    'Some other race or ethnicity',
    'Prefer not to say',
];

const STORAGE_KEY_PREFIX = 'raceEthnicity:';

type StoredValue = {
    selections: string[];
};

/** Backwards-compatible loader that also accepts the old { races, ethnicity } shape. */
function parseStored(raw: string | null): string[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as Partial<StoredValue> & {
            races?: string[];
            ethnicity?: string | null;
        };
        if (Array.isArray(parsed.selections)) {
            return parsed.selections;
        }
        const merged = new Set<string>();
        if (Array.isArray(parsed.races)) parsed.races.forEach((r) => merged.add(r));
        if (parsed.ethnicity && parsed.ethnicity !== 'Not Hispanic or Latino') {
            merged.add(parsed.ethnicity);
        }
        return Array.from(merged);
    } catch {
        return [];
    }
}

/** If legacy data had multiple picks, keep one deterministic choice (first listed option that was selected). */
function normalizeToSingle(selections: string[]): string[] {
    if (selections.length <= 1) return selections;
    for (const opt of OPTIONS) {
        if (selections.includes(opt)) return [opt];
    }
    return selections[0] ? [selections[0]] : [];
}

export default function RaceEthnicity() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { activeChildId, activeChild } = useChildProfile();

    const [selections, setSelections] = useState<string[]>([]);
    const storageKey = STORAGE_KEY_PREFIX + activeChildId;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(storageKey);
                if (cancelled) return;
                const loaded = parseStored(raw);
                const normalized = normalizeToSingle(loaded);
                setSelections(normalized);
                if (
                    normalized.length !== loaded.length ||
                    (normalized[0] && loaded[0] !== normalized[0])
                ) {
                    try {
                        await AsyncStorage.setItem(
                            storageKey,
                            JSON.stringify({ selections: normalized }),
                        );
                    } catch {
                        // Non-fatal
                    }
                }
            } catch {
                // Ignore: keep defaults
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [storageKey]);

    const persist = useCallback(
        async (next: string[]) => {
            try {
                const value: StoredValue = { selections: next };
                await AsyncStorage.setItem(storageKey, JSON.stringify(value));
            } catch {
                // Non-fatal
            }
        },
        [storageKey],
    );

    const selectOption = (option: string) => {
        const next = selections.includes(option) ? [] : [option];
        setSelections(next);
        persist(next);
    };

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <BackArrow />

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
                ]}
            >
                <Text style={styles.title}>Race & Ethnicity</Text>
                <Text style={styles.subtitle}>For {activeChild.name}</Text>
                <View style={styles.section}>
                    {OPTIONS.map((option, index) => {
                        const selected = selections.includes(option);
                        const isLast = index === OPTIONS.length - 1;
                        return (
                            <Pressable
                                key={option}
                                onPress={() => selectOption(option)}
                                style={({ pressed }) => [
                                    styles.row,
                                    isLast && styles.lastItem,
                                    pressed && styles.rowPressed,
                                ]}
                            >
                                <Text style={styles.rowLabel}>{option}</Text>
                                {selected ? <Text style={styles.checkmark}>✓</Text> : null}
                            </Pressable>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },

    scroll: {
        flex: 1,
        zIndex: 1,
    },

    title: {
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.3,
        paddingHorizontal: 20,
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        paddingHorizontal: 20,
        marginBottom: 20,
        lineHeight: 20,
    },

    scrollContent: {
        paddingHorizontal: 0,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    rowPressed: {
        backgroundColor: 'rgba(80, 88, 180, 0.06)',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    rowLabel: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        marginRight: 12,
    },

    checkmark: {
        fontSize: 16,
        fontFamily: 'NotoSans-SemiBold',
        color: '#5058b4',
    },
});
