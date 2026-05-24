import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  height?: number;
};

export default function LargeInput({
  height = 100,
  value,
  style,
  ...props
}: Props) {

  const isEmpty = !value || value.length === 0;

  return (
    <View style={[styles.container, { height }]}>
      <TextInput
        {...props}
        value={value}
        style={[
          styles.input,
          style,
          isEmpty && { fontStyle: 'normal' } 
        ]}
        placeholderTextColor="#aaa"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#151515',
    textAlignVertical: 'top',
  },
});