import {View, TextInput, StyleSheet} from 'react-native';

// When integrating inputfields, this code allows us to type in
// whatever we want in the placeholder
type InputFieldsProps = {
    placeholder?: string;
}
export default function InputFields({ placeholder }: InputFieldsProps) {
    return (
        <View>
            <TextInput style = { styles.container }placeholder = { placeholder } placeholderTextColor="#888888"/>
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