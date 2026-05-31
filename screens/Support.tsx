import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import HomeBg from '../components/HomeBg';

export default function Support() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <BackArrow />

            <View style={styles.content}>
                <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Support</Text>

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    content: {
        flex: 1,
        zIndex: 1,
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
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.3,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },

    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
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
        backgroundColor: 'rgba(80, 88, 180, 0.06)',
    },

    lastItem: {
        borderBottomWidth: 0,
    },

    linkLabel: {
        fontSize: 15,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
    },

    linkArrow: {
        fontSize: 22,
        color: '#ccc',
    },
});
