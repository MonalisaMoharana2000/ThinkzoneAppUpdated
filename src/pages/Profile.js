import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  StatusBar,
  Linking,
  Pressable,
  Clipboard,
  BackHandler,
  Dimensions,
} from 'react-native';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import API from '../environment/Api';
import React, {useRef, useCallback, useState, useEffect} from 'react';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import Api from '../environment/Api';
import Loading from '../components/Loading';
import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
import {clearUser} from '../redux_toolkit/features/users/UserSlice';
const {width} = Dimensions.get('window');

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const userdatas = useSelector(state => state.UserSlice.user);
  console.log('============================userdatas', userdatas);
  const [userdata, setUserdata] = useState(userdatas);
  console.log('profileUser', userdata);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsloadings] = useState(true);
  const [maintainanceStatus, setMaintainanceStatus] = useState({});
  console.log('userdata-------->', userdata);
  const [imageNotFound, setImageNotFound] = useState(false);
  // console.log('imageNotFound----->', imageNotFound);
  // const [userdata, setUserData] = useState(userdatas);
  // console.log('userdata profile----->', userdata);
  const modalRef = useRef(null);
  const modalHeight = window.WindowHeigth * 0.3;
  const profileDob = moment(userdata[0]?.dob).format('DD/MM/YYYY');
  // console.log('profileDob--->', profileDob);
  const regDate = moment(userdata[0]?.createdon).format('DD/MM/YYYY');
  // console.log('regDate--->', regDate);

  //Function to handle language chnage
  const handleLanguageChange = useCallback(() => {
    //
    modalRef.current?.open();
  }, []);
  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const buttonClickedHandler = () => {
    //
    // do something
  };
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setIsLoading(true);
      setIsloadings(true);
      setImageNotFound(true);
      Api.get(`getuserbyuserid/${userdatas[0].userid}`)
        .then(response => {
          //console.log(response.data, 'profileresponse------>');
          setUserdata(response.data);
          setIsLoading(false);
          setIsloadings(false);
          setImageNotFound(false);
        })
        .catch(error => {
          // Handle error if needed
          console.log('error----->', error);
        })
        .finally(() => {
          setIsLoading(false); // Hide the loader
          setIsloadings(false);
          // setImageNotFound(false);
        });
      // const email = userdatas[0].userid;
      // dispatch(types.loadUserStart(email));
    }, []),
  );

  const displayAlert = () => {
    navigation.navigate('editprofile', [userdata]);
  };
  const app_versions = '2.1.1';
  const logout2 = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      GoogleSignin.signOut()
        .then(res => {})
        .catch(err => {});

      const logout = await Api.patch(
        `updateLogoutSession/${userdatas[0].userid}/tz/${app_versions}`,
      );

      // await Logout(userdatas, app_versions);
      console.log('response--->', logout);
      if (logout?.status === 200) {
        dispatch(clearUser());
        navigation.navigate('Login');
      }
      // dispatch(types.logOutUser());
      // navigation.navigate('login');
      // navigation.navigate('login');
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

  const logOut = async () => {
    Alert.alert(
      'Confirmation !!',
      'Do you want to logout ? ',

      [
        {
          text: 'Cancel',
          // onPress: () => Alert.alert('Cancel Pressed'),
          style: 'destructive',
        },
        {
          text: 'Ok',
          onPress: () => logout2(),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const [timespent_record, setTimeSpent_record] = useState({});
  const convertMinutesToSeconds = minutes => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {mins, secs};
  };

  const {mins, secs} = convertMinutesToSeconds(
    timespent_record ? timespent_record.timeSpent : null,
  );

  useFocusEffect(
    React.useCallback(() => {
      const check = async () => {
        try {
          // const response = await Api.get(
          //   `getUserProgress/${userdata[0]?.userid}`,
          // );
          const response = await Api.get(
            `getCurrentMonthTimeSpent/${userdata[0]?.userid}`,
          );
          console.log(
            'responsetime---->',
            response.data,
            Object.keys(response.data).length,
            response.status,
          );
          if (response.status === 200) {
            setTimeSpent_record(response.data);
          } else {
            setTimeSpent_record({});
          }
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
        }
      };

      check();

      // API.get(`getUserProgress/${userdata[0]?.userid}`).then(
      //   response => {
      //     setTimeSpent_record(response.data[0].timeSpentData);
      //     console.log('responsetime---->', response.data);
      //   },
      //   err => {},
      // );
    }, []),
  );

  // useEffect(() => {
  //   API.get(`getUserProgress/${userdata[0]?.userid}`).then(
  //     response => {
  //       setTimeSpent_record(response.data[0].timeSpentData);
  //       console.log('responsetime---->', response.data);
  //     },
  //     err => {},
  //   );
  // }, []);
  const timeHeader = timespent_record[timespent_record.length - 1];
  // console.log('timeHeader--->', timeHeader);

  // const handleOut = () => {
  //   Alert.alert(
  //     'ଙ୍କ ବିବରଣୀ କାଟିବାକୁ ଚାହୁଁଛନ୍ତି ???',

  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'default',
  //       },
  //       {
  //         text: 'Ok',
  //         //   onPress: () => Alert.alert("Cancel Pressed"),
  //         onPress: () => {logOut()}

  //         style: 'cancel',
  //       },
  //     ],
  //     {
  //       cancelable: true,
  //       // onDismiss: () =>
  //       // Alert.alert(
  //       //   'This alert was dismissed by tapping outside of the alert dialog.',
  //       // ),
  //     },
  //   );
  // };
  // const scrollX = useRef(new Animated.Value(0)).current;
  const [milstone, setMilstone] = useState([]);
  const [modal, setModal] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  useEffect(() => {
    API.get(`getCreditedCoinsTransData/${userdatas[0].userid}`).then(
      // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
      response => {
        //
        setMilstone(response.data);
        // console.log(
        //   '====================================response.data',
        //   response.data,
        // );

        // setTimeSpent_record(response.data[0].timeSpentData);
        // setIsloading(false);
      },
      err => {},
    );
  }, []);

  useEffect(() => {
    API.get(`getMaintainanceStatus/fellow`).then(
      response => {
        setMaintainanceStatus(response.data);
        // setmaintainanceModal(false);
      },
      err => {
        //
      },
    );
  }, []);
  const openModal = index => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIndex(null);
  };
  const openTooltip = index => {
    setTooltipContent(index);
    setTooltipVisible(true);
  };

  const openModel = () => {
    setVersionModal(true);
  };

  const closeTooltip = () => {
    setTooltipVisible(false);
  };
  const openMessage = index => {
    setSelectedIndex(index);
  };

  // console.log('coin----------->', coin);

  // console.log('coin----------->', coin);
  const copyToClipboard = () => {
    Clipboard.setString(userdata[0]?.userid);
    alert('User ID copied to clipboard!');
  };

  return (
    <>
      <ScrollView style={{marginTop: -3, backgroundColor: Color.ghostwhite}}>
        {/* <Header /> */}

        {isLoading ? (
          <Loading />
        ) : maintainanceStatus?.tchProfile === true ? (
          <ModuleUnderDevlopment />
        ) : (
          <View>
            <View style={styles.studentRegister}>
              <View
                style={[styles.studentRegisterChild, styles.rectangleViewBg]}
              />

              {/* {user[0].image === '' || !user[0].image ? (
      <View>
        <Image
          style={styles.studentRegisterItem}
          resizeMode="cover"
          source={require('../assets/Image/group-35.png')}
        />
      </View>
    ) : (
      <View>
        <Image style={styles.image} source={{uri: user[0].image}} />
      </View>
    )} */}
              {userdata[0]?.image === '' || !userdata[0]?.image ? (
                <View style={{flexDirection: 'row'}}>
                  {/* <Pressable onPress={displayAlert}> */}
                  <Image
                    style={styles.image}
                    source={require('../assets/Photos/userss.png')}
                  />
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Pressable onPress={displayAlert}>
                    {isLoadings ? (
                      <ActivityIndicator
                        size="large"
                        color={'white'}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        style={styles.image}
                        source={
                          imageNotFound
                            ? require('../assets/Photos/userss.png')
                            : {
                                uri: userdata[0].image,
                              }
                        }
                        onLoad={() =>
                          Image.resolveAssetSource({uri: userdata[0].image}).uri
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
                    )}
                  </Pressable>
                  {/* <TouchableOpacity
              style={{marginTop: 77, right: '25%'}}
              onPress={displayAlert}>
              <Image
                resizeMode="cover"
                source={require('../assets/Image/message-edit.png')}
              />
            </TouchableOpacity> */}
                </View>
              )}

              <Text style={styles.helloRam}>
                Hello, {userdata[0]?.firstname}
                {''}{' '}
              </Text>

              <Text style={styles.completeYourNext}>
                This month you have {''}spent{' '}
                {timespent_record?.timeSpent === 0
                  ? timespent_record?.timeSpent + ' mins '
                  : timespent_record?.timeSpent && mins === 0
                  ? `${secs} secs `
                  : timespent_record?.timeSpent && mins !== 0
                  ? `${mins} mins ${secs} secs `
                  : '0 mins '}
                in App.
              </Text>

              <TouchableOpacity
                style={styles.iconnotificationnotification}
                onPress={() => {
                  Linking.openURL(
                    'https://api.whatsapp.com/send?phone=919178198947',
                  );
                }}>
                <Image
                  style={{width: '90%', height: '80%'}}
                  resizeMode="cover"
                  source={require('../assets/Image/whatsapp.png')}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: FontFamily.poppinsSemibold,
                  // width: 148,
                  // height: 19,
                  textAlign: 'right',
                  // textTransform: 'capitalize',
                  left: '-10%',
                  // marginLeft: -140,
                  color: 'white',
                  marginTop: -30,
                }}>
                Help
              </Text>
              {/* </Pressable> */}
              {/* </TouchableOpacity> */}
              {/* <View style={[styles.studentRegisterInner, styles.groupChild2Bg]} /> */}

              {/* <Image
        style={[styles.iconessentialtrushSquare, {}]}
        resizeMode="cover"
        source={require('../assets/Image/Rectangle 17631.png')}
      /> */}
            </View>
            <View style={{marginTop: -670}}>{/* <Achivement /> */}</View>
            <View
              style={{
                marginTop: 20,
                width: window.WindowWidth * 0.97,
                // marginLeft: 15,align
                alignSelf: 'center',
                backgroundColor: 'white',
                paddingBottom: 25,
                borderRadius: 12,
              }}>
              <View style={{flexDirection: 'row', paddingBottom: 20}}>
                <Text
                  style={[
                    styles.myDetails,
                    styles.iconusersuserPosition,
                    styles.detailsLayout,
                    styles.signOutTypo,
                  ]}>
                  My Details
                </Text>
                <TouchableOpacity onPress={displayAlert}>
                  <Text
                    style={{
                      marginLeft: 315,
                      color: Color.royalblue,
                      top: 12,
                      fontFamily: FontFamily.poppinsMedium,
                      fontWeight: '700',
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 47,
                  borderBottomColor: Color.greyGrey300,
                  // paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/user-tag.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  User Name :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    width: 250,
                    marginTop: 2,
                    // textTransform: 'capitalize',
                  }}>
                  {userdata[0]?.username}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  // height: 47,
                  borderBottomColor: Color.greyGrey300,
                  // paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/user-tag.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 5,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  User ID :{' '}
                </Text>
                <TouchableOpacity
                  onPress={copyToClipboard}
                  style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '500',
                      fontFamily: FontFamily.poppinsMedium,
                      width: 250,
                      marginTop: 2,
                    }}>
                    {userdata[0]?.userid}{' '}
                  </Text>
                  <Feather
                    name="copy"
                    size={20}
                    color={Color.royalblue}
                    style={{
                      // alignSelf: 'flex-end',
                      position: 'absolute',
                      right: 0,
                      // paddingRight: '2%',
                      // top: '-10%',
                      // left: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  // height: 47,
                  borderBottomColor: Color.greyGrey300,
                  // paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/user-tag.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Email ID :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    width: 250,
                    marginTop: 2,
                  }}>
                  {userdata[0]?.emailid}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/user-search.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Contact Number :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    textTransform: 'capitalize',
                    marginTop: 2,
                  }}>
                  {userdata[0]?.contactnumber}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/people.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Parent Name :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    width: 250,
                    marginTop: 2,
                  }}>
                  {userdata[0]?.guardianname ? userdata[0]?.guardianname : 'Na'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/user-search.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  User Type :{' '}
                </Text>
                {userdata[0]?.usertype === 'fellow' ? (
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '500',
                      fontFamily: FontFamily.poppinsMedium,
                      textTransform: 'capitalize',
                      marginTop: 2,
                    }}>
                    Educators
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '500',
                      fontFamily: FontFamily.poppinsMedium,
                      textTransform: 'capitalize',
                      marginTop: 2,
                    }}>
                    {userdata[0]?.usertype}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/cake.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  DOB :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    marginTop: 2,
                  }}>
                  {profileDob}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/gender@1.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Gender :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    textTransform: 'capitalize',
                    marginTop: 2,
                  }}>
                  {userdata[0]?.gender}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/teacher.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Qualification :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    width: 250,
                    fontFamily: FontFamily.poppinsMedium,
                    textTransform: 'capitalize',
                    justifyContent: 'center',
                    textAlign: 'left',
                    marginTop: 2,
                  }}>
                  {userdata[0]?.qualification}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/location.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Lives In:{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    textTransform: 'capitalize',
                    width: 250,
                    marginTop: 2,
                  }}>
                  {userdata[0]?.blockname},{userdata[0]?.districtname}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/note.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Regd.Date:{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    marginTop: 2,
                  }}>
                  {regDate}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.7,
                  height: 40,
                  borderBottomColor: Color.greyGrey300,
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <Image
                  style={[
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/personalcard.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 2,
                    color: '#000000',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 13,
                  }}>
                  Aadhaar Number :{' '}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: FontFamily.poppinsMedium,
                    marginTop: 2,
                  }}>
                  {userdata[0]?.aadhaar}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                marginTop: 20,
                width: window.WindowWidth * 0.96,
                // marginLeft: 15,align
                alignSelf: 'center',
                backgroundColor: 'white',
                paddingBottom: 25,
                borderRadius: 12,
              }}>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '700',
                  fontSize: 16,
                  color: Color.dimgray_200,
                  left: '5%',
                }}>
                Manager Details
              </Text>
              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.7,
                    height: 40,
                    borderBottomColor: Color.greyGrey300,
                    paddingBottom: 10,
                    marginTop: 20,
                  }}>
                  <Image
                    style={[
                      styles.iconusersuserPosition,
                      styles.iconusersuserLayout,
                    ]}
                    resizeMode="cover"
                    source={require('../assets/Image/user-square.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 50,
                      marginTop: 2,
                      color: '#000000',
                      fontWeight: '700',
                      fontFamily: FontFamily.poppinsMedium,
                      fontSize: 13,
                      textTransform: 'capitalize',
                      fontSize: 13,
                    }}>
                    Manager Name :{' '}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '500',
                      fontFamily: FontFamily.poppinsMedium,
                      textTransform: 'capitalize',
                      width: 250,
                      marginTop: 2,
                    }}>
                    {userdata[0]?.managername}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.7,
                    borderBottomColor: Color.greyGrey300,
                    paddingBottom: 10,
                    marginTop: 20,
                  }}>
                  <Image
                    style={[
                     
                      styles.iconusersuserPosition,
                      styles.iconusersuserLayout,
                    ]}
                    resizeMode="cover"
                    source={require('../assets/Image/medal.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 50,
                      marginTop: 2,
                      color: '#000000',
                      fontWeight: '700',
                      fontFamily: FontFamily.poppinsMedium,
                      fontSize: 13,
                    }}>
                    Manager ID :{' '}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '500',
                      fontFamily: FontFamily.poppinsMedium,
                      width: 250,
                      marginTop: 2,
                    }}>
                    {userdata[0]?.managerid}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.7,
                    height: 40,
                    borderBottomColor: Color.greyGrey300,
                    paddingBottom: 10,
                    marginTop: 20,
                  }}>
                  <Image
                    style={[
                      // styles.iconusersuserTag,
                      styles.iconusersuserPosition,
                      styles.iconusersuserLayout,
                    ]}
                    resizeMode="cover"
                    source={require('../assets/Image/barcode.png')}
                  />
                  <Text
                    style={{
                      marginLeft: 50,
                      marginTop: 2,
                      color: '#000000',
                      fontWeight: '700',
                      fontFamily: FontFamily.poppinsMedium,
                      fontSize: 13,
                    }}>
                    Passcode :{' '}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '500',
                      fontFamily: FontFamily.poppinsMedium,
                      marginTop: 2,
                    }}>
                    {userdata[0].passcode}
                  </Text>
                </View>
              </View>
            </View> */}
            {/* <View style={{marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('faq', {
                    type: 'faq',
                  })
                }
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  width: window.WindowWidth * 0.96,
                  height: window.WindowHeigth * 0.06,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignSelf: 'center',
                  // marginLeft: 20,
                }}>
                <Image
                  style={[
                    {marginTop: 10},
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/info-circle.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 10,
                    color: Color.gray_100,
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 15,
                  }}>
                  FAQ
                </Text>
              </TouchableOpacity>
            </View> */}

            <View style={{marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('about', {
                    type: 'about',
                  })
                }
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  width: window.WindowWidth * 0.96,
                  height: window.WindowHeigth * 0.06,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignSelf: 'center',
                  // marginLeft: 20,
                }}>
                <Image
                  style={[
                    {marginTop: 10},
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/info-circle.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 10,
                    color: Color.gray_100,
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 15,
                  }}>
                  About ThinkZone
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    'https://sites.google.com/view/thinkzoneapp/home',
                  )
                }
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  width: window.WindowWidth * 0.96,
                  height: window.WindowHeigth * 0.06,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <Image
                  style={[
                    {marginTop: 10},
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/creative-commons.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 10,
                    color: Color.gray_100,
                    fontWeight: '700',

                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('downloadfile');
                }}
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  width: window.WindowWidth * 0.96,
                  height: window.WindowHeigth * 0.06,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <Image
                  style={[
                    {marginTop: 10},
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/refresh-right-square.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 10,
                    color: Color.gray_100,
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 15,
                  }}>
                  Offline Activities
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <TouchableOpacity
                onPress={logOut}
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  width: window.WindowWidth * 0.96,
                  height: window.WindowHeigth * 0.06,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <Image
                  style={[
                    {marginTop: 10},
                    // styles.iconusersuserTag,
                    styles.iconusersuserPosition,
                    styles.iconusersuserLayout,
                  ]}
                  resizeMode="cover"
                  source={require('../assets/Image/refresh-right-square.png')}
                />
                <Text
                  style={{
                    marginLeft: 50,
                    marginTop: 10,
                    color: Color.gray_100,
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 15,
                  }}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={{
                  // marginLeft: 50,
                  marginTop: 20,
                  // color: Color.gray_100,
                  fontWeight: '700',
                  // fontFamily: FontFamily.poppinsMedium,

                  // left: '33.33%',
                  fontStyle: 'italic',
                  fontFamily: FontFamily.poppinsMediumItalic,
                  color: Color.royalblue,

                  fontSize: FontSize.size_smi,
                  textAlign: 'center',
                  paddingHorizontal: 30,
                  paddingBottom: 20,
                  // position: 'absolute',
                }}>
                App Version : 2.1.1
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Profile;

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
  name: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    color: 'black',
  },
  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  pricesymbol: {
    paddingLeft: 70,
  },
  price: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },

  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  container: {
    // borderRadius: 30,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'space-between',
  },
  cont1: {
    alignItems: 'center',
    marginTop: 90,
    // position: 'relative',

    width: window.WindowWidth * 0.9,
    // height: window.WindowHeigth * 0.5,

    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 11,
    marginBottom: 10,

    overflow: 'hidden',
    marginRight: 10,
  },
  cont2: {
    alignItems: 'center',
    marginTop: 10,

    width: window.WindowWidth * 0.9,
    // height: 300,

    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 11,
    marginBottom: 10,

    overflow: 'hidden',
    marginRight: 10,
  },
  cont3: {
    alignItems: 'center',
    marginTop: 10,

    width: window.WindowWidth * 0.9,
    // height: 350,

    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 11,
    marginBottom: 10,

    overflow: 'hidden',
    marginRight: 10,
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 75,
    // alignSelf: 'center',
    marginTop: 20,
    left: '2%',
  },
  icon: {
    marginLeft: 10,
    marginTop: 5,
  },

  roundButton1: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    margin: 10,
  },
  // username: {
  //   marginTop: window.WindowHeigth * 0.112,
  // },

  items: {
    flexDirection: 'row',

    width: 320,

    width: window.WindowWidth * 0.9,
    height: 40,
    backgroundColor: 'white',
    marginTop: 10,
    // borderRadius: 40,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  modalContainer: {
    height: window.WindowHeigth * 0.3,
    backgroundColor: 'white',
    elevation: 5,
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Text: {
    fontSize: 13,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: 15,
    // paddingRight: 5,
    marginTop: 8,
  },

  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },

  modalButtonText: {
    fontSize: 13,
    color: 'black',
  },
  languageButton: {
    height: window.WindowHeigth * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    flexDirection: 'row',
  },

  languageText: {
    letterSpacing: 0.6,
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
    marginLeft: 10,
  },
  statusPosition1: {
    left: '0%',
    right: '0%',
  },
  statusPosition2: {
    top: '0%',
    right: '0%',
    position: 'absolute',
    width: '100%',
  },
  statusPosition: {
    bottom: '0%',
    height: '100%',
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
    overflow: 'hidden',
    position: 'absolute',
  },
  textFlexBox: {
    textAlign: 'right',
    position: 'absolute',
  },
  textTypo4: {
    fontSize: 12,
    marginTop: -7.43,
    textAlign: 'right',

    height: 15,
    top: '50%',
    left: '0%',
    width: '100%',
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
    overflow: 'hidden',
    position: 'absolute',
  },
  ramTypo: {
    fontWeight: '600',

    textAlign: 'left',
    position: 'absolute',
  },
  ramDevPosition: {
    left: 95,
    color: Color.white,
  },
  youTypo: {
    height: 42,
    width: 173,

    fontWeight: '500',
    textAlign: 'left',
    position: 'absolute',
  },
  frameChildLayout: {
    width: 386,
    position: 'absolute',
  },
  childGroupBg: {
    backgroundColor: 'white',
    borderRadius: 6,
    left: 0,
  },
  groupLayout1: {
    height: 48,
    width: 338,
    position: 'absolute',
  },
  detailsLayout: {
    height: 26,
    width: 159,
    color: '#595f65',
    fontSize: 16,
  },
  signOutPosition: {
    top: 13,
    position: 'absolute',
  },
  signOutTypo: {
    width: 159,
    fontWeight: '500',
    // textAlign: 'left',
  },
  iconusersuserLayout: {
    height: 24,
    width: 24,
  },
  privacyPolicyPosition: {
    top: 14,
    position: 'absolute',
  },
  aboutThinkzonePosition: {
    top: 15,
    position: 'absolute',
  },
  groupLayout: {
    height: 419,
    position: 'absolute',
  },
  iconusersuserPosition: {
    left: 15,
    position: 'absolute',
  },
  userContainerTypo: {
    left: '12.91%',
    width: '64.84%',
    height: '4.02%',

    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
    position: 'absolute',
  },
  containerTypo: {
    left: '13.19%',
    width: '64.84%',
    height: '4.02%',

    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
    position: 'absolute',
  },
  editTypo: {
    top: 12,

    fontWeight: '500',
    textAlign: 'left',
    position: 'absolute',
  },
  groupIconPosition: {
    left: 18,
    position: 'absolute',
  },
  groupChildLayout1: {
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  groupChildLayout2: {
    width: 233,
    borderColor: '#deeaf5',
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  text6Position: {
    top: 279,
    position: 'absolute',
  },
  groupChild10Layout: {
    width: 338,
    height: 180,
    position: 'absolute',
  },
  managerContainerTypo: {
    left: '14.5%',
    width: '69.82%',
    height: '9.37%',

    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
    position: 'absolute',
  },
  textLayout: {
    height: 17,
    fontWeight: '500',
  },
  textLayout1: {
    width: 139,
    height: 17,
  },
  textTypo3: {
    left: 21,
    height: 17,
    width: 139,

    color: 'black',
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
    position: 'absolute',
  },
  textPosition1: {
    left: 129,

    position: 'absolute',
  },
  textPosition: {
    left: 20,
    position: 'absolute',
  },
  textTypo2: {
    top: 375,
    height: 17,
    width: 139,
    color: 'black',
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
  },
  textTypo1: {
    top: 396,
    height: 17,
    width: 139,
    color: 'black',
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
  },
  textTypo: {
    width: 72,
    top: 65,
    height: 17,

    color: 'black',
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'left',
    position: 'absolute',
  },
  groupChildLayout: {
    height: 20,
    width: 21,
    top: 42,
    position: 'absolute',
  },
  groupChildPosition: {
    backgroundColor: 'lightblue',
    top: 51,
    height: 3,
    width: 71,
    position: 'absolute',
  },
  nsdcLayout: {
    width: 48,
    height: 17,
    position: 'absolute',
  },
  text: {
    color: '#666',
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
    overflow: 'hidden',
    position: 'absolute',
  },
  statusBar1: {
    position: 'absolute',
  },
  statusBar: {
    height: '1.44%',
    bottom: '98.56%',
  },
  myProfileChild: {
    height: '8.8%',
    width: '107.22%',
    top: '0.14%',
    right: '-4.44%',
    bottom: '91.07%',
    left: '-2.78%',
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  text1: {
    color: Color.white,
    fontFamily: FontFamily.poppinsRegular,
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
    height: '2.4%',
    bottom: '97.6%',
  },
  myProfileItem: {
    height: '7.49%',
    width: '24.44%',
    right: '73.06%',
    bottom: '89.35%',
    left: '2.5%',
    top: '3.16%',
  },
  helloRam: {
    height: '1.31%',
    width: '43.89%',
    left: '26.39%',
    display: 'none',
    textAlign: 'left',
    top: '3.16%',
    // color: Color.white,
  },
  thinkzoneLogoJpgForWhiteB: {
    top: 715,
    left: -4869,
    width: 1865,
    height: 2162,
    position: 'absolute',
  },
  ramDev: {
    top: 46,
    width: 158,
    height: 19,
    textAlign: 'left',
  },
  thisMonthYou: {
    top: 73,
    fontSize: FontSize.size_smi,
  },
  help: {
    top: 91,
    left: 308,
    fontSize: FontSize.size_smi,
    color: Color.white,
  },
  frameChild: {
    top: -1,
    height: 118,
  },
  rectangleWrapper: {
    height: 120,
    left: 0,
    top: 0,
  },
  myProfileInner: {
    top: 142,
    left: -1,
    height: 12,
  },
  rectangleView: {
    top: 460,
    width: 340,
    height: 110,
    left: 10,
    borderRadius: Border.br_7xs,
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  youHave: {
    fontSize: FontSize.size_smi,
    color: Color.white,
  },
  text2: {
    color: '#c0fe3b',
    fontSize: FontSize.size_base,
  },
  youHave32Container: {
    top: 492,
    left: 32,
  },
  myProfileChild1: {
    top: 270,
    width: 149,
    height: 180,
    left: 10,
    backgroundColor: Color.white,
    borderRadius: Border.br_7xs,
    position: 'absolute',
  },
  pngtreecartoonOpenedWooden1: {
    right: '100%',
    left: '-100%',
  },
  pngtreecartoonOpenedWooden: {
    top: 435,
    left: 329,
    height: 150,
    transform: [
      {
        rotate: '180deg',
      },
    ],
    width: 129,
    position: 'absolute',
  },
  groupChild: {
    top: 0,
  },
  signOut: {
    left: 50,
  },
  iconarrowrefreshRightSquar: {
    left: 19,
  },
  rectangleParent: {
    top: 1321,
    left: 11,
  },
  privacyPolicy: {
    left: 48,
  },
  iconcontentEditcreativeCom: {
    left: 16,
  },
  rectangleGroup: {
    top: 1261,
    left: 12,
  },
  aboutThinkzone: {
    left: 50,
  },
  iconessentialinfoCircle: {
    left: 19,
  },
  rectangleContainer: {
    top: 1200,
    left: 11,
  },
  groupChild1: {
    width: 339,
    top: 0,
  },
  iconusersuserSearch: {
    top: 137,
  },
  iconuserspeople: {
    top: 97,
  },
  userId: {
    color: Color.black,
  },
  rams123gmailcom: {
    color: 'black',
  },
  userIdRams123gmailcomContainer: {
    top: '12.89%',
  },
  guardianNameNaContainer: {
    top: '22.43%',
  },
  userTypeFellowContainer: {
    top: '31.98%',
  },
  dob05042000: {
    top: '41.53%',
  },
  genderMale: {
    top: '51.07%',
  },
  qualificationBsc: {
    top: '60.62%',
  },
  livesInCuttackContainer: {
    top: '70.17%',
  },
  regdDate23272028Container: {
    top: '79.71%',
  },
  aadhaarNumber9878Container: {
    top: '89.26%',
  },
  iconusersuserTag: {
    top: 56,
  },
  edit: {
    color: Color.steelblue,
    width: 79,
    height: 18,
    left: 285,
    fontSize: FontSize.size_smi,
  },
  myDetails: {
    top: 11,
  },
  iconessentialcake: {
    top: 176,
  },
  iconbusinesspersonalcard: {
    top: 377,
  },
  groupIcon: {
    top: 220,
    width: 19,
    height: 19,
  },
  iconcontentEditnote: {
    top: 336,
  },
  iconschoolteacher: {
    top: 256,
  },
  iconlocationlocation: {
    top: 296,
  },
  lineView: {
    top: 79,
    left: 48,
    position: 'absolute',
  },
  groupChild2: {
    top: 119,
    left: 48,
    position: 'absolute',
  },
  groupChild3: {
    top: 159,
    left: 48,
    position: 'absolute',
  },
  groupChild4: {
    top: 199,
    left: 48,
    position: 'absolute',
  },
  groupChild5: {
    top: 239,
    left: 48,
    position: 'absolute',
  },
  groupChild6: {
    left: 48,
  },
  groupChild7: {
    top: 319,
    left: 48,
    position: 'absolute',
  },
  groupChild8: {
    top: 359,
    left: 48,
    position: 'absolute',
  },
  groupChild9: {
    top: 398,
    left: 47,
    position: 'absolute',
  },
  groupView: {
    top: 580,
    width: 364,
    left: 10,
  },
  myProfileChild2: {
    top: 860,
    left: 60,
    position: 'absolute',
  },
  groupChild10: {
    top: 0,
  },
  managerDetails: {
    left: 17,
  },
  managerNameNaContainer: {
    top: '30.56%',
  },
  iconshopbarcode: {
    top: 138,
  },
  iconsupportLikeQuestionmed: {
    top: 96,
  },
  vuesaxtwotoneuserSquareIcon: {
    height: '14.05%',
    width: '7.1%',
    top: '31.11%',
    right: '87.57%',
    bottom: '54.84%',
    left: '5.33%',
  },
  groupChild11: {
    top: 80,
    left: 50,
    position: 'absolute',
  },
  managerIdBiswathinkzoneinContainer: {
    top: '52.78%',
  },
  groupChild12: {
    top: 120,
    left: 50,
    position: 'absolute',
  },
  managerIdBiswathinkzoneinContainer1: {
    top: '75%',
  },
  groupChild13: {
    top: 160,
    left: 50,
    position: 'absolute',
  },
  rectangleParent1: {
    top: 1010,
    left: 11,
  },
  appVersion178: {
    height: '1.16%',
    width: '65.56%',
    top: '94.5%',
    left: '33.33%',
    fontStyle: 'italic',
    fontFamily: FontFamily.poppinsMediumItalic,
    color: Color.royalblue,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  iconcryptowhatsapp: {
    top: 64,
    left: 310,
    position: 'absolute',
  },
  text6: {
    textAlign: 'center',
    fontFamily: FontFamily.balooBhaina2Medium,
    left: 19,
    color: Color.dimgray_200,
    width: 139,
    top: 279,
    fontSize: FontSize.size_base,
  },
  text7: {
    top: 312,
  },
  text8: {
    top: 312,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text9: {
    top: 331,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text10: {
    top: 352,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text13: {
    top: 424,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text14: {
    top: 333,
  },
  text15: {
    top: 354,
  },
  text16: {
    fontFamily: FontFamily.balooBhaina2Medium,
  },
  text17: {
    fontFamily: FontFamily.balooBhaina2Medium,
  },
  text18: {
    top: 424,
  },
  myProfileChild3: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    top: 424,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    left: 20,
    width: 129,
  },
  text19: {
    width: 97,
    top: 65,
    fontFamily: FontFamily.balooBhaina2Medium,
    color: Color.black,
    left: 0,
    fontSize: FontSize.size_smi,
  },
  text20: {
    left: 111,
  },
  myAchievement: {
    left: 26,
    top: 0,
    position: 'absolute',
  },
  ellipseIcon: {
    left: 52,
  },
  groupChild14: {
    top: 50,
    left: 58,
    backgroundColor: Color.steelblue,
    height: 3,
    width: 71,
    position: 'absolute',
  },
  groupChild15: {
    left: 121,
  },
  groupChild16: {
    left: 184,
  },
  groupChild17: {
    left: 244,
  },
  groupChild18: {
    left: 114,
  },
  groupChild19: {
    left: 176,
  },
  groupChild20: {
    left: 238,
  },
  groupChild21: {
    left: 298,
  },
  text21: {
    left: 175,
  },
  text22: {
    left: 226,
  },
  nsdc: {
    textAlign: 'center',
    color: Color.black,
    left: 0,
    top: 0,
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.poppinsRegular,
  },
  nsdcWrapper: {
    top: 65,
    left: 285,
  },
  parent: {
    top: 154,
    left: 14,
    width: 333,
    height: 82,
    position: 'absolute',
  },
  myProfile: {
    backgroundColor: Color.aliceblue_100,
    flex: 1,
    height: 1455,
    width: '100%',
  },
  icon: {
    color: 'green',
    margin: 10,
  },
  studentRegisterItem: {
    marginTop: 20,
    marginLeft: 20,
  },
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
    width: '61%',
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    fontFamily: FontFamily.poppinsSemibold,
    textAlign: 'left',
    left: '28.39%',
    top: '2.75%',
    color: Color.primaryContrast,
    position: 'absolute',
    // textTransform: 'capitalize',
    paddingBottom: 50,
  },
  completeYourNext: {
    // height: '5.25%',
    width: '40.06%',
    top: '8.13%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'left',
    left: '28.39%',
    color: Color.primaryContrast,
    position: 'absolute',
    paddingBottom: 20,
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
    width: '8.25%',
    top: '6.38%',
    // bottom: '75.25%',
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
    // top: '20%',
    // bottom: '76.25%',
    left: '81.94%',
    right: '9.72%',
    height: '3.75%',
    maxHeight: '100%',
    maxWidth: '100%',
    // position: 'absolute',
    // overflow: 'hidden',
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
    height: 800,

    // overflow: 'hidden',
    width: '100%',
    backgroundColor: Color.aliceblue_100,
  },
  button: {
    backgroundColor: 'red',
  },
});
