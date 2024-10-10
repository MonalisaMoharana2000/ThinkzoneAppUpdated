import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
// import Color from '../utils/Colors';
import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';

const QzLs = ({questions, onend_quiz, navigation}) => {
  const allQuestions = questions;
  // console.log('allQuestions--->', allQuestions.length);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [text, setText] = useState('');

  const validateAnswer = selectedOption => {
    let correct_option = allQuestions[currentQuestionIndex]['answer'];
    questions[currentQuestionIndex]['selectedOption'] = selectedOption;
    // console.log(questions, 'questions');
    // console.log(
    //   correct_option,
    //   'correct_option',
    //   selectedOption,
    //   'selectedOption',
    // );
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    // setIsOptionsDisabled(true);
    if (selectedOption == correct_option) {
      // Set Score
      setScore(score + 1);
    }
    // Show Next Button
    setShowNextButton(true);
  };
  const textChange = text => {
    setText(text);
    if (text.length > 5) {
      questions[currentQuestionIndex]['inputans'] = text;

      setShowNextButton(true);
    } else if (text.length == 0) {
      console.log('text---->', text.length);
      setShowNextButton(false);
    }
  };
  const handleNext = () => {
    setText('');
    if (currentQuestionIndex == allQuestions.length - 1) {
      // Last Question
      // Show Score Modal
      onend_quiz(score, allQuestions.length, questions);
      navigation.navigate('home');
      //   setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      setShowNextButton(false);
    }
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  const restartQuiz = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
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
      <View
        style={{
          marginVertical: 40,
        }}>
        {/* Question Counter */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <Text
            style={{
              color: Color.black,
              fontSize: 20,
              opacity: 0.6,
              marginRight: 2,
            }}>
            {currentQuestionIndex + 1}
          </Text>
          <Text style={{color: Color.black, fontSize: 18, opacity: 0.6}}>
            / {allQuestions.length}
          </Text>
        </View>

        {/* Question */}
        <Text
          style={{
            color: Color.black,
            fontSize: 20,
            paddingTop: 10,
          }}>
          {allQuestions[currentQuestionIndex]?.question}
        </Text>
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
    return (
      <>
        {allQuestions[currentQuestionIndex]['questiontype'] == 'subjective' ? (
          <View>
            <TextInput
              style={{
                // height: 40,
                fontSize: 15,
                textAlign: 'center',
                color: '#666666',
                fontFamily: FontFamily.poppinsMedium,
                fontWeight: 'bold',
                // marginTop: 20,
                borderColor: Color.black,
                width: window.WindowWidth * 0.8,
                height: 80,
                margin: 15,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: Color.ghostwhite,
                justifyContent: 'center',
              }}
              allowFontScaling={false}
              placeholder="Type here to translate!"
              onChangeText={newText => textChange(newText)}
              defaultValue={text}
            />
          </View>
        ) : (
          <View>
            {/* {allQuestions[currentQuestionIndex]?.map(option => ( */}
            {allQuestions[currentQuestionIndex]?.A != '' && (
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
                      ? Color.greyPrimary
                      : Color.secondary + '40',
                  backgroundColor:
                    'A' == currentOptionSelected
                      ? Color.greyPrimary + '20'
                      : Color.secondary + '20',
                  height: 55,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text style={{fontSize: 15, color: Color.black}}>
                  {allQuestions[currentQuestionIndex]?.A}
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
          color: Color.white,
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
          color: Color.white,
          fontSize: 20,
        }}
      />
    </View>
  ) : null} */}
              </TouchableOpacity>
            )}

            {allQuestions[currentQuestionIndex]?.B != '' && (
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
                      ? Color.greyPrimary
                      : Color.secondary + '40',
                  backgroundColor:
                    'B' == currentOptionSelected
                      ? Color.greyPrimary + '20'
                      : Color.secondary + '20',
                  height: 55,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text style={{fontSize: 15, color: Color.black}}>
                  {allQuestions[currentQuestionIndex]?.B}
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

            {allQuestions[currentQuestionIndex]?.C != '' && (
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
                      ? Color.greyPrimary
                      : Color.secondary + '40',
                  backgroundColor:
                    'C' == currentOptionSelected
                      ? Color.greyPrimary + '20'
                      : Color.secondary + '20',
                  height: 55,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text style={{fontSize: 15, color: Color.black}}>
                  {allQuestions[currentQuestionIndex]?.C}
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

            {allQuestions[currentQuestionIndex].D == '' ? (
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
                      ? Color.greyPrimary
                      : Color.secondary + '40',
                  backgroundColor:
                    'D' == currentOptionSelected
                      ? Color.greyPrimary + '20'
                      : Color.secondary + '20',
                  height: 55,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text style={{fontSize: 15, color: Color.black}}>
                  {allQuestions[currentQuestionIndex]?.D}
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
                    color: Color.white,
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
                    color: Color.white,
                    fontSize: 20,
                  }}
                />
              </View>
            ) : null} */}
              </TouchableOpacity>
            )}

            {/* ))} */}
          </View>
        )}
      </>
    );
  };
  const renderNextButton = () => {
    // console.log('currentQuestionIndex--->', currentQuestionIndex + 1);
    if (showNextButton) {
      return (
        <>
          {
            allQuestions.length == currentQuestionIndex + 1 ? (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  marginTop: 20,
                  width: '50%',
                  backgroundColor: Color.royalblue,
                  padding: 20,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: Color.white,
                    textAlign: 'center',
                  }}>
                  SUBMIT
                </Text>
              </TouchableOpacity>
            ) : (
              //  return (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  marginTop: 20,
                  width: '100%',
                  backgroundColor: Color.royalblue,
                  padding: 20,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: Color.white,
                    textAlign: 'center',
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            )
            // );
          }
        </>
      );
    } else {
      return null;
    }
  };

  const [progress, setProgress] = useState(new Animated.Value(0));
  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestions.length],
    outputRange: ['0%', '100%'],
  });
  const renderProgressBar = () => {
    return (
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
    );
  };

  return (
    <SafeAreaView>
      {/* <StatusBar barStyle="light-content" backgroundColor={Color.royalblue} /> */}
      {/* <ScrollView> */}
      <View
        style={{
          //  flex: 1,
          height: SIZES.WindowHeigth,
          width: SIZES.WindowWidth,
          paddingVertical: 100,
          paddingHorizontal: 16,
          // backgroundColor: Color.ghostwhite,
          //  position: 'absolute',
        }}>
        <ScrollView>
          {/* ProgressBar */}
          {renderProgressBar()}

          {/* Question */}
          {renderQuestion()}

          {/* Options */}
          {renderOptions()}

          {/* Next Button */}
          {renderNextButton()}
        </ScrollView>
        {/* Score Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showScoreModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: Color.ghostwhite,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: Color.white,
                width: '90%',
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: Color.royalblue,
                }}>
                {score > allQuestions.length / 2 ? 'Congratulations!' : 'Oops!'}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginVertical: 20,
                }}>
                <Text
                  style={{
                    fontSize: 30,
                    color:
                      score > allQuestions.length / 2
                        ? Color.success
                        : Color.danger,
                  }}>
                  {score}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: Color.black,
                  }}>
                  / {allQuestions.length}
                </Text>
              </View>
              {/* Retry Quiz button */}
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
            </View>
          </View>
        </Modal>

        {/* Background Image */}
        <Image
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
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default QzLs;
