import React, {useState, useEffect, useRef} from 'react';
import Colors from '../utils/Colors';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  ToastAndroid,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
  Alert,
  BackHandler,
} from 'react-native';
import {clearUser} from '../redux_toolkit/features/users/UserSlice';
import * as window from '../utils/dimensions';
import {useDispatch} from 'react-redux';

import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Color} from '../GlobalStyle';
import {ScrollView} from 'react-native-gesture-handler';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
const App = ({navigation}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const loginChildPosition = useRef(new Animated.Value(370)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          {cancelable: false},
        );

        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    GoogleSignin.configure();
    return () => {
      GoogleSignin.signOut();
    };
  }, []);

  const handleClearCachedToken = async () => {
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

  const handleToggle = async value => {
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

  const checkEmailAvailability = async email => {
    console.log('Email:', email);

    try {
      setLoader(true);

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
      console.log('req------>', res?.payload?.error);
      const error = res?.payload?.error;
      if (resData) {
        const {emailidVerified, phoneNumberVerified} = resData;

        if (status === 200 && emailidVerified && phoneNumberVerified) {
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify(res.payload.data),
          );
          navigation.replace('Home');
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
        setLoader(false);
      }, 9000);
    } catch (error) {
      console.log('Error occurred:', error);

      // Ensure the loading state is reset in case of an error
      setLoader(false);

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
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Animated.View
            style={[styles.loginChild, {top: loginChildPosition}]}
          />
          <Image
            style={[styles.kindergartenStudentPana1, styles.groupChildPosition]}
            resizeMode="cover"
            source={require('../assets/Image/kindergarten-studentpana-1.png')}
          />

          <View>
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
                justifyContent: loader ? 'center' : 'flex-start',
                alignItems: 'center',
                marginTop: 420,
                backgroundColor: 'white',
                flexDirection: 'row',
                // justifyContent: 'space-between',
                marginRight: 10,
                marginLeft: 50,
                borderRadius: 22,
              }}>
              {loader ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                  style={{}}
                />
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb', // Light grayish-blue background for a clean look
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  loginChild: {
    position: 'absolute',
    left: -25,
    borderRadius: 72,
    backgroundColor: Color.royalblue,
    width: window.WindowWidth * 1.2,
    height: window.WindowHeigth * 0.8,
    transform: [{rotate: '-10deg'}],
  },
  kindergartenStudentPana1: {
    width: window.WindowWidth * 1.18,
    height: window.WindowWidth * 0.9,
  },
  groupChildPosition: {
    left: -25,
    position: 'absolute',
  },
  inputWrapper: {
    width: '85%',
    alignSelf: 'center',
    top: '42%', // Adjust positioning to allow more space for the logo above
    backgroundColor: '#ffffff', // White background for the input area
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 10,
    height: 55,
    backgroundColor: '#f0f0f5', // Subtle white shade for input background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d5dd', // Light border color for a subtle outline
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  input: {
    color: '#333', // Darker text color for readability
    fontSize: 16,
    fontFamily: FontFamily.poppinsRegular,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'left',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#007BFF', // Blue background for the button
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },
  loginButton: {
    borderWidth: 0,
  },
  buttonText: {
    color: '#fff', // White text on the blue button
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
  },
  termsContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  termsText: {
    fontSize: 13,
    color: '#000000', // Muted text color for terms text
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    marginBottom: 5,
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: '#007BFF', // Blue color for emphasized text
  },
});

export default App;
