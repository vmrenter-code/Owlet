import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Animated, ViewToken, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import InstructionSlides from './InstructionSlides';
import InstructionItems from './InstructionItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import BackArrow from '../components/BackArrow';

const BUTTON_SIZE = 40;
import HomeBg from '../components/HomeBg';

const createLocalScreeningId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function ScreeningInstructions() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const isLastSlide = currentIndex === InstructionSlides.length - 1;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (isLastSlide) {
      navigation.navigate('EKGPlacement');
    } else {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleBeginScreening = async () => {
    let screeningId = createLocalScreeningId();

    try {
      const response = await fetch(`${BASE_URL}/screening`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startedAt: new Date().toISOString() }),
      });

      if (response.ok) {
        const payload = await response.json();
        screeningId = payload?.screening?.id ?? screeningId;
      } else {
        console.log('Unable to create screening session, using local ID fallback');
      }
    } catch (error) {
      console.log('Error creating screening session:', error);
    }

    navigation.navigate('EKGPlacement', { screeningId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formatBg} pointerEvents="none">
        <HomeBg />
      </View>

      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <BackArrow />
        </View>

        <View style={{ flex: 3 }}>
          <FlatList
            data={InstructionSlides}
            renderItem={({ item }) => <InstructionItems item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width }}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>

        <Paginator data={InstructionSlides} scrollX={scrollX} />

        <View style={[styles.buttonWrapper, { paddingBottom: insets.bottom + 16 }]}>
          <PrimaryBlueButton onPress={handleNext} fullWidth>
            {isLastSlide ? 'Begin Screening' : 'Next'}
          </PrimaryBlueButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  formatBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingLeft: 8,
    zIndex: 100,
  },

  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 12,
  },

  backButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  backButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },
});