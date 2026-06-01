import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeBg from '../components/HomeBg';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import PrimaryWhiteButton from '../components/PrimaryWhiteButton';
import ImageCard from '../components/ImageCard';
import { Svg, Path, Rect } from 'react-native-svg';

export default function Welcome() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [agreed, setAgreed] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleCreateAccount = () => {
        navigation.navigate('Signup');
    };
    

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleToggle = () => {
        setAgreed(prev => !prev);
        if (showError) setShowError(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formatBg} pointerEvents="none">
                <HomeBg />
            </View>

            <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}>

                <View style={styles.centerSection}>
                    <View style={styles.imageWrapper}>
                        <ImageCard style={styles.imageCard} />
                    </View>

                    <Text style={styles.titleStyle}>owlet</Text>
                    <Text style={styles.subtitleStyle}>Early insights for your child's development.</Text>
                </View>

                <View style={styles.bottomSection}>
                    <View style={styles.buttonStack}>
                        <PrimaryBlueButton onPress={handleCreateAccount} fullWidth>
                            Get started
                        </PrimaryBlueButton>

                        <PrimaryWhiteButton onPress={handleLogin} fullWidth>
                            I already have an account
                        </PrimaryWhiteButton>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    formatBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },

    centerSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    imageWrapper: {
        width: 200,
        height: 200,
        marginBottom: 8,
    },

    imageCard: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },

    titleStyle: {
        fontSize: 32,
        color: '#151515',
        textAlign: 'center',
        fontFamily: 'NotoSans-SemiBold',
        letterSpacing: -0.3,
    },

    subtitleStyle: {
        fontSize: 15,
        color: '#2E3332',
        textAlign: 'center',
        fontFamily: 'NotoSans-Regular',
        lineHeight: 21,
        paddingHorizontal: 12,
    },

    bottomSection: {
        gap: 16,
        paddingBottom: 8,
    },

    errorText: {
        fontSize: 13,
        color: '#D06868',
        fontFamily: 'NotoSans-Regular',
        marginTop: 4,
    },

    buttonStack: {
        gap: 12,
    },

    loginButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 100,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.12)',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginButtonPressed: {
        opacity: 0.6,
    },

    loginText: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#4a8f8f',
        letterSpacing: 0.1,
    },
});