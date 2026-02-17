// notice how modal has children, or it's contents in it. refer to modal.tsx for further documentaiton
import { View, StyleSheet, Text } from 'react-native';

import HomeBg from '../components/HomeBg';
import Modal from '../components/Modal';
import BeginScreenBtn from '../components/BeginScreenBtn';

export default function Home() {
  return (
    <View style={styles.bgContainer}>
      <HomeBg/>
      <Modal>
        <View>
            <Text style = {styles.headerStyle}>Get Started</Text>

            <View style={styles.buttonContainer}>
                <BeginScreenBtn>
                    <>
                    <Text style = {{ fontSize: 28, color: '#fff', fontWeight: 400}}>Begin Screening</Text>
                    <Text style = {{ fontSize: 18, color: '#fff'}}>~10 minutes</Text>
                    </>
                </BeginScreenBtn>
            </View>

            <Text style = {styles.headerStyle}>Recent Screenings</Text>
            <Text style = {styles.headerStyle}>Support Tools</Text>
        </View>
      </Modal>
    </View>
  );
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
    width: '100%',
    //content between contents and the following section MUST be 28
    marginBottom: 28
  },

  headerStyle: {
    fontSize: 28
  }
});