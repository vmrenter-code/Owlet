import { View, Text, StyleSheet, Alert, Pressable, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InputFields from '../components/InputFields';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import GoogleButton from '../components/GoogleButton';
import HomeBg from '../components/HomeBg';
import userAuthServices from '../src/services/userAuthServices';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import { Svg, Path, Rect } from 'react-native-svg';
import { TextInputProps } from 'react-native';
import WelcomeBackArrow from '../components/WelcomeBackArrow';

const UserIcon = ({ width = 20, height = 20, color = '#aaa' }) => (
  <Svg width={width} height={height} viewBox="0 0 23 23" fill="none">
    <Path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 22c0-4 14-4 14 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon = ({ width = 20, height = 20, color = '#aaa' }) => (
  <Svg width={width} height={height} viewBox="0 0 23 23" fill="none">
    <Rect x={6} y={11} width={12} height={9} rx={2} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 11V7a3 3 0 0 1 6 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill={color} />
  </Svg>
);




export default function Login() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await userAuthServices.login(email, password);
    } catch (error: any) {
      let message = 'Login failed';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Please enter a valid email address';
          break;
        case 'auth/user-not-found':
          message = 'No user found with this email';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid email or password';
          break;
      }
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleCreateAccount = () => {
    navigation.navigate('Signup');
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '398374460192-ln7hlk3h862ks0a7hl6hcmmbcim7rfhf.apps.googleusercontent.com',
      iosClientId: '398374460192-q5umdtk9qkcueu62fhg859v44kr6jate.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    await GoogleSignin.signOut();
    const signInResult = await GoogleSignin.signIn();

    const idToken = signInResult.data?.idToken ?? (signInResult as any).idToken;
    
    if (!idToken) throw new Error('No ID token found');

    const googleCredential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, googleCredential);

    navigation.replace('MainTabs');
  } catch (error) {
    console.error('Google Sign-In error:', error);
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={styles.formatBg} pointerEvents="none">
          <HomeBg />
        </View>

        <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
          <WelcomeBackArrow />

          <View style={styles.centerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>Login</Text>
              <Text style={styles.subtitleStyle}>Your space for early insights.</Text>
            </View>

            <View style={styles.divider}>
              <InputFields
                placeholder="Username"
                icon={<UserIcon width={20} height={20} />}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <InputFields
                placeholder="Password"
                icon={<LockIcon width={20} height={20} />}
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <View style={styles.linkContainer}>
              <Pressable
                onPress={handleForgotPassword}
                accessibilityRole="link"
                accessibilityLabel="Forgot password"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.linkStyle}>Forgot Password?</Text>
              </Pressable>
            </View>

            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or login with</Text>
              <View style={styles.orLine} />
            </View>

            <View style={styles.googleContainer}>
              <GoogleButton onPress={handleGoogleSignIn} />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={{ width: '100%' }}>
              <PrimaryBlueButton onPress={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </PrimaryBlueButton>
            </View>

            <Pressable
              onPress={handleCreateAccount}
              accessibilityRole="link"
              accessibilityLabel="Need an account, create one"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.createText}>
                Need an account? <Text style={styles.createTextLink}>Create one</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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

  linkContainer: {
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'flex-end',
  },

  linkStyle: {
    color: '#5058b4',
    fontSize: 13,
    fontFamily: 'NotoSans-Regular',
  },

  orContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2E3332',
  },

  orText: {
    fontSize: 13,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
  },

  googleContainer: {
    marginTop: 12,
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