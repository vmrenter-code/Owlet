import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//Import any components you need
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import PrimaryWhiteButton from '../components/PrimaryWhiteButton'
import AuthPg from '../components/AuthPg';

export default function Launch() {
    const navigation = useNavigation<any>();
    
    return (
        <View style={styles.container}>
            <View style={styles.background} pointerEvents="none">
                <AuthPg />
            </View>

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>owlet</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <PrimaryBlueButton onPress={() => navigation.navigate('Signup')}>Create Account</PrimaryBlueButton>
                    <PrimaryWhiteButton onPress={() => navigation.navigate('Login')}>Login</PrimaryWhiteButton>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        ...StyleSheet.absoluteFillObject,
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
        paddingBottom: 70,
        gap: 50
    },

    content: {
        flex: 1,
        padding: 30,
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});