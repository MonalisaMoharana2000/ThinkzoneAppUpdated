import React, {useState, useEffect} from 'react';
import {ToastAndroid} from 'react-native';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';

import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../utils/Colors';

import Api from '../environment/Api';
import {
  authNewUserThunk,
  phoneNumberVerifyThunk,
} from '../redux_toolkit/features/users/UserThunk';

const GoogleVerificationPhone = ({navigation, route}) => {
  const user = useSelector(state => state.UserSlice.user);
  console.log(user, 'email page----------------->');
  const phone = route.params.phone;
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [toggleState, setToggleState] = useState(false);

  useEffect(() => {
    GoogleSignin.configure();
  }, []);
  const handleToggle = async value => {
    setToggleState(value);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkemailavailability(userInfo.user.email);
      // this.setState({userInfo});
    } catch (error) {
      // console.log('err--->', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        // console.log('error 4', error);
      }
    }
  };

  const handleClearCachedToken = async () => {
    try {
      await GoogleSignin.signOut();
      // setIsSignedIn(false);

      // Additional logic for opening the Google SDK or navigating to another page
      // ...
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const checkemailavailability = async email => {
    try {
      setIsloading(true);
      const body = {
        emailid: email,
      };

      // Await the API request
      const response = await Api.post(`checkCredentialAvailability`, body);
      console.log('checkcredential----->', response.data);

      if (response.data.status === 'success') {
        const data = {
          loginType: 'otp',
          contactnumber: phone,
          emailid: email,
        };

        handleClearCachedToken();

        // Await the dispatch
        const dispatchResponse = await dispatch(authNewUserThunk(data));
        console.log(
          'Dispatch Response1111111111111111111111:',
          dispatchResponse,
        );
        if (
          dispatchResponse?.payload?.status === 200 &&
          dispatchResponse?.payload?.data?.userExists === false &&
          dispatchResponse?.payload?.data?.unique === true &&
          dispatchResponse?.payload?.data?.contactnumber !== '' &&
          dispatchResponse?.emailid !== ''
        ) {
          navigation.navigate('register', {
            email: email,
            phone: phone,
            loginType: 'phone',
          });
        }
      } else if (
        response.data.status === 'fail' &&
        response.data.unique === false
      ) {
        handleClearCachedToken();
        ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
      } else {
        handleClearCachedToken();
        ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    } finally {
      setIsloading(false); // Ensure loading state is updated
    }
  };

  return (
    <View style={styles.login}>
      <View style={styles.loginChild} />
      <View style={{bottom: 5}}>
        <Text
          style={{
            fontSize: 15,
            color: 'white',
            fontFamily: FontFamily.poppinsMedium,
          }}>
          Verify Your Email ID
        </Text>
        <TouchableOpacity
          onPress={handleToggle}
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
                Verify With Email Id
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Image
        style={[styles.kindergartenStudentPana1, styles.groupChildPosition]}
        resizeMode="cover"
        source={require('../assets/Image/kindergarten-studentpana-1.png')}
      />
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

  byContinuingYou: {
    fontSize: 13,
    color: Color.primaryContrast,
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

export default GoogleVerificationPhone;
