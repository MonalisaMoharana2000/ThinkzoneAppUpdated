import React, {useState, useEffect, useRef} from 'react';
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
} from 'react-native';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Color} from '../GlobalStyle';

const App = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loginScale = new Animated.Value(1);
  const registerScale = new Animated.Value(1);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [borderColorAnimation] = useState(new Animated.Value(0));
  const debounceTimer = useRef(null);
  const dispatch = useDispatch();
  const handlePressIn = scale => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = scale => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderColorAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleUserIdChange = text => {
    setUserId(text);
    setUserIdError(''); // Clear error while typing

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      validateUserId(text);
    }, 1000);
  };

  const handlePasswordChange = text => {
    setPassword(text);
    setPasswordError(''); // Clear error while typing
  };

  const validateUserId = text => {
    if (text.length === 0) {
      setUserIdError('');
    } else if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text) &&
      !/^\d{10,}$/.test(text)
    ) {
      setUserIdError('Enter a valid email or phone number');
      startShakeAnimation();
    } else {
      setUserIdError('');
    }
  };

  const validatePassword = () => {
    if (password.length === 0) {
      setPasswordError('Password is required');
      startShakeAnimation();
    } else {
      setPasswordError('');
    }
  };

  const startShakeAnimation = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    setUserIdError('');
    setPasswordError('');
    if (!userId && !password) {
      setUserIdError('User ID is required');
      setPasswordError('Password is required');
      startShakeAnimation();
      return;
    } else if (!userId) {
      setUserIdError('User ID is required');
      startShakeAnimation();
      return;
    } else if (!password) {
      setPasswordError('Password is required');
      startShakeAnimation();
      return;
    }
    validateUserId(userId);
    validatePassword();
    try {
      const data = {
        id: userId,
        password: password,
      };

      if (!userIdError && !passwordError && userId && password) {
        console.log('Logged in');
        const res = await dispatch(authNewUserThunk(data));
        console.log('req------->', res.payload);
        if (res?.payload?.error?.status === 401) {
          console.log('req1------->', res?.payload?.data?.msg);
          setPasswordError(res?.payload?.error?.data?.msg);
        } else if (res.payload?.status === 200) {
          ToastAndroid.show('Logged In', ToastAndroid.SHORT);
          navigation.navigate('Home');
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify(res.payload.data),
          );
        }
      }
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

  const borderColor = borderColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F0F0F0', '#007BFF'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loginChild} />

      <View
        style={{
          top: '55%',
          width: '70%',
          alignSelf: 'center',
        }}>
        <Animated.View
          style={[
            styles.inputContainer,
            {transform: [{translateX: shakeAnimation}], borderColor},
          ]}>
          <TextInput
            placeholder="User ID"
            placeholderTextColor="#888"
            value={userId}
            onChangeText={handleUserIdChange}
            onBlur={handleBlur}
            style={styles.input}
          />
        </Animated.View>
        {userIdError ? (
          <Text style={styles.errorText}>{userIdError}</Text>
        ) : null}

        <Animated.View style={[styles.inputContainer, {borderColor}]}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            onBlur={handleBlur}
            style={styles.input}
          />
        </Animated.View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <View>
          <Animated.View
            style={[
              styles.buttonContainer,
              {transform: [{scale: loginScale}]},
            ]}>
            <TouchableOpacity
              onPressIn={() => handlePressIn(loginScale)}
              onPressOut={() => handlePressOut(loginScale)}
              onPress={handleLogin}
              style={[styles.button, styles.loginButton]}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <Image
        style={[styles.kindergartenStudentPana1, styles.groupChildPosition]}
        resizeMode="cover"
        source={require('../assets/Image/kindergarten-studentpana-1.png')}
      />
    </View>

    // <Animated.View
    // style={[styles.buttonContainer, {transform: [{scale: registerScale}]}]}>
    // <TouchableOpacity
    //   onPressIn={() => handlePressIn(registerScale)}
    //   onPressOut={() => handlePressOut(registerScale)}
    //   onPress={handleRegister}
    //   style={[styles.button, styles.registerButton]}>
    //   <Text style={[styles.buttonText, {color: '#007BFF'}]}>Register</Text>
    // </TouchableOpacity>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 800,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: Color.primaryContrast,
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
  kindergartenStudentPana1: {
    top: 5,
    // width: 490,
    width: window.WindowWidth * 1.21,

    marginLeft: -25,
    height: window.WindowWidth * 0.9,
  },
  groupChildPosition: {
    left: 0,
    position: 'absolute',
  },

  title: {
    fontSize: 24,
    color: '#007BFF',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007BFF',
  },
  registerButton: {
    backgroundColor: '#ffffff',
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default App;
