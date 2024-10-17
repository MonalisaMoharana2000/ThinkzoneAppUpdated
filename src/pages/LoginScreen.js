import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Color, FontFamily} from '../GlobalStyle';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import * as window from '../utils/dimensions';
import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import {clearUser} from '../redux_toolkit/features/users/UserSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YouTube from 'react-native-youtube-iframe';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {width: screenWidth} = Dimensions.get('window');
  const responsiveWidth = screenWidth * 0.9;
  const responsiveHeight = (responsiveWidth * 9) / 16;
  const [isLoading, setIsloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }

  useEffect(() => {
    GoogleSignin.configure();
    return () => {
      GoogleSignin.signOut();
    };
  }, []);

  const handleClick = async () => {
    console.log('Navigating to Page 1 (handleClick function)');
    // navigation.navigate('Page1');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkEmailAvailability(userInfo.user.email);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  const handleClearCachedToken = async () => {
    // setIsloading(false);
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const checkEmailAvailability = async email => {
    console.log('Email:', email);

    try {
      setIsloading(true);

      handleClearCachedToken();
      const data = {
        loginType: 'google',
        emailid: email,
        contactnumber: '',
      };
      console.log('Data to be sent:', data);

      // Dispatch the action for creating a new user
      const res = await dispatch(authNewUserThunk(data));
      console.log('================pscd request-------->', res);

      const resData = res.payload?.data?.resData?.[0];
      const status = res.payload?.status;
      console.log('req------>', res?.payload?.data);
      const error = res?.payload?.error;
      if (resData) {
        const {emailidVerified, phoneNumberVerified} = resData;

        if (status === 200 && emailidVerified && phoneNumberVerified) {
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify(res.payload.data),
          );
          navigation.navigate('Home');
        } else if (emailidVerified && !phoneNumberVerified) {
          showAlert('Phone Number not verified', 'Login');
        } else if (!emailidVerified && phoneNumberVerified) {
          showAlert('Email id not verified', 'Login');
        } else if (!emailidVerified && !phoneNumberVerified) {
          showAlert('Phone number and email id not verified', 'Login');
        } else {
          showAlert('Something went wrong!', 'Login');
        }
      } else if (res.payload?.data?.resData?.length > 1) {
        Alert.alert(
          'More than 1 data is being saved in this id! Please contact your manager.',
          '',
          [{text: 'OK', style: 'destructive'}],
          {cancelable: false},
        );
      } else if (status === 401 && error?.passcodeStatus === 'requested') {
        showAlert(
          'Passcode Requested',
          'Login',
          'Passcode has been requested. Please wait.',
        );
      } else if (status === 401 && error?.passcodeStatus === 'rejected') {
        showAlert(
          'Passcode  Rejected',
          'Login',
          'Passcode has been Rejected. Please wait.',
        );
      } else if (status === 400) {
        Alert.alert(
          'Info',
          `${msg}`,
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearUser());
                navigation.navigate('Login');
              },
              style: 'default',
            },
          ],
          {cancelable: false},
        );
      } else if (status === 502) {
        Alert.alert(
          'Server Not Responding',
          `We are working to fix this as soon as possible, please try again in a short while.`,
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearUser());
                navigation.navigate('Login');
              },
              style: 'default',
            },
          ],
          {cancelable: false},
        );
      } else if (status === 500) {
        Alert.alert(
          'Server Issue',
          `We are working to fix this as soon as possible, please try again in a short while.`,
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearUser());
                navigation.navigate('Login');
              },
              style: 'default',
            },
          ],
          {cancelable: false},
        );
      }

      console.log('===================res', res.payload?.data);

      if (
        res.payload?.data?.userExists === false &&
        res.payload?.data?.unique === true &&
        res.payload?.data?.contactnumber?.length === 0 &&
        res.payload?.data?.emailid
      ) {
        navigation.navigate('Page1', {email: email});
      }

      if (res.payload?.data?.status === 'accessDenied') {
        navigation.navigate('Login');
      }

      // Ensure the loading indicator is shown for at least 9 seconds
      setTimeout(() => {
        setIsloading(false);
      }, 9000);
    } catch (error) {
      console.log('Error occurred:', error);

      // Ensure the loading state is reset in case of an error
      setIsloading(false);

      if (error.response) {
        const {status} = error.response;

        if (status === 413) {
          console.error('Error 413: Entity too large.');
          Alert.alert('Error', 'The entity is too large!');
        } else if (status === 504) {
          console.error('Error 504: Gateway Timeout.');
          Alert.alert(
            'Error',
            'Gateway Timeout: The server is not responding!',
          );
        } else if (status === 500) {
          console.error('Error 500: Internal Server Error.');
          Alert.alert(
            'Error',
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Unknown error:', error);
          Alert.alert('Error', 'An unexpected error occurred.');
        }
      } else {
        // Handle cases where `error.response` is undefined (like network errors)
        console.error('Network or other error:', error.message);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const showAlert = (message, navigateTo, title = '') => {
    Alert.alert(
      title || message,
      '',
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearUser());
            navigation.navigate(navigateTo);
          },
          style: 'default',
        },
      ],
      {cancelable: false},
    );
  };

  const questionsAndVideos = [
    {
      id: 'IlozDODJE34',
      question: 'ଯିଏ ପ୍ରଥମ ଥର ଥିଙ୍କଜୋନ୍ ଆପ୍ପ ରେ ଗୁଗଲ୍ ମାଧ୍ୟମରେ ଲଗ୍ ଇନ କରିବେ...',
    },
    {
      id: 'DW5_eyF9wyQ',
      question:
        'ଯିଏ ପ୍ରଥମ ଥର ଥିଙ୍କଜୋନ୍ ଆପ୍ପ ରେ ନିଜ ଫୋନ୍‌ ନମ୍ବର ମାଧ୍ୟମରେ ଲଗ୍ ଇନ କରିବେ...',
    },
  ];

  return (
    <View style={styles.login}>
      <View
        style={{
          position: 'absolute',
          top: window.WindowHeigth * 0.013, // 1.5% of screen height
          right: window.WindowWidth * 0.255, // 25.5% of screen width
          zIndex: 1,
        }}>
        <TouchableOpacity
          onPress={() => setIsPlaying(true)}
          style={styles.circleButton}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: window.WindowWidth * 0.5, // Adjust width as needed
            }}>
            <Text
              style={{
                marginRight: 3,
                color: '#0072A0',
                fontSize: 12,
                fontWeight: '900',
                fontFamily: FontFamily.robotoBold,
                borderWidth: 1.2,
                borderColor: '#0072A0',
                padding: 1,
                borderRadius: 5,
              }}>
              {' '}
              Instruction
            </Text>
            <Image
              source={require('../assets/Image/icons8-info.gif')} // Replace 'yourGif.gif' with the path to your GIF file
              style={{width: 35, height: 35}} // Adjust width, height, and margins as needed
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.loginChild} />

      <View style={{bottom: 5}}>
        <TouchableOpacity
          onPress={handleClick}
          style={{
            top: 15,
            margin: 8,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 5,
            paddingBottom: 5,
            height: 45,
            width: window.WindowWidth * 0.75,
            justifyContent: isLoading ? 'center' : 'flex-start',
            alignItems: 'center',
            marginTop: 420,
            backgroundColor: 'white',
            flexDirection: 'row',
            // justifyContent: 'space-between',
            marginRight: 10,
            marginLeft: 50,
            borderRadius: 22,
          }}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{}} />
          ) : (
            <>
              <Image
                source={require('../assets/Photos/googles.png')}
                style={{
                  width: 24,
                  height: 24,
                  // marginTop: -1,

                  // justifyContent: 'center',
                  marginRight: 15,
                }}
              />
              <Text
                style={{
                  width: '100%',

                  textAlign: 'left',

                  fontSize: 13,
                  width: 250,
                  fontWeight: '500',
                  color: '#333333',
                  fontFamily: FontFamily.poppinsMedium,
                }}>
                Continue With Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.mobilrno}
          onPress={() => {
            console.log('Navigating to Page 2');
            navigation.navigate('Page2');
          }}>
          <Image
            source={require('../assets/Image/pngwing.png')}
            style={{
              marginTop: -1,
              marginLeft: -7,
              width: 26,
              height: 26,
            }}
          />
          <Text
            style={{
              width: '100%',
              // marginTop: -12,
              // justifyContent: 'center',
              // letterSpacing: 1,
              textAlign: 'left',
              left: 7,
              // marginLeft: 50,
              fontSize: 13,
              width: 250,
              fontWeight: '500',
              color: '#333333',
              fontFamily: FontFamily.poppinsMedium,
            }}>
            Continue With Mobile No.
          </Text>
        </TouchableOpacity> */}
      </View>

      <TouchableOpacity
        style={styles.byContinuingYou}
        onPress={() =>
          Linking.openURL('https://sites.google.com/view/thinkzoneapp/home')
        }>
        <Text
          style={{
            fontSize: 13,
            color: Color.primaryContrast,
            textAlign: 'center',
            marginTop: 30,
            width: 315,
            alignSelf: 'center',
            fontFamily: FontFamily.poppinsMedium,
            fontWeight: '500',
          }}>
          By continuing, You Agree to Our Terms and Conditions Privacy Policy
        </Text>
      </TouchableOpacity>

      <Image
        style={[styles.kindergartenStudentPana1, styles.groupChildPosition]}
        resizeMode="cover"
        source={require('../assets/Image/kindergarten-studentpana-1.png')}
      />

      {/* <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Go to Page 1</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Navigating to Page 2');
          navigation.navigate('Page2');
        }}>
        <Text style={styles.buttonText}>Go to Page 2</Text>
      </TouchableOpacity> */}
      <Modal
        visible={isPlaying}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPlaying(false)}>
        <ScrollView style={styles.modalContainer}>
          <View
            style={{
              backgroundColor: '#0060ca',
              height: 66,
              width: window.WindowWidth * 1.1,
              marginTop: -16,
              marginLeft: -1,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                marginTop: 25,
                marginLeft: 25,
                // textAlign: 'center',
              }}>
              INSTRUCTION
            </Text>
            <TouchableOpacity
              onPress={() => setIsPlaying(false)}
              style={{
                position: 'absolute',
                top: '30%',
                right: '14%',
                backgroundColor: 'white', // Semi-transparent white background
                borderRadius: 50, // Border radius
                padding: 5, // Padding inside the button
              }}>
              <Icon name="close" size={25} color={Colors.royalblue} />
            </TouchableOpacity>
          </View>
          {questionsAndVideos &&
            questionsAndVideos.length &&
            questionsAndVideos.map((item, index) => (
              <View key={index}>
                <View style={styles.videoContainer}>
                  <View style={{marginBottom: 10}}>
                    <Text style={styles.questionText}>{item.question}</Text>
                  </View>
                  <YouTube
                    videoId={item.id}
                    width={responsiveWidth - 25} // Subtract padding from width
                    height={responsiveHeight - 10} // Subtract padding from height
                    webViewStyle={{
                      opacity: 0.99,
                      display: isReadyForRender ? 'flex' : 'none',
                    }}
                    webViewProps={{
                      androidLayerType: isReadyForRender
                        ? 'hardware'
                        : 'software',
                    }}
                    onReady={onReady}
                    onChangeState={event => {
                      console.log('State:', event.state);
                      // if (event.state === 'ended') {
                      //   setFocusedIndex(null); // Reset focused index when the video ends
                      // }
                    }}
                    onError={error => console.log('Error:', error)}
                    onEnd={() => setIsPlaying(false)}
                  />
                </View>
              </View>
            ))}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  groupChildPosition: {
    left: 0,
    position: 'absolute',
  },

  loginChild: {
    top: 370,
    // marginTop: 420,
    left: -25,
    borderRadius: 72,
    backgroundColor: Color.royalblue,
    width: window.WindowWidth * 1.2,
    // height: 470,
    // alignSelf: 'center',
    height: window.WindowHeigth * 0.8,
    transform: [
      {
        rotate: '-10deg',
      },
    ],
    position: 'absolute',
  },

  circleButton: {
    width: 30,
    height: 35,
    // borderWidth: 1,
    // borderRadius: 12,
    // borderColor: 'grey',
    // backgroundColor: Colors.royalblue,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    fontWeight: '800',
    fontFamily: FontFamily.poppinsMedium,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: Colors.lightSky,
    height: '100%',
  },
  // questionContainer: {
  //   backgroundColor: 'white',
  //   textAlign: 'left',
  //   // padding: 23,
  //   paddingTop: 10,
  //   paddingLeft: 20,
  //   marginTop: 20,
  //   borderRadius: 10,
  //   // shadowColor: '#000',
  //   // shadowOffset: {
  //   //   width: 0,
  //   //   height: 2,
  //   // },
  //   // shadowOpacity: 0.25,
  //   // shadowRadius: 3.84,
  //   // elevation: 5,
  // },
  questionText: {
    fontSize: 17,
    // color: 'black',
    // textAlign: 'center',
    color: Colors.lightDark,
    fontWeight: '800',
    fontFamily: FontFamily.robotoRegular,
  },

  videoContainer: {
    // padding: 10,
    // marginBottom: 20,
    // backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },

  closeButton: {
    // marginTop: 20,
    // backgroundColor: Color.royalblue,
    // padding: 10,
    // borderRadius: 20,
    // alignSelf: 'center',
    alignContent: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    // textAlign: 'center',
    // width: 60,
    fontWeight: '800',
    fontFamily: FontFamily.poppinsMedium,
  },

  byContinuingYou: {
    fontSize: 13,
    color: Color.royalblue,
    textAlign: 'center',
    marginTop: 30,
    width: 315,
    alignSelf: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    position: 'absolute',
    bottom: 5,
  },

  kindergartenStudentPana1: {
    top: 5,
    // width: 490,
    width: window.WindowWidth * 1.21,

    marginLeft: -25,
    height: window.WindowWidth * 0.9,
  },
  login: {
    flex: 1,
    height: 800,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: Color.primaryContrast,
  },
  google: {},
  whatsapp: {
    top: 15,
    margin: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    width: window.WindowWidth * 0.75,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginRight: 10,
    marginLeft: 50,
    borderRadius: 22,
    marginTop: 20,
  },
  mobilrno: {
    margin: 8,
    top: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    width: window.WindowWidth * 0.75,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginRight: 10,
    marginLeft: 50,
    borderRadius: 22,
    marginTop: 20,
    // position: 'absolute',
  },
});

export default LoginScreen;
