import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import React, {useState, useMemo, useRef, useCallback} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {Color, Border, FontSize, FontFamily} from '../GlobalStyle';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
// import Colors from '../utils/Colors';
import ErrorMessage from '../components/ErrorMessage';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import ButtomSheet from '../components/BottomSheet';
import Feather from 'react-native-vector-icons/Feather';
import * as window from '../utils/dimensions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Api from '../environment/Api';
import {AzureImage} from '../components/Azure';
import {app_versions} from './Home';
import {
  fetchBlockDataThunk,
  updateUserThunk,
} from '../redux_toolkit/features/users/UserThunk';

const EditProfile = ({navigation, route}) => {
  const modalRef = useRef(null);
  const modalHeight = window.WindowHeigth * 0.3;
  const dispatch = useDispatch();
  // const {userdata} = route.params;
  const [userdata, setUserdata] = useState(route.params[0]);
  console.log('edituserdata----->', userdata);
  const districtlist = useSelector(state => state.UserSlice.district);
  console.log('districtlist-------->', districtlist);
  const blocklist = useSelector(state => state.UserSlice.block);
  console.log('blocklist-------->', blocklist);

  const {t} = useTranslation();
  //
  const [name, setName] = useState(userdata[0].firstname);
  const [mname, setMname] = useState(userdata[0].middlename);

  const [lname, setLname] = useState(userdata[0].lastname);
  // console.log(
  //   'userdata name-------------------->',
  //   userdata[0].firstname,
  //   userdata[0].middlename,
  //   userdata[0].lastname,
  // );
  // console.log('name-------------------->', name, mname, lname);
  const [guardianname, setGuardianName] = useState(userdata[0].guardianname);
  // const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(userdata[0].contactnumber);
  const [qualification, setQualification] = useState(userdata[0].qualification);
  const [gender, setGender] = useState(userdata[0].gender);
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  const [imageUrl, setImageUrl] = useState('');
  console.log(imageUrl, 'imageUrl=============');
  const [imageData, setImageData] = useState('');
  console.log('imageData========>', imageData);
  const profileDob = moment(userdata[0].dob).format('DD/MM/YYYY');

  const [dob, setDob] = useState(userdata[0].dob);
  // console.log('update dob--->', dob, moment(dob).format('DD/MM/YYYY'));
  const dobSet = moment(dob).format('DD/MM/YYYY');
  // console.log('dobSet---->', dobSet);
  const [aadhaar, setAadhaar] = useState(userdata[0].aadhaar);
  const [state, setState] = useState(userdata[0].statename);
  const [stateId, setStateId] = useState('');
  const [district, setDistrict] = useState(userdata[0].districtname);
  const [block, setBlock] = useState(userdata[0].blockname);
  const [districtId, setDistrictId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [nameError, setNameError] = useState(false);
  const [guardianNameError, setGuardianNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [qualificationError, setQualificationError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);
  const [lnameError, setLnameError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [blockError, setBlockError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [aadhaarError, setAadhaarError] = useState(false);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageNotFound, setImageNotFound] = useState(false);
  //State to handle error in image error
  const [error, setError] = useState(false);

  //Function to set district
  const [districtChanged, setDistrictChanged] = useState(false);
  const handleDistrictChange = (itemValue, itemIndex) => {
    console.log('itemValue itemIndex===', itemValue, itemIndex);
    setBlock('');
    setDistrict(itemValue);
    setDistrictId(districtlist[itemIndex - 1]?._id);
    dispatch(fetchBlockDataThunk(districtlist[itemIndex - 1]?._id));
  };

  //Function to set block
  const handleBlockChange = (itemValue, itemIndex) => {
    setBlock(itemValue);
    //   setBlockId(blocklist[itemIndex - 1]?._id);
  };

  const handleQualificationChange = (itemValue, itemIndex) => {
    //
    setQualification(itemValue);
  };

  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const handleSelection = async flag => {
    modalRef.current?.close();
    setLoading(true);

    const generateNewFilename = filename => {
      const firstFourLetters = filename.slice(0, 4);
      const currentDate = new Date()
        .toISOString()
        .replace(/[:.-]/g, '')
        .slice(0, 7);
      const camelCaseFilename = `${'profilePic'}${firstFourLetters}${currentDate}`;
      return camelCaseFilename;
    };

    if (flag === 'camera') {
      if (Platform.OS === 'ios') {
        setLoading(false);
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
              console.log('filename--->', filename);
              setImageData(filename);
              console.log('image---->', fileUri, uploadResult);
            } catch (error) {
              if (error.response.status === 413) {
                Alert.alert('File is too large');
                setLoading(false);
              } else if (error.response.status === 504) {
                Alert.alert('Gateway timeout by server.');
                console.log('Error is--------------------->', error);
                setLoading(false);
              } else if (error.response.status === 500) {
                Alert.alert('Internal server error');
                console.error('Error is------------------->:', error);
                setLoading(false);
              } else {
                Alert.alert('Something went wrong. Please try again later.');
                console.error('Error is------------------->:', error);
                setLoading(false);
              }
            } finally {
              setLoading(false);
            }
          } else {
            Alert.alert('Error', 'Camera Permission Not Granted');
            setLoading(false);
          }
        } catch (error) {
          if (error.response.status === 413) {
            Alert.alert('File is too large');
            setLoading(false);
          } else if (error.response.status === 504) {
            Alert.alert('Gateway timeout by server.');
            console.log('Error is--------------------->', error);
            setLoading(false);
          } else if (error.response.status === 500) {
            Alert.alert('Internal server error');
            console.error('Error is------------------->:', error);
            setLoading(false);
          } else {
            Alert.alert('Something went wrong. Please try again later.');
            console.error('Error is------------------->:', error);
            setLoading(false);
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
        const fileUri = image?.path;
        const uploadResult = await AzureImage(fileUri);
        setImageUrl(uploadResult?.url);

        const pathSegments = uploadResult?.url.split('/');
        const filename = pathSegments[pathSegments.length - 1];
        console.log('filename--->', filename);
        setImageData(filename);
        // console.log('response====>', response.data);

        console
          .log
          // 'image---->',
          // fileUri,
          // uploadResult,
          // camelCaseFilename,
          ();
        // const pathSegments = image.path.split('/');
        // const filename = pathSegments[pathSegments.length - 1];
        // const camelCaseFilename = generateNewFilename(filename);

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
        //   name: camelCaseFilename,
        // });

        // const response = await Api.post(
        //   `uploadFile/${camelCaseFilename}`,
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   },
        // );
        // setImageUrl(response?.data?.url);
        // setImageData(camelCaseFilename);
      } catch (error) {
        if (error.response.status === 413) {
          Alert.alert('File is too large');
          setLoading(false);
        } else if (error.response.status === 504) {
          Alert.alert('Gateway timeout by server.');
          console.log('Error is--------------------->', error);
          setLoading(false);
        } else if (error.response.status === 500) {
          Alert.alert('Internal server error');
          console.error('Error is------------------->:', error);
          setLoading(false);
        } else {
          Alert.alert('Something went wrong. Please try again later.');
          console.error('Error is------------------->:', error);
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
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
            // onPress: () => Alert.alert('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'OK',
            // onPress: () => submitFun(),
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      // const name_pattern = /^[a-z ]+$/;
      const phoneRegExp = /^[6-9]\d{9}$/;
      // const regex = /^[^\s]+/;

      if (
        name === undefined ||
        name === null ||
        name.trim().split(/\s+/)[0] === ''
      ) {
        setNameError(true);
      } else if (lname === undefined || lname === null || lname.trim() === '') {
        setNameError(false);
        setLnameError(true);
      } else if (
        guardianname === undefined ||
        guardianname === null ||
        guardianname === ''
      ) {
        setNameError(false);
        setGuardianNameError(true);
      } else if (!phoneRegExp.test('' + phone)) {
        setNameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(true);
      } else if (dob === undefined || dob === null || dob === '') {
        setNameError(false);
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
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(true);
      } else if (gender === undefined || gender === null || gender === '') {
        setNameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(true);
      } else if (state === undefined || state === null || state === '') {
        setNameError(false);
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
      } else if (aadhaar?.length > 0 && aadhaar?.length != 12) {
        setNameError(false);
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

        const userId = userdata[0]._id;
        if (!userId || typeof userId !== 'string') {
          console.error('Invalid user ID');
          return;
        }

        const userDetails = {
          username: `${name} ${mname} ${lname}`,
          firstname: name.trim().split(/\s+/)[0],
          middlename: mname.trim().split(/\s+/)[0],
          lastname: lname.trim().split(/\s+/)[0],
          userid: userdata[0].userid,
          usertype: userdata[0].usertype,
          guardianname: guardianname,
          image: imageData ? imageData : userdata[0].image,
          contactnumber: phone,
          gender: gender[0].toUpperCase() + gender.slice(1),
          dob: new Date(dob),
          qualification: qualification,
          statename: state[0].toUpperCase() + state.slice(1),
          districtname: district[0].toUpperCase() + district.slice(1),
          districtid: districtId,
          stateid: 20,
          blockid: blockId,
          blockname: block[0].toUpperCase() + block.slice(1),
          aadhaar: aadhaar,
          aadhaarUpdated: false,
          passcode: userdata[0].passcode,
          _id: userdata[0]?._id,
          appVersion: app_versions,
          // loginType: userdata[0].loginType ? userdata[0].loginType : null,
        };

        //
        const data = {
          user: userDetails,
          image: imageData || userdata[0]?.image,
          userid: userdata[0]?._id,
        };
        console.log('userData post body ---->', data);
        // // console.log('userDetailsupdate---->', userDetails.firstname);
        // console.log('imageData========>', imageData);
        // console.log('userDetailsupdate2---->', userDetails);
        try {
          const updateResponse = await dispatch(updateUserThunk(data));
          console.log('updateResponse:', updateResponse);

          showMessage({
            message: 'Successfully Updated profile.',
            type: 'success',
            backgroundColor: Color.success,
          });

          setTimeout(() => {
            navigation.goBack();
            setIsLoading(false);
          }, 2000);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    }
  };

  console.log('userdata---------------------->', userdata[0]);

  //
  return (
    <>
      <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => {
              handleSelection('camera');
            }}
            style={styles.modalButtonContainer}>
            <Feather name="camera" size={30} color={Color.primary} />
            <Text style={styles.modalButtonText}>Take Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleSelection('gallery');
            }}
            style={styles.modalButtonContainer}>
            <Feather name="file" size={30} color={Color.info} />
            <Text style={styles.modalButtonText}>choose_gallery</Text>
          </TouchableOpacity>
        </View>
      </ButtomSheet>
      <Modal visible={loading} transparent={true}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      <ScrollView>
        <View style={styles.container}>
          {imageUrl && imageUrl.length > 0
            ? (console.log('check1---->', userdata[0]?.image),
              (
                <View>
                  <Image
                    style={styles.image}
                    source={
                      imageNotFound
                        ? require('../assets/Photos/userss.png')
                        : {
                            uri: imageUrl,
                          }
                    }
                    accessibilityLabel="User Profile Image"
                    resizeMode="cover"
                    onError={error => {
                      console.log(
                        error.nativeEvent,
                        error.nativeEvent.code,
                        'Image failed to load. Displaying fallback image.er<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
                      );

                      setImageNotFound(true);
                    }}
                  />
                </View>
              ))
            : userdata[0]?.image.length > 0
            ? (console.log('check2---->', userdata[0]?.image),
              (
                <View>
                  <Image
                    style={styles.image}
                    source={
                      imageNotFound
                        ? require('../assets/Photos/userss.png')
                        : {
                            uri: userdata[0]?.image,
                          }
                    }
                    accessibilityLabel="User Profile Image"
                    resizeMode="cover"
                    onError={error => {
                      console.log(
                        error.nativeEvent,
                        error.nativeEvent.code,
                        'Image failed to load. Displaying fallback image.er<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
                      );

                      setImageNotFound(true);
                    }}
                  />
                </View>
              ))
            : (console.log('check2---->', userdata[0]?.image),
              (
                <View>
                  <Image
                    style={styles.image}
                    source={require('../assets/Photos/userss.png')}
                  />
                </View>
              ))}
          {/* {userdata[0]?.image === '' || !userdata[0]?.image
            ? (console.log('check1---->', userdata[0]?.image),
              (
                <View>
                  <Image
                    style={styles.image}
                    source={require('../assets/Photos/userss.png')}
                  />
                </View>
              ))
            : (console.log('check2---->', userdata[0]?.image),
              (
                <View>
                  <Image
                    style={styles.image}
                    source={
                      imageNotFound
                        ? require('../assets/Photos/userss.png')
                        : {
                            uri:
                              userdata[0]?.image.length > 66
                                ? userdata[0].image
                                : imageUrl,
                          }
                    }
                    accessibilityLabel="User Profile Image"
                    resizeMode="cover"
                    onError={error => {
                      console.log(
                        error.nativeEvent,
                        error.nativeEvent.code,
                        'Image failed to load. Displaying fallback image.er<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
                      );

                      setImageNotFound(true);
                    }}
                  />
                </View>
              ))} */}

          <TouchableOpacity
            style={styles.cameraicon}
            onPress={() => handleOpenBottomSheet()}>
            <FontAwesome5Icon
              name="camera-retro"
              size={35}
              color={Color.primary}
            />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: 'white',
              marginTop: 12,
              marginBottom: 19,
              borderRadius: 12,
            }}>
            <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
              {/*Name text inpute */}
              <Text style={styles.placeholder}>First Name</Text>
              <TextInput
                allowFontScaling={false}
                style={styles.input}
                autoComplete="off"
                name="name"
                placeholder="Name"
                value={name}
                onChangeText={value => setName(value)}
              />
              <ErrorMessage visible={nameError} error={t('name_error')} />

              <Text style={styles.placeholder}>Middle Name</Text>
              <TextInput
                allowFontScaling={false}
                style={styles.input}
                autoComplete="off"
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

              {/* <ErrorMessage visible={nameError} error={t('name_error')} /> */}
              <Text style={styles.placeholder}>Last Name</Text>
              <TextInput
                allowFontScaling={false}
                style={styles.input}
                autoComplete="off"
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

              {/* Guardian Name */}
              <Text style={styles.placeholder}>Parent Name</Text>
              <TextInput
                allowFontScaling={false}
                style={styles.input}
                name="guardianname"
                placeholder="Guardian Name"
                autoCapitalize="none"
                value={guardianname}
                onChangeText={value => setGuardianName(value)}
              />
              <ErrorMessage
                visible={guardianNameError}
                error={t('parentname_error')}
              />

              {/*Phone text inpute*/}
              <Text style={styles.placeholder}>Phone Number</Text>

              <TextInput
                allowFontScaling={false}
                style={styles.input}
                keyboardType="numeric"
                name="name"
                maxLength={10}
                placeholder="Phone"
                editable={false}
                value={phone}
                onChangeText={value => setPhone(value)}
              />
              <ErrorMessage visible={phoneError} error={t('phone_error')} />
            </View>

            {/*Picker for Qualification */}
            <View style={[styles.wrapper, {marginTop: 10}]}>
              {/* <Entypo
              name="location-pin"
              size={20}
              color={Color.primary}
              style={styles.icon}
            /> */}
              <Text
                style={[
                  styles.placeholder,
                  {marginTop: -30, marginLeft: -10, paddingBottom: 7},
                ]}>
                Select Qualification
              </Text>

              <Picker
                selectedValue={qualification}
                onValueChange={(itemValue, itemIndex) =>
                  handleQualificationChange(itemValue, itemIndex)
                }
                style={{marginTop: -10}}
                name="qualification">
                <Picker.Item
                  label={userdata[0].qualification}
                  value="0"
                  enabled={false}
                  // style={styles.selectedItemStyle}
                />
                {qualificationList.map(item => (
                  <Picker.Item
                    label={item}
                    value={item}
                    // key={item._id}
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
            <View style={[styles.wrapper, {marginTop: 10}]}>
              <Text
                style={[
                  styles.placeholder,
                  {marginTop: -30, marginLeft: -10, paddingBottom: 15},
                ]}>
                Gender
              </Text>

              <Picker
                selectedValue={gender}
                onValueChange={itemValue => setGender(itemValue)}
                style={{marginTop: -10, marginLeft: 0, color: 'black'}}
                name="gender">
                <Picker.Item
                  label={capitalize(userdata[0].gender)}
                  value={'0'}
                  enabled={false}
                  // style={{fontSize: 17}}
                  // style={styles.selectedItemStyle}
                />
                {userdata[0].gender !== 'male' && (
                  <Picker.Item
                    label="Male"
                    value="male"
                    style={styles.pickerSelectItem}
                  />
                )}
                {userdata[0].gender !== 'female' && (
                  <Picker.Item
                    label="Female"
                    value="female"
                    style={styles.pickerSelectItem}
                  />
                )}
                {userdata[0].gender !== 'others' && (
                  <Picker.Item
                    label="Others"
                    value="others"
                    style={styles.pickerSelectItem}
                  />
                )}
              </Picker>
              <ErrorMessage visible={genderError} error={t('gender_error')} />
            </View>

            {/* User Dob */}
            <View style={[styles.wrapper, {marginTop: 10}]}>
              {/* <MaterialIcons
              name="date-range"
              size={20}
              color={Color.primary}
              style={styles.icon}
            /> */}

              <View>
                <Text
                  style={[
                    styles.placeholder,
                    {marginTop: -30, marginLeft: -10, paddingBottom: 7},
                  ]}>
                  Date Of Birth
                </Text>
                {userdata[0].usertype === 'fellow' && (
                  <DatePicker
                    style={{
                      width: 363,
                      marginLeft: -130,
                      color: 'black',
                    }}
                    date={dob}
                    mode="date"
                    placeholder={dobSet}
                    placeholderTextColor={'black'}
                    format="YYYY-MM-DD"
                    minDate="1960-01-01"
                    maxDate="2005-01-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        display: 'none',
                      },
                      placeHolder: {
                        placeholderTextColor: 'black',
                      },
                      dateInput: {
                        borderWidth: -1,
                        color: 'black',
                        height: 50,
                        borderRadius: 12,
                      },
                      placeholderText: {
                        color: 'red', // Change the color here
                      },
                    }}
                    onDateChange={date => {
                      console.log('--> Date: ', date);
                      let str1 =
                        new Date(date).getFullYear() +
                        '-' +
                        (new Date(date).getMonth() + 1) +
                        '-' +
                        new Date(date).getDate();
                      console.log('--> Str: ', str1);
                      setDob(date);
                    }}
                  />
                )}

                {userdata[0].usertype === 'school' && (
                  <DatePicker
                    style={{
                      width: 363,
                      marginLeft: -50,
                      color: 'black',
                    }}
                    date={dob}
                    mode="date"
                    placeholder={dobSet}
                    placeholderTextColor={'black'}
                    format="YYYY-MM-DD"
                    minDate="1964-01-01"
                    maxDate="2005-01-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        display: 'none',
                      },
                      placeHolder: {
                        placeholderTextColor: 'black',
                      },
                      dateInput: {
                        borderWidth: -1,
                        color: 'black',
                        height: 50,
                        borderRadius: 12,
                      },
                      placeholderText: {
                        color: 'red', // Change the color here
                      },
                    }}
                    onDateChange={date => {
                      console.log('--> Date: ', date);
                      let str1 =
                        new Date(date).getFullYear() +
                        '-' +
                        (new Date(date).getMonth() + 1) +
                        '-' +
                        new Date(date).getDate();
                      console.log('--> Str: ', str1);
                      setDob(date);
                    }}
                  />
                )}

                {userdata[0].usertype === 'anganwadi' && (
                  <DatePicker
                    style={{
                      width: 363,
                      marginLeft: -50,
                      color: 'black',
                    }}
                    date={dob}
                    mode="date"
                    placeholder={dobSet}
                    placeholderTextColor={'black'}
                    format="YYYY-MM-DD"
                    minDate="1964-01-01"
                    maxDate="2005-01-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        display: 'none',
                      },
                      placeHolder: {
                        placeholderTextColor: 'black',
                      },
                      dateInput: {
                        borderWidth: -1,
                        color: 'black',
                        height: 50,
                        borderRadius: 12,
                      },
                      placeholderText: {
                        color: 'red', // Change the color here
                      },
                    }}
                    onDateChange={date => {
                      console.log('--> Date: ', date);
                      let str1 =
                        new Date(date).getFullYear() +
                        '-' +
                        (new Date(date).getMonth() + 1) +
                        '-' +
                        new Date(date).getDate();
                      console.log('--> Str: ', str1);
                      setDob(date);
                    }}
                  />
                )}
              </View>
              <ErrorMessage visible={dobError} error={t('dob_error')} />
            </View>

            {/*Picker for state */}
            <View style={[styles.wrapper, {marginTop: 10}]}>
              {/* <Entypo
              name="location-pin"
              size={20}
              color={Color.primary}
              style={styles.icon}
            /> */}
              <Text
                style={[
                  styles.placeholder,
                  {marginTop: -30, marginLeft: -10, paddingBottom: 7},
                ]}>
                Select state
              </Text>

              <Picker
                selectedValue={state}
                onValueChange={itemValue => setState(itemValue)}
                style={{marginTop: -10, color: 'black'}}
                name="district">
                <Picker.Item
                  label={
                    userdata[0].statename.charAt(0).toUpperCase() +
                    userdata[0].statename.slice(1)
                  }
                  value="0"
                  enabled={false}
                  // style={styles.selectedItemStyle}
                />

                <Picker.Item
                  label="Odisha"
                  value="Odisha"
                  key={1}
                  style={styles.pickerSelectItem}
                />
              </Picker>
              <ErrorMessage visible={stateError} error={t('state_error')} />
            </View>

            {/*Picker for district */}
            <View style={[styles.wrapper, {marginTop: 10}]}>
              {/* <Entypo
              name="location-pin"
              size={20}
              color={Color.primary}
              style={styles.icon}
            /> */}
              <Text
                style={[
                  styles.placeholder,
                  {marginTop: -30, marginLeft: -10, paddingBottom: 7},
                ]}>
                Select District
              </Text>

              <Picker
                selectedValue={district}
                onValueChange={(itemValue, itemIndex) =>
                  handleDistrictChange(itemValue, itemIndex)
                }
                style={{marginTop: -10, color: 'black'}}
                name="district">
                <Picker.Item
                  label={
                    userdata[0].districtname.charAt(0).toUpperCase() +
                    userdata[0].districtname.slice(1)
                  }
                  value="0"
                  enabled={false}
                  // style={styles.selectedItemStyle}
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
            <ErrorMessage visible={districtError} error={t('district_error')} />
            {/* Picker for testing */}

            {/*Picker for block */}
            <View style={[styles.wrapper, {marginTop: 10}]}>
              {/* <Entypo
              name="location-pin"
              size={20}
              color={Color.primary}
              style={styles.icon}
            /> */}
              <Text
                style={[
                  styles.placeholder,
                  {marginTop: -30, marginLeft: -10, paddingBottom: 7},
                ]}>
                Select Block
              </Text>

              <Picker
                selectedValue={block}
                onValueChange={(itemValue, itemIndex) =>
                  handleBlockChange(itemValue, itemIndex)
                }
                style={{marginTop: -10, color: 'black'}}
                name="district">
                {district !== userdata[0].districtname ? null : (
                  <Picker.Item
                    label={
                      userdata[0].blockname.charAt(0).toUpperCase() +
                      userdata[0].blockname.slice(1)
                    }
                    value="0"
                    enabled={false}
                    // style={styles.selectedItemStyle}
                  />
                )}

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
            <Text style={styles.placeholder}>Aadhar Number</Text>
            <View style={styles.inputs}>
              <TextInput
                allowFontScaling={false}
                style={styles.input}
                name="aadhaar"
                maxLength={12}
                placeholder="Enter Aadhar Number"
                keyboardType="number-pad"
                value={aadhaar}
                onChangeText={value => {
                  const newValue = value.replace(/[,\.]/g, '');
                  setAadhaar(newValue);
                }}
              />
            </View>
            <ErrorMessage visible={aadhaarError} error={t('aadhar_error')} />
          </View>
          {/* <Button title="SAVE" onPress={handleSubmit} /> */}
          <TouchableOpacity
            disabled={isLoading}
            onPress={handleSubmit}
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
              // position: 'absolute',
              // width: window.WindowWidth * 0.75,
              // justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              // justifyContent: 'space-between',
              marginRight: 10,
              marginLeft: 80,
              marginTop: 30,
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
              Update
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button1} onPress={handleSubmit}>
            <Text style={styles.text}>SAVE</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfile;

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
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 70,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },

  cameraicon: {
    paddingLeft: 252,
    marginTop: -33,
    paddingLeft: 219,
    // backgroundColor:Color.white,
    // height: 150,
    // marginTop:-100,
    // paddingLeft:12
  },
  modalContainer: {
    height: window.WindowHeigth * 0.3,
    backgroundColor: Color.white,
    elevation: 5,
    // width: '100%',
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
    color: Color.black,
  },
  name: {
    backgroundColor: 'white',
    marginTop: -10,
    marginBottom: 14,
    paddingLeft: 70,
    fontSize: 22,
    fontWeight: 'bold',
    borderRadius: 12,
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 90,
    marginBottom: 12,
    backgroundColor: Color.primary,
  },
  input: {
    backgroundColor: Color.ghostwhite,
    color: 'black',
    height: 40,
    margin: 12,
    // borderWidth: 1,
    paddingLeft: 25,
    fontSize: 18,
    marginBottom: 30,
    height: 52,
    // borderBottomWidth: 1,
    borderRadius: 12,
  },
  inputs: {
    paddingLeft: 10,
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    textAlign: 'center',
    // paddingLeft: 8,
  },
  wrapper: {
    // borderWidth: 1,
    height: 52,
    marginTop: -13,
    marginLeft: 22,
    marginRight: 20,
    marginBottom: 45,
    borderRadius: 12,
    paddingLeft: 15,
    backgroundColor: Color.ghostwhite,

    // borderBottomWidth: 1,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '200',
    color: 'black',
    marginLeft: 27,
    fontFamily: FontFamily.poppinsMedium,
  },
  pickerSelectItem: {
    color: 'black',
  },
  selectedItemStyle: {
    // backgroundColor: Color.royalblue,
    color: Color.royalblue,
    // color: Color.ghostwhite,
  },
});
