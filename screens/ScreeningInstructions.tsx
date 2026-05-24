import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Animated,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Platform } from 'react-native';

import InstructionSlides from './InstructionSlides';
import InstructionItems from './InstructionItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import HomeBg from '../components/HomeBg';
import { useScreening } from '../context/ScreeningContext';

const createLocalScreeningId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const DURING_SCREENING_SLIDE_INDEX = InstructionSlides.findIndex(
  (slide) => slide.id === '6'
);
const LAST_INSTRUCTION_INDEX =
  DURING_SCREENING_SLIDE_INDEX >= 0
    ? DURING_SCREENING_SLIDE_INDEX
    : InstructionSlides.length - 1;

export default function ScreeningInstructions() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { screeningId: contextScreeningId, setScreeningId } = useScreening();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);

  const syncIndexFromOffset = (offsetX: number) => {
    const index = Math.round(offsetX / width);
    const clamped = Math.max(0, Math.min(index, InstructionSlides.length - 1));
    currentIndexRef.current = clamped;
    setCurrentIndex(clamped);
  };

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        const index = viewableItems[0].index;
        currentIndexRef.current = index;
        setCurrentIndex(index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(index, InstructionSlides.length - 1));
    currentIndexRef.current = clamped;
    setCurrentIndex(clamped);
    slidesRef.current?.scrollToOffset({
      offset: width * clamped,
      animated: true,
    });
  };

  const resolveScreeningId = async (): Promise<string> => {
    if (contextScreeningId) {
      return contextScreeningId;
    }

    const routeScreeningId = route.params?.screeningID ?? route.params?.screeningId;
    if (routeScreeningId) {
      setScreeningId(routeScreeningId);
      return routeScreeningId;
    }

    try {
      const response = await fetch(`${BASE_URL}/screening`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startedAt: new Date().toISOString() }),
      });

      if (response.ok) {
        const payload = await response.json();
        const resolvedScreeningId = payload?.screening?.id ?? createLocalScreeningId();
        setScreeningId(resolvedScreeningId);
        return resolvedScreeningId;
      }
    } catch (error) {
      console.log('Error creating screening session:', error);
    }

    const localScreeningId = createLocalScreeningId();
    setScreeningId(localScreeningId);
    return localScreeningId;
  };

  const handleNext = async () => {
    const index = currentIndexRef.current;

    if (index < LAST_INSTRUCTION_INDEX) {
      scrollToSlide(index + 1);
      return;
    }

    const screeningId = await resolveScreeningId();
    navigation.navigate('EKGPlacement', { screeningId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formatBg}>
        <HomeBg />
      </View>

      <View style={styles.container}>
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
              {
                useNativeDriver: false,
                listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                  syncIndexFromOffset(event.nativeEvent.contentOffset.x);
                },
              }
            )}
            scrollEventThrottle={16}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              scrollToSlide(info.index);
            }}
            ref={slidesRef}
          />
        </View>

        <Paginator data={InstructionSlides} scrollX={scrollX} />

        <View style={styles.buttonWrapper}>
          <PrimaryBlueButton onPress={handleNext}>Next</PrimaryBlueButton>
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

  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 28,
    marginBottom: 150,
    marginTop: 12,
  },
});
