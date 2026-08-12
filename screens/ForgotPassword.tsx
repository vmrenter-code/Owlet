import { View, Text, StyleSheet, Pressable } from 'react-native';
import { showAlert } from '../src/utils/showAlert';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userAuthServices } from '../src/services/userAuthServices';
import InputFields from '../components/InputFields';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import HomeBg from '../components/HomeBg';
import BackArrow from '../components/BackArrow';
import { Svg, Path, Rect } from 'react-native-svg';

const MailIcon = ({ width = 20, height = 20, color = '#aaa' }) => (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
        <Rect x={4} y={6} width={16} height={12} rx={2} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 6l8 6 8-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function ForgotPassword() {
        const navigation = useNavigation<any>();
        const insets = useSafeAreaInsets();
        const [email, setEmail] = useState('');
        const [loading, setLoading] = useState(false);

    const handleSendReset = async () => {
        if (!email) {
            showAlert('Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        const result = await userAuthServices.resetPassword(email);
        
        if (result.success) {
            showAlert('Success', 'If this email exists, we sent a password reset link.');
            setEmail('');
        } else {
            showAlert('Error', result.error ?? 'Failed to send reset email.');
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formatBg} pointerEvents="none">
                <HomeBg />
            </View>

            <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
                <BackArrow />

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

                    <Pressable
                        onPress={() => navigation.navigate('Login')}
                        accessibilityRole="link"
                        accessibilityLabel="Remembered your password, sign in"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.createText}>
                            Remembered your password? <Text style={styles.createTextLink}>Sign in</Text>
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    centerSection: {
        flex: 1,
        justifyContent: 'center',
    },

    titleStyle: {
        fontSize: 22,
        color: '#151515',
        textAlign: 'center',
        fontFamily: 'NotoSans-SemiBold',
        letterSpacing: -0.2,
    },

    subtitleStyle: {
        fontSize: 15,
        color: '#2E3332',
        textAlign: 'center',
        fontFamily: 'NotoSans-Regular',
        marginTop: 6,
        lineHeight: 21,
    },

    titleContainer: {
        gap: 3,
    },

    divider: {
        gap: 12,
        marginTop: 28,
    },

    bottomSection: {
        alignItems: 'center',
        gap: 12,
        paddingBottom: 16,
    },

    createText: {
        fontSize: 15,
        color: '#2E3332',
        fontFamily: 'NotoSans-Regular',
    },

    createTextLink: {
        fontFamily: 'NotoSans-SemiBold',
        color: '#5058b4',
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