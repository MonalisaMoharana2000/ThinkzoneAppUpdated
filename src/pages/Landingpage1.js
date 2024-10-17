import * as React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import {ScrollView} from 'react-native-gesture-handler';

const Landingpage1 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.splash12}>
      <Text style={styles.text}>ଏକବିଂଶ ଶତାବ୍ଦୀ କୌଶଳ</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{
          marginTop: 10,
          alignItems: 'flex-end',
          marginRight: 10,
        }}>
        <Text
          style={{
            backgroundColor: Color.royalblue,
            width: 57,
            // height: 20,
            borderRadius: 20,
            color: 'white',
            fontSize: 12,
            textAlign: 'center',
            paddingBottom: 5,
            paddingTop: 5,
          }}>
          Skip
        </Text>
      </TouchableOpacity>
      {/* <Pressable
        style={styles.splash12Child}
        onPress={() => navigation.navigate('login')}
      />
      <Text
        onPress={() => navigation.navigate('login')}
        style={[styles.next, styles.nextTypo, styles.nextPosition]}>
        Next
      </Text> */}
      <TouchableOpacity
        // style={styles.splash26Item}
        onPress={() => navigation.navigate('Login')}
        style={{
          margin: 8,
          // paddingLeft: 10,
          // paddingRight: 10,
          // paddingTop: 5,
          // paddingBottom: 5,
          position: 'absolute',
          bottom: 25,
          borderRadius: Border.br_xl,
          backgroundColor: Color.royalblue,
          width: 162,
          height: 45,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
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
          Next
        </Text>
      </TouchableOpacity>
      <Text style={styles.text2}>
        {' '}
        ଏକବିଂଶ ଶତାବ୍ଦୀ କୌଶଳ ଶିକ୍ଷାର୍ଥୀଙ୍କ ସମାଲୋଚନାତ୍ମକ ଚିନ୍ତାଧାରା , ସମସ୍ଯା
        ସମାଧାନ ଓ ଯୋଗାଯୋଗ ଦକ୍ଷତାର ବିକାଶ କରିଥାଏ ।
      </Text>
      <View style={[styles.learnAndMakeLearningFunParent, styles.nextPosition]}>
        <Text style={[styles.learnAndMake, styles.nextTypo]}>{`Learn and Make
Learning Fun`}</Text>
        {/* <Image
          style={[styles.frameChild, styles.ml10]}
          resizeMode="cover"
          source={require('../assets/Image/ellipse.png')}
        />
        <View style={[styles.frameItem, styles.ml10]} /> */}
      </View>
      {/* <Image
        style={styles.splash12Item}
        resizeMode="cover"
        source={require('../assets/Image/Group.png')}
      /> */}
      <Image
        style={styles.connectedWorldBro11}
        resizeMode="cover"
        source={require('../assets/Image/Connected.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    top: 420,
    // left: 47,
    fontSize: FontSize.size_lg,
    fontWeight: '800',
    fontFamily: FontFamily.balooBhaina2Semibold,
    width: 264,
    height: 42,
    textAlign: 'center',
    color: Color.darkslategray_200,
    position: 'absolute',
    alignSelf: 'center',
  },

  text2: {
    top: 460,
    // left: 20,
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: FontFamily.balooBhaina2Medium,
    width: 340,
    fontWeight: '600',
    textAlign: 'center',
    color: Color.darkslategray_200,
    position: 'absolute',
  },
  learnAndMake: {
    width: 144,
    height: 47,
    display: 'none',
    fontSize: 12,
  },
  frameChild: {
    width: 8,
    height: 8,
  },
  frameItem: {
    borderRadius: Border.br_7xs,
    width: 34,
    height: 8,
    backgroundColor: Color.royalblue,
  },
  learnAndMakeLearningFunParent: {
    top: 600,
    flexDirection: 'row',
  },
  splash12Item: {
    top: 505,
    left: 160,
    width: 70,
    height: 84,
    position: 'absolute',
  },
  connectedWorldBro11: {
    top: 64,
    // left: 0,
    alignSelf: 'center',
    width: 353,
    height: 310,
    position: 'absolute',
  },
  splash12: {
    backgroundColor: Color.primaryContrast,
    flex: 1,
    height: 800,
    overflow: 'hidden',
    width: '100%',
    // justifyContent: 'space-evenly',
  },
});

export default Landingpage1;
