import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Colors from '../utils/Colors';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {FontFamily, Color} from '../GlobalStyle';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Nocontents from './Nocontents';
import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';
const audioPlayer = new AudioRecorderPlayer();
import VideoPlayer from 'react-native-video-player';
import Orientation from 'react-native-orientation-locker';
const SelectFromMultiple = ({
  questions,
  onUpdateQuestions,
  handleSave,
  gamified_status,
  topicName,
  navigation,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null),
  );
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(
    Array(questions.length).fill(false),
  );
  const [isPlaying, setIsPlaying] = useState(null);
  const [loader, setIsLoader] = useState(false);
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {};
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleOptionPress = optionLabel => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionLabel;
    setSelectedOptions(newSelectedOptions);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOption: optionLabel,
      answered: 'yes',
    };

    onUpdateQuestions(updatedQuestions);
    console.log('updatedQuestions--->', updatedQuestions);
    console.log('optionLabel--->', optionLabel);
    const newShowCorrectAnswer = [...showCorrectAnswer];
    newShowCorrectAnswer[currentQuestionIndex] = true;
    setShowCorrectAnswer(newShowCorrectAnswer);
  };

  const handleOptionPressSingle = optionLabel => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionLabel;
    setSelectedOptions(newSelectedOptions);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOption: [optionLabel.toLowerCase()],
      answered: 'yes',
    };

    onUpdateQuestions(updatedQuestions);
    console.log('updatedQuestions--->', updatedQuestions);
    console.log('optionLabel--->', optionLabel);
    const newShowCorrectAnswer = [...showCorrectAnswer];
    newShowCorrectAnswer[currentQuestionIndex] = true;
    setShowCorrectAnswer(newShowCorrectAnswer);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = selectedOptions[currentQuestionIndex];
  console.log('currentQuestion----->', currentQuestion);
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const getOptions = () => {
    const {
      answerType,
      // optionMediaType,
      optionMediaType,
      optionA,
      optionB,
      optionC,
      optionD,
      instructions,
      hints,
    } = currentQuestion;

    console.log('currentQuestion--->', currentQuestion);
    const options = [];

    const optionContent = (label, value) => {
      if (optionMediaType === 'image') {
        return <Image source={{uri: value}} style={styles.optionImage} />;
      }
      return <Text style={styles.optionText}>{value}</Text>;
    };

    if (answerType === '2options') {
      options.push(
        {label: 'a', content: optionContent('a', optionA)},
        {label: 'b', content: optionContent('b', optionB)},
      );
    } else if (answerType === '3options') {
      options.push(
        {label: 'a', content: optionContent('a', optionA)},
        {label: 'b', content: optionContent('b', optionB)},
        {label: 'c', content: optionContent('c', optionC)},
      );
    } else if (answerType === '4options') {
      options.push(
        {label: 'a', content: optionContent('a', optionA)},
        {label: 'b', content: optionContent('b', optionB)},
        {label: 'c', content: optionContent('c', optionC)},
        {label: 'd', content: optionContent('d', optionD)},
      );
    } else if (answerType === 'yesNoOptions') {
      options.push({label: 'yes', value: 'Yes'}, {label: 'no', value: 'No'});
    }

    return options;
  };

  const options = getOptions();

  const getBackgroundColor = optionLabel => {
    if (!showCorrectAnswer[currentQuestionIndex]) return 'white';
    if (optionLabel === currentQuestion.correctOption[0]) return '#0BDA51';
    if (optionLabel === selectedOption) return '#ee585f';
    return 'white';
  };

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

  const openVideoModal = item => {
    setNowPlayingUrl(item.questionMedia);
    Orientation.lockToLandscape();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsVideoPlaying(false); // Pause the main video when modal closes
    Orientation.lockToPortrait();
  };
  const handleVideoLoad = () => {
    return true;
  };

  const back = () => {
    Alert.alert(
      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
      'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
      [
        {
          text: 'Cancel',
          onPress: () => null,

          style: 'default',
        },
        {
          text: 'Ok',
          onPress: () => {
            stopPlayback();
            navigation.goBack();
          },
          style: 'default',
        },
      ],
    );
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => back()}
      transparent={true}
      visible={gamified_status}>
      <View style={[styles.centeredView]}>
        <View
          style={[
            styles.modalView,
            {
              height: window.WindowHeigth * 1,

              width: window.WindowWidth * 2,
            },
          ]}>
          <View
            style={{
              backgroundColor: '#0060ca',
              height: 66,
              width: window.WindowWidth * 1.1,
              alignSelf: 'center',
              marginTop: -12,
              flexDirection: 'row',
              // marginLeft: -20,
              marginBottom: 3,
            }}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                  'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'default',
                    },
                    {
                      text: 'Ok',
                      onPress: () => navigation.goBack(),
                      style: 'default',
                    },
                  ],
                );
              }}>
              <AntDesign
                name="arrowleft"
                size={23}
                style={{left: '122%', marginTop: 25}}
                color="white"
              />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                // marginTop: 15,
                alignSelf: 'center',
                left: '75%',
                top: 5,
              }}>
              {topicName}
            </Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <ImageBackground
              style={[styles.root, {paddingBottom: 50}]}
              source={require('../assets/Photos/assignmentbg.jpg')}
              //   imageStyle={{borderRadius: 60}}
            >
              <ScrollView style={styles.container}>
                {questions?.length > 0 ? (
                  <>
                    <View style={styles.card}>
                      <Text style={styles.question}>
                        ପ୍ରଶ୍ନ ({currentQuestionIndex + 1}).{' '}
                        {currentQuestion.question}
                      </Text>

                      {currentQuestion.instructions?.length > 0 && (
                        <View
                          style={
                            currentQuestion.instructions?.length > 150
                              ? styles.styleBoxl
                              : styles.styleBoxs
                          }>
                          <ScrollView style={{alignSelf: 'center'}}>
                            <Text style={styles.instructionsTitle}>ସୂଚନା</Text>
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
                              : styles.styleBoxs
                          }>
                          <ScrollView
                            style={{alignSelf: 'center', paddingBottom: 50}}>
                            <Text style={styles.hintsTitle}>Hints</Text>
                            <Text style={styles.hintsText}>
                              {currentQuestion.hints}
                            </Text>
                          </ScrollView>
                        </View>
                      )}

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
                                  onPress={() =>
                                    stopPlayback(currentQuestion, 'stop')
                                  }
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
                                  startPlaybackAudio(currentQuestion, 'play')
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
                            <TouchableOpacity
                              onPress={() => openVideoModal(currentQuestion)}>
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

                      {currentQuestion?.questionMediaType === 'image' ? (
                        <ReactNativeZoomableView
                          maxZoom={3}
                          minZoom={1}
                          zoomStep={0.5}
                          initialZoom={1}
                          bindToBorders={true}
                          onZoomAfter={logOutZoomState}
                          style={{
                            padding: 10,
                            // paddingBottom: 5,
                            // backgroundColor: Colors.white,
                          }}>
                          {loadingImage ? (
                            <ActivityIndicator
                              size="large"
                              color={Colors.yourLoaderColor}
                            />
                          ) : (
                            <Image
                              source={{uri: `${currentQuestion.questionMedia}`}}
                              onLoad={() => setLoadingImage(false)}
                              style={{
                                width: window.WindowWidth * 0.9,

                                aspectRatio: 13 / 9,
                                alignSelf: 'center',
                                // paddingTop: 5,
                                // borderWidth: 1.5,
                                // borderColor: Color.royalblue,
                                borderRadius: 10,
                              }}
                            />
                          )}
                        </ReactNativeZoomableView>
                      ) : null}

                      {currentQuestion.answerType === 'yesNoOptions' ? (
                        <View style={styles.radioContainer}>
                          <RadioForm formHorizontal={true} animation={true}>
                            {options.map((option, index) => (
                              <View key={index} style={{marginRight: 20}}>
                                <RadioButton labelHorizontal={true}>
                                  <RadioButtonInput
                                    obj={option}
                                    index={index}
                                    isSelected={selectedOption === option.value}
                                    onPress={() =>
                                      handleOptionPressSingle(option.value)
                                    }
                                    borderWidth={1}
                                    buttonInnerColor={'#0060ca'}
                                    buttonOuterColor={
                                      selectedOption === option.value
                                        ? '#0060ca'
                                        : '#000'
                                    }
                                    buttonSize={15}
                                    buttonStyle={{}}
                                    buttonWrapStyle={{marginLeft: 10}}
                                  />
                                  <RadioButtonLabel
                                    obj={option}
                                    index={index}
                                    labelHorizontal={true}
                                    onPress={() =>
                                      handleOptionPressSingle(option.value)
                                    }
                                    labelStyle={{
                                      fontSize: 15,
                                      color:
                                        selectedOption === option.value
                                          ? '#0060ca'
                                          : '#000',
                                    }}
                                  />
                                </RadioButton>
                              </View>
                            ))}
                          </RadioForm>
                        </View>
                      ) : (
                        <View style={styles.optionsContainer}>
                          <View
                            style={
                              currentQuestion.optionMediaType === 'image'
                                ? styles.optionRow
                                : styles.optionColumn
                            }>
                            {options.slice(0, 2).map((option, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => handleOptionPress(option.label)}
                                disabled={
                                  showCorrectAnswer[currentQuestionIndex]
                                }>
                                <View
                                  style={[
                                    currentQuestion.optionMediaType === 'image'
                                      ? styles.optionImageWrapper
                                      : styles.optionTextWrapper,
                                    {
                                      backgroundColor: getBackgroundColor(
                                        option.label,
                                      ),
                                    },
                                  ]}>
                                  {option.content}
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                          {options.length > 2 && (
                            <View
                              style={
                                currentQuestion.optionMediaType === 'image'
                                  ? styles.optionRow
                                  : styles.optionColumn
                              }>
                              {options.slice(2).map((option, index) => (
                                <TouchableOpacity
                                  key={index + 2}
                                  onPress={() =>
                                    handleOptionPress(option.label)
                                  }
                                  disabled={
                                    showCorrectAnswer[currentQuestionIndex]
                                  }>
                                  <View
                                    style={[
                                      currentQuestion.optionMediaType ===
                                      'image'
                                        ? styles.optionImageWrapper
                                        : styles.optionTextWrapper,
                                      {
                                        backgroundColor: getBackgroundColor(
                                          option.label,
                                        ),
                                      },
                                    ]}>
                                    {option.content}
                                  </View>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      )}

                      <View style={styles.buttonContainer}>
                        {currentQuestionIndex > 0 && (
                          <TouchableOpacity
                            onPress={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            style={[styles.navButton]}>
                            <Image
                              style={styles.navButtonImage}
                              source={require('../assets/Image/arrow-square-left.png')}
                            />
                          </TouchableOpacity>
                        )}
                        {currentQuestionIndex < questions.length - 1 ? (
                          <TouchableOpacity
                            onPress={handleNextQuestion}
                            disabled={!selectedOption}
                            style={styles.navButton}>
                            <Image
                              style={[styles.navButtonImage, {right: -25}]}
                              source={require('../assets/Image/arrow-square-right.png')}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={handleSave}
                            style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>SUBMIT</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </>
                ) : (
                  <Nocontents />
                )}

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
                            top: '45%', // Adjust the position as needed
                            left: '45%', // Adjust the position as needed
                          }}
                        />
                      )}
                      <VideoPlayer
                        video={{
                          uri: nowPlayingUrl,
                        }}
                        style={{
                          width: '100%',
                          height: 300,
                        }}
                        autoplay
                        showDuration
                        onLoad={handleVideoLoad}
                        rate={playbackRate}
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
                {/* ------------------------button section-------------------------- */}
                {/*modal end */}
              </ScrollView>
            </ImageBackground>
          </View>
        </View>
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default SelectFromMultiple;

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
    marginTop: -26,
  },
  radioContainer: {
    top: '10%',
  },
  styleBoxl: {
    borderWidth: 1,
    borderRadius: 20,
    borderStyle: 'dotted',
    width: window.WindowWidth * 0.9,
    alignSelf: 'center',
    overflow: 'scroll',
    marginTop: 12,
    padding: 5,
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
    color: 'black',
    letterSpacing: 1,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
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
    paddingTop: 10,
    paddingBottom: 10,
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
