import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import Api from '../environment/Api';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import {Badge} from 'react-native-paper';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Header = ({route, navigation, handleClick}) => {
  const userdatas = [
    {
      middlename: 'bhh',
      passcode: 'GURUBBS0324',
      passcodeRequested: false,
      image: '',
      userpolicy: 'agreed',
      _id: '66a9f49bb4e0ca12a84fb500',
      userid: 'mkhbhhhyh.7683939162@tz.in',
      emailid: 'monalisamoharana99@gmail.com',
      emailidVerified: true,
      username: 'mkh bhh hyh',
      firstname: 'mkh',
      lastname: 'hyh',
      usertype: 'fellow',
      guardianname: 'guu',
      contactnumber: '7683939162',
      phoneNumberVerified: true,
      qualification: 'Master of Arts',
      gender: 'male',
      dob: '2005-12-24T00:00:00.000Z',
      aadhaar: '',
      aadhaarUpdated: false,
      managerid: 'guru@thinkzone.in',
      managername: 'guru',
      status: 'active',
      stateid: '20',
      statename: 'odisha',
      districtid: '',
      districtname: 'bhadrak',
      blockid: '',
      blockname: 'bhandari pokhari',
      udisecode: '',
      schoolname: '',
      graduated: 'no',
      createdon: '2024-07-31T08:23:55.464Z',
      __v: 0,
    },
  ];

  const {usertype, schoolname} = userdatas[0];
  const [userdata, setUserdata] = useState(userdatas);
  const [notficationCount, setNotificationCount] = useState();
  const [imageNotFound, setImageNotFound] = useState(false);

  const [isLoading, setIsloading] = useState(true);
  const [imgerr, setImgerr] = useState(false);

  const [blinkAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000); // Blinking interval: 1 second

    return () => clearInterval(interval);
  }, [blinkAnimation]);
  const textStyle = {
    alignSelf: 'center',
    fontSize: 11.5,
    fontFamily: 'Poppins-Medium', // Assuming FontFamily.poppinsMedium is your font family variable
    opacity: blinkAnimation,
    top: '60%',
  };

  // console.log('imageNotFound====>', imageNotFound);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      Api.get(`getuserbyuserid/${userdatas[0]?.userid}`).then(response => {
        setUserdata(response.data);
        setIsloading(false);
      });

      Api.get(`getUnreadNotifCount/${userdatas[0]?.userid}`).then(response => {
        // console.log('not--->', response.data);
        setNotificationCount(response.data);
      });
    }, []),
  );
  const [timespent_record, setTimeSpent_record] = useState({});
  // console.log('timespent_record---->', timespent_record);

  const convertMinutesToSeconds = minutes => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {mins, secs};
  };

  const {mins, secs} = convertMinutesToSeconds(
    timespent_record ? timespent_record.timeSpent : null,
  );
  // console.log('min00000>', mins, secs);
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
  // const timeHeader = timespent_record[timespent_record.length - 1];
  // console.log('timeHeader--->', timeHeader);
  const colors = ['white', 'orange', '#A3D735', 'yellow', '#f3f2ff', 'pink'];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const [textColor, setTextColor] = useState(getRandomColor());

  useEffect(() => {
    // If you want the color to change every time the component mounts, you can use the useEffect hook.
    setTextColor(getRandomColor());
  }, []);

  return (
    <View style={styles.studentRegister}>
      <View style={[styles.studentRegisterChild, styles.rectangleViewBg]} />
      {userdata[0]?.image === '' || !userdata[0]?.image ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('profile', {
              type: 'Profile',
            })
          }>
          <Image
            // style={{
            //   width: window.WindowWidth * 0.22,
            //   height: window.WindowHeigth * 0.121,
            //   marginTop: 30,
            //   left: '15%',
            // }}
            style={styles.image}
            source={require('../assets/Photos/userss.png')}
            accessibilityLabel="Image not available"
            resizeMode="cover"
          />
          {/* <Text>Your Default Text Here</Text> */}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('profile', {
              type: 'Profile',
            })
          }>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={'white'}
              style={[
                {
                  width: '10%', // Adjust the width using a percentage value
                  aspectRatio: 1, // Maintain the aspect ratio of the image
                  borderRadius: '50%', // Create a circular shape
                  alignSelf: 'flex-start', // Align the image to the left
                  marginTop: '2%',
                },
                styles.image,
              ]}
            />
          ) : (
            <Image
              style={[
                {
                  width: 100, // Adjust the width using a specific value instead of a percentage
                  height: 100, // Set a fixed height to maintain aspect ratio
                  aspectRatio: 1, // Maintain the aspect ratio of the image
                  borderRadius: 50, // Set a fixed border radius for a circular shape

                  marginTop: 10, // Set a specific marginTop value instead of a percentage
                  alignSelf: 'flex-start', // Align the image to the left
                },
                styles.image, // Additional styles if needed
              ]}
              source={
                imageNotFound
                  ? require('../assets/Photos/userss.png') // Local fallback image
                  : {
                      uri: userdata[0]?.image, // Check if userdata[0] exists before accessing its image property
                    }
              }
              accessibilityLabel="User Profile Image"
              resizeMode="cover"
              onError={error => {
                console.log(
                  error.nativeEvent,
                  error.nativeEvent.code,
                  'Image failed to load. Displaying fallback image.',
                );

                setImageNotFound(true);
              }}
            />
          )}
        </TouchableOpacity>
      )}

      <Text style={[styles.helloRam]}>
        Hello, {userdata[0]?.firstname}
        {/* <MaterialCommunityIcons
          name="hand-wave"
          size={17}
          color={'#FDDA02'}
          style={{
            marginLeft: 285,
            marginTop: -30,
            // paddingBottom: 40,
          }}
        /> */}
      </Text>
      {usertype === 'fellow' ? (
        <Text style={[styles.completeYourNext, {width: 150}]}>
          This month you have {''}spent{' '}
          {/* {timespent_record?.timespent != 0
            ? `${mins} mins ${secs} secs `
            : timespent_record?.timespent === 0
            ? '0 '
            : '0 '} */}
          {timespent_record?.timeSpent === 0
            ? timespent_record?.timeSpent + ' mins '
            : timespent_record?.timeSpent && mins === 0
            ? `${secs} secs `
            : timespent_record?.timeSpent && mins !== 0
            ? `${mins} mins ${secs} secs `
            : '0 mins '}
          in App.
        </Text>
      ) : usertype === 'school' ? (
        <Text style={[styles.completeYourNext, {width: 150}]}>
          SchoolName -
          {Object.keys(timespent_record).length > 0
            ? timespent_record?.timeSpent === 0
              ? timespent_record?.timeSpent + ' mins '
              : `${mins} mins ${secs} secs `
            : '0 mins'}
          schoolname
        </Text>
      ) : null}
      {/* <View style={styles.logoContainer}>
        <View style={styles.logoCont}>
          <Image
            source={require('../assets/Image/tzicon.png')}
            style={styles.logo}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('notification', {
                type: 'notification',
              })
            }
            style={[styles.logoContainer, {top: 50, left: 5}]}>
            <Image
              source={require('../assets/Image/notification.png')}
              style={styles.logo}
            />
            {notficationCount?.unreadCount === 0 ? null : (
              <Badge
                style={{
                  top: -30,
                  backgroundColor: '#c70039',
                  // color: Color.royalblue,
                  // fontSize: 11,
                  fontWeight: 'bold',
                }}>
                {notficationCount?.unreadCount}
              </Badge>
            )}
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCont}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('about', {
                type: 'ABOUT US',
              })
            }>
            <Image
              source={require('../assets/Image/tzicon.png')}
              style={{width: 38, height: 38, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('notification', {
                type: 'notification',
              })
            }
            style={[styles.logoContainer, {top: 50, left: 11}]}>
            <Image
              source={require('../assets/Image/notification.png')}
              style={styles.logo}
            />
            {notficationCount?.unreadCount === 0 ? null : (
              <Badge
                style={{
                  top: -30,
                  backgroundColor: '#c70039',
                  // color: Color.royalblue,
                  // fontSize: 5,
                  fontWeight: 'bold',
                }}>
                {notficationCount?.unreadCount}
              </Badge>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClick}
            style={[styles.logoContainer, {top: 75, left: -68, width: 150}]}>
            <Animated.Text style={[textStyle, {color: textColor}]}>
              Take a Tour{' '}
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  rectangleViewBg: {
    backgroundColor: Color.royalblue,
    position: 'absolute',
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

  helloRam: {
    // marginTop: -20,
    // height: '2.38%',
    width: '70.89%',
    fontSize: FontSize.size_lg,
    fontWeight: '900',
    fontFamily: FontFamily.poppinsSemibold,
    textAlign: 'left',
    left: '28.39%',
    top: '4%',
    color: Color.primaryContrast,
    position: 'absolute',
    textTransform: 'capitalize',
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
    // height: '4.38%',
    // width: '9.72%',
    top: '6.38%',
    // bottom: '75.25%',
    left: '81.11%',
    right: '9.17%',
    // maxHeight: '100%',
    // maxWidth: '100%',
    position: 'absolute',
    // overflow: 'hidden',
  },

  studentRegisterInner: {
    // height: '46.5%',
    width: '91.39%',
    // top: '18.13%',
    right: '4.17%',
    bottom: '35.38%',
    left: '4.44%',
    // borderRadius: Border.br_7xs,
  },

  rectangleView: {
    height: '4.88%',
    width: '31.39%',
    top: '58.13%',
    right: '34.17%',
    bottom: '37%',
    left: '34.44%',
    // borderRadius: Border.br_xl,
  },

  groupChild: {
    // height: '74.51%',
    // bottom: '25.49%',
    // borderRadius: Border.br_7xs,
    backgroundColor: Color.aliceblue_100,
    left: '0%',
    right: '0%',
    top: '0%',
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
  completeYourNext: {
    // height: '5.25%',
    width: '50.06%',
    // top: '8.13%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'left',
    left: '28.39%',
    color: Color.primaryContrast,
    // position: 'absolute',
    paddingBottom: 20,
    top: '-5%',
  },
  groupChild2: {
    height: '99.24%',
    width: '99.94%',
    top: '99.24%',
    right: '-99.94%',
    // bottom: '-98.48%',
    left: '100%',
    // borderBottomRightRadius: Border.br_7xs,
    // borderBottomLeftRadius: Border.br_7xs,
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

  image: {
    height: 90,
    width: 90,
    borderRadius: 75,
    // alignSelf: 'left',
    marginTop: 20,
    left: '2.4%',
  },

  logoContainer: {
    position: 'absolute',
    top: '2%', // Adjust the top value to position the logo vertically
    right: '2%', // Adjust the right value to position the logo horizontally
    zIndex: 2,
  },
  logoCont: {
    // backgroundColor: 'white',
    borderRadius: 100,
    padding: 4,
  },

  logo: {
    width: 25, // Adjust the width as needed
    height: 25, // Adjust the height as needed
    resizeMode: 'contain', // Maintain the aspect ratio of the logo
  },
});
