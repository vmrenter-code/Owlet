import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
    createStaticNavigation,
    useNavigation
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

//Import any components you need
import PrimaryBlueButton from '../components/PrimaryBlueButton'
import PrimaryWhiteButton from '../components/PrimaryWhiteButton'

//Import any pages
import Login from '../screens/Login'

function Launch() {
    const navigation = useNavigation<any>();
    return (
        //Views behave like divs. I used divs to wrap our components into divs to apply layout styles
        <View style = {styles.container}>
            <View style = {styles.textContainer}>
                <Text style = {styles.text}>owlet</Text>
            </View>
            
            <View style = {styles.buttonContainer}>
                <PrimaryBlueButton>Create Account</PrimaryBlueButton>
                <PrimaryWhiteButton onPress={() => navigation.navigate('Login')}>Login</PrimaryWhiteButton>
            </View>
            
        </View>
    );
}

//Folloinwg https://reactnavigation.org/docs/hello-react-navigation, to navigate between difference screens, I had to create some navigators below
const RootStack = createNativeStackNavigator({
    screens: {
        Launch: {
            screen: Launch,
            //The navgiator header will NOT be shown on the launch screen ONLY.
            options: { headerShown: false },
        },
        Login: {
            screen: Login,
        }
        //Add signup here later!
    },

    //React's Navigator gives some safe padding for the navigator at the top. These styles remove that padding that disrupts the overall design
    //These are the global styles for the navigator header.
    screenOptions: {
        contentStyle: {
            paddingTop: 0,
            marginTop: 0,
            backgroundColor: '#fff', 
        },
        animationTypeForReplace: 'push',
        title: '',
        headerShadowVisible: false
    }
})

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation />
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