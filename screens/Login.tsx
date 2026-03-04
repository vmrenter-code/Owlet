import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import InputFields from '../components/InputFields';
import PrimaryWhiteButton from '../components/PrimaryWhiteButton';
import GoogleButton from '../components/GoogleButton';
import HomeBg from '../components/HomeBg';

import { Svg, Path } from 'react-native-svg';

const UserIcon = ({ width = 20, height = 20, color = "#585858" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 22c0-4 14-4 14 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LockIcon = ({ width = 20, height = 20, color = "#585858" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M6 11h12v9H6v-9z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11V7a3 3 0 0 1 6 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill={color}/>
  </Svg>
);

export default function Login() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.formatBg}>
        <HomeBg />
      </View>

      <View style={styles.container}>
        <View style={styles.centerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>Login</Text>
            <Text style={styles.subtitleStyle}>Your space for early insights.</Text>
          </View>

          <View style={styles.divider}>
            <InputFields
              placeholder="Username"
              icon={<UserIcon width={20} height={20} />}
            />

            <InputFields
              placeholder="Password"
              icon={<LockIcon width={20} height={20} />}
            />
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkStyle}>Forgot Password?</Text>
          </View>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or login with</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.googleContainer}>
            <GoogleButton />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={{ width: '100%' }}>
            <PrimaryWhiteButton onPress={() => navigation.replace('Home')}>
              Login
            </PrimaryWhiteButton>
          </View>

          <Text style={styles.createText}>
            Need an account? <Text style={{ fontWeight: '500' }}>Create one</Text>
          </Text>
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
    fontWeight: 600,
    color: '#151515',
    textAlign: 'center',
    fontFamily: 'Roboto'
  },

  subtitleStyle: {
    fontSize: 17,
    color: '#0B0B0B',
    textAlign: 'center',
    fontFamily: 'Roboto'

  },

  titleContainer: {
    gap: 3,
  },

  divider: {
    gap: 10,
    marginTop: '9%',
  },

  linkContainer: {
    marginTop: '4%',
    alignItems: 'flex-end',
  },

  linkStyle: {
    color: '#303030',
    fontSize: 15,
    fontFamily: 'Roboto'

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
    fontSize: 17,
    color: '#303030',
    fontFamily: 'Roboto'

  },

  googleContainer: {
    marginTop: 12,
  },

  bottomSection: {
    alignItems: 'center',
    gap: 20,
    paddingBottom: 0,
  },

  createText: {
    fontSize: 15,
    color: '#0B0B0B',
    fontFamily: 'Roboto'

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