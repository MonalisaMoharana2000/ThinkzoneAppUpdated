import React, {useEffect, useState, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
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
  AppState,
  PanResponder,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Colors from '../utils/Colors';
import * as SIZES from '../utils/dimensions';

import {useSelector, useDispatch} from 'react-redux';

import * as window from '../utils/dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropdownComponent from '../components/DropdownComponent';
import {
  PinchGestureHandler,
  State,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Api from '../environment/Api';
import Norecord from '../components/Norecord';
import moment from 'moment';
import Foundation from 'react-native-vector-icons/Foundation';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
const AnimatedMaterialIcons = Animated.createAnimatedComponent(Foundation);
const StudentAssessmentPage = ({navigation, route}) => {
  const appState = useRef(AppState.currentState);
  const user = useSelector(state => state.UserSlice.user);

  const data = route.params.data;
  console.log('data--->', data);
  const {studentid, program, studentname, phone} = route.params.data;
  console.log('check------->', route.params.data);

  const {username, userid, managerid, managername, usertype, passcode} =
    user[0];

  const [topic, setTopic] = useState([]);
  // console.log('topic-->', topic);
  const [isLoading, setIsLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  console.log('studentList--------------', studentList);
  const [perStudent, setPerStudent] = useState();
  const [disabledItems, setDisabledItems] = useState([]);
  // console.log('perStudent--->', perStudent.id);
  const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
    useState(600);
  const timerId = useRef(false);
  useEffect(() => {
    // resetInactivityTimeout();
  }, []);

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

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const body = {
            userid,
            usertype,
            language: 'od',
            program,
            quizClass: data.class,
          };

          console.log('body----->', body);

          const response = await Api.post(
            // `getTransTtlQuizTopics/${userid}/${usertype}/student/${program}/${data.class}/${studentid}/od`,
            // `getMasterStudActTopics/${program}/${usertype}/od/summative/${data.class}/${program}`,
            `getTransStudActTopics`,
            body,
          );
          console.log('response--------->', response.data, program, data.class);
          setIsLoading(false);
          setTopic(response.data);
        } catch (error) {
          if (error.response.status === 413) {
            console.log('error is---------------->', error);
            setIsLoading(false);
            Alert.alert('The entity is too large !');
          } else if (error.response.status === 504) {
            console.log('Error is--------------------->', error);
            setIsLoading(false);
            Alert.alert('Gateway Timeout: The server is not responding!');
          } else if (error.response.status === 500) {
            console.error('Error is------------------->:', error);
            setIsLoading(false);
            Alert.alert(
              'Internal Server Error: Something went wrong on the server.',
            );
          } else {
            console.error('Error is------------------->:', error);
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }, []),
  );

  useEffect(() => {
    // Check if topic is defined and is an array
    if (!Array.isArray(topic)) {
      // Handle the case where topic is not an array (you might set default values or handle it accordingly)
      return;
    }

    const currentDate = moment().format('YYYY-MM-DD');

    // Debug: Check the content of the topic array
    // console.log('topic:', topic);

    const initialDisabledItems = topic
      .filter(
        item =>
          item?.expireOn &&
          moment(item.expireOn).isSameOrBefore(currentDate, 'day'),
      )
      .map(item => item.topicId);

    // Debug: Check the content of initialDisabledItems
    console.log('initialDisabledItems:', initialDisabledItems);

    setDisabledItems(initialDisabledItems || []);
  }, [topic]);

  const topicClicked = async (item, index, c_type) => {
    console.log('item------>', item, c_type);

    const body = {
      username,
      userid,
      managerid,
      managername,
      usertype,
      passcode,
      module: 'student',
      topicId: item.topicId,
      language: 'od',
      program: program,
      class: data.class,
      studentid: studentid,
      studentname: studentname,
    };
    console.log('body-->', body);
    navigation.navigate('studentassessmentdetails', {
      data: item,
      data_type: c_type,
      studentData: data,
    });
    // {
    //   item.viewStatus === 'unread'
    //     ? Api.put(`updateTtlQuizViewStatus`, body)
    //         .then(response => {
    //           console.log('viewstatus------>', response.data, response.status);
    //           if (response.status === 200) {
    //             navigation.navigate('studentassessmentdetails', {
    //               data: item,
    //               data_type: c_type,
    //               studentData: data,
    //             });
    //           }
    //         })
    //         .catch(err => {
    //           console.log('err--->', err);

    //           if (err.response.status === 406) {
    //             Alert.alert(
    //               'ଧ୍ୟାନ ଦିଅନ୍ତୁ ।',
    //               `ଏଠାରେ କୁଇଜ୍ Upload ହୋଇନାହିଁ |`,
    //               [{text: 'Ok', onPress: () => null}],
    //             );
    //           } else if (err.response.status === 500) {
    //             Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ ।', `ଏଠାରେ ଏକ ସର୍ଭର ତ୍ରୁଟି ଅଛି |`, [
    //               {text: 'Ok', onPress: () => null},
    //             ]);
    //           } else {
    //             Alert.alert(
    //               `Status ${err.response.status}`,
    //               `Error: ${err.response.data.msg}`,
    //               [{text: 'Ok', onPress: () => null}],
    //             );
    //           }
    //           // if (err.response.status === 400) {
    //           //   Alert.alert(
    //           //     `${err.response.status}`,
    //           //     `${err.response.data.msg}`,
    //           //     [{text: 'Ok', onPress: () => null}],
    //           //   );
    //           // } else {
    //           //   Alert.alert(
    //           //     `${err.response.status}`,
    //           //     `${err.response.data.msg}`,
    //           //     [{text: 'Ok', onPress: () => null}],
    //           //   );
    //           // }
    //           // else if (err.response.status === 200) {
    //           //   navigation.navigate('commonmonthlyquiz', {
    //           //     data: item,
    //           //     data_type: c_type,
    //           //   });
    //           // }
    //         })
    //     : item.viewStatus === 'read'
    //     ? navigation.navigate('studentassessmentdetails', {
    //         data: item,
    //         data_type: c_type,
    //         studentData: data,
    //       })
    //     : null;
    // }

    // try {
    //   const response = await Api.get(
    //     `getTransTtlQuizQuestions/${userid}/${item.topicId}`,
    //   );

    //   console.log('response.data.====>', response.data);
    //   if (response.data.length > 0) {
    //     // Alert.alert(' ', `Assesment Already Submitted`, [
    //     //   {text: 'Ok', onPress: () => null, style: 'default'},
    //     // ]);
    //     console.log('check');
    //   } else {

    //   }
    // } catch (err) {
    //   console.log('err--->', err);
    // }
  };
  const [zoomScale, setZoomScale] = useState(1);
  const imageScale = useRef(new Animated.Value(1)).current;

  const onPinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: imageScale}}],
    {useNativeDriver: false},
  );

  const onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setZoomScale(zoomScale * event.nativeEvent.scale);
      imageScale.setValue(1);
    }
  };
  const panX = useRef(new Animated.Value(0)).current;

  const onPanGestureEvent = Animated.event(
    [{nativeEvent: {translationX: panX}}],
    {useNativeDriver: false},
  );

  const onPanHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(panX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleStudentReview = item => {
    console.log('clickedreview---->', item);
    // navigation.navigate('studentreview', {
    //   data: item,
    // }),

    navigation.navigate('studentreview', {data: item});
  };

  return (
    <>
      <ScrollView>
        {isLoading ? (
          <Loading />
        ) : (
          <ScrollView style={styles.container}>
            {topic?.length > 0 ? (
              topic?.map((item, index) => {
                console.log('====================================item', item);

                const isItemDisabled = disabledItems.includes(item.topicId);
                return (
                  // <View style={styles.cardContainer}>
                  <TouchableOpacity style={styles.cardContainer}>
                    {item.completionStatus === 'complete' ? (
                      <TouchableOpacity
                        key={item._id}
                        onPress={() =>
                          Alert.alert(
                            'କୁଇଜ୍ ପୂର୍ବରୁ ଦାଖଲ ହୋଇସାରିଛି',
                            '',
                            [
                              {
                                text: 'OK',
                                onPress: () => {},
                              },
                              {
                                text: 'Review',
                                onPress: () => handleStudentReview(item),
                              },
                            ],
                            {cancelable: false},
                          )
                        }>
                        <View style={styles.card}>
                          <View style={styles.subModuContainer}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}>
                              {/* write on press function for moving to quiz components */}
                              <TouchableOpacity>
                                <View style={{flexDirection: 'row'}}>
                                  <View>
                                    <Text
                                      style={styles.subModule}
                                      onPress={() =>
                                        Alert.alert(
                                          'କୁଇଜ୍ ପୂର୍ବରୁ ଦାଖଲ ହୋଇସାରିଛି',
                                          '',
                                          [
                                            {
                                              text: 'OK',
                                              onPress: () => {}, // Empty onPress handler to close the alert
                                            },
                                            {
                                              text: 'Review',
                                              onPress: () =>
                                                handleStudentReview(item), // Call the review function
                                            },
                                          ],
                                          {cancelable: false}, // Prevent the alert from being dismissed by tapping outside of it
                                        )
                                      }>
                                      {item.topicName}
                                    </Text>
                                    {/* <Text style={styles.validityType}>
                                      {item.validityType === 'limited'
                                        ? item.validityType
                                        : item.validityType === 'unlimited'
                                        ? item.validityType
                                        : null}
                                    </Text>

                                    {item.validityType === 'limited' ? (
                                      <Text style={styles.validityType}>
                                        Days remaining:{' '}
                                        {Math.round(
                                          (new Date(item.expireOn) -
                                            new Date()) /
                                            864e5,
                                        )}
                                      </Text>
                                    ) : null} */}
                                  </View>

                                  <View style={styles.icon}>
                                    <AntDesign
                                      name="checkcircle"
                                      size={20}
                                      style={{marginLeft: 25}}
                                      color={Colors.success}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : isItemDisabled ? (
                      <TouchableOpacity
                        key={item.topicId}
                        disabled={isItemDisabled} // Set the 'disabled' property
                        style={[
                          styles.card,

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
                                    {/* {item.validityType === 'unlimited' ? (
                                      <Text style={styles.validityType}>
                                        {item.validityType}
                                      </Text>
                                    ) : item.validityType === 'limited' ? (
                                      <Text style={styles.validityType}>
                                        {item.validityType}
                                      </Text>
                                    ) : null} */}

                                    {/* {item.validityType === 'unlimited' ? (
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
                                      <Text style={styles.validityType}>
                                        Expired
                                      </Text>
                                    )} */}
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
                        onPress={() => {
                          topicClicked(item, index, 'quiz');
                        }}
                        key={item.topicId}>
                        <View style={styles.card}>
                          <View style={styles.subModuContainer}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  topicClicked(item, index, 'quiz'); // Trigger navigation when the text is clicked
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <View>
                                    <Text style={styles.subModule}>
                                      {item.topicName}
                                    </Text>
                                    {/* {item.validityType === 'unlimited' ? (
                                      <Text style={styles.validityType}>
                                        {item.validityType}
                                      </Text>
                                    ) : item.validityType === 'limited' ? (
                                      <Text style={styles.validityType}>
                                        {item.validityType}
                                      </Text>
                                    ) : null} */}

                                    {/* {item.validityType === 'unlimited' ? (
                                      // <Text style={styles.validityType}>
                                      //   {item.validityType}
                                      // </Text>
                                      console.log(
                                        '====================================',
                                      )
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
                                              (new Date(item.expireOn) -
                                                new Date()) /
                                                864e5,
                                            )
                                          : null}
                                      </Text>
                                    )} */}
                                  </View>

                                  {/* {item.viewStatus === 'read' ? null : (
                                    <View style={styles.icon}>
                                      <AnimatedMaterialIcons
                                        name="burst-new"
                                        size={55}
                                        color={Colors.red}
                                        style={{
                                          transform: [{rotate: spin}],
                                          marginLeft: 33,
                                          marginTop: -10,
                                        }}
                                      />
                                    </View>
                                  )} */}
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                  // </View>
                );
              })
            ) : (
              <Nocontents />
            )}
            {/* {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{justifyContent: 'center', alignSelf: 'center'}}
            />
          ) : topic.length > 0 ? (
            
          ) : (
            <View style={{flex: 1}}>
              <Image
                style={{
                  width: windowWidth * 1, // You can adjust the scaling factor as needed
                  height: windowHeight * 0.5, // You can adjust the scaling factor as needed
                  flex: 1,
                  alignSelf: 'center',
                  top: 20,
                }}
                source={require('../assets/Image/nostudent.gif')}
                //resizeMode="contain" // You can change the //resizeMode as per your requirement
              />
            </View>
          )} */}
          </ScrollView>
        )}
      </ScrollView>
    </>
  );
};

export default StudentAssessmentPage;

const styles = StyleSheet.create({
  image: {
    width: window.WindowWidth * 1,
    height: window.WindowHeigth * 0.1,
    flex: 1,
    alignSelf: 'center',
    top: 20,
  },
  // container: {
  //   backgroundColor: Colors.white,
  //   width: SIZES.WindowWidth * 0.95,
  //   // borderWidth: 2,
  //   // borderColor: Colors.primary,
  //   // borderWidth: 2,
  //   // borderColor: Colors.primary,
  //   alignSelf: 'center',
  //   // flex: 1,
  //   borderRadius: 5,
  //   elevation: 10,
  //   marginBottom: 50,
  //   marginTop: 12,
  //   paddingBottom: 20,
  //   paddingTop: 10,
  // },
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
    alignItems: 'center',
    padding: 10,
  },
  subModule: {
    color: Colors.black,
    // letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: '600',
    width: 200,
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
});
