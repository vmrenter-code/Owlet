import {View, Text} from 'react-native';
function Button({children}) {
    return <View>
        <Text>{children}</Text>
    </View>
}

export default Button;