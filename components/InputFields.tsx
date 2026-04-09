import { View, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';

type InputFieldsProps = {
  placeholder?: string;
  icon?: React.ReactNode;
  maxLength?: number;
};

export default function InputFields({ placeholder, icon, maxLength }: InputFieldsProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#585858"
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
}

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