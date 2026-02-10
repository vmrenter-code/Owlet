//Styles and design for primary white buttons. Easily use these by
//importing into your component!

//Note: This is just sets up the button. Formatting styles may have
//to be done within your components.
import {View, Text, StyleSheet} from 'react-native';

//Children allows us to type whatever we want in the button.
//For example, if you want a button that has the words "Hi" inside it,
// Simply do: <PrimaryWhiteButton>Hi</PrimaryWhiteButton>
export default function PrimaryButton({ children }: any) {
    return <View style = {styles.container}>
        <Text style = {styles.text}>{ children }</Text>
    </View>
}

//Styles for the button
const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 100,
        //For shadow on Android, use elevation
        elevation: 4,
        //For shadow on Apple, use the parameters below
        shadowColor: '#000',
        shadowOffset: {width: 0, height:3},
        shadowOpacity: 0.25,
        borderColor: '#dadada',
        borderWidth: 1
    },

    text: {
        fontSize: 14,
        color: '#3ab0d1',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 0.2
    }

});






