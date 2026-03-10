import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function Languages() {
    const navigation = useNavigation<any>();
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const languages = ['English', 'Spanish', 'Chinese', 'Vietnamese', 'Korean', 'Japanese'];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
            </View>

            {/* Title */}
            <Text style={styles.title}>Languages</Text>

            {/* Selected Language Display */}
            <View style={styles.section}>
                <View style={styles.selectedItem}>
                    <Text style={styles.itemLabel}>Selected Language</Text>
                    <Text style={styles.itemValue}>{selectedLanguage}</Text>
                </View>
            </View>

            {/* Language Options */}
            <View style={styles.section}>
                {languages.map((language, index) => (
                    <Pressable 
                        key={language}
                        style={({ pressed }) => [
                            styles.languageItem, 
                            index === languages.length - 1 && styles.lastItem,
                            pressed && styles.languageItemPressed
                        ]}
                        onPress={() => setSelectedLanguage(language)}
                    >
                        <Text style={styles.languageLabel}>{language}</Text>
                        {selectedLanguage === language && (
                            <Text style={styles.checkmark}>✓</Text>
                        )}
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    gradient: {
        ...StyleSheet.absoluteFillObject,
    },

    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },

    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    itemLabel: {
        fontSize: 16,
        color: '#333',
    },

    itemValue: {
        fontSize: 16,
        color: '#8BC0CF',
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
        backgroundColor: '#f8f8f8',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    languageLabel: {
        fontSize: 16,
        color: '#333',
    },

    checkmark: {
        fontSize: 18,
        color: '#8BC0CF',
        fontWeight: '600',
    },
});
