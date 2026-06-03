import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Slide = {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  image: React.ComponentType<any>;
  dark?: boolean;
};

type Props = {
  item: Slide;
  width: number;
};

function InstructionItems({
  item,
  width,
}: Props) {
  const Svg = item.image;
  const svgSize = width * 1;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(28);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [item.id]);

  return (
    <View style={[styles.container, { width }]}>
      <Animated.View
        style={[
          styles.centerBlock,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.imageZone}>
          <Svg width={svgSize} height={svgSize} />
        </View>

        <View style={styles.textZone}>
          {!!item.eyebrow && (
            <Text style={styles.eyebrow}>{item.eyebrow}</Text>
          )}

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.description}>
            {item.description}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default memo(
  InstructionItems,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.width === next.width
);

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
},
  

  centerBlock: {
    alignItems: 'center',
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  imageZone: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  textZone: {
    alignItems: 'center',
    gap: 8,
  },

  eyebrow: {
    fontSize: 11,
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  title: {
    fontSize: 28,
    fontFamily: 'NotoSans-SemiBold',
    lineHeight: 36,
    letterSpacing: -0.6,
  },

  description: {
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    lineHeight: 22,
    letterSpacing: 0.1,
    color: '#2E3332',
    textAlign: 'center',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 36,
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 14,
  },



  ctaBlock: {
    width: '100%',
  },
});