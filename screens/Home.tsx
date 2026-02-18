// notice how modal has children, or it's contents in it. refer to modal.tsx for further documentaiton
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import HomeBg from '../components/HomeBg';
import Modal from '../components/Modal';
import BeginScreenBtn from '../components/BeginScreenBtn';
import Card from '../components/Card'
import ToolButton from '../components/ToolButton';

export default function Home() {
  return (
      <ScrollView style={styles.bgContainer} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      >
      <HomeBg/>
     
      <Modal>
        <View>
            <Text style = {styles.headerStyle}>Get Started</Text>
            <View style={styles.buttonContainer}>
                <BeginScreenBtn>
                    <>
                    <Text style = {{ fontSize: 22, color: '#fff'}}>Begin Screening</Text>
                    <Text style = {{ fontSize: 16, color: '#fff'}}>~10 minutes</Text>
                    </>
                </BeginScreenBtn>
            </View>

            <Text style = {styles.headerStyle}>Recent Screenings</Text>
            <View style={styles.cardContainer}>
                <Card>
                </Card>
            </View>

          <Text style = {styles.headerStyle}>Support Tools</Text>
          <View style={styles.toolContainer}>
            <ToolButton></ToolButton>
            <ToolButton></ToolButton>
            <ToolButton></ToolButton>
          </View>


        </View>
      </Modal>
    </ScrollView>
 )
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,  
  },

  buttonContainer: {
    //important! margin between header and it's contents MUST be 16 (for consistency)
    marginTop: 16,
    //makes sure the button sits right on top layer, won't get hidden behind the layers
    zIndex: 20,
    //content between contents and the following section MUST be 28
    marginBottom: 28
  },

  headerStyle: {
    fontSize: 24,
    fontWeight: 'thin'

  },

  cardContainer: {
    marginTop: 16,
    zIndex: 20,
    marginBottom: 28
  },

  toolContainer: {
    marginTop: 16,
    zIndex: 20,
    marginBottom: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },

  scrollContent: {
    flexGrow: 1,
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
  }
});