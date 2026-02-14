import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { userAuthServices } from '../src/services/userAuthServices';
import { useState } from 'react';
import InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import GoogleButton from '../components/GoogleButton'

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSignUp = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = await userAuthServices.register(username, email, password);
        if (result.success) {
            Alert.alert('Success', 'Account created!');
            // home navigation will be here once its created. 
        } else {
            Alert.alert('Error', result.error ?? 'Something went wrong.');
        }
        setLoading(false);
    };
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Create Account</Text>
                <Text style={styles.subtitleStyle}>Fill your information below.</Text>
            </View>

            <View style={styles.divider}>
                <View>
                    <Text style={styles.text}>Username</Text>
                    <InputFields
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"/>
               </View>

                <View>
                    <Text style={styles.text}>Email</Text>
                    <InputFields
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"/>
                </View>

                <View>
                    <Text style={styles.text}>Password</Text>
                    <InputFields
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}/>
                </View>

                <View>
                    <Text style={styles.text}>Confirm Password</Text>
                    <InputFields
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}/>               
                    </View>
               </View>

            <View style={styles.buttonContainer}>
                <PrimaryBlueButton onPress={handleSignUp}>Create Account</PrimaryBlueButton>
            </View>

            <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
            </View>

            <GoogleButton></GoogleButton>
            
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

    text: {
        marginBottom: '2%',
        paddingLeft: 3
    }
});
