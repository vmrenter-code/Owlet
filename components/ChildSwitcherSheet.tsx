import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    Animated,
    Dimensions,
    Easing,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Svg, Path, Circle } from 'react-native-svg';
import ChildProfileAvatar from './ChildProfileAvatar';
import { useChildProfile } from '../context/ChildProfileContext';
import { formatChildAge } from '../utils/formatChildAge';

const CheckMarkIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Circle cx={9} cy={9} r={9} fill="#49A3BD" />
        <Path d="M5 9l2.5 2.5L13 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function ChildSwitcherSheet() {
    const {
        switcherOpen,
        closeSwitcher,
        profiles,
        activeChildId,
        setActiveChildId,
        birthDates,
    } = useChildProfile();

    const screenHeight = Dimensions.get('window').height;
    const sheetTranslateY = useRef(new Animated.Value(screenHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (switcherOpen) {
            setMounted(true);
            Animated.parallel([
                Animated.timing(sheetTranslateY, {
                    toValue: 0,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [switcherOpen, sheetTranslateY, backdropOpacity, screenHeight]);

    const animateClose = (after?: () => void) => {
        Animated.parallel([
            Animated.timing(sheetTranslateY, {
                toValue: screenHeight,
                duration: 240,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => {
            closeSwitcher();
            setMounted(false);
            after?.();
        });
    };

    const selectChild = (id: string) => {
        setActiveChildId(id);
        animateClose();
    };

    return (
        <Modal
            visible={switcherOpen || mounted}
            transparent
            animationType="none"
            onRequestClose={() => animateClose()}
        >
            <View style={styles.root}>
                <Animated.View
                    style={[StyleSheet.absoluteFillObject, styles.backdrop, { opacity: backdropOpacity }]}
                    pointerEvents="auto"
                >
                    <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={() => animateClose()}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                    />
                </Animated.View>
                <View style={styles.sheetWrap} pointerEvents="box-none">
                    <Animated.View
                        style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
                    >
                        <View style={styles.handle} />
                        <Text style={styles.title}>Choose child profile</Text>
                        <View style={styles.row}>
                            {profiles.map((child) => {
                                const selected = activeChildId === child.id;
                                const age = formatChildAge(birthDates[child.id]);
                                return (
                                    <Pressable
                                        key={child.id}
                                        style={styles.cell}
                                        onPress={() => selectChild(child.id)}
                                    >
                                        <View
                                            style={[
                                                styles.avatarWrap,
                                                selected && styles.avatarWrapSelected,
                                            ]}
                                        >
                                            <ChildProfileAvatar childId={child.id} size={56} />
                                        </View>
                                        <Text style={styles.name} numberOfLines={1}>
                                            {child.name}
                                        </Text>
                                        {age ? <Text style={styles.age}>{age}</Text> : null}
                                        <View style={styles.checkArea}>
                                            {selected ? <CheckMarkIcon /> : null}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },

    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
    },

    sheetWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 36,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 16,
    },

    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#d9d9d9',
        alignSelf: 'center',
        marginBottom: 14,
    },

    title: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 14,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
    },

    cell: {
        alignItems: 'center',
        width: '30%',
        maxWidth: 110,
    },

    avatarWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
    },

    avatarWrapSelected: {
        borderColor: '#49A3BD',
        borderWidth: 2,
    },

    name: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },

    age: {
        marginTop: 2,
        fontSize: 12,
        color: '#888',
    },

    checkArea: {
        marginTop: 6,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
