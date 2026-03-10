import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { userAuthServices } from '../src/services/userAuthServices';
import InputFields from '../components/InputFields';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import HomeBg from '../components/HomeBg';
import { Svg, Path, Rect } from 'react-native-svg';

const MailIcon = ({ width = 20, height = 20, color = '#585858' }) => (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
        <Rect x={4} y={6} width={16} height={12} rx={2} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 6l8 6 8-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function ForgotPassword() {
        const navigation = useNavigation<any>();
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
        <View style={{ flex: 1 }}>
            <View style={styles.formatBg}>
                <HomeBg />
            </View>

            <View style={styles.container}>
                <View style={styles.centerSection}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleStyle}>Reset Password</Text>
                        <Text style={styles.subtitleStyle}>Enter your email to receive a reset link.</Text>
                    </View>

                    <View style={styles.divider}>
                        <InputFields
                            placeholder="Enter your email"
                            icon={<MailIcon width={20} height={20} />}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="done"
                            onSubmitEditing={handleSendReset}
                        />
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <View style={{ width: '100%' }}>
                        <PrimaryBlueButton onPress={handleSendReset} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Email'}
                        </PrimaryBlueButton>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.createText}>
                            Remembered your password? <Text style={{ fontFamily: 'NotoSans-SemiBold' }}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },

    centerSection: {
        flex: 1,
        justifyContent: 'center',
    },

    titleStyle: {
        fontSize: 28,
        color: '#151515',
        textAlign: 'center',
        fontFamily: 'NotoSans-SemiBold',
    },

    subtitleStyle: {
        fontSize: 17,
        color: '#2E3332',
        textAlign: 'center',
        fontFamily: 'NotoSans-Regular',
    },

    titleContainer: {
        gap: 3,
    },

    divider: {
        gap: 10,
        marginTop: '9%',
    },

    bottomSection: {
        alignItems: 'center',
        gap: 20,
        paddingBottom: 16,
    },

    createText: {
        fontSize: 15,
        color: '#0B0B0B',
        fontFamily: 'NotoSans-Regular',
    },

    formatBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
});
