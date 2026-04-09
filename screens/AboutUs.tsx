import { View, Text, StyleSheet } from 'react-native';

import BackArrow from '../components/BackArrow';
import ImageCard from '../components/ImageCard';
import AuthPg from '../components/AuthPg';

export default function AboutUs() {

    return (
    
        <View style={styles.container}>

            <AuthPg />

            <View style={styles.backContainer}>
                <BackArrow />

            </View>

            <View style= {styles.imageShadow}>
                <ImageCard style={styles.imageCard} />
            </View>

            <View style={styles.textRow}>
                <Text style={styles.textStyle}>
                    April 8, 2026
                </Text>

                <Text style={styles.textStyle}>
                    |
                </Text>

                <Text style={styles.textStyle}>
                    Owlet Team
                </Text>
            </View>

            <Text style={styles.title}>About Us</Text>
            <Text style={styles.content}>
                Welcome to our app! We are dedicated to providing an inclusive and accessible experience for all users.
            </Text>

            <Text style={styles.headerStyle}>Our Mission </Text>
            <Text style={styles.headerStyle}>Our Approach </Text>
            <Text style={styles.headerStyle}>Your Privacy Matters</Text>
            <Text style={styles.headerStyle}>Learn More</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'NotoSans-SemiBold',
        color: '#161B1A',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#161B1A',
    },

    imageCard: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 0.5,
        borderColor: '#f1f1f1',
        
    },

    imageShadow: {
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 2.5,

    },

    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },

    textStyle: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
    },

    headerStyle: {
        fontSize: 18,
        fontFamily: 'NotoSans-SemiBold',
        color: '#161B1A',
        marginTop: 20,
        marginBottom: 10,
    },

    backContainer: {
        marginBottom: 20,
    }
});
