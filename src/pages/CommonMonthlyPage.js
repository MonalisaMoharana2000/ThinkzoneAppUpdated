import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  Image,
  ActivityIndicator,
  Animated,
  AppState,
  BackHandler,
} from 'react-native';
import storage from '../utils/AsyncStorage';
import Colors from '../utils/Colors';
import * as SIZES from '../utils/dimensions';
import Foundation from 'react-native-vector-icons/Foundation';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
//getTransTtlQuizTopics/:userid/:usertype/:language
import API from '../environment/Api';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Norecord from '../components/Norecord';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {app_versions} from './Home';
const AnimatedMaterialIcons = Animated.createAnimatedComponent(Foundation);

const CommonMonthlyPage = ({navigation}) => {
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log('user--->', user);
  const {username, userid, managerid, managername, usertype, passcode} =
    user[0];
  const [topic, setTopic] = useState([]);
  // console.log('topic-->', topic);
  const [isLoading, setIsLoading] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [disabledItems, setDisabledItems] = useState([]);
  // console.log('disabledItems-->', disabledItems);
  //
  //Store Timespent
  const [stTime, setStTime] = useState(null);
  // console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  // console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          '',
          'Do you want to Leave this page?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );

        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  //for user back button press timespent calculation
  //!----------------------Commented as per discussion since not required to spend more time on Quiz page-----------------
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
  //       console.log('start time-------------->', value);
  //       console.log('x---------------------->', x);
  //       console.log('end time-------------->', y);

  //       console.log(
  //         'CMQ-duration on back---------------------------->',
  //         duration,
  //       );
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
  //         modulename: 'tchTtlQuiz',
  //         duration: duration,
  //         month: month,
  //         year: year,
  //         appVersion: app_versions,
  //         start: new Date(parseInt(value)),
  //         end: new Date(parseInt(y)),
  //       };

  //       console.log('CMQ body passed------------------------>', data);

  //       API.post(`savetimespentrecord/`, data)
  //         .then(response => {
  //           console.log(
  //             'timespent response in content CMQ--------------------------->',
  //             response.data,
  //           );
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
  //!----------------------Commented as per discussion since not required to spend more time on Quiz page-----------------
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
  //     console.log(
  //       '>>>>>>>>>>>>>>>>>>> Idle:  State change: appStateVisible= ',
  //       appStateVisible,
  //       '     nextAppState= ',
  //       nextAppState,
  //     );
  //     const x = AsyncStorage.getItem('stTime').then(value => {
  //       console.log('start time--------------------------->', value);
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
  //             console.log(
  //               'CMQ duration on idle------------------------------>',
  //               duration,
  //             );
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
  //               modulename: 'tchTtlQuiz',
  //               duration: duration,
  //               month: month,
  //               year: year,
  //               appVersion: app_versions,
  //               start: new Date(parseInt(value)),
  //               end: new Date(parseInt(closeTime)),
  //             };

  //             console.log('CMQ body passed here------------------>', data);

  //             API.post(`savetimespentrecord/`, data).then(response => {
  //               console.log(
  //                 'timespent response in CMQ content------------------------>',
  //                 response.data,
  //               );
  //             });

  //             console.log('stTime saved to AsyncStorage');
  //           })
  //           .catch(error => {
  //             console.log('error in timespent post------------->', error);
  //           });
  //       } else if (
  //         appStateVisible === 'background' &&
  //         nextAppState === 'active'
  //       ) {
  //         console.log('when Screen is on2 =====================>');
  //         setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
  //       } else if (appStateVisible === 'active' && nextAppState === 'active') {
  //         console.log('when Screen is on3 =====================>');
  //         AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
  //           .then(() => console.log('stTime saved to AsyncStorage1'))
  //           .catch(error =>
  //             console.error('Error saving stTime to AsyncStorage:', error),
  //           );
  //       }
  //     });

  //     setAppStateVisible(nextAppState);
  //   };

  //   AppState.addEventListener('change', handleAppStateChange);

  //   // Cleanup function
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTopics = async () => {
        setIsLoading(true);
        try {
          const response = await API.get(
            `getTransTtlQuizTopics/${userid}/${usertype}/teacher/od`,
          );
          // console.log('response common---->', response.data);

          // Store the data in AsyncStorage
          // await AsyncStorage.setItem('topics', JSON.stringify(response.data));

          setTopic(response.data);
          setIsLoading(false);
        } catch (error) {
          if (error.response.status === 504) {
            setIsLoading(false);
          } else if (error.response.status === 500) {
            console.error('Error is------------------->:', error);
            setIsLoading(false);
          } else {
            console.error('Error is------------------->:', error);
            setIsLoading(false);
          }
        }
      };

      fetchTopics();
    }, []),
  );
  useEffect(() => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD'); // Use 'YYYY-MM-DD' format

    // console.log('topic:', topic); // Debug: Check the content of the topic array

    const initialDisabledItems = topic
      .filter(
        item =>
          item.hasOwnProperty('expireOn') &&
          moment(item.expireOn).isSameOrBefore(currentDate, 'day'),
      )
      .map(item => item.topicId);

    // console.log('initialDisabledItems:', initialDisabledItems); // Debug: Check the content of initialDisabledItems

    setDisabledItems(initialDisabledItems);
  }, [topic]);

  const topicClicked = (item, index, c_type) => {
    // console.log('item------>', item);
    setCurrentIndex(index === currentIndex ? null : index);
    const body = {
      username,
      userid,
      usertype,
      managerid,
      managername,
      passcode,
      topicId: item.topicId,
      module: 'teacher',
      language: 'od',
      appVersion: app_versions,
    };
    // console.log('body-->', body);

    {
      item.viewStatus === 'unread'
        ? API.put(`updateTtlQuizViewStatus`, body)
            .then(response => {
              // console.log('viewstatus------>', response.data, response.status);
              if (response.status === 200) {
                navigation.navigate('commonmonthlyquiz', {
                  data: item,
                  data_type: c_type,
                });
              } else {
                Alert.alert('', `Something went wrong`, [
                  {text: 'Ok', onPress: () => null},
                ]);
              }
            })
            .catch(err => {
              // console.log(
              //   'err--->',
              //   err.response.status,
              //   err.response.data.msg,
              // );

              if (err.response.status === 400) {
                // Alert.alert('', `${err.response.data.msg}`, [
                Alert.alert('', `${'କୌଣସି ତଥ୍ୟ ନାହିଁ।'}`, [
                  {text: 'Ok', onPress: () => null},
                ]);
              } else {
                Alert.alert('Something went wrong', 'Please try again later', [
                  {
                    text: 'Ok',
                    // onPress: () => navigation.goBack(),
                    style: 'default',
                  },
                ]);
              }
              // else if (err.response.status === 200) {
              //   navigation.navigate('commonmonthlyquiz', {
              //     data: item,
              //     data_type: c_type,
              //   });
              // }
            })
        : item.viewStatus === 'read'
        ? navigation.navigate('commonmonthlyquiz', {
            data: item,
            data_type: c_type,
          })
        : null;
    }

    // API.get(`getTransTtlQuizQuestions/${userid}/${item.topicId}`).then(
    //   response => {
    //     console.log('response review---->', response.data);
    //     if (response.data.length > 0) {
    //       Alert.alert(' ', 'Quiz Already Submitted !', [
    //         {
    //           text: 'Review',
    //           // onPress: () => null,
    //           style: 'default',
    //         },
    //         {text: 'Ok', onPress: () => null, style: 'default'},
    //       ]);
    //     } else {
    //       navigation.navigate('commonmonthlyquiz', {
    //         data: item,
    //         data_type: c_type,
    //       });
    //     }
    //   },
    // );
  };

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const [baselineStatus, setBaselineStatus] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    API.get(`getteacherbaselinestatus/${userid}`).then(res => {
      // console.log('response--->>>>>>>>>>>>>>>>>>>>>>', res);
      if (res.data.status == 'success') {
        // console.log('check---->', res.data.baselinestatus);
        setBaselineStatus(res.data.baselinestatus);
        setIsLoading(false);
      }
      err => {
        this.serverDownMsg.presentToast();
      };
    });
  }, []);

  // console.log('topic length-----------', topic.length);
  // console.log('isLoading-------------', isLoading);

  return (
    <ScrollView>
      {/* baseline endline Buttons */}
      {isLoading ? (
        <View style={{flex: 1, alignSelf: 'center', top: '5%', right: 'auto'}}>
          <Loading />
        </View>
      ) : baselineStatus === 'complete' ? (
        <View style={styles.cardContainer}>
          <View style={[styles.card, {justifyContent: 'space-around'}]}>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => {
                navigation.navigate('teacherBaseline', {
                  type: 'baseline',
                });
              }}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Image/iconschoolbook.png')}
              />
              <Text style={styles.buttonText}>ମୂଲ୍ୟାଙ୍କନ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => {
                navigation.navigate('teacherBaseline', {
                  type: 'endline',
                });
              }}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Image/iconcontent-editclipboardtick.png')}
              />
              <Text style={styles.buttonText}>ଏଣ୍ଡ୍ ଲାଇନ୍</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {isLoading ? (
        <View style={{flex: 1, alignSelf: 'center', top: '20%', left: '25%'}}>
          <Loading />
        </View>
      ) : topic.length > 0 ? (
        topic.map((item, index) => {
          const isItemDisabled = disabledItems.includes(item.topicId);
          // const isItemExpired =
          //   moment(item?.expireOn)?.format('DD/MM/YYYY') ===
          //   moment(new Date()).format('DD/MM/YYYY');
          return (
            <View style={styles.cardContainer}>
              {item.completionStatus === 'complete' ? (
                <TouchableOpacity
                  key={item._id}
                  onPress={() =>
                    Alert.alert(`କୁଇଜ୍ ପୂର୍ବରୁ ଦାଖଲ ହୋଇସାରିଛି।`, '', [
                      {
                        text: 'Review',
                        onPress: () =>
                          navigation.navigate('commonmonthlyquizreview', {
                            topic: item,
                          }),
                        style: 'default',
                      },
                      {
                        text: 'OK',
                        onPress: () => null,
                      },
                    ])
                  }>
                  <View style={styles.card}>
                    <View style={styles.subModuContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <View>
                            <Text style={styles.subModule}>
                              {item.topicName}
                            </Text>
                            <Text style={styles.validityType}>
                              {item.validityType === 'limited'
                                ? item.validityType
                                : item.validityType === 'unlimited'
                                ? item.validityType
                                : null}
                            </Text>

                            {item.validityType === 'limited' ? (
                              // <Text style={styles.validityType}> Days remaining:{' '}   Math.round(
                              //   (new Date(item.expireOn) -
                              //     new Date()) /
                              //     864e5,
                              // )</Text>

                              <Text style={styles.validityType}>
                                Days remaining:{' '}
                                {Math.round(
                                  (new Date(item.expireOn) - new Date()) /
                                    864e5,
                                )}
                              </Text>
                            ) : null}
                          </View>

                          <View style={styles.icon}>
                            <AntDesign
                              name="checkcircle"
                              size={26}
                              style={{right: -40, position: 'absolute'}}
                              color={Colors.success}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : isItemDisabled ? (
                <TouchableOpacity
                  key={item.topicId}
                  disabled={isItemDisabled} // Set the 'disabled' property
                  style={[
                    // styles.card,

                    {borderRadius: 10},
                    isItemDisabled && styles.disabledCard, // Apply different styles for disabled items
                  ]}
                  onPress={() => {
                    topicClicked(item, index, 'quiz');
                  }}>
                  <View style={styles.card}>
                    <View style={styles.subModuContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                        }}>
                        <TouchableOpacity>
                          <View style={{flexDirection: 'row'}}>
                            <View>
                              <Text style={styles.subModule}>
                                {item.topicName}
                              </Text>
                              {item.validityType === 'unlimited' ? (
                                <Text style={styles.validityType}>
                                  {item.validityType}
                                </Text>
                              ) : item.validityType === 'limited' ? (
                                <Text style={styles.validityType}>
                                  {item.validityType}
                                </Text>
                              ) : null}

                              {item.validityType === 'unlimited' ? (
                                // <Text style={styles.validityType}>
                                //   {item.validityType}
                                // </Text>
                                console.log(
                                  '====================================',
                                )
                              ) : (
                                // <Text style={styles.validityType}>
                                //   Days remaining:{' '}
                                //   {item.validityType === 'limited'
                                //     ? // Math.ceil(
                                //       //   (new Date(dateObj).getTime() -
                                //       //     new Date(
                                //       //       new Date(item.expireOn),
                                //       //     ).setDate(
                                //       //       new Date(item.expireOn).getDate() - 2,
                                //       //     )) /
                                //       //     (1000 * 60 * 60 * 24),
                                //       // )
                                //       Math.round(
                                //         (new Date(item.expireOn) - new Date()) /
                                //           864e5,
                                //       )
                                //     : null}
                                // </Text>
                                <Text style={styles.validityType}>Expired</Text>
                              )}
                            </View>

                            {item.viewStatus === 'read' ? null : (
                              <View style={styles.icon}>
                                {/* <AnimatedMaterialIcons
                                  name="burst-new"
                                  size={55}
                                  color={Colors.red}
                                  style={{
                                    transform: [{rotate: spin}],
                                    marginLeft: 33,
                                    marginTop: -10,
                                  }}
                                /> */}
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={item.topicId}
                  onPress={() => {
                    topicClicked(item, index, 'quiz');
                  }}
                  style={styles.card}>
                  <View style={styles.subModuContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <View>
                          <Text style={styles.subModule}>{item.topicName}</Text>
                          {item.validityType === 'unlimited' ? (
                            <Text style={styles.validityType}>
                              {item.validityType}
                            </Text>
                          ) : item.validityType === 'limited' ? (
                            <Text style={styles.validityType}>
                              {item.validityType}
                            </Text>
                          ) : null}

                          {item.validityType === 'unlimited' ? (
                            // <Text style={styles.validityType}>
                            //   {item.validityType}
                            // </Text>
                            console.log('====================================')
                          ) : (
                            <Text style={styles.validityType}>
                              Days remaining:{' '}
                              {item.validityType === 'limited'
                                ? // Math.ceil(
                                  //   (new Date(dateObj).getTime() -
                                  //     new Date(
                                  //       new Date(item.expireOn),
                                  //     ).setDate(
                                  //       new Date(item.expireOn).getDate() - 2,
                                  //     )) /
                                  //     (1000 * 60 * 60 * 24),
                                  // )
                                  Math.round(
                                    (new Date(item.expireOn) - new Date()) /
                                      864e5,
                                  )
                                : null}
                            </Text>
                          )}
                        </View>

                        {item.viewStatus === 'read' ? null : (
                          <View style={styles.icon}>
                            <AnimatedMaterialIcons
                              name="burst-new"
                              size={50}
                              color={Colors.red}
                              style={{
                                transform: [{rotate: spin}],
                                // marginLeft: 13,
                                position: 'absolute',
                                marginTop: -10,
                              }}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      ) : (
        <Nocontents />
      )}
    </ScrollView>
  );
};

export default CommonMonthlyPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: SIZES.WindowWidth * 0.95,
    // borderWidth: 2,
    // borderColor: Colors.primary,
    // borderWidth: 2,
    // borderColor: Colors.primary,
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 50,
    marginTop: 12,
    paddingBottom: 20,
    paddingTop: 10,
  },
  moduleContainer: {
    flexDirection: 'row',
  },

  moduleText: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  // card: {
  //   backgroundColor: '#f0f0f0',
  //   padding: 16,
  //   borderRadius: 8,
  //   marginBottom: 16,
  // },
  disabledCard: {
    backgroundColor: '#adadad',
  },

  moduleTextRedeem: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    paddingLeft: 39,
  },
  cardContainer: {
    flexGrow: 1,
    // width: '100%',
    margin: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
  },

  avatarText: {
    color: Colors.white,

    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'sans-serif-medium',
  },
  subModuContainer: {
    padding: 10,

    // height: SIZES.WindowHeigth * 0.06,
  },
  roundView: {
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    padding: 10,
    width: 250,
  },
  subModule: {
    color: Colors.black,
    // letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: '600',
    width: 230,
    alignSelf: 'flex-start',
    // left: '-5%',
  },
  validityType: {
    color: Colors.black,
    // letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '600',
  },
  subModuleTopic: {
    color: '#a9a9a9',
    letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 11,
    fontWeight: '600',
  },
  topic: {
    // flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  tpoicText: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '800',
  },
  conquiz: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
    paddingBottom: 10,
    margin: 7,
    borderColor: Colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 16,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    alignSelf: 'center',
    color: '#000000',
    alignSelf: 'center',
    marginTop: 10,
  },
  tinyLogo: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    // padding: 15,
    alignSelf: 'center',
    // marginTop: 10,
  },
  // cards: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   padding: 10,
  // },

  cardButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
