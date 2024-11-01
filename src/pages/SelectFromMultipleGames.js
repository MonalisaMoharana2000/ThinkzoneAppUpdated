import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import * as window from '../utils/dimensions';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Video from 'react-native-video';
import {FontFamily, Color} from '../GlobalStyle';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
const audioPlayer = new AudioRecorderPlayer();

const QuestionComponent = ({route}) => {
  const user = useSelector(state => state.UserSlice.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const navigation = useNavigation();
  const gameData = route?.params?.gamifiedData;

  const updated = gameData?.filter(
    item => item.gameType === 'selectFromMultiple',
  );

  const [questions, setQuestions] = useState(updated);
  console.log('questions-------->', questions);
  console.log('==============questions2', questions[1]?.correctAnswer);
  console.log('==============questions3', questions[1]?.inputAnswer);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [optionColors, setOptionColors] = useState({});
  const [isPlaying, setIsPlaying] = useState(null);
  const handleOptionSelect = option => {
    if (isAnswered) return;

    const correctOption =
      questions[currentIndex].correctAnswer[0].correctOption[0];
    setSelectedOptions({
      ...selectedOptions,
      [currentIndex]: option,
    });
    setIsAnswered(true);

    setOptionColors({
      ...optionColors,
      [option]: option === correctOption ? 'green' : 'red',
    });

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      inputAnswer: [
        {
          ...updatedQuestions[currentIndex].correctAnswer[0],
          selectedOption: [option],
        },
      ],
    };

    setQuestions(updatedQuestions);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetState(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetState(currentIndex - 1);
    }
  };

  const resetState = newIndex => {
    const selectedOption = selectedOptions[newIndex];
    setIsAnswered(!!selectedOption);
    setOptionColors({
      [selectedOption]:
        selectedOption === questions[newIndex].correctAnswer[0].correctOption[0]
          ? 'green'
          : 'red',
    });
  };

  const stopPlayback = async (audioPath, itemId) => {
    console.log('=========audioPath', audioPath);
    console.log('itemIditemId========', itemId);
    try {
      await audioPlayer.stopPlayer();
      setIsPlaying(null);
      setOptionColors(prevColors => ({
        ...prevColors,
        [itemId]: 'white',
      }));
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  };

  const startPlaybackAudio = async (audioPath, itemId) => {
    console.log('=========audioPath', audioPath);
    console.log('itemIditemId========', itemId);

    try {
      if (isPlaying !== null && isPlaying !== itemId) {
        await stopPlayback();
      }
      await audioPlayer.startPlayer(audioPath);
      setIsPlaying(itemId); // Set the playing state for the current item

      setOptionColors(prevColors => ({
        ...prevColors,
        [itemId]: 'green',
      }));

      console.log('Playing audio:', audioPath);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };
  const isOptionSelectedSingle = optionLabel => {
    return selectedOptions[currentIndex] === optionLabel;
  };

  const handleOptionPressSingle = optionValue => {
    if (isAnswered) return;

    const correctOption =
      questions[currentIndex].correctAnswer[0].correctOption[0];

    const isCorrect = optionValue === correctOption;

    setSelectedOptions({
      ...selectedOptions,
      [currentIndex]: optionValue,
    });
    setOptionColors(prevColors => ({
      ...prevColors,
      Yes: optionValue === 'Yes' ? (isCorrect ? 'green' : 'red') : 'white', // Sets 'Yes' color
      No: optionValue === 'No' ? (isCorrect ? 'green' : 'red') : 'white', // Sets 'No' color
    }));

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      inputAnswer: [
        {
          ...updatedQuestions[currentIndex].correctAnswer[0],
          selectedOption: [optionValue],
        },
      ],
    };

    setQuestions(updatedQuestions);
  };

  const renderOption = (optionKey, optionValue) => {
    if (!optionValue) return null;

    return (
      <TouchableOpacity
        key={optionKey}
        style={[
          styles.option,
          selectedOptions[currentIndex] === optionKey && {
            backgroundColor: optionColors[optionKey],
          },
        ]}
        onPress={() => handleOptionSelect(optionKey)}
        disabled={isAnswered}>
        {questions[currentIndex].correctAnswer[0].optionMediaType ===
        'image' ? (
          <View
            style={{
              // marginVertical: 10,
              flexDirection:
                questions[currentIndex].correctAnswer[0].optionMediaType
                  ?.optionMediaType === 'image'
                  ? 'row'
                  : 'column',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <Image source={{uri: optionValue}} style={styles.optionImage} />
          </View>
        ) : questions[currentIndex].correctAnswer[0].optionMediaType ===
          'audio' ? (
          <>
            {isPlaying === optionKey ? (
              <>
                <TouchableOpacity
                  onPress={() => stopPlayback(optionValue, optionKey)}
                  style={{
                    top: '8%',
                    flexDirection: 'row',
                    backgroundColor: optionColors[optionKey] || 'white',
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
                  backgroundColor: optionColors[optionKey] || 'white',
                }}
                onPress={() => startPlaybackAudio(optionValue, optionKey)}>
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
        ) : questions[currentIndex].correctAnswer[0]?.optionMediaType ===
            'text' &&
          questions[currentIndex].correctAnswer[0]?.answerType ===
            'yesNoOptions' ? (
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
                        isOptionSelectedSingle(optionValue) ? '#0060ca' : '#000'
                      }
                      buttonSize={15}
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
        ) : (
          <TouchableOpacity
            key={optionKey}
            onPress={() => handleOptionSelect(optionKey)}
            style={[
              styles.option,
              selectedOptions[currentIndex] === optionKey && {
                backgroundColor: optionColors[optionKey],
              },
            ]}>
            <Text
              style={{
                fontSize: 16, // Larger text for readability
                fontWeight: '600', // Medium bold font
                color:
                  selectedOptions[currentIndex] === optionKey
                    ? 'white'
                    : '#333', // White text for selected, dark text for unselected
                textAlign: 'left',
              }}>
              {optionValue}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderQuestion = ({item}) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>
        ପ୍ରଶ୍ନ ({currentIndex + 1}). {item.question}
      </Text>

      {item.instructions?.length > 0 && (
        <View
          style={
            item.instructions?.length > 150
              ? styles.styleBoxl
              : styles.styleBoxl
          }>
          <ScrollView style={{alignSelf: 'center', paddingBottom: 30}}>
            <Text style={styles.instructionsTitle}>Instruction</Text>
            <Text style={styles.instructionsText}>{item.instructions}</Text>
          </ScrollView>
        </View>
      )}

      {item.hints?.length > 0 && (
        <View
          style={
            item.hints?.length > 150 ? styles.styleBoxl : styles.styleBoxl
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
            <Text style={styles.hintsText}>{item.hints}</Text>
          </ScrollView>
        </View>
      )}

      {item.gameQuestionMedia &&
        (item.questionMediaType === 'image' ? (
          <Image
            source={{uri: item.gameQuestionMedia}}
            style={styles.questionImage}
          />
        ) : item.questionMediaType === 'audio' ? (
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
              {isPlaying === item._id ? (
                <>
                  <TouchableOpacity
                    onPress={() => stopPlayback(item, 'stop')}
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
                  onPress={() => startPlaybackAudio(item, 'play')}>
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
        ) : item.questionMediaType === 'video' ? (
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
            <Video
              source={{uri: item.gameQuestionMedia}}
              style={styles.questionImage}
            />
          </View>
        ) : null)}
      <View style={styles.optionsContainer}>
        {Object.entries(item.correctAnswer[0])
          .filter(([key]) => key.startsWith('option'))
          .map(([key, value]) => renderOption(key, value))}
      </View>
    </View>
  );

  const handleSave = async () => {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={[questions[currentIndex]]}
        renderItem={renderQuestion}
        keyExtractor={item => item._id}
        horizontal
        pagingEnabled
      />
      <View style={styles.navigationContainer}>
        {currentIndex > 0 && <Button title="Prev" onPress={prevQuestion} />}
        {currentIndex < questions.length - 1 ? (
          <Button title="Next" onPress={nextQuestion} />
        ) : (
          <Button title="Submit" onPress={handleSave} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  questionContainer: {
    // alignItems: 'center',
    marginVertical: 16,
  },
  questionText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
    fontWeight: '600',
  },
  styleBoxl: {
    borderWidth: 1,
    width: window.WindowWidth * 0.9,
    alignSelf: 'center',
    overflow: 'scroll',
    marginTop: 12,
    padding: 5,
    backgroundColor: '#eef6ff',
    borderColor: '#cce0ff',
    marginBottom: 15,
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
    color: 'black',
  },
  hintsText: {
    textAlign: 'center',
    fontSize: 15,
    padding: '2%',
    margin: '2%',
    color: 'black',
  },
  radioContainer: {
    top: '-12%',
  },
  questionImage: {
    aspectRatio: 13 / 9,
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    // backgroundColor: '#d9d9d9',
    margin: 6,
    width: 100,
    alignItems: 'center',
  },
  optionImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default QuestionComponent;
