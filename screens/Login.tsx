import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import InputFields from '../components/InputFields'
import PrimaryWhiteButton from '../components/PrimaryWhiteButton'
import GoogleButton from '../components/GoogleButton'
import HomeBg from '../components/HomeBg';


export default function Login() {
    const navigation = useNavigation<any>();

    return (

        <View style={{ flex: 1 }}>

            <View style={styles.formatBg}>
                    <HomeBg />
            </View>

            <View style = { styles.container}>
                <View style = { styles.titleContainer}>
                    <Text style = { styles.titleStyle}>Login</Text>
                    <Text style = { styles.subtitleStyle }>Welcome back.</Text>
                </View>
                        

                <View style = { styles.divider }>
                    <View>
                        <Text style = { styles.text }>Username</Text>
                        <InputFields></InputFields>
                    </View>
                    
                    <View>
                        <Text style = { styles.text }>Password</Text>
                        <InputFields></InputFields>
                    </View>
                </View>

                <View style = {styles.linkContainer}>
                    <Text style = { styles.linkStyle }>Forgot Password?</Text>
                </View>

               <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                        <Text style={styles.orText}>or login with</Text>
                    <View style={styles.orLine} />
                </View>

                <View style = {styles.googleContainer}>
                    <GoogleButton></GoogleButton>
                </View>

                <View style = { styles.buttonContainer }>
                    <PrimaryWhiteButton onPress={() => navigation.replace('Home')}>Login</PrimaryWhiteButton>
                </View>
            
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        padding: 30,
    },

    titleStyle: {
        fontSize: 30,
        fontWeight: '500',
        color: '#fff'
    },

    subtitleStyle: {
        fontSize: 16,
        color: '#f0f0f0'
    },

    linkStyle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500'
    },

    titleContainer:{
        gap: 3
    },

    divider: {
        gap: 16,
        marginTop: '9%'
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: 19
    },

    
    linkContainer:{
        marginTop: '5%',
        alignItems: 'flex-end'
    },

   orContainer: {
        marginTop: '8%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15
    },

    text: {
        marginBottom: '2%',
        paddingLeft: 3,
        color: '#fff',
        fontWeight: '500',
        fontSize: 16
    },

     orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ffffff'
    },

     orText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8f8f8'
    },

    formatBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  googleContainer: {
    marginTop: 16
  }


});