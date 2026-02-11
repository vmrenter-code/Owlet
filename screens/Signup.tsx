import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'

export default function Signup() {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Create Account</Text>
                <Text style={styles.subtitleStyle}>Fill your information below.</Text>
            </View>

            <View style={styles.divider}>
                <View>
                    <Text style={styles.text}>Username</Text>
                    <InputFields placeholder="Username" />
                </View>

                <View>
                    <Text style={styles.text}>Email</Text>
                    <InputFields placeholder="Email" />
                </View>

                <View>
                    <Text style={styles.text}>Password</Text>
                    <InputFields placeholder="Password" />
                </View>

                <View>
                    <Text style={styles.text}>Confirm Password</Text>
                    <InputFields placeholder="Confirm Password" />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryBlueButton>Create Account</PrimaryBlueButton>
            </View>

            <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
            </View>

            <Pressable style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.9, transform: [{ scale: 1.02 }] }]}>
                <Image 
                    source={{ uri: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }} 
                    style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>
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
        gap: 3
    },

    divider: {
        gap: 20,
        marginTop: '7%'
    },

    buttonContainer: {
        marginTop: '10%'
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
        backgroundColor: '#d0d0d0'
    },

    orText: {
        fontSize: 14,
        color: '#888888'
    },

    googleButton: {
        marginTop: '6%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 100,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        gap: 10
    },

    googleIcon: {
        width: 20,
        height: 20
    },

    googleButtonText: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500'
    },

    text: {
        marginBottom: '2%',
        paddingLeft: 3
    }
});
