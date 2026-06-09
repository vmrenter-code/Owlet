import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
  FlatList,
  ViewToken,
  Easing,
  ListRenderItem
} from 'react-native';
import { API_BASE_URL as BASE_URL } from '../src/config/apiBaseUrl';
import { useNavigation, useRoute } from '@react-navigation/native';

import InstructionSlides from './InstructionSlides';
import InstructionItems from './InstructionItems';
import Paginator from '../components/Paginator';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import HomeBg from '../components/HomeBg';
import ImageCard from '../components/ImageCard';
import { useScreening } from '../context/ScreeningContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SkipButton from '../components/SkipButton';
import NextButton from '../components/NextButton';
import BackArrow from '../components/BackArrow';

const createLocalScreeningId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const LAST_INDEX = InstructionSlides.length - 1;


export default function ScreeningInstructions() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { screeningId: contextScreeningId, setScreeningId } = useScreening();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const btnOpacity = useRef(new Animated.Value(0)).current;
 const viewableItemsChanged = useRef(
  ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;

      currentIndexRef.current = index;
      setCurrentIndex(index);
    }
  }
).current;



const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
const isLast = currentIndex === InstructionSlides.length - 1;

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
    slidesRef.current?.scrollToIndex({ index: next, animated: true });
    return;
  }
  const screeningId = await resolveScreeningId();
  navigation.navigate('EKGPlacement', { screeningId });
};

  const slide = InstructionSlides[currentIndex];

  const handleSkip = () => {
    navigation.navigate('EKGPlacement');
  };

 const renderItem = useCallback(
  ({ item }: { item: (typeof InstructionSlides)[number] }) => (
    <InstructionItems
      item={item}
      width={width}
    />
  ),
  [width]
);

  

 return (
     <View style={styles.container}>
 
       <View style={styles.formatBg}>
         <HomeBg />
       </View>
 
       <View style={[styles.shell, { paddingTop: insets.top }]}>
        <BackArrow />
        <FlatList
  data={InstructionSlides}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  removeClippedSubviews
  initialNumToRender={1}
  maxToRenderPerBatch={1}
  windowSize={3}
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
              <Paginator data={InstructionSlides} scrollX={scrollX} />
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