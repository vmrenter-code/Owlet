import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

type Slide = {
  id: string;
  title: string;
  description: string;
};

export default function InstructionItems({ item }: { item: Slide }) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,          // pushes the whole card downward
    paddingHorizontal: 20,
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 24,        // increases space between title and description
    color: '#444444'
  },
  description: {
    fontSize: 18,
    color: '#858585'
  }
});