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
import { useNavigation } from '@react-navigation/native';
import ChildProfileAvatar from './ChildProfileAvatar';
import { useChildProfile } from '../context/ChildProfileContext';
import { useChildAvatarKey } from '../hooks/useChildAvatarKey';
import { formatChildAge } from '../utils/formatChildAge';

const INDIGO = '#5058b4';

const CheckMarkIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Circle cx={9} cy={9} r={9} fill={INDIGO} />
        <Path d="M5 9l2.5 2.5L13 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

function ChildSwitcherCell({
    child,
    selected,
    age,
    onSelect,
}: {
    child: { id: string; name: string };
    selected: boolean;
    age: string;
    onSelect: () => void;
}) {
    const avatarKey = useChildAvatarKey(child.id);

    return (
        <Pressable
            style={styles.cell}
            onPress={onSelect}
            accessibilityRole="button"
            accessibilityLabel={`Select ${child.name}`}
        >
            <View
                style={[
                    styles.avatarWrap,
                    selected && styles.avatarWrapSelected,
                ]}
            >
                <ChildProfileAvatar
                    avatarKey={avatarKey}
                    name={child.name}
                    size={56}
                />
            </View>
            <Text style={styles.name} numberOfLines={1}>
                {child.name}
            </Text>
            {age ? (
                <Text style={styles.age}>{age}</Text>
            ) : (
                <Text style={styles.agePlaceholder}> </Text>
            )}
            <View style={styles.checkArea}>
                {selected ? <CheckMarkIcon /> : null}
            </View>
        </Pressable>
    );
}

const PlusIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 5v14M5 12h14"
            stroke={INDIGO}
            strokeWidth={2.2}
            strokeLinecap="round"
        />
    </Svg>
);

export default function ChildSwitcherSheet() {
    const navigation = useNavigation<any>();
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

    const openAddChild = () => {
        animateClose(() => {
            navigation.navigate('AddChildStack');
        });
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
                    <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
                        <View style={styles.handle} />
                        <Text style={styles.title}>Choose child profile</Text>

                        <View style={styles.row}>
                            {profiles.map((child) => (
                                <ChildSwitcherCell
                                    key={child.id}
                                    child={child}
                                    selected={activeChildId === child.id}
                                    age={formatChildAge(birthDates[child.id])}
                                    onSelect={() => selectChild(child.id)}
                                />
                            ))}

                            <Pressable
                                style={({ pressed }) => [
                                    styles.cell,
                                    pressed && styles.cellPressed,
                                ]}
                                onPress={openAddChild}
                                accessibilityRole="button"
                                accessibilityLabel="Add a child"
                            >
                                <View style={[styles.avatarWrap, styles.addAvatarWrap]}>
                                    <PlusIcon />
                                </View>
                                <Text style={styles.addName} numberOfLines={2}>
                                    Add a child
                                </Text>
                                <Text style={styles.agePlaceholder}> </Text>
                                <View style={styles.checkArea} />
                            </Pressable>
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
        fontFamily: 'NotoSans-Regular',
        color: '#888',
        textAlign: 'center',
        marginBottom: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 20,
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    cell: {
        alignItems: 'center',
        width: 96,
    },
    cellPressed: {
        opacity: 0.85,
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
        borderColor: INDIGO,
        borderWidth: 2,
    },
    name: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'NotoSans-SemiBold',
        color: '#151515',
        textAlign: 'center',
    },
    age: {
        marginTop: 2,
        fontSize: 12,
        fontFamily: 'NotoSans-Regular',
        color: '#888',
    },
    agePlaceholder: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 16,
        color: 'transparent',
    },
    checkArea: {
        marginTop: 6,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAvatarWrap: {
        borderColor: 'rgba(80, 88, 180, 0.35)',
        borderWidth: 1.5,
        borderStyle: 'dashed',
        backgroundColor: 'rgba(80, 88, 180, 0.06)',
    },
    addName: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'NotoSans-SemiBold',
        color: INDIGO,
        textAlign: 'center',
        lineHeight: 18,
    },
});
