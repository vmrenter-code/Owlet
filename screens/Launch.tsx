import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import PrimaryBlueButton from '../components/PrimaryBlueButton';
import PrimaryWhiteButton from '../components/PrimaryWhiteButton';
import HomeBg from '../components/HomeBg';

export default function Launch() {
    const navigation = useNavigation<any>();
    
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formatBg}>
                <HomeBg />
            </View>

            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>owlet</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    <PrimaryBlueButton onPress={() => navigation.push('Signup')}>Create Account</PrimaryBlueButton>
                    <PrimaryWhiteButton onPress={() => navigation.push('Login')}>Login</PrimaryWhiteButton>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        marginTop: 100,
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
    },

    formatBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
});