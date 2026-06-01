import React, { useRef, useEffect } from 'react';
import {View, Text, StyleSheet, Animated,} from 'react-native';
import HomeBg from '../components/HomeBg';
import PrimaryBlueButton from '../components/PrimaryBlueButton';

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
  const svgSize = width * 1.15;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  const btnFadeAnim = useRef(new Animated.Value(0)).current;
  const btnSlideAnim = useRef(new Animated.Value(16)).current;

  const isLast = currentIndex === totalSlides - 1;

  const dotActive = '#5058b4';
  const dotInactive = 'rgba(80,88,180,0.2)';

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
    <View style={[styles.container, { width}]}>

      {/* BACKGROUND */}
      <HomeBg />

      {/* CENTER BLOCK */}
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
    marginTop: 60,        // shifts the whole block down toward the lower half
  },

  imageZone: {
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'left',
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