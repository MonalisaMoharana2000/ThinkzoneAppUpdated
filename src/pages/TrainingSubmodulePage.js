import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Dimensions,
  BackHandler,
  AppState,
} from 'react-native';
import * as window from '../utils/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import Colors from '../utils/Colors';
import API from '../environment/Api';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useSelector, useDispatch} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useEffect} from 'react';
import {Color, FontFamily} from '../GlobalStyle';
import Modals from '../components/Modals';
import {useFocusEffect} from '@react-navigation/native';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';

import {fetchSubmodulesThunk} from '../redux_toolkit/features/training/TrainingThunk';

const TrainingSubmodulePage = ({navigation, route}) => {
  const [customModal, setCustomModal] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.user);

  console.log('====================================submodule', user);
  const {moduleName, moduleId, trainingType, moduleImage} = route.params;
  console.log(
    'ROUTESSSSS----------------->',
    // user,
    // moduleName,
    moduleId,
    trainingType,
    // moduleImage,
    // route.params,
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (!user || user.length === 0) {
          console.log('User data is not available');
          return;
        }

        const data = {
          userid: user[0]?.userid,
          usertype: user[0]?.usertype,
          trainingType: trainingType, // Correctly using trainingType
          moduleId: moduleId, // Uncomment moduleId
        };

        console.log('Fetching data for moduleId:', moduleId);

        try {
          const moduleResponse = await dispatch(fetchSubmodulesThunk(data));
          console.log('Module Response:', moduleResponse?.payload);
        } catch (err) {
          console.error('Error fetching module data:', err);
        }
      };

      fetchData();
    }, [user, moduleId, trainingType, dispatch]), // Added all necessary dependencies
  );
  let contentDetails = useSelector(state => state.TrainingSlice.techsubmodule);
  let loading = useSelector(state => state.TrainingSlice.loading);

  let userContentDetails = useSelector(
    state => state.TrainingSlice.userTraingDetails,
  );

  const [scontentDetails, setUsercontentDetails] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const newArr = contentDetails.map(item => {
        const d = item.topicData.map(item1 => {
          const neData = userContentDetails.find(
            item2 => item2?.topicid === item1.topicid,
          );
          // console.log('neData----->', neData);
          return {
            ...item1,
            ...neData,
          };
        });
        let count = 0;
        d.map(item2 => {
          // console.log(item2, 'item1');
          if (item2.topic_percentage == '100%') {
            count += 1;
          }
        });

        return {
          ...item,
          completed_topic: count,
          dat: d,
        };
      });

      setUsercontentDetails(newArr);
    }, [contentDetails, userContentDetails]),
  );

  // const user = useSelector(state => state.userdata.user);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [subModulesdata, setSubModulesData] = useState([]);
  const [language, setLanguage] = useState('od');
  const [topicIndex, setTopicIndex] = useState(null);

  // const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  const topicClicked = (topic, item, c_type) => {
    console.log(c_type, 'c_type--------', item);
    // setIsLoading(true);

    if (c_type === 'assignment') {
      if (item.contentStatus === 'incomplete') {
        Alert.alert('info', 'ଦୟାକରି Content ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ ।', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        // navigation.navigate('techAssignment', {
        //   data_type: c_type,
        //   data: topic,
        //   whole_data: item,
        // });
      } else {
        navigation.navigate('techAssignment', {
          data_type: c_type,
          data: topic,
          whole_data: item,
          trainingType: trainingType,
        });
      }
    } else {
      if (c_type === 'quiz1') {
        navigation.navigate('techcontent', {
          data: topic,
          whole_data: item,
          data_type: c_type,
          trainingType: trainingType,
          moduleImage: moduleImage,
        });
      } else if (c_type === 'content') {
        if (item.quiz1Status === 'incomplete') {
          Alert.alert('info', 'ଦୟାକରି ପୂର୍ବ ଜ୍ଞାନ ପରୀକ୍ଷା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          // navigation.navigate('techcontent', {
          //   data_type: c_type,
          //   data: topic,
          //   whole_data: item,
          // });
        } else {
          navigation.navigate('techcontent', {
            data_type: c_type,
            data: topic,
            whole_data: item,
            trainingType: trainingType,
            moduleImage: moduleImage,
          });
        }
      } else if (c_type === 'quiz2') {
        if (item.assignmentStatus === 'incomplete') {
          Alert.alert('info', 'ଦୟାକରି Assignment ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          // navigation.navigate('techcontent', {
          //   data: topic,
          //   whole_data: item,
          //   data_type: c_type,
          // });
        } else {
          navigation.navigate('techcontent', {
            data: topic,
            whole_data: item,
            data_type: c_type,
            trainingType: trainingType,
          });
        }
      } else if (c_type === 'gamified') {
        if (item.quiz2Status === 'incomplete') {
          Alert.alert('info', 'ଦୟାକରି Quiz2 ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          // navigation.navigate('techcontent', {
          //   data: topic,
          //   whole_data: item,
          //   data_type: c_type,
          // });
        } else {
          navigation.navigate('Games', {
            data: topic,
            whole_data: item,
            data_type: c_type,
            trainingType: trainingType,
          });
        }
      }
    }
  };
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      // setModal(true);

      // Handle any other conditions or logic before going back

      // Directly go back to the previous screen
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  //----------------Certificate----------------------
  const CertificateSection = ({navigation, route}) => {
    return (
      <View style={styles.certificateContainer}>
        <View style={styles.certificateCard}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.certificateText}>
                Great job! You can view your certificate by clicking here.
              </Text>
              <View style={{top: '30%'}}>
                <TouchableOpacity
                  style={styles.clickButton}
                  onPress={viewCertificate}>
                  <Text style={styles.clickText}>Click Here</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <Image
                // style={styles.shadow}
                // style={{height: 50, width: 50, top: '2%'}}
                source={require('../assets/Image/Ellipsec.png')}
              /> */}
            <Image
              style={{right: 28, height: 100, width: 100}}
              source={require('../assets/Image/contract.png')}
            />
          </View>
        </View>
      </View>
    );
  };

  const viewCertificate = () => {
    navigation.navigate('Certificate', {
      moduleName: route.params.moduleName,
      moduleId: route.params.moduleId,
    });
  };

  //--------------------------------------------------

  const handleToNextTopic = (topic, item, c_type) => {
    console.log('nexttopic1----->', topic);
    console.log('nexttopic2----->', item);
    console.log('nexttopic3----->', c_type);

    if (c_type === 'quiz2' && item.quiz2Status === 'complete') {
      const nextIncompleteTopic = topic.topicData.find(
        topics => topics.quiz1Status === 'incomplete',
      );

      const currentIndex = topic.topicData.findIndex(topics => topics === item);
      console.log('nextIncompleteTopic---->', currentIndex);

      if (currentIndex !== -1 && currentIndex < topic.topicData.length - 1) {
        const nextTopic = topic.topicData[currentIndex + 1];
        console.log('nextTopic---->', nextTopic);
        if (nextTopic.quiz1Status === 'incomplete') {
          navigation.navigate('techcontent', {
            data_type: 'quiz1',
            data: item,
            whole_data: nextTopic,
          });
        } else {
          // This is the last topic, show a different alert
          Alert.alert('', 'This is the last topic!', [
            {
              text: 'OK',
            },
          ]);
        }
      }

      // if (nextIncompleteTopic) {
    }
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [status, setstatus] = useState([]);
  // useEffect(() => {
  //   API.get(
  //     `getAllModulesWithMarks/${user[0].userid}/${user[0].usertype}/${moduleType}/od`,
  //   ).then(
  //     response => {
  //       setstatus(response.data);
  //       console.log('set=================>', setstatus);
  //       // setIsloading(false);
  //     },
  //     err => {
  //       //
  //     },
  //   );
  // }, []);

  //---------------------- Progress Status---------------------------

  // const topicValue = contentDetails[currentIndex]; //For my all completed values (working)
  // console.log(
  //   'completed topics---------------->',
  //   contentDetails[0]?.completedTopicsCount,
  // );

  // console.log(
  //   'Total topics---------------->',
  //   contentDetails[0]?.topicData?.length,
  // );

  // const totalCounts = [];
  // const totalTopic = topicValue?.map(item => {
  //   totalCounts.push(item.submoduleName);
  // });
  // console.log('route------------>', route);

  console.log('contentDetails----------------->', contentDetails);
  console.log('loading---->', loading);
  const allCompletedSubmodules = contentDetails.filter(
    item => item.submoduleIsComplete === true,
  );

  //Store Timespent data
  const [stTime, setStTime] = useState(null);
  console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  //for user back button press timespent calculation
  useEffect(() => {
    const resetStartTime = () => {
      console.log('calling reset start time function----------------------->');
      AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
        .then(() => console.log('stTime saved to AsyncStorage'))
        .catch(error =>
          console.error('Error saving stTime to AsyncStorage:', error),
        );
    };
    resetStartTime();
    const backAction = () => {
      console.log(
        '======================== 2 Set Start Time========================= ',
      );

      const x = AsyncStorage.getItem('stTime').then(value => {
        const y = new Date().getTime();
        console.log(
          '<<<<<<<<<<<<<<<<<<<<<<<<<< if Not Idle:  Statrt time: ',
          value,
        );
        const timeSpent = y - value;
        setGetStartTime(timeSpent);
        console.log(
          'ooooooooooooooooooooooooooooooooooooooo timeSpent--->',
          timeSpent,
        );

        const resetTimeSpent = timeSpent / 1000;
        console.log('resetTimeSpent--->', resetTimeSpent);
        const duration = Math.floor(resetTimeSpent);
        console.log('start time-------------->', value);
        console.log('x---------------------->', x);
        console.log('end time-------------->', y);

        console.log('duration--->', duration);
        const year = new Date().getFullYear();
        console.log('year--->', year);
        const month = new Date().getMonth() + 1;
        console.log('month--->', month);
        const data = {
          userid: user[0]?.userid,
          username: user[0]?.username,
          usertype: user[0]?.usertype,
          managerid: user[0]?.managerid,
          passcode: user[0]?.passcode,
          modulename: route.params.trainingType,
          moduleId: route.params.moduleId,
          duration: duration,
          month: month,
          year: year,
          appVersion: '2.1.1',
          start: new Date(parseInt(value)),
          end: new Date(parseInt(y)),
        };

        console.log('body sent (backhandler)---------------------->', data);

        API.post(`savetimespentrecord/`, data)
          .then(response => {
            console.log(
              'timespent response in content(success)------->',
              response.data,
            );
          })
          .catch(error => {
            console.log('error in timespent post------------->', error);
          });
      });
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //Store Timespent data
  // let stTime = new Date().getTime();

  //For Screen idle timespent calculation
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
  //               modulename: route.params.trainingType,
  //               moduleId: route.params.moduleId,
  //               duration: duration,
  //               month: month,
  //               year: year,
  //               appVersion: app_versions,
  //               start: new Date(parseInt(value)),
  //               end: new Date(parseInt(closeTime)),
  //             };

  //             console.log('body sent (idle)---------------------->', data);
  //             API.post(`savetimespentrecord/`, data)
  //               .then(response => {
  //                 console.log(
  //                   'timespent response in content(saved)------->',
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

  //     setAppStateVisible(nextAppState);
  //   };

  //   AppState.addEventListener('change', handleAppStateChange);

  //   // Cleanup function
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  //-------------------------------------------------------------------

  return (
    <>
      <ScrollView style={styles.container}>
        {loading ? (
          <Loading />
        ) : contentDetails?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.royalblue,
              padding: 17,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={23}
                style={{marginLeft: 8}}
                color="white"
              />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                marginLeft: 23,
                fontFamily: FontFamily.poppinsMedium,
              }}>
              {route.params.moduleName.toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <Image
              style={{
                width: windowWidth * 1,
                height: windowHeight * 0.5,
                flex: 1,
                alignSelf: 'center',
                top: 20,
              }}
              source={require('../assets/Image/nostudent.gif')}
              // resizeMode="contain"
            />
            <Text style={styles.loadingText}>No Submodule available</Text>
          </View>
        )}

        {contentDetails.length > 0 &&
        allCompletedSubmodules.length === contentDetails.length ? (
          <>
            <View>
              <CertificateSection />
            </View>
          </>
        ) : null}

        {contentDetails?.map((item, index) => {
          return (
            <View style={styles.cardContainer}>
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  setCurrentIndex(index === currentIndex ? null : index);
                }}>
                <View style={styles.card}>
                  <View style={[styles.subModuContainer]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 5,
                      }}>
                      <Image
                        style={{
                          width: 87,
                          height: 73,

                          left: 0,
                        }}
                        source={require('../assets/Image/submoduleGenericImage.jpg')}
                      />
                      <Text style={styles.subModule}>{item.submoduleName}</Text>
                    </View>
                    {/* <ProgressBar /> */}
                    <View style={{top: 14}}>
                      <ProgressBar
                        total={item.topicData.length}
                        complete={item.completedTopicsCount}
                      />
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Image
                        style={{width: 20, height: 20}}
                        source={require('../assets/Image/timers.png')}
                      />
                      <Text style={styles.subModuleTopic}>
                        {/* {item.submoduleDuration} min */}
                        {item.submoduleDuration} mins
                      </Text>

                      <Image
                        style={{width: 20, height: 20, marginLeft: 10}}
                        source={require('../assets/Image/coins.png')}
                      />
                      <Text style={styles.subModuleTopic}>
                        {/* {item.submoduleDuration} min */}
                        {/* {item.submoduleDuration}  */}
                        {item.submoduleCoins} coins
                      </Text>
                    </View>
                  </View>

                  <AntDesign
                    name="caretdown"
                    size={20}
                    color={Color.royalblue}
                    style={{top: -43, right: '5%'}}
                  />
                </View>
              </TouchableOpacity>

              {index === currentIndex && (
                <View style={styles.topic}>
                  {item.topicData.map(
                    (topic, toicindex) => (
                      console.log('topicdata-------------->', topic),
                      (
                        <View
                          style={[
                            {
                              width: '100%',
                              // height: '20%',
                              padding: 10,
                              borderRadius: 10,
                              borderColor: 'lightgrey',
                              borderWidth: 3,
                              marginBottom: 5,
                              // alignItems: 'center',
                              // height: '30%',
                              justifyContent: 'center',
                              backgroundColor:
                                toicindex === topicIndex
                                  ? 'white'
                                  : 'rgba(0, 0, 100, 0.1)',
                            },
                            styles.topicBox,
                            {
                              // backgroundColor:
                              //   topic.topicIsComplete == false
                              //     ? Color.royalblue // Completed topic background color
                              //     : Color.whiteShade, // Incomplete topic background color
                            },
                          ]}
                          key={topic._id}>
                          {/* <TouchableOpacity onPress={() => topicClicked(topic)}> */}

                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() =>
                              setTopicIndex(
                                toicindex === topicIndex ? null : toicindex,
                              )
                            }>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text style={[styles.tpoicText]} key={topic._id}>
                                {topic.topicName}
                              </Text>
                              {toicindex !== topicIndex &&
                              topic.topicIsComplete === false ? (
                                <View>
                                  <AntDesign
                                    name="caretright"
                                    size={14}
                                    style={{
                                      color: Color.royalblue,
                                      marginTop: 2,
                                    }}
                                    color="white"
                                  />
                                </View>
                              ) : toicindex === topicIndex &&
                                topic.topicIsComplete === false ? (
                                <View>
                                  <AntDesign
                                    name="caretup"
                                    size={14}
                                    style={{
                                      color: Color.royalblue,
                                      marginTop: 2,
                                      marginRight: 6,
                                    }}
                                    color="white"
                                  />
                                </View>
                              ) : toicindex === topicIndex &&
                                topic.topicIsComplete === true ? (
                                <View>
                                  <AntDesign
                                    name="caretup"
                                    size={14}
                                    style={{
                                      color: Color.royalblue,
                                      marginTop: 2,
                                      marginRight: 6,
                                    }}
                                    color="white"
                                  />
                                </View>
                              ) : null}
                            </View>
                            {toicindex !== topicIndex &&
                            topic.topicIsComplete === true ? (
                              // <View
                              //   style={{
                              //     top: 0,
                              //     left: '55%',

                              //     width: 80,

                              //     backgroundColor: Color.royalblue,

                              //     borderRadius: 5,
                              //     // padding: 3,
                              //     height: 22,
                              //   }}>
                              //   <Text
                              //     style={{
                              //       fontSize: 11,
                              //       color: 'white',

                              //       textTransform: 'capitalize',
                              //       top: '10%',
                              //       fontFamily: FontFamily.poppinsMedium,

                              //       fontWeight: '900',
                              //       textAlign: 'center',
                              //     }}>
                              //     completed
                              //   </Text>
                              // </View>
                              <Image
                                style={{
                                  marginLeft: 5,
                                  top: -1,
                                  width: 22,
                                  height: 22,
                                }}
                                source={require('../assets/Image/tick-circle.png')}
                              />
                            ) : null}

                            {topic.topic_percentage == '100%' ? (
                              <View>
                                <Ionicons
                                  name="checkmark-done-circle"
                                  color={Colors.success}
                                  size={22}
                                />
                                <Text>
                                  {topic.score}/{topic.totalmark}
                                </Text>
                              </View>
                            ) : (
                              <></>
                            )}
                          </TouchableOpacity>

                          {toicindex === topicIndex && (
                            //   console.log(
                            //   'check topic index--------->',
                            //   toicindex,
                            //   topicIndex,
                            // ),
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  // flexWrap: 'wrap',
                                }}>
                                {topic.quiz1Status == 'complete' ? (
                                  (console.log('topic review---->', topic),
                                  (
                                    <TouchableOpacity
                                      onPress={() =>
                                        navigation.navigate('reviewquiz', {
                                          data: topic,
                                          data_type: 'quiz1',
                                        })
                                      }
                                      style={[
                                        styles.conquiz,
                                        {
                                          backgroundColor: '#FFC0CB',
                                          margin: 6,
                                          borderColor: '#ff99c2',
                                          borderWidth: 1.2,
                                        },
                                      ]}>
                                      <View>
                                        <Image
                                          style={{
                                            marginLeft: '80%',
                                            // top: '1%',
                                            width: 22,
                                            height: 22,
                                          }}
                                          source={require('../assets/Image/tick-circle.png')}
                                        />
                                        <TouchableOpacity
                                          style={{
                                            flexDirection: 'row',
                                            // padding: 60,
                                            height: '100%',
                                          }}
                                          onPress={() =>
                                            navigation.navigate('reviewquiz', {
                                              data: topic,
                                              data_type: 'quiz1',
                                            })
                                          }>
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                            }}>
                                            <Image
                                              style={{
                                                top: '6%',
                                                width: '50%',
                                                height: '50%',
                                                left: '-10%',
                                              }}
                                              source={require('../assets/Image/Quiz1.png')}
                                            />
                                            <View>
                                              <Text
                                                style={{
                                                  top: '8%',
                                                  fontSize: 18,
                                                  marginLeft: '5%',
                                                  color: 'black',
                                                }}>
                                                ପୂର୍ବ ଜ୍ଞାନ
                                              </Text>
                                              <Text
                                                style={{
                                                  top: '8%',
                                                  fontSize: 18,
                                                  marginLeft: '10%',
                                                  color: 'black',
                                                }}>
                                                ପରୀକ୍ଷା
                                              </Text>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    </TouchableOpacity>
                                  ))
                                ) : (
                                  <TouchableOpacity
                                    style={[
                                      styles.conquiz, //
                                      {
                                        backgroundColor: '#FFC0CB',
                                        margin: 6,
                                        borderColor: '#ff99c2',
                                        borderWidth: 1.2,
                                      },
                                    ]}
                                    onPress={() =>
                                      topicClicked(item, topic, 'quiz1')
                                    }>
                                    <View>
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: 'row',
                                          // padding: 60,
                                          height: '100%',
                                        }}
                                        onPress={() =>
                                          topicClicked(item, topic, 'quiz1')
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '18%',
                                              width: '50%',
                                              height: '50%',
                                              left: '-14%',
                                            }}
                                            source={require('../assets/Image/Quiz1.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '25%',
                                                fontSize: 18,
                                                marginLeft: '5%',
                                                color: 'black',
                                              }}>
                                              ପୂର୍ବ ଜ୍ଞାନ
                                            </Text>
                                            <Text
                                              style={{
                                                top: '25%',
                                                fontSize: 18,
                                                marginLeft: '10%',
                                                color: 'black',
                                              }}>
                                              ପରୀକ୍ଷା
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                )}

                                {topic.contentStatus == 'complete' ? (
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'content')
                                    }
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: '#F5DEB3',
                                        borderColor: '#BDB76B',
                                      },
                                    ]}>
                                    <View>
                                      {item.topicData.quiz1Status ===
                                        'incomplete' && (
                                        <Modals
                                          visible={customModal}
                                          heading={
                                            'Please Complete the content or quiz1.'
                                          }
                                          backgroundColor={Colors.white}
                                          onpressok={closeModal}
                                          okstatus={true}
                                        />
                                      )}
                                      <Image
                                        style={{
                                          marginLeft: '80%',
                                          top: '-1%',
                                          width: 22,
                                          height: 22,
                                        }}
                                        source={require('../assets/Image/tick-circle.png')}
                                      />
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: 'row',
                                          // padding: 60,
                                          height: '100%',
                                        }}
                                        onPress={() =>
                                          topicClicked(item, topic, 'content')
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '-4%',
                                            }}
                                            source={require('../assets/Image/Content.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '10%',
                                                fontSize: 18,
                                                marginLeft: '15%',
                                                // fontFamily: 'sans-serif-medium',
                                                width: '80%',
                                                color: 'black',
                                              }}>
                                              Content
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'content')
                                    }
                                    style={{
                                      borderRadius: 5,
                                      marginTop: 5,
                                      padding: 10,
                                      paddingBottom: 10,
                                      width: '48%',
                                      height: 120,
                                      backgroundColor: '#F5DEB3',
                                      borderColor: '#BDB76B',
                                      borderWidth: 1,
                                    }}>
                                    <View>
                                      <TouchableOpacity
                                        onPress={() =>
                                          topicClicked(item, topic, 'content')
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '10%',
                                            }}
                                            source={require('../assets/Image/Content.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '50%',
                                                fontSize: 18,
                                                marginLeft: '14%',
                                                // fontFamily: 'sans-serif-medium',
                                                color: 'black',
                                              }}>
                                              Content
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                )}

                                {/* <View style={styles.conquiz}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        topicClicked(topic, 'assignment')
                                      }>
                                      <Text>Assignment</Text>
                                    </TouchableOpacity>
                                  </View> */}
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  // flexWrap: 'wrap',
                                }}>
                                {topic.assignmentStatus == 'complete' ? (
                                  <TouchableOpacity
                                    onPress={() =>
                                      navigation.navigate('assignmentpreview', {
                                        data: topic,
                                      })
                                    }
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: '#f2f2f2',
                                        margin: 6,
                                        borderColor: '#bfbfbf',
                                      },
                                    ]}>
                                    <View>
                                      <Image
                                        style={{
                                          marginLeft: '82%',
                                          // top: '0.5%',
                                          width: 22,
                                          height: 22,
                                        }}
                                        source={require('../assets/Image/tick-circle.png')}
                                      />
                                      <TouchableOpacity
                                        style={{flexDirection: 'row'}}
                                        onPress={() =>
                                          navigation.navigate(
                                            'assignmentpreview',
                                            {
                                              data: topic,
                                            },
                                          )
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '-5%',
                                              left: '-10%',
                                            }}
                                            source={require('../assets/Image/Assignment.png')}
                                          />

                                          <Text
                                            style={{
                                              top: '17%',
                                              fontSize: 14,
                                              marginLeft: '-13%',
                                              fontFamily: 'sans-serif-medium',
                                              color: 'black',
                                            }}>
                                            Assignment
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: '#f2f2f2',
                                        margin: 6,
                                        borderColor: '#bfbfbf',
                                      },
                                    ]}
                                    onPress={() =>
                                      topicClicked(item, topic, 'assignment')
                                    }>
                                    <View>
                                      <TouchableOpacity
                                        style={{flexDirection: 'row'}}
                                        onPress={() =>
                                          topicClicked(
                                            item,
                                            topic,
                                            'assignment',
                                          )
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '25%',
                                              left: '-10%',
                                            }}
                                            source={require('../assets/Image/Assignment.png')}
                                          />

                                          <Text
                                            style={{
                                              top: '50%',
                                              fontSize: 14,
                                              marginLeft: '-14%',
                                              fontFamily: 'sans-serif-medium',
                                              color: 'black',
                                            }}>
                                            Assignment
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                )}
                                {topic.quiz2Status == 'complete' ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      navigation.navigate('reviewquiz', {
                                        data: topic,
                                        data_type: 'quiz2',
                                      });
                                    }}
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: '#80aaff',
                                        borderColor: '#3377ff',
                                      },
                                    ]}>
                                    <View>
                                      <Image
                                        style={{
                                          marginLeft: '82%',
                                          top: '1%',
                                          width: 22,
                                          height: 22,
                                        }}
                                        source={require('../assets/Image/tick-circle.png')}
                                      />
                                      <TouchableOpacity
                                        style={{flexDirection: 'row'}}
                                        // onPress={() =>
                                        //   navigation.navigate('reviewquiztech', {
                                        //     data: topic,
                                        //     data_type: 'quiz2',
                                        //   })
                                        // }
                                        onPress={() => {
                                          navigation.navigate('reviewquiz', {
                                            data: topic,
                                            data_type: 'quiz2',
                                          });
                                        }}

                                        // onPress={() =>
                                        //   ToastAndroid.show(
                                        //     'Quiz Review under development. ',
                                        //     ToastAndroid.SHORT,
                                        //   )
                                        // }
                                      >
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '10%',
                                              left: '-25%',
                                            }}
                                            source={require('../assets/Image/Quiz2.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '18%',
                                                fontSize: 18,
                                                marginLeft: '-10%',
                                                color: 'black',
                                              }}>
                                              ପ୍ରାପ୍ତ ଜ୍ଞାନ
                                            </Text>
                                            <Text
                                              style={{
                                                top: '18%',
                                                fontSize: 18,
                                                marginLeft: '10%',
                                                color: 'black',
                                              }}>
                                              ପରୀକ୍ଷା
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{
                                      borderWidth: 1,
                                      borderRadius: 5,
                                      marginTop: 5,
                                      padding: 10,
                                      backgroundColor: '#80aaff',
                                      borderColor: '#3377ff',
                                      paddingBottom: 10,
                                      width: '48%',
                                      height: 120,
                                    }}
                                    onPress={() =>
                                      topicClicked(item, topic, 'quiz2')
                                    }>
                                    <View>
                                      <TouchableOpacity
                                        onPress={() =>
                                          topicClicked(item, topic, 'quiz2')
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              top: '23%',
                                              left: '-5%',
                                            }}
                                            source={require('../assets/Image/Quiz2.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '40%',
                                                fontSize: 18,
                                                marginLeft: '-11%',
                                                color: 'black',
                                              }}>
                                              ପ୍ରାପ୍ତ ଜ୍ଞାନ
                                            </Text>
                                            <Text
                                              style={{
                                                top: '40%',
                                                fontSize: 18,
                                                marginLeft: '8%',
                                                color: 'black',
                                              }}>
                                              ପରୀକ୍ଷା
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  // flexWrap: 'wrap',
                                  marginLeft: 6,
                                }}>
                                {topic.gamifiedStatus == 'complete' ? (
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'gamified')
                                    }
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: 'lightgreen',
                                        borderColor: ' green',
                                      },
                                    ]}>
                                    <View>
                                      <Image
                                        style={{
                                          marginLeft: '82%',
                                          // top: '1%',
                                          width: 22,
                                          height: 22,
                                        }}
                                        source={require('../assets/Image/tick-circle.png')}
                                      />
                                      <TouchableOpacity
                                        style={{flexDirection: 'row'}}
                                        // onPress={() =>
                                        //   navigation.navigate('reviewquiztech', {
                                        //     data: topic,
                                        //     data_type: 'quiz2',
                                        //   })
                                        // }
                                        // onPress={() => {
                                        //   navigation.navigate('reviewquiz', {
                                        //     data: topic,
                                        //     data_type: 'quiz2',
                                        //   });
                                        // }}

                                        // onPress={() =>
                                        //   ToastAndroid.show(
                                        //     'Quiz Review under development. ',
                                        //     ToastAndroid.SHORT,
                                        //   )
                                        // }
                                      >
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              height: 50,
                                              width: 50,
                                              top: '40%',
                                              marginLeft: '1%',
                                            }}
                                            source={require('../assets/Image/gameslogo.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '80%',
                                                fontSize: 15,
                                                marginLeft: '9%',
                                                // fontFamily: 'sans-serif-medium',
                                                color: 'black',
                                              }}>
                                              Gamified
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={{
                                      borderWidth: 1,
                                      borderRadius: 5,
                                      marginTop: 5,
                                      padding: 10,
                                      backgroundColor: 'lightgreen',
                                      borderColor: 'green',
                                      paddingBottom: 10,
                                      width: '48%',
                                      height: 120,
                                    }}
                                    // onPress={() =>
                                    // topicClicked(item, topic, 'gamified') //Commented until released
                                    // ToastAndroid.show(
                                    //   'This Module is under development. It will be LIVE soon.',
                                    //   ToastAndroid.SHORT,
                                    // )
                                    // }
                                  >
                                    <View>
                                      <TouchableOpacity
                                        onPress={
                                          () =>
                                            topicClicked(
                                              item,
                                              topic,
                                              'gamified',
                                            ) //Commented until released
                                          // ToastAndroid.show(
                                          //   'This Module is under development. It will be LIVE soon.',
                                          //   ToastAndroid.SHORT,
                                          // )
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Image
                                            style={{
                                              height: 50,
                                              width: 50,
                                              top: '40%',
                                              marginLeft: '1%',
                                            }}
                                            source={require('../assets/Image/gameslogo.png')}
                                          />
                                          <View>
                                            <Text
                                              style={{
                                                top: '80%',
                                                fontSize: 15,
                                                marginLeft: '9%',
                                                fontFamily: 'sans-serif-medium',
                                                color: 'black',
                                              }}>
                                              Gamified
                                            </Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </>
                          )}
                        </View>
                      )
                    ),
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default TrainingSubmodulePage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.ghostwhite,
    flex: 1,
    // width: SIZES.WindowWidth * 0.95,
    // borderWidth: 2,
    // borderColor: Color.royalblue,
    // alignSelf: 'center',
    // borderRadius: 5,
    // elevation: 10,
    // marginBottom: 20,
    // marginTop: 10,
  },
  moduleContainer: {
    padding: 10,
  },

  moduleText: {
    color: Colors.black,
    letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '600',
  },
  cardContainer: {
    // flexGrow: 1,
    width: window.WindowWidth * 0.93,
    // margin: 15,
    marginTop: 10,
    marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 10,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    // justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    // right: 10,
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
    alignItems: 'center',
    paddingLeft: 10,
    marginRight: 14,
  },
  subModule: {
    color: Colors.black,
    letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 1,
    width: 160,
    paddingBottom: 10,
    top: '5%',
    paddingLeft: '5%',
    height: 100,
  },
  subModuleTopic: {
    color: '#a9a9a9',
    letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 11,
    fontWeight: '600',
    top: 3,
    left: 2,
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
    marginTop: 5,
    padding: 10,
    borderColor: Color.royalblue,
    paddingBottom: 10,
    width: '48%',
    height: 120,
  },
  certificateContainer: {
    flexGrow: 1,
    width: '96%',
    // margin: 15,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginLeft: 20,
    // marginRight: 8,
    borderRadius: 10,
    elevation: 10,
    right: 10,
  },
  certificateCard: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  certificateText: {
    fontSize: 13,
    color: '#333333',
    alignSelf: 'center',
    top: 20,
    // textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
  },
  certificateLogo: {
    width: 164.81,
    height: 110.5,
    left: '60%',
    position: 'absolute', // Set the position to relative
    // Add a shadow with reduced opacity
    shadowColor: Color.royalblue, // Adjust opacity by changing the last value (0.3)
    top: '2%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1, // You can adjust the shadow opacity here
    shadowRadius: 4,
  },
  clickButton: {
    backgroundColor: Color.royalblue,
    marginLeft: 20,
    borderRadius: 20,
    width: window.WindowWidth * 0.22,
  },
  clickText: {
    FontFamily: FontFamily.poppinsMedium,
    color: '#333333',
    textAlign: 'center',
    color: 'white',
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 13,
  },
  loadingText: {
    color: '#595F65',
    fontSize: 20,
    // top: 50,
    marginTop: 73,
    fontFamily: FontFamily.poppinsMedium,
    paddingBottom: 40,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: 370,
    // paddingLeft: 20,
    // paddingRight: 40,
    textAlign: 'center',
    alignSelf: 'center',
    bottom: 0,
    fontWeight: 'bold',
  },
});
