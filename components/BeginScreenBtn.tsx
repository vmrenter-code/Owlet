//Begin Screening Button set up
import { LinearGradient } from 'expo-linear-gradient';
import { View, Pressable, StyleSheet } from 'react-native';

export default function BeginScreenBtn({ children, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && { transform: [{ scale: 1.04 }], opacity: 0.9 },
      ]}
    >
      <LinearGradient
        colors={["#3595B1", "#4CA3B7", "#66B3BF","#A1D9D0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.textContainer}>
          {children}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    //ignore for press
  },

  gradient: {
    width: '100%',  
    height: 98,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height:3},
    shadowOpacity: 0.45,
    shadowRadius: 6,
    borderColor: '#4699ac'
    
  },

  textContainer: {
    //Need container to align title and subtitle on button in the center, evenly divided
    alignItems: 'center',
  },
});