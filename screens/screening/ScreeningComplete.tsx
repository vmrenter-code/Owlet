import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Success screen shown after all videos are uploaded

export default function ScreeningComplete() {
    const navigation = useNavigation<any>();

    const handleOk = () => {
        navigation.navigate('MainTabs');
    };

    return (
        <View style={styles.container}>
            {/* Checkmark circle */}
            <View style={styles.checkmarkContainer}>
                <View style={styles.checkmarkCircle}>
                    <Text style={styles.checkmark}>✓</Text>
                </View>
            </View>

            {/* Success message */}
            <Text style={styles.successText}>
                You have successfully uploaded your screening!
            </Text>

            {/* What's next info */}
            <View style={styles.nextInfoContainer}>
                <Text style={styles.nextInfoText}>
                    What's next:{'\n'}
                    you will be able to access your results on the home page
                </Text>

                {/* OK button */}
                <Pressable 
                    style={({ pressed }) => [
                        styles.okButton,
                        pressed && styles.okButtonPressed
                    ]}
                    onPress={handleOk}
                >
                    <Text style={styles.okButtonText}>OK</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7FB8C9',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    checkmarkContainer: {
        marginBottom: 40,
    },

    checkmarkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkmark: {
        fontSize: 50,
        color: '#7FB8C9',
        fontWeight: '300',
    },

    successText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 42,
        marginBottom: 60,
    },

    nextInfoContainer: {
        position: 'absolute',
        bottom: 80,
        left: 30,
        right: 30,
    },

    nextInfoText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '600',
    },

    okButton: {
        backgroundColor: '#f0a090',
        paddingVertical: 15,
        paddingHorizontal: 80,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    okButtonPressed: {
        backgroundColor: '#e8958a',
        transform: [{ scale: 0.98 }],
    },

    okButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
});

