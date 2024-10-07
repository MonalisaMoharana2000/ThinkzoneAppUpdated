import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  BackHandler,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import axios from 'axios';
import Api from '../environment/Api';

import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {useDispatch, useSelector} from 'react-redux';
import Colors from '../utils/Colors';

import ErrorMessage from '../components/ErrorMessage';

import {useTranslation} from 'react-i18next';

const Page2 = ({navigation}) => {
  const users = useSelector(state => state.UserSlice.user);
  console.log('usersmobile1---------->', users);

  const {t} = useTranslation();
  const [phone, setPhone] = useState('');
  console.log('phone------->', phone);
  const [phoneError, setPhoneError] = useState(false);
  const [backStatus, setBackStatus] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  useEffect(() => {
    setSendCodeLoading(false); // Reset loading state when component mounts
    setButtonClicked(false); // Reset button click state when component mounts
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backStatus) {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
          'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'default',
            },
            {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
          ],
        );
        return true;
      } else {
        // navigation.navigate('home');
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [backStatus]);
  const [buttonClicked, setButtonClicked] = useState(false);

  // useFocusEffect(
  //   React.useCallback(()=>{

  //   },[])
  // )

  console.log('sendCodeLoading----------------------------->', sendCodeLoading);
  const phoneRegExp = /^[6-9]\d{9}$/;
  const handleSubmit = () => {
    setSendCodeLoading(true);
    setButtonClicked(true);
    var otp = Math.floor(1000 + Math.random() * 9000);
    console.log('otp----->', otp);
    var urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=OT&template_id=11518&sender_id=THNKZN&language=EN&template=Dear+User%2C+Your+OTP+is+${otp}+for+your+login+to+ThinkZone+application+%26+valid+for+5+minutes.&contact_numbers=${phone}`;

    axios
      .get(urls)
      .then(response => {
        if (!phoneRegExp.test('' + phone)) {
          setSendCodeLoading(true);
          setPhoneError(true);
        } else {
          if (users?.length > 0) {
            setSendCodeLoading(true);
            // console.log('users---->', users);
            const body = {
              contactnumber: users[0]?.contactnumber,
            };
            //To check the contactnumber  i.e verified in another account or not in case of google
            Api.post(`checkCredentialAvailability`, body).then(response => {
              if (
                response.data.status === 'success' &&
                response.data.unique === true
              ) {
                // console.log('checkcredential for true----->', response.data);

                axios.get(urls).then(response => {
                  console.log('res: ', response.data);
                  if (response.data.code === 200) {
                    setSendCodeLoading(true);
                    const body = {
                      appModule: 'user',
                      id: phone,
                      phoneNumber: phone,
                      otp: otp,
                    };
                    Api.post(`saveOtp`, body).then(response => {
                      // console.log('res2------->', response.data);
                      // setChange(response.data);
                    });
                    navigation.navigate('otploginphone', {
                      data: phone,
                      otp: otp,
                    });

                    ToastAndroid.show(
                      'Otp generate success.',
                      ToastAndroid.SHORT,
                    );
                  } else {
                    ToastAndroid.show(
                      'Otp generate error2. Please try again.',
                      ToastAndroid.SHORT,
                    );
                  }
                });
              } else if (
                response.data.status === 'fail' &&
                response.data.unique === false
              ) {
                // console.log('checkcredentialfalse----->', response.data);
                navigation.navigate('Login');
                handleClearCachedToken();
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);

                //Back to login page
              } else {
              }
            });
          } else {
            if (response.data.code === 200) {
              const body = {
                appModule: 'user',
                id: phone,
                phoneNumber: phone,
                otp: otp,
              };
              Api.post(`saveOtp`, body).then(response => {
                console.log('res2------->', response.data);
                // setChange(response.data);
              });
              navigation.navigate('otploginphone', {
                data: phone,
                otp: otp,
              });
              setSendCodeLoading(false);
              ToastAndroid.show('Otp generate success.', ToastAndroid.SHORT);
            } else {
              ToastAndroid.show(
                'Otp generate error3. Please try again.',
                ToastAndroid.SHORT,
              );
              setSendCodeLoading(false);
            }
          }
        }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          // Request was cancelled, no action needed
        } else {
          // Handle other errors
        }
      });
  };

  const handleClearCachedToken = async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);

      // Additional logic for opening the Google SDK or navigating to another page
      // ...
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

  return (
    <View style={{justifyContent: 'space-evenly'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        //  navigation.goBack();
      >
        <Image
          style={{marginTop: 10, marginLeft: 20}}
          resizeMode="cover"
          source={require('../assets/Image/back.png')}
        />
      </TouchableOpacity>
      <Image
        style={styles.connectedWorldBro11}
        resizeMode="cover"
        source={require('../assets/Image/Enter.png')}
      />
      <View
        style={{
          justifyContent: 'space-evenly',
          marginTop: 90,
          alignItems: 'flex-start',
        }}>
        <Text style={styles.title}>Sign in with Mobile Number</Text>
        <Text style={styles.subt}>Enter Mobile Number</Text>
      </View>
      <View style={{top: 50, marginLeft: 27}}>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
          name="name"
          keyboardType="number-pad"
          placeholder="Enter Mobile Number ...."
          iconFirst="phone"
          onChangeText={value => setPhone(value)}
          value={phone}
          maxLength={10}
        />
        {!phoneRegExp.test('' + phone) ? (
          <ErrorMessage visible={phoneError} error={t('phone_error')} />
        ) : null}
      </View>
      {sendCodeLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{justifyContent: 'center', alignSelf: 'center', top: '8%'}}
        />
      ) : (
        <TouchableOpacity
          // style={styles.splash26Item}
          disabled={buttonClicked}
          onPress={handleSubmit}
          // onPress={() => navigation.navigate('OtpLogin')}
          style={{
            margin: 8,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            height: 45,
            borderRadius: Border.br_xl,
            backgroundColor: Color.royalblue,
            width: 292,
            height: 45,

            justifyContent: 'center',
            alignItems: 'center',

            marginLeft: 40,
            marginTop: 80,
          }}>
          <Text
            style={{
              width: '100%',

              justifyContent: 'center',

              textAlign: 'center',
              fontFamily: FontFamily.poppinsMedium,

              fontSize: 20,
              color: Color.primaryContrast,
              position: 'absolute',

              marginTop: -5,
            }}>
            Send code
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  connectedWorldBro11: {
    top: 50,
    left: 20,
    // alignItems: 'center',
    width: window.WindowWidth * 0.9,
    height: window.WindowHeigth * 0.45,
    // position: 'absolute',
  },
  textInput: {
    height: 45,
    width: window.WindowWidth * 0.8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Color.ghostwhite,
    marginBottom: 20,
  },
  title: {
    left: '7%',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 18,
    color: '#000000',
    width: 350,
  },
  subt: {
    left: '7%',
    top: 20,
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 13,
    color: '#000000',
    width: 350,
  },
});

export default Page2;
