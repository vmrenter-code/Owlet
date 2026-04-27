import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const PlayIcon = () => (
    <Svg width={60} height={60} viewBox="0 0 24 24" fill="none">
        <Path 
            d="M8 5v14l11-7L8 5z" 
            fill="#C4C4C4"
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
            <LinearGradient
                colors={['#8BC0CF', '#ffffff']}
                style={styles.background}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.4 }}
            />
            
            <View style={styles.content}>
                {/* Video Player Area */}
                <View style={styles.videoContainer}>
                    <Pressable style={styles.playButton}>
                        <PlayIcon />
                    </Pressable>
                </View>

                {/* Instructions Card */}
                <View style={styles.instructionsCard}>
                    <Text style={styles.title}>EKG Placement</Text>
                    <Text style={styles.description}>
                        Please follow the video to place the EKG wearable on your child.
                    </Text>

                    {/* Begin Screening Button */}
                    <Pressable 
                        style={({ pressed }) => [
                            styles.beginButton,
                            pressed && styles.beginButtonPressed
                        ]}
                        onPress={handleBeginScreening}
                    >
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.buttonIcon}>
                            <Path d="M8 5v14l11-7L8 5z" fill="#ffffff" />
                        </Svg>
                        <Text style={styles.beginButtonText}>Begin Screening</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    content: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    videoContainer: {
        flex: 1,
        maxHeight: 300,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(200, 200, 200, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        fontFamily: 'NotoSans-Bold',
    },
    description: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
        marginBottom: 40,
        fontFamily: 'NotoSans-Regular',
    },
    beginButton: {
        backgroundColor: '#8BC0CF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        gap: 8,
    },
    beginButtonPressed: {
        backgroundColor: '#7AB0BF',
        transform: [{ scale: 0.98 }],
    },
    buttonIcon: {
        marginRight: 4,
    },
    beginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'NotoSans-SemiBold',
    },
});
