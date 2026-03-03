import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { userAuthServices } from '../src/services/userAuthServices';
import InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        const result = await userAuthServices.resetPassword(email);
        
        if (result.success) {
            Alert.alert('Success', 'If this email exists, we sent a password reset link.');
            setEmail('');
        } else {
            Alert.alert('Error', result.error ?? 'Failed to send reset email.');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Reset Password</Text>
                <Text style={styles.subtitleStyle}>Enter your email to receive a reset link.</Text>
            </View>

            <View style={styles.divider}>
                <View>
                    <Text style={styles.text}>Email</Text>
                    <InputFields 
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryBlueButton onPress={handleSendReset} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Email'}
                </PrimaryBlueButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#ffffff'
    },

    titleStyle: {
        fontSize: 30,
        fontWeight: 'bold'
    },

    subtitleStyle: {
        fontSize: 15,
        color: '#555555'
    },

    titleContainer: {
        gap: 3,
        marginTop: '10%'
    },

    divider: {
        gap: 30,
        marginTop: '12%'
    },

    buttonContainer: {
        marginTop: '15%'
    },

    text: {
        marginBottom: '2%',
        paddingLeft: 3
    }
});
