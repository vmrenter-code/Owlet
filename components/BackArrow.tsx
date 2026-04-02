import { Text, View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function HomeBg() {

const navigation = useNavigation<any>();
    
  return (
                <View style={styles.header}>
                    <Pressable 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backArrow}>←</Text>
                    </Pressable>
                </View>
    
  );
}

const styles = StyleSheet.create({
     header: {
        paddingTop: 50,
        zIndex: 100
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    backArrow: {
        fontSize: 20,
        color: '#242424',
    },


});
