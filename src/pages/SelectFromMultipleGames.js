import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Api from '../environment/Api';
import Colors from '../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';

import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {FontFamily, Color} from '../GlobalStyle';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Nocontents from '../components/Nocontents';
const audioPlayer = new AudioRecorderPlayer();

import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';

const Quiz = ({route}) => {
  const user = useSelector(state => state.UserSlice.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const [selectedOption, setSelectedOption] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState([]);
  console.log('showCorrectAnswer-------->', showCorrectAnswer);
  const [updatedAnswer, setUpdatedAnswer] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {};
  const data = route?.params?.match;
  const gameData = route?.params?.gamifiedData;
  const navigation = useNavigation();
  const updated = gameData?.filter(
    item => item.gameType === 'selectFromMultiple',
  );
  console.log('updated--->', updated);
  const [isPlaying, setIsPlaying] = useState(null);
  const [questions, setQuestions] = useState(updated);
  console.log('==============questions', questions);

  const topicData = route?.params?.topicData;
  const wholeData = route.params?.match;

  const handleOptionPress = optionLabel => {
    if (selectedOptions[currentQuestionIndex]) return; // Prevent multiple selections

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionLabel;
    setSelectedOptions(newSelectedOptions);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOption: optionLabel,
      answered: 'yes',
      inputAnswer: newSelectedOptions,
    };

    setUpdatedAnswer(updatedQuestions);
    setQuestions(updatedQuestions);

    const newShowCorrectAnswer = [...showCorrectAnswer];
    newShowCorrectAnswer[currentQuestionIndex] = true;
    setShowCorrectAnswer(newShowCorrectAnswer);
  };
  const handleOptionPressSingle = value => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = value;
    setSelectedOptions(newSelectedOptions);

    // Update the question with the selected option
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOption: value,
      answered: 'yes',
    };

    setUpdatedAnswer(updatedQuestions);
    setQuestions(updatedQuestions);

    console.log(`Selected option for question ${currentQuestionIndex}:`, value);
  };

  const isOptionSelectedSingle = optionLabel => {
    return selectedOptions[currentQuestionIndex] === optionLabel;
  };
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const getBackgroundColor = optionLabel => {
    if (!showCorrectAnswer[currentQuestionIndex]) return 'white';
    if (optionLabel === currentQuestion.correctOption[0]) return '#0BDA51';
    if (optionLabel === selectedOptions) return '#ee585f';
    return 'white';
  };
  const handleSave = async () => {
    console.log('Quiz saved with answers:', selectedOptions);

    console.log('updatedQuestion--------->', updatedAnswer);

    const updatedData = questions.map(item => ({
      ...item,
      answered: true,
    }));

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
  console.log('options-------->', options);

  const updatedOptions = {
    // ...options,
    optionA: options.answerType === 'yesNoOptions' ? '' : options.optionA || '',
    optionB: options.answerType === 'yesNoOptions' ? '' : options.optionB || '',
    optionC: options.optionC || '',
    optionD: options.optionD || '',
  };
  console.log('updatedOptions----->', updatedOptions);

  const stopPlayback = async (audioPath, itemId) => {
    console.log('=========audioPath', audioPath);
    console.log('itemIditemId========', itemId);
    try {
      await audioPlayer.stopPlayer();
      setIsPlaying(null);
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  };

  const startPlaybackAudio = async (audioPath, itemId) => {
    console.log('=========audioPath', audioPath);
    console.log('itemIditemId========', itemId);

    try {
      await audioPlayer.startPlayer(audioPath);
      setIsPlaying(itemId); // Set the playing state for the current item
      console.log('Playing audio:', audioPath);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  const openVideoModal = item => {
    console.log('video------->', item);
    setNowPlayingUrl(item.questionMedia);
    Orientation.lockToLandscape();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);

    Orientation.lockToPortrait();
  };
  const handleVideoLoad = () => {
    return true;
  };

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
            .map((key, index) => (
              <TouchableOpacity
                disabled={
                  options.optionMediaType !== 'image' ||
                  selectedOptions[currentQuestionIndex]
                }
                key={index}
                onPress={() => handleOptionPress(key)}
                style={{
                  width: options.optionMediaType === 'image' ? '48%' : '100%',
                  marginVertical: 5,
                  backgroundColor:
                    options.optionMediaType === 'image'
                      ? selectedOptions[currentQuestionIndex]
                        ? selectedOptions[currentQuestionIndex] ===
                          options.correctOption
                          ? options.correctOption === key
                            ? '#32cd32' // Correct option selected
                            : 'white' // Incorrect option, unselected
                          : selectedOptions[currentQuestionIndex] === key
                          ? 'red' // Incorrect option selected
                          : options.correctOption === key
                          ? '#32cd32' // Correct option, not selected
                          : 'white'
                        : 'white' // No option selected yet
                      : 'transparent', // Disable background for non-image option
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
                  <>
                    {isPlaying === key ? (
                      <>
                        <TouchableOpacity
                          onPress={() => stopPlayback(updatedOptions[key], key)}
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
                        onPress={() =>
                          startPlaybackAudio(updatedOptions[key], key)
                        }>
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
                  </>
                ) : (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleOptionPress(key)}
                    style={{
                      backgroundColor: selectedOptions[currentQuestionIndex]
                        ? selectedOptions[currentQuestionIndex] ===
                          options.correctOption
                          ? options.correctOption === key
                            ? '#32cd32'
                            : 'white'
                          : selectedOptions[currentQuestionIndex] === key
                          ? 'red'
                          : options.correctOption === key
                          ? '#32cd32'
                          : '#f0f0f0'
                        : '#f0f0f0',
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
                      elevation: 5, // For Android shadow
                    }}>
                    <Text
                      style={{
                        fontSize: 16, // Larger text for readability
                        fontWeight: '600', // Medium bold font
                        color:
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
            ))}

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
          ) : (
            <Button title="Submit" onPress={handleSave} />
          )}
        </View>
      </View>

      {/* ------------------------Video Modal section-------------------------- */}
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
                  top: '45%',
                  left: '45%',
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
              // rate={playbackRate} // Apply the playback rate here
            />
            {/* <Button
                              title="Increase Speed"
                              onPress={increasePlaybackSpeed}
                            />
                            <Button
                              title="Decrease Speed"
                              onPress={decreasePlaybackSpeed}
                            /> */}
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
