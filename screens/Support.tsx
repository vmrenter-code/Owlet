import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import BackArrow from '../components/BackArrow';

export default function Support() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
            
            {/* Header */}
            <View style={styles.header}>
                <BackArrow/>
            </View>

            {/* Title */}
            <Text style={styles.title}>Support</Text>

            {/* Support Options */}
            <View style={styles.section}>
                <Pressable style={({ pressed }) => [styles.linkItem, pressed && styles.linkItemPressed]}>
                    <Text style={styles.linkLabel}>Contact Us</Text>
                    <Text style={styles.linkArrow}>›</Text>
                </Pressable>

                <Pressable style={({ pressed }) => [styles.linkItem, styles.lastItem, pressed && styles.linkItemPressed]}>
                    <Text style={styles.linkLabel}>Feedback</Text>
                    <Text style={styles.linkArrow}>›</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    gradient: {
        ...StyleSheet.absoluteFillObject,
    },

    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    backArrow: {
        fontSize: 24,
        color: '#333',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },

    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    linkItemPressed: {
        backgroundColor: '#f8f8f8',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    linkLabel: {
        fontSize: 16,
        color: '#333',
    },

    linkArrow: {
        fontSize: 22,
        color: '#ccc',
    },
});
