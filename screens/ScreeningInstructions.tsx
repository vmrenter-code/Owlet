import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Animated, ViewToken } from 'react-native';

import InstructionSlides from './InstructionSlides';
import InstructionItems from './InstructionItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';

export default function ScreeningInstructions() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
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
        <PrimaryBlueButton>Begin Screening</PrimaryBlueButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 28,   
    marginBottom: 50,        
    marginTop: 12         
  }
});