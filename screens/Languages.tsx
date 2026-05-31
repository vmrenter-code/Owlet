import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import HomeBg from '../components/HomeBg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import { getAuth } from 'firebase/auth';

export default function Languages() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const languages = ['English', 'Spanish', 'Chinese', 'Vietnamese', 'Korean', 'Japanese'];
    const BASE_URL = 'http://localhost:4000';

    // Load user's selected language from backend
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const user = getAuth().currentUser;
                if (!user) return;
                const token = await user.getIdToken();

                const res = await fetch(`${BASE_URL}/settings/language`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                console.log("Loaded language:", data.language);
                if (data.language) {
                    setSelectedLanguage(data.language);
                }

            } catch (err) {
                console.error('Failed to load language:', err);
            }
        };

        loadLanguage();
    }, []);

    // Update language selection in backend when user changes it
    const updateLanguage = async (language: string) => {
        try {
            setSelectedLanguage(language);
            const user = getAuth().currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            await fetch(`${BASE_URL}/settings/language`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language }),
            });

        } catch (err) {
            console.error('Failed to update language:', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <BackArrow />

            <View style={styles.content}>
                <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Languages</Text>

                <View style={styles.section}>
                <View style={styles.selectedItem}>
                    <Text style={styles.itemLabel}>Selected Language</Text>
                    <Text style={styles.itemValue}>{selectedLanguage}</Text>
                </View>
            </View>

            {/* Language Options */}
            <View style={styles.section}>
                {languages.map((language) => (
                    <Pressable
                        key={language}
                        onPress={() => updateLanguage(language)}
                        style={({ pressed }) => [
                            styles.languageItem,
                            pressed && styles.languageItemPressed
                        ]}
                    >
                        <Text style={styles.languageLabel}>
                            {language}
                        </Text>

                        {selectedLanguage === language && (
                            <Text style={styles.checkmark}>✓</Text>
                        )}
                    </Pressable>
                ))}
                </View>
            </View>
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
    content: {
        flex: 1,
        zIndex: 1,
    },


    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    backArrow: {
        fontSize: 24,
        color: '#333',
    },

    title: {
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.3,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },

    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    itemLabel: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
    },

    itemValue: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#5058b4',
    },

    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    languageItemPressed: {
        backgroundColor: 'rgba(80, 88, 180, 0.06)',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    languageLabel: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
    },

    checkmark: {
        fontSize: 16,
        fontFamily: 'NotoSans-SemiBold',
        color: '#5058b4',
    },
});
