import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import {clearUser} from '../redux_toolkit/features/users/UserSlice';

const LoginScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '<YOUR_WEB_CLIENT_ID>', // Firebase web client ID
      offlineAccess: true,
    });

    return () => {
      GoogleSignin.signOut(); // Clear token cache
    };
  }, []);

  const handleClick = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkEmailAvailability(userInfo.user.email);
    } catch (error) {
      handleSignInError(error);
    }
  };

  const handleSignInError = error => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('Sign in cancelled by user.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert('Sign in already in progress.');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('Play services not available or outdated.');
    } else {
      Alert.alert('Something went wrong with the sign in.');
    }
  };

  const handleClearCachedToken = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Failed to clear cached token.');
    }
  };

  const checkEmailAvailability = async email => {
    console.log('Email:', email);
    try {
      setIsLoading(true);
      await handleClearCachedToken(); // Clear tokens before request

      const data = {
        loginType: 'google',
        emailid: email,
        contactnumber: '',
      };

      console.log('Data to be sent:', data);
      const res = await dispatch(authNewUserThunk(data));
      handleResponse(res, email);
    } catch (error) {
      handleError(error);
    } finally {
      // Ensure loading state reset
      setIsLoading(false);
    }
  };

  const handleResponse = async (res, email) => {
    const resData = res.payload?.data?.resData?.[0];
    const status = res.payload?.status;

    if (resData) {
      const {emailidVerified, phoneNumberVerified} = resData;

      if (status === 200 && emailidVerified && phoneNumberVerified) {
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(res.payload.data),
        );
        navigation.replace('Home');
      } else {
        handleVerification(emailidVerified, phoneNumberVerified);
      }
    } else if (res.payload?.data?.resData?.length > 1) {
      Alert.alert(
        'More than 1 data is being saved in this id! Please contact your manager.',
      );
    } else if (status === 401) {
      showAlert(
        'Passcode Requested',
        'Login',
        'Passcode has been requested. Please wait.',
      );
    }
  };

  const handleVerification = (emailVerified, phoneVerified) => {
    if (emailVerified && !phoneVerified) {
      showAlert('Phone Number not verified', 'Login');
    } else if (!emailVerified && phoneVerified) {
      showAlert('Email id not verified', 'Login');
    } else if (!emailVerified && !phoneVerified) {
      showAlert('Phone number and email id not verified', 'Login');
    } else {
      showAlert('Something went wrong!', 'Login');
    }
  };

  const handleError = error => {
    console.error('Error occurred:', error);
    Alert.alert('An error occurred. Please try again.');

    if (error.response) {
      const {status} = error.response;
      handleErrorResponse(status);
    } else {
      console.error('Network error:', error.message);
    }
  };

  const handleErrorResponse = status => {
    if (status === 413) {
      Alert.alert('Error 413: The entity is too large.');
    } else if (status === 504) {
      Alert.alert('Error 504: Gateway Timeout.');
    } else if (status === 500) {
      Alert.alert('Error 500: Internal Server Error.');
    }
  };

  const showAlert = (message, navigateTo, title = '') => {
    Alert.alert(
      title || message,
      '',
      [{text: 'OK', onPress: () => navigation.navigate(navigateTo)}],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Google Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Page2')}>
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
