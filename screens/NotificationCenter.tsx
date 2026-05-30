import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import BackArrow from '../components/BackArrow';
import HomeBg from '../components/HomeBg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INDIGO = '#5058b4';
const ICON_BG = 'rgba(80, 88, 180, 0.12)';

type NotificationItem = {
    id: number;
    type: 'result' | 'support' | 'warning';
    text: string;
    unread: boolean;
};

const notificationsData: { today: NotificationItem[]; previously: NotificationItem[] } = {
    today: [
        { id: 1, type: 'result', text: "Your screening result from 03/04 has been uploaded", unread: true },
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

function DocumentIcon() {
    return (
        <View style={styles.iconBg}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Rect x={4} y={2} width={16} height={20} rx={2} stroke={INDIGO} strokeWidth={2} />
                <Path d="M8 6h8M8 10h8M8 14h4" stroke={INDIGO} strokeWidth={2} strokeLinecap="round" />
            </Svg>
        </View>
    );
}

function HeadphonesIcon() {
    return (
        <View style={styles.iconBg}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke={INDIGO} strokeWidth={2} strokeLinecap="round" />
                <Path
                    d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"
                    stroke={INDIGO}
                    strokeWidth={2}
                />
            </Svg>
        </View>
    );
}

function WarningIcon() {
    return (
        <View style={[styles.iconBg, styles.iconBgWarning]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke="#c47a20" strokeWidth={2} />
                <Path d="M12 8v4M12 16h.01" stroke="#c47a20" strokeWidth={2} strokeLinecap="round" />
            </Svg>
        </View>
    );
}

function getIcon(type: NotificationItem['type']) {
    switch (type) {
        case 'support':
            return <HeadphonesIcon />;
        case 'warning':
            return <WarningIcon />;
        default:
            return <DocumentIcon />;
    }
}

export default function NotificationCenter() {
    const insets = useSafeAreaInsets();

    const renderNotification = (item: NotificationItem) => (
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
            <View style={styles.bg} pointerEvents="none">
                <HomeBg />
            </View>

            <BackArrow />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
                ]}
            >
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>Screening updates and messages from our team.</Text>

                <Text style={styles.sectionTitle}>Today</Text>
                <View style={styles.section}>
                    {notificationsData.today.map(renderNotification)}
                </View>

                <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Previously</Text>
                <View style={styles.section}>
                    {notificationsData.previously.map(renderNotification)}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    bg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    scroll: { flex: 1, zIndex: 1 },
    scrollContent: { paddingHorizontal: 20, gap: 4 },
    title: {
        fontSize: 26,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        marginBottom: 24,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: 'NotoSans-SemiBold',
        color: '#888',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    sectionTitleSpaced: {
        marginTop: 20,
    },
    section: {
        gap: 10,
        marginBottom: 8,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        boxShadow: '0px 2px 12px rgba(129,115,139,0.08)',
    } as any,
    cardPressed: {
        opacity: 0.92,
    },
    iconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: ICON_BG,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBgWarning: {
        backgroundColor: 'rgba(196, 122, 32, 0.12)',
    },
    notificationText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'NotoSans-Regular',
        color: '#151515',
        lineHeight: 20,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: INDIGO,
    },
});
