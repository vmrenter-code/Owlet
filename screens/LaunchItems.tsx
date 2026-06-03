import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import HomeBg from '../components/HomeBg';

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: React.ComponentType<any>;
  dark?: boolean;
};

type Props = {
  item: Slide;
  width: number;
  currentIndex: number;
  totalSlides: number;
  onNext?: () => void;
  onSkip?: () => void;
};

export default function LaunchItems({
  item,
  width,
  currentIndex,
  totalSlides,
  onNext,
  onSkip,
}: Props) {
  const Svg = item.image;
  const { height: windowHeight } = useWindowDimensions();

  // Responsive SVG sizing: clamp between min/max, based on shorter axis
  const shortAxis = Math.min(width, windowHeight);
  const svgSize = Math.min(Math.max(shortAxis * 1, 200), 420);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  const btnFadeAnim = useRef(new Animated.Value(0)).current;
  const btnSlideAnim = useRef(new Animated.Value(16)).current;

  const isLast = currentIndex === totalSlides - 1;

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

  useEffect(() => {
    if (!isLast) return;

    btnFadeAnim.setValue(0);
    btnSlideAnim.setValue(16);

    Animated.parallel([
      Animated.timing(btnFadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnSlideAnim, {
        toValue: 0,
        duration: 360,
        delay: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLast]);

  return (
    <View style={[styles.container, { width }]}>
      <HomeBg />

      <Animated.View
        style={[
          styles.centerBlock,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* SVG image zone: fixed intrinsic size, no flex stretch */}
        <View
          style={[
            styles.imageZone,
            { width: svgSize, height: svgSize },
          ]}
        >
          <Svg
            width={svgSize}
            height={svgSize}
            // preserveAspectRatio handled by the SVG itself;
            // explicit width+height prevents the "unbounded" stretch bug
            // on Android where SVGs without a viewBox fill the parent.
            style={styles.svgImage}
          />
        </View>

        <View style={styles.textZone}>
          <Text style={styles.eyebrow}>{item.eyebrow}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

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
    // No flex: 1 — let the explicit width/height from JS control the box.
    // overflow: hidden clips any SVG that bleeds out on edge-case devices.
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Applied directly to the <Svg> element so it never exceeds its container.
  svgImage: {
    maxWidth: '100%',
    maxHeight: '100%',
  },

  textZone: {
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
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
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
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