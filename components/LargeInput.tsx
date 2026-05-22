import { View, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';

type LargeInputProps = {
  placeholder?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  multiline?: boolean;
  height?: number;
  value?: string;
  onChangeText?: (text: string) => void;
};

export default function LargeInput({ placeholder, icon, maxLength, multiline, height = 140 }: LargeInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      multiline && { borderRadius: 20, height, alignItems: 'flex-start' }
    ]}>
      <TextInput
        style={[
          styles.input,
          multiline && { textAlignVertical: 'top' }
        ]}
        placeholder={placeholder}
        placeholderTextColor="#585858"
        maxLength={maxLength}
        multiline={multiline}
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
    paddingVertical: 14,
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
    fontStyle: 'italic'   
  },

  iconContainer: {
    marginLeft: 10,
  },
});