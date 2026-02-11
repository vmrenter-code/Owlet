import {View, TextInput, StyleSheet} from 'react-native';

export default function InputFields({ children }: any) {
    return (
        <View>
            <TextInput placeholder = { children }/>
        </View>
    )
}