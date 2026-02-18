//Modal -> applicable anywhere from home screen to other needs
//Children allows us to put in whatever contents we want inside the header
import { ReactNode } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window')

type Props = {
    children?: ReactNode;
}

export default function HomeModal({ children }: Props) {
  return (
    <LinearGradient
      colors={["rgba(255, 255, 255, 0)", "rgba(180, 203, 209, 0)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style = {styles.content}>
        {children}
      </View>
     

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff8c',
    width: "100%",
    borderRadius: 38,
    alignSelf: "center",
    //space left for up top
    shadowOffset: {width: 1, height:0},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    position: 'absolute',
    bottom: 0,
  },

  content: {
    //this content style formats any content in the modal. so here, contents are formatted 28 from the edge of the modal
    paddingHorizontal: 28,
    paddingVertical: 28,
  }
});
