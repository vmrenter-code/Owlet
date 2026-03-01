import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { userAuthServices } from '../src/services/userAuthServices';
import InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import GoogleButton from '../components/GoogleButton'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const user = await userAuthServices.login(email, password);
            if (user) {
                Alert.alert('Success', 'Logged in!');
                // Navigation to home screen will be here once it's created
            }
        } catch (error: any) {
            let message = 'Login failed.';
            if (error.code === 'auth/user-not-found') {
                message = 'User not found.';
            } else if (error.code === 'auth/wrong-password') {
                message = 'Incorrect password.';
            }
            Alert.alert('Error', message);
        }
        setLoading(false);
    };

    return (
        <View style = { styles.container}>
            <View style = { styles.titleContainer}>
                <Text style = { styles.titleStyle}>Login</Text>
                <Text style = { styles.subtitleStyle }>Welcome back.</Text>
            </View>
                       

            <View style = { styles.divider }>
                <View>
                    <Text style = { styles.text }>Email</Text>
                    <InputFields 
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                
                <View>
                    <Text style = { styles.text }>Password</Text>
                    <InputFields 
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>
            </View>

            <View style = {styles.linkContainer}>
                <Text style = { styles.linkStyle }>Forgot Password?</Text>
            </View>

            <View style = { styles.buttonContainer }>
                <PrimaryBlueButton onPress={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </PrimaryBlueButton>
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

    linkStyle: {
        color: '#3ab0d1',
        fontSize: 13
    },

    titleContainer:{
        gap: 3
    },

    divider: {
        gap: 30,
        marginTop: '9%'
    },

    buttonContainer: {
        marginTop: '10%'
    },
    
    linkContainer:{
        marginTop: '5%',
        alignItems: 'flex-end'
    },

   orContainer: {
        marginTop: '8%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15
    },

    text: {
        marginBottom: '2%',
        paddingLeft: 3
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


});