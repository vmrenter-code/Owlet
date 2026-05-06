import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Animated, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import InstructionSlides from './InstructionSlides';
import InstructionItems from './InstructionItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import PageBg from '../components/PageBg';
import ScreenBg from '../components/ScreenBg';

const createLocalScreeningId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function ScreeningInstructions() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');

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

  const handleBeginScreening = async () => {
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
        navigation.navigate('PositionChild', { screeningId: resolvedScreeningId });
        return;
      }

      const localScreeningId = createLocalScreeningId();
      console.log('Unable to create screening session, using local ID fallback');
      navigation.navigate('PositionChild', { screeningId: localScreeningId });
      return;
    } catch (error) {
      console.log('Error creating screening session:', error);
      const localScreeningId = createLocalScreeningId();
      navigation.navigate('PositionChild', { screeningId: localScreeningId });
      return;
    }
  };

  return (

    <View style={styles.container}>


      <View style={styles.formatBg}>
              <ScreenBg />
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
          <PrimaryBlueButton onPress={handleBeginScreening}>Begin Screening</PrimaryBlueButton>
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
    zIndex: 0
  },

  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 28,   
    marginBottom: 150,        
    marginTop: 12         
  }
});