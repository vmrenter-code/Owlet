import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Animated, ViewToken, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import InstructionSlides from './InstructionSlides';
import InstructionItems from './InstructionItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import ScreenBg from '../components/ScreenBg';

const BUTTON_SIZE = 40;

export default function ScreeningInstructions() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

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

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleNext = () => {
    if (isLastSlide) {
      navigation.navigate('EKGPlacement');
    } else {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formatBg}>
        <ScreenBg />
      </View>

      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={handleBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color="#242424" />
          </Pressable>
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
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>

        <Paginator data={InstructionSlides} scrollX={scrollX} />

        <View style={styles.buttonWrapper}>
          <PrimaryBlueButton onPress={handleNext}>
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
    paddingLeft: 16,
    zIndex: 100,
  },

  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
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