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
            
            <View style = {styles.buttonContainer}>
                <PrimaryBlueButton onPress={() => navigation.replace('Signup')}>Create Account</PrimaryBlueButton>
                <PrimaryWhiteButton onPress={() => navigation.replace('Login')}>Login</PrimaryWhiteButton>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        marginTop: 100,
        backgroundColor: '#F6F9F7'
    },

    text: {
        fontSize: 30,
        color: '#49A3BD',
        fontWeight: 'bold',
        letterSpacing: 7,
        transform: [{ translateY: -60}]
    },

    buttonContainer: {
        position: 'absolute',
        padding: 19,
        bottom: 30,
        left: 0,
        right: 0,
        gap: 20,
    },

});
