import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  ToastAndroid,
  Image,
} from 'react-native';
import axios from 'axios';
import * as window from '../utils/dimensions';
import Api from '../environment/Api';
import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import {authNewUserThunk} from '../redux_toolkit/features/users/UserThunk';
import {useDispatch} from 'react-redux';

const PhoneVerificationGoogle = ({navigation, route}) => {
  const dispatch = useDispatch();

  const phone = route.params.phone;
  const email = route.params.email;
  const [otp, setOTP] = useState(['', '', '', '']);
  const [counter, setCounter] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCounter, setResendCounter] = useState(0);
  const [change, setChange] = useState([]);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const Resend = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=OT&template_id=11518&sender_id=THNKZN&language=EN&template=Dear+User%2C+Your+OTP+is+${otp}+for+your+login+to+ThinkZone+application+%26+valid+for+5+minutes.&contact_numbers=${phone}`;

    axios.get(urls).then(response => {
      if (response.data.code === 200) {
        setCounter(120);
        ToastAndroid.show('Otp Sent successfully.', ToastAndroid.SHORT);
        Api.post(`saveOtp`, {
          appModule: 'user',
          id: phone,
          phoneNumber: phone,
          otp: otp,
        }).then(response => setChange(response.data));
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

  useEffect(() => {
    if (route.params.enteredOTP && route.params.enteredOTP.length === 4) {
      setOTP(route.params.enteredOTP.split(''));
    }
  }, [route.params.enteredOTP]);

  const handleVerify = async otp => {
    try {
      const response = await Api.post('verifyOtp', {
        appModule: 'user',
        id: phone,
        phoneNumber: phone,
        otp: otp,
      });

      if (response.data.status === 'success') {
        ToastAndroid.show('OTP ସଫଳତାର ସହ ଯାଞ୍ଚ ହୋଇଛି ।', ToastAndroid.SHORT);

        const data = {
          loginType: 'google',
          userid: email,
          emailid: email,
          contactnumber: phone,
        };
        const res = await dispatch(authNewUserThunk(data));
        if (res?.payload?.status === 200) {
          navigation.navigate('register', {
            email: email,
            phone: phone,
            loginType: 'google',
          });
        }
      } else {
        ToastAndroid.show('Please Enter Valid Otp.', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Please Enter Valid Otp.', ToastAndroid.SHORT);
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => navigation.goBack()}>
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

      <View style={styles.instructionContainer}>
        <Text style={styles.subt}>
          4 digit OTP has been sent to your mobile number.
        </Text>
        <Text style={styles.title}>Enter OTP</Text>
      </View>

      <TextInput
        allowFontScaling={false}
        style={styles.textInput}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Enter OTP ...."
        keyboardType="numeric"
        value={otp}
        onChangeText={value => setOTP(value.split(''))}
        maxLength={4}
      />

      <Text style={styles.otpPrompt}>
        Didn’t receive the OTP?{' '}
        {counter != 0 ? (
          <Text style={{color: 'red', fontWeight: '500', fontSize: 13}}>
            0{Math.floor(counter / 60)}:{Math.floor(counter % 60)}
          </Text>
        ) : (
          <>
            {isResendDisabled ? (
              <Text style={styles.resendDisabled}>
                Maximum attempts reached
              </Text>
            ) : (
              <Text style={styles.resend} onPress={Resend}>
                Resend OTP
              </Text>
            )}
          </>
        )}
      </Text>

      <TouchableOpacity
        onPress={() => {
          setOTP('');
          handleVerify(otp.join(''));
        }}
        style={styles.verify}>
        <Text style={styles.vt}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  connectedWorldBro11: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.45,
    marginTop: 20,
  },
  textInput: {
    height: 40,
    width: windowWidth * 0.8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Color.ghostwhite,
    marginBottom: 20,
  },
  title: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 16,
    color: '#000000',
    width: 350,
    top: 30,
  },
  subt: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 13,
    color: '#000000',
    marginTop: 20,
  },
  instructionContainer: {
    justifyContent: 'space-evenly',
    marginTop: 50,
    alignItems: 'flex-start',
  },
  otpPrompt: {
    fontSize: 10,
    color: '#000000',
    fontFamily: FontFamily.poppinsMedium,
    marginLeft: 10,
  },
  resend: {
    fontSize: 13,
    color: '#ED6400',
    fontFamily: FontFamily.poppinsMedium,
  },
  resendDisabled: {
    fontSize: 10,
    color: '#ED6400',
    fontFamily: FontFamily.poppinsMedium,
    marginTop: 15,
  },
  verify: {
    marginTop: 40,
    padding: 10,
    borderRadius: Border.br_xl,
    backgroundColor: Color.royalblue,
    alignItems: 'center',
  },
  vt: {
    fontSize: 20,
    color: Color.primaryContrast,
    fontFamily: FontFamily.poppinsMedium,
  },
});

export default PhoneVerificationGoogle;
