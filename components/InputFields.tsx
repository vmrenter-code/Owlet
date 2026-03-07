import { View, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';

type InputFieldsProps = {
  placeholder?: string;
  icon?: React.ReactNode;
};

export default function InputFields({ placeholder, icon }: InputFieldsProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.glow]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#585858"
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
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },

  glow: {
    borderColor: '#ffffff',           
    shadowColor: '#000000',           
    shadowOpacity: 0.15,              
    shadowRadius: 8,                  
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,                    
  },

  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'NotoSans-Regular',
    outlineColor: 'transparent',
  },

  iconContainer: {
    marginLeft: 10,
  },
});