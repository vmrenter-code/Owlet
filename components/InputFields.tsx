import {View, TextInput, StyleSheet} from 'react-native';

// When integrating inputfields, this code allows us to type in
// whatever we want in the placeholder
type InputFieldsProps = {
    placeholder?: string;
}
export default function InputFields({ placeholder }: InputFieldsProps) {
    return (
        <View style = { styles.container }>
            <TextInput style = {styles.input} placeholder = { placeholder } placeholderTextColor="#585858" underlineColorAndroid="transparent" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        borderRadius: 100,
        padding: 15,
        borderColor: '#F0F1F1',
        borderWidth: 2
    },

    input: {
        fontSize: 17,
        outlineColor: 'transparent'
    }
})