import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import ImageCard from '../components/ImageCard';

type Slide = {
  id: string;
  title: string;
  description: string;
};

export default function LaunchItems({ item }: { item: Slide }) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>

      {/* IMAGE (top half) */}
      <View style={[styles.imageWrapper, { height: height * 0.5 }]}>
        <ImageCard style={styles.imageCard} />
      </View>

      {/* TEXT (scrollable bottom) */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageWrapper: {
    width: '100%',
  },

  imageCard: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  scrollArea: {
    flex: 1,
  },

 scrollContent: {
  flexGrow: 1,
  paddingBottom: 40,
  justifyContent: 'flex-start',
},

  textWrapper: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },

  title: {
    fontSize: 24,
    fontFamily: 'NotoSans-SemiBold',
    color: '#161B1A',
    marginBottom: 16,
    textAlign: 'center'
  },

  description: {
    fontSize: 16,
    color: '#2E3332',
    marginBottom: 20,
    textAlign: 'center'
  },
});