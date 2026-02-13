import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import GoogleButton from '../components/GoogleButton'

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

            <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
            </View>

            <GoogleButton></GoogleButton>

            <View style={styles.buttonContainer}>
                <PrimaryBlueButton>Create Account</PrimaryBlueButton>
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
        fontWeight: 400
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
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: 30
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

    text: {
        marginBottom: '2%',
        paddingLeft: 3
    }
});
