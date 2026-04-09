import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Animated, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LaunchSlides from './LaunchSlides';
import LaunchItems from './LaunchItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import PrimaryWhiteButton from '../components/PrimaryWhiteButton';
import ScreenBg from '../components/ScreenBg';

export default function Launch() {
  const navigation = useNavigation<any>();
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


      <View style={styles.formatBg}>
              <ScreenBg />
      </View>



      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <FlatList
            data={LaunchSlides}
            renderItem={({ item }) => <LaunchItems item={item} />}
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

        <Paginator data={LaunchSlides} scrollX={scrollX} />


        <View style={styles.buttonWrapper}>
          <PrimaryBlueButton onPress={() => navigation.navigate('Signup')}>Create Account</PrimaryBlueButton>
          <PrimaryWhiteButton onPress={() => navigation.navigate('Login')}>Login</PrimaryWhiteButton>
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
    marginBottom: 50,        
    marginTop: 12,
    gap: 20         
  }
});