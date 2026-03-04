//This is the root of our application.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Import all screens
import Launch from './screens/Launch';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import Tabs from './nav/Tabs'
import HomeBg from './components/HomeBg';
import ScreeningInstructions from './screens/ScreeningInstructions';

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

                 headerBackground: () => <HomeBg />,

                headerTransparent: false,   // keep header container visible
                headerShadowVisible: false,
                headerTintColor: '#49A3BD',
                headerTitle: ''
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
                    options = {{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options = {{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Home"
                    component={Tabs}
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="ScreeningInstructions"
                    component = {ScreeningInstructions}
                    options = {{
                        headerShown: false
                    }}
                />



            </Stack.Navigator>
        </NavigationContainer>
    );
}
