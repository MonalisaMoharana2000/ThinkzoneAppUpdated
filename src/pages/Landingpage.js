// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   Image,
//   ScrollView,
//   Modal,
//   ImageBackground,
// } from 'react-native';
// import * as window from '../utils/dimensions';

// import Color from '../utils/Colors';
// import React, {useEffect, useMemo, useState} from 'react';
// // import TouchableOpacity from 'react-native/Libraries/Components/TouchableOpacity/TouchableOpacity';
// import Login from './Login';
// const Landingpage = ({navigation}) => {
//   const [land, setIsloading] = useState(true);

//   const [modal, setModal] = useState(false);
//   const [modals, setModals] = useState(false);
//   const [modalss, setModalss] = useState(false);
//   const [modalsss, setModalsss] = useState(false);
//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Modal animationType="slide" transparent={true} visible={land}>
//           <View style={styles.centeredView}>
//             <TouchableOpacity onPress={() => setModal(true)}>
//               <ImageBackground
//                 source={require('../assets/Photos/landing.gif')}
//                 style={[styles.root]}></ImageBackground>
//             </TouchableOpacity>
//           </View>
//         </Modal>
//         <Modal animationType="slide" transparent={true} visible={modal}>
//           <View style={styles.centeredView}>
//             <ImageBackground
//               source={require('../assets/Photos/page1.png')}
//               style={[
//                 styles.modalView,
//                 {
//                   height: window.WindowHeigth * 1.1,
//                   marginTop: 90,
//                   width: window.WindowWidth * 1,
//                   borderRadius: 20,
//                 },
//               ]}>
//               <Text
//                 onPress={() => navigation.navigate('login')}
//                 style={{
//                   marginLeft: 280,
//                   marginTop: -25,
//                   textAlign: 'center',
//                   fontSize: 15,
//                   fontWeight: 'bolder',
//                   color: 'black',
//                   width: window.WindowHeigth * 0.1,
//                   backgroundColor: 'black',
//                   color: 'white',
//                   borderRadius: 20,
//                 }}>
//                 Skip--
//               </Text>
//               <Text
//                 style={[
//                   styles.username,
//                   {marginTop: 340, fontSize: 22, color: 'red'},
//                 ]}>
//                 21st Century Skills
//               </Text>
//               <Text style={[styles.p, {marginTop: 40}]}>
//                 21st century skills the Learners to succeed.
//               </Text>
//               <Text style={styles.p}>With a focus on critical thinking,</Text>
//               <Text style={styles.p}>problem-solvingand communications</Text>

//               <TouchableOpacity
//                 onPress={() => setModals(true)}
//                 style={styles.bu}>
//                 <Text
//                   style={{
//                     fontSize: 15,
//                     color: Color.white,
//                     textAlign: 'center',
//                   }}>
//                   Next
//                 </Text>
//               </TouchableOpacity>
//             </ImageBackground>
//           </View>
//         </Modal>
//         <Modal animationType="slide" transparent={true} visible={modals}>
//           <View style={styles.centeredView}>
//             <ImageBackground
//               source={require('../assets/Photos/page2.png')}
//               style={[
//                 styles.modalView,
//                 {
//                   height: window.WindowHeigth * 1.1,
//                   marginTop: 90,
//                   width: window.WindowWidth * 1,
//                   borderRadius: 20,
//                 },
//               ]}>
//               <Text
//                 onPress={() => navigation.navigate('login')}
//                 style={{
//                   marginLeft: 280,
//                   marginTop: -25,
//                   textAlign: 'center',
//                   fontSize: 15,
//                   fontWeight: 'bolder',
//                   color: 'black',
//                   width: window.WindowHeigth * 0.1,
//                   backgroundColor: 'black',
//                   color: 'white',
//                   borderRadius: 20,
//                 }}>
//                 Skip--
//               </Text>
//               <Text
//                 style={[
//                   styles.username,
//                   {marginTop: 340, fontSize: 22, color: 'red'},
//                 ]}>
//                 Activity-based Learning
//               </Text>
//               <Text style={[styles.p, {marginTop: 40}]}>
//                 Bring your classroom to life with the 21st Century
//               </Text>
//               <Text style={styles.p}>
//                 Bring your classroom to life with the 21st Century
//               </Text>
//               <Text style={styles.p}>problem-solvingand communications</Text>

//               <TouchableOpacity
//                 onPress={() => setModalss(true)}
//                 style={[styles.bu, {marginTop: 170}]}>
//                 <Text
//                   style={{
//                     fontSize: 15,
//                     color: Color.white,
//                     textAlign: 'center',
//                   }}>
//                   Next
//                 </Text>
//               </TouchableOpacity>
//             </ImageBackground>
//           </View>
//         </Modal>
//         <Modal animationType="slide" transparent={true} visible={modalss}>
//           <View style={styles.centeredView}>
//             <ImageBackground
//               source={require('../assets/Photos/page3.png')}
//               style={[
//                 styles.modalView,
//                 {
//                   height: window.WindowHeigth * 1.1,
//                   marginTop: 90,
//                   width: window.WindowWidth * 1,
//                   borderRadius: 20,
//                 },
//               ]}>
//               <Text
//                 onPress={() => navigation.navigate('login')}
//                 style={{
//                   marginLeft: 280,
//                   marginTop: -25,
//                   textAlign: 'center',
//                   fontSize: 15,
//                   fontWeight: 'bolder',
//                   color: 'black',
//                   width: window.WindowHeigth * 0.1,
//                   backgroundColor: 'black',
//                   color: 'white',
//                   borderRadius: 20,
//                 }}>
//                 Skip--
//               </Text>
//               <Text
//                 style={[
//                   styles.username,
//                   {marginTop: 340, fontSize: 22, color: 'red'},
//                 ]}>
//                 21st Century Skills
//               </Text>
//               <Text style={[styles.p, {marginTop: 40}]}>
//                 21st century skills the Learners to succeed.
//               </Text>
//               <Text style={styles.p}>With a focus on critical thinking,</Text>
//               <Text style={styles.p}>problem-solvingand communications</Text>

//               <TouchableOpacity
//                 onPress={() => setModalsss(true)}
//                 style={styles.bu}>
//                 <Text
//                   style={{
//                     fontSize: 15,
//                     color: Color.white,
//                     textAlign: 'center',
//                   }}>
//                   Next
//                 </Text>
//               </TouchableOpacity>
//             </ImageBackground>
//           </View>
//         </Modal>
//         <Modal animationType="slide" transparent={true} visible={modalsss}>
//           <View style={styles.centeredView}>
//             <ImageBackground
//               source={require('../assets/Photos/page4.png')}
//               style={[
//                 styles.modalView,
//                 {
//                   height: window.WindowHeigth * 1.1,
//                   marginTop: 90,
//                   width: window.WindowWidth * 1,
//                   borderRadius: 20,
//                 },
//               ]}>s
//               <Text
//                 onPress={() => navigation.navigate('login')}
//                 style={{
//                   marginLeft: 280,
//                   marginTop: -25,
//                   textAlign: 'center',
//                   fontSize: 15,
//                   fontWeight: 'bolder',
//                   color: 'black',
//                   width: window.WindowHeigth * 0.1,
//                   backgroundColor: 'black',
//                   color: 'white',
//                   borderRadius: 20,
//                 }}>
//                 Skip--
//               </Text>
//               <Text
//                 style={[
//                   styles.username,
//                   {marginTop: 340, fontSize: 22, color: 'red'},
//                 ]}>
//                 21st Century Skills
//               </Text>
//               <Text style={[styles.p, {marginTop: 40}]}>
//                 21st century skills the Learners to succeed.
//               </Text>
//               <Text style={styles.p}>With a focus on critical thinking,</Text>
//               <Text style={styles.p}>problem-solvingand communications</Text>

//               <TouchableOpacity
//                 onPress={() => navigation.navigate('login')}
//                 style={[styles.bu]}>
//                 <Text
//                   style={{
//                     fontSize: 15,
//                     color: Color.white,
//                     textAlign: 'center',
//                   }}>
//                   Login
//                 </Text>
//               </TouchableOpacity>
//             </ImageBackground>
//           </View>
//         </Modal>
//         {/* <TouchableOpacity onPress={() => navigation.navigate('login')}>
//           <Image
//             style={styles.tinyLogo}
//             source={require('../assets/Photos/landing.gif')}
//           />
//         </TouchableOpacity> */}
//       </ScrollView>
//     </View>
//   );
// };

// export default Landingpage;

// const styles = StyleSheet.create({
//   tinyLogo: {
//     width: '100%',
//     height: 815,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   p: {
//     fontFamily: 'Arial, Helvetica, sans-serif',
//     letterSpacing: 1,
//     fontWeight: '700',
//     textAlign: 'center',

//     fontSize: 10,

//     color: 'black',

//     marginBottom: 10,
//   },
//   bu: {
//     marginTop: 190,
//     width: '100%',
//     backgroundColor: '#2196f3',
//     padding: 20,
//     borderRadius: 5,
//   },
//   root: {
//     width: window.WindowWidth,
//     height: window.WindowHeigth,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
import * as React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const Landingpage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.splash7}>
      <Text style={styles.text}>କାର୍ଯ୍ୟ ଭିତ୍ତିକ ଶିକ୍ଷଣ</Text>

      <Image
        style={styles.hopscotchBro21}
        resizeMode="cover"
        source={require('../assets/Image/hopscotchbro-2-1.png')}
      />
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
      <TouchableOpacity
        onPress={() => navigation.navigate('landing1')}
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
          // marginTop: 575,
        }}>
        <Text
          style={{
            width: '100%',
            justifyContent: 'center',
            letterSpacing: 1,
            textAlign: 'center',
            fontFamily: FontFamily.poppinsMedium,
            fontSize: FontSize.size_5xl,
            color: Color.primaryContrast,
            position: 'absolute',
            marginTop: -5,
          }}>
          Next
        </Text>
      </TouchableOpacity>
      <Text style={styles.text2}>
        ଆପଣଙ୍କ ଶିକ୍ଷାଦାନ କାର୍ଯ୍ୟକୁ ଏକବିଂଶ ଶତାବ୍ଦୀ କୌଶଳ ସମ୍ବଳିତ ଶିକ୍ଷଣ ଆପ୍
        ମାଧ୍ୟମରେ ଜୀବନ୍ତ କରାନ୍ତୁ । କାର୍ଯ୍ୟ ଭିତ୍ତିକ ଶିକ୍ଷାଦାନ ପ୍ରଣାଳୀକୁ
        ଶିକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ ଆକର୍ଷଣୀୟ ଏବଂ ସହଜସାଧ୍ୟ କରିବା ଲକ୍ଷ୍ୟ ନେଇ ଏହା ପ୍ରସ୍ତୁତ
        କରାଯାଇଛି ।
      </Text>
      <View style={styles.learnAndMakeLearningFunParent}>
        <Text style={[styles.learnAndMake, styles.nextTypo]}>{`Learn and Make
Learning Fun`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ml10: {
    marginLeft: 10,
  },

  nextTypo: {
    textAlign: 'left',
    color: Color.primaryContrast,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    marginTop: -5,
  },
  text: {
    top: 416,
    // left: 47,
    fontSize: FontSize.size_lg,
    fontWeight: '800',
    fontFamily: FontFamily.balooBhaina2Semibold,
    // width: 264,
    // height: 42,
    textAlign: 'center',
    alignSelf: 'center',
    color: Color.darkslategray_200,
    position: 'absolute',
  },
  statusBarBg: {
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  text1: {
    // marginTop: -7.43,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.dimgray_100,
    textAlign: 'right',
    fontSize: 12,
    height: 15,
    top: '50%',
    left: '0%',
    width: '100%',
  },

  statusBarContents: {
    height: '75%',
    width: '22.33%',
    top: '8.33%',
    right: '1.94%',
    bottom: '16.67%',
    left: '75.73%',
    position: 'absolute',
    overflow: 'hidden',
  },
  statusBar: {
    height: '2.62%',
    bottom: '97.38%',
    left: '0%',
    right: '0%',
    top: '0%',
    position: 'absolute',
    width: '100%',
  },
  hopscotchBro21: {
    top: 55,
    // left: 22,
    alignSelf: 'center',
    width: 318,
    height: 299,
    position: 'absolute',
  },
  splash7Child: {
    // top: 58,
    left: 86,
    borderRadius: Border.br_xl,
    width: 189,
    height: 48,
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  next: {
    top: 705,
    left: 148,
    fontSize: FontSize.size_5xl,
    width: 99,
    // height: 30,
    position: 'absolute',
  },
  text2: {
    top: 458,
    // left: 30,
    fontSize: FontSize.componentsButtonLarge_size,
    fontFamily: FontFamily.balooBhaina2Medium,
    width: 320,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
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
    borderRadius: Border.br_7xs,
    width: 34,
    height: 8,
    backgroundColor: Color.royalblue,
  },
  frameItem: {
    width: 8,
    height: 8,
  },
  learnAndMakeLearningFunParent: {
    top: 589,
    left: 143,
    flexDirection: 'row',
    position: 'absolute',
  },
  splash7: {
    backgroundColor: Color.primaryContrast,
    flex: 1,
    height: 800,
    overflow: 'hidden',
    width: '100%',
  },
});

export default Landingpage;
