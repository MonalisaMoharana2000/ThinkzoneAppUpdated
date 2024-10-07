import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  AppState,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Api from '../environment/Api';

import ErrorMessage from '../components/ErrorMessage';
import * as window from '../utils/dimensions';
import {useTranslation} from 'react-i18next';
import Colors from '../utils/Colors';
import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import Loading from '../components/Loading';

const Page1 = ({navigation, route}) => {
  const email = route.params.email;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsloading] = useState(false);

  const [sendCodeLoading, setSendCodeLoading] = useState(false);

  console.log('send loading ph------->', email);
  const [verifyStatus, setVerifyStatus] = useState();
  const [verifyMsg, setVerifyMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);
  console.log('loadingVisible---->', loadingVisible);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadingVisible(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //For half phone
  const phoneRegExp = /^[6-9]\d{9}$/;
  const {t} = useTranslation();
  const handleLogin = async () => {
    setSendCodeLoading(true);
    // You can add validation and login logic here
    if (phoneNumber.trim() !== '' && phoneRegExp.test('' + phoneNumber)) {
      // setSendLoading(false);

      await new Promise(resolve => setTimeout(resolve, 1000));
      const body = {
        emailid: email,
      };
      Api.post(`checkCredentialAvailability`, body).then(response => {
        if (
          response.data.status === 'success' &&
          response.data.unique === true
        ) {
          // console.log('checkcredential for true----->', response.data);
          var otp = Math.floor(1000 + Math.random() * 9000);
          // console.log('otp----->', otp);
          var urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=OT&template_id=11518&sender_id=THNKZN&language=EN&template=Dear+User%2C+Your+OTP+is+${otp}+for+your+login+to+ThinkZone+application+%26+valid+for+5+minutes.&contact_numbers=${phoneNumber}`;

          axios.get(urls).then(response => {
            console.log('res: ', response.data);
            if (response.data.code === 200) {
              const body = {
                appModule: 'user',
                id: phoneNumber,
                phoneNumber: phoneNumber,
                otp: otp,
              };
              console.log(otp, 'otp------->');
              Api.post(`saveOtp`, body).then(response => {
                console.log('====================response', response?.data);

                if (response.data?.status === 'success') {
                  navigation.navigate('phoneverificationgoogle', {
                    phone: phoneNumber,
                    email: email,
                  });
                }
              });

              ToastAndroid.show('Otp generate success.', ToastAndroid.SHORT);
            } else {
              ToastAndroid.show(
                'Otp generate error. Please try again.',
                ToastAndroid.SHORT,
              );
            }
          });
        } else if (response.data.status === 'fail') {
          // console.log('checkcredentialfalse----->', response.data);
          // ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
          //Back to login page
        } else {
          // console.log('checkcredentialfalse2----->', response.data);
        }
      });
    } else if (!phoneRegExp.test('' + phoneNumber)) {
      setPhoneError(true);
    }
  };

  const handleNumberChange = async text => {
    setPhoneNumber(text);
    const body = {
      contactnumber: text,
    };
    if (text.length === 1) {
      setIsloading(true);
    } else if (text.length === 10 && phoneRegExp.test('' + text)) {
      try {
        const response = await Api.post(`checkCredentialAvailability`, body);
        // console.log('response--->', response.data);
        setVerifyStatus(response.data.status);
        setVerifyMsg(response.data.msg);
        if (response.data.status === 'fail') {
          Alert.alert(
            `${response.data.msg}`,
            '',
            [
              {
                text: 'OK',
                onPress: () => statusFail(),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        }
        // setLoading(false);
      } catch (error) {
        console.log('err---->', error);
        if (error.response.status === 504) {
          Alert.alert('Gateway Timeout: The server is not responding.');
        } else if (error.response.status === 500) {
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
          console.error('Error is------------------->:', error);
        } else {
          console.error('Error is------------------->:', error);
        }
      } finally {
        setLoading(false); // Set loading back to false when API call is done (success or error)
      }
    } else if (text.length === 0) {
      setIsloading(false);
    }
  };

  //For half email
  const handleToggle = async value => {
    // setLoadingVisible(true);
    onGoggle(value);
  };
  const [refreshPage, setRefreshPage] = useState(false);
  const backModal = () => {
    setRefreshPage(prevState => !prevState);
    // setSendCodeLoading(false);
    back();
  };

  return (
    <ScrollView>
      <Image
        style={styles.connectedWorldBro11}
        // resizeMode="cover"
        source={require('../assets/Image/Verified-pana.png')}
      />
      <View
        style={{
          justifyContent: 'space-evenly',
          marginTop: 60,
          alignItems: 'flex-start',
        }}>
        <Text style={styles.title}>Verify Your Phone Number</Text>
      </View>
      <View style={{top: 5, marginLeft: 1}}>
        <TextInput
          allowFontScaling={false}
          style={styles.textInput}
          autoCapitalize="none"
          autoCorrect={false}
          name="name"
          keyboardType="number-pad"
          placeholder="Enter Mobile Number ...."
          iconFirst="phone"
          onChangeText={handleNumberChange}
          value={phoneNumber}
          maxLength={10}
        />
        {!phoneRegExp.test('' + phoneNumber) ? (
          <ErrorMessage visible={phoneError} error={t('phone_error')} />
        ) : null}
      </View>
      {verifyStatus === 'success' && phoneNumber.length === 10 ? (
        sendCodeLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{justifyContent: 'center', alignSelf: 'center'}}
          />
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
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
              marginLeft: 5,
              marginTop: 30,
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
        )
      ) : isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : null}
    </ScrollView>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  connectedWorldBro11: {
    // top: 50,
    // left: 20,
    // alignItems: 'center',
    alignSelf: 'center',
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
    color: 'black',
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

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,

    height: windowHeight * 1.0, // Adjust the height as needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default Page1;
