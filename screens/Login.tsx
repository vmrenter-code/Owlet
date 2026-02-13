import { View, Text, StyleSheet } from 'react-native';

import  InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import GoogleButton from '../components/GoogleButton'

export default function Login() {
    return (
        <View style = { styles.container}>
            <View style = { styles.titleContainer}>
                <Text style = { styles.titleStyle}>Login</Text>
                <Text style = { styles.subtitleStyle }>Welcome back.</Text>
            </View>
                       

            <View style = { styles.divider }>
                <View>
                    <Text style = { styles.text }>Username</Text>
                    <InputFields placeholder= { "Username" }></InputFields>
                </View>
                
                <View>
                    <Text style = { styles.text }>Password</Text>
                    <InputFields placeholder= { "Password" }></InputFields>
                </View>
            </View>

            <View style = {styles.linkContainer}>
                <Text style = { styles.linkStyle }>Forgot Password?</Text>
            </View>

           <View style={styles.orContainer}>
                <View style={styles.orLine} />
                    <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
            </View>

            <GoogleButton></GoogleButton>

            <View style = { styles.buttonContainer }>
                <PrimaryBlueButton>Login</PrimaryBlueButton>
            </View>
          
        </View>
    )
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#ffffff',
    },

    titleStyle: {
        fontSize: 30,
        fontWeight: 400
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
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: 30
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