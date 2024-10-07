import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  BackHandler,
} from 'react-native';

import Api from '../environment/Api';

import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

// import PhoneNumberHalfModal from '../components/PhoneNumberHalfModal';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {useDispatch, useSelector} from 'react-redux';

import axios from 'axios';
import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';

const OtpLoginPhone = ({navigation, route}) => {
  const user = useSelector(state => state.UserSlice.user);
  console.log('otp user-------->', user);

  const mobile = route.params;
  console.log('mobile----->', mobile);

  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [toggleState, setToggleState] = useState(false);
  const [otps, setOtps] = useState('');
  console.log(otps, 'otps----');
  const [resendCounter, setResendCounter] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [change, setChange] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = React.useState(120);
  const [inputStatus, setInputStatus] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const Resend = () => {
    // setPhone(data);
    // console.log(phone, 'hari------>');
    var otp = Math.floor(1000 + Math.random() * 9000);

    var urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=OT&template_id=11518&sender_id=THNKZN&language=EN&template=Dear+User%2C+Your+OTP+is+${otp}+for+your+login+to+ThinkZone+application+%26+valid+for+5+minutes.&contact_numbers=${mobile.data}`;

    axios.get(urls).then(response => {
      console.log('res: ', response.data);
      if (response.data.code === 200) {
        setCounter(120);
        ToastAndroid.show('Otp Sent successfully.', ToastAndroid.SHORT);

        Api.post(`saveOtp`, {
          appModule: 'user',
          id: mobile.data,
          phoneNumber: mobile.data,
          otp: otp,
        }).then(response => {
          console.log('res2------->', response.data);
          setChange(response.data);
        });
      } else {
        ToastAndroid.show(
          'Otp Update error. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    });
    setResendCounter(prevCounter => prevCounter + 1);

    if (resendCounter == 2) {
      setIsResendDisabled(true);
    }
  };

  const [responseStatus, setResponseStatus] = useState(null);

  const verifiyOTP = async data => {
    setSendCodeLoading(true);

    try {
      const response = await Api.post('verifyOtp', {
        appModule: 'user',
        id: mobile.data,
        phoneNumber: mobile.data,
        otp: otps,
      });

      console.log(response.data, 'response-------->');
      if (response.data.status === 'success') {
        setResponseStatus(response.data.status);
        ToastAndroid.show('OTP ସଫଳତାର ସହ ଯାଞ୍ଚ ହୋଇଛି ।', ToastAndroid.SHORT);
        setSendCodeLoading(false);
        console.log('response.data1---->', response.data);
        const data = {
          loginType: 'otp',
          contactnumber: mobile.data,
          emailid: '',
        };
        console.log('datanumber---->', data);
        const res = await dispatch(authNewUserThunk(data));
        const resData = res.payload?.data?.resData?.[0];
        const status = res.payload?.status;

        if (resData) {
          const {emailidVerified, phoneNumberVerified} = resData;

          if (status === 200 && emailidVerified && phoneNumberVerified) {
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
        }

        if (
          res.payload?.data?.userExists === false &&
          res.payload?.data?.unique === true &&
          res.payload?.data?.contactnumber?.length === 0 &&
          res.payload?.data?.emailid
        ) {
          navigation.navigate('googleverificationphone', {phone: mobile.data});
        }
      } else {
        ToastAndroid.show('Please Enter Valid Otp.', ToastAndroid.SHORT);
        setSendCodeLoading(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error, error.response.status);
      ToastAndroid.show('Please Enter Valid Otp.', ToastAndroid.SHORT);
      setSendCodeLoading(false);
    }
  };

  React.useEffect(() => {
    // var date = moment().utcOffset('+05:30').format('hh:mm:ss');
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'default',
          },
          {
            text: 'Ok',
            onPress: () => navigation.navigate('login'),
            style: 'default',
          },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButton);

  //   // Clean up event listeners when the component unmounts
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  //   };
  // }, []);
  return (
    <View style={{justifyContent: 'space-evenly'}}>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          style={{top: '-1%'}}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => navigation.goBack()}
            //  navigation.goBack();
          >
            {/* <Image
              style={{marginTop: 10, marginLeft: 20}}
              resizeMode="cover"
              source={require('../assets/Image/back.png')}
            /> */}
            <Text
              style={[
                styles.title,
                {textAlign: 'center', top: 13, marginLeft: -20},
              ]}>
              OTP Verification
            </Text>
          </TouchableOpacity>
          <Image
            style={styles.connectedWorldBro11}
            resizeMode="cover"
            source={require('../assets/Image/Enter.png')}
          />
          <View
            style={{
              justifyContent: 'space-evenly',
              marginTop: 50,
              alignItems: 'flex-start',
            }}>
            <Text style={styles.subt}>
              4 digit OTP has been sent to your mobile number.
            </Text>
            <Text style={styles.title}>Enter OTP</Text>
          </View>
          <View style={{top: 50, marginLeft: 20}}>
            <TextInput
              style={styles.textInput}
              //   maxLength={maxLength}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter OTP ...."
              keyboardType="numeric"
              name="otp"
              value={otps}
              onChangeText={value => setOtps(value)}
              maxLength={4}
            />

            <Text
              style={{
                fontSize: 10,
                color: '#000000',
                fontFamily: FontFamily.poppinsMedium,
                marginLeft: 10,
              }}>
              Didn’t receive the OTP?
              {''}
              {counter != 0 ? (
                <Text style={{color: 'red', fontWeight: '500', fontSize: 13}}>
                  0{Math.floor(counter / 60)}:{Math.floor(counter % 60)}
                </Text>
              ) : (
                <>
                  {isResendDisabled ? (
                    <Text
                      onPress={Resend}
                      disabled={isResendDisabled}
                      style={{
                        fontSize: 10,
                        color: '#ED6400',
                        fontFamily: FontFamily.poppinsMedium,
                        alignSelf: 'center',
                        marginTop: 15,
                      }}>
                      Maximum attempts reached
                    </Text>
                  ) : (
                    <Text
                      onPress={Resend}
                      disabled={isResendDisabled}
                      style={{
                        fontSize: 13,
                        color: '#ED6400',
                        fontFamily: FontFamily.poppinsMedium,
                        alignSelf: 'center',
                        marginTop: 15,
                      }}>
                      Resend OTP
                    </Text>
                  )}
                </>
              )}
            </Text>
          </View>
          {sendCodeLoading ? (
            <ActivityIndicator
              size="large"
              color={Color.primary}
              style={{justifyContent: 'center', alignSelf: 'center', top: '8%'}}
            />
          ) : responseStatus && responseStatus === 'success' ? (
            <TouchableOpacity
              onPress={verifiyOTP}
              style={[
                styles.verify,
                responseStatus === 'success' ? {opacity: 0.5} : null,
              ]}
              disabled={responseStatus === 'success'}>
              <Text style={styles.vt}>Verify</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={verifiyOTP}
              style={[
                styles.verify,
                responseStatus === 'success' ? {opacity: 0.5} : null,
              ]}>
              <Text style={styles.vt}>Verify</Text>
            </TouchableOpacity>
          )}
          {/* <PhoneNumberHalfModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onGoggle={handleToggle}
            inputStatusGoggle={true}
          /> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  connectedWorldBro11: {
    top: 30,
    left: 20,
    // alignItems: 'center',
    width: window.WindowWidth * 0.9,
    height: window.WindowHeigth * 0.45,
    // position: 'absolute',
  },
  textInput: {
    height: 40,
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
    fontSize: 16,
    color: '#000000',
    width: 350,
    top: 30,
  },
  vt: {
    width: '100%',

    justifyContent: 'center',

    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,

    fontSize: 20,
    color: Color.primaryContrast,
    position: 'absolute',

    marginTop: -5,
  },
  subt: {
    left: '7%',
    top: 20,
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 13,
    color: '#000000',
    width: 350,
  },
  verify: {
    margin: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    borderRadius: Border.br_xl,
    backgroundColor: Color.royalblue,
    width: 162,
    height: 45,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 99,
    marginTop: 80,
  },
});

export default OtpLoginPhone;
