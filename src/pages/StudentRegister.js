import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Button,
  StatusBar,
  BackHandler,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import storage from '../utils/AsyncStorage';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import API from '../environment/Api';

import {useState, useEffect, useRef, useCallback} from 'react';
import moment from 'moment';

import Colors from '../utils/Colors';
import {useTranslation} from 'react-i18next';
import AppTextInput from '../components/TextInput';
import ErrorMessage from '../components/ErrorMessage';
import Gender from 'react-native-vector-icons/Foundation';
import ClassName from 'react-native-vector-icons/MaterialIcons';
import Classlabal from 'react-native-vector-icons/Ionicons';

import {Picker} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';

import * as window from '../utils/dimensions';

import DatePicker from 'react-native-datepicker';

import axios from 'axios';
import {app_versions} from './Home';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const pgeArray = [
  {id: 1, value: 'ଶ୍ରେଣୀ ୧'},
  {id: 2, value: 'ଶ୍ରେଣୀ ୨'},
  {id: 3, value: 'ଶ୍ରେଣୀ ୩'},
  {id: 4, value: 'ଶ୍ରେଣୀ ୪'},
  {id: 5, value: 'ଶ୍ରେଣୀ ୫'},
  // {id: 6, value: 'ଶ୍ରେଣୀ ୬'},
  // {id: 7, value: 'ଶ୍ରେଣୀ ୭'},
  // {id: 8, value: 'ଶ୍ରେଣୀ ୮'},
];
const eceArray = [
  {id: 1, value: 'Age 3-4 Years'},
  {id: 2, value: 'Age 4-5 Years'},
  {id: 3, value: 'Balvatika'},
];
const StudentRegister = ({route, navigation}) => {
  const dispatch = useDispatch();
  const studentData = useSelector(state => state.studentdata?.students);
  const studentCreateError = useSelector(state => state.studentdata?.error);
  const studentPhoneCount = useSelector(
    state => state.studentdata?.studentPhone,
  );
  console.log('studentPhoneCount-->', studentPhoneCount);
  const user = useSelector(state => state.userdata.user?.resData);
  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // useEffect(() => {
  //   studenttypes.dispatch();
  // }, []);

  const [count, setCount] = useState([]);

  const {t} = useTranslation();
  const data = route.params?.updateData;
  console.log(
    '====================================data',
    studentCreateError,
    studentCreateError?.response?.status,
  );

  const modalRef = useRef(null);
  const [modal, setModal] = useState(false);
  const modalHeight = HEIGHT * 0.2;
  const [updateStatus, setUpdateStatus] = useState(false);
  const [name, setName] = useState(
    route.params ? route.params.updateData?.studentname : '',
  );

  const [parentname, setParentname] = useState(
    route.params ? route.params.updateData?.parentsname : '',
  );
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState({});
  const [phone, setPhone] = useState(
    route.params ? route.params.updateData?.phone : '',
  );
  const [studentcategory, setStudentcategory] = useState(
    route.params ? route.params.updateData?.studentcategory : '',
  );
  const [email, setEmail] = useState(user);
  const [classlabal, setClasslabal] = useState(
    route.params ? route.params.updateData?.class : '',
  );
  const [block, setBlock] = useState('');
  const [state, setState] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [gender, setGender] = useState(
    route.params ? route.params.updateData?.gender : '',
  );
  const otp_status = data?.otp_isverified;
  //
  console.log('====================================otp_status', otp_status);

  // var date = moment(route.params.updateData.dob).utc().format('DD-MM-YYYY');
  //
  const [dob, setDob] = useState(
    route.params
      ? moment(route.params.updateData?.dob).utc().format('DD-MM-YYYY')
      : '',
  );
  //
  //
  // const chang = moment(dob).format("DD-MM-YYYY");
  //

  //
  const [open, setOpen] = useState(false);
  const [studentclass, setStudentClass] = useState(
    route.params ? route.params.updateData?.program : '',
  );
  const [usertype, setUsertype] = useState('');
  const [managername, setManagername] = useState('');
  const [managerId, setManagerId] = useState('');
  //States for Error
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);
  const [parentnameError, setParentnameError] = useState(false);
  const [classError, setClassError] = useState(false);
  const [programError, setProgramError] = useState(false);

  const [dobError, setDobError] = useState(false);

  const [districtError, setDistrictError] = useState(false);
  const [backStatus, setBackStatus] = useState(false);
  const [blockError, setBlockError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [button, setButton] = useState(false);
  //State to handle error in image error
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get(`getStudentPhoneCountByPhonenumber/${phone}`)
      .then(response => {
        setCount(response.data[0].totalCount);
        console.log(
          response.data[0].totalCount,
          'count----------------------------------------->>>>>>-',
        );
      })
      .catch(e => {
        console.log(e);
      });
  }, [phone]);

  useEffect(() => {
    dispatch(FcmSlice.clearfcmMessage({}));
    if (route.params) {
      setUpdateStatus(true);
    } else {
      setUpdateStatus(false);
    }
  });

  const [studentList, setStudentList] = useState([]);

  // console.log('====================================otp_status', otp_status);

  useEffect(() => {
    studentData ? setStudentList(studentData) : null;
  }, [studentData, navigation]);
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
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
      }
    };
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (modal) {
          // If the modal is visible, close the modal
          setModal(false);
          return true; // Prevent default back button behavior
        } else {
          // Navigate back using the navigation prop
          navigation.goBack();
          return true; // Prevent default back button behavior
        }
      },
    );

    return () => {
      // Clean up the event listener when the component unmounts
      backHandler.remove();
    };
  }, [modal, navigation]);

  useEffect(() => {
    if (user) {
      if (user[0].usertype === 'fellow') {
        setStudentcategory('app');
      } else if (user[0].usertype === 'school') {
        setStudentcategory('hbl');
      } else {
        setStudentcategory('');
      }
    }
  }, [user.usertype]);

  //Function to set class change
  const handleclasslabelChange = (itemValue, itemIndex) => {
    setClasslabal(itemValue);
    setProgramError(false);
    setClassError(false);
  };
  //

  //Function to handle selection of modal items
  const handleSelection = async flag => {
    modalRef.current?.close();
    if (flag === 'camera') {
      if (Platform.OS === 'ios') {
        return;
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Support App Camera Permission',
              message:
                'Support App needs access to your camera' +
                'so you can take pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
              compressImageMaxWidth: 300,
              compressImageMaxHeight: 300,
            })
              .then(image => {
                setError(false);
                setImageUrl(image.path);
                setImageData(image);
              })
              .catch(error => {
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
              });
          } else {
            Alert.alert('Error', 'Camera Permission Not Granted');
          }
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
      }
    } else if (flag === 'gallery') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
      })
        .then(image => {
          setError(false);
          setImageUrl(image.path);
          setImageData(image);
        })
        .catch(error => {
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
        });
    } else {
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const storedData = await storage.getObject('studentDetails');
      console.log('storedData------>', storedData);
    };
    fetchData();
  }, []);
  const upadteSubmit = e => {
    e.preventDefault();
    if (count >= 3) {
      Alert.alert(
        'Warning',
        'ଆପଣ ପୂର୍ବରୁ ଏହି ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିସାରିଛନ୍ତି । ଧ୍ୟାନ ଦେବେ ଆପଣ ଗୋଟିଏ ମୋବାଇଲ୍ ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିପାରିବେ।',
      );
      return;
    }
    const phoneRegExp = /^[6-9]\d{9}$/;
    if (name === undefined || name === null || name.trim() === '') {
      setNameError(true);
    } else if (!phoneRegExp.test('' + phone)) {
      setNameError(false);
      setPhoneError(true);
    } else if (gender === undefined || gender === null || gender === '') {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setParentnameError(false);
      setGenderError(true);
      setDobError(false);
    } else if (dob === undefined || dob === null || dob === '') {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setParentnameError(false);
      setGenderError(false);
      setDobError(true);
    } else if (
      parentname === undefined ||
      parentname === null ||
      parentname === ''
    ) {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setGenderError(false);
      setDobError(false);
      setParentnameError(true);
    } else if (
      studentclass === undefined ||
      studentclass === null ||
      studentclass === ''
    ) {
      setNameError(false);
      setPhoneError(false);
      setProgramError(true);
      setGenderError(false);
      setDobError(false);
      setParentnameError(false);
      setClassError(false);
    } else if (
      classlabal === undefined ||
      classlabal === null ||
      classlabal === ''
    ) {
      setNameError(false);
      setPhoneError(false);
      setProgramError(false);
      setGenderError(false);
      setDobError(false);
      setParentnameError(false);
      setClassError(true);
    } else {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setParentnameError(false);
      setGenderError(false);
      setProgramError(false);
      setDobError(false);
      const studentUpdateDetails = {
        studentid: route.params ? route.params.updateData.studentid : '',
        studentname: name,
        studentcategory: studentcategory,
        phone: phone,
        gender: gender,
        parentsname: parentname.trim().toLowerCase(),
        dob: dob.split('-').reverse().join('-'),
      };

      console.log('studentUpdateDetails--->', studentUpdateDetails);
      dispatch(
        studenttypes.updateStudentStart({
          studentUpdateDetails,
          studentId: route.params ? route.params.updateData._id : '',
        }),
      );
      navigation.navigate('studentlist');
    }
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {text: 'Cancel', onPress: () => null},
          {
            text: 'Ok',
            onPress: () => navigation.navigate('studentlist'),
            style: 'cancel',
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

  const handleSubmit = async e => {
    e.preventDefault();

    if (count >= 3) {
      Alert.alert(
        'Warning',
        'ଆପଣ ପୂର୍ବରୁ ଏହି ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିସାରିଛନ୍ତି । ଧ୍ୟାନ ଦେବେ ଆପଣ ଗୋଟିଏ ମୋବାଇଲ୍ ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିପାରିବେ।',
      );
      return;
    }
    const phoneRegExp = /^[6-9]\d{9}$/;
    if (name === undefined || name === null || name.trim() === '') {
      setNameError(true);
      setBackStatus(true);
    } else if (!phoneRegExp.test('' + phone)) {
      setNameError(false);
      setPhoneError(true);
      setBackStatus(true);
    } else if (gender === undefined || gender === null || gender === '') {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setParentnameError(false);
      setGenderError(true);
      setDobError(false);
      setBackStatus(true);
    } else if (dob === undefined || dob === null || dob === '') {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setParentnameError(false);
      setGenderError(false);
      setDobError(true);
      setBackStatus(true);
    } else if (
      parentname === undefined ||
      parentname === null ||
      parentname === ''
    ) {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setGenderError(false);
      setDobError(false);
      setParentnameError(true);
      setBackStatus(true);
    } else if (
      studentclass === undefined ||
      studentclass === null ||
      studentclass === ''
    ) {
      setNameError(false);
      setPhoneError(false);
      setProgramError(true);
      setGenderError(false);
      setDobError(false);
      setParentnameError(false);
      setClassError(false);
      setBackStatus(true);
    } else if (
      classlabal === undefined ||
      classlabal === null ||
      classlabal === ''
    ) {
      setNameError(false);
      setPhoneError(false);
      setProgramError(false);
      setGenderError(false);
      setDobError(false);
      setParentnameError(false);
      setClassError(true);
      setBackStatus(true);
    } else {
      setNameError(false);
      setPhoneError(false);
      setClassError(false);
      setParentnameError(false);
      setGenderError(false);
      setProgramError(false);
      setDobError(false);
      setModal(true);
      setBackStatus(false);

      var rollno = 'TZ' + Math.floor(1000 + Math.random() * 9000);

      axios
        .get(
          `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=TR&template_id=11454&sender_id=THNKZN&language=UC&template=%E0%AC%A5%E0%AC%BF%E0%AC%99%E0%AD%8D%E0%AC%95%E0%AC%9C%E0%AD%8B%E0%AC%A8%E0%AD%8D+%E0%AC%B0%E0%AD%87+${name}%E0%AC%B0+%E0%AC%A8%E0%AC%BE%E0%AC%AE+%E0%AC%AA%E0%AC%9E%E0%AD%8D%E0%AC%9C%E0%AD%80%E0%AC%95%E0%AC%B0%E0%AC%A3+%E0%AC%95%E0%AC%B0%E0%AC%BF%E0%AC%AC%E0%AC%BE%E0%AC%B0+%E0%AC%B0%E0%AD%8B%E0%AC%B2+%E0%AC%A8%E0%AC%AE%E0%AD%8D%E0%AC%AC%E0%AC%B0+%E0%AC%B9%E0%AD%87%E0%AC%89%E0%AC%9B%E0%AC%BF+${rollno}+%E0%A5%A4+%E0%AC%8F%E0%AC%B9%E0%AC%BE%E0%AC%95%E0%AD%81+%E0%AC%B6%E0%AC%BF%E0%AC%95%E0%AD%8D%E0%AC%B7%E0%AC%95+${user[0].username}%20 %E0%AC%99%E0%AD%8D%E0%AC%95%E0%AD%81+%E0%AC%A6%E0%AD%87%E0%AC%87+%E0%AC%AA%E0%AC%9E%E0%AD%8D%E0%AC%9C%E0%AD%80%E0%AC%95%E0%AC%B0%E0%AC%A3+%E0%AC%A8%E0%AC%BF%E0%AC%B6%E0%AD%8D%E0%AC%9A%E0%AC%BF%E0%AC%A4+%E0%AC%95%E0%AC%B0%E0%AC%A8%E0%AD%8D%E0%AC%A4%E0%AD%81+%E0%A5%A4+ThinkZone&contact_numbers=${phone}`,
        )
        .then(response => {
          if (response.data.code === 200) {
            const studentDetails = {
              userid: user[0].userid,
              username: user[0].username,
              centerid: '',
              centername: '',
              studentid: new Date().getTime(),
              studentname: name,
              studentcategory: studentcategory,
              program: studentclass,
              class: classlabal,
              phone: phone,
              gender: gender,
              // dob: dob.toString(),
              dob: dob.split('-').reverse().join('-'),
              parentsname: parentname,
              schoolname: user[0].schoolname,
              udisecode: user[0].udisecode,
              usertype: user[0].usertype,
              passcode: user[0].passcode,
              managerid: user[0].managerid,
              managername: user[0].managername,
              registration_date: new Date().toString(),
              otp_status: response.data.code,
              otp_status_message: response.data.msg,
              otp_response_code: response.data.code,
              otp_campain_id: response.data.data[0].campaign_id,
              otp_mobile_number: response.data.data[0].number,
              otp_message_id: response.data.data[0].message_id,
              otp: rollno,
              sentToServer: true,
              otp_isverified: false,
              otp_expire_on: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ),
              appVersion: app_versions,
              // image: profileDetails.image,
            };

            if (studentCreateError?.response?.status === 500) {
              Alert.alert(
                'Info',
                'ଆପଣ ପୂର୍ବରୁ ଏହି ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିସାରିଛନ୍ତି । ଧ୍ୟାନ ଦେବେ ଆପଣ ଗୋଟିଏ ମୋବାଇଲ୍ ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିପାରିବେ।',
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('HomeScreen'),
                  },
                ],
                {cancelable: false},
              );
              // showMessage({
              //   message: `ଆପଣ ପୂର୍ବରୁ ଏହି ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିସାରିଛନ୍ତି । ଧ୍ୟାନ ଦେବେ ଆପଣ ଗୋଟିଏ ମୋବାଇଲ୍ ନମ୍ୱର୍ ରେ ୩ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିପାରିବେ।`,
              //   // description: 'Successfully student deleted.',
              //   type: 'danger',
              //   backgroundColor: Colors.danger,
              // });
            } else {
              dispatch(studenttypes.createStudentStart(studentDetails));
              showMessage({
                message: `Good things take time! ଶିକ୍ଷାର୍ଥୀଙ୍କ ରୋଲନମ୍ବର ଅଭିଭାବକଙ୍କୁ ତାଙ୍କ ମୋବାଇଲ ନମ୍ବରରେ ପଠାଯାଇଛି । ଅଭିଭାବକଙ୍କୁ ଯୋଗାଯୋଗ କରି ପଞ୍ଜୀକରଣ ସଂପୂର୍ଣ୍ଣ କରନ୍ତୁ ।`,
                // description: 'Successfully student deleted.',
                type: 'success',
                backgroundColor: Colors.success,
              });
              dispatch(types.rewardsUserstart(user[0].userid));
              ToastAndroid.show(
                'Roll number generate success.',
                ToastAndroid.SHORT,
              );
              setButton(true);
            }
          } else {
            ToastAndroid.show(
              'Roll number generate error. Please try again.',
              ToastAndroid.SHORT,
            );
          }
        });

      // db.transaction(tx => {
      //   //
      //   tx.executeSql(
      //     'INSERT INTO student_table (userid, username, centerid,centername,studentid,studentname,studentcategory,program,class,phone,gender,dob,parentsname,schoolname,udisecode,usertype,passcode,managerid,managername) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      //     [
      //       user[0].userid,
      //       user[0].username,
      //       '',
      //       '',
      //       new Date().getTime(),
      //       name,
      //       studentcategory,
      //       studentclass,
      //       classlabal,
      //       phone,
      //       gender,
      //       dob.toString(),
      //       parentname,
      //       user[0].schoolname,
      //       user[0].udisecode,
      //       user[0].usertype,
      //       user[0].passcode,
      //       user[0].managerid,
      //       user[0].managername,
      //     ],
      //     (tx, results) => {
      //       //
      //       if (results.rowsAffected > 0) {
      //         Alert.alert(
      //           'Success',
      //           'You are Registered Successfully',
      //           [
      //             {
      //               text: 'Ok',
      //               onPress: () => navigation.navigate('HomeScreen'),
      //             },
      //           ],
      //           {cancelable: false},
      //         );
      //       } else alert('Registration Failed');
      //     },
      //   );
      // });

      // }
      // dispatch(createmanager(imageData, userDetails));
      // dispatch(googleSignIn({email}));
      // console.log(
      //   studentDetails,
      //   'studentDetails------------------------------>',
      // );
      // dispatch(studenttypes.createStudentStart(studentDetails));
      // navigation.navigate('home');

      setName('');
      setParentname('');
      setPhone('');
      setDob('');
      setGender('');
      setStudentClass('');
      setClasslabal('');
    }
  };
  const Cancel = () => {
    navigation.navigate('studentlist');
  };
  return (
    <ScrollView style={{backgroundColor: 'white', marginTop: -3}}>
      {/* <Header /> */}

      <View style={styles.editFormContainer}>
        {/* Profile image code */}

        <View style={{paddingHorizontal: 10, paddingRight: 5}}>
          {updateStatus ? (
            <Text
              style={{
                fontSize: FontSize.size_lg,
                fontWeight: '700',
                fontFamily: FontFamily.poppinsSemibold,
                // width: 148,
                // height: 19,
                textAlign: 'left',
                textTransform: 'capitalize',
                // left: '15%',
                color: Color.gray_100,
                marginTop: 10,
                paddingBottom: 10,
              }}>
              Update Student Details
            </Text>
          ) : (
            <Text
              style={{
                fontSize: FontSize.size_lg,
                fontWeight: '700',
                fontFamily: FontFamily.poppinsSemibold,
                // width: 148,
                // height: 19,
                textAlign: 'left',
                textTransform: 'capitalize',
                // left: '15%',
                color: Color.gray_100,
                // marginTop: 10,
                paddingBottom: 10,
              }}>
              Register Student
            </Text>
          )}

          {/*Name text inpute */}
          <AppTextInput
            collapsable={false}
            autoCapitalize="none"
            autoCorrect={false}
            iconFirst="rename-box"
            keyboardType="email-address"
            name="name"
            placeholder="Name"
            placeholderTextColor="#000000"
            value={name}
            onChangeText={value => {
              setName(value);
              setBackStatus(true);
            }}
          />
          <ErrorMessage visible={nameError} error={t('name_error')} />
          {/*Email text inpute*/}
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            iconFirst="account-multiple"
            name="name"
            placeholder="Guardian Name"
            placeholderTextColor="#000000"
            value={parentname}
            onChangeText={value => setParentname(value)}
          />
          <ErrorMessage
            visible={parentnameError}
            error={t('parentname_error')}
          />

          {otp_status === true ? (
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              iconFirst="phone"
              keyboardType="number-pad"
              name="name"
              editable={false}
              placeholderTextColor="#000000"
              maxLength={10}
              placeholder="Phone Number"
              value={phone}
              onChangeText={value => setPhone(value)}
            />
          ) : (
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              iconFirst="phone"
              keyboardType="number-pad"
              name="name"
              placeholderTextColor="#000000"
              maxLength={10}
              placeholder="Phone Number"
              value={phone}
              onChangeText={value => setPhone(value)}
            />
          )}
          {/*Phone text inpute*/}
          {/* <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            iconFirst="phone"
            keyboardType="number-pad"
            name="name"
            placeholderTextColor="#000000"
            maxLength={10}
            placeholder="Phone Number"
            value={phone}
            onChangeText={value => setPhone(value)}
          /> */}

          {phone === undefined || phone === null || phone === '' ? (
            <ErrorMessage visible={phoneError} error={t('phone_error')} />
          ) : null}

          {/* Student Dob */}
          <View style={styles.dob}>
            <MaterialIcons
              name="date-range"
              size={27}
              color={Colors.greyPrimary}
              style={styles.icon}
            />
            <DatePicker
              style={{
                width: 363,
                marginLeft: -5,
              }}
              date={dob}
              mode="date"
              placeholder={`DD/MM/YYYY`}
              placeholderTextColor={'black'}
              dateFormat="DD-MM-YYYY"
              //format="YYYY-MM-DD"
              format="DD-MM-YYYY"
              minDate="01-01-1990"
              maxDate="31-12-2020"
              // minDate="2009-01-01"
              //maxDate="2019-12-31"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                // dateIcon: {
                //   position: 'absolute',
                //   right: 184,
                //   top: 8,
                //   marginLeft: 0,
                // },
                dateIcon: {
                  display: 'none',
                },
                dateInput: {
                  marginLeft: -195,
                  // borderColor: 'white',
                  // borderStyle: 'dotted',
                  marginRight: -15,
                  borderWidth: -1,
                  // borderRadius: 1,
                  position: 'relative',
                  flex: 1,

                  height: 50,
                  marginBottom: -10,
                  borderRadius: 22,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                setDob(date);
              }}
            />
          </View>
          <ErrorMessage visible={dobError} error={t('dob_error')} />
          {/* <Button title="DOB" onPress={() => setOpen(true)} />
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={dob}
                  onConfirm={date => {
                    setOpen(false);
                    setDob(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                <Text style={{color: Colors.black}}>{dob.toString()}</Text> */}
          {/* <DatePicker mode="date"  date={dob} onDateChange={setDob} /> */}

          {/*Picker for gender */}
          <View style={styles.wrapper}>
            <Gender
              name="male-female"
              size={27}
              color={Colors.greyPrimary}
              style={styles.icon}
            />
            <Picker
              dropdownIconColor={Colors.primary}
              selectedValue={gender}
              onValueChange={itemValue => setGender(itemValue)}
              style={styles.picker}
              name="district">
              <Picker.Item
                label="Select Gender"
                value="0"
                enabled={false}
                style={styles.placeHolder}
              />
              <Picker.Item
                label="Male"
                value="male"
                style={styles.pickerSelectItem}
              />
              <Picker.Item
                label="Female"
                value="female"
                style={styles.pickerSelectItem}
              />
              <Picker.Item
                label="Others"
                value="others"
                style={styles.pickerSelectItem}
              />
            </Picker>
          </View>
          {gender === undefined || gender === null || gender === '' ? (
            <ErrorMessage visible={genderError} error={t('gender_error')} />
          ) : null}

          {updateStatus ? (
            <></>
          ) : (
            // {/*Picker for className */}
            <View>
              <View style={styles.wrapper}>
                <ClassName
                  name="class"
                  size={27}
                  color={Colors.greyPrimary}
                  style={styles.icon}
                />
                <Picker
                  dropdownIconColor={Colors.primary}
                  selectedValue={studentclass}
                  onValueChange={itemValue => setStudentClass(itemValue)}
                  style={styles.picker}
                  name="district">
                  <Picker.Item
                    label="Select Program"
                    value="0"
                    enabled={false}
                    style={styles.placeHolder}
                  />
                  <Picker.Item
                    label="PGE"
                    value="pge"
                    style={styles.pickerSelectItem}
                  />
                  <Picker.Item
                    label="ECE"
                    value="ece"
                    style={styles.pickerSelectItem}
                  />
                </Picker>
              </View>

              {studentclass === undefined ||
              studentclass === null ||
              studentclass === '' ? (
                <ErrorMessage
                  visible={programError}
                  error={t('program_error')}
                />
              ) : null}
            </View>
          )}

          {/*Picker for class labal */}
          {studentclass && !updateStatus ? (
            studentclass == 'pge' ? (
              <View>
                <View style={styles.wrapper}>
                  <Classlabal
                    name="md-bookmark"
                    size={25}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                  <Picker
                    dropdownIconColor={Colors.primary}
                    selectedValue={classlabal}
                    onValueChange={(itemValue, itemIndex) =>
                      handleclasslabelChange(itemValue, itemIndex)
                    }
                    style={styles.picker}
                    name="classlabal">
                    <Picker.Item
                      label="Select Class"
                      value="0"
                      enabled={false}
                      style={styles.placeHolder}
                    />
                    {pgeArray.map(item => (
                      <Picker.Item
                        label={item.value}
                        value={item.id}
                        key={item.id}
                        style={styles.pickerSelectItem}
                      />
                    ))}
                  </Picker>
                </View>
                <ErrorMessage visible={classError} error={t('class_error')} />
              </View>
            ) : (
              <View>
                <View style={styles.wrapper}>
                  <Classlabal
                    name="md-bookmark"
                    size={25}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                  <Picker
                    selectedValue={classlabal}
                    onValueChange={(itemValue, itemIndex) =>
                      handleclasslabelChange(itemValue, itemIndex)
                    }
                    style={styles.picker}
                    name="classlabal">
                    <Picker.Item
                      label="Select Level"
                      value="0"
                      enabled={false}
                      style={styles.placeHolder}
                    />
                    {eceArray.map(item => (
                      <Picker.Item
                        label={item.value}
                        value={item.id}
                        key={item.id}
                        style={styles.pickerSelectItem}
                      />
                    ))}
                  </Picker>
                </View>
                <ErrorMessage visible={classError} error={t('level_error')} />
              </View>
            )
          ) : (
            <View></View>
          )}
          {updateStatus ? (
            //  <Button title="SAVE" onPress={upadteSubmit} />
            <TouchableOpacity style={styles.button} onPress={upadteSubmit}>
              <Text style={styles.text}>Update</Text>
            </TouchableOpacity>
          ) : (
            // <Button
            //   style={{fontSize: 20, color: 'green'}}
            //   title="REGISTER"
            //   onPress={handleSubmit}
            // />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // alignSelf: 'flex-start',
                top: '10%',
              }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 37,
                  borderRadius: 15,
                  // elevation: 3,
                  // marginLeft: 30,
                  alignSelf: 'center',
                  justifyContent: 'space-around',
                  // marginRight: 45,
                  marginBottom: 12,
                  // backgroundColor: '#00C0F0',
                  borderWidth: 1,
                  borderColor: Color.royalblue,
                  right: '30%',
                }}
                onPress={Cancel}>
                <Text style={[styles.text, {color: 'black'}]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                <Text style={styles.text}>REGISTER</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                // height: window.WindowHeigth * 0.6,

                width: window.WindowWidth * 0.9,
                borderRadius: 20,
              },
            ]}>
            {/* <Pressable onPress={() => setModal(false)}>
              <Entypo
                name="circle-with-cross"
                // color={Color.primary}
                size={30}
                style={{marginLeft: 255, marginTop: -25}}
              />
            </Pressable> */}
            <Image
              style={[
                styles.tinyLogos,
                {
                  width: 250,
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // marginTop: -40,
                },
              ]}
              source={require('../assets/Image/success.gif')}
            />

            <Text
              style={[
                styles.username,
                {
                  fontSize: 18,
                  color: 'black',
                  fontWeight: '600',
                  fontFamily: FontFamily.poppinsMedium,
                  justifyContent: 'center',
                  textTransform: 'capitalize',
                  // width: 200,
                  alignSelf: 'center',
                },
              ]}>
              Congratulations! {''}
            </Text>
            <Text
              style={{
                color: '#666666',
                // fontWeight: '800',
                fontWeight: '600',
                fontFamily: FontFamily.poppinsMedium,

                textTransform: 'capitalize',
              }}>
              {user[0].username}
            </Text>
            <Text
              style={[
                styles.username,
                {
                  fontSize: 13,
                  // color: '#666666',
                  color: '#666666',
                  fontWeight: '400',
                  fontFamily: FontFamily.poppinsMedium,
                  marginTop: 10,
                  alignSelf: 'center',
                },
              ]}>
              ଆପଣ ସଫଳତାର ସହ ଶିକ୍ଷାର୍ଥୀ ପଞ୍ଜିକରଣ କରିଛନ୍ତି।
            </Text>

            {button ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('studentlist')}
                style={[
                  styles.bu,
                  {
                    marginTop: 40,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 15,
                    // color: Color.white,
                    // fontWeight: '900',
                    textAlign: 'center',
                    fontFamily: FontFamily.poppinsMedium,
                    color: 'white',
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  color: 'black',
                  fontSize: 15,
                  fontWeight: 'bold',
                  fontFamily: FontFamily.poppinsMedium,
                }}>
                Loading.....
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default StudentRegister;

const styles = StyleSheet.create({
  statusPosition2: {
    left: '0%',
    right: '0%',
    top: '0%',
    position: 'absolute',
    width: '100%',
  },
  statusPosition: {
    bottom: '0%',
    left: '0%',
  },
  statusPosition1: {
    height: '100%',
    bottom: '0%',
    right: '0%',
    top: '0%',
    width: '100%',
  },
  timePosition: {
    opacity: 0.9,
    height: 15,
    width: 29,
    left: '50%',
    top: '50%',
    marginLeft: 11.22,
    position: 'absolute',
    overflow: 'hidden',
  },
  batteryIconLayout: {
    width: 13,
    marginLeft: -5.8,
  },
  iconPosition1: {
    height: 13,
    marginTop: -6.12,
    left: '50%',
    top: '50%',
    position: 'absolute',
  },
  rectangleViewBg: {
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  cellularIconSpaceBlock: {
    marginLeft: -22.58,
    width: 13,
  },
  wifiIconLayout: {
    width: 15,
    marginLeft: -39.37,
  },
  statusBarBgLayout: {
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  groupChild2Bg: {
    backgroundColor: Color.primaryContrast,
    position: 'absolute',
  },
  groupViewPosition: {
    left: '10%',
    width: '80.28%',
    right: '9.72%',
    height: '6.38%',
    position: 'absolute',
  },
  genderTypo: {
    top: '17.65%',
    height: '82.35%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    color: Color.dimgray_100,
    position: 'absolute',
  },
  changeDetailsPosition: {
    left: '9.72%',
    position: 'absolute',
  },
  rectanglePosition: {
    left: '9.44%',
    width: '81.39%',
    height: '6.38%',
    right: '9.17%',
    position: 'absolute',
  },
  iconessentialhomeLayout: {
    bottom: '59.21%',
    top: '9.71%',
    width: '8.88%',
    height: '31.08%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  homeTypo: {
    color: Color.black,
    width: '24.71%',
    height: '15.54%',
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    position: 'absolute',
  },
  homeLayout: {
    top: '43.7%',
    color: Color.black,
    width: '24.71%',
    height: '15.54%',
  },
  text: {
    textAlign: 'right',
    color: Color.dimgray_100,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
  },
  time: {
    marginTop: -7.86,
  },
  statusBarContents: {
    height: '75%',
    width: '22.33%',
    top: '8.33%',
    right: '1.94%',
    bottom: '16.67%',
    left: '75.73%',
    position: 'absolute',
    overflow: 'hidden',
  },
  statusBar1: {
    position: 'absolute',
  },
  statusBar: {
    height: '2.62%',
    bottom: '97.38%',
  },
  studentRegisterChild: {
    height: '16%',
    width: '107.22%',
    top: '0.25%',
    right: '-4.44%',
    bottom: '83.75%',
    left: '-2.78%',
  },
  text1: {
    color: Color.primaryContrast,
    textAlign: 'right',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
  },
  time1: {
    marginTop: -8.09,
  },
  iconPosition: {
    marginTop: -6.35,
    height: 13,
    left: '50%',
    top: '50%',
    position: 'absolute',
  },
  statusBar2: {
    height: '4.36%',
    bottom: '95.64%',
  },
  studentRegisterItem: {
    height: '15.63%',
    width: '24.44%',
    right: '73.06%',
    bottom: '80.63%',
    left: '2.5%',
    top: '3.75%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  helloRam: {
    // marginTop: -20,
    // height: '2.38%',
    width: '50.89%',
    fontSize: FontSize.size_lg,
    fontWeight: '900',
    fontFamily: FontFamily.poppinsSemibold,
    textAlign: 'left',
    left: '28.39%',
    top: '2.75%',
    color: Color.primaryContrast,
    position: 'absolute',
    textTransform: 'capitalize',
    paddingBottom: 50,
  },
  completeYourNext: {
    height: '5.25%',
    width: '48.06%',
    top: '9.13%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    left: '28.39%',
    color: Color.primaryContrast,
    position: 'absolute',
  },
  icons8SoSo481: {
    height: '2.13%',
    width: '5.28%',
    top: '6.63%',
    right: '37.78%',
    bottom: '91.25%',
    left: '56.94%',
  },
  iconnotificationnotification: {
    height: '4.38%',
    width: '9.72%',
    top: '8.38%',
    bottom: '87.25%',
    left: '81.11%',
    right: '9.17%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  studentRegisterInner: {
    // height: '46.5%',
    width: '91.39%',
    // top: '18.13%',
    right: '4.17%',
    bottom: '35.38%',
    left: '4.44%',
    borderRadius: Border.br_7xs,
  },
  rectangleView: {
    height: '4.88%',
    width: '31.39%',
    top: '58.13%',
    right: '34.17%',
    bottom: '37%',
    left: '34.44%',
    borderRadius: Border.br_xl,
  },
  update: {
    width: '27.5%',
    top: '58.88%',
    left: '36.39%',
    textAlign: 'center',
    height: '3.75%',
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    color: Color.primaryContrast,
    position: 'absolute',
  },
  groupChild: {
    height: '74.51%',
    bottom: '25.49%',
    borderRadius: Border.br_7xs,
    backgroundColor: Color.aliceblue_100,
    left: '0%',
    right: '0%',
    top: '0%',
  },
  gender: {
    width: '37.37%',
    left: '5.19%',
  },
  rectangleParent: {
    top: '51.63%',
    bottom: '42%',
  },
  phoneNumber: {
    width: '39.18%',
    left: '5.5%',
  },
  rectangleGroup: {
    width: '80.83%',
    top: '38.88%',
    right: '9.44%',
    bottom: '54.75%',
    height: '6.38%',
    left: '9.72%',
  },
  guardianName: {
    width: '45.73%',
    left: '5.8%',
  },
  rectangleContainer: {
    top: '32.5%',
    bottom: '61.13%',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 75,
    // alignSelf: 'center',
    marginTop: 30,
    left: '2%',
  },
  groupView: {
    top: '45.25%',
    bottom: '48.38%',
  },
  changeDetails: {
    height: '3.21%',
    width: '44.17%',
    top: '20.13%',
    color: Color.darkslategray_200,
    left: '9.72%',
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',
  },
  iconessentialtrushSquare: {
    width: '8.33%',
    top: '20%',
    bottom: '76.25%',
    left: '81.94%',
    right: '9.72%',
    height: '3.75%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  groupChild2: {
    height: '99.24%',
    width: '99.94%',
    top: '99.24%',
    right: '-99.94%',
    bottom: '-98.48%',
    left: '100%',
    borderBottomRightRadius: Border.br_7xs,
    borderBottomLeftRadius: Border.br_7xs,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowRadius: 3,
    elevation: 3,
    shadowOpacity: 1,
    transform: [
      {
        rotate: '179.88deg',
      },
    ],
  },
  vuesaxbulkrankingIcon: {
    right: '46.42%',
    left: '44.69%',
  },
  leaderBoard: {
    left: '36.92%',
  },
  myRewards: {
    top: '42.73%',
    left: '69.96%',
    color: Color.black,
    width: '24.71%',
    height: '15.54%',
  },
  home: {
    left: '4.72%',
  },
  iconessentialhome: {
    right: '78.9%',
    left: '12.21%',
  },
  iconessentialcup: {
    top: '8.74%',
    right: '14.22%',
    bottom: '60.18%',
    left: '76.9%',
    width: '8.88%',
    height: '31.08%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  rectangleParent1: {
    height: '12.87%',
    width: '100.06%',
    top: '87.13%',
    right: '-0.06%',
    position: 'absolute',
  },
  rectangleParent2: {
    top: '26%',
    bottom: '67.63%',
  },
  studentRegister: {
    flex: 1,
    height: 900,
    // overflow: 'hidden',
    width: '100%',
    backgroundColor: Color.aliceblue_100,
  },
  button: {
    backgroundColor: 'red',
  },
  constainer: {
    alignSelf: 'center',
    flex: 1,
    width: window.WindowWidth * 0.9,
    height: 160,
    marginTop: 29,
    //  borderTopLeftRadius: 70,
    marginBottom: 111,

    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 9,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'scroll',
  },
  editFormContainer: {
    marginHorizontal: 20,
    marginVertical: 39,
    borderRadius: 8,
    // backgroundColor: Colors.white,
    // marginTop: -640,
    marginLeft: 39,
    //  borderTopLeftRadius: 70,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 37,
    borderRadius: 15,
    elevation: 3,
    // marginLeft: 30,
    alignSelf: 'center',
    justifyContent: 'space-around',
    // marginRight: 45,
    marginBottom: 12,
    // backgroundColor: '#00C0F0',
    backgroundColor: Color.royalblue,
  },
  text: {
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
  },

  editImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  imageContainer: {
    height: 120,
    width: 120,
  },
  inputBorder: {
    backgroundColor: '#cacaca',
    color: Colors.black,
    width: '25%',
    height: 35,
    borderRadius: 8,
    borderColor: '#cacaca',
    borderWidth: 1,
    placeholderTextColor: Colors.black,
  },
  dob: {
    marginVertical: 5,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 17,
    // borderWidth: 0.5,
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    placeholderTextColor: 'black',
  },

  editImageIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.success,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  modalContainer: {
    height: window.WindowHeigth * 0.1,
    backgroundColor: Colors.white,
    elevation: 5,
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },

  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 60,
  },

  modalButtonText: {
    fontSize: 13,
  },

  wrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.white,
    // paddingBottom: 5,
    // marginVertical: 5,
    // minHeight: 35,
    marginVertical: 5,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingBottom: 3,
    marginBottom: 17,
    // borderWidth: 0.5,
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    fontFamily: FontFamily.poppinsMedium,
  },

  icon: {
    marginHorizontal: 5,
    marginVertical: 5,
    marginTop: 15,
  },

  picker: {
    flex: 1,
    color: Colors.black,
  },

  placeHolder: {
    //  color: Colors.greyPrimary,
    color: 'black',
    fontSize: 18,
    letterSpacing: 0.5,
  },

  pickerSelectItem: {
    // color: Colors.greyPrimary,
    color: 'black',
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  p: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',

    fontSize: 18,

    color: 'black',

    marginBottom: 25,
    marginTop: 40,
    textAlign: 'center',
  },

  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  modalContainer: {
    height: window.WindowHeigth * 0.1,
    backgroundColor: Colors.white,
    elevation: 5,
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },

  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 60,
  },

  modalButtonText: {
    fontSize: 13,
  },

  icon: {
    marginHorizontal: 5,
    marginVertical: 5,
    marginTop: 15,
  },

  picker: {
    flex: 1,
    color: Colors.black,
  },

  placeHolder: {
    //  color: Colors.greyPrimary,
    color: 'black',
    fontSize: 18,
    letterSpacing: 0.5,
  },

  pickerSelectItem: {
    // color: Colors.greyPrimary,
    color: 'black',
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  p: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',

    fontSize: 18,

    color: 'black',

    marginBottom: 25,
    marginTop: 40,
    textAlign: 'center',
  },
});
