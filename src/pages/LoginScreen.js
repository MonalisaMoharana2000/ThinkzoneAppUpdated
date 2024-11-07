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
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import * as window from '../utils/dimensions';
import {useDispatch} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Color} from '../GlobalStyle';
import {ScrollView} from 'react-native-gesture-handler';

const App = ({navigation}) => {
  const [userId, setUserId] = useState('');
  console.log('userId--->', userId);
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loader, setLoader] = useState(false);

  const loginScale = new Animated.Value(1);
  const registerScale = new Animated.Value(1);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [borderColorAnimation] = useState(new Animated.Value(0));
  const loginChildPosition = useRef(new Animated.Value(370)).current;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const debounceTimer = useRef(null);
  const dispatch = useDispatch();
  const handleInputFocus = () => {
    // Move loginChildPosition to 400 when an input is focused
    Animated.timing(loginChildPosition, {
      toValue: 320,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
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
    const filteredText = text.replace(/[^\d@a-zA-Z.]/g, '');

    setUserId(filteredText);

    setUserIdError('');

    // Clear any previous debounce timers
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Set a debounce timer for validation
    debounceTimer.current = setTimeout(() => {
      validateUserId(filteredText);
    }, 1000);
  };

  const validateUserId = text => {
    if (text.length === 0) {
      setUserIdError('');
    } else if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text) &&
      (!/^\d{10}$/.test(text) || text.length !== 10)
    ) {
      setUserIdError('Enter a valid User ID');
      setLoader(false);
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
    setLoader(true);
    setUserIdError('');
    setPasswordError('');
    // setUserId('');
    // setPassword('');
    if (!userId && !password) {
      setUserIdError('User ID is required');
      setPasswordError('Password is required');
      startShakeAnimation();
      setLoader(false);
      return;
    } else if (!userId) {
      setUserIdError('User ID is required');
      startShakeAnimation();
      setPasswordError('');
      setLoader(false);
      return;
    } else if (!password) {
      setLoader(false);
      setUserIdError('');
      setPasswordError('Password is required');
      startShakeAnimation();
      return;
    }

    validateUserId(userId);
    validatePassword();

    try {
      const data = {id: userId, password: password};
      if (!userIdError && !passwordError && userId && password) {
        const res = await dispatch(authNewUserThunk(data));
        if (res?.payload?.error?.status === 401) {
          setLoader(false);
          setPasswordError(res?.payload?.error?.data?.msg);
        } else if (res.payload?.status === 200) {
          setLoader(false);
          ToastAndroid.show('Logged In', ToastAndroid.SHORT);
          navigation.navigate('Home');
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify(res.payload.data),
          );

          // Animate loginChild to move to the top
          Animated.timing(loginChildPosition, {
            toValue: -100,
            duration: 700,
            useNativeDriver: false,
          }).start();
        } else {
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const borderColor = borderColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F0F0F0', '#007BFF'],
  });

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.loginChild,
              {top: loginChildPosition}, // Bind position to animation
            ]}
          />
          <View style={styles.inputWrapper}>
            <Animated.View
              style={[
                styles.inputContainer,
                {transform: [{translateX: shakeAnimation}], borderColor},
              ]}>
              <TextInput
                placeholder="User ID"
                placeholderTextColor="black"
                value={userId}
                onChangeText={handleUserIdChange}
                onBlur={handleBlur}
                onFocus={handleInputFocus}
                style={styles.input}
              />
            </Animated.View>
            {userIdError ? (
              <Text style={styles.errorText}>{userIdError}</Text>
            ) : null}

            <Animated.View style={[styles.inputContainer, {borderColor}]}>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="black"
                  value={password}
                  onFocus={handleInputFocus}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  secureTextEntry={!isPasswordVisible}
                  onBlur={handleBlur}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle the password visibility
                >
                  <AntDesign
                    name={isPasswordVisible ? 'eye' : 'eyeo'}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
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
                  {loader ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Text style={styles.buttonText}>
                      Login{' '}
                      <AntDesign
                        name="login"
                        size={20}
                        color={Color.royalblue}
                      />{' '}
                    </Text>
                  )}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primaryContrast,
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
    width: window.WindowWidth * 1.21,
    height: window.WindowWidth * 0.9,
  },
  groupChildPosition: {
    left: 0,
    position: 'absolute',
  },
  inputWrapper: {
    width: '70%',
    alignSelf: 'center',
    top: '55%',
  },
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    color: 'black',
  },
  errorText: {
    color: 'red',
    // backgroundColor: Color.ghostwhite,
    borderRadius: 25,
    fontSize: 12,
    marginBottom: 10,
    // width: '50%',
    // textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 10, height: 14},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 15,
  },
  loginButton: {
    // backgroundColor: Color.primaryMain,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    color: '#0060ca',
    fontWeight: 'bold',
    fontSize: 20,
    shadowColor: 'black',
    textTransform: 'capitalize',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 15,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
});

export default App;
