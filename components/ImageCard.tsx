import { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Image, Dimensions } from 'react-native';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  imageSource?: any; // optional background image
};

export default function ImageCard({ children, style, imageSource }: Props) {
  const { width, height } = Dimensions.get('window'); // full screen

  return (
    <View style={[styles.card, style]}>
      {imageSource && (
        <Image
          source={imageSource}
          style={styles.background}
          resizeMode="cover" // fill while maintaining aspect ratio
        />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 400, // adjust as needed or pass via style prop
    overflow: 'hidden', // THIS clips children like HTML
    backgroundColor: '#ffffff',
    borderColor: '#F0F1F1',
    borderWidth: 1,
    shadowColor: '#0000000e',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 1,
  },

  background: {
    ...StyleSheet.absoluteFillObject, // fills the parent
    width: undefined,
    height: undefined,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
  },
});