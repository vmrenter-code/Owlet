import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import BackArrow from '../components/BackArrow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Icons
const DocumentIcon = () => (
    <View style={styles.iconBg}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect x={4} y={2} width={16} height={20} rx={2} stroke="#5BA3B0" strokeWidth={2} />
            <Path d="M8 6h8M8 10h8M8 14h4" stroke="#5BA3B0" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    </View>
);

const HeadphonesIcon = () => (
    <View style={[styles.iconBg, { backgroundColor: '#F5E6FF' }]}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="#9B59B6" strokeWidth={2} strokeLinecap="round" />
            <Path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" stroke="#9B59B6" strokeWidth={2} />
        </Svg>
    </View>
);

const WarningIcon = () => (
    <View style={[styles.iconBg, { backgroundColor: '#FFE6E6' }]}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#E74C3C" strokeWidth={2} />
            <Path d="M12 8v4M12 16h.01" stroke="#E74C3C" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    </View>
);

const notificationsData = {
    today: [
        { id: 1, type: 'result', text: 'Your screening result from 03/04 has been uploaded', unread: true },
    ],
    previously: [
        { id: 2, type: 'support', text: 'Updates from customer service', unread: false },
        { id: 3, type: 'warning', text: 'Incomplete screening: click here to resume screening', unread: true },
        { id: 4, type: 'result', text: 'Your screening result from 02/21 has been uploaded', unread: false },
        { id: 5, type: 'result', text: 'Your screening result from 02/04 has been uploaded', unread: false },
        { id: 6, type: 'result', text: 'Your screening result from 01/15 has been uploaded', unread: false },
        { id: 7, type: 'support', text: 'Updates from customer service', unread: false },
        { id: 8, type: 'warning', text: 'Incomplete screening: click here to resume screening', unread: false },
    ],
};

const getIcon = (type: string) => {
    switch (type) {
        case 'result':
            return <DocumentIcon />;
        case 'support':
            return <HeadphonesIcon />;
        case 'warning':
            return <WarningIcon />;
        default:
            return <DocumentIcon />;
    }
};

export default function NotificationCenter() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const renderNotification = (item: any) => (
        <Pressable 
            key={item.id} 
            style={({ pressed }) => [styles.notificationCard, pressed && styles.cardPressed]}
        >
            {getIcon(item.type)}
            <Text style={styles.notificationText}>{item.text}</Text>
            {item.unread && <View style={styles.unreadDot} />}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ecfffb', '#fcecfb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            />
            
            <BackArrow />
            
            <Text style={[styles.title, { marginTop: insets.top + 44 }]}>Notifications</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Today Section */}
                <Text style={styles.sectionTitle}>Today</Text>
                {notificationsData.today.map(renderNotification)}

                {/* Previously Section */}
                <Text style={styles.sectionTitle}>Previously</Text>
                {notificationsData.previously.map(renderNotification)}

                <View style={{ height: 40 }} />
            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 25,
        paddingBottom: 20,
    },

    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        marginTop: 8,
    },

    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },

    cardPressed: {
        backgroundColor: '#f8f8f8',
    },

    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#E6F7F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    notificationText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E74C3C',
        marginLeft: 8,
    },
});
