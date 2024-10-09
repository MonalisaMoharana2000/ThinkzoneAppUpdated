import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import {clearUser} from '../redux_toolkit/features/users/UserSlice';
const LoginScreen = ({navigation}) => {
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
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
      console.log('req------>', res?.payload?.error);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Go to Page 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Navigating to Page 2');
          navigation.navigate('Page2');
        }}>
        <Text style={styles.buttonText}>Go to Page 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
