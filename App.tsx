//This is the root of our application.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Import all screens
import Launch from './screens/Launch';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';

//Following https://reactnavigation.org/docs/hello-react-navigation, to navigate between different screens
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator

                //Global styles for the navigator. Gets rid of the ugly preset that disrupts design.
                screenOptions={{
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
                    headerTintColor: '#3ab0d1',
                }}
            >
                <Stack.Screen
                    name="Launch"
                    component={Launch}

                    // The navigator header will NOT be shown on the launch screen ONLY.
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                />

                <Stack.Screen
                    name="Signup"
                    component={Signup}
                />

                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
