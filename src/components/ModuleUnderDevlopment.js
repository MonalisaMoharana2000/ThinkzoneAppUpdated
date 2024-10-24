import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {Color, FontFamily} from '../GlobalStyle';
import {black} from 'react-native-paper/lib/typescript/styles/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModuleUnderDevlopment = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Image
            source={require('../assets/Image/moduleUnderMnt.png')}
            style={styles.image}
          />
          {/* <View style={styles.blankSpace} /> */}
          <Text style={styles.Fln}>
            ଏହି ବିଭାଗରେ କିଛି ଜରୁରୀ ପରିବର୍ତ୍ତନ କରାଯାଉଅଛି । ପରେ ଚେଷ୍ଟା କରନ୍ତୁ ।
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ModuleUnderDevlopment;

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
    // paddingTop: (windowHeight * 0.3) / 2, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.ghostwhite, // Change this background color if needed
  },
  image: {
    width: windowWidth * 0.8, // Adjust as needed
    height: windowWidth * 0.85, // Maintain the aspect ratio
    marginBottom: 50,
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
    // paddingHorizontal: 20,
  },
  Fln: {
    color: '#595F65',
    fontSize: 18,
    fontFamily: FontFamily.poppinsMedium,
    width: windowWidth * 0.88,
    // paddingBottom: 40,
    // paddingTop: 20,
    // paddingLeft: 20,
    paddingRight: 10,
    paddingLeft: 10,
    // paddingRight: 40,
    textAlign: 'center',
    alignSelf: 'center',
    bottom: 0,
  },
});
