//Begin Screening Button set up
import { LinearGradient } from 'expo-linear-gradient';
import { View, Pressable, StyleSheet, Image } from 'react-native';


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
        colors={["#5FABC7", "#A1D9D0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.buttonRow}>
          




          <View style={styles.textContainer}>
            {children}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {},

  gradient: {
    width: '100%',
    height: 98,
    borderRadius: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    borderColor: '#4699ac',
  },

  buttonRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 30,
  gap: 20
  },


  icon: {
    width: 50,
    height: 50,
  },

  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: 'bold'
  },
});