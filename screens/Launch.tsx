import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Animated, Easing, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LaunchSlides from './LaunchSlides';
import LaunchItems from './LaunchItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import SkipButton from '../components/SkipButton';
import HomeBg from '../components/HomeBg';
import OnboardingBack from '../components/OnboardingBack';
import NextButton from '../components/NextButton';


export default function Launch() {
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const btnOpacity = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLast = currentIndex === LaunchSlides.length - 1;

  useEffect(() => {
    if (isLast) {
      btnOpacity.setValue(0);
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isLast]);

  const handleNext = () => {
    if (isLast) {
      navigation.navigate('Welcome');
    } else {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleBack = () => {
    slidesRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
  };

  const handleSkip = () => {
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>

      <View style={styles.formatBg}>
        <HomeBg />
      </View>

      <View style={[styles.shell, { paddingTop: insets.top }]}>
        <FlatList
          data={LaunchSlides}
          renderItem={({ item }) => (
           <LaunchItems
  item={item}
  width={width}
  currentIndex={currentIndex}
  totalSlides={LaunchSlides.length}
/>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{  width }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
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

        {isLast && (
          <View style={[styles.backArrowWrapper, { top: insets.top }]}>
            <OnboardingBack onPress={handleBack} />
          </View>
        )}

        <View style={[styles.bottomRow, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {isLast ? (
            <View style={styles.lastRow}>
              <Animated.View style={[{ flex: 1 }, { opacity: btnOpacity }]}>
                <PrimaryBlueButton onPress={handleNext} fullWidth>Let's begin</PrimaryBlueButton>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.navRow}>
              <SkipButton onPress={handleSkip} label="Skip" />
              <Paginator data={LaunchSlides} scrollX={scrollX} />
              <NextButton onPress={handleNext} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },

  formatBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },

  bottomRow: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 12,
    flexShrink: 0,
    zIndex: 10,
    position: 'relative',
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  startButton: {
    flex: 1,
    marginLeft: 16,
  },

  backArrowWrapper: {
    position: 'absolute',
    left: 8,
    zIndex: 100,
  },

  lastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});