import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Troubleshooting screen with list of common issues

const troubleshootingOptions = [
    { id: 1, label: "I can't hear the sound" },
    { id: 2, label: "The screen is frozen or not responding" },
    { id: 3, label: "I can't move to the next video" },
    { id: 4, label: "My internet connection dropped" },
    { id: 5, label: "Ran out of time" },
    { id: 6, label: "Something else" },
];

export default function TroubleshootingScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    // Get the video number from params to preserve user's position
    const videoNumber = route.params?.videoNumber || 1;

    const handleOptionPress = (option: typeof troubleshootingOptions[0]) => {
        // Navigate to solution screen, passing the video number
        navigation.navigate('TroubleshootingSolution', { 
            issueId: option.id,
            issueLabel: option.label,
            videoNumber: videoNumber
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                </Pressable>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
                <Text style={styles.title}>🛠 Troubleshooting</Text>
                <Text style={styles.subtitle}>
                    We'll help you get back on track.{'\n'}
                    Your progress is saved.
                </Text>
            </View>

            {/* Options Section */}
            <View style={styles.optionsSection}>
                <Text style={styles.sectionTitle}>What's going wrong?</Text>
                
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                    {troubleshootingOptions.map((option) => (
                        <Pressable
                            key={option.id}
                            style={({ pressed }) => [
                                styles.optionItem,
                                pressed && styles.optionItemPressed
                            ]}
                            onPress={() => handleOptionPress(option)}
                        >
                            <View style={styles.radioCircle} />
                            <Text style={styles.optionLabel}>{option.label}</Text>
                            <Text style={styles.optionArrow}>›</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeIcon: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
    },

    titleSection: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 30,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },

    optionsSection: {
        flex: 1,
        paddingHorizontal: 25,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },

    optionsList: {
        flex: 1,
    },

    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    optionItemPressed: {
        backgroundColor: '#e8e8e8',
    },

    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 14,
    },

    optionLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },

    optionArrow: {
        fontSize: 24,
        color: '#999',
        fontWeight: '300',
    },
});


