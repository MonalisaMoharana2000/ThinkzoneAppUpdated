import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  Modal,
  Animated,
  TextInput,
  StyleSheet,
  // ScrollView,
  ScrollView,
} from 'react-native';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import Colors from '../utils/Colors';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';

// import Color from '../utils/Colors';
import * as SIZES from '../utils/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Row} from 'react-native-table-component';
// import * as window from '../utils/dimensions';
import * as window from '../utils/dimensions';
import {log} from 'react-native-reanimated';

const NewQuiz = ({
  questions,
  onend_quiz,
  navigation,
  examType,
  callbackfun,
}) => {
  // console.log(examType, 'examType');
  // console.log(questions);
  const allQuestions = questions;
  const [mark, setMark] = useState([]);
  // console.log(mark, 'mark==========>');

  const [userQuizData, setUserQuizData] = useState([]);

  // console.log('allQuestions------------>', allQuestions);
  const [quiz, setQuiz] = useState(questions);
  // const [selectedModule, setselectedModule] = useState(0);
  // console.log('selectedModule--->', selectedModule);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  // console.log('currentOptionSelected--->', currentOptionSelected);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [modals, setModals] = useState(false);

  const [selectedModule, setSelectedModule] = useState(0);
  const userdatas = useSelector(state => state.userdata.user?.resData);
  // console.log('selectedModule--->', selectedModule);

  const checkOption = allQuestions.filter(x => {
    x.answer;
    return allQuestions;
  });
  const checkOptionLength = checkOption.filter(x => x.answer).length;
  console.log(
    // 'answer for header--->',
    checkOptionLength,
    allQuestions.length,
  );
  const postModuleid = (item, index) => {
    setSelectedModule(index);
    setCurrentOptionSelected(questions[index]['answer']);
    let obj = userQuizData[index];
    setShowNextButton(obj && obj.appeared ? true : false);

    // setSelectedModule(index);
    // console.log('header click--->', item, index);
    // setCurrentOptionSelected(questions[index]['answer']);
    // console.log('check select--->', allQuestions.length, selectedModule + 1);
  };
  useEffect(() => {
    API.get(`getbaselinemarks/${examType}/${userdatas[0].userid}`).then(res => {
      setMark(res.data.data);

      setIsloading(false);
    });
    // console.log(mark, 'markdata');
  }, []);
  const validateAnswer = answer => {
    let correct_option = allQuestions[selectedModule]['answer'];
    // console.log('correct_option---->', correct_option);
    allQuestions[selectedModule]['answer'] = answer;
    // console.log('answer---->', answer);
    // console.log(questions, 'questions');
    // console.log(
    //   correct_option,
    //   'correct_option',
    //   answer,
    //   'answer',
    // );
    setCurrentOptionSelected(answer);
    setCorrectOption(correct_option);
    // setIsOptionsDisabled(true);
    // if (answer == correct_option) {
    //   // Set Score
    //   setScore(score + 1);
    // }

    // Show Next Button
    // setShowPrevButton(true);
    setShowNextButton(true);
    // setShowPrevButton(true);
  };
  useEffect(() => {
    const backAction = () => {
      // setModal(true);

      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'default',
          },
          {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const handleNext = () => {
    // console.log('inside if');
    setShowPrevButton(true);
    // console.log(questions, 'question');
    if (selectedModule == allQuestions.length - 1) {
      if (allQuestions.length != checkOptionLength) {
        setShowScoreModal(false);
        setModals(false);
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
          'Quiz ଅନ୍ତର୍ଗତ ସମସ୍ତ କୁଇଜ୍ ର ଉତ୍ତର ଦିଅନ୍ତୁ।',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'OK', onPress: () => restartQuiz()},
          ],
        );
      }
      // Last Question
      // Show Score Modal
      let D_score = 0;
      const curect_score = questions.map((item, i) => {
        if (item.answer == item.correctAnswer) {
          //for common monthly quiz
          D_score++;
          console.log('matched');
        }
        setScore(D_score);
      });
      if (examType == 'baseline' || examType == 'endline') {
        onend_quiz(D_score, allQuestions.length, questions);
      } else {
        if (D_score > allQuestions.length / 2) {
          onend_quiz(D_score, allQuestions.length, questions);
        }
      }
      // if (score > allQuestions.length / 2) {
      //   onend_quiz(score, allQuestions.length, questions);
      // }
      if (allQuestions.length == checkOptionLength) {
        setShowScoreModal(true);
        setModals(true);
      }
    } else {
      if (questions[selectedModule + 1]['answer']) {
        // console.log('inside if3');
        setShowNextButton(true);
      } else {
        // console.log('inside if4');
        setShowNextButton(false);
        const obj = {index: selectedModule + 1, appeared: true};
        setUserQuizData([...userQuizData, obj]);
        // console.log('setUserQuizData===============>', userQuizData);
      }

      console.log('inside if2');
      setCurrentOptionSelected(questions[selectedModule + 1]['answer']);
      setSelectedModule(selectedModule + 1);
      // setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      // setShowNextButton(false);
      setShowPrevButton(true);
    }
    Animated.timing(progress, {
      toValue: selectedModule + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  const handlePrev = () => {
    if (
      selectedModule - 1 >= 0 &&
      questions[selectedModule - 1] &&
      questions[selectedModule - 1]['answer']
    ) {
      setShowNextButton(true);
    }

    if (selectedModule - 1 >= 0 && questions[selectedModule - 1]) {
      setCurrentOptionSelected(questions[selectedModule - 1]['answer']);
      setSelectedModule(selectedModule - 1);
    }

    if (selectedModule + 1 === 1) {
      setShowPrevButton(false);
    }
    if (allQuestions.length === selectedModule + 1) {
      setShowNextButton(true);
    }
  };

  const restartQuiz = () => {
    allQuestions.map(item => {
      item.answer = '';
    });
    setShowScoreModal(false);
    setModals(false);
    setSelectedModule(0);
    setScore(0);

    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionsDisabled(false);
    setShowNextButton(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const renderQuestion = () => {
    return (
      <View>
        {/* {examType == 'baseline' ? <Text>Baseline</Text> : <Text>endline</Text>} */}
        <View
          style={{
            marginVertical: 30,
          }}>
          {/* Question Counter */}
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginTop: -20,
              paddingBottom: 30,
            }}>
            <Text
              style={{
                color: Color.black,
                fontSize: 17,
                opacity: 0.6,
                fontFamily: FontFamily.poppinsMedium,
                marginRight: 2,
              }}>
              {selectedModule + 1}
            </Text>
            <Text
              style={{
                color: Color.black,
                fontSize: 17,
                opacity: 0.6,
                fontFamily: FontFamily.poppinsMedium,
              }}>
              / {allQuestions.length}
            </Text>
          </View> */}

          {/* Question */}
          <Text
            style={{
              color: Color.black,
              fontSize: 25,
            }}>
            {allQuestions[selectedModule]?.question}
          </Text>
        </View>
      </View>
    );
  };
  // const renderInputbox = () => {
  //   return (
  //     <View>
  //       <TextInput
  //         style={{height: 40}}
  //         placeholder="Type here to translate!"
  //         // onChangeText={newText => setText(newText)}
  //         // defaultValue={text}
  //       />
  //     </View>
  //   );
  // };
  const renderOptions = () => {
    // console.log(
    //   allQuestions[selectedModule],
    //   allQuestions[selectedModule].A,
    //   allQuestions[selectedModule].D,
    //   'allQuestions[selectedModule]?.D',
    // );
    return (
      <View>
        {/* {allQuestions[selectedModule]?.map(option => ( */}
        {allQuestions[selectedModule]?.A != '' && (
          <TouchableOpacity
            onPress={() => validateAnswer('A')}
            disabled={isOptionsDisabled}
            // key={option}
            style={{
              borderWidth: 3,
              // borderColor:
              //   'A' == correctOption
              //     ? Color.success
              //     : 'A' == currentOptionSelected
              //     ? Color.danger
              //     : Color.secondary + '40',
              // backgroundColor:
              //   'A' == correctOption
              //     ? Color.success + '20'
              //     : 'A' == currentOptionSelected
              //     ? Color.danger + '20'
              //     : Color.secondary + '20',
              borderColor:
                'A' == currentOptionSelected
                  ? Color.royalblue
                  : Color.secondary + '40',
              backgroundColor:
                'A' == currentOptionSelected
                  ? Color.royalblue + '20'
                  : Color.secondary + '20',
              // height: 55,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 20, color: Color.black, margin: 8}}>
              {allQuestions[selectedModule]?.optionA}
            </Text>

            {/* Show Check Or Cross Icon based on correct answer*/}
            {/* {'A' == correctOption ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.success,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="check"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : 'A' == currentOptionSelected ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.error,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="close"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : null} */}
          </TouchableOpacity>
        )}

        {allQuestions[selectedModule]?.optionB != '' && (
          <TouchableOpacity
            onPress={() => validateAnswer('B')}
            disabled={isOptionsDisabled}
            // key={option}
            style={{
              borderWidth: 3,
              // borderColor:
              //   'B' == correctOption
              //     ? Color.success
              //     : 'B' == currentOptionSelected
              //     ? Color.danger
              //     : Color.secondary + '40',
              // backgroundColor:
              //   'B' == correctOption
              //     ? Color.success + '20'
              //     : 'B' == currentOptionSelected
              //     ? Color.danger + '20'
              //     : Color.secondary + '20',
              borderColor:
                'B' == currentOptionSelected
                  ? Color.royalblue
                  : Color.secondary + '40',
              backgroundColor:
                'B' == currentOptionSelected
                  ? Color.royalblue + '20'
                  : Color.secondary + '20',
              // height: 55,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 20, color: Color.black, margin: 8}}>
              {allQuestions[selectedModule]?.optionB}
            </Text>

            {/* Show Check Or Cross Icon based on correct answer*/}
            {/* {'B' == correctOption ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.success,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="check"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : 'B' == currentOptionSelected ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.error,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="close"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : null} */}
          </TouchableOpacity>
        )}

        {allQuestions[selectedModule]?.optionC != '' && (
          <TouchableOpacity
            onPress={() => validateAnswer('C')}
            disabled={isOptionsDisabled}
            // key={option}
            style={{
              borderWidth: 3,
              // borderColor:
              //   'C' == correctOption
              //     ? Color.success
              //     : 'C' == currentOptionSelected
              //     ? Color.danger
              //     : Color.secondary + '40',
              // backgroundColor:
              //   'C' == correctOption
              //     ? Color.success + '20'
              //     : 'C' == currentOptionSelected
              //     ? Color.danger + '20'
              //     : Color.secondary + '20',
              borderColor:
                'C' == currentOptionSelected
                  ? Color.royalblue
                  : Color.secondary + '40',
              backgroundColor:
                'C' == currentOptionSelected
                  ? Color.royalblue + '20'
                  : Color.secondary + '20',
              // height: 55,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 20, color: Color.black, margin: 8}}>
              {allQuestions[selectedModule]?.optionC}
            </Text>

            {/* Show Check Or Cross Icon based on correct answer*/}
            {/* {'C' == correctOption ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.success,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="check"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : 'C' == currentOptionSelected ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.error,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="close"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : null} */}
          </TouchableOpacity>
        )}

        {allQuestions[selectedModule]?.optionD == '' ? (
          <></>
        ) : (
          <TouchableOpacity
            onPress={() => validateAnswer('D')}
            disabled={isOptionsDisabled}
            // key={option}
            style={{
              borderWidth: 3,
              // borderColor:
              //   'D' == correctOption
              //     ? Color.success
              //     : 'D' == currentOptionSelected
              //     ? Color.danger
              //     : Color.secondary + '40',
              // backgroundColor:
              //   'D' == correctOption
              //     ? Color.success + '20'
              //     : 'D' == currentOptionSelected
              //     ? Color.danger + '20'
              //     : Color.secondary + '20',
              borderColor:
                'D' == currentOptionSelected
                  ? Color.royalblue
                  : Color.secondary + '40',
              backgroundColor:
                'D' == currentOptionSelected
                  ? Color.royalblue + '20'
                  : Color.secondary + '20',
              // height: 55,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 20, color: Color.black, margin: 8}}>
              {allQuestions[selectedModule]?.optionD}
            </Text>

            {/* Show Check Or Cross Icon based on correct answer*/}
            {/* {'D' == correctOption ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.success,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="check"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : 'D' == currentOptionSelected ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: Color.error,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="close"
                style={{
                  color: Color.black,
                  fontSize: 20,
                }}
              />
            </View>
          ) : null} */}
          </TouchableOpacity>
        )}

        {/* ))} */}
      </View>
    );
  };
  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <View
          style={{
            flexDirection: 'row',
            padding: 1,
            paddingBottom: 50,
          }}>
          {showPrevButton ? (
            <TouchableOpacity
              onPress={handlePrev}
              style={{
                marginTop: 15,
                width: '30%',
                // backgroundColor: Color.royalblue,
                padding: 10,
                borderRadius: 5,
                marginLeft: 20,
                paddingBottom: 20,
                marginBottom: 20,
              }}>
              {/* <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>
                Prev
              </Text> */}
              <Image
                style={{
                  marginTop: 2,
                  marginLeft: 5,
                  width: 32,
                  height: 32,
                }}
                source={require('../assets/Image/arrow-square-left.png')}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {allQuestions.length === selectedModule + 1 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                marginTop: 28,
                // width: 110,
                height: 40,

                width: window.WindowWidth * 0.22,
                height: window.WindowHeigth * 0.05,
                backgroundColor: Color.royalblue,
                fontFamily: FontFamily.poppinsMedium,
                fontWeight: '700',
                // padding: 20,
                borderRadius: 10,
                left: '80%',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Color.white,
                  textAlign: 'center',
                  marginTop: 8,
                  fontWeight: '700',
                  fontFamily: FontFamily.poppinsMedium,
                  // textTransform: 'capitalize',
                }}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                marginTop: 19,
                width: '30%',
                alignItems: 'flex-end',
                padding: 10,
                borderRadius: 5,
                marginLeft: 90,
              }}>
              <Image
                style={{
                  marginTop: 2,
                  marginLeft: 5,
                  width: 32,
                  height: 32,
                }}
                source={require('../assets/Image/arrow-square-right.png')}
              />
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity
            onPress={handleNext}
            style={{
              marginTop: 20,
              width: '30%',
              backgroundColor: Color.royalblue,
              padding: 10,
              borderRadius: 5,
              marginLeft: 90,
            }}>
            <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>
              Next
            </Text>
          </TouchableOpacity> */}
        </View>
      );
    } else {
      return (
        <>
          {showPrevButton ? (
            // <TouchableOpacity
            //   onPress={handlePrev}
            //   style={{
            //     marginTop: 20,
            //     width: '30%',
            //     backgroundColor: Color.royalblue,
            //     padding: 10,
            //     borderRadius: 5,
            //     marginLeft: 20,
            //   }}>
            //   <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>
            //     Prev
            //   </Text>
            // </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePrev}
              style={{
                marginTop: 20,
                width: '30%',
                // backgroundColor: Color.royalblue,
                padding: 10,
                borderRadius: 5,
                marginLeft: 15,
              }}>
              <Image
                style={{
                  marginTop: 2,
                  marginLeft: 5,
                  width: 32,
                  height: 32,
                }}
                source={require('../assets/Image/arrow-square-left.png')}
              />
              {/* <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>
                Prev
              </Text> */}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </>
      );
    }
  };

  const [progress, setProgress] = useState(new Animated.Value(0));
  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestions.length],
    outputRange: ['0%', '100%'],
  });
  const renderProgressBar = () => {
    return (
      <View>
        <View style={{paddingBottom: 15, left: '2%', flexDirection: 'row'}}>
          <View>
            {examType == 'baseline' ? (
              <Text
                style={{
                  color: Color.black,
                  fontSize: FontSize.size_base,
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '500',
                  textAlign: 'left',
                }}>
                Baseline
              </Text>
            ) : (
              <Text
                style={{
                  color: Color.black,
                  fontSize: FontSize.size_base,
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '700',
                  textAlign: 'left',
                  left: '20%',
                }}>
                Quiz
              </Text>
            )}
          </View>
          <View style={{flexDirection: 'row', left: '50%'}}>
            {examType == 'baseline' ? (
              <Text
                style={{
                  color: Color.black,
                  fontSize: FontSize.size_base,
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '700',
                  textAlign: 'left',
                }}>
                5 Coins
              </Text>
            ) : (
              <Text></Text>
            )}
            {examType == 'baseline' ? (
              <Image
                style={{
                  marginTop: 5,
                  marginLeft: 5,
                  width: 17.21,
                  height: 17.21,
                }}
                source={require('../assets/Image/Frame.png')}
              />
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 20,
            borderRadius: 20,
            backgroundColor: '#00000020',
          }}>
          <Animated.View
            style={[
              {
                height: 20,
                borderRadius: 20,
                backgroundColor: '#A3D735',
              },
              {
                width: progressAnim,
              },
            ]}></Animated.View>
        </View>
      </View>
    );
  };

  console.log(
    '100_____>',
    (score / allQuestions.length) * 100,
    allQuestions.length,
    Math.floor(allQuestions.length / 2),
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      {/* <StatusBar barStyle="light-content" backgroundColor={Color.primary} /> */}
      {/* <ScrollView> */}
      <View
        style={{
          flex: 1,
          height: SIZES.WindowHeigth,
          width: SIZES.WindowWidth,
          paddingVertical: 40,
          paddingHorizontal: 16,
          // backgroundColor: Color.primary,
          position: 'absolute',
          // marginTop: -30,
        }}>
        {/* ProgressBar */}
        {renderProgressBar()}
        <ScrollView>
          <ScrollView horizontal={true} style={{marginLeft: -30}}>
            {allQuestions.map((item, index) => (
              <TouchableOpacity
                onPress={() => postModuleid(item, index)}
                key={index}
                style={{
                  marginTop: 69,
                  margin: 2,
                  flexDirection: 'row',
                  borderWidth: 2,
                  width: 45.72,
                  height: 46.66,
                  borderRadius: 100,

                  borderColor:
                    index === selectedModule ? Colors.black : Colors.white,
                  // backgroundColor: 'grey',
                  backgroundColor:
                    index === selectedModule ? '#0060ca' : '#f3f2ff',
                  marginLeft: 29,
                  justifyContent: 'space-evenly',
                }}>
                <Text
                  style={{
                    color: index === selectedModule ? 'white' : 'black',
                    padding: 10,
                  }}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginTop: -99,
              paddingBottom: 69,
            }}>
            <Text
              style={{
                color: Color.black,
                fontSize: 17,
                opacity: 0.6,
                fontFamily: FontFamily.poppinsMedium,
                marginRight: 2,
              }}>
              {selectedModule + 1}
            </Text>
            <Text
              style={{
                color: Color.black,
                fontSize: 17,
                opacity: 0.6,
                fontFamily: FontFamily.poppinsMedium,
              }}>
              / {allQuestions.length}
            </Text>
          </View>

          {/* Question */}
          {renderQuestion()}

          {/* Options */}
          {renderOptions()}

          {/* Next Button */}
          {renderNextButton()}
        </ScrollView>
        {/* Score Modal */}
        {examType == 'baseline' || examType == 'endline' ? (
          <Modal animationType="slide" transparent={true} visible={modals}>
            <View style={[styles.centeredView]}>
              <View
                style={[
                  styles.modalView,
                  {
                    // height: window.WindowHeigth * 0.7,

                    width: window.WindowWidth * 0.92,
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
                      marginTop: -40,
                    },
                  ]}
                  source={require('../assets/Image/success.gif')}
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
                      width: 200,
                      alignSelf: 'center',
                    },
                  ]}>
                  Congratulations! {''}
                </Text>
                {/* <Text
                        style={{
                          color: 'black',
                          fontWeight: '800',
                          color: '#666666',
                          textTransform: 'capitalize',
                        }}>
                        {user[0].username}
                      </Text> */}

                {examType === 'baseline' ? (
                  <Text
                    style={[
                      styles.username,
                      {
                        fontSize: 14,
                        color: 'black',
                        fontWeight: '400',
                        fontFamily: 'serif',
                        marginTop: 10,
                        FontFamily: FontFamily.poppinsMedium,
                      },
                    ]}>
                    {userdatas[0].username} ଆପଣ ସଫଳତାର ସହ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୁର୍ଣ୍ଣ
                    କରିଥିବାରୁ ୫ଟି କଏନ୍ ହାସଲ କରିଛନ୍ତି।
                    {/* ବିଭାଗରେ{' '}
                    {mark.map(data => (
                      <>
                        {Number(data.technology_score) +
                          Number(data.eng_score) +
                          Number(data.pedagogyscore) +
                          Number(data.odia_score) +
                          Number(data.math_score)}
                        /{' '}
                        {Number(data.totalpedagogyques) +
                          Number(data.totalodiaques) +
                          Number(data.totalengques) +
                          Number(data.totalmathques) +
                          Number(data.totaltechques)}
                        {''}
                      </>
                    ))} */}
                    {/* {/* {''} ମାର୍କ ରଖିଛନ୍ତି ଆପଣ ଆପ୍ଲିକେସନ ଭଲ ଭାବରେ ଜାଣିବା ପରେ
                    ନିଶ୍ଚିତ ଭାବେ ପରବର୍ତ୍ତୀ ମୂଲ୍ୟାଙ୍କନ ରେ ଭଲ ପ୍ରଦର୍ଶନ କରିବେ। */}
                    ବର୍ତ୍ତମାନ ଆପଣ ପ୍ରବେଶ ପେଟିକା ଯାଇପାରିବେ ।
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.username,
                      {
                        fontSize: 16,
                        color: 'black',
                        fontWeight: '400',
                        fontFamily: 'serif',
                        marginTop: 10,
                      },
                    ]}>
                    {userdatas[0].username} ଆପଣ ସଫଳତାର ସହ ଏଣ୍ଡଲାଇନ୍ ସମ୍ପୁର୍ଣ୍ଣ
                    କରିଥିବାରୁ ୫ଟି କଏନ୍ ହାସଲ କରିଛନ୍ତି।
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{
                    backgroundColor: Color.accent,
                    padding: 20,
                    width: '100%',
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Color.blue,
                      fontSize: 20,
                    }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* </View> */}
          </Modal>
        ) : (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showScoreModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: Color.royalblue,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Color.ghostwhite,
                  width: '90%',
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                }}>
                <View>
                  {score > allQuestions.length / 2 ? (
                    <View>
                      <Image
                        // style={styles.tinyLogo}
                        style={{
                          width: 163,
                          height: 159,
                          // alignSelf: 'center',
                          top: '-10%',
                          // top: -520,
                        }}
                        source={require('../assets/Image/success.gif')}
                      />
                      <Text
                        style={{
                          // fontSize: 30,
                          fontWeight: 'bold',
                          color: Color.primary,
                          alignSelf: 'center',
                        }}>
                        {' '}
                        'Congratulations!'
                      </Text>
                    </View>
                  ) : (
                    <Image
                      // style={styles.tinyLogo}
                      style={{
                        width: 163,
                        height: 159,
                        // alignSelf: 'center',
                        top: '-10%',
                        // top: -520,
                      }}
                      source={require('../assets/Image/warn.gif')}
                    />
                  )}
                </View>
                {/* <Text
                style={{
                  // fontSize: 30,
                  fontWeight: 'bold',
                  color: Color.primary,
                }}>
                {score > allQuestions.length / 2 ? (
                  'Congratulations!'
                ) : (
                  
                )}
              </Text> */}
                <View style={{top: 10, paddingBottom: 10}}>
                  {examType == 'baseline' && examType == 'endline' ? null : (
                    <>
                      {score > allQuestions.length / 2 ? (
                        <Text style={{alignSelf: 'center', color: 'black'}}>
                          {userdatas[0].username} ଆପଣ ସଫଳତାର ସହ{' '}
                          <Text
                            style={{
                              fontSize: 20,
                              color:
                                score > allQuestions.length / 2
                                  ? Color.success
                                  : Color.danger,
                            }}>
                            {score}
                          </Text>{' '}
                          /{' '}
                          <Text
                            style={{
                              fontSize: 20,
                              color: Color.black,
                            }}>
                            {allQuestions.length}
                          </Text>{' '}
                          ମାର୍କ ରଖି ଏହି ବିଷୟ ସଂପୂର୍ଣ୍ଣ କରିଛନ୍ତି । ଆପଣ ପରବର୍ତ୍ତୀ
                          ବିଷୟକୁ ଯାଇ ପାରିବେ ଏବଂ ଆପଣ ଭଲ ପ୍ରଦର୍ଶନ କରିବା ଆମେ ଆଶା
                          କରୁଛୁ ।
                        </Text>
                      ) : (
                        <Text style={{alignSelf: 'center', color: 'black'}}>
                          {/* ଆପଣ ମଡ୍ୟୁଲ୍ ଭଲ ଭାବରେ ପଢି ପୁନଃ କୁଇଜ୍ ର ଉତ୍ତର ଦିଅନ୍ତୁ । */}
                          {userdatas[0].username} ଆପଣ {''}
                          <Text
                            style={{
                              fontSize: 20,
                              color:
                                score > allQuestions.length / 2
                                  ? Color.success
                                  : Color.danger,
                            }}>
                            {score}
                          </Text>{' '}
                          /{' '}
                          <Text
                            style={{
                              fontSize: 20,
                              color: Color.black,
                            }}>
                            {allQuestions.length}
                          </Text>{' '}
                          ମାର୍କ ରଖିଛନ୍ତି ଆପଣ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ । ଆପଣ ବିଷୟକୁ
                          ପୁନଃ ପଢି ଉତ୍ତର ଦେଇପାରିବେ
                        </Text>
                      )}
                    </>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginVertical: 20,
                    // flexDirection: 'column',
                    // flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color:
                        score > allQuestions.length / 2
                          ? Color.success
                          : Color.danger,
                    }}>
                    {/* <Text style={{color: 'black', fontSize: 15}}>
                    ଆପଣଙ୍କ ମାର୍କ ହେଲା
                  </Text>{' '}
                  {score} */}
                    {/* <Text
                    style={{
                      fontSize: 20,
                      color: Color.black,
                    }}>
                    / {allQuestions.length}{' '} */}
                    {/* {examType == 'baseline' ? null : (
                      <>
                        {score < allQuestions.length / 2 ? (
                          <Text style={{color: 'black', fontSize: 15}}>
                            । ପୁନର୍ବାର ପ୍ରଶ୍ନ ଗୁଡିକର ଉତ୍ତର ଦିଅନ୍ତୁ ।
                          </Text>
                        ) : (
                          ''
                        )}
                      </>
                    )} */}
                    {/* </Text> */}
                  </Text>
                </View>
                {/* Retry Quiz button */}
                {examType == 'baseline' || examType == 'endline' ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
                    style={{
                      backgroundColor: Color.accent,
                      padding: 20,
                      width: '100%',
                      borderRadius: 20,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: Color.blue,
                        fontSize: 20,
                      }}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {score > allQuestions.length / 2 ? (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.goBack();
                        }}
                        style={{
                          backgroundColor: Color.accent,
                          padding: 20,
                          width: '100%',
                          borderRadius: 20,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: Color.blue,
                            fontSize: 20,
                          }}>
                          Continue
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={restartQuiz}
                        style={{
                          backgroundColor: Color.accent,
                          padding: 20,
                          width: '100%',
                          borderRadius: 20,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: Color.blue,
                            fontSize: 20,
                          }}>
                          Retry Quiz
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
          </Modal>
        )}

        {/* Background Image */}
        {/* <Image
          source={require('../assets/Photos/DottedBG.png')}
          style={{
            width: SIZES.WindowWidth,
            height: 130,
            zIndex: -1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0.5,
          }}
          resizeMode={'contain'}
        /> */}
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default NewQuiz;
const styles = StyleSheet.create({
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
});
