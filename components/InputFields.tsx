import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import React, { forwardRef } from 'react';

// Merge both versions: support all TextInput props + optional icon
type InputFieldsProps = TextInputProps & {
  placeholder?: string;
  icon?: React.ReactNode;
};

const InputFields = forwardRef<TextInput, InputFieldsProps>(({ placeholder, icon, ...props }, ref) => {
  return (
    <View style={[styles.container]}>
      <TextInput
        ref={ref}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#585858"
        autoComplete="off"
        importantForAutofill="no"
        {...props}
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
    paddingHorizontal: 17,
    paddingVertical: 17,
    borderColor: '#F0F1F1',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },


  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'NotoSans-Regular',
  },

  iconContainer: {
    marginLeft: 10,
  },
});
