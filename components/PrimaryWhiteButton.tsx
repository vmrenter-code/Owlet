//Styles and design for primary blue buttons. Easily use these by
//importing into your component!

//Note: This is just sets up the button. Formatting styles may have
//to be done within your components.
import {Pressable, Text, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

//Children allows us to type whatever we want in the button.
//For example, if you want a button that has the words "Hi" inside it,
// Simply do: <PrimaryBlueButton>Hi</PrimaryBlueButton>
export default function PrimaryWhiteButton({ children, onPress }: any) {
    return (
    <Pressable onPress = { onPress } style = {({ pressed }: any) => [styles.container, pressed && { transform: [ {scale: 1.04 }], opacity: 0.90}]} >
            <Text style = {styles.text}>{ children }</Text>
    </Pressable>
    );
}

//Styles for the button
const styles = StyleSheet.create({
    container: {
         padding: 17,
        borderRadius: 100,
        backgroundColor: '#ffffff',
        shadowColor: '#00000031',
        shadowOffset: {width: 2, height: 4},
        shadowRadius: 4,
        borderColor: '#F0F1F1',
        borderWidth: 2
        
    },

    text: {
        fontSize: 17,
        color: '#8BC0CF',
        textAlign: 'center',
        fontWeight: 600,
    }
});