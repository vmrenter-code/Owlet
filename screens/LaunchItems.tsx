import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import ImageCard from '../components/ImageCard';

type Slide = {
  id: string;
  title: string;
  description: string;
};

export default function LaunchItems({ item }: { item: Slide }) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>

      <View style={styles.imageWrapper}>
        <ImageCard style={styles.imageCard} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textWrapper}>
          <Text
            style={styles.title}
            accessibilityRole="header"
          >
            {item.title}
          </Text>
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
    flex: 4,
    width: '100%',
  },

  imageCard: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  scrollArea: {
    flex: 4,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    justifyContent: 'center',
  },

  textWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  title: {
    fontSize: 22,
    fontFamily: 'NotoSans-SemiBold',
    color: '#161B1A',
    marginBottom: 8,
    letterSpacing: -0.2,
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#2E3332',
    lineHeight: 21,
    letterSpacing: 0.1,
    marginBottom: 0,
    textAlign: 'center',
  },
});