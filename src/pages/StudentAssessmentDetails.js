import React, {useState, useEffect, useRef, useCallback} from 'react';
import Cameraicon from 'react-native-vector-icons/Feather';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '@env';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {S3} from 'aws-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  Image,
  ActivityIndicator,
  Share,
  StatusBar,
  TextInput,
  Button,
  Animated,
  ToastAndroid,
  Dimensions,
  BackHandler,
  AppState,
} from 'react-native';
import ButtomSheet from '../components/BottomSheet';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Api from '../environment/Api';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Norecord from '../components/Norecord';
import NewQuizTemplate from '../components/NewQuizTemplate';
import Loading from '../components/Loading';
import AudioAssessment from '../components/AudioAssessment';
import Nocontents from '../components/Nocontents';
const audioRecorderPlayer = new AudioRecorderPlayer();
const HEIGHT = Dimensions.get('window').height;
const StudentAssessmentDetails = ({navigation, route}) => {
  const data_quiz = route.params.data;
  const textInputRef = useRef(null);
  console.log('data_quiz----->', data_quiz);
  const modalHeight = HEIGHT * 1;
  const studentData = route.params.studentData;
  // console.log('studentData----->', studentData);
  const {phone, studentname, studentid} = studentData;
  const user = useSelector(state => state.userdata.user?.resData);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const {topicId, topicName} = data_quiz;
  console.log('topicId---->', topicId);
  const [topicQuizData, setTopicQuizData] = useState([]);
  // console.log('topicQuizData--->', topicQuizData);
  const [isLoading, setIsLoading] = useState(false);
  const [text, onChangeText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSelectedOption, setCurrentSelectedOption] = useState();
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [quizModal, setQuizModal] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );
  const modalRef = useRef(null);
  // console.log('currentSelectedOption------->', currentSelectedOption);
  const [data, setData] = useState();
  const [studentAudio, setStudentAudio] = useState(null);
  console.log('studentAudio------>', studentAudio);
  const [imageUrls2, setImageUrls2] = useState({});
  console.log('imageUrls2---->', imageUrls2);
  const [videoUrls2, setVideoUrls2] = useState({});
  //Store Timespent
  const [stTime, setStTime] = useState(null);
  // console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  // console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  //for user back button press timespent calculation
  useEffect(() => {
    const resetStartTime = () => {
      console.log('calling reset start time function----------------------->');
      AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
        .then(() => console.log('stTime saved to AsyncStorage'))
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
        console.log('duration--->', duration);
        const year = new Date().getFullYear();
        console.log('year--->', year);
        const month = new Date().getMonth() + 1;
        console.log('month--->', month);
        const data = {
          userid: userid,
          username: username,
          usertype: usertype,
          managerid: managerid,
          passcode: passcode,
          modulename: 'tchTtlQuiz',
          duration: duration,
          month: month,
          year: year,
          start: new Date(parseInt(value)),
          end: new Date(parseInt(y)),
        };

        Api.post(`savetimespentrecord/`, data)
          .then(response => {
            console.log('timespent response in content------->', response.data);
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
              // Alert.alert(
              //   'An unexpected error occurred. Please try again later.',
              // );
            }
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
  useEffect(() => {
    AsyncStorage.getItem('stTime')
      .then(value => {
        if (value) {
          console.log('value--->', value);
          //setStTime(parseInt(value, 10));
        } else {
          setStTime(new Date().getTime());
        }
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
    const handleAppStateChange = nextAppState => {
      console.log(
        '>>>>>>>>>>>>>>>>>>> Idle:  State change: appStateVisible= ',
        appStateVisible,
        '     nextAppState= ',
        nextAppState,
      );
      const x = AsyncStorage.getItem('stTime').then(value => {
        value = value ? value : new Date().getTime();
        if (appStateVisible === 'active' && nextAppState === 'background') {
          console.log('>>>>>>>>>>>>>>>>>>> Idle:  Statrt time: ', value);
          const closeTime = new Date().getTime();
          console.log('>>>>>>>>>>>>>>>>>>> Idle:  End time time: ', closeTime);

          const dur = (closeTime - value) / 1000;
          console.log('>>>>>>>>>>>>>>>>>>>>>> 1 timeSpent--->', dur);
          AsyncStorage.setItem('stTime', closeTime.toString()) //clTime.toString()
            .then(() => {
              const duration = Math.floor(dur);
              console.log('duration--->', duration);
              const year = new Date().getFullYear();
              console.log('year--->', year);
              const month = new Date().getMonth() + 1;
              console.log('month--->', month);
              const data = {
                userid: userid,
                username: username,
                usertype: usertype,
                managerid: managerid,
                passcode: passcode,
                modulename: 'tchTtlQuiz',
                duration: duration,
                month: month,
                year: year,
                start: new Date(parseInt(value)),
                end: new Date(parseInt(closeTime)),
              };

              Api.post(`savetimespentrecord/`, data)
                .then(response => {
                  console.log(
                    'timespent response in content------->',
                    response.data,
                  );
                })
                .catch(error => {
                  if (error.response.status === 413) {
                    console.log('error is---------------->', error);
                    Alert.alert('The entity is too large !');
                  } else if (error.response.status === 504) {
                    console.log('Error is--------------------->', error);
                    Alert.alert(
                      'Gateway Timeout: The server is not responding!',
                    );
                  } else if (error.response.status === 500) {
                    console.error('Error is------------------->:', error);
                    Alert.alert(
                      'Internal Server Error: Something went wrong on the server.',
                    );
                  } else {
                    console.error('Error is------------------->:', error);
                    // Alert.alert(
                    //   'An unexpected error occurred. Please try again later.',
                    // );
                  }
                });

              console.log('stTime saved to AsyncStorage');
            })
            .catch(error =>
              console.error('Error saving stTime to AsyncStorage:', error),
            );
        } else if (
          appStateVisible === 'background' &&
          nextAppState === 'active'
        ) {
          setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
        } else if (appStateVisible === 'active' && nextAppState === 'active') {
          console.log('when Screen is on =====================>');
          AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
            .then(() => console.log('stTime saved to AsyncStorage1'))
            .catch(error =>
              console.error('Error saving stTime to AsyncStorage:', error),
            );
        }
      });

      setAppStateVisible(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   Api.get(`getMasterTtlQuizQuestions/${user[0].usertype}/od/${topicId}`).then(
  //     response => {
  //       console.log('response---->', response.data);
  //       let data = response.data[0]?.quizData.map(element => {
  //         return {...element, active: '', selectedOption: null};
  //       });
  //       // console.log('response---->', data);
  //       setTopicQuizData(data);
  //       setIsLoading(false);
  //     },
  //   );
  // }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await Api.get(
      `getTransStudActQuiz/${userid}/${studentData.studentid}/summative/${topicId}`,
    );
    console.log('audio response----->', userid, studentData.studentid, topicId);
    if (response.status === 200) {
      console.log('audio response----->', response.data);
      setStudentAudio(response.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //fOR IMAGE UPLOAD
  const [imageUrls, setImageUrls] = useState({});
  console.log('imageUrls--->', imageUrls);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused
  //     const backAction = () => {
  //       // setModal(true);

  //       Alert.alert(
  //         'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
  //         'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
  //         [
  //           {
  //             text: 'Cancel',
  //             onPress: () => null,
  //             style: 'default',
  //           },
  //           {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
  //         ],
  //       );
  //       return true;
  //     };

  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       backAction,
  //     );

  //     return () => backHandler.remove();
  //   }, []),
  // );

  const closeModal = body => {
    setOpenRecordModal(false);
    setShowCard1(true);
    setShowCard2(false);
    setShowCard3(false);
  };

  const [skillQuiz, setSkillQuiz] = useState([]);
  console.log('skillQuiz---->', skillQuiz);
  const onOpenModal = skill => {
    console.log('skillsssss------>', skill);
    setSkillQuiz(skill?.quizData);
  };

  //For Multi Option Ends

  //For AUDIO rECORDS s3 url starts

  const onAnswerSet = (url, questionId, status) => {
    console.log('questionId----->', questionId, status);

    setSkillQuiz(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          // Create a new object with the updated answer
          return {
            ...item,
            answer: url,
            answered: 'yes',
          };
        }
        return item;
      });
    });
  };

  const onSkipAnswer = (questionId, status) => {
    console.log('questionId----->', questionId, status);
    setSkillQuiz(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          // Create a new object with the updated answer
          return {
            ...item,
            answer: status,
            answered: status,
          };
        }
        return item;
      });
    });
  };

  // console.log('newData--->', newData);
  // console.log('updatedQuizData--->', updatedQuizData);

  //Fot Audio Records s3 url ends
  //S3 url delete from bucket
  const handleDelete = async () => {
    navigation.goBack();
  };

  const back = async () => {
    setImageUrls2([]);
    setVideoUrls2({});
  };
  const topicNameHeader = route.params.data.topicName.toUpperCase();

  //For multiple Questions answer
  const handleAnswerChange2 = useCallback(
    (questionOrder, newAnswer, item) => {
      // setAnserReset(item.answer);
      setSkillQuiz(prevData => {
        const newData = [...prevData];
        const questionIndex = newData.findIndex(
          item => item.questionId === questionOrder,
        );
        if (questionIndex !== -1) {
          newData[questionIndex].answer = newAnswer;
          // setAnserReset('');
        }
        console.log('newData:', newData);
        return newData;
      });
    },
    [setStudentAudio],
  );

  //For OPtional Question i.e 4,3,2 Options starts Quiz2
  const handleOptionSelect2 = (updateItem, questionId) => {
    console.log('questionId1----->', questionId);
    console.log('questionId2----->', updateItem);

    setSkillQuiz(prevData => {
      return prevData.map(quizItem => {
        if (quizItem.questionId === questionId) {
          return {
            ...quizItem,
            selectedOption: updateItem.selectedOption,
            answered: 'yes',
          };
        }
        return quizItem;
      });
    });
  };

  const closeModals2 = (url, questionId) => {
    setStudentAudio(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url, answered: 'yes'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  //For Multi Option starts Quiz2
  const handleOptionSelectMulti2 = (updatedOption, questionId) => {
    setSkillQuiz(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          // Initialize selectedOption as an empty array if it's undefined
          const updatedSelectedOptions = item.selectedOption || [];

          // Check if selectedOption is already in the array
          const isSelected = updatedSelectedOptions.includes(updatedOption);

          // Update the array based on isSelected
          const updatedOptions = isSelected
            ? updatedSelectedOptions.filter(option => option !== updatedOption) // Remove the option
            : [...updatedSelectedOptions, updatedOption]; // Add the option
          console.log('page---->', updatedOptions);
          return {...item, selectedOption: updatedOption, answered: 'yes'};
        }
        return item;
      });
      return newData;
    });
  };

  const handleChangeText = (questionId, updatedText) => {
    console.log('textchange--->', questionId, updatedText);
    setSkillQuiz(prevData => {
      return prevData.map(quizItem => {
        if (quizItem.questionId === questionId) {
          return {
            ...quizItem,
            answer: updatedText,
            answered: 'yes',
          };
        }
        return quizItem;
      });
    });
  };

  const handleImageSelected2 = (image, questionId) => {
    console.log('image, questionId---->', image, questionId);
    setImageUrls2(prevImageUrls => ({
      ...prevImageUrls,
      [questionId]: image,
      answered: 'yes',
    }));

    setSkillQuiz(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          console.log('checkid--->', item.questionId, questionId);
          // Update the answer URL for the specific questionId
          return {...item, answer: image, answered: 'yes'};
        }
        return item;
      });
    });
  };

  const handleVideoSelected2 = (image, questionId) => {
    console.log('image, questionId---->', image, questionId);
    // setVideoUrls2(prevImageUrls => ({
    //   ...prevImageUrls,
    //   [questionId]: image,
    //   answered: 'yes',
    // }));

    setSkillQuiz(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          console.log('checkidpage--->', item.questionId, questionId);
          // Update the answer URL for the specific questionId
          return {...item, answer: image, answered: 'yes'};
        }
        return item;
      });
    });
  };

  const handleSubmit = async (skill, setOpenRecordModal) => {
    console.log('check skill---->', skill, setOpenRecordModal);

    const answeredLength = skillQuiz.filter(
      item => item.answered === 'skip' || item.answered === 'yes',
    );
    // const skipLength = skillQuiz.filter(item => item.answered === 'skip');
    // const yesLength = skillQuiz.filter(item => item.answered === 'yes');
    console.log('answerLength----->', answeredLength.length, skillQuiz.length);

    if (answeredLength.length === skillQuiz.length) {
      const body = {
        userid,
        usertype,
        managerid,
        managername,
        passcode,
        studentid,
        studentname,
        contactnumber: user[0].contactnumber,
        assessType: 'summative',
        activityType: studentData?.program,
        topicId: topicId,
        topicName: topicName,
        skillId: skill?.skillId,
        skillName: skill?.skillName,
        quizClass: studentData.class,
        class: studentData.class,
        quizData: skillQuiz,
        program: studentData?.program,
        username,
        transLength: skill?.transLength,
        quizStatus: 'complete',
        completionStatus: true,
        subject: skill?.subject,
      };
      console.log('body--->', body);
      console.log('skillQuiz--->', skillQuiz);
      try {
        const response = await Api.post(`saveTransStudActQuiz`, body);
        console.log('responses1----->', response.data, response.status);
        if (response.status === 200 || response.status === 201) {
          Alert.alert('', 'Skill Saved Successfully !', [
            // {
            //   text: 'Cancel',
            //   onPress: () => null,
            //   style: 'default',
            // },
            {
              text: 'Ok',
              onPress: () => fetchData(),
              style: 'default',
            },
          ]);
        } else {
          console.log('err-->', response, response.status);
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
    } else {
      const body = {
        userid,
        usertype,
        managerid,
        managername,
        passcode,
        studentid,
        studentname,
        contactnumber: user[0].contactnumber,
        assessType: 'summative',
        activityType: studentData?.program,
        topicId: topicId,
        topicName: topicName,
        skillId: skill?.skillId,
        skillName: skill?.skillName,
        quizClass: studentData.class,
        class: studentData.class,
        quizData: skillQuiz,
        program: studentData?.program,
        username,
        transLength: skill?.transLength,
        // quizStatus: 'complete',
        subject: skill?.subject,
      };
      console.log('body--->', body);
      console.log('skillQuiz--->', skillQuiz);
      try {
        const response = await Api.post(`saveTransStudActQuiz`, body);
        console.log('responses2----->', response.data, response.status);
        if (response.status === 201 || response.status === 200) {
          Alert.alert('', 'Skill Saved Successfully !', [
            // {
            //   text: 'Cancel',
            //   onPress: () => null,
            //   style: 'default',
            // },
            {
              text: 'Ok',
              onPress: () => fetchData(),
              style: 'default',
            },
          ]);
        } else {
          console.log('err-->', response, response.status);
        }
      } catch (err) {
        if (err.response.status === 400) {
          Alert.alert('', 'Skill Saved Failed !', [
            // {
            //   text: 'Cancel',
            //   onPress: () => null,
            //   style: 'default',
            // },
            {
              text: 'Ok',
              onPress: () => fetchData(),
              style: 'default',
            },
          ]);
        }
        console.log('check error----->', err.response);
      }
    }
  };

  return (
    <View>
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
              ଆପଣ ସଫଳତାର ସହ {studentname}ର {topicName} କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ
              କରିଥିବାରୁ
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>୫ </Text>
              ଟି କଏନ ହାସଲ କରିଛନ୍ତି l
            </Text>
            <TouchableOpacity
              // onPress={() =>
              //   navigation.navigate('ମୋ ସଫଳତା', {
              //     type: 'ମୋ ସଫଳତା',
              //   })
              // }
              onPress={() => navigation.goBack()}
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
                Check Reward
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.bu,
                {
                  marginTop: 20,
                  backgroundColor: Color.ghostwhite,
                  width: window.WindowWidth * 0.5,
                  borderWidth: 1,
                  borderColor: Color.royalblue,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  // fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: Color.royalblue,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView>
        {isLoading ? (
          <View>
            <Loading />
          </View>
        ) : (
          <View style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                {
                  // height: window.WindowHeigth * 1,
                  // marginTop: -0,
                  top: -45,
                  width: window.WindowWidth * 2,
                },
              ]}>
              <View
                style={{
                  backgroundColor: '#0060ca',
                  // height: 66,
                  width: window.WindowWidth * 1.1,
                  marginTop: 20,
                  marginLeft: 20,
                  paddingBottom: 20,
                  top: '-4%',
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                      'Are you sure you want to exit?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => null,
                          style: 'default',
                        },
                        {
                          text: 'Ok',
                          onPress: () => handleDelete(),
                          style: 'default',
                        },
                      ],
                    );
                  }}>
                  <AntDesign
                    name="arrowleft"
                    size={23}
                    style={{marginLeft: 26, marginTop: 16}}
                    color="white"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                    marginLeft: 28,
                    top: 5,
                    width: 320,
                  }}>
                  {topicNameHeader}
                  {/* {eceHeading.map(x => x.header)} */}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  right: '27%',
                  // paddingBottom: '50%',
                }}>
                {isLoading ? (
                  <View>
                    <Loading />
                  </View>
                ) : studentAudio?.length > 0 ? (
                  <AudioAssessment
                    textInputRef={textInputRef}
                    studentAudio={studentAudio}
                    onsubmit={handleSubmit}
                    onAnswerSet={onAnswerSet}
                    onOpenModal={onOpenModal}
                    onSkipAnswer={onSkipAnswer}
                    imageUrl={imageUrls2}
                    onImageSelected={handleImageSelected2}
                    onVideoSelected={handleVideoSelected2}
                    handleOptionSelect={handleOptionSelect2}
                    handleAnswerChange={handleAnswerChange2}
                    handleOptionSelectMulti={handleOptionSelectMulti2}
                    handleChangeText={handleChangeText}
                    backClear={back}
                  />
                ) : (
                  // <View style={{alignSelf: 'center', right: '27%'}}>
                  // <NewQuizTemplate
                  //   textInputRef={textInputRef}
                  //   handleSaveAssessment={handleSubmit}
                  //   topicQuizData={studentAudio}
                  //   handleAnswerChange={handleAnswerChange2}
                  //   handleOptionSelect={handleOptionSelect2}
                  //   closeModal={closeModals2}
                  //   handleOptionSelectMulti={handleOptionSelectMulti2}
                  //   imageUrl={imageUrls2}
                  //   onImageSelected={handleImageSelected2}
                  //   // answerReset={answerReset}
                  // />
                  // </View>
                  <View style={{right: '-26%'}}>
                    <Nocontents />
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default StudentAssessmentDetails;
const styles = StyleSheet.create({
  button: {
    // justifyContent: 'center',
    // backgroundColor: Colors.blue,
    // height: 40,
    justifyContent: 'center',
    backgroundColor: '#0060ca',
    height: 40,
    width: window.WindowWidth * 0.5,
    left: '2%',
    borderRadius: 156,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  submit: {
    width: window.WindowWidth * 0.4,
    marginLeft: 120,
    borderRadius: 30,
    backgroundColor: Color.royalblue,
    color: 'white',
    // borderWidth: 1,

    marginTop: 30,
  },
  records: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,
    width: 116,
    paddingBottom: 20,
    top: '20%',
    flexDirection: 'row',
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    top: '5%',
    // flexGrow: 1,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textss: {
    color: 'white',
    fontSize: 13,
    fontFamily: FontFamily.poppinsMedium,
    alignSelf: 'center',
    top: '6%',
    left: 2,
  },
  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 60,
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

  record: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,
    width: 126,
    paddingBottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    top: '5%',
    flexGrow: 1,
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

  input: {
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.83,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
  },

  progressBar: {
    flex: 1,
    flexDirection: 'row',
    height: 10,
    backgroundColor: '#888',
  },
  playButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 16,
  },
  playIcon: {
    width: 50,
    height: 50,
    tintColor: Color.royalblue,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  type: {
    backgroundColor: Color.white,
    color: 'black',
    width: window.WindowWidth * 0.9,
    borderRadius: 10,
    paddingBottom: 20,
    alignSelf: 'center',
    paddingTop: 20,
    fontSize: 20,
    textAlign: 'center',
    top: '20%',
    paddingBottom: 30,
  },
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

    alignItems: 'center',
    padding: 10,
    paddingBottom: 20,
    justifyContent: 'space-evenly',
  },
  subModule: {
    color: Colors.black,
    // letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 16,
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

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
  },
  input: {
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.7,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
  },
  bu: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,
    // width: 116,
    // paddingBottom: 20,
    top: '20%',
    flexDirection: 'row',
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    top: '5%',
    color: 'white',

    // paddingRight: 20,
    // flexGrow: 1,
  },
  bu: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,
    // width: 116,
    // paddingBottom: 20,
    top: '20%',
    flexDirection: 'row',
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    top: '5%',
    color: 'white',

    // paddingRight: 20,
    // flexGrow: 1,
  },
  markedOption: {
    borderColor: Color.royalblue,
    // backgroundColor: Color.white,
    borderRadius: 20,
    borderWidth: 1,
    color: 'white',
    width: SIZES.WindowWidth * 0.8,
    height: 50,
    top: 10,
    textAlign: 'left',

    margin: 10,
    alignSelf: 'center',
    fontFamily: FontFamily.poppinsMedium,
  },
  Option: {
    borderColor: Color.royalblue,
    backgroundColor: Color.royalblue,
    borderRadius: 20,
    color: 'white',
    width: SIZES.WindowWidth * 0.8,
    height: 50,
    top: 10,
    textAlign: 'left',

    margin: 10,
    alignSelf: 'center',
    fontFamily: FontFamily.poppinsMedium,
  },
  option: {
    borderColor: Color.royalblue,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
});
