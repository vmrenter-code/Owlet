// notice how modal has children, or it's contents in it. refer to modal.tsx for further documentaiton
// has scrolling, for smaller phone sizes
import { View, StyleSheet, Text, ScrollView, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeBg from '../components/HomeBg';
import Modal from '../components/Modal';
import BeginScreenBtn from '../components/BeginScreenBtn';
import Card from '../components/Card'
import ToolButton from '../components/ToolButton';
import ProfileContainer from '../components/ProfileContainer';

const { height } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1 }}>

      <View style={styles.formatBg}>
        <HomeBg />
      </View>

      <ScrollView 
        style={styles.bgContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.heroContainer}>
          <View>
            <Text style={{fontSize: 30, color: '#fff', fontWeight: 500}}>Hi, User!</Text>
            <Text style={{fontSize: 20, color: '#ffffffee'}}>Screen with confidence.</Text>
          </View>
          <View style ={styles.profileContainer}>
            <ProfileContainer/>
          </View>
        </View>

        <View style={styles.modalContainer}>
          <Modal>
            <View>

              <View style={styles.buttonContainer}>
                <BeginScreenBtn onPress={() => navigation.replace('ScreeningInstructions')}>
                  <>
                    <Text style={{ fontSize: 26, color: '#F8F9E8'}}>Begin Screening</Text>
                    <Text style = {{ fontSize: 16, color: '#F8F9E8'}}>~10 minutes</Text>
                    
                  </>
                </BeginScreenBtn>
              </View>

              <Text style={styles.headerStyle}>Recent Screenings</Text>

              <View style={styles.cardContainer}>
                <Card></Card>
              </View>

              <Text style={styles.headerStyle}>Support Tools</Text>

              <View style={styles.toolContainer}>
                <View>
                  <ToolButton>
                    <Image source = {require('../assets/QuestionMarkCircle.png')} style = {styles.faqStyles}/>
                    <Text style={styles.toolText}>FAQs</Text>
                  </ToolButton>
                </View>

                <View>
                  <ToolButton>
                    <Image source = {require('../assets/Book1.png')} style = {styles.infStyles}/>
                    <Text style={styles.toolText}>Instructions</Text>
                  </ToolButton>
                </View>
              </View>

                <Text style={styles.ignore}>.</Text>

            </View>
          </Modal>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  //fills the entire background with HomeBG
  formatBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  bgContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },

  //Styles for the hero (blue part at the top), ensures responsiveness to dimensions
  heroContainer: {
    flexDirection: 'row',
    width: '100%',
    height: height * 0.32, 
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    zIndex: 2,
    alignItems: 'center'
  },



  modalContainer: {
    marginTop: -38,         
    minHeight: height * 0.26, 
    zIndex: 3,
  },

  buttonContainer: {
    //important! margin between header and it's contents MUST be 16 (for consistency)
    marginTop: 16,
    //makes sure the button sits right on top layer, won't get hidden behind the layers
    zIndex: 20,
    //content between contents and the following section MUST be 28
    marginBottom: 28,
  },

  headerStyle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#737373'
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
    gap: 30
  },

  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  toolText: {
    color: '#737373',
    fontSize: 16

  },
  
  ignore: {
    backgroundColor: '#ffffff00',
    color: '#00000000'
  },

  faqStyles: {
    width: 60,
    height: 60
  },

  infStyles: {
    width: 60,
    height: 60

  }
});