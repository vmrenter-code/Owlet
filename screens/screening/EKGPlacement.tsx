import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const PlayIcon = () => (
    <Svg width={50} height={50} viewBox="0 0 24 24" fill="none">
        <Path 
            d="M8 5v14l11-7L8 5z" 
            fill="#d0d0d0"
        />
    </Svg>
);

export default function EKGPlacement() {
    const navigation = useNavigation<any>();

    const handleBeginScreening = () => {
        navigation.navigate('PositionChild');
    };

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={['#e8f4f8', '#f5f5f5']}
                style={styles.gradient}
            />

            {/* Video Player Area */}
            <View style={styles.videoContainer}>
                <Pressable style={styles.playButton}>
                    <PlayIcon />
                </Pressable>
            </View>

            {/* Instructions */}
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionTitle}>EKG Placement</Text>
                <Text style={styles.instructionText}>
                    Please follow the video to place the EKG wearable on your child.
                </Text>
            </View>

            {/* Begin Screening Button */}
            <View style={styles.buttonContainer}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.beginButton,
                        pressed && styles.beginButtonPressed
                    ]}
                    onPress={handleBeginScreening}
                >
                    <Text style={styles.beginButtonText}>Begin Screening</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    gradient: {
        ...StyleSheet.absoluteFillObject,
    },

    videoContainer: {
        flex: 1,
        maxHeight: '60%',
        marginTop: 0,
        marginHorizontal: 0,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(200, 200, 200, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    instructionContainer: {
        paddingHorizontal: 28,
        paddingTop: 30,
    },

    instructionTitle: {
        color: '#1a1a1a',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
        fontFamily: 'NotoSans-Bold',
    },

    instructionText: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        fontFamily: 'NotoSans-Regular',
    },

    buttonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 28,
        paddingBottom: 100,
    },

    beginButton: {
        backgroundColor: '#7FB8C9',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },

    beginButtonPressed: {
        backgroundColor: '#6BA8B9',
        transform: [{ scale: 0.98 }],
    },

    beginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'NotoSans-SemiBold',
    },
});
