import {View, Text, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

//Import any components you need
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import PrimaryWhiteButton from '../components/PrimaryWhiteButton'

export default function Launch() {
    const navigation = useNavigation<any>();
    return (
        //Views behave like divs. I used divs to wrap our components into divs to apply layout styles
        <View style = {styles.container}>
            <View style = {styles.textContainer}>
                <Text style = {styles.text}>owlet</Text>
            </View>
            
            <View style = {styles.buttonContainer}>
                <PrimaryBlueButton onPress={() => navigation.push('Signup')}>Create Account</PrimaryBlueButton>
                <PrimaryWhiteButton onPress={() => navigation.push('Login')}>Login</PrimaryWhiteButton>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        marginTop: 100,
        backgroundColor: '#ffffff'
    },

    text: {
        fontSize: 30,
        color: '#49A3BD',
        fontWeight: 'bold',
        letterSpacing: 7,
        transform: [{ translateY: -60}]
    },

    buttonContainer: {
        marginTop: 'auto',
        bottom: 70,
        gap: 50
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

});
