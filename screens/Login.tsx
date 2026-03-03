import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import InputFields from '../components/InputFields'
import PrimaryWhiteButton from '../components/PrimaryWhiteButton'
import GoogleButton from '../components/GoogleButton'
import HomeBg from '../components/HomeBg';

export default function Login() {
    const navigation = useNavigation<any>();

    return (

        <View style={{ flex: 1 }}>

            <View style={styles.formatBg}>
                <HomeBg />
            </View>

            <View style={styles.container}>

                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleStyle}>Login</Text>
                        <Text style={styles.subtitleStyle}>Your space for early insights.</Text>
                    </View>

                    <View style={styles.divider}>
                        <View>
                            <InputFields placeholder="Username"></InputFields>
                        </View>

                        <View>
                            <InputFields placeholder="Password"></InputFields>
                        </View>
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
                        <GoogleButton></GoogleButton>
                    </View>
                </View>

                
                <View style={styles.bottomSection}>
                    <View style = {{width: '100%'}} >
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: '14%',
        justifyContent: 'space-between',
    },

    titleStyle: {
        fontSize: 28,
        fontWeight: 600,
        color: '#151515',
        textAlign: 'center'
    },

    subtitleStyle: {
        fontSize: 17,
        color: '#0B0B0B',
        textAlign: 'center'
    },

    linkStyle: {
        color: '#303030',
        fontSize: 15,
    },

    titleContainer: {
        gap: 3
    },

    divider: {
        gap: 14,
        marginTop: '9%'
    },

    linkContainer: {
        marginTop: '6%',
        alignItems: 'flex-end'
    },

    orContainer: {
        marginTop: '8%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15
    },

    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#0B0B0B'
    },

    orText: {
        fontSize: 17,
        color: '#000000'
    },

    formatBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },

    googleContainer: {
        marginTop: 16
    },

    bottomSection: {
        alignItems: 'center',
        gap: 20,
        paddingBottom: 0,
    },

    createText: {
        fontSize: 15,
        color: '#0B0B0B',
    }
});