import React, {useState, useEffect, useRef, useCallback} from 'react';
import Cameraicon from 'react-native-vector-icons/Feather';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '@env';
import RNFetchBlob from 'react-native-blob-util';

import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {S3} from 'aws-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Azure} from '../components/Azure';

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
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as SIZES from '../utils/dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import Norecord from '../components/Norecord';
const audioRecorderPlayer = new AudioRecorderPlayer();
const audioPlayer = new AudioRecorderPlayer();

const HEIGHT = Dimensions.get('window').height;
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'; // You can use a radio button library
import Nocontents from './Nocontents';
const NewQuizTemplate = ({
  handleSaveAssessment,
  topicQuizData,
  handleAnswerChange,
  handleOptionSelect,
  handleOptionSelectMulti,
  closeModal,
  azureUpload,
  onImageSelected,
  imageUrl,
  textInputRef,
  // answers,
  // imageUrl,
  // handleOpenBottomSheet,
  // handleSelection,
  // handleCloseAssessment,
}) => {
  const modalRef = useRef(null);
  const modalHeight = HEIGHT * 1.2;
  const [error, setError] = useState(false);
  // const [imageUrl, setImageUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [isPlayings, setIsPlayings] = useState(false);
  const [data, setData] = useState();
  const [recordSubmit, setRecordSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log('loading------->', loading);
  // const textInputRef = useRef(null);

  const handleTextInputChange = (item, newAnswer) => {
    handleAnswerChange(item.questionId, newAnswer);
  };

  //Play audio starts
  const startPlaybackAudio = async item => {
    try {
      const path = item.questionMedia;
      await audioPlayer.startPlayer(path);
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
  const [openQuestionId, setOPenQuestionId] = useState('');

  const handleOpenBottomSheet = useCallback(questionId => {
    console.log('questionId---->', questionId);
    setOPenQuestionId(questionId);
    try {
      console.log('try--->');

      modalRef.current?.open();
      console.log('try--->2');
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
  }, []);
  const [imageData, setImageData] = useState({});

  const handleSelection = async (flag, questionId) => {
    console.log('flag--->', flag, questionId, openQuestionId);
    modalRef.current?.close();
    if (flag === 'camera') {
      if (Platform.OS === 'ios') {
        return;
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'ThinkZone App Camera Permission',
              message:
                'ThinkZone App needs access to your camera' +
                'so you can take pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
              compressImageMaxWidth: 300,
              compressImageMaxHeight: 300,
            })
              .then(image => {
                setError(false);
                onImageSelected(image.path, openQuestionId);
                setImageData(image);
              })
              .catch(error => {
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
              });
          } else {
            Alert.alert('Error', 'Camera Permission Not Granted');
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
      }
    } else if (flag === 'gallery') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
      })
        .then(image => {
          setError(false);
          // setImageUrl(image.path);
          console.log('imageurl---->', image.path);
          onImageSelected(image.path, openQuestionId);

          setImageData(image);
        })
        .catch(error => {
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
        });
    } else {
    }
  };

  const stopPlayback = async item => {
    console.log('stop----->', item);
    try {
      setIsLoader(true);
      await audioPlayer.stopPlayer();
      setIsPlaying(null);
      setIsLoader(false);
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

  //Record Audio starts

  const [selectedQuestion, setSelectedQuestion] = useState([]);

  const [myArray, setMyArray] = useState([]);

  const openModal = (index, item, atdStatus) => {
    setOpenIndex(index);
    setOpenRecordModal(true);
    setSelectedItem(item);
  };

  // const closeModal = body => {
  //   // console.log('selectedItemclose---->', body);
  //   setOpenRecordModal(false);
  //   setShowCard1(true);
  //   setShowCard2(false);
  //   setShowCard3(false);
  // };

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
  const [isLoader, setIsLoader] = useState(false);

  const onStartRecord = async () => {
    try {
      // let devicePath = '';
      // devicePath = RNFS.ExternalStorageDirectoryPath;
      // const fileName = generateFilename();
      // console.log('fileName------------->', fileName);
      // const recordingPath = `${devicePath}/${fileName}`;
      // console.log('recordingPath------------->', recordingPath);
      const directoryPath = `${RNFS.DocumentDirectoryPath}/recordings`;

      await RNFS.mkdir(directoryPath); // Create the directory if it doesn't exist
      const fileName = `recording_${Date.now()}.wav`;
      // console.log('directoryPath1------------->', directoryPath);
      // console.log('directoryPath2------------->', fileName);

      const recordingPath = `${directoryPath}/${fileName}`;
      // console.log('recordingPath------------->', recordingPath);
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
      // console.log('Recording stopped:', result);

      setData(result);
      audioRecorderPlayer.removeRecordBackListener();
    } catch (error) {
      // console.log('catch stop------------->');
      setShowCard1(false);
      setShowCard2(true);
      setShowCard3(false);
    }
  };

  const startPlayback = async () => {
    try {
      // console.log('resultplay----->', data);
      setIsLoader(true);
      await audioRecorderPlayer.startPlayer(data);
      setIsPlaying(null);
      setIsPlayings(true);

      setIsLoader(true);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
        setIsLoader(false);
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        setIsLoader(false);
        console.error('Error is------------------->:', error);
      } else {
        setIsLoader(false);
        console.error('Error is------------------->:', error);
      }
    }
  };

  const startPlaybacks = async selectedItem => {
    try {
      console.log('resultplay----->', selectedItem);
      setIsLoader(true);
      await audioRecorderPlayer.startPlayer(data);
      audioRecorderPlayer.addPlayBackListener(e => {
        console.log('start------->', e.currentPosition, e.duration);
        if (e.currentPosition === e.duration) {
          stopPlaybacks();
        }
      });

      setIsPlayings(true);

      setIsLoader(true);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
        setIsLoader(false);
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        setIsLoader(false);
        console.error('Error is------------------->:', error);
      } else {
        setIsLoader(false);
        console.error('Error is------------------->:', error);
      }
    }
  };
  const stopPlaybacks = async selectedItem => {
    console.log('stop----->', selectedItem);
    try {
      // setIsPlayings(false);
      await audioRecorderPlayer.stopPlayer();
      setIsPlayings(false);
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

  // const onSave = (selectedItem, atdStatus) => {
  //   try {
  //     setLoading(true);
  //     console.log('save ele------>', atdStatus, selectedItem);
  //     const questionId = selectedItem.questionId;
  //     if (atdStatus == 'yes') {
  //       selectedItem.active = 'yes';
  //     } else {
  //       selectedItem.active = 'no';
  //     }

  //     const modifiedButton = selectedQuestion.map(element => {
  //       // console.log('quiz-->', quizs);

  //       if (element.questionId === selectedItem.questionId) {
  //         if (atdStatus == 'yes') {
  //           element.active = 'yes';
  //         } else {
  //           element.active = 'no';
  //         }
  //       }
  //       return element;
  //     });
  //     setSelectedQuestion(modifiedButton);
  //     setRecordSubmit(true);

  //     const s3 = new S3({
  //       region: REGION,
  //       accessKeyId: ACCESS_KEY,
  //       secretAccessKey: SECRET_ACCESS_KEY,
  //     });
  //     // console.log('s3-------------', s3);
  //     // Set the S3 bucket name and the desired filename for the uploaded file
  //     const bucketName = S3_BUCKET;
  //     const filename = 'file';

  //     const fileUri = data; // The path of the audio file recorded or obtained from the player
  //     // console.log('fileUri--->', fileUri);
  //     RNFetchBlob.fs
  //       .readFile(fileUri, 'base64')
  //       .then(data => {
  //         // console.log('data--->', data);
  //         const params = {
  //           Bucket: bucketName,
  //           Key: '' + new Date().getTime(),
  //           Body: new Buffer(data, 'base64'),
  //           ACL: 'public-read',
  //           ContentType: 'audio/aac', // Set the appropriate content type based on your file format
  //         };
  //         const keys = params.Key;
  //         // console.log(params);

  //         s3.putObject(params, (err, data) => {
  //           if (err) {
  //             // console.log('Error uploading file to S3:', err);
  //           } else {
  //             // console.log('File uploaded successfully:', data);
  //             const url = `https://${params.Bucket}.${s3.endpoint.hostname}/${params.Key}`;
  //             console.log('url--------->', url);
  //             setOpenRecordModal(false);
  //             setShowCard1(true);
  //             setShowCard2(false);
  //             setShowCard3(false);
  //             setLoading(false);

  //             {
  //               url ? (
  //                 Alert.alert('ସଫଳତାର ସହ ଅପଲୋଡ୍ ହୋଇଅଛି ।', '', [
  //                   // {
  //                   //   text: 'Cancel',
  //                   //   onPress: () => null,
  //                   //   style: 'cancel',
  //                   // },
  //                   {
  //                     text: 'OK',
  //                     onPress: () => closeModal(url, questionId, keys),
  //                   },
  //                 ])
  //               ) : (
  //                 <ActivityIndicator
  //                   size="large"
  //                   color={Colors.primary}
  //                   style={{justifyContent: 'center', alignSelf: 'center'}}
  //                 />
  //               );
  //             }
  //           }
  //         });
  //       })
  //       .catch(error => {
  //         // console.log('Error reading file:', error);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }

  //   // -----------------------------------------------------------//

  //   // let findData = new Buffer('base64', audioData);
  //   // console.log(typeof findData, 'hhy---->');
  //   // var formData = new FormData();
  //   // formData.append('file', findData);
  //   // console.log('FormData-->', formData);
  //   //   Api.post('s3api/uploadroot/123', formData).then(
  //   //   // response => {
  //   //   response => {
  //   //     console.log('response uplooad-->', response.data);
  //   //     // if (response.data.s3path.length > 0) {
  //   //     //   alert("uploded successfully!!");
  //   //     //   set_get_s3name(response.data);
  //   //     // }
  //   //   },
  //   //   err => {
  //   //     console.log(err);
  //   //   },
  //   // );
  // };
  // const onSave = async (selectedItem, atdStatus) => {
  //   try {
  //     // setLoading(true);
  //     console.log('save ele------>', atdStatus, selectedItem);
  //     const questionId = selectedItem.questionId;
  //     if (atdStatus === 'yes') {
  //       selectedItem.active = 'yes';
  //     } else {
  //       selectedItem.active = 'no';
  //     }

  //     const modifiedButton = selectedQuestion.map(element => {
  //       if (element.questionId === selectedItem.questionId) {
  //         if (atdStatus === 'yes') {
  //           element.active = 'yes';
  //         } else {
  //           element.active = 'no';
  //         }
  //       }
  //       return element;
  //     });
  //     setSelectedQuestion(modifiedButton);
  //     setRecordSubmit(true);

  //     const fileUri = data;
  //     const pathSegments = fileUri.split('/');
  //     const filename = pathSegments[pathSegments.length - 1];
  //     console.log('filename----->', filename);

  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: fileUri,
  //       type: 'audio/mpeg', // Adjust the mime type accordingly
  //       name: filename,
  //     });

  //     const response = await Api.post(`uploadFile/${filename}`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     console.log('audio response----->', response.data, response.status);
  //     if (response?.status === 200) {
  //       // setSubmittedQuestionId(selectedItem?.questionId);
  //       // setResponseStatus(response?.status);
  //       alert('ସଫଳତାର ସହ ଅପଲୋଡ୍ ହୋଇଅଛି ।');
  //       setOpenRecordModal(false);
  //     } else {
  //       // setSubmittedQuestionId(null);
  //     }
  //   } catch (error) {
  //     console.error('Error in onSave:', error);

  //     // setLoading(false);
  //   }
  // };
  const onSave = async (selectedItem, atdStatus) => {
    try {
      // setLoading(true);
      console.log('save ele------>', atdStatus, selectedItem);
      const questionId = selectedItem.questionId;
      if (atdStatus === 'yes') {
        selectedItem.active = 'yes';
      } else {
        selectedItem.active = 'no';
      }

      const modifiedButton = selectedQuestion.map(element => {
        if (element.questionId === selectedItem.questionId) {
          if (atdStatus === 'yes') {
            element.active = 'yes';
          } else {
            element.active = 'no';
          }
        }
        return element;
      });
      setSelectedQuestion(modifiedButton);
      setRecordSubmit(true);

      const fileUri = data;
      const uploadResult = await Azure(fileUri);

      if (uploadResult.success) {
        Alert.alert('ସଫଳତାର ସହ ଅପଲୋଡ୍ ହୋଇଅଛି ।', '', [
          {
            text: 'OK',
            onPress: () => azureUpload(uploadResult.url, questionId),
          },
        ]);

        setOpenRecordModal(false);
        setShowCard1(true);
        setShowCard2(false);
        setShowCard3(false);
        // setSubmittedQuestionId(selectedItem?.questionId);
        // setUploadedQuestionIds(prevIds => [
        //   ...prevIds,
        //   selectedItem?.questionId,
        // ]);
        // setResponseStatus(uploadResult?.status);
        // onAnswerSet(uploadResult.url, selectedItem.questionId);
      } else {
        setSubmittedQuestionId(null);
      }
    } catch (error) {
      if (error.response.status === 413) {
        Alert.alert('File is too large');
      } else if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }

      // setLoading(false);
    }
  };

  //Record Audio Ends
  const radioOptions = [
    {label: 'ହଁ', value: ['yes']},
    {label: 'ନା', value: ['no']},
  ];
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const onCancelRecord = () => {
    setOpenRecordModal(false);
    setShowCard1(true);
    setShowCard2(false);
    setShowCard3(false);
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
        {
          text: 'Ok',
          onPress: () => setOpenRecordModal(false),
          style: 'default',
        },
      ],
    );
  };
  return (
    <ScrollView
      style={{
        alignSelf: 'center',
        flex: 1,
        left: '27%',
        padding: 20,
        paddingBottom: 30,
      }}>
      <>
        {topicQuizData?.length > 0 ? (
          <>
            {topicQuizData?.map((item, index) => {
              return (
                <View style={styles.card}>
                  {/* //Image modal starts */}

                  {/* IMage modal ends */}
                  <Text style={styles.title}>
                    {' '}
                    {/* {item.questionOrder}.{item.question} */}ପ୍ରଶ୍ନ (
                    {index + 1}). {''} {item.question}
                  </Text>
                  {item.instructions?.length > 0 ? (
                    <View
                      style={{
                        width: window.WindowWidth * 0.8,
                        alignSelf: 'center',
                        borderColor: Color.royalblue,
                        borderWidth: 0.5,
                        paddingBottom: 5,

                        marginTop: 10,
                        padding: 15,
                        borderRadius: 10,
                        top: -20,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          color: 'black',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          paddingBottom: 10,
                          // borderBottomWidth: 1,
                          // width: 100,
                        }}>
                        ସୂଚନା
                      </Text>
                      <Text
                        style={[
                          styles.title,
                          {textAlign: 'center', fontSize: 15},
                        ]}>
                        {' '}
                        {/* {item.questionOrder}.{item.question} */}
                        {item.instructions}
                      </Text>
                    </View>
                  ) : null}

                  {/* Objective starts */}

                  {/* objective ends */}

                  {/* subjective starts */}
                  {/* {item.questionCategory === 'subjective' && ( */}
                  <>
                    {item.questionMediaType === 'audio' ? (
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
                    ) : null}

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
                            // borderWidth: 1,
                            // borderColor: Color.royalblue,
                            paddingTop: 20,
                          }}>
                          <Image
                            style={{
                              width: window.WindowWidth * 0.9,
                              // height: SIZES.WindowHeigth * 0.9,
                              aspectRatio: 12 / 8,
                              alignSelf: 'center',
                              paddingTop: 10,
                              // borderWidth: 2,

                              borderRadius: 10,
                            }}
                            //resizeMode="cover"
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
                            }}
                            // source={require('../assets/Image/group-35.png')}
                          ></Image>
                        </View>
                      </View>
                    )}

                    {item.answerType === 'textInput' ? (
                      <TextInput
                        allowFontScaling={false}
                        ref={textInputRef}
                        underlineColorAndroid="transparent"
                        placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        keyboardType="ascii-capable"
                        style={styles.input}
                        onChangeText={newAnswer =>
                          handleTextInputChange(item, newAnswer)
                        }
                        // value={answerReset}
                      />
                    ) : null}

                    {item.answerType === 'imageInput' && (
                      <>
                        {/* //Image modal starts */}
                        <ButtomSheet
                          modalRef={modalRef}
                          modalHeight={modalHeight}>
                          <View style={styles.modalContainer}>
                            <TouchableOpacity
                              onPress={() => {
                                handleSelection('camera', item.questionId);
                              }}
                              style={styles.modalButtonContainer}>
                              <Cameraicon
                                name="camera"
                                size={30}
                                color={Colors.primary}
                              />
                              <Text style={styles.modalButtonText}>
                                Take Picture
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                handleSelection('gallery', item.questionId);
                              }}
                              style={styles.modalButtonContainer}>
                              <Cameraicon
                                name="file"
                                size={30}
                                color={Colors.info}
                              />
                              <Text style={styles.modalButtonText}>
                                choose_gallery
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </ButtomSheet>
                        {/* IMage modal ends */}
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
                            <Image
                              style={{
                                width: '100%',
                                height: SIZES.WindowHeigth * 0.5,
                                borderRadius: 20,
                              }}
                              //resizeMode="cover"
                              source={
                                error
                                  ? require('../assets/Photos/userss.png')
                                  : imageUrl[item.questionId]
                                  ? {uri: imageUrl[item.questionId]}
                                  : require('../assets/Photos/userss.png')
                              }
                              imageStyle={{
                                width: '100%',
                                height: window.WindowHeigth * 0.5,
                              }}
                              onError={() => {
                                setError(true);
                              }}
                              // source={require('../assets/Image/group-35.png')}
                            ></Image>
                            <TouchableOpacity
                              //onPress={() => onStartRecord(ele, i, 1)}
                              key={index}
                              onPress={() =>
                                handleOpenBottomSheet(item.questionId)
                              }
                              style={{
                                backgroundColor: 'green',
                                backgroundColor: topicQuizData?.filter(x =>
                                  x.active === 'yes'
                                    ? 'green'
                                    : Color.royalblue,
                                ),
                                borderRadius: 30,
                                width: '50%',
                                paddingBottom: 20,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: '5%',
                                flexGrow: 1,
                              }}>
                              <View style={styles.bu}>
                                <Text
                                  style={{
                                    marginTop: 10,
                                    fontFamily: FontFamily.poppinsMedium,
                                    fontSize: 13,
                                    paddingLeft: 10,
                                    textAlign: 'center',
                                    padding: 10,
                                    top: -5,
                                    color: 'white',
                                  }}>
                                  Upload Image
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}

                    {item.answerType === 'audioInput' && (
                      <View
                        style={{
                          paddingBottom: 20,
                          paddingTop: 20,
                          alignSelf: 'center',
                        }}>
                        <View style={{}}>
                          {item?.active === 'yes' ? (
                            <TouchableOpacity
                              // onPress={() => onStartRecord(ele, i, 1)}
                              key={index}
                              onPress={() =>
                                Alert.alert('ସଫଳତାର ସହ ଅପଲୋଡ୍ ହୋଇଅଛି ।', '', [
                                  {
                                    text: 'Ok',
                                    onPress: () => null,
                                    style: 'default',
                                  },
                                ])
                              }
                              style={{}}>
                              <View
                                style={{
                                  marginTop: 10,
                                  width: window.WindowWidth * 0.5,
                                  backgroundColor: 'green',
                                  padding: 5,
                                  borderRadius: 15,
                                }}>
                                <Text
                                  style={{
                                    marginTop: 10,
                                    fontFamily: FontFamily.poppinsMedium,
                                    fontSize: 13,
                                    paddingLeft: 10,
                                    textAlign: 'center',
                                    padding: 10,
                                    top: -5,
                                    color: 'white',
                                  }}>
                                  Uploaded
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              key={index}
                              onPress={() => openModal(index, item, 'yes')}
                              style={{}}>
                              <View style={styles.bu}>
                                <Text
                                  style={{
                                    marginTop: 10,
                                    fontFamily: FontFamily.poppinsMedium,
                                    fontSize: 14,
                                    paddingLeft: 10,
                                    textAlign: 'center',
                                    padding: 10,
                                    top: -5,
                                    color: 'white',
                                  }}>
                                  ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}

                    {item.answerType === '4options' &&
                      item.optionType === 'single' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'a')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,

                                    backgroundColor:
                                      // currentSelectedOption === 'A'
                                      item.selectedOption === 'a'
                                        ? '#0060ca'
                                        : 'white',

                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      // color: 'black',
                                      color:
                                        item.selectedOption === 'a'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    A . {item.optionA}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'b')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      // currentSelectedOption === 'B'
                                      item.selectedOption === 'b'
                                        ? '#0060ca'
                                        : 'white',
                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      color:
                                        item.selectedOption === 'b'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    B . {item.optionB}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'c')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      // currentSelectedOption === 'C'
                                      item.selectedOption === 'c'
                                        ? '#0060ca'
                                        : 'white',
                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      color:
                                        item.selectedOption === 'c'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    C . {item.optionC}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'd')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      // currentSelectedOption === 'D'
                                      item.selectedOption === 'd'
                                        ? '#0060ca'
                                        : 'white',
                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      color:
                                        item.selectedOption === 'd'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
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
                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item.questionId, 'a')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('a')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item?.questionId,
                                        'a',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionA}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item?.questionId, 'b')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('b')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item?.questionId,
                                        'b',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionB}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item?.questionId, 'c')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('c')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item?.questionId,
                                        'c',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionC}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item?.questionId, 'd')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('d')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item?.questionId,
                                        'd',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
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
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'a')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,

                                    backgroundColor:
                                      // currentSelectedOption === 'A'
                                      item.selectedOption === 'a'
                                        ? '#0060ca'
                                        : 'white',

                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      // color: 'black',
                                      color:
                                        item.selectedOption === 'a'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    A . {item.optionA}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'b')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      // currentSelectedOption === 'B'
                                      item.selectedOption === 'b'
                                        ? '#0060ca'
                                        : 'white',
                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      color:
                                        item.selectedOption === 'b'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    B . {item.optionB}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'c')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      // currentSelectedOption === 'C'
                                      item.selectedOption === 'c'
                                        ? '#0060ca'
                                        : 'white',
                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      color:
                                        item.selectedOption === 'c'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    C . {item.optionC}
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
                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item.questionId, 'a')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('a')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item.questionId,
                                        'A',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionA}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item.questionId, 'b')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('b')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item.questionId,
                                        'b',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionB}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item.questionId, 'c')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('c')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item.questionId,
                                        'c',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionC}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                            {/* <Text>{isChecked ? 'Checked' : 'Unchecked'}</Text> */}
                          </View>
                        </>
                      )}

                    {item.answerType === '2options' &&
                      item.optionType === 'single' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'a')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,

                                    backgroundColor:
                                      // currentSelectedOption === 'A'
                                      item.selectedOption === 'a'
                                        ? '#0060ca'
                                        : 'white',

                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      // color: 'black',
                                      color:
                                        item.selectedOption === 'a'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    A . {item.optionA}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect(item.questionId, 'b')
                                }>
                                <View
                                  style={{
                                    borderColor: Color.royalblue,
                                    backgroundColor:
                                      // currentSelectedOption === 'B'
                                      item.selectedOption === 'b'
                                        ? '#0060ca'
                                        : 'white',
                                    // backgroundColor: Color.white,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    color: 'white',
                                    width: SIZES.WindowWidth * 0.8,
                                    // height: 50,
                                    top: 10,
                                    textAlign: 'left',

                                    margin: 10,
                                    alignSelf: 'center',
                                    fontFamily: FontFamily.poppinsMedium,
                                    paddingBottom: 20,
                                  }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      color:
                                        item.selectedOption === 'b'
                                          ? 'white'
                                          : 'black',
                                      paddingLeft: 10,
                                      fontSize: 15,
                                    }}>
                                    {' '}
                                    B . {item.optionB}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                    {item.answerType === '2options' &&
                      item.optionType === 'multi' && (
                        <>
                          <View>
                            <View key={item.questionId}>
                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item.questionId, 'a')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('a')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item.questionId,
                                        'a',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionA}</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{flexDirection: 'row'}}
                                onPress={() =>
                                  handleOptionSelectMulti(item.questionId, 'b')
                                }>
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: 20,
                                    top: 10,
                                  }}>
                                  <CheckBox
                                    value={item?.selectedOption?.includes('b')}
                                    style={{alignSelf: 'center'}}
                                    tintColors={{
                                      true: '#0060ca',
                                      false: '#0060ca',
                                    }}
                                    onChange={() =>
                                      handleOptionSelectMulti(
                                        item.questionId,
                                        'b',
                                      )
                                    }
                                  />
                                </View>
                                <View style={{top: '4%'}}>
                                  <Text>{item.optionB}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                    {/* {item.answerType === 'yesNoOptions' && (
                      <>
                        <View>
                          <View key={item.questionId}>
                            <TouchableOpacity
                              onPress={() =>
                                handleOptionSelect(item.questionId, 'yes')
                              }>
                              <View
                                style={{
                                  borderColor: Color.royalblue,

                                  backgroundColor:
                                    // currentSelectedOption === 'A'
                                    item.selectedOption === 'yes'
                                      ? '#0060ca'
                                      : 'white',

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
                                }}>
                                <Text
                                  style={{
                                    marginTop: 10,
                                    // color: 'black',
                                    color:
                                      item.selectedOption === 'yes'
                                        ? 'white'
                                        : 'black',
                                    paddingLeft: 10,
                                    fontSize: 15,
                                  }}>
                                  {' '}
                                  YES
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                handleOptionSelect(item.questionId, 'no')
                              }>
                              <View
                                style={{
                                  borderColor: Color.royalblue,
                                  backgroundColor:
                                    // currentSelectedOption === 'B'
                                    item.selectedOption === 'no'
                                      ? '#0060ca'
                                      : 'white',
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
                                }}>
                                <Text
                                  style={{
                                    marginTop: 10,
                                    color:
                                      item.selectedOption === 'no'
                                        ? 'white'
                                        : 'black',
                                    paddingLeft: 10,
                                    fontSize: 15,
                                  }}>
                                  {' '}
                                  NO
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )} */}
                    {item.answerType === 'yesNoOptions' && (
                      <View
                        style={{
                          alignSelf: 'stretch',
                          paddingLeft: 20,
                          top: 10,
                        }}>
                        <RadioForm formHorizontal={true} animation={true}>
                          {radioOptions.map((option, index) => (
                            // console.log(
                            //   'check value------->',

                            //   item.selectedOption,
                            //   option.value,
                            // ),
                            <View key={index} style={{marginRight: 20}}>
                              <RadioButton labelHorizontal={true}>
                                <RadioButtonInput
                                  obj={option}
                                  index={index}
                                  isSelected={
                                    item?.selectedOption?.length > 0
                                      ? item?.selectedOption[0] ===
                                        option.value[0]
                                      : item?.selectedOption === option.value
                                  }
                                  onPress={() =>
                                    handleOptionSelect(
                                      item.questionId,
                                      option.value,
                                    )
                                  }
                                  borderWidth={1}
                                  buttonInnerColor={'#0060ca'}
                                  buttonOuterColor={
                                    item?.selectedOption?.length > 0
                                      ? item?.selectedOption[0] ===
                                        option.value[0]
                                      : item?.selectedOption === option.value
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
                                    handleOptionSelect(
                                      item.questionId,
                                      option.value,
                                    )
                                  }
                                  labelStyle={{
                                    fontSize: 15,
                                    color:
                                      item?.selectedOption?.length > 0
                                        ? item?.selectedOption[0] ===
                                          option.value[0]
                                        : item?.selectedOption === option.value
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
                  </>
                </View>
              );
            })}
            <View
              style={{
                paddingBottom: window.WindowWidth * 0.1,
                paddingBottom: 50,
              }}>
              <TouchableOpacity
                style={[styles.submit]}
                onPress={handleSaveAssessment}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: '600',
                    color: 'white',
                    marginTop: 10,
                    paddingBottom: 10,
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Nocontents />
        )}
      </>

      {/* modal start */}
      <Modal
        visible={openRecordModal}
        onRequestClose={() => back()}
        // animationType="slide"
        // transparent={true}
        // onRequestClose={closeModal}
      >
        <ScrollView>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{justifyContent: 'center', alignSelf: 'center'}}
            />
          ) : (
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  {
                    // height: window.WindowHeigth * 0.7,

                    width: window.WindowWidth * 0.95,
                    // height: window.WindowHeigth * 0.7,
                    borderRadius: 20,
                    paddingBottom: 150,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FontFamily.poppinsMedium,
                    // textAlign: 'left',
                    color: 'black',
                    alignSelf: 'flex-start',
                  }}>
                  Q. {''} {selectedItem?.question}
                </Text>

                {showCard1 && (
                  <View
                    style={{
                      width: window.WindowWidth * 0.85,
                      paddingBottom: 20,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      borderRadius: 12,
                      top: '3%',
                      paddingBottom: 30,
                      elevation: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#333333',
                        alignSelf: 'center',
                        flexWrap: 'wrap',
                        paddingTop: 20,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}>
                      ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ ବଟନ୍
                      ଉପରେ କ୍ଲିକ୍ କରି ନିଜର ଉତ୍ତର ରେକର୍ଡ କରନ୍ତୁ ।
                    </Text>

                    <TouchableOpacity
                      onPress={() => onStartRecord()}
                      style={{
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
                      }}>
                      <Image
                        style={{
                          width: 24,
                          height: 24,
                          top: '9%',
                        }}
                        source={require('../assets/Image/microphone.png')}
                      />
                      <Text style={[styles.textss, {top: '8%'}]}>Record</Text>
                    </TouchableOpacity>
                    {/* Cancel Button */}
                    <TouchableOpacity
                      onPress={() => onCancelRecord()} // Define your onCancelRecord function
                      style={{
                        backgroundColor: '#FF0000', // Change the color as desired
                        borderRadius: 30,
                        width: 126,
                        paddingBottom: 20,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        top: '5%',
                        flexGrow: 1,
                        marginTop: 10, // Add margin to separate it from the record button
                      }}>
                      <Text style={[styles.textss, {top: '8%'}]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {showCard2 && (
                  <View
                    style={{
                      width: window.WindowWidth * 0.85,
                      paddingBottom: 20,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      borderRadius: 12,
                      top: '3%',
                      paddingBottom: 30,
                      elevation: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#333333',
                        alignSelf: 'center',
                        flexWrap: 'wrap',
                        paddingTop: 10,
                      }}>
                      ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ ବଟନ୍
                      ଉପରେ କ୍ଲିକ୍ କରି ନିଜର ଉତ୍ତର ରେକର୍ଡ କରନ୍ତୁ ।
                    </Text>

                    <TouchableOpacity
                      onPress={() => onStopRecord()}
                      style={styles.record}>
                      <Ionicons
                        name="stop-circle-outline"
                        size={21}
                        style={{top: '8%'}}
                        color="white"
                      />
                      <Text style={styles.textss}>Stop</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {showCard3 && (
                  <View
                    style={{
                      width: window.WindowWidth * 0.85,

                      paddingBottom: 20,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      borderRadius: 12,
                      top: '3%',
                      paddingBottom: 30,

                      elevation: 10,
                    }}>
                    {isPlayings == false ? (
                      <TouchableOpacity
                        onPress={() => startPlaybacks(selectedItem, 'play')}
                        style={{top: '8%'}}>
                        <Image
                          style={{
                            width: 49,
                            height: 49,

                            paddingBottom: 10,
                            alignSelf: 'center',
                          }}
                          source={require('../assets/Image/Player.png')}
                        />
                      </TouchableOpacity>
                    ) : (
                      <>
                        <View>
                          <TouchableOpacity
                            onPress={() => stopPlaybacks(selectedItem, 'stop')}
                            style={{
                              top: '8%',
                            }}>
                            <View>
                              <Image
                                style={{
                                  width: 49,

                                  height: 49,

                                  paddingBottom: 10,
                                  alignSelf: 'center',
                                }}
                                source={require('../assets/Image/stops.png')}
                              />
                            </View>
                          </TouchableOpacity>
                          <View>
                            <Image
                              style={{
                                width: 200,
                                // top: -30,
                                height: 80,
                                // left: 70,
                                alignSelf: 'center',
                              }}
                              source={require('../assets/Image/waves.gif')}
                            />
                          </View>
                        </View>
                      </>
                    )}

                    <Text
                      style={{
                        fontSize: 12,
                        color: '#333333',
                        alignSelf: 'center',
                        flexWrap: 'wrap',
                        paddingTop: 20,
                        flexWrap: 'wrap',
                        paddingLeft: 15,
                        paddingRight: 15,
                      }}>
                      ଆପଣଙ୍କ ଉତ୍ତର ରେକର୍ଡ ହୋଇଯାଇଛି ।ଯଦି ନିଶ୍ଚିତ ଅଛନ୍ତି ତେବେ
                      submit ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ ଅଥବା re-record ବଟନ୍ ଉପରେ
                      କ୍ଲିକ୍ କରି ଆଉଥରେ ରେକର୍ଡ କରନ୍ତୁ।
                    </Text>
                    <View
                      style={{
                        justifyContent: 'space-evenly',
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        onPress={onStartReRecord}
                        style={styles.records}>
                        <Text style={styles.textss}>Re-record</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => onSave(selectedItem, 'yes')}
                        style={styles.records}>
                        <Text style={styles.textss}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-evenly',
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        onPress={() => onCancelRecord()} // Define your onCancelRecord function
                        style={{
                          backgroundColor: '#FF0000', // Change the color as desired
                          borderRadius: 30,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          flexGrow: 1 / 2,
                          marginTop: 10, // Add margin to separate it from the record button
                        }}>
                        <Text
                          style={[
                            styles.textss,
                            {marginTop: 10, marginBottom: 10},
                          ]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </Modal>
      {/* 
modal end */}
    </ScrollView>
  );
};

export default NewQuizTemplate;
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
  submit: {
    width: window.WindowWidth * 0.4,
    // marginLeft: 120,
    borderRadius: 30,
    backgroundColor: Color.royalblue,
    color: 'white',
    alignSelf: 'center',

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
    backgroundColor: Colors.black,
    elevation: 5,
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // input: {
  //   height: window.WindowHeigth * 0.1,
  //   width: window.WindowWidth * 0.83,
  //   justifyContent: 'flex-start',
  //   borderWidth: 1,
  //   borderRadius: 12,
  //   textAlign: 'center',
  // },

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
    borderRadius: 8,
    width: SIZES.WindowWidth * 1,
    padding: 16,
    margin: 8,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
    fontWeight: '600',
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
  cancelButtonText: {
    color: 'red',
  },
});
