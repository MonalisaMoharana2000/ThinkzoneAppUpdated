import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
// import RadioButton from 'react-native-simple-radio-button';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Alert,
  Modal,
  StatusBar,
  BackHandler,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Api from '../environment/Api';
import Colors from '../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {FontFamily, Color} from '../GlobalStyle';

import Nocontents from '../components/Nocontents';
const audioPlayer = new AudioRecorderPlayer();
import Video from 'react-native-video';

import Orientation from 'react-native-orientation-locker';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Quiz = ({route}) => {
  const user = useSelector(state => state.UserSlice.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const [selectedOption, setSelectedOption] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(options?.length).fill(null),
  ); // Track selected options

  const [showCorrectAnswer, setShowCorrectAnswer] = useState([]);
  console.log('showCorrectAnswer-------->', selectedOptions);
  const [isPlaying, setIsPlaying] = useState(null);
  const [updatedAnswer, setUpdatedAnswer] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {};
  const data = route?.params?.match;
  console.log('match0000000000>', data);
  const gameData = route?.params?.gamifiedData;
  const navigation = useNavigation();
  const updated = gameData?.filter(
    item => item.gameType === 'selectFromMultiple',
  );
  console.log('updated--->', updated);

  const [questions, setQuestions] = useState(updated);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  console.log('====================================questions', questions);

  const topicData = route?.params?.topicData;
  const wholeData = route.params?.match;

  const handleOptionPress = optionLabel => {
    if (currentQuestion.answered) return;
    if (selectedOptions[currentQuestionIndex]) return;

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionLabel;
    setSelectedOptions(newSelectedOptions);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOption: optionLabel,
      answered: 'yes',
      inputAnswer: optionLabel,
    };

    setUpdatedAnswer(updatedQuestions);
    setQuestions(updatedQuestions);

    const newShowCorrectAnswer = [...showCorrectAnswer];
    newShowCorrectAnswer[currentQuestionIndex] = true;
    setShowCorrectAnswer(newShowCorrectAnswer);
  };

  const handleOptionPressSingle = value => {
    if (currentQuestion.answered) return;
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = value;
    setSelectedOptions(newSelectedOptions);

    // Update the question with the selected option
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOption: value,
      answered: 'yes',
      inputAnswer: value, // Save only the current answer for this question
    };

    setUpdatedAnswer(updatedQuestions);
    setQuestions(updatedQuestions);

    console.log(`Selected option for question ${currentQuestionIndex}:`, value);
  };

  const isOptionSelectedSingle = optionValue => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      currentQuestion.answered &&
      currentQuestion.inputAnswer.includes(optionValue)
    );
  };

  const handleNext = () => {
    if (
      !selectedOptions[currentQuestionIndex] &&
      data?.otherData?.answered === true
    ) {
      Alert.alert(
        'Selection Required',
        'Please choose an option before proceeding.',
        [{text: 'OK'}],
      );
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
    stopOptionPlayback();
  };

  const handlePrev = () => {
    stopOptionPlayback();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {text: 'Cancel', onPress: () => stopOptionPlayback()},
          {
            text: 'Ok',
            onPress: () => {
              navigation.goBack();
              stopOptionPlayback();
            },
            style: 'cancel',
          },
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
  const getBackgroundColor = optionLabel => {
    if (!showCorrectAnswer[currentQuestionIndex]) return 'white';
    if (optionLabel === currentQuestion.correctOption[0]) return '#0BDA51';
    if (optionLabel === selectedOptions) return '#ee585f';
    return 'white';
  };
  const handleSave = async () => {
    console.log('Quiz saved with answers:', selectedOptions);

    console.log('updatedQuestion--------->', updatedAnswer);
    if (!selectedOptions[currentQuestionIndex]) {
      Alert.alert(
        'Selection Required',
        'Please choose an option before proceeding.',
        [{text: 'OK'}],
      );
      return;
    }

    const updatedData = questions.map(item => ({
      ...item,
      answered: true,
    }));

    console.log('updatedData--->', updatedData);

    const body = {
      gamifiedSecuredMarks: 1,
      gamifiedTotalMarks: 3,
      topicId: topicData[0].topicId,
      userid: userid,
      username: username,
      usertype: usertype,
      answered: 'yes',
      managerid: managerid,
      managername: managername,
      passcode: passcode,
      transGamifiedData: updatedData,
      masterGamifiedData: gameData,
      // inputAnswer: shuffle,
    };

    console.log('updatedData--->', updatedData);

    try {
      const res = await Api.post('saveTransTchTrainingGamified', body);
      if (res.status === 200) {
        Alert.alert(res.data.msg, '', [
          {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
        ]);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const options = currentQuestion.correctAnswer[0];
  console.log('userInputData:', JSON.stringify(options, null, 2));


  console.log('Submission Payload:', JSON.stringify(options, null, 2));

  const updatedOptions = {
    // ...options,
    optionA: options.answerType === 'yesNoOptions' ? '' : options.optionA || '',
    optionB: options.answerType === 'yesNoOptions' ? '' : options.optionB || '',
    optionC: options.optionC || '',
    optionD: options.optionD || '',
  };
  console.log('updatedOptions----->', options);

  const stopPlayback = async item => {
    console.log('stop----->', item);
    try {
      setIsLoader(true);
      await audioPlayer.stopPlayer();
      setIsPlaying(null);
      setIsLoader(false);
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  };

  const startPlaybackAudio = async item => {
    try {
      const path = item.questionMedia;
      await audioPlayer.startPlayer(path);
      setIsPlaying(item._id);
      console.log(' playing audio:', path);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  const startOptionPlayback = async key => {
    console.log('key--->', key);
    try {
      // Stop any currently playing audio
      if (isPlaying) {
        await stopPlayback(isPlaying);
      }
      // Start new audio
      const path = updatedOptions[key];
      console.log('path--->', path);

      await audioPlayer.startPlayer(path);
      setIsPlaying(key);
      console.log('Playing audio:', path);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  const stopOptionPlayback = async key => {
    console.log('Stopping audio for:', key);
    try {
      setIsLoader(true);
      await audioPlayer.stopPlayer();
      setIsPlaying(null);
      setIsLoader(false);
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  };
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
  console.log('nowPlayingUrl---->', nowPlayingUrl);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const openVideoModal = item => {
    console.log('item---->', item);
    setNowPlayingUrl(item.gameQuestionMedia);
    Orientation.lockToLandscape();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // setIsVideoPlaying(false); // Pause the main video when modal closes
    Orientation.lockToPortrait();
  };
  const handleVideoLoad = () => {
    return true;
  };

  const optionLabels = [
    'Option A',
    'Option B',
    'Option C',
    'Option D',
    'Option E',
  ];

  return (
    <ScrollView>
      <View style={{flex: 1, padding: 20}}>
        {/* Display Question */}
        <Text style={styles.question}>
          ପ୍ରଶ୍ନ ({currentQuestionIndex + 1}). {currentQuestion.question}
        </Text>

        {currentQuestion.instructions?.length > 0 && (
          <View
            style={
              currentQuestion.instructions?.length > 150
                ? styles.styleBoxl
                : styles.styleBoxl
            }>
            <ScrollView style={{alignSelf: 'center', paddingBottom: 30}}>
              <Text style={styles.instructionsTitle}>Instruction</Text>
              <Text style={styles.instructionsText}>
                {currentQuestion.instructions}
              </Text>
            </ScrollView>
          </View>
        )}

        {currentQuestion.hints?.length > 0 && (
          <View
            style={
              currentQuestion.hints?.length > 150
                ? styles.styleBoxl
                : styles.styleBoxl
            }>
            <ScrollView style={{alignSelf: 'center', paddingBottom: 30}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#0056b3',
                  marginBottom: 5,
                  textAlign: 'center',
                  fontSize: 18,
                  letterSpacing: 1,
                  fontWeight: '600',
                  paddingTop: 7,
                  paddingBottom: 5,
                  alignSelf: 'center',
                  marginLeft: 3,
                }}>
                Hints
              </Text>
              <Text style={styles.hintsText}>{currentQuestion.hints}</Text>
            </ScrollView>
          </View>
        )}

        {/* Display Image if media exists */}
        {currentQuestion?.questionMediaType === 'audio' ? (
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: window.WindowWidth * 0.8,
                paddingBottom: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Color.royalblue,
                paddingTop: 20,
              }}>
              {isPlaying === currentQuestion._id ? (
                <>
                  <TouchableOpacity
                    onPress={() => stopPlayback(currentQuestion, 'stop')}
                    style={{
                      top: '8%',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Image
                        style={{
                          width: 40,
                          top: -8,
                          height: 40,
                          left: 20,

                          paddingBottom: 10,
                          alignSelf: 'flex-start',
                        }}
                        source={require('../assets/Image/stops.png')}
                      />
                    </View>
                    <View>
                      <Image
                        style={{
                          width: 200,
                          top: -55,
                          height: 80,
                          left: 40,

                          paddingBottom: 10,
                          alignSelf: 'flex-start',
                        }}
                        source={require('../assets/Image/waves.gif')}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={{
                    top: '8%',
                    flexDirection: 'row',
                  }}
                  onPress={() => startPlaybackAudio(currentQuestion, 'play')}>
                  <Image
                    style={{
                      width: 40,
                      top: -30,
                      height: 40,
                      left: 20,

                      paddingBottom: 10,
                      alignSelf: 'flex-start',
                    }}
                    source={require('../assets/Image/Player.png')}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      color: 'black',
                      fontFamily: FontFamily.poppinsMedium,
                      left: 20,
                      top: -23,
                    }}>
                    {' '}
                    Play Audio
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        {currentQuestion?.questionMediaType === 'video' ? (
          <View
            style={{
              width: '100%',
              paddingBottom: 40,
              // backgroundColor: 'white',
              // borderRadius: 10,

              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
              alignSelf: 'center',
            }}>
            <View style={{aspectRatio: 17 / 9}}>
              <TouchableOpacity onPress={() => openVideoModal(currentQuestion)}>
                <Image
                  style={{
                    width: 336,
                    top: 2,
                    height: 181,

                    backgroundColor: 'white',
                    paddingBottom: 20,

                    borderColor: 'black',

                    alignSelf: 'center',
                  }}
                  source={require('../assets/Image/thumbnail.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <Modal
          animationType="slide"
          transparent={false}
          onRequestClose={closeModal}
          visible={modalVisible}>
          <StatusBar hidden />
          <ScrollView>
            <View style={{flex: 1}}>
              {videoLoading && (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{
                    position: 'absolute',
                    top: '45%', // Adjust the position as needed
                    left: '45%', // Adjust the position as needed
                  }}
                />
              )}
              <Video
                source={{
                  uri: nowPlayingUrl,
                }}
                style={{
                  width: '100%',
                  height: 300,
                }}
                autoplay
                showDuration
                onLoad={handleVideoLoad}
                rate={playbackRate} // Apply the playback rate here
              />
              <TouchableOpacity onPress={closeModal}>
                <Image
                  style={{
                    width: 40,
                    top: 2,
                    height: 40,
                    backgroundColor: 'white',
                    paddingBottom: 10,
                    alignSelf: 'flex-end',
                  }}
                  source={require('../assets/Image/minimize.png')}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>

        {currentQuestion?.questionMediaType === 'image'
          ? (console.log(
              'image---------------------------->',
              currentQuestion.gameQuestionMedia,
            ),
            (
              <ReactNativeZoomableView
                maxZoom={3}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={logOutZoomState}
                style={
                  {
                    // padding: 10,
                  }
                }>
                {loadingImage ? (
                  <ActivityIndicator
                    size="large"
                    color={Colors.yourLoaderColor}
                  />
                ) : (
                  <Image
                    source={{uri: currentQuestion.gameQuestionMedia}}
                    onLoad={() => setLoadingImage(false)}
                    resizeMode="contain"
                    style={{
                      width: window.WindowWidth * 0.9,
                      aspectRatio: 13 / 9,
                      alignSelf: 'center',
                      // paddingTop: 5,
                      // borderWidth: 1.5,
                      // borderColor: Color.royalblue,
                      // borderRadius: 5,
                    }}
                  />
                )}
              </ReactNativeZoomableView>
            ))
          : null}

        {/* Display Options in a vertical layout */}
        <View
          style={{
            // marginVertical: 10,
            flexDirection:
              options.optionMediaType === 'image' ? 'row' : 'column',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {Object.keys(updatedOptions)
            .filter(
              key => key.startsWith('option') && updatedOptions[key] !== '',
            )
            .map((key, index) => {
              const isAnswered = currentQuestion?.answered;
              const isSelected =
                isAnswered && currentQuestion?.inputAnswer?.includes(key);

              return (
                <TouchableOpacity
                  disabled={
                    options.optionMediaType !== 'image' ||
                    Boolean(selectedOptions[currentQuestionIndex])
                  }
                  key={index}
                  onPress={() => handleOptionPress(key)}
                  style={{
                    width: options.optionMediaType === 'image' ? '48%' : '100%',
                    marginVertical: 5,
                    backgroundColor: isSelected
                      ? options.correctOption.includes(key)
                        ? '#32cd32' // Correct option selected
                        : 'red' // Incorrect option selected
                      : selectedOptions[currentQuestionIndex]
                      ? selectedOptions[currentQuestionIndex] === key
                        ? options.correctOption.includes(key)
                          ? '#32cd32' // Correct option selected
                          : 'red' // Incorrect option selected
                        : options.correctOption.includes(key)
                        ? '#32cd32' // Correct option, not selected
                        : 'white' // Incorrect option, not selected
                      : 'white', // Disable background for non-image option
                    padding: 10,
                    borderRadius: 6,
                  }}>
                  {options.optionMediaType === 'image' ? (
                    <Image
                      source={{uri: updatedOptions[key]}}
                      style={{
                        width: '100%',
                        aspectRatio: 1,
                        alignSelf: 'center',
                      }}
                    />
                  ) : options.optionMediaType === 'audio' ? (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor:
                          // selectedOptions[currentQuestionIndex] === key
                          //   ? '#32cd32'
                          //   :
                          'white',
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        borderRadius: 12,
                        borderWidth:
                          selectedOptions[currentQuestionIndex] === key ? 0 : 1,
                        borderColor: '#ccc',
                        shadowColor: 'black',
                        shadowOffset: {width: 2, height: 2},
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        width: '100%',
                        elevation: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <RadioForm animation={true}>
                        <RadioButton>
                          <RadioButtonInput
                            obj={{label: updatedOptions[key], value: key}}
                            index={index}
                            isSelected={
                              isAnswered &&
                              currentQuestion.inputAnswer.includes(key)
                            }
                            onPress={() => handleOptionPress(key)}
                            borderWidth={1}
                            buttonInnerColor={'#0060ca'}
                            buttonOuterColor={
                              isAnswered &&
                              currentQuestion.inputAnswer.includes(key)
                                ? '#0060ca'
                                : '#000'
                            }
                            buttonSize={15}
                          />
                        </RadioButton>
                      </RadioForm>
                      <TouchableOpacity
                        onPress={() => {
                          if (isPlaying === key) {
                            // If the same option is clicked while playing, stop the audio
                            stopOptionPlayback(key);
                          } else {
                            // Start playback for the selected option and stop any currently playing audio
                            // if (isPlaying) stopOptionPlayback();
                            startOptionPlayback(key);
                          }
                          // setSelectedOptions(prevState => {
                          //   const newState = [...prevState];
                          //   newState[currentQuestionIndex] = key; // Set the selected option for the current question index
                          //   return newState;
                          // });
                        }}>
                        {isPlaying === key ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {/* Display both waves.gif and stops.png while playing */}
                            <Image
                              source={require('../assets/Image/waves.gif')}
                              style={{width: 30, height: 30, marginRight: 5}}
                            />
                            <Image
                              source={require('../assets/Image/stops.png')}
                              style={{width: 30, height: 30}}
                            />
                          </View>
                        ) : (
                          // Display Player.png when audio is not playing
                          <Image
                            source={require('../assets/Image/Player.png')}
                            style={{width: 30, height: 30, marginRight: 10}}
                          />
                        )}
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color:
                            // selectedOptions[currentQuestionIndex] === key
                            //   ? 'white'
                            //   :
                            '#333',
                          textAlign: 'left',
                        }}>
                        {optionLabels[index]}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleOptionPress(key)}
                      style={{
                        // backgroundColor: isSelected
                        //   ? options.correctOption.includes(key)
                        //     ? '#32cd32' // Correct option selected
                        //     : 'red' // Incorrect option selected
                        //   : selectedOptions[currentQuestionIndex] === key
                        //   ? 'red'
                        //   : options.correctOption.includes(key)
                        //   ? '#32cd32'
                        //   : '#f0f0f0',
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        borderRadius: 12,
                        borderWidth:
                          selectedOptions[currentQuestionIndex] === key ? 0 : 1,
                        borderColor: '#ccc',
                        // shadowColor: 'black',
                        // shadowOffset: {width: 2, height: 2},
                        // shadowOpacity: 0.2,
                        // shadowRadius: 4,
                        width: '100%',
                        // elevation: 5, // For Android shadow
                      }}>
                      <Text
                        style={{
                          fontSize: 16, // Larger text for readability
                          fontWeight: '600', // Medium bold font
                          color:
                            isSelected ||
                            selectedOptions[currentQuestionIndex] === key
                              ? 'white'
                              : '#333', // White text for selected, dark text for unselected
                          textAlign: 'left',
                        }}>
                        {updatedOptions[key]}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}

          {options?.answerType === 'yesNoOptions' && (
            <View style={styles.radioContainer}>
              <RadioForm formHorizontal={true} animation={true}>
                {['Yes', 'No'].map((optionValue, index) => (
                  <View key={index} style={{marginRight: 20}}>
                    <RadioButton labelHorizontal={true}>
                      <RadioButtonInput
                        obj={{label: optionValue, value: optionValue}}
                        index={index}
                        isSelected={isOptionSelectedSingle(optionValue)}
                        onPress={() => handleOptionPressSingle(optionValue)}
                        borderWidth={1}
                        buttonInnerColor={'#0060ca'}
                        buttonOuterColor={
                          isOptionSelectedSingle(optionValue)
                            ? '#0060ca'
                            : '#000' // Updated to use helper function
                        }
                        buttonSize={15}
                        buttonStyle={{}}
                        buttonWrapStyle={{marginLeft: 10}}
                      />
                      <RadioButtonLabel
                        obj={{label: optionValue, value: optionValue}}
                        index={index}
                        labelHorizontal={true}
                        onPress={() => handleOptionPressSingle(optionValue)}
                        labelStyle={{
                          fontSize: 15,
                          color: isOptionSelectedSingle(optionValue)
                            ? '#0060ca'
                            : '#000',
                        }}
                      />
                    </RadioButton>
                  </View>
                ))}
              </RadioForm>
            </View>
          )}
        </View>

        {/* Button Controls */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* Prev Button */}
          {currentQuestionIndex > 0 && (
            <Button title="Prev" onPress={handlePrev} />
          )}

          {/* Next or Save Button */}
          {currentQuestionIndex < questions.length - 1 ? (
            <Button title="Next" onPress={handleNext} />
          ) : data?.otherData?.answered === true ? null : (
            <Button title="Submit" onPress={handleSave} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Quiz;
const styles = StyleSheet.create({
  root: {
    // width: window.WindowWidth,
    height: window.WindowHeigth,
    // // display: 'flex',
    // // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingBottom: 30,
    top: '-1%',
  },
  container: {
    alignSelf: 'center',
    flex: 1,
    padding: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  card: {
    borderRadius: 8,
    width: SIZES.WindowWidth * 1,
    padding: 16,
    margin: 8,
  },
  question: {
    fontSize: 20,
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
    fontWeight: '600',
    // marginTop: -10,
  },
  radioContainer: {
    top: '10%',
  },
  styleBoxl: {
    borderWidth: 1,
    // borderRadius: 20,
    // borderStyle: 'dotted',
    width: window.WindowWidth * 0.9,
    alignSelf: 'center',
    overflow: 'scroll',
    marginTop: 12,
    padding: 5,
    backgroundColor: '#eef6ff',
    borderColor: '#cce0ff',
    marginBottom: 15,
  },
  styleBoxs: {
    borderWidth: 1,
    borderRadius: 20,
    width: window.WindowWidth * 0.9,
    alignItems: 'baseline',
    marginTop: 12,
  },
  instructionsTitle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: '#0056b3',
    letterSpacing: 1,
    fontWeight: '600',
    paddingTop: 7,
    paddingBottom: 5,
    alignSelf: 'center',
    marginLeft: 3,
  },
  instructionsText: {
    textAlign: 'center',
    fontSize: 15,
    padding: '2%',
    margin: '2%',
  },
  hintsTitle: {
    fontSize: 18,
    color: 'black',
    letterSpacing: 1,
    fontWeight: '600',
    paddingTop: 7,
    paddingBottom: 5,
    alignSelf: 'center',
    marginLeft: 3,
  },
  hintsText: {
    textAlign: 'center',
    fontSize: 15,
    padding: '2%',
    margin: '2%',
  },
  optionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignSelf: 'center',
  },
  optionColumn: {
    flexDirection: 'column',
    width: '100%',
  },
  optionImageWrapper: {
    padding: 5,
    paddingLeft: -10,
    paddingRight: -20,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  optionTextWrapper: {
    padding: 15,
    margin: 5,
    borderRadius: 35,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Color.royalblue,
    // color: 'white',
  },
  optionText: {
    fontSize: 18,
    //color: 'white',
  },
  optionImage: {
    // width: 800,
    aspectRatio: 8 / 6.2, // Use fixed width
    height: 100, // Use fixed height
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    marginTop: 19,
    width: '30%',
    // alignItems: 'flex-end',
    padding: 10,
    borderRadius: 5,
    padding: '5%',
  },
  navButtonImage: {
    marginTop: 2,
    marginLeft: 5,
    width: 42,
    height: 42,
    position: 'absolute',
    left: 25,
  },
  saveButton: {
    marginTop: 28,
    width: window.WindowWidth * 0.22,
    height: window.WindowHeigth * 0.05,
    backgroundColor: Color.royalblue,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '700',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 11,
    color: Color.white,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: FontFamily.poppinsMedium,
  },
});
