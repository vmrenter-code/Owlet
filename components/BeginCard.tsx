import { ReactNode } from 'react';
import { View, StyleSheet, Text, Pressable } from "react-native";
import BeginScreenBtn from './BeginScreenBtn';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

type Props = {
  children?: ReactNode;
  onPress?: () => void;
}

export default function Card({ children, onPress }: Props) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.card}>

      <View style={styles.contentRow}>

        <View style={styles.textContainer}>
          <Text style={styles.subHeader}>10 minutes</Text>

          <Text style={styles.cardHeader}>
            Begin Screening
          </Text>

          <Text style={styles.cardText}>
            Start a brief screening that checks for early signs of autism.
          </Text>
        </View>

        <BeginScreenBtn onPress={() => navigation.replace('ScreeningInstructions')}>
          <Svg width={30} height={30} viewBox="0 -960 960 960">
            <Path
              fill="#FFFFFF"
              d="M360-240c-24 14-40 4-40-24v-432c0-28 16-38 40-24l336 216c20 12 20 36 0 48L360-240Z"
            />
          </Svg>
        </BeginScreenBtn>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderColor: '#F0F1F1',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },

  textContainer: {
    flex: 1
  },

  subHeader: {
    fontSize: 15,
    color: '#5A5F5E',
    fontFamily: 'NotoSans-Regular',
    marginBottom: 4
  },

  cardHeader: {
    fontSize: 20,
    color: '#161B1A',
    fontFamily: 'NotoSans-SemiBold',
    marginBottom: 6
  },

  cardText: {
    fontSize: 17,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    lineHeight: 22,
    maxWidth: '90%'
  }
});