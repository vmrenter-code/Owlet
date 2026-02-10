import {View, Text, StyleSheet} from 'react-native';

import PrimaryBlueButton from '../components/PrimaryBlueButton'
import PrimaryWhiteButton from '../components/PrimaryWhiteButton'

export default function Launch() {
    return (
        <View style = {styles.container}>
            <View style = {styles.textContainer}>
                <Text style = {styles.text}>owlet</Text>
            </View>
            
            <View style = {styles.buttonContainer}>
                <PrimaryBlueButton>Create Account</PrimaryBlueButton>
                <PrimaryWhiteButton>Login</PrimaryWhiteButton>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 100,
        backgroundColor: '#ffffff'
    },

    text: {
        fontSize: 30,
        color: '#3ab0d1',
        fontWeight: 'bold',
        letterSpacing: 7,
        transform: [{ translateY: -60}]
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 70,
        left: 20,
        right: 20,
        gap: 50
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

});