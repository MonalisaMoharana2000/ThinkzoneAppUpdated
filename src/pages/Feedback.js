import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  AppState,
  BackHandler,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Foundation from 'react-native-vector-icons/Foundation';
const AnimatedMaterialIcons = Animated.createAnimatedComponent(Foundation);
import {showMessage} from 'react-native-flash-message';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import React, {useEffect, useState} from 'react';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Api from '../environment/Api';
import {ScrollView} from 'react-native-gesture-handler';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import SurveyComponent from '../components/SurveyComponent';
import {useRef} from 'react';
import {app_versions} from './Home';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Feedback = ({route, navigation}) => {
  const user = useSelector(state => state.UserSlice.user);
  const {username, userid, managerid, managername, usertype, passcode} =
    user[0];
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [quizModal, setQuizModal] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  console.log('surveyQuestions---->', surveyQuestions);
  const [surveyStatus, setSurveyStatus] = useState('');
  const [surveyId, setSurveyId] = useState('');
  const [sNames, setSnames] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [checkArray, setCheckArray] = useState([]);
  const [viewStatus, setViewStatus] = useState(null);
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
  //Store Timespent
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
          modulename: 'tchSurvey',
          duration: duration,
          month: month,
          year: year,
          appVersion: app_versions,
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
            } else if (error.response.status === 504) {
              console.log('Error is--------------------->', error);
            } else if (error.response.status === 500) {
              console.error('Error is------------------->:', error);
            } else {
              console.error('Error is------------------->:', error);
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
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
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
                modulename: 'tchSurvey',
                duration: duration,
                month: month,
                year: year,
                appVersion: app_versions,
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
                  } else if (error.response.status === 504) {
                    console.log('Error is--------------------->', error);
                  } else if (error.response.status === 500) {
                    console.error('Error is------------------->:', error);
                  } else {
                    console.error('Error is------------------->:', error);
                  }
                });

              console.log('stTime saved to AsyncStorage');
            })
            .catch(error => {
              if (error.response.status === 413) {
                console.log('error is---------------->', error);
              } else if (error.response.status === 504) {
                console.log('Error is--------------------->', error);
              } else if (error.response.status === 500) {
                console.error('Error is------------------->:', error);
              } else {
                console.error('Error is------------------->:', error);
              }
            });
        } else if (
          appStateVisible === 'background' &&
          nextAppState === 'active'
        ) {
          setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
        } else if (appStateVisible === 'active' && nextAppState === 'active') {
          console.log('when Screen is on =====================>');
          AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
            .then(() => console.log('stTime saved to AsyncStorage1'))
            .catch(error => {
              if (error.response.status === 413) {
                console.log('error is---------------->', error);
              } else if (error.response.status === 504) {
                console.log('Error is--------------------->', error);
              } else if (error.response.status === 500) {
                console.error('Error is------------------->:', error);
              } else {
                console.error('Error is------------------->:', error);
              }
            });
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

  const fetchData = async () => {
    const response = await Api.get(`getAllTchSurveys/${userid}/${usertype}`);
    console.log('response----->', response.data);
    setSurveys(response.data);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchData();
    }, []),
  );

  const onSurveyBack = () => {
    setQuizModal(false);
  };

  const handleSurveys = async item => {
    console.log('survey question----->', item);
    setSurveyDescription(item.surveyDescription);
    setSurveyId(item.surveyId);
    setSnames(item.surveyName);
    setQuizModal(true);
    setViewStatus(item.viewStatus);
    try {
      const body = {
        userid: userid,
        username: username,
        usertype: usertype,
        passcode: passcode,
        managerid: managerid,
        managername: managername,
        surveyId: item.surveyId,
        viewStatus: item.viewStatus,
        appVersion: app_versions,
      };
      const response = await Api.patch('updateTchSurveyViewStatus', body);
      console.log('view status changed', response.data, response.status);

      if (response.status === 201 || response.status === 200) {
        fetchData();
        const getResponse = await Api.get(
          `getTchSurveyQues/${userid}/${item.surveyId}`,
        );

        if (getResponse.status === 200) {
          setSurveyQuestions(getResponse.data?.surveyData);
          setSurveyStatus(getResponse.data?.completionStatus);
          console.log('GET API worked');
        } else {
          console.log('Error occurred in GET API');
        }
      }
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const back = () => {
    Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ଆପଣ ଏହି ମଡ୍ୟୁଲ୍ ଛାଡିବାକୁ ଚାହୁଁଛନ୍ତି କି?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'default',
      },
      {text: 'Ok', onPress: onSurveyBack, style: 'default'},
    ]);
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const body = {
  //       userid: userid,
  //       username: username,
  //       usertype: usertype,
  //       passcode: passcode,
  //       managerid: managerid,
  //       managername: managername,
  //       surveyId: surveyId,
  //       viewStatus: viewStatus,
  //       appVersion: app_versions,
  //     };
  //     Api.patch('updateTchSurveyViewStatus', body)
  //       .then(res => {
  //         console.log('view status changed', res.data, res.status);
  //         if (res.status === 200) {
  //           fetchData();
  //         } else {
  //           console.log('some error might have occurred');
  //         }
  //       })
  //       .catch(err => {
  //         console.log('This error occurred---------->', err);
  //       });
  //   }, []),
  // );

  const handleTextChange = (questionId, textAnswer) => {
    setSurveyQuestions(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: textAnswer};
        } else {
          return item;
        }
      });
    });
  };

  const handleTextAreaChange = (questionId, textAnswer) => {
    console.log('answer----->', questionId, textAnswer);
    setSurveyQuestions(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: textAnswer};
        } else {
          return item;
        }
      });
    });
  };

  const onChangeRadio = (questionId, RadiOptions) => {
    console.log('answer----->', questionId, [RadiOptions]);
    setSurveyQuestions(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, selectedOption: [RadiOptions]};
        } else {
          return item;
        }
      });
    });
  };

  const onChangeCheckbox = (questionId, optionId, option) => {
    setSurveyQuestions(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          const selectedOptionsForQuestion = item.selectedOption || [];

          // Check if the option is already selected
          const optionIndex = selectedOptionsForQuestion.findIndex(
            selectedOption => selectedOption.id === optionId,
          );

          if (optionIndex !== -1) {
            // Option is already selected, so remove it
            selectedOptionsForQuestion.splice(optionIndex, 1);
          } else {
            // Option is not selected, so add it
            selectedOptionsForQuestion.push(option);
          }

          // Update the item's selectedOption property
          item.selectedOption = selectedOptionsForQuestion;
        }
        return item;
      });
    });
  };

  const handleSelectChange = (questionId, selectedOption) => {
    setSurveyQuestions(prevData => {
      const newData = prevData.map(option => {
        if (option.questionId === questionId) {
          return {...option, selectedOption: [selectedOption]};
        } else {
          return option;
        }
      });
      return newData;
    });
  };
  const handleEmojiRating = (questionId, item) => {
    console.log('selectefunctionrating----->', questionId, item);
    setSurveyQuestions(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: item};
        } else {
          return item;
        }
      });
    });
  };

  const onDateChange = (questionId, selectedOption) => {
    setSurveyQuestions(prevData => {
      const newData = prevData.map(option => {
        if (option.questionId === questionId) {
          return {...option, answer: selectedOption};
        } else {
          return option;
        }
      });
      return newData;
    });
  };

  const onTimeValue = (questionId, timeValue) => {
    console.log('checktime----->', questionId, timeValue);
    setSurveyQuestions(prevData => {
      const newData = prevData.map(option => {
        if (option.questionId === questionId) {
          return {...option, answer: timeValue};
        } else {
          return option;
        }
      });
      return newData;
    });
  };

  const handleSaveSurvey = async () => {
    const filteredRequired = surveyQuestions.filter(
      option => option.required === true,
    );

    const filteredRequiredFalse = surveyQuestions.filter(
      option => option.required === false,
    );
    console.log('filteredRequired----->', filteredRequired);

    const requiredYes = filteredRequired.filter(
      option => option?.answer?.length,
    );
    const requiredSelectedOption = filteredRequired.filter(
      option => option?.selectedOption?.length,
    );

    if (
      filteredRequired.length ===
        requiredYes.length + requiredSelectedOption.length ||
      surveyQuestions.length === filteredRequiredFalse.length
    ) {
      const body = {
        userid: userid,
        username: username,
        usertype: usertype,
        passcode: passcode,
        managerid: managerid,
        managername: managername,
        passcode: passcode,
        language: 'od',
        surveyId: surveyId,
        surveyName: sNames,
        surveyDescription: surveyDescription,
        surveyData: surveyQuestions,
        appVersion: app_versions,
      };

      console.log('body---->', body);
      const response = await Api.post(`saveTransTchSurvey`, body);
      console.log('check survey--->', response.data, response.status);
      if (response.status === 200) {
        showMessage({
          message: `Survey Submitted.`,
          // description: 'Successfully student deleted.',
          type: 'success',
          backgroundColor: Colors.success,
        });
        fetchData();
        setQuizModal(false);
      } else {
        Alert.alert('Something went wrong', '', [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ]);
      }

      console.log('check---->', 'length matched');
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', '', [
        {
          text: 'OK',
          onPress: () => null,
        },
      ]);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView>
        {loading ? (
          <Loading />
        ) : (
          <>
            {surveys.length > 0 ? (
              <>
                {surveys.map((item, index) => {
                  return (
                    <View
                      key={item.surveyId}
                      style={{
                        width: window.WindowWidth * 0.9,
                        // backgroundColor: 'white',
                        borderRadius: 10,
                        alignSelf: 'center',
                        margin: 10,
                      }}>
                      {item.completionStatus === true ? (
                        <View
                          style={{
                            width: window.WindowWidth * 0.9,
                            backgroundColor: Color.ghostwhite,
                            borderRadius: 10,
                            alignSelf: 'center',
                            borderColor: Color.royalblue,
                            margin: 10,
                            // padding: 6,
                          }}>
                          <View style={styles.card}>
                            <View style={styles.subModuContainer}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-evenly',
                                }}>
                                <View>
                                  <View>
                                    <View style={{flexDirection: 'row'}}>
                                      <Text
                                        style={[
                                          styles.name,
                                          {
                                            left: '56%',
                                          },
                                        ]}>
                                        {item.surveyName}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        left: '16%',
                                      }}>
                                      <Image
                                        style={{
                                          // left: '100%',
                                          top: '5%',
                                          width: 28,
                                          height: 28,
                                        }}
                                        source={require('../assets/Image/tick-circle.png')}
                                      />
                                      <Text
                                        style={{
                                          textTransform: 'uppercase',
                                          left: '17%',
                                          // backgroundColor: '#b4f289',
                                          padding: 10,
                                        }}>
                                        Completed
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          key={item.surveyId}
                          onPress={() => handleSurveys(item)}>
                          <View style={styles.card}>
                            <View style={styles.subModuContainer}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-evenly',
                                }}>
                                <View>
                                  <View>
                                    <View
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                      }}>
                                      <Text
                                        style={[
                                          styles.name,
                                          {
                                            maxWidth: window.WindowWidth * 0.6,
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            padding: 16,
                                          },
                                        ]}>
                                        {item.surveyName}
                                      </Text>
                                      {item.viewStatus === true ? null : (
                                        <View style={{left: '100%'}}>
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

                                    {/* <Text style={{textTransform: 'uppercase'}}>
                                    {item.surveyDescription}
                                  </Text> */}
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </>
            ) : (
              <Nocontents />
            )}

            <Modal
              animationType="slide"
              onRequestClose={() => back()}
              // transparent={true}
              visible={quizModal}>
              <View style={{flex: 1}}>
                <View style={{backgroundColor: Colors.royalblue, padding: 10}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginLeft: 5,
                      fontFamily: FontFamily.poppinsMedium,
                    }}>
                    {sNames}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                  }}>
                  <SurveyComponent
                    surveyQuestions={surveyQuestions}
                    handleTextChange={handleTextChange}
                    handleTextAreaChange={handleTextAreaChange}
                    onChangeRadio={onChangeRadio}
                    onChangeCheckbox={onChangeCheckbox}
                    handleSelectChange={handleSelectChange}
                    onDateChange={onDateChange}
                    handleEmojiRating={handleEmojiRating}
                    onTimeValue={onTimeValue}
                    sNames="ସୂଚନା"
                    surveyDescription={surveyDescription}
                    title={sNames}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleSaveSurvey()}
                  style={{
                    // marginTop: 30,
                    alignSelf: 'center',
                    backgroundColor: Color.ghostwhite,
                    // left: '27%',
                  }}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {/* <Modal
            animationType="slide"
            onRequestClose={() => back()}
            // transparent={true}
            visible={quizModal}>
            <View style={{flex: 1}}>
              <View style={{backgroundColor: Colors.royalblue, padding: 10}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    marginLeft: 5,
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  {sNames}
                </Text>
              </View>
            </View>
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
                    alignSelf: 'center',
                  }}>
                  <SurveyComponent
                    surveyQuestions={surveyQuestions}
                    handleTextChange={handleTextChange}
                    handleTextAreaChange={handleTextAreaChange}
                    onChangeRadio={onChangeRadio}
                    onChangeCheckbox={onChangeCheckbox}
                    handleSelectChange={handleSelectChange}
                    onDateChange={onDateChange}
                    handleEmojiRating={handleEmojiRating}
                    onTimeValue={onTimeValue}
                    sNames="ସୂଚନା"
                    surveyDescription={surveyDescription}
                    title={sNames}
                  />
                  <TouchableOpacity
                    onPress={() => handleSaveSurvey()}
                    style={{
                      marginTop: 30,
                      alignSelf: 'center',
                      backgroundColor: Color.ghostwhite,
                      // left: '27%',
                    }}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal> */}
          </>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  card: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    // borderColor: Color.royalblue,
    backgroundColor: 'white',
    // borderWidth: 2,
    // borderWidth: 4,
    shadowColor: 'black',
    elevation: 3,
  },
  subModuContainer: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    color: '#000',
    fontFamily: FontFamily.poppinsMedium,
    textTransform: 'capitalize',
    paddingBottom: 5,
    maxWidth: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: Color.ghostwhite,
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

  buttonText: {
    width: window.WindowWidth * 0.8,
    height: window.WindowHeigth * 0.06,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,
    fontSize: 24,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    // marginTop: 30,
    // marginLeft: 25,
    top: '2%',
    fontWeight: 'bold',
  },
});
