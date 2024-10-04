import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Color, FontFamily} from '../GlobalStyle';
import {black} from 'react-native-paper/lib/typescript/styles/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Nocontents = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Image
            source={require('../assets/Image/Group76686.png')}
            style={styles.image}
          />
          <View style={styles.blankSpace} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Nocontents;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: 'black',
    // backgroundColor: Color.ghostwhite,
    backgroundColor: '#595F65',
  },
  container: {
    flex: 1,
    paddingTop: (windowHeight * 0.3) / 2, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.ghostwhite, // Change this background color if needed
  },
  image: {
    width: windowWidth * 0.8, // Adjust as needed
    height: windowWidth * 0.99, // Maintain the aspect ratio
    marginBottom: 200,
  },
  blankSpace: {
    height: 20, // Adjust the height as needed
    backgroundColor: Color.ghostwhite,
  },
  text: {
    color: '#595F65',
    fontSize: 16,
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
