import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Solution screen for specific troubleshooting issues

const solutions: { [key: number]: { title: string; steps: string[] } } = {
    1: {
        title: "Can't hear the instructions",
        steps: [
            "Check that your device volume is turned up",
            "Make sure your device is not on silent/mute mode",
            "Try using headphones or external speakers",
            "Restart the app and try again",
        ],
    },
    2: {
        title: "Screen frozen or not responding",
        steps: [
            "Wait a few seconds - the app may be loading",
            "Try tapping the screen gently",
            "Close the app completely and reopen it",
            "Restart your device if the issue persists",
        ],
    },
    3: {
        title: "Can't move to the next video",
        steps: [
            "Make sure you've completed the current video",
            "Wait for any video/audio to finish playing",
            "Check your internet connection",
            "Try refreshing or restarting the app",
        ],
    },
    4: {
        title: "Internet connection dropped",
        steps: [
            "Check your Wi-Fi or cellular connection",
            "Move closer to your router if using Wi-Fi",
            "Try switching between Wi-Fi and cellular data",
            "Your progress is saved - reconnect and continue",
        ],
    },
    
    5: {
        title: "Ran out of time",
        steps: [
            "Don't worry - your completed progress has been saved",
            "You can restart from where you left off",
            "Try to find a quieter time to complete the screening",
        ],
    },
    6: {
        title: "Something else",
        steps: [
            "Try restarting the app",
            "Check for app updates in your app store",
            "Make sure your device software is up to date",
            "Contact our support team for help",
        ],
    },
};

export default function TroubleshootingSolution() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    const issueId = route.params?.issueId || 7;
    const videoNumber = route.params?.videoNumber || 1;
    const solution = solutions[issueId] || solutions[7];

    const handleBackToScreening = () => {
        // Go back to the video screen at the same position
        navigation.navigate('VideoScreen', { videoNumber });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backArrow}>‹</Text>
                </Pressable>
                
                <Pressable 
                    style={styles.closeButton}
                    onPress={handleBackToScreening}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                </Pressable>
            </View>

            {/* Title */}
            <View style={styles.titleSection}>
                <Text style={styles.title}>{solution.title}</Text>
                <Text style={styles.subtitle}>Try these steps:</Text>
            </View>

            {/* Solution Steps */}
            <View style={styles.stepsSection}>
                {solution.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
            </View>

            {/* Bottom Buttons */}
            <View style={styles.buttonContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleBackToScreening}
                >
                    <Text style={styles.primaryButtonText}>Back to Screening</Text>
                </Pressable>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={() => {/* Contact support */}}
                >
                    <Text style={styles.secondaryButtonText}>Still need help? Contact us</Text>
                </Pressable>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backArrow: {
        fontSize: 28,
        color: '#666',
        fontWeight: '300',
        marginTop: -2,
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
        paddingTop: 30,
        paddingBottom: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 16,
        color: '#666',
    },

    stepsSection: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 10,
    },

    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },

    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#5fd4d4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    stepNumberText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },

    stepText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        paddingTop: 2,
    },

    buttonContainer: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },

    primaryButton: {
        backgroundColor: '#f0a090',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 15,
    },

    buttonPressed: {
        backgroundColor: '#e8958a',
    },

    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },

    secondaryButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },

    secondaryButtonText: {
        color: '#5fd4d4',
        fontSize: 16,
        fontWeight: '500',
    },
});


