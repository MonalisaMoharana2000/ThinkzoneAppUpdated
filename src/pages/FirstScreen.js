import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const FirstScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.splash26}>
      <Image
        style={styles.thinkzoneLogoUpdated1}
        // resizeMode="contain "
        source={require('../assets/Image/thinkzone-logo.png')}
      />
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          top: 90,
          paddingTop: 10,
        }}>
        <Text style={styles.text1}>ଗୁଣାତ୍ମକ ଶିକ୍ଷା ସଭିଙ୍କ ପାଇଁ</Text>
      </View>
      <TouchableOpacity
        // style={styles.splash26Item}
        onPress={() => navigation.navigate('landing')}
        style={{
          margin: 8,
          // paddingLeft: 10,
          // paddingRight: 10,
          paddingTop: 5,
          paddingBottom: 5,
          height: 45,
          borderRadius: 50,
          backgroundColor: Color.royalblue,
          width: 162,
          height: 45,

          position: 'absolute',
          // width: window.WindowWidth * 0.75,
          justifyContent: 'center',
          alignItems: 'center',

          flexDirection: 'row',
          // justifyContent: 'space-between',
          // marginRight: 10,
          alignSelf: 'center',
          bottom: 20,
        }}>
        <Text
          style={{
            width: '100%',
            justifyContent: 'center',
            letterSpacing: 1,
            textAlign: 'center',
            fontFamily: FontFamily.poppinsMedium,
            fontWeight: '500',
            // marginLeft: 50,
            // fontSize: 14,
            fontWeight: '500',
            fontSize: FontSize.size_5xl,
            color: Color.primaryContrast,
            position: 'absolute',
            marginTop: -5,
          }}>
          Start
        </Text>
      </TouchableOpacity>
      {/* <Pressable
        style={styles.splash26Item}
        onPress={() => navigation.navigate('landing')}
      />
      <Text
        onPress={() => navigation.navigate('landing')}
        style={[styles.start, styles.textClr]}>
        Start
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  thinkzoneLogoJpgForWhiteB: {
    top: 715,
    left: -4869,
    width: 1865,
    height: 2162,
    position: 'absolute',
  },
  thinkzoneLogoUpdated1: {
    top: 265,
    // left: 143,
    width: 130,
    height: 130,
    // marginTop: 100,
    position: 'absolute',
    alignSelf: 'center',
  },
  text1: {
    // top: 418,
    // left: 50,
    alignSelf: 'center',
    paddingBottom: 10,
    fontSize: 19.6,
    fontWeight: '660',
    fontFamily: FontFamily.balooBhaina2Medium,
    color: Color.darkslategray_200,
    textAlign: 'center',
    width: 264,

    // height: 42,
    position: 'absolute',
  },

  splash26: {
    backgroundColor: Color.primaryContrast,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default FirstScreen;
