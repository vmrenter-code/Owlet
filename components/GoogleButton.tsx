//Google button component
import { Text, StyleSheet, Image, Pressable} from 'react-native';

export default function GoogleButton(){
  return (
  <Pressable style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.9, transform: [{ scale: 1.02 }] }]}>
        <Image 
            source={{ uri: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }} 
            style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}></Text>
        </Pressable>
  )

}

const styles = StyleSheet.create({

    googleButton: {
       backgroundColor: '#ffffff',
        borderRadius: 100,
        alignSelf: "center",
        shadowColor: '#00000031',
        shadowOffset: {width: 2, height: 4},
        shadowRadius: 4,
        borderColor: '#F0F1F1',
        borderWidth: 2,
        flex: 1,
        padding: 17

    },

    googleIcon: {
        width: 25,
        height: 25
    },

    googleButtonText: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '500',
        textAlign: 'center'
    }

})



