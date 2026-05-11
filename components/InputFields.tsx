import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useState } from 'react';
import React from 'react';

type InputFieldsProps = TextInputProps & {
  icon?: React.ReactNode;
  height?: number;
};

const InputFields = React.forwardRef<TextInput, InputFieldsProps>(({
  icon,
  height = 140,
  multiline,
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      multiline && { borderRadius: 20, height, alignItems: 'flex-start' }
    ]}>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          multiline && { textAlignVertical: 'top' }
        ]}
        placeholderTextColor="#585858"
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
    padding: 17,
    borderColor: '#F0F1F1',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: '#2E3332',
    padding: 0,
    margin: 0,
  },
  iconContainer: {
    marginLeft: 10,
  },
});