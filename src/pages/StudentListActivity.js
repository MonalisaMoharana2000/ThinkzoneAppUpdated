import React, {
  useEffect,
  useState,
  useRef,
  startTransition,
  useCallback,
} from 'react';
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
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Colors from '../utils/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import * as window from '../utils/dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import {showMessage, hideMessage} from 'react-native-flash-message';
import NewQuizTemplate from '../components/NewQuizTemplate';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Api from '../environment/Api';
import Foundation from 'react-native-vector-icons/Foundation';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {app_versions} from './Home';

const StudentListActivity = ({route, navigation}) => {
  //   const user = useSelector(state => state.UserSlice?.user?.data?.resData);
  const user = useSelector(state => state.UserSlice.user);
  console.log('object');
  const coin = useSelector(state => state?.UserSlice?.rewards);
  const userCoins = coin[0]?.coins;
  const {username, userid, managerid, managername, usertype, passcode} =
    user[0];
  console.log(' user[0];------------->', user[0]);
  const [studentList, setStudentList] = useState([]);
  const [perStudent, setPerStudent] = useState({});
  // console.log('studentList---->', studentList);
  const [loading, setLoading] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [topic, setTopic] = useState([]);
  console.log('tolpicQuiz---------->', topic);
  const [quizClass, setQuizClass] = useState('');
  const [status, setStatus] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkUrl, setCheckUrl] = useState([]);
  // console.log('status---->', status);
  const [isLoading, setIsLoading] = useState(false);
  // const topicId = route.params?.topicId;
  // const {topicName} = route.params?.topicName;
  const {topicId, topicName} = route.params;
  console.log(route.params, 'topicIdsss-------------------->');
  const program = route.params.program;
  const subject = route.params?.subject;
  const activityType = route.params?.activityType;

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      let apiEndpoint = `getAllStudsForAssess/${userid}`;
      if (activityType) {
        apiEndpoint += `/${activityType}`;
      }
      Api.get(apiEndpoint)
        .then(response => {
          console.log('response--------->', response.data, response.status);
          setLoading(true);
          if (response.data.length > 0) {
            setStudentList(response.data);
            setLoading(false);
          } else {
            setStudentList(response.data);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching student data:', error);
        });
    }, [userid, program]),
  );

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

  useEffect(() => {
    const fetchData = () => {
      if (isLoading) {
      } else if (studentList && studentList?.length > 0) {
        showMessage({
          message: `ଏପର୍ଯ୍ୟନ୍ତ... ଆପଣ ${
            studentList ? studentList?.length : 0
          } ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କର ପଞ୍ଜୀକରଣ କରିଅଛନ୍ତି । ହାସଲ କରିଥିବା କଏନ: ${userCoins} ଆପଣ ଏହିପରି ଅନ୍ୟଶିକ୍ଷାର୍ଥୀଙ୍କୁ ପଞ୍ଜୀକରଣ କରି ଗୁଣାତ୍ମକ ଶିକ୍ଷଣର ସୁଯୋଗ ଦେଇପାରିବେ ।`,
          type: 'info',
          backgroundColor: Colors.success,
          duration: 5000,
        });

        return () => hideMessage();
      }
    };

    fetchData();
  }, [studentList]);

  // Student Activity Function starts
  //fOR IMAGE UPLOAD
  const [imageUrls, setImageUrls] = useState({});
  // console.log('imageUrls--->', imageUrls);
  const handleImageSelected = (image, questionId) => {
    setImageUrls(prevImageUrls => ({
      ...prevImageUrls,
      [questionId]: image,
    }));
    // console.log('check--->', image, questionId);
    setTopicQuizData(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          // console.log('checkid--->', item.questionId, questionId);
          // Update the answer URL for the specific questionId
          return {...item, answer: image};
        }
        return item;
      });
    });
  };

  const [modal, setModal] = useState(false);

  //For TextInput Starts
  const handleAnswerChange = useCallback(
    (questionOrder, newAnswer) => {
      // console.log('index, newAnswer----->', questionOrder, newAnswer);
      setTopic(prevData => {
        const newData = [...prevData];
        const questionIndex = newData.findIndex(
          item => item.questionId === questionOrder,
        );
        if (questionIndex !== -1) {
          newData[questionIndex].answer = newAnswer;
        }
        // console.log('newData:', newData);
        return newData;
      });
    },
    [setTopic],
  );

  //For OPtional Question i.e 4,3,2 Options starts
  const handleOptionSelect = (questionId, selectedOption) => {
    // console.log('selected OPtion:', questionId, selectedOption);
    setTopic(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, selectedOption};
        }
        return item;
      });
      return newData;
    });
  };
  //For optional question Ends

  //For Multi Option starts
  const handleOptionSelectMulti = (questionId, selectedOption) => {
    // console.log('check----->', questionId, selectedOption);
    setTopic(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          // Initialize selectedOption as an empty array if it's undefined
          const updatedSelectedOptions = item.selectedOption || [];

          // Check if selectedOption is already in the array
          const isSelected = updatedSelectedOptions.includes(selectedOption);

          // Update the array based on isSelected
          const updatedOptions = isSelected
            ? updatedSelectedOptions.filter(option => option !== selectedOption) // Remove the option
            : [...updatedSelectedOptions, selectedOption]; // Add the option

          return {...item, selectedOption: updatedOptions};
        }
        return item;
      });
      return newData;
    });
  };

  //For Multi Option Ends

  //For AUDIO rECORDS s3 url starts

  const closeModals = (url, questionId, keys) => {
    // console.log('check url----->', url, questionId, keys);
    setCheckUrl(keys);
    setTopic(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  const handleActivityNavigate = async item => {
    try {
      console.log('------------------>', item, topicId);

      const response = await Api.get(
        `getTransStudActQuiz/${userid}/${item.studentid}/formative/${topicId}`,
      );

      console.log(
        'check------------------>',
        response,
        topicId,
        item.studentid,
        userid,
      );

      const responseData =
        response.status === 204
          ? Alert.alert('Alert !!', `${'Quizzes will be upload soon .'}`, [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ])
          : response?.data?.map(x => x.quizData);
      const quizStatus = response?.data[0]?.quizStatus;
      setStatus(quizStatus);

      if (item.studentid === 0 && item.userid === 0) {
        setQuizModal(false);
        setModalVisible(false);
      }
      //// commented this part since not needed at the moment
      // else if (!item.otp_isverified) {
      //   setPerStudent({});
      //   Alert.alert(`${'Please Verify Your Student ।'}`, '', [
      //     {
      //       text: 'Ok',
      //       onPress: () => navigation.navigate('studentlist'),
      //       style: 'default',
      //     },
      //   ]);
      // }
      else if (quizStatus === 'complete') {
        Alert.alert('Alert !!', `${' Quizzes already Submitted .'}`, [
          {
            text: 'Ok',
            style: 'default',
          },
        ]);
      } else if (response.data[0]?.quizClass > item.class) {
        setPerStudent({});
        Alert.alert(
          'Warning !!',
          `${'ଆପଣ ଉପର ଶ୍ରେଣୀର ମୁଲ୍ୟାଙ୍କନ ଦେଇପାରିବେ ନାହିଁ ।'}`,
          [
            {
              text: 'Ok',
            },
          ],
        );
      } else if (response.data[0]?.quizData.length === 0) {
        Alert.alert('Alert !!', `${'No Quizzes are available .'}`, [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ]);
      } else {
        console.log(
          'response checkkkk3---->',
          // response.data,
          response.data.map(x => x.quizData),
          // userid,
          // item.studentid,
          // topicId,
        );
        console.log(
          'response checkkkk7---->',
          // response.data,
          response.data[0]?.quizData,
          // userid,
          // item.studentid,
          // topicId,
        );
        setPerStudent(item);
        setTopic([].concat(...responseData));

        setIsLoading(false);
        setQuizModal(true);

        setModalVisible(true);
        setQuizClass(response.data[0]?.quizClass);
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
  };
  const azureUpload = async (uploadResult, questionId) => {
    console.log('uploadResult======>', uploadResult);
    console.log('questionId==========>', questionId);
    setTopic(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: uploadResult}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };
  //Fot Audio Records s3 url ends

  const handleQuizSubmit = async () => {
    const checkDataLengthOption = topic.filter(x => x.selectedOption?.length);
    const checkDataLengthAnswer = topic.filter(x => x.answer?.length);

    if (
      topic?.length ===
      checkDataLengthOption.length + checkDataLengthAnswer.length
    ) {
      const quiz1Marks = topic.filter(item => {
        if (
          item.correctOption?.length != 0 &&
          item.correctOption?.length === item.selectedOption?.length &&
          item.correctOption.every(option =>
            item.selectedOption.includes(option),
          )
        ) {
          return true;
        }

        {
          return false;
        }
      });
      const body = {
        username,
        userid,
        managerid,
        managername,
        usertype,
        passcode,
        studentid: perStudent.studentid,
        studentname: perStudent.studentname,
        activityType,
        language: 'od',
        program: perStudent.program,
        class: parseInt(perStudent.class),
        subject: subject,
        topicId,
        topicName,
        quizClass,
        quizData: topic,
        securedMarks: quiz1Marks.length,
        totalMarks: checkDataLengthOption.length,
        appVersion: app_versions,
        assessType: 'formative',
        quizStatus: 'complete',
        completionStatus: true,
      };

      console.log('====================================', body);
      // Assuming 'API.post' is a valid function for making an HTTP POST request.
      const confirmSubmit = await new Promise(resolve => {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
          'ଆପଣ କୁଇଜ୍ ର ଉତ୍ତର ଦାଖଲ କରିବାକୁ ସୁନିଶ୍ଚିତ ଅଛନ୍ତି ତ?',
          [
            {
              text: 'NO',
              onPress: () => resolve(false),
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => resolve(true),
            },
          ],
        );
      });
      if (confirmSubmit) {
        try {
          const response = await Api.post(`saveTransStudActQuiz`, body);
          // console.log(
          //   '====================================response',
          //   response.data,
          // );
          if (response.status === 201) {
            // console.log('stud---->', response.status);
            setModal(true);
            setPerStudent({});
          } else {
            Alert.alert(`Status:${response.status},`, ``, [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          }

          // console.log('res.data====>', response.data);
        } catch (err) {
          // console.log('status error----->', err.response.data.err);
          if (err.response.status === 500) {
            Alert.alert(
              `Status:${err.response.status}, ${err.response.data.msg}`,
              `${err.response.data.err}`,
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ],
            );
          }
        }
      }
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', [
        {text: 'OK', onPress: () => null},
      ]);
    }
  };
  const [quizModal, setQuizModal] = useState(false);

  const handleBackButton = () => {
    if (quizModal) {
      setQuizModal(false);
      return true; // Prevent default back button behavior
    }
    return false; // Allow default back button behavior
  };
  const back = async () => {
    Alert.alert(
      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
      'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {text: 'Ok', onPress: () => setQuizModal(false), style: 'default'},
      ],
    );
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // Clean up event listeners when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);
  const [resetKey, setResetKey] = useState(0);
  const backs = async () => {
    setModal(false);
    setQuizModal(false);
    setResetKey(prevKey => prevKey + 1);
  };

  // Student Activity Function ends
  // console.log('------------------>', perStudent.studentid);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <>
      <ScrollView>
        {loading ? (
          <Loading />
        ) : (
          <>
            {studentList?.length > 0 ? (
              <>
                <View
                  style={{
                    width: window.WindowWidth * 0.92,
                    alignSelf: 'center',
                    // top: 50,
                    margin: 10,
                    top: '1%',
                    backgroundColor: Color.ghostwhite,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Color.royalblue,
                  }}>
                  <Text style={styles.text1}>ଶିକ୍ଷାର୍ଥୀ ଚୟନ କରନ୍ତୁ </Text>
                </View>
                {studentList.length > 0 ? (
                  <>
                    <Text
                      style={{
                        // left: 120,
                        fontSize: 17,
                        color: Colors.darkslategray_200,
                        fontFamily: FontFamily.poppinsMedium,
                        fontWeight: '500',
                        // textTransform: 'capitalize',
                        color: Color.dimgray_100,
                        // top: 10,
                        marginBottom: '3%',
                        height: window.WindowHeigth * 0.03,
                        left: '34%',
                        marginTop: '4%',
                      }}>
                      {activityType?.toUpperCase()} Students
                    </Text>
                  </>
                ) : null}
                {studentList.map((item, index) => {
                  console.log('====================================', item);
                  console.log();
                  console.log('====================================');
                  return (
                    <View
                      style={{
                        width: window.WindowWidth * 0.9,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderColor: '#666666',
                        borderWidth: 0.5,
                        alignSelf: 'center',
                        margin: 10,
                        top: '1%',
                      }}>
                      <TouchableOpacity
                        key={item._id}
                        onPress={() => handleActivityNavigate(item)}>
                        <View style={styles.card}>
                          <View style={styles.subModuContainer}>
                            {/* <View style={{alignSelf: 'flex-end'}}> */}

                            {/* </View> */}
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <View>
                                <View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      // justifyContent: 'space-evenly',
                                      // width: '100%',
                                    }}>
                                    {/* <Image
                                          style={{
                                            // marginLeft: 5,
                                            // top: -1,
                                            width: 22,
                                            height: 22,
                                            position: 'absolute',
                                            // right: 0,
                                            left: 0,
                                          }}
                                          source={require('../assets/Image/users.png')}
                                        /> */}
                                    <FontAwesome
                                      name="user-circle"
                                      size={35}
                                      color={Color.royalblue}
                                    />
                                    <Text
                                      style={[
                                        styles.name,
                                        {maxWidth: window.WindowWidth * 0.9},
                                      ]}>
                                      {item.studentname}
                                    </Text>
                                    {/* {status === 'complete' && (
                                          <View
                                            style={{
                                              // position: 'absolute',
                                              right: 0,
                                              paddingRight: 50,
                                            }}>
                                            <Image
                                              style={{
                                                // marginLeft: 5,
                                                // top: -1,
                                                width: 22,
                                                height: 22,
                                                position: 'absolute',
                                                right: 0,
                                              }}
                                              source={require('../assets/Image/tick-circle.png')}
                                            />
                                          </View>
                                        )} */}
                                  </View>
                                  <View
                                    style={{
                                      width: '100%',
                                      marginRight: '53%',
                                    }}>
                                    <Text style={styles.pogram}>
                                      Program -
                                      <Text
                                        style={{textTransform: 'uppercase'}}>
                                        {item.program}
                                      </Text>
                                    </Text>
                                    <View
                                      style={
                                        {
                                          // alignSelf: 'flex-end',
                                          // alignItems: 'flex-end',
                                        }
                                      }></View>
                                  </View>

                                  {item.program == 'pge' ? (
                                    <Text style={styles.class}>
                                      Class - {item.class}
                                    </Text>
                                  ) : (
                                    <Text style={styles.class}>
                                      Level - {item.class}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          </View>
                          <Entypo
                            name="chevron-thin-right"
                            size={25}
                            color={Color.royalblue}
                            style={{marginRight: '6%'}}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </>
            ) : studentList.length === 0 ? (
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Image
                  source={require('../assets/Image/cat-playing-animation.gif')}
                  style={{
                    top: 20,
                    alignSelf: 'center',
                  }}
                />
                <View style={{}}>
                  <Text style={styles.record}>
                    It looks like there's nothing here. Please Register Students
                    !
                  </Text>
                </View>
              </View>
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
                  resizeMode="contain" // You can change the resizeMode as per your requirement
                />
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* StudentActivityQuiz starts */}

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
                },
              ]}
              source={require('../assets/Image/https_coin.gif')}
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
              ଆପଣ ସଫଳତାର ସହ ଶିକ୍ଷାର୍ଥୀର ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରିଥିବାରୁ
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{''} ୨</Text>
              ଟି କଏନ ହାସଲ କରିଛନ୍ତି l
            </Text>
            {/* <Text
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
                  ଆପଣ ସଫଳତାର ସହ ଶିକ୍ଷାର୍ଥୀର ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରିଛନ୍ତି l
                </Text> */}
            {/* <TouchableOpacity
                  onPress={() => backs()}
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
                </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() =>
                navigation.navigate('myachievement', {
                  type: 'myachievement',
                })
              }
              style={[
                styles.bu,
                {
                  marginTop: 40,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,

                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: 'white',
                }}>
                Check Reward
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => backs()}
              style={[
                styles.bu,
                {
                  marginTop: 20,
                  backgroundColor: Color.royalblue,
                  width: window.WindowWidth * 0.5,
                  borderWidth: 1,
                  borderColor: Color.royalblue,
                },
              ]}>
              <Text
                style={{
                  fontSize: 16,

                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: 'white',
                }}>
                Okay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container}>
        {status === 'complete' ? null : (
          <>
            {topic?.length > 0 ? (
              <Modal
                animationType="slide"
                onRequestClose={() => back()}
                transparent={true}
                visible={quizModal}>
                <View style={[styles.centeredView]}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        height: window.WindowHeigth * 1,
                        top: -10,
                        width: window.WindowWidth * 2,
                      },
                    ]}>
                    <View
                      style={{
                        backgroundColor: '#0060ca',
                        height: 66,
                        width: window.WindowWidth * 1.1,

                        marginLeft: -20,
                        marginTop: -50,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          marginTop: 15,
                          alignSelf: 'flex-start',
                          left: '15%',
                          top: 5,
                          fontWeight: 'bold',
                        }}>
                        {topicName}
                      </Text>
                    </View>
                    <View style={{alignSelf: 'center', right: '27%'}}>
                      {topic?.length > 0 ? (
                        <NewQuizTemplate
                          azureUpload={azureUpload}
                          handleSaveAssessment={handleQuizSubmit}
                          topicQuizData={topic}
                          handleAnswerChange={handleAnswerChange}
                          handleOptionSelect={handleOptionSelect}
                          closeModal={closeModals}
                          loading={loading}
                          handleOptionSelectMulti={handleOptionSelectMulti}
                          imageUrl={imageUrls}
                          onImageSelected={handleImageSelected}
                        />
                      ) : (
                        <Nocontents />
                      )}
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null}
          </>
        )}
      </ScrollView>

      {/* StudentActivityQuiz Ends */}
    </>
  );
};

export default StudentListActivity;

const styles = StyleSheet.create({
  record: {
    color: '#595F65',
    fontSize: 13,
    // top: 50,
    marginTop: 160,
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
  },

  subModuContainer: {
    padding: 10,
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
    fontFamily: FontFamily.poppinsMedium,
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
  name: {
    fontSize: 19,
    color: '#000',
    fontFamily: FontFamily.poppinsMedium,
    textTransform: 'capitalize',
    paddingBottom: 5,
    maxWidth: '100%',
    paddingLeft: 20,
  },
  pogram: {
    fontSize: 11,
    color: Colors.darkslategray_200,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textTransform: 'capitalize',
    // fontSize: FontSize.size_smi,
    // left: '-2%',
    color: Color.dimgray_100,
    paddingTop: 5,
    paddingBottom: 5,
    // position: 'absolute',
    alignSelf: 'center',
    right: '6%',
    // right: 125,
    // marginTop: 10,
  },
  register: {
    paddingTop: 30,
    left: '25%',
    fontSize: 11,
    color: Color.darkslategray_200,
    color: Color.dimgray_100,
    fontSize: FontSize.size_smi,
    textTransform: 'capitalize',
  },
  class: {
    marginTop: 5,
    fontSize: 11,
    color: Colors.darkslategray_200,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: Colors.dimgray_100,
    left: 55,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    flexGrow: 1,
    padding: 16,
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
  image: {
    height: 90,
    width: 90,
    borderRadius: 75,
    // alignSelf: 'left',
    marginTop: 10,
    left: '2.4%',
  },
  text1: {
    // flexDirection: 'row',
    // marginTop: 15,
    textAlign: 'center',
    // alignSelf: 'center',
    // backgroundColor: Color.white,
    top: '17.5%',
    paddingBottom: 20,
    // paddingTop: 15,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 20,

    color: 'black',
    fontFamily: FontFamily.poppinsSemibold,
  },
});
