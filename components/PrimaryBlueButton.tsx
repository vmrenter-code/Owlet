//Styles and design for primary blue buttons. Easily use these by
//importing into your component!

//Note: This is just sets up the button. Formatting styles may have
//to be done within your components.
import {Pressable, Text, StyleSheet} from 'react-native';

//Children allows us to type whatever we want in the button.
//For example, if you want a button that has the words "Hi" inside it,
// Simply do: <PrimaryBlueButton>Hi</PrimaryBlueButton>
export default function PrimaryButton({ children, onPress }: any) {
    return <Pressable style = {styles.container} onPress = {onPress}>
        <Text style = {styles.text}>{ children }</Text>
    </Pressable>
}

//Styles for the button
const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#3ab0d1',
        borderRadius: 100,
        //For shadow on Android, use elevation
        elevation: 4,
        //For shadow on Apple, use the parameters below
        shadowColor: '#000',
        shadowOffset: {width: 0, height:3},
        shadowOpacity: 0.25,
        borderColor: '#34b4d8',
        borderWidth: 1

    },

    text: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 0.2
    }

});






