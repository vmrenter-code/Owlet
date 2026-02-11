//This is the root of our application.
import {
    createStaticNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Import all screens
import Launch from './screens/Launch';
import Login from './screens/Login';
import Signup from './screens/Signup';

//Following https://reactnavigation.org/docs/hello-react-navigation, to navigate between different screens
const RootStack = createNativeStackNavigator({
    screens: {
        Launch: {
            screen: Launch,
            //The navigator header will NOT be shown on the launch screen ONLY.
            options: { headerShown: false },
        },
        Login: {
            screen: Login,
        },
        Signup: {
            screen: Signup,
        }
    },

    //React's Navigator gives some safe padding for the navigator at the top. These styles remove that padding that disrupts the overall design
    //These are the global styles for the navigator header.
    screenOptions: {
        contentStyle: {
            paddingTop: 0,
            marginTop: 0,
            backgroundColor: '#fff', 
        },
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        title: '',
        headerShadowVisible: false,
        headerTintColor: '#3ab0d1'
    }
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation />;
}
