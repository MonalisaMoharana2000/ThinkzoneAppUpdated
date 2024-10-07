import React, {useState} from 'react';

import {RadioButton} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';

import Api from '../environment/Api';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Colors from '../utils/Colors';
import * as window from '../utils/dimensions';
import {Color, Border, FontSize, FontFamily} from '../GlobalStyle';
import ErrorMessage from '../components/ErrorMessage';
import {useTranslation} from 'react-i18next';
import {
  authNewUserThunk,
  createNewUserThunk,
} from '../redux_toolkit/features/users/UserThunk';
import API from '../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const RegisterPasscode = ({navigation, route}) => {
  const data = route?.params;
  const dispatch = useDispatch();
  console.log('params------->', data);

  const {
    app_versions,
    block,
    blockId,
    district,
    districtId,
    state,
    dob,
    email,
    gender,
    guardianName,
    imageUrl,
    lname,
    name,
    // managerId,
    // managername,
    mname,
    phone,
    qualification,
  } = data;

  const users = useSelector(state => state.UserSlice.user);
  const {t} = useTranslation();
  const [passcodeRequested, setPasscodeRequested] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [managertype, setManagertype] = useState('');

  const [usertype, setUsertype] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarError, setAadhaarError] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState('no');
  const [showInput, setShowInput] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [schools, setSchools] = useState([]);
  const [schoolId, setSchoolId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [modal, setModal] = useState(false);
  const [successmodal, setSuccessmodal] = useState(false);

  console.log('check---------->', passcodeRequested, usertype, managertype);

  const handleRadioButtonChange = value => {
    setSelectedValue(value);
    if (value === 'yes') {
      setShowInput(true);
    } else {
      setShowInput(false);
      setManagerName('');
    }
  };
  const requestModalBack = () => {
    Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ଆପଣ ଏହି ମଡ୍ୟୁଲ୍ ଛାଡିବାକୁ ଚାହୁଁଛନ୍ତି କି?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'default',
      },
      {text: 'Ok', onPress: () => setRequestModal(false), style: 'default'},
    ]);
  };
  const openReq = () => {
    // if (areRequiredFieldsEmpty()) {
    //   // Show an error message or take appropriate action for missing fields.
    //   Alert.alert(
    //     'Required fields are missing.',
    //     'Please fill in all required fields.',
    //   );
    // } else {

    setRequestModal(true);
    // }
  };

  const handlePasscodeChange = async item => {
    // console.log('item---->', item);

    if (passcodeRequested) {
      if (item === '') {
        setPasscodeError(false);
      }
      // If passcodeRequested is true, allow the passcode to be blank
      setPasscode('');
      setPasscodeError(false);
      setManagertype('');
      return;
    }
    setPasscode(item.toUpperCase());
    console.log('passcode length---->', item.length);
    if (item.length > 0) {
      const res = await API.get(`checkpasscodevalidity/${item.toUpperCase()}`);

      // console.log('check---->', res.data);
      if (res.data.count == 1) {
        setPasscodeError(false);
        if (res.data.managertype == 'manager') {
          setUsertype('fellow');
          setManagertype(res.data.managertype);
          setManagerId(res.data.managerid);
          setManagerName(res.data.managername);
        } else if (res.data.managertype == 'crc') {
          const response = await getCrcSchoolData();
          console.log('check---->', response.data);
          setSchools(response.data);
          setUsertype('school');
          setManagerId(res.data.managerid);
          setManagertype(res.data.managertype);
          setManagerName(res.data.managername);
        } else if (res.data.managertype == 'supervisor') {
          setUsertype('anganwadi');
          setManagerId(res.data.managerid);
          setManagertype(res.data.managertype);
          setManagerName(res.data.managername);
        }
      } else if (res.data.count === 0 && item?.length > 4) {
        console.log('passcode error1---->', item.length);
        setPasscodeError(true);
      } else {
        setPasscodeError(false);
      }
    } else if (item.length === 0) {
      setManagertype('');
      setPasscodeError(false);
      setSchools([]);
    } else {
      setPasscodeError(false);
      console.log('null');
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      dispatch(types.logOutUser());
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

  let userDetails;

  const commonSubmitLogic = async () => {
    if (showInput && selectedValue === 'yes' && managerName.length === 0) {
      Alert.alert(' ', `Please Enter Coordinator's name`, [
        {text: 'Ok', onPress: () => null, style: 'default'},
      ]);
    } else {
      setRequestModal(false);
      setPasscodeRequested(true);
      setPasscodeError(false);

      userDetails = {
        userid: email,
        emailid: email,
        emailidVerified: true,
        username: name + ' ' + mname + ' ' + lname,
        firstname: name.trim().split(/\s+/)[0],
        middlename: mname.trim() || '',
        lastname: lname.trim().split(/\s+/)[0],
        usertype: 'fellow',
        guardianname: guardianName,
        contactnumber: phone,
        phoneNumberVerified: true,
        qualification: qualification,
        gender: gender,
        dob: dob.split('-').reverse().join('-'),
        // aadhaar: aadhaar,
        aadhaar: '',
        // aadhaarUpdated:
        //   aadhaar.length > 0 && aadhaar.length === 12 ? true : false,
        aadhaarUpdated: true,
        loginType: data?.loginType,
        userpolicy: 'agreed',
        managerid: managerId,
        managername: managerName,
        passcode: passcode,
        passcodeRequested: true,
        preferredManager: managerName,
        status: 'active',
        stateid: 20,
        statename: state,
        districtid: districtId,
        districtname: district,
        blockid: blockId,
        blockname: block,
        appVersion: app_versions,
        // image: profileDeta
        image: imageUrl,
      };

      setModal(true);
      console.log('userDetails----------->', userDetails);
      const data = {
        user: userDetails,
        image: '',
        userid: email,
      };

      console.log(
        'userDetails for passcode request------------------------>',
        userDetails,
      );

      try {
        const response = await Api.post(`savePscdRqstedUser`, userDetails);
        console.log(
          'create response------>',
          response,
          response.data,
          response.status,
        );
        if (response.status === 200) {
          const body = {
            loginType: 'google',
            userid: email,
            emailid: email,
            contactnumber: phone,
          };
          // console.log('data---->', body);
          dispatch(authNewUserThunk(body));
        } else {
          Alert.alert(
            `${response.msg}`,
            'Something went wrong',
            [
              // {
              //   text: 'Cancel',

              //   style: 'destructive',
              // },
              {
                text: 'OK',

                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        console.log('er---->', error);

        Alert.alert(
          `${error.response?.data?.msg}`,
          'Your request can not be processed right now',
          [
            // {
            //   text: 'Cancel',

            //   style: 'destructive',
            // },
            {
              text: 'OK',
              onPress: () => signOut(),
              style: 'destructive',
            },
          ],
          {cancelable: false},
        );
      }
    }
  };

  const handleRequestPasscode = async () => {
    await commonSubmitLogic();
  };

  const handleSchoolChange = (itemValue, itemIndex) => {
    console.log('itemValue---------->', itemValue);
    setSchoolId(itemValue);
    const selectedSchool = schools.find(
      school => school.udisecode === itemValue,
    );

    const selectedSchoolName = selectedSchool ? selectedSchool.schoolname : '';
    setSchoolName(selectedSchoolName);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (passcodeError) {
      Alert.alert(
        'Please enter a valid passcode.',
        '',
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'OK',
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else if (passcode?.length <= 4) {
      Alert.alert(
        'Please enter a valid passcode.',
        '',
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'OK',
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else if (users?.status === 'error') {
      setSuccessmodal(false);
      Alert.alert('Something went wrong!', `${users?.err?._message}`, [
        {
          text: 'Ok',
          onPress: () => signOut(),
          style: 'cancel',
        },
      ]);
    } else if (
      schools.length > 0 &&
      schoolId.length === 0 &&
      schoolName.length === 0
    ) {
      Alert.alert(
        'Please select a school Name.',
        '',
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'OK',
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      if (passcode === undefined || passcode === null || passcode === '') {
        console.log('passcode error2---->');
        setPasscodeError(true);
      } else if (aadhaar.length > 0 && aadhaar.length != 12) {
        setPasscodeError(false);
        setAadhaarError(true);
      } else {
        setPasscodeError(false);
        setAadhaarError(false);

        const userDetails = {
          userid: email,
          emailid: email,
          emailidVerified: true,
          username: name + ' ' + mname + ' ' + lname,
          firstname: name.trim().split(/\s+/)[0],
          middlename: mname.trim() || '',
          lastname: lname.trim().split(/\s+/)[0],
          usertype: usertype,
          guardianname: guardianName,
          contactnumber: phone,
          phoneNumberVerified: true,
          qualification: qualification,
          gender: gender,
          dob: dob.split('-').reverse().join('-'),
          aadhaar: '',
          aadhaarUpdated: true,
          loginType: data?.loginType,
          userpolicy: 'agreed',
          managerid: managerId,
          managername: managerName,
          passcode: passcode,
          passcodeRequested: false,
          status: 'active',
          stateid: 20,
          statename: state,
          districtid: districtId,
          districtname: district,
          blockid: blockId,
          blockname: block,
          image: imageUrl,
          appVersion: '2.0.3',
          udisecode: schoolId ? schoolId : '',
          schoolname: schoolName ? schoolName : '',
        };

        setModal(true);
        console.log('userDetails----------->', userDetails);

        const data = {
          user: userDetails,
          image: imageUrl,
          userid: email,
        };
        console.log('data----------->', data);

        try {
          const response = await dispatch(createNewUserThunk(userDetails));
          console.log('data2----------->', response);
          if (response?.payload?.status === 'success') {
            const userData = JSON.stringify(response?.payload?.resData);
            await AsyncStorage.setItem('userData', userData);

            ToastAndroid.show('Created successfulyy!.', ToastAndroid.SHORT);

            // Navigate to HomeTab after successful registration
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            }, 500);
          } else {
            Alert.alert('Something went wrong!', '', [
              {
                text: 'Ok',
                onPress: () => signOut(),
                style: 'cancel',
              },
            ]);
          }
        } catch (error) {
          console.log('error-------->', error);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
      <ScrollView>
        <View>
          <Image
            style={styles.connectedWorldBro11}
            // resizeMode="cover"
            source={require('../assets/Image/passcode.png')}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 19,
            paddingVertical: 130,
            marginLeft: 20,

            paddingBottom: 50,
          }}>
          <TextInput
            style={styles.textInput}
            autoCapitalize={passcodeRequested ? 'sentences' : 'characters'}
            autoCorrect={false}
            iconFirst="barcode"
            keyboardType={passcodeRequested ? 'default' : 'email-address'}
            name="passcode"
            placeholder="Passcode*"
            placeholderTextColor="black"
            value={passcode}
            editable={!passcodeRequested}
            onChangeText={value => handlePasscodeChange(value)}
          />
          <ErrorMessage visible={passcodeError} error={t('Passcode_error')} />

          {!passcodeRequested &&
            managertype !== 'manager' &&
            usertype !== 'school' && (
              <TouchableOpacity style={{top: '-1%'}} onPress={openReq}>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    color: Color.royalblue,
                    fontFamily: FontFamily.poppinsMedium,
                    fontWeight: 'bold',
                    top: '-1%',
                    fontSize: 13,
                  }}>
                  Request Passcode
                </Text>
              </TouchableOpacity>
            )}

          {usertype === 'school' && schools?.length > 0 && (
            <View style={styles.wrapper}>
              <Entypo
                name="location-pin"
                size={20}
                color={Colors.greyPrimary}
                style={styles.icon}
              />
              <Picker
                dropdownIconColor={Colors.primary}
                selectedValue={schoolId}
                onValueChange={(itemValue, itemIndex) =>
                  handleSchoolChange(itemValue, itemIndex)
                }
                style={styles.picker}
                name="school">
                <Picker.Item
                  label="Select School*"
                  value="0"
                  enabled={false}
                  style={styles.placeHolder}
                />
                {schools.map((item, index) => (
                  <Picker.Item
                    label={
                      item.schoolname
                      // +
                      // item.blockname.slice(1)
                    }
                    value={
                      item.udisecode
                      // +
                      // item.blockname.slice(1)
                    }
                    key={index + 1}
                    style={styles.pickerSelectItem}
                  />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity
            onPress={e => handleSubmit(e)}
            style={{
              margin: 8,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              // height: 45,
              borderRadius: Border.br_xl,
              backgroundColor: Color.royalblue,
              width: 209,
              height: 48,
              alignItems: 'center',
              // flexDirection: 'row',
              marginRight: 10,
              marginLeft: 40,
              marginTop: 60,
            }}>
            <Text
              style={{
                // width: '0%',

                letterSpacing: 1,
                // textAlign: 'center',
                fontFamily: FontFamily.poppinsMedium,
                fontWeight: '500',

                // marginLeft: 50,
                // fontSize: 14,
                fontWeight: '500',
                fontSize: FontSize.size_5xl,
                color: Color.primaryContrast,
                alignSelf: 'center',
                // marginTop: -8,
                // left: '10%',
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => requestModalBack()}
          visible={requestModal}>
          <View style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                {
                  height: window.WindowHeigth * 1.1,
                  // flex: 1,
                  top: '-2%',
                  width: window.WindowWidth * 1,
                  borderRadius: 20,
                },
              ]}>
              <Image
                style={[
                  {
                    width: 250,
                    height: 250,
                    top: '-2%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                source={require('../assets/Image/passwordq.png')}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FontFamily.poppinsMedium,
                  color: Color.royalblue,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                }}>
                ପାସକୋଡ୍ ପାଇଁ ଆବେଦନ!
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FontFamily.poppinsMedium,
                  color: Color.black,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  top: '5%',
                }}>
                ଆପଣ Request ବଟନ୍ ରେ କ୍ଲିକ୍ କରି ନିଜର ପାସକୋଡ୍ ଆବେଦନ କରନ୍ତୁ ।
              </Text>

              <View
                style={{
                  // flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  // alignSelf: 'flex-start',
                  top: '8%',
                }}>
                <Text>
                  ଆପଣ ଥିଙ୍କଜୋନ୍ ର କୌଣସି ପ୍ରୋଗ୍ରାମ କୋର୍ଡିନେଟର୍ ଙ୍କୁ ଜାଣିଛନ୍ତି କି?
                </Text>
                <RadioButton.Group
                  onValueChange={handleRadioButtonChange}
                  value={selectedValue}>
                  <View style={{flexDirection: 'row'}}>
                    <RadioButton.Item label="Yes" value="yes" />
                    <RadioButton.Item label="No" value="no" />
                  </View>
                </RadioButton.Group>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  // alignSelf: 'flex-start',
                  top: '30%',
                }}>
                {showInput && selectedValue === 'yes' && (
                  <TextInput
                    style={styles.input}
                    label="Manager's Name"
                    name="name"
                    placeholder="ପ୍ରୋଗ୍ରାମ କୋର୍ଡିନେଟର୍ ଙ୍କ ନାମ"
                    value={managerName}
                    onChangeText={text =>
                      setManagerName(text.replace(/\s/g, ''))
                    }
                  />
                )}
              </View>

              <TouchableOpacity
                style={[styles.buttons, {bottom: '15%'}]}
                onPress={handleRequestPasscode}>
                <Text style={styles.text}>Request </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterPasscode;

const styles = StyleSheet.create({
  buttons: {
    paddingVertical: 12,
    paddingHorizontal: 37,
    borderRadius: 15,
    elevation: 3,
    // marginLeft: 30,
    alignSelf: 'center',
    // justifyContent: 'space-around',
    // marginRight: 45,
    marginBottom: 12,
    // backgroundColor: '#00C0F0',
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  connectedWorldBro11: {
    top: 30,
    left: 20,
    // alignItems: 'center',
    width: window.WindowWidth * 0.9,
    height: window.WindowHeigth * 0.45,
    // position: 'absolute',
  },
  input: {
    width: window.WindowWidth * 0.83,
    borderWidth: 1,
    borderRadius: 12,
    textAlignVertical: 'top',
    paddingLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerSelectItem: {
    color: Colors.greyPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  placeHolder: {
    color: Colors.greyPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  picker: {
    flex: 1,
    color: Colors.black,
  },
  icon: {
    marginHorizontal: 5,
    marginVertical: 5,
    marginTop: 15,
  },
  wrapper: {
    marginVertical: 5,
    flexDirection: 'row',
    paddingBottom: 3,
    marginBottom: 17,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
  },
  textInput: {
    height: 60,
    width: window.WindowWidth * 0.8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Color.ghostwhite,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 9,
    marginVertical: 9,
    marginTop: 15,
  },
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 17,
    // borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    placeholderTextColor: '#000000',
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
  },
});
