import React, {useState, useEffect, useRef, useCallback} from 'react';
import Cameraicon from 'react-native-vector-icons/Feather';

import Ionicons from 'react-native-vector-icons/Ionicons';
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
  PermissionsAndroid,
  StatusBar,
  TextInput,
  Button,
  Animated,
  ToastAndroid,
  Dimensions,
  BackHandler,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import ButtomSheet from '../components/BottomSheet';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Api from '../environment/Api';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import Norecord from '../components/Norecord';
const audioRecorderPlayer = new AudioRecorderPlayer();
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const HEIGHT = Dimensions.get('window').height;
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'; // You can use a radio button library
import Nocontents from './Nocontents';
const ReviewPage = ({
  topicQuizData,

  closeModal,
  imageUrl,
  navigation,

  // handleCloseAssessment,
}) => {
  const modalRef = useRef(null);
  const modalHeight = HEIGHT * 1;
  const [error, setError] = useState(false);
  // const [imageUrl, setImageUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState('');
  const [data, setData] = useState();
  const [recordSubmit, setRecordSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log('loading------->', loading);

  //Play audio starts
  const startPlaybackAudio = async item => {
    try {
      const path = item.answer;

      if (isAudioPlaying) {
        // If audio from a question is playing, stop it
        await audioRecorderPlayer.stopPlayer();
        setIsAudioPlaying('');
      }

      await audioRecorderPlayer.startPlayer(path);
      setIsPlaying(item._id);
      console.log(' playing audio:', path);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const stopPlayback = async item => {
    console.log('stop----->', item);
    try {
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying('');
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const stopPlaybackQuestion = async item => {
    console.log('stop question----->', item);
    try {
      await audioRecorderPlayer.stopPlayer();
      setIsAudioPlaying('');
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
    s;
  };
  const startPlaybackAudioQuestion = async item => {
    try {
      const path = item.questionMedia;

      if (isPlaying) {
        // If audio from an answer is playing, stop it
        await audioRecorderPlayer.stopPlayer();
        setIsPlaying('');
      }

      await audioRecorderPlayer.startPlayer(path);
      setIsAudioPlaying(item._id);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };
  //Play audio ends

  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  //Record Audio starts

  const [selectedQuestion, setSelectedQuestion] = useState([]);

  const [myArray, setMyArray] = useState([]);

  const openModal = (index, item, atdStatus) => {
    setOpenIndex(index);
    setOpenRecordModal(true);
    setSelectedItem(item);
  };

  const [showCard1, setShowCard1] = useState(true);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Recording permissions granted.');
        } else {
          console.log('Recording permissions denied.');
        }
      } catch (error) {
        console.log('err---->', error);
        if (error.response.status === 504) {
          Alert.alert('Gateway Timeout: The server is not responding.');
        } else if (error.response.status === 500) {
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
          console.error('Error is------------------->:', error);
        } else {
          console.error('Error is------------------->:', error);
        }
      }
    };
    requestPermissions();
  }, []);

  const onStartRecord = async () => {
    try {
      const directoryPath = `${RNFS.DocumentDirectoryPath}/recordings`;

      await RNFS.mkdir(directoryPath); // Create the directory if it doesn't exist
      const fileName = `recording_${Date.now()}.wav`;

      const recordingPath = `${directoryPath}/${fileName}`;

      const result = await audioRecorderPlayer.startRecorder(recordingPath);

      setShowCard1(false);
      setShowCard2(true);
      setShowCard3(false);
      ToastAndroid.show('Recording started', ToastAndroid.SHORT);
      audioRecorderPlayer.addRecordBackListener(e => {
        console.log(e?.current_position);
        console.log(e);
        return;
      });
    } catch (error) {
      setShowCard1(true);
      setShowCard2(false);
      setShowCard3(false);
      console.error('Failed to start recording:', error);
      ToastAndroid.show(
        'Failed to start recording: ' + error,
        ToastAndroid.SHORT,
      );
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setShowCard1(false);
      setShowCard2(false);
      setShowCard3(true);

      setData(result);
      audioRecorderPlayer.removeRecordBackListener();
    } catch (error) {
      setShowCard1(false);
      setShowCard2(true);
      setShowCard3(false);
    }
  };

  const startPlayback = async () => {
    try {
      await audioRecorderPlayer.startPlayer(data);
      setIsPlaying(item);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const onStartReRecord = () => {
    setShowCard1(true);
    setShowCard2(false);
    setShowCard3(false);
  };

  console.log(
    'topicQuizData------------------------------------>',
    topicQuizData,
  );

  const onSave = (selectedItem, atdStatus) => {
    try {
      setLoading(true);
      console.log('save ele------>', atdStatus, selectedItem);
      const questionId = selectedItem.questionId;
      if (atdStatus == 'yes') {
        selectedItem.active = 'yes';
      } else {
        selectedItem.active = 'no';
      }

      const modifiedButton = selectedQuestion.map(element => {
        // console.log('quiz-->', quizs);

        if (element.questionId === selectedItem.questionId) {
          if (atdStatus == 'yes') {
            element.active = 'yes';
          } else {
            element.active = 'no';
          }
        }
        return element;
      });
      setSelectedQuestion(modifiedButton);
      setRecordSubmit(true);

      const s3 = new S3({
        region: REGION,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
      });

      // Set the S3 bucket name and the desired filename for the uploaded file
      const bucketName = S3_BUCKET;
      const filename = 'file';

      const fileUri = data; // The path of the audio file recorded or obtained from the player

      RNFetchBlob.fs
        .readFile(fileUri, 'base64')
        .then(data => {
          // console.log('data--->', data);
          const params = {
            Bucket: bucketName,
            Key: '' + new Date().getTime(),
            Body: new Buffer(data, 'base64'),
            ACL: 'public-read',
            ContentType: 'audio/aac', // Set the appropriate content type based on your file format
          };
          const keys = params.Key;
          // console.log(params);

          s3.putObject(params, (err, data) => {
            if (err) {
            } else {
              const url = `https://${params.Bucket}.${s3.endpoint.hostname}/${params.Key}`;
              console.log('url--------->', url);
              setOpenRecordModal(false);
              setShowCard1(true);
              setShowCard2(false);
              setShowCard3(false);
              setLoading(false);

              {
                url ? (
                  Alert.alert('ସଫଳତାର ସହ ଅପଲୋଡ୍ ହୋଇଅଛି ।', '', [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => closeModal(url, questionId, keys),
                    },
                  ])
                ) : (
                  <ActivityIndicator
                    size="large"
                    color={Colors.primary}
                    style={{justifyContent: 'center', alignSelf: 'center'}}
                  />
                );
              }
            }
          });
        })
        .catch(error => {
          // console.log('Error reading file:', error);
        });
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
        setLoading(false);
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        setLoading(false);
        console.error('Error is------------------->:', error);
      } else {
        setLoading(false);
        console.error('Error is------------------->:', error);
      }
    }

    // -----------------------------------------------------------//
  };

  //Record Audio Ends
  const radioOptions = [
    {label: 'ହଁ', value: 'yes'},
    {label: 'ନା', value: 'no'},
  ];
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const Alerts = () => {
    Alert.alert('Alert !!', 'Another audio is playing.', [
      {
        text: 'ok',
        onPress: () => null,
        style: 'cancel',
      },
    ]);
  };

  const handleCloseOption = async () => {
    // setIsPlaying(false);
    // setIsAudioPlaying(false)
    await audioRecorderPlayer.stopPlayer();
    navigation.goBack();
  };

  return (
    <ScrollView
      style={{
        alignSelf: 'center',
        flex: 1,
        left: '25%',
        padding: 20,
        paddingBottom: 30,
      }}>
      <>
        {topicQuizData?.length > 0 ? (
          <>
            {topicQuizData?.map((item, index) => {
              return (
                <View style={styles.card}>
                  <Text style={styles.title}>
                    {' '}
                    {/* {item.questionOrder}.{item.question} */}
                    {index + 1}.{item.question}
                  </Text>

                  <>
                    {/* {isPlaying === false ? (
                      <>
                        {item.questionMediaType === 'audio' && (
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
                              {isAudioPlaying === item._id ? (
                                <>
                                  <TouchableOpacity
                                    onPress={() =>
                                      stopPlaybackQuestion(item, 'stop')
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
                                    startPlaybackAudioQuestion(item, 'play')
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
                        )}

                        {item.questionMediaType === 'image' && (
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

                                paddingTop: 20,
                              }}>
                              <Image
                                style={{
                                  width: window.WindowWidth * 0.9,

                                  aspectRatio: 12 / 8,
                                  alignSelf: 'center',
                                  paddingTop: 10,

                                  borderRadius: 10,
                                }}
                                resizeMode="cover"
                                source={
                                  error
                                    ? require('../assets/Photos/userss.png')
                                    : item.questionMedia
                                    ? {uri: item.questionMedia}
                                    : require('../assets/Photos/userss.png')
                                }
                                imageStyle={{
                                  width: '100%',
                                  height: window.WindowHeigth * 0.5,
                                }}
                                onError={() => {
                                  setError(true);
                                }}></Image>
                            </View>
                          </View>
                        )}

                        {item.answerType === 'textInput' ? (
                          <TextInput
                            underlineColorAndroid="transparent"
                            placeholder={item.answer}
                            editable={false}
                            placeholderTextColor="grey"
                            numberOfLines={10}
                            multiline={true}
                            keyboardType="ascii-capable"
                            style={styles.input}
                          />
                        ) : null}

                        {item.answerType === 'imageInput' && (
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

                                paddingTop: 20,
                              }}>
                              <Image
                                style={{
                                  width: window.WindowWidth * 0.5,
                                  height: window.WindowHeigth * 0.3,

                                  alignSelf: 'center',
                                  paddingTop: 10,

                                  borderRadius: 10,
                                }}
                                resizeMode="cover"
                                source={
                                  error
                                    ? require('../assets/Photos/userss.png')
                                    : item.answer
                                    ? {uri: item.answer}
                                    : require('../assets/Photos/userss.png')
                                }
                                imageStyle={{
                                  width: '100%',
                                  height: window.WindowHeigth * 0.5,
                                }}
                                onError={() => {
                                  setError(true);
                                }}></Image>
                            </View>
                          </View>
                        )}
                        {item.answerType === 'audioInput' && (
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
                                  onPress={() =>
                                    startPlaybackAudio(item, 'play')
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
                        )}
                      </>
                    ) : (
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
                                // onPress={() => stopPlayback(item, 'stop')}
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
                              // onPress={
                              //   () => Alerts
                              //   // (item, 'play')
                              // }
                              onPress={Alerts}>
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
                    )} */}

                    {item.answerType === '4options' &&
                      item.optionType === 'single' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('a') &&
                                      item.correctOption.includes('a')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('a') &&
                                          !item.correctOption.includes('a')
                                        ? '#0060ca'
                                        : item.correctOption.includes('a')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('a') &&
                                        item.correctOption.includes('a')) ||
                                      (item?.selectedOption?.includes('a') &&
                                        !item.correctOption.includes('a'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('a') &&
                                        (item.correctOption.includes('a') ||
                                          !item.correctOption.includes('a'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    A . {item.optionA}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('b') &&
                                      item.correctOption.includes('b')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('b') &&
                                          !item.correctOption.includes('b')
                                        ? '#0060ca'
                                        : item.correctOption.includes('b')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('b') &&
                                        item.correctOption.includes('b')) ||
                                      (item?.selectedOption?.includes('b') &&
                                        !item.correctOption.includes('b'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('b') &&
                                        (item.correctOption.includes('b') ||
                                          !item.correctOption.includes('b'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    B . {item.optionB}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('c') &&
                                      item.correctOption.includes('c')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('c') &&
                                          !item.correctOption.includes('c')
                                        ? '#0060ca'
                                        : item.correctOption.includes('c')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('c') &&
                                        item.correctOption.includes('c')) ||
                                      (item?.selectedOption?.includes('c') &&
                                        !item.correctOption.includes('c'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('c') &&
                                        (item.correctOption.includes('c') ||
                                          !item.correctOption.includes('c'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    C. {item.optionC}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('d') &&
                                      item.correctOption.includes('d')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('d') &&
                                          !item.correctOption.includes('d')
                                        ? '#0060ca'
                                        : item.correctOption.includes('d')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('d') &&
                                        item.correctOption.includes('d')) ||
                                      (item?.selectedOption?.includes('d') &&
                                        !item.correctOption.includes('d'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('d') &&
                                        (item.correctOption.includes('d') ||
                                          !item.correctOption.includes('d'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    D . {item.optionD}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}
                    {item.answerType === '4options' &&
                      item.optionType === 'multi' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('a')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionA}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('b')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionB}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('c')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionC}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('d')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionD}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                    {item.answerType === '3options' &&
                      item.optionType === 'single' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('a') &&
                                      item.correctOption.includes('a')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('a') &&
                                          !item.correctOption.includes('a')
                                        ? '#0060ca'
                                        : item.correctOption.includes('a')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('a') &&
                                        item.correctOption.includes('a')) ||
                                      (item?.selectedOption?.includes('a') &&
                                        !item.correctOption.includes('a'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('a') &&
                                        (item.correctOption.includes('a') ||
                                          !item.correctOption.includes('a'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    A . {item.optionA}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('b') &&
                                      item.correctOption.includes('b')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('b') &&
                                          !item.correctOption.includes('b')
                                        ? '#0060ca'
                                        : item.correctOption.includes('b')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('b') &&
                                        item.correctOption.includes('b')) ||
                                      (item?.selectedOption?.includes('b') &&
                                        !item.correctOption.includes('b'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('b') &&
                                        (item.correctOption.includes('b') ||
                                          !item.correctOption.includes('b'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    B . {item.optionB}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      item?.selectedOption?.includes('c') &&
                                      item.correctOption.includes('c')
                                        ? '#0060ca'
                                        : item?.selectedOption?.includes('c') &&
                                          !item.correctOption.includes('c')
                                        ? '#0060ca'
                                        : item.correctOption.includes('c')
                                        ? '#9ACD32' // Correct but not selected
                                        : 'white', // Not selected and not correct
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color:
                                      (item?.selectedOption?.includes('c') &&
                                        item.correctOption.includes('c')) ||
                                      (item?.selectedOption?.includes('c') &&
                                        !item.correctOption.includes('c'))
                                        ? 'white'
                                        : 'black',
                                    width: SIZES.WindowWidth * 0.8,
                                    height: SIZES.WindowWidth * 0.18,
                                    top: 10,
                                    textAlign: 'left',
                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      paddingLeft: 10,
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.includes('c') &&
                                        (item.correctOption.includes('c') ||
                                          !item.correctOption.includes('c'))
                                          ? 'white'
                                          : 'black',
                                    }}>
                                    {' '}
                                    C. {item.optionC}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                    {item.answerType === '3options' &&
                      item.optionType === 'multi' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('a')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionA}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('b')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionB}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('c')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionC}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                    {item.answerType === '2options' &&
                      item.optionType === 'single' && (
                        <>
                          <View key={item.questionId}>
                            <TouchableOpacity>
                              <View
                                style={{
                                  borderColor: Color.royalblue,
                                  backgroundColor:
                                    item?.selectedOption?.includes('a') &&
                                    item.correctOption.includes('a')
                                      ? '#0060ca'
                                      : item?.selectedOption?.includes('a') &&
                                        !item.correctOption.includes('a')
                                      ? '#0060ca'
                                      : item.correctOption.includes('a')
                                      ? '#9ACD32' // Correct but not selected
                                      : 'white', // Not selected and not correct
                                  borderRadius: 20,
                                  borderWidth: 1,
                                  color:
                                    (item?.selectedOption?.includes('a') &&
                                      item.correctOption.includes('a')) ||
                                    (item?.selectedOption?.includes('a') &&
                                      !item.correctOption.includes('a'))
                                      ? 'white'
                                      : 'black',
                                  width: SIZES.WindowWidth * 0.8,
                                  height: SIZES.WindowWidth * 0.18,
                                  top: 10,
                                  textAlign: 'left',
                                  margin: 10,
                                  alignSelf: 'center',
                                  fontFamily: FontFamily.poppinsMedium,
                                }}>
                                <Text
                                  style={{
                                    marginTop: 12,
                                    paddingLeft: 10,
                                    fontSize: 15,
                                    color:
                                      item?.selectedOption?.includes('a') &&
                                      (item.correctOption.includes('a') ||
                                        !item.correctOption.includes('a'))
                                        ? 'white'
                                        : 'black',
                                  }}>
                                  {' '}
                                  A. {item.optionA}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View
                                style={{
                                  borderColor: Color.royalblue,
                                  backgroundColor:
                                    item?.selectedOption?.includes('b') &&
                                    item.correctOption.includes('b')
                                      ? '#0060ca'
                                      : item?.selectedOption?.includes('b') &&
                                        !item.correctOption.includes('b')
                                      ? '#0060ca'
                                      : item.correctOption.includes('b')
                                      ? '#9ACD32'
                                      : 'white',
                                  borderRadius: 20,
                                  borderWidth: 1,
                                  color:
                                    (item?.selectedOption?.includes('b') &&
                                      item.correctOption.includes('b')) ||
                                    (item?.selectedOption?.includes('b') &&
                                      !item.correctOption.includes('b'))
                                      ? 'white'
                                      : 'black',
                                  width: SIZES.WindowWidth * 0.8,
                                  height: SIZES.WindowWidth * 0.18,
                                  top: 10,
                                  textAlign: 'left',
                                  margin: 10,
                                  alignSelf: 'center',
                                  fontFamily: FontFamily.poppinsMedium,
                                }}>
                                <Text
                                  style={{
                                    marginTop: 12,
                                    paddingLeft: 10,
                                    fontSize: 15,
                                    color:
                                      item?.selectedOption?.includes('b') &&
                                      (item.correctOption.includes('b') ||
                                        !item.correctOption.includes('b'))
                                        ? 'white'
                                        : 'black',
                                  }}>
                                  {' '}
                                  B. {item.optionB}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}

                    {item.answerType === '2options' &&
                      item.optionType === 'multi' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('a')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionA}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity style={{flexDirection: 'row'}}>
                                <View>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('b')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{true: '#0060ca', false: ''}}
                                  />
                                </View>
                                <View style={{marginTop: 7}}>
                                  <Text>{item.optionB}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                    {item.answerType === 'yesNoOptions' && (
                      <RadioForm formHorizontal={true} animation={true}>
                        {radioOptions.map((option, index) => (
                          <View key={index} style={{marginRight: 20}}>
                            <RadioButton labelHorizontal={true}>
                              <RadioButtonInput
                                obj={option}
                                index={index}
                                isSelected={
                                  item.correctOption[0] === option.value //
                                }
                                borderWidth={1}
                                buttonInnerColor={'#0060ca'}
                                buttonOuterColor={
                                  item.correctOption[0] === option.value
                                    ? '#0060ca'
                                    : '#000'
                                }
                                buttonSize={15}
                                buttonStyle={{}}
                                buttonWrapStyle={{marginLeft: 10}}
                                onPress={() => {
                                  console.log('press');
                                }}
                              />
                              <RadioButtonLabel
                                obj={option}
                                index={index}
                                labelHorizontal={true}
                                labelStyle={{
                                  fontSize: 15,
                                  color:
                                    item.correctOption[0] === option.value
                                      ? '#0060ca'
                                      : '#000',
                                }}
                              />
                            </RadioButton>
                          </View>
                        ))}
                      </RadioForm>
                    )}
                  </>

                  {item.correctOption.length > 0 &&
                  item.answerType !== 'yesNoOptions' ? (
                    <>
                      {/* <Text style={[styles.title, {color: 'green', padding: 20}]}>
                      ସଠିକ୍ ଉତ୍ତର: {item.correctOption}
                    </Text> */}

                      <Text
                        style={[styles.title, {color: 'green', padding: 20}]}>
                        Your Answer: {item.selectedOption}
                      </Text>

                      <Text
                        style={[
                          styles.title,
                          {color: 'green', padding: 20, marginTop: -32},
                        ]}>
                        ସଠିକ୍ ଉତ୍ତର: {item.correctOption}
                      </Text>
                    </>
                  ) : null}
                </View>
              );
            })}
            <View style={{paddingBottom: 30, alignSelf: 'center'}}>
              <TouchableOpacity
                style={styles.buttongoback}
                onPress={() => navigation.goBack()}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: '700',
                    color: Colors.white,
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Go back
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Nocontents />
        )}
      </>

      {/* //Image modal starts */}
      <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => {
              handleSelection('camera');
            }}
            style={styles.modalButtonContainer}>
            <Cameraicon name="camera" size={30} color={Colors.primary} />
            <Text style={styles.modalButtonText}>Take Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleSelection('gallery');
            }}
            style={styles.modalButtonContainer}>
            <Cameraicon name="file" size={30} color={Colors.info} />
            <Text style={styles.modalButtonText}>choose_gallery</Text>
          </TouchableOpacity>
        </View>
      </ButtomSheet>
      {/* IMage modal ends */}
    </ScrollView>
  );
};

export default ReviewPage;
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: '#0060ca',
    height: 40,
    width: window.WindowWidth * 0.5,
    left: '2%',
    borderRadius: 156,
  },
  buttongoback: {
    justifyContent: 'center',
    backgroundColor: '#0060ca',
    height: 60,
    width: window.WindowWidth * 0.5,
    // left: '26%',
    top: '2%',
    borderRadius: 156,
  },
  submit: {
    width: window.WindowWidth * 0.4,

    borderRadius: 30,
    backgroundColor: Color.royalblue,
    color: 'white',
    alignSelf: 'center',

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

    justifyContent: 'center',
    top: '5%',
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
    // borderRadius: 10,
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
  },
  roundView: {
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // flexGrow: 1,
    flexDirection: 'row',
    // left: '50%',
    alignItems: 'center',
    width: SIZES.WindowWidth * 0.95,
    padding: 10,
    paddingBottom: 20,
    justifyContent: 'space-evenly',
    position: 'absolute',
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
    width: SIZES.WindowWidth * 0.9,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
  },
  input: {
    height: 60,
    width: window.WindowWidth * 0.83,
    borderWidth: 1,
    borderRadius: 12,
    textAlignVertical: 'top', // Aligns text to the top
    paddingLeft: 10,
  },
  bu: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,

    top: '20%',
    flexDirection: 'row',
    alignSelf: 'center',

    justifyContent: 'center',
    top: '5%',
    color: 'white',
  },
  bu: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,

    top: '20%',
    flexDirection: 'row',
    alignSelf: 'center',

    justifyContent: 'center',
    top: '5%',
    color: 'white',
  },
  markedOption: {
    borderColor: Color.royalblue,

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
});
