import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import InstructionSlides from './InstructionSlides';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import HomeBg from '../components/HomeBg';
import ImageCard from '../components/ImageCard';
import { useScreening } from '../context/ScreeningContext';

const createLocalScreeningId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const LAST_INDEX = InstructionSlides.findIndex((s) => s.id === '6') ?? InstructionSlides.length - 1;

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');

export default function ScreeningInstructions() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { screeningId: contextScreeningId, setScreeningId } = useScreening();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const { width } = useWindowDimensions();

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scrollX, {
      toValue: currentIndex * width,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, width]);

  const resolveScreeningId = async (): Promise<string> => {
    if (contextScreeningId) return contextScreeningId;
    const routeId = route.params?.screeningID ?? route.params?.screeningId;
    if (routeId) { setScreeningId(routeId); return routeId; }
    try {
      const res = await fetch(`${BASE_URL}/screening`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startedAt: new Date().toISOString() }),
      });
      if (res.ok) {
        const id = (await res.json())?.screening?.id ?? createLocalScreeningId();
        setScreeningId(id); return id;
      }
    } catch {}
    const id = createLocalScreeningId();
    setScreeningId(id); return id;
  };

  const handleNext = async () => {
    const idx = currentIndexRef.current;
    if (idx < LAST_INDEX) {
      const next = idx + 1;
      currentIndexRef.current = next;
      setCurrentIndex(next);
      return;
    }
    const screeningId = await resolveScreeningId();
    navigation.navigate('EKGPlacement', { screeningId });
  };

  const slide = InstructionSlides[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <HomeBg />
      </View>

      <View style={styles.slideArea}>
        <View style={styles.imageBox}>
          <ImageCard style={styles.imageFill} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.title} accessibilityRole="header">{slide.title}</Text>
          <Text style={styles.desc}>{slide.description}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Paginator data={InstructionSlides} scrollX={scrollX} />
        <View style={styles.btnWrap}>
          <PrimaryBlueButton onPress={handleNext}>Next</PrimaryBlueButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    pointerEvents: 'none',
  } as any,
  slideArea: {
    flex: 1,
    zIndex: 1,
    minHeight: 0,
  },
  imageBox: {
    flex: 3,
    width: '100%',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  textBox: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'NotoSans-SemiBold',
    color: '#151515',
    marginBottom: 8,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#2E3332',
    lineHeight: 21,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  footer: {
    zIndex: 10,
    paddingBottom: 28,
    flexShrink: 0,
  },
  btnWrap: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
});
