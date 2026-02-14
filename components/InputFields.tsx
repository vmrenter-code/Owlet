import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';

// When integrating inputfields, this code allows us to type in
// whatever we want in the placeholder
type InputFieldsProps = TextInputProps &{
    placeholder?: string;
}
export default function InputFields({ placeholder, ...props }: InputFieldsProps) {
    return (
        <View>
            <TextInput style = { styles.container }placeholder = { placeholder } placeholderTextColor="#888888" {...props}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#898989',
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 5.5,
        height: 35,
        fontSize: 14,
        color: '#000000'
    }
})