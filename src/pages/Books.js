import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  PanResponder,
  AppState,
  ToastAndroid,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React from 'react';
import {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../environment/Api';
import Colors from '../utils/Colors';
import ListItem from '../components/ListItem';
import * as window from '../utils/dimensions';

// import * as FcmSlice from '../redux/slices/FcmSlice';
// import Color from '../utils/Colors';

import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import {ScrollView} from 'react-native-gesture-handler';
import Loading from '../components/Loading';
import {app_versions} from './Home';

const Books = ({routes, navigation}) => {
  const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // let stTime = new Date().getTime();
  const [appType, setAppType] = useState('teacherapp');
  const [books, setBooks] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  // console.log("books----->",books);
  // const teacherdata = useSelector(state => state.userdata.user?.resData);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const stTime = new Date().getTime();
  //   return () => {
  //     const clTime = new Date().getTime();
  //     const timeSpent = (clTime - stTime) / 1000;
  //
  //   };
  // }, []);
  const activeScreen =
    navigation.getState().routes[navigation.getState().index].name;

  const [stTime, setStTime] = useState(null);
  console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  //for user back button press timespent calculation
  //!----------------------The below codes have been commented since the book module is under develoment-------------------
  // useEffect(() => {
  //   const resetStartTime = () => {
  //     console.log('calling reset start time function----------------------->');
  //     AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
  //       .then(() => console.log('stTime saved to AsyncStorage'))
  //       .catch(error =>
  //         console.error('Error saving stTime to AsyncStorage:', error),
  //       );
  //   };
  //   resetStartTime();
  //   const backAction = () => {
  //     console.log(
  //       '======================== 2 Set Start Time========================= ',
  //     );

  //     const x = AsyncStorage.getItem('stTime').then(value => {
  //       const y = new Date().getTime();
  //       console.log(
  //         '<<<<<<<<<<<<<<<<<<<<<<<<<< if Not Idle:  Statrt time: ',
  //         value,
  //       );
  //       const timeSpent = y - value;
  //       setGetStartTime(timeSpent);
  //       console.log(
  //         'ooooooooooooooooooooooooooooooooooooooo timeSpent--->',
  //         timeSpent,
  //       );

  //       const resetTimeSpent = timeSpent / 1000;
  //       console.log('resetTimeSpent--->', resetTimeSpent);
  //       const duration = Math.floor(resetTimeSpent);
  //       console.log('duration--->', duration);
  //       const year = new Date().getFullYear();
  //       console.log('year--->', year);
  //       const month = new Date().getMonth() + 1;
  //       console.log('month--->', month);
  //       const data = {
  //         userid: userid,
  //         username: username,
  //         usertype: usertype,
  //         managerid: managerid,
  //         passcode: passcode,
  //         modulename: 'fln',
  //         duration: duration,
  //         month: month,
  //         year: year,
  //         appVersion: app_versions,
  //         start: new Date(parseInt(value)),
  //         end: new Date(parseInt(y)),
  //       };

  //       API.post(`savetimespentrecord/`, data)
  //         .then(response => {
  //           console.log('timespent response in content------->', response.data);
  //         })
  //         .catch(error => {
  //           console.log('error in timespent post------------->', error);
  //         });
  //     });
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  //Store Timespent data
  // let stTime = new Date().getTime();

  //For Screen idle timespent calculation
  //!----------------------The below codes have been commented since the book module is under develoment-------------------
  // useEffect(() => {
  //   AsyncStorage.getItem('stTime')
  //     .then(value => {
  //       if (value) {
  //         console.log('value--->', value);
  //         //setStTime(parseInt(value, 10));
  //       } else {
  //         setStTime(new Date().getTime());
  //       }
  //     })
  //     .catch(error =>
  //       console.error('Error loading stTime from AsyncStorage:', error),
  //     );
  //   const handleAppStateChange = nextAppState => {
  //     // console.log(
  //     //   '>>>>>>>>>>>>>>>>>>> Idle:  State change: appStateVisible= ',
  //     //   appStateVisible,
  //     //   '     nextAppState= ',
  //     //   nextAppState,
  //     // );
  //     const x = AsyncStorage.getItem('stTime').then(value => {
  //       value = value ? value : new Date().getTime();
  //       if (appStateVisible === 'active' && nextAppState === 'background') {
  //         console.log('>>>>>>>>>>>>>>>>>>> Idle:  Statrt time: ', value);
  //         const closeTime = new Date().getTime();
  //         console.log('>>>>>>>>>>>>>>>>>>> Idle:  End time time: ', closeTime);

  //         const dur = (closeTime - value) / 1000;
  //         console.log('>>>>>>>>>>>>>>>>>>>>>> 1 timeSpent--->', dur);
  //         AsyncStorage.setItem('stTime', closeTime.toString()) //clTime.toString()
  //           .then(() => {
  //             const duration = Math.floor(dur);
  //             console.log('duration--->', duration);
  //             const year = new Date().getFullYear();
  //             console.log('year--->', year);
  //             const month = new Date().getMonth() + 1;
  //             console.log('month--->', month);
  //             const data = {
  //               userid: userid,
  //               username: username,
  //               usertype: usertype,
  //               managerid: managerid,
  //               passcode: passcode,
  //               modulename: 'fln',
  //               duration: duration,
  //               month: month,
  //               year: year,
  //               appVersion: app_versions,
  //               start: new Date(parseInt(value)),
  //               end: new Date(parseInt(closeTime)),
  //             };

  //             API.post(`savetimespentrecord/`, data)
  //               .then(response => {
  //                 console.log(
  //                   'timespent response in content------->',
  //                   response.data,
  //                 );
  //               })
  //               .catch(error => {
  //                 console.log('error in timespent post------------->', error);
  //               });

  //             console.log('stTime saved to AsyncStorage');
  //           })
  //           .catch(error =>
  //             console.error('Error saving stTime to AsyncStorage:', error),
  //           );
  //       } else if (
  //         appStateVisible === 'background' &&
  //         nextAppState === 'active'
  //       ) {
  //         setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
  //       } else if (appStateVisible === 'active' && nextAppState === 'active') {
  //         console.log('when Screen is on =====================>');
  //         AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
  //           .then(() => console.log('stTime saved to AsyncStorage1'))
  //           .catch(error =>
  //             console.error('Error saving stTime to AsyncStorage:', error),
  //           );
  //       }
  //     });
  //     // const y = AsyncStorage.getItem('clTime');
  //     // console.log('checkGet data ooo ------------->', x, y);
  //     // console.log('checkstare------------->', appStateVisible, nextAppState);
  //     // if (appStateVisible === 'active' && nextAppState === 'background') {
  //     //   const clTime = new Date().getTime();
  //     //   console.log('clTime--->', clTime);
  //     //   const timeSpent = (clTime - stTime) / 1000;
  //     //   console.log(
  //     //     '****************************** 1 timeSpent--->',
  //     //     timeSpent,
  //     //   );
  //     //   const duration = Math.floor(timeSpent);
  //     //   console.log('duration--->', duration);
  //     //   const year = new Date().getFullYear();
  //     //   console.log('year--->', year);
  //     //   const month = new Date().getMonth() + 1;
  //     //   console.log('month--->', month);
  //     //   const data = {
  //     //     userid: userid,
  //     //     username: username,
  //     //     usertype: usertype,
  //     //     managerid: managerid,
  //     //     passcode: passcode,
  //     //     modulename: 'fln',
  //     //     duration: duration,
  //     //     month: month,
  //     //     year: year,
  //     //   };

  //     //   API.post(`savetimespentrecord/`, data).then(response => {
  //     //     console.log('timespent response in content------->', response.data);
  //     //   });

  //     //   // Save the current time in AsyncStorage for future use
  //     //   console.log(
  //     //     '======================== 1 Set Start Time========================= ',
  //     //   );
  //     //   AsyncStorage.setItem('stTime', null) //clTime.toString()
  //     //     .then(() => console.log('stTime saved to AsyncStorage'))
  //     //     .catch(error =>
  //     //       console.error('Error saving stTime to AsyncStorage:', error),
  //     //     );
  //     // } else if (
  //     //   appStateVisible === 'background' &&
  //     //   nextAppState === 'active'
  //     // ) {
  //     //   setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
  //     // }

  //     setAppStateVisible(nextAppState);
  //   };

  //   AppState.addEventListener('change', handleAppStateChange);

  //   // Cleanup function
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  useEffect(() => {
    API.get(`getdistinctdirectorylistbyapptype/${appType}`).then(
      response => {
        //
        setBooks(response.data);
        setDataFetched(true);
      },
      err => {
        //
      },
    );
  }, []);
  const getAllBooks = item => {
    //
    API.get(`getallfilelistinsidedirectorybyapptype/${appType}/${item}`).then(
      response => {
        //
        navigation.navigate('booklist', response.data);
      },
      err => {
        //
      },
    );
    [];
  };

  // const timerId = useRef(false);
  // const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
  //   useState(600);
  // useEffect(() => {
  //   // resetInactivityTimeout(); //
  // }, []);

  // let timeSpent = new Date().getTime();
  // let duration = Math.floor(timeSpent);
  // // console.log('timerId--->>', timerId);
  // // console.log('timeSpent----->>', timeSpent);
  // // console.log('Duration------->>', duration);

  // const panResponder = React.useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponderCapture: () => {
  //       resetInactivityTimeout();
  //     },
  //   }),
  // ).current;

  // const resetInactivityTimeout = () => {
  //   clearTimeout(timerId.current);
  //   timerId.current = setTimeout(() => {
  //     // action after user has been detected idle
  //     if (activeScreen === 'books') {
  //       navigation.goBack();
  //       ToastAndroid.show(
  //         'Went back due to user inactivity ',
  //         ToastAndroid.SHORT,
  //       );
  //     } else if (activeScreen === 'booklist' && activeScreen !== 'bookview') {
  //       navigation.goBack();
  //       ToastAndroid.show(
  //         'Went back due to user inactivity ',
  //         ToastAndroid.SHORT,
  //       );
  //     }
  //   }, timeForInactivityInSecond * 1000);
  // };

  return (
    <View style={{flex: 1}}>
      <View>
        {/* <ScrollView horizontal={true}>
          {books.map((item, index) => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  getAllBooks(item);
                }}
                style={styles.list}>
                <View
                  style={{
                    backgroundColor: Color.royalblue,
                    width: window.WindowWidth * 0.6,
                    // height: window.WindowHeigth * 0.14,
                  }}>
                  <Text>{item}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView> */}
        {dataFetched ? (
          <FlatList
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={40}
            data={books}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  getAllBooks(item);
                }}
                style={styles.list}>
                <View>
                  <Image
                    style={styles.tinyLogos}
                    source={require('../assets/Image/iconschoolbook.png')}
                  />
                </View>
                <Text style={[styles.text, {flex: 1}]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          // Show loader while data is being fetched
          // <ActivityIndicator
          //   size="large"
          //   color={Colors.primary}
          //   style={{
          //     justifyContent: 'center',
          //     alignSelf: 'center',
          //     position: 'absolute',
          //     top: 300,
          //     // bottom: 300,
          //   }}
          // />
          // <BookSkeleton />
          <Loading />
        )}
        {/* <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Books</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Important Documents</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Resources</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Books;

const styles = StyleSheet.create({
  list: {
    backgroundColor: Color.white,
    paddingBottom: 12,
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 12,
    paddingTop: 32,
    paddingBottom: 29,
    color: Color.greyGrey700,
  },
  tinyLogos: {
    width: 45,
    height: 45,
    marginLeft: 26,
    // backgroundColor: 'white',
    marginTop: 25,
    marginLeft: 12,
    borderRadius: 49,
  },
});
