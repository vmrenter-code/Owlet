//Styles and design for primary blue buttons. Easily use these by
//importing into your component!

//Note: This is just sets up the button. Formatting styles may have
//to be done within your components.
import {Pressable, Text, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

//Children allows us to type whatever we want in the button.
//For example, if you want a button that has the words "Hi" inside it,
// Simply do: <PrimaryBlueButton>Hi</PrimaryBlueButton>
export default function PrimaryButton({ children, onPress }: any) {
    return (
    <Pressable onPress = { onPress } style = {({ pressed }: any) => [styles.container, pressed && { transform: [ {scale: 1.04 }], opacity: 0.90}]} >
        <LinearGradient
            colors={['#74BBCF', '#9ad1c0']}
            style={styles.gradient}
        >
            <Text style = {styles.text}>{ children }</Text>
        </LinearGradient>
    </Pressable>
    );
}

//Styles for the button
const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 100,
        //For shadow on Apple, use the parameters below
        
    },

    gradient: {
        padding: 12,
        borderRadius: 100,
                alignSelf: 'center',

        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height:3},
        shadowOpacity: 0.35,
        shadowRadius: 8,
    },

    text: {
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 0.2
    }
});