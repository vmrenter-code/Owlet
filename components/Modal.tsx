//Modal -> applicable anywhere from home screen to other needs
//Children allows us to put in whatever contents we want inside the header
import { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window')

type Props = {
    children?: ReactNode;
}

export default function HomeModal({ children }: Props) {
  return (
    <View style = {styles.card}>
      <View style = {styles.content}>
          { children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    //crucial: position: absolute makes modal behave indepently, and thus lets any input contents flow freely. also puts the modal at the bottom of the screen
    position: 'absolute',
    backgroundColor: "#fff",
    width: "100%",
    height: "80%",
    borderRadius: 38,
    alignSelf: "center",
    //space left for up top
    top: width * 0.50,
    opacity: 0.67
  },

  content: {
    //this content style formats any content in the modal. so here, contents are formatted 28 from the edge of the modal
    paddingHorizontal: 28,
    paddingVertical: 28,
  }
});
