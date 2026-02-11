import { View, Text, StyleSheet } from 'react-native';

import  InputFields from '../components/InputFields'
import PrimaryBlueButton from '../components/PrimaryBlueButton'

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

            <View style = { styles.buttonContainer }>
                <PrimaryBlueButton>Login</PrimaryBlueButton>
            </View>

            <View style = { styles.orContainer }>
                <Text style = { styles.subtitleStyle }>or login with</Text>
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
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        marginBottom: '2%',
        paddingLeft: 3
    }


});