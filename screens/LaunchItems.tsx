import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ImageCard from '../components/ImageCard';

type Slide = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  item: Slide;
  width: number;
  slideHeight: number;
};

export default function LaunchItems({ item, width, slideHeight }: Props) {
  const imageHeight = Math.round(slideHeight * 0.52);
  const textHeight = slideHeight - imageHeight;

  return (
    <View style={[styles.container, { width, height: slideHeight }]}>
      <View style={[styles.imageWrapper, { height: imageHeight }]}>
        <ImageCard style={styles.imageCard} />
      </View>

      <ScrollView
        style={[styles.textSection, { height: textHeight }]}
        contentContainerStyle={styles.textContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} accessibilityRole="header">
          {item.title}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
  },
  imageCard: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    width: '100%',
  },
  textContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'NotoSans-SemiBold',
    color: '#161B1A',
    marginBottom: 10,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#2E3332',
    lineHeight: 21,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
