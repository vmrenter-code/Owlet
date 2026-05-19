import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useState } from 'react';
import React from 'react';

type InputFieldsProps = TextInputProps & {
  icon?: React.ReactNode;
  height?: number;
};

const InputFields = React.forwardRef<TextInput, InputFieldsProps>(({
  icon,
  height = 120,
  multiline,
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      focused && styles.containerFocused,
      multiline && { borderRadius: 20, height, alignItems: 'flex-start' }
    ]}>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          multiline && { textAlignVertical: 'top' }
        ]}
        placeholderTextColor="#aaa"
        multiline={multiline}
        underlineColorAndroid="transparent"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
});

export default InputFields;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  containerFocused: {
    borderColor: '#5f6ae6',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#151515',
    padding: 0,
    margin: 0,
  },

  iconContainer: {
    marginLeft: 10,
  },
});