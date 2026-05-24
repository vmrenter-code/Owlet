import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import userAuthServices from '../src/services/userAuthServices';
import { useRef, useState } from 'react';
import InputFields from '../components/InputFields';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import GoogleButton from '../components/GoogleButton';
import HomeBg from '../components/HomeBg';
import BackArrow from '../components/BackArrow';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import { Svg, Path, Rect, Circle } from 'react-native-svg';

const UserIcon = ({ width = 20, height = 20, color = '#585858' }) => (
    <Svg width={width} height={height} viewBox="0 0 23 23" fill="none">
        <Path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 22c0-4 14-4 14 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const LockIcon = ({ width = 20, height = 20, color = '#585858' }) => (
    <Svg width={width} height={height} viewBox="0 0 23 23" fill="none">
        <Rect x={6} y={11} width={12} height={9} rx={2} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 11V7a3 3 0 0 1 6 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill={color} />
    </Svg>
);

const MailIcon = ({ width = 20, height = 20, color = '#585858' }) => (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
        <Rect x={4} y={6} width={16} height={12} rx={2} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 6l8 6 8-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CheckCircleIcon = ({ width = 20, height = 20, color = '#585858' }) => (
    <Svg width={width} height={height} viewBox="0 0 26 26" fill="none">
        <Path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PasswordStatusIcon = ({ status }: { status: 'met' | 'pending' | 'unmet' }) => {
    const strokeColor = status === 'met' ? '#2E9F5E' : status === 'unmet' ? '#D06868' : '#B9BDBD';
    const fillColor = status === 'met' ? '#2E9F5E' : 'none';

    return (
        <Svg width={20} height={20} viewBox="0 0 26 26" fill="none">
            <Circle cx={13} cy={13} r={10} fill={fillColor} stroke={strokeColor} strokeWidth={2} />
            {status === 'met' ? (
                <Path d="M8.5 13.2l3.1 3.1 6-6.4" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
                <Path d="M13 8.5v5.2" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            )}
        </Svg>
    );
};

export default function Signup() {
    const navigation = useNavigation<any>();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const confirmPasswordRef = useRef<any>(null);

    const passwordLengthStatus = password.length >= 6 ? 'met' : 'unmet';
    const passwordMatchStatus = confirmPassword.length === 0 ? 'pending' : password === confirmPassword ? 'met' : 'unmet';
    const showPasswordRequirements = isPasswordFocused && password.length > 0;
    const passwordRequirements = [
        { label: 'At least 6 characters', status: passwordLengthStatus },
    ] as const;

    const handleSignUp = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = await userAuthServices.register(username, email, password);
        if (result.success) {
            navigation.navigate('Home');
        } else {
            Alert.alert('Error', result.error ?? 'Something went wrong.');
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            await GoogleSignin.signOut();
            const signInResult = await GoogleSignin.signIn();
            const idToken = signInResult.data?.idToken ?? (signInResult as any).idToken;
            if (!idToken) throw new Error('No ID token found');
            const googleCredential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, googleCredential);
            navigation.replace('AboutYourChild');
        } catch (error) {
            console.error('Google Sign-In error:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formatBg} pointerEvents="none">
                <HomeBg />
            </View>

            <View style={styles.container}>
                    <BackArrow />
                    <View style={styles.centerSection}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleStyle}>Create Your Account</Text>
                            <Text style={styles.subtitleStyle}>Set up your account to begin.</Text>
                        </View>

                        <View style={styles.divider}>
                            <InputFields
                                placeholder="Create a unique username"
                                icon={<UserIcon width={20} height={20} />}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />

                            <InputFields
                                placeholder="Enter your email"
                                icon={<MailIcon width={20} height={20} />}
                                ref={emailRef}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />

                            <View style={styles.passwordFieldWrapper}>
                                {showPasswordRequirements && (
                                    <View style={styles.passwordHelpCardOverlay}>
                                        <Text style={styles.passwordHelpTitle}>Password requirements</Text>
                                        <View style={styles.passwordHelpList}>
                                            {passwordRequirements.map((item) => (
                                                <View key={item.label} style={styles.passwordHelpRow}>
                                                    <PasswordStatusIcon status={item.status} />
                                                    <Text style={[styles.passwordHelpText, item.status === 'met' && styles.passwordHelpTextMet, item.status === 'unmet' && styles.passwordHelpTextUnmet]}>
                                                        {item.label}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                <InputFields
                                    placeholder="Create your password"
                                    icon={<LockIcon width={20} height={20} />}
                                    ref={passwordRef}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    secureTextEntry
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                />
                            </View>

                            <InputFields
                                placeholder="Confirm your password"
                                icon={<CheckCircleIcon width={20} height={20} color={passwordMatchStatus === 'met' ? '#2E9F5E' : passwordMatchStatus === 'unmet' ? '#D06868' : '#585858'} />}
                                ref={confirmPasswordRef}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                onBlur={() => setIsPasswordFocused(false)}
                                secureTextEntry
                                returnKeyType="done"
                                onSubmitEditing={handleSignUp}
                            />
                        </View>

                        <View style={styles.linkContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.linkStyle}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.orContainer}>
                            <View style={styles.orLine} />
                            <Text style={styles.orText}>or continue with</Text>
                            <View style={styles.orLine} />
                        </View>

                        <View style={styles.googleContainer}>
                            <GoogleButton onPress={handleGoogleSignIn} />
                        </View>
                    </View>

                    <View style={styles.bottomSection}>
                        <View style={{ width: '100%' }}>
                            <PrimaryBlueButton onPress={handleSignUp} disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </PrimaryBlueButton>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.createText}>
                                Have an account? <Text style={{ fontFamily: 'NotoSans-SemiBold' }}>Sign in</Text>
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
        position: 'relative',
        zIndex: 1,
    },
    passwordFieldWrapper: {
        position: 'relative',
        overflow: 'visible',
        zIndex: 2,
    },
    passwordHelpCardOverlay: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        marginBottom: 8,
        zIndex: 25,
        backgroundColor: '#F7FBFA',
        borderColor: '#DDE7E6',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    passwordHelpTitle: {
        fontSize: 13,
        color: '#1F2423',
        fontFamily: 'NotoSans-SemiBold',
    },
    passwordHelpList: {
        gap: 6,
    },
    passwordHelpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    passwordHelpText: {
        flex: 1,
        fontSize: 13,
        color: '#5F6665',
        fontFamily: 'NotoSans-Regular',
    },
    passwordHelpTextMet: {
        color: '#2E9F5E',
    },
    passwordHelpTextUnmet: {
        color: '#D06868',
    },
    linkContainer: {
        marginTop: '4%',
        marginBottom: '3%',
        alignItems: 'flex-end',
    },
    linkStyle: {
        color: '#303030',
        fontSize: 15,
        fontFamily: 'NotoSans-Regular',
    },
    orContainer: {
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#303030',
    },
    orText: {
        fontSize: 15,
        color: '#303030',
        fontFamily: 'NotoSans-Regular',
    },
    googleContainer: {
        marginTop: 12,
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