import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Button,
  Pressable,
  StatusBar,
  BackHandler,
  PermissionsAndroid,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {ToastAndroid} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Api from '../environment/Api';
import {useNavigation} from '@react-navigation/native';
import {Color, Border, FontSize, FontFamily} from '../GlobalStyle';
import {AzureImage} from '../components/Azure';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import Cameraicon from 'react-native-vector-icons/Feather';
import ButtomSheet from '../components/BottomSheet';
import Colors from '../utils/Colors';
import {useTranslation} from 'react-i18next';
import AppTextInput from '../components/TextInput';
import ErrorMessage from '../components/ErrorMessage';
import Gender from 'react-native-vector-icons/Foundation';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {useMemo} from 'react';
import * as window from '../utils/dimensions';
import {app_versions} from './Home';
import {
  fetchBlockDataThunk,
  fetchDistrictDataThunk,
} from '../redux_toolkit/features/users/UserThunk';
import DateTimePicker from '@react-native-community/datetimepicker';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getYearsAgo = years => {
  // console.log('years--->', years);
  const currentYear = getCurrentYear();
  return currentYear - years;
};

const Register = ({navigation, route}) => {
  const dispatch = useDispatch();
  const emailId = route.params?.email;
  const phoneNumber = route.params?.phone;
  const loginType = route.params?.loginType;
  console.log(' route.params--------->', route.params);
  const districtlist = useSelector(state => state.UserSlice.district);
  const blocklist = useSelector(state => state.UserSlice.block);
  const users = useSelector(state => state.UserSlice.user);
  const {t} = useTranslation();
  const modalRef = useRef(null);
  const [successmodal, setSuccessmodal] = useState(false);
  const modalHeight = HEIGHT * 1.5;

  const [name, setName] = useState('');

  const [guardianName, setGuardianName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState({});
  const [phone, setPhone] = useState(phoneNumber ? phoneNumber : '');

  const [passcode, setPasscode] = useState('');

  const [managertype, setManagertype] = useState('');

  const [dob, setDob] = useState(null);
  const [email, setEmail] = useState(emailId ? emailId : '');

  const [district, setDistrict] = useState('');
  const [block, setBlock] = useState('');
  console.log('block-->', block);
  const [state, setState] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [gender, setGender] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [aadhaar, setAadhaar] = useState('');

  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');

  const [usertype, setUsertype] = useState('');

  const [schools, setSchools] = useState([]);
  // console.log('check usertype------>', usertype, schools.length);
  const [managername, setManagername] = useState('');
  const [managerId, setManagerId] = useState('');
  //States for Error
  const [nameError, setNameError] = useState(false);
  const [guardianNameError, setGuardianNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [numberExists, setNumberExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [qualificationError, setQualificationError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);
  const [qualification, setQualification] = useState();
  const [districtError, setDistrictError] = useState(false);
  const [blockError, setBlockError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [aadhaarError, setAadhaarError] = useState(false);
  const [modal, setModal] = useState(false);
  const [gifModal, setGifModal] = useState(false);
  const [lnameError, setLnameError] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  //State to handle error in image error
  const [error, setError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const onDateChange = (event, selectedDate) => {
    setShowPicker(false); // Close the picker when a date is selected
    if (selectedDate) {
      setDob(moment(selectedDate).format('DD-MM-YYYY')); // Format and set the date
    }
  };

  // Show DatePicker
  const showDatepicker = () => {
    setShowPicker(true);
  };
  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const minDate = `01-01-${getYearsAgo(64)}`;
  const maxDate = `01-01-${getYearsAgo(18)}`;

  useMemo(() => {
    dispatch(fetchDistrictDataThunk());
  }, [state]);

  const [showInput, setShowInput] = useState(false);
  const [selectedValue, setSelectedValue] = useState('no');
  const [managerName, setManagerName] = useState('');

  //Function to set district
  const handleDistrictChange = (itemValue, itemIndex) => {
    //
    setDistrict(itemValue);
    setDistrictId(districtlist[itemIndex - 1]._id);
    setBlock('');
    dispatch(fetchBlockDataThunk(districtlist[itemIndex - 1]._id));
  };

  const handleQualificationChange = (itemValue, itemIndex) => {
    //
    setQualification(itemValue);
  };

  //Function to set block
  const handleBlockChange = (itemValue, itemIndex) => {
    setBlock(itemValue);
    setBlockId(blocklist[itemIndex - 1]._id);
    if (itemValue?.length > 0) {
      setBlockError(false);
    }
  };

  const handlePhone = (itemValue, itemIndex) => {
    setPhone(itemValue);

    if (itemValue.length === 10) {
      const body = {
        contactnumber: itemValue,
      };
      Api.post(`checkCredentialAvailability`, body).then(response => {
        if (
          response.data.status === 'success' &&
          response.data.unique === true
        ) {
          setPhoneError(false);
          setNumberExists(false);
          ToastAndroid.show(
            'Number successfully verified !',
            ToastAndroid.SHORT,
          );
        } else {
          setNumberExists(true);
          ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
        }
      });
    }
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
              title: 'ThinkZone App Camera Permission',
              message:
                'ThinkZone App needs access to your camera' +
                'so you can take pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
              const image = await ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
              });

              setError(false);

              const fileUri = image?.path;
              const uploadResult = await AzureImage(fileUri);

              setImageUrl(uploadResult?.url);

              const pathSegments = uploadResult?.url.split('/');
              const filename = pathSegments[pathSegments.length - 1];
              // console.log('filename--->', filename);
              setImageData(filename);
              // console.log('response====>', response.data);

              // console.log(
              //   'image---->',
              //   fileUri,
              //   uploadResult,
              //   // camelCaseFilename,
              // );
              // setImageUrl(image.path);
              // setImageData(image);

              // const pathSegments = image.path.split('/');
              // const filename = pathSegments[pathSegments.length - 1];
              // const formData = new FormData();
              // const getFileExtension = filename => {
              //   return filename.slice(
              //     ((filename.lastIndexOf('.') - 1) >>> 0) + 2,
              //   );
              // };

              // const fileExtension = getFileExtension(filename);
              // let mimeType;

              // if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
              //   mimeType = 'image/jpeg';
              // } else if (fileExtension === 'png') {
              //   mimeType = 'image/png';
              // } else {
              //   // Handle other image formats if needed
              //   mimeType = 'image/jpeg'; // Default to jpeg for unknown formats
              // }
              // formData.append('file', {
              //   uri: image.path,
              //   type: mimeType,
              //   name: filename,
              // });

              // const response = await Api.post(
              //   `uploadFile/${filename}`,
              //   formData,
              //   {
              //     headers: {
              //       'Content-Type': 'multipart/form-data',
              //     },
              //   },
              // );

              // setImageUrl(response?.data?.url);
              // setImageData(response?.data?.url);
            } catch (err) {
              if (err.response.status === 413) {
                Alert.alert('File is too large');
              } else {
                console.error('Error processing camera image:', err);
              }
            }
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
      try {
        const image = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 300,
        });

        setError(false);
        // setImageUrl(image.path);
        // setImageData(image);

        // const pathSegments = image.path.split('/');
        // const filename = pathSegments[pathSegments.length - 1];
        // const formData = new FormData();
        // const getFileExtension = filename => {
        //   return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
        // };

        // const fileExtension = getFileExtension(filename);
        // let mimeType;

        // if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        //   mimeType = 'image/jpeg';
        // } else if (fileExtension === 'png') {
        //   mimeType = 'image/png';
        // } else {
        //   // Handle other image formats if needed
        //   mimeType = 'image/jpeg'; // Default to jpeg for unknown formats
        // }
        // formData.append('file', {
        //   uri: image.path,
        //   type: mimeType,
        //   name: filename,
        // });

        // const response = await Api.post(`uploadFile/${filename}`, formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });
        // setImageUrl(response?.data?.url);
        // setImageData(response?.data?.url);

        const fileUri = image?.path;
        const uploadResult = await AzureImage(fileUri);

        setImageUrl(uploadResult?.url);

        const pathSegments = uploadResult?.url.split('/');
        const filename = pathSegments[pathSegments.length - 1];
        // console.log('filename--->', filename);
        setImageData(filename);
        // console.log('response====>', response.data);

        // console.log(
        //   'image---->',
        //   fileUri,
        //   uploadResult,
        //   // camelCaseFilename,
        // );
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
    } else {
      // Handle other cases if needed
    }
  };

  const handleToggle = async value => {
    setToggleState(value);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkemailavailability(userInfo.user.email);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  const checkemailavailability = async email => {
    const body = {
      emailid: email,
    };

    Api.post(`checkCredentialAvailability`, body).then(response => {
      // console.log('emailresponse------>', response.data);
      if (response.data.status === 'success' && response.data.unique === true) {
        setEmailExists(true);
        setEmail(email);

        ToastAndroid.show('Email successfully verified !', ToastAndroid.SHORT);
      } else if (
        response.data.status === 'fail' &&
        response.data.unique === false
      ) {
        handleClearCachedToken();
        ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
      } else {
        setEmail(email);
      }
    });
  };

  const [isSignedIn, setIsSignedIn] = useState(false);
  const handleClearCachedToken = async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);

      // Additional logic for opening the Google SDK or navigating to another page
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

  const handleNext = async e => {
    e.preventDefault();

    if (numberExists === true) {
      Alert.alert(
        'Number is already in Use.Retry with another number',
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
    } else if (emailExists === false && email.length === 0) {
      Alert.alert(
        'Verify Your Emailid ',
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
      Alert.alert('Something went wrong ! ', `${users?.err?._message}`, [
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
      const phoneRegExp = /^[6-9]\d{9}$/;

      const patternRegExp = /^[a-zA-Z]+$/;

      if (name === undefined || name === null || name.trim() === '') {
        setNameError(true);
      } else if (lname === undefined || lname === null || lname.trim() === '') {
        setNameError(false);
        setLnameError(true);
      } else if (
        guardianName === undefined ||
        guardianName === null ||
        guardianName.trim() === ''
      ) {
        setNameError(false);
        setLnameError(false);

        setGuardianNameError(true);
      } else if (email === undefined || email === null || email === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(true);
      } else if (!phoneRegExp.test('' + phone)) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(true);
      } else if (dob === undefined || dob === null || dob === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(true);
      } else if (
        qualification === undefined ||
        qualification === null ||
        qualification === ''
      ) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(true);
      } else if (gender === undefined || gender === null || gender === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(true);
      }
      // else if (
      //   passcode === undefined ||
      //   passcode === null ||
      //   passcode === ''
      // ) {
      //   console.log('passcode error2---->');
      //   setNameError(false);
      //   setLnameError(false);
      //   setGuardianNameError(false);
      //   setEmailError(false);
      //   setPhoneError(false);
      //   setDobError(false);
      //   setQualificationError(false);
      //   setGenderError(false);
      //   setPasscodeError(true);
      // }
      else if (state === undefined || state === null || state === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(true);
      } else if (
        district === undefined ||
        district === null ||
        district === ''
      ) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(true);
      } else if (block === undefined || block === null || block === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(false);
        setBlockError(true);
      } else if (aadhaar.length > 0 && aadhaar.length != 12) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);
        setStateError(false);
        setDistrictError(false);
        setBlockError(false);
        setAadhaarError(true);
      } else {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(false);
        setBlockError(false);
        setAadhaarError(false);
        navigation.navigate('registerpasscode', {
          email: email,
          name: name,
          mname: mname,
          lname: lname,
          guardianName: guardianName,
          phone: phone,
          qualification: qualification,
          gender: gender,
          dob: dob,
          aadhaar: aadhaar,
          managerId: managerId,
          managername: managername,
          passcode: passcode,
          state: state,
          districtId: districtId,
          district: district,
          blockId: blockId,
          block: block,
          imageUrl: imageUrl,
          app_versions: app_versions,
          loginType: loginType,
        });
      }
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
            onPress: () => signOut(),
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

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      // dispatch(types.logOutUser());
      dispatch(types.clearUser());
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
    <>
      <View style={styles.userRegister}>
        <Modal animationType="slide" transparent={true} visible={successmodal}>
          <TouchableOpacity style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                {
                  height: window.WindowHeigth * 1.1,

                  width: window.WindowWidth * 1,
                  borderRadius: 20,

                  backgroundColor: 'white',
                },
              ]}>
              <Image
                style={[
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                source={require('../assets/Image/https___lottiefiles.com_121018-done.gif')}
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
                  },
                ]}>
                Congratulations ! {name} ସଫଳତାର ସହ ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ପ୍ରସ୍ତୁତ ହୋଇ
                ସାରିଛି ଏବଂ ଆପଣ ୨ଟି କଏନ ହାସଲ କରିଛନ୍ତି । ଆପଣ ଶିକ୍ଷକ ବିଭାଗରେ ଥିବା
                ମୂଲ୍ୟାଙ୍କନ ଦେଇପାରିବେ ।
              </Text>
            </View>
          </TouchableOpacity>
        </Modal>

        <ScrollView>
          <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                onPress={() => {
                  handleSelection('camera');
                }}
                style={styles.modalButtonContainer}>
                <Cameraicon name="camera" size={30} color={Colors.primary} />
                <Text style={styles.modalButtonText}>Take Picture</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleSelection('gallery');
                }}
                style={styles.modalButtonContainer}>
                <Cameraicon name="file" size={30} color={Colors.info} />
                <Text style={styles.modalButtonText}>choose_gallery</Text>
              </TouchableOpacity>
            </View>
          </ButtomSheet>
          <View
            style={{
              paddingHorizontal: 19,
              paddingVertical: 130,
              marginLeft: 20,

              paddingBottom: 50,
            }}>
            <ImageBackground
              style={[
                styles.userRegisterChild,
                styles.statusBarBgLayout,
                {paddingTop: 50},
              ]}
              // resizeMode="cover"
              source={
                error
                  ? require('../assets/Photos/userss.png')
                  : imageUrl
                  ? {uri: imageUrl}
                  : require('../assets/Photos/userss.png')
              }
              imageStyle={{borderRadius: 60}}
              onError={() => {
                setError(true);
              }}>
              <TouchableOpacity
                style={styles.editImageIconContainer}
                onPress={() => handleOpenBottomSheet()}>
                <Cameraicon name="camera" color={Colors.white} size={22} />
              </TouchableOpacity>
            </ImageBackground>

            <View style={{marginTop: 50}}>
              {/*Email text inpute*/}

              {email.length > 0 ? (
                <AppTextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconFirst="account-box"
                  editable={false}
                  name="name"
                  placeholder="Email"
                  placeholderTextColor="black"
                  value={email}
                  // editable={false}
                  onChangeText={value => setEmail(value)}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    top: 15,
                    margin: 8,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 5,
                    paddingBottom: 5,
                    height: 55,
                    width: window.WindowWidth * 0.9,
                    justifyContent: isLoading ? 'center' : 'flex-start',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: -20,
                    backgroundColor: Color.ghostwhite,
                    flexDirection: 'row',

                    borderRadius: 22,
                  }}
                  onPress={handleToggle}>
                  <>
                    <Image
                      source={require('../assets/Photos/googles.png')}
                      style={{
                        width: 24,
                        height: 24,

                        marginRight: 15,
                      }}
                    />
                    <Text
                      style={{
                        width: '100%',

                        textAlign: 'left',

                        fontSize: 13,
                        width: 250,
                        fontWeight: '500',
                        color: '#333333',
                        fontFamily: FontFamily.poppinsMedium,
                      }}>
                      Verify Emailid With Google
                    </Text>
                  </>
                </TouchableOpacity>
              )}
              <View style={{paddingTop: 20}}>
                {/*Name text inpute*/}
                <AppTextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconFirst="rename-box"
                  keyboardType="email-address"
                  name="name"
                  placeholder="First Name*"
                  placeholderTextColor="black"
                  value={name}
                  onChangeText={value => setName(value)}
                />

                <ErrorMessage visible={nameError} error={t('fname_error')} />

                <AppTextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconFirst="rename-box"
                  keyboardType="email-address"
                  name="name"
                  placeholder="Middle Name"
                  placeholderTextColor="black"
                  value={mname}
                  onChangeText={value => setMname(value)}
                />

                <AppTextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconFirst="rename-box"
                  keyboardType="email-address"
                  name="name"
                  placeholder="Last Name*"
                  placeholderTextColor="black"
                  value={lname}
                  onChangeText={value => setLname(value)}
                />

                <ErrorMessage visible={lnameError} error={t('lame_error')} />
                <AppTextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconFirst="human-child"
                  keyboardType="email-address"
                  name=" guardianname"
                  placeholder="Parent Name"
                  placeholderTextColor="black"
                  value={guardianName}
                  onChangeText={value => setGuardianName(value)}
                />
                <ErrorMessage
                  visible={guardianNameError}
                  error={t('parentname_error')}
                />

                {/*Phone text inpute*/}
                <AppTextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconFirst="phone"
                  editable={false}
                  maxLength={10}
                  keyboardType="number-pad"
                  name="name"
                  placeholder="Phone Number"
                  placeholderTextColor="black"
                  value={phone}
                  // onChangeText={() => handlePhone()}
                  onChangeText={(itemValue, itemIndex) =>
                    handlePhone(itemValue, itemIndex)
                  }
                />
                <ErrorMessage visible={phoneError} error={t('phone_error')} />
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: 'row',
                    paddingBottom: 15,
                    marginBottom: 17,
                    marginHorizontal: -1,
                    paddingHorizontal: 11,
                    marginLeft: -22,
                    borderRadius: 15,
                    backgroundColor: '#f3f2ff',
                  }}>
                  <TouchableOpacity onPress={showDatepicker}>
                    <View>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={26}
                        color={'#808080'}
                        style={{marginRight: 10}}
                      />
                    </View>

                    <View style={{marginLeft: 10}}>
                      {/* Display the selected date or placeholder */}
                      <Text style={{color: dob ? 'black' : 'gray'}}>
                        {dob ? moment(dob).format('DD/MM/YYYY') : 'DD/MM/YYYY'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showPicker && (
                    <DateTimePicker
                      value={
                        dob ? moment(dob, 'DD-MM-YYYY').toDate() : new Date()
                      }
                      mode="date"
                      display="default"
                      // minimumDate={minDate}
                      // maximumDate={maxDate}
                      onChange={onDateChange}
                    />
                  )}
                  {/* DateTimePicker component - separate from TouchableOpacity */}
                </View>

                <ErrorMessage visible={dobError} error={t('dob_error')} />
                {/*Picker for Qualification */}
                <View style={styles.wrapper}>
                  <Entypo
                    name="graduation-cap"
                    size={22}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                  <Picker
                    dropdownIconColor={Colors.primary}
                    selectedValue={qualification}
                    onValueChange={(itemValue, itemIndex) =>
                      handleQualificationChange(itemValue, itemIndex)
                    }
                    style={styles.picker}
                    name="qualification">
                    <Picker.Item
                      label="Select Qualification*"
                      value="0"
                      enabled={false}
                      style={styles.placeHolder}
                    />
                    {qualificationList.map(item => (
                      <Picker.Item
                        label={item}
                        value={item}
                        //  key={item._id}
                        style={styles.pickerSelectItem}
                      />
                    ))}
                  </Picker>
                </View>
                <ErrorMessage
                  visible={qualificationError}
                  error={t('qualification_error')}
                />
                {/*Picker for gender */}
                <View style={styles.wrapper}>
                  <Gender
                    name="male-female"
                    size={20}
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
                      label="Select Gender*"
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
                      value="Others"
                      style={styles.pickerSelectItem}
                    />
                  </Picker>
                </View>
                <ErrorMessage visible={genderError} error={t('gender_error')} />

                {/*Picker for state */}
                <View style={styles.wrapper}>
                  <Entypo
                    name="location-pin"
                    size={20}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                  <Picker
                    dropdownIconColor={Colors.primary}
                    selectedValue={state}
                    onValueChange={itemValue => setState(itemValue)}
                    style={styles.picker}
                    name="district">
                    <Picker.Item
                      label="Select state*"
                      value="0"
                      enabled={false}
                      style={styles.placeHolder}
                    />

                    <Picker.Item
                      label="Odisha"
                      value="Odisha"
                      key={1}
                      style={styles.pickerSelectItem}
                    />
                  </Picker>
                </View>
                <ErrorMessage visible={stateError} error={t('state_error')} />
                {/*Picker for district */}
                <View style={styles.wrapper}>
                  <Entypo
                    name="location-pin"
                    size={20}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                  <Picker
                    dropdownIconColor={Colors.primary}
                    selectedValue={district}
                    onValueChange={(itemValue, itemIndex) =>
                      handleDistrictChange(itemValue, itemIndex)
                    }
                    style={styles.picker}
                    name="district">
                    <Picker.Item
                      label="Select District*"
                      value="0"
                      enabled={false}
                      style={styles.placeHolder}
                    />
                    {districtlist.map(item => (
                      <Picker.Item
                        label={
                          item.districtname.charAt(0).toUpperCase() +
                          item.districtname.slice(1)
                        }
                        value={
                          item.districtname.charAt(0).toUpperCase() +
                          item.districtname.slice(1)
                        }
                        key={item._id}
                        style={styles.pickerSelectItem}
                      />
                    ))}
                  </Picker>
                </View>
                <ErrorMessage
                  visible={districtError}
                  error={t('district_error')}
                />
                {/*Picker for block */}
                <View style={styles.wrapper}>
                  <Entypo
                    name="location-pin"
                    size={20}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                  <Picker
                    dropdownIconColor={Colors.primary}
                    selectedValue={block}
                    onValueChange={(itemValue, itemIndex) =>
                      handleBlockChange(itemValue, itemIndex)
                    }
                    style={styles.picker}
                    name="district">
                    <Picker.Item
                      label="Select block*"
                      value="0"
                      enabled={false}
                      style={styles.placeHolder}
                    />
                    {blocklist.map(item => (
                      <Picker.Item
                        label={
                          item.blockname.charAt(0).toUpperCase() +
                          item.blockname.slice(1)
                        }
                        value={
                          item.blockname.charAt(0).toUpperCase() +
                          item.blockname.slice(1)
                        }
                        key={item._id}
                        style={styles.pickerSelectItem}
                      />
                    ))}
                  </Picker>
                </View>

                <ErrorMessage visible={blockError} error={t('block_error')} />

                {/* Passcode */}
              </View>
            </View>
            <TouchableOpacity
              onPress={e => handleNext(e)}
              style={{
                margin: 8,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 5,
                paddingBottom: 5,
                height: 45,
                borderRadius: Border.br_xl,
                backgroundColor: Color.royalblue,
                width: 209,
                height: 48,
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 10,
                marginLeft: 40,
                marginTop: 60,
              }}>
              <Text
                style={{
                  width: '100%',

                  justifyContent: 'center',
                  letterSpacing: 1,
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '500',

                  // marginLeft: 50,
                  // fontSize: 14,
                  fontWeight: '500',
                  fontSize: FontSize.size_5xl,
                  color: Color.primaryContrast,

                  marginTop: -5,
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
const qualificationList = [
  'Matriculation',
  'Intermediate',
  'Bachelor of Arts',
  'Bachelor of Commerce',
  'Bachelor of Science',
  'Bachelor of Technology',
  'Master of Arts',
  'Master of Commerce',
  'Master of Science',
  'Master of Computer Application',
  'Master of Social Work',
  'Post Graduation',
];
const styles = StyleSheet.create({
  backgroundImg: {
    height: window.WindowHeigth,
    width: window.WindowWidth,
    zIndex: 1,
  },
  button: {
    backgroundColor: 'red',
  },
  constainer: {
    alignSelf: 'center',

    width: window.WindowWidth * 0.9,
    // height: 5000,
    marginTop: 29,
    //  borderTopLeftRadius: 70,
    marginBottom: 20,

    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowRadius: 9,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'scroll',
  },
  editFormContainer: {
    marginHorizontal: 13,
    marginVertical: 59,
    borderRadius: 8,
    // backgroundColor: Colors.white,

    marginLeft: 39,
    //  borderTopLeftRadius: 70,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 30,

    marginRight: 45,
    marginBottom: 12,
    backgroundColor: '#00C0F0',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
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
    marginTop: -30,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  input: {
    // height: 60,
    width: window.WindowWidth * 0.83,
    borderWidth: 1,
    borderRadius: 12,
    textAlignVertical: 'top', // Aligns text to the top
    paddingLeft: 10,
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
  },

  editImageIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'gray',
    width: 36,
    height: 36,
    borderRadius: 20,
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
    // color: 'black',
    paddingBottom: 3,
    marginBottom: 17,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    // borderWidth: 0.5,
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
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
    color: Colors.greyPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
  },

  pickerSelectItem: {
    color: Colors.greyPrimary,
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
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },

  iconLayout: {
    width: 13,
    height: 13,
    marginTop: -6.12,
  },
  statusBarBgLayout: {
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },

  groupChildPosition: {
    backgroundColor: Color.ghostwhite,
    borderRadius: Border.br_7xs,
    left: '0%',
    top: '0%',
    position: 'absolute',
  },

  userRegisterChild: {
    height: 200,
    width: 130,
    top: '7.15%',
    // top: 50,
    right: '33.33%',
    // bottom: '50.94%',
    left: '33.61%',
    marginTop: -70,
  },
  iconmessagesmessageEdit: {
    top: 143,
    left: 220,
    width: 30,
    height: 30,
    marginTop: -10,
    position: 'absolute',
  },

  userRegister: {
    backgroundColor: Color.primaryContrast,
    flex: 1,
    height: 800,
    overflow: 'visible',
    width: '100%',
  },
  reg: {
    backgroundColor: Color.primaryContrast,
    width: window.WindowWidth * 0.8,
  },
});

export default Register;
