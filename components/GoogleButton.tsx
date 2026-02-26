//Google button component
import { Text, StyleSheet, Image, Pressable} from 'react-native';

export default function GoogleButton(){
  return (
  <Pressable style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.9, transform: [{ scale: 1.02 }] }]}>
        <Image 
            source={{ uri: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }} 
            style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>
  )

}

const styles = StyleSheet.create({

    googleButton: {
        marginTop: '6%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#fdfdfd',
        borderRadius: 100,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height:3},
        shadowOpacity: 0.20,
        shadowRadius: 8,

    },

    googleIcon: {
        width: 20,
        height: 20
    },

    googleButtonText: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '500',
        textAlign: 'center'
    }

})



