import React, {useState, useEffect, useRef, useCallback} from 'react';
import Cameraicon from 'react-native-vector-icons/Feather';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import DocumentPicker from 'react-native-document-picker';
// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import RNFS from 'react-native-fs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import Orientation from 'react-native-orientation-locker';

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

const HEIGHT = Dimensions.get('window').height;

import Nocontents from './Nocontents';
import {log} from 'console';
import {Azure, AzureImage, AzureVideo} from '../components/Azure';
import Loading from './Loading';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioAssessment = ({
  studentAudio,
  onsubmit,
  onAnswerSet,
  onOpenModal,
  onSkipAnswer,
  textInputRef,
  handleOptionSelect,
  handleOptionSelectMulti,
  imageUrl,
  handleAnswerChange,
  onImageSelected,
  onVideoSelected,
  handleChangeText,
  backClear,
}) => {
  const modalRef = useRef(null);
  const modalHeight = HEIGHT * 0.2;
  const [error, setError] = useState(false);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  console.log('selectedItem--->', selectedItem);
  const [allSkills, setAllSkills] = useState(null);
  // console.log('allSkills----->', allSkills);
  const [showCard1, setShowCard1] = useState(true);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlayings, setIsPlayings] = useState(false);
  const [data, setData] = useState();
  // console.log('data---->', data);
  const [submittedQuestionId, setSubmittedQuestionId] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  // console.log('recordId----->', recordId);
  const [currentRecordingState, setCurrentRecordingState] = useState('idle');
  // console.log('currentRecordingState---------->', currentRecordingState);
  const [isLoader, setIsLoader] = useState(false);
  const [showRecordingCard, setShowRecordingCard] = useState(false);
  const [recordSubmit, setRecordSubmit] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [singleOption, setSingleOption] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {};
  // console.log('check3--->', singleOption);
  // console.log(
  //   'currentRecordingState------->',
  //   currentRecordingState,
  //   showRecordingCard,
  // );
  const [loader, setLoader] = useState(false);
  const [uploadedQuestionIds, setUploadedQuestionIds] = useState([]);
  const [isStopButtonClicked, setIsStopButtonClicked] = useState(false);

  const [playbackRate, setPlaybackRate] = useState(1.0); // Default rate is 1.0

  // Function to increase playback speed
  const increasePlaybackSpeed = () => {
    setPlaybackRate(prevRate => (prevRate < 2.0 ? prevRate + 0.25 : 2.0)); // Adjust the increment and max rate as needed
  };

  // Function to decrease playback speed
  const decreasePlaybackSpeed = () => {
    setPlaybackRate(prevRate => (prevRate > 0.5 ? prevRate - 0.25 : 0.5)); // Adjust the decrement and min rate as needed
  };

  const openModal = (index, item, atdStatus) => {
    console.log('check item--->', item);
    setOpenIndex(index);
    setOpenRecordModal(true);
    setSelectedItem(item?.quizData);
    setAllSkills(item);
    onOpenModal(item);
    // setSelectedItem([...item.quizData, {questionId: item.questionId}]);
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
    // This function will be called when the video is loaded
    setVideoLoading(false);
  };

  const updateStateBasedOnQuestionId = questionId => {
    const isSelectedItemRecording =
      currentRecordingState === 'recording' &&
      showRecordingCard &&
      recordId === questionId;

    // console.log('isSelectedItemRecording--------->', isSelectedItemRecording);

    // if (isSelectedItemRecording) {
    if (currentRecordingState === 'recording' && recordId === questionId) {
      setShowCard1(false);
      setShowCard2(true);
      setShowCard3(false);
    } else if (currentRecordingState === 'stopped' && recordId === questionId) {
      setShowCard1(false);
      setShowCard2(false);
      setShowCard3(true);
    } else {
      setShowCard1(true);
      setShowCard2(false);
      setShowCard3(false);
    }
  };

  const onStartRecord = async (recordData, index) => {
    try {
      const directoryPath = `${RNFS.DocumentDirectoryPath}/recordings`;
      await RNFS.mkdir(directoryPath);

      const fileName = `recording_${Date.now()}.mpeg`;
      const recordingPath = `${directoryPath}/${fileName}`;

      const result = await audioRecorderPlayer.startRecorder(recordingPath);

      const questionId = recordData?.questionId;
      setRecordId(questionId);
      ToastAndroid.show('Recording started', ToastAndroid.SHORT);

      audioRecorderPlayer.addRecordBackListener(e => {
        console.log(e?.current_position);
        console.log(e);
        return;
      });

      setShowRecordingCard(true);
      updateStateBasedOnQuestionId(questionId);
      setCurrentRecordingState('recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      ToastAndroid.show(
        'Failed to start recording: ' + error,
        ToastAndroid.SHORT,
      );
    }
  };
  const [isStopButtonClickeds, setStopButtonClicked] = useState(false);
  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setCurrentRecordingState('stopped');
      setData(result);
      audioRecorderPlayer.removeRecordBackListener();
      setIsStopButtonClicked(true); // Set the state when Stop button is clicked
      setStopButtonClicked(true);
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

  const onParentCancelRecord = async () => {
    // setOpenRecordModal(false);
    setCurrentRecordingState('idle');
    setShowRecordingCard(false);
    setRecordId(null);

    const result = await audioRecorderPlayer.stopRecorder();

    setData(result);
    audioRecorderPlayer.removeRecordBackListener();

    //   setShowCard1(true);
    //   setShowCard2(false);
    //   setShowCard3(false);
    //   setCurrentRecordingState('idle');
    //   setShowRecordingCard(false);
  };

  const onCancelRecord = questionId => {
    // console.log(
    //   'check--->',
    //   questionId,
    //   currentRecordingState,
    //   showRecordingCard,
    //   // recordId === item.questionId;
    // );

    setCurrentRecordingState('idle');
    setShowRecordingCard(false);
    setRecordId(null);

    // setOpenRecordModal(false);
    //   setShowCard1(true);
    //   setShowCard2(false);
    //   setShowCard3(false);
    //   setCurrentRecordingState('idle');
    //   setShowRecordingCard(false);
  };

  const onSkipCancelRecord = (questionId, item) => {
    // console.log('check2--->', questionId, item);
    // console.log('check3--->', skippedQuestions);
    setSkippedQuestions(prevSkippedQuestions =>
      prevSkippedQuestions.filter(id => id !== item.questionId),
    );
    setCurrentRecordingState('idle');
    setShowRecordingCard(false);
    setRecordId(null);
  };

  const startPlaybacks = async selectedItem => {
    try {
      // console.log('resultplay----->', selectedItem);
      setIsLoader(true);
      await audioRecorderPlayer.startPlayer(data);
      audioRecorderPlayer.addPlayBackListener(e => {
        // console.log('start------->', e.currentPosition, e.duration);
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
    // console.log('stop----->', selectedItem);
    try {
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

  //questionmediatype audio
  const startPlayback = async item => {
    try {
      const path = item.questionMedia; // Replace with the actual audio file path
      // Set isLoading state to true to show the loader
      setIsLoader(true);
      await audioRecorderPlayer.startPlayer(path);
      setIsPlaying(true);
      setIsLoader(false);
      // Set isLoading state back to false when playback starts
    } catch (error) {
      setIsLoader(false); // Set isLoading state back to false if there's an error
      setIsLoader(false);
    }
  };

  const stopPlayback = async item => {
    try {
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying(false);
    } catch (error) {}
  };

  const onStartReRecord = () => {
    setCurrentRecordingState('idle');
    setShowRecordingCard(false);
    setRecordId(null);
  };

  const back = async () => {
    Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ!', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'default',
      },
      {
        text: 'Ok',
        onPress: async () => {
          setVideoUrl('');
          backClear();
          setOpenRecordModal(false);
          setCurrentRecordingState('');
          setShowRecordingCard(false);
          setRecordId('');
          setIsPlayings(false);
          setSkippedQuestions([]);
          setSubmittedQuestionId(null);
          setUploadedQuestionIds(null);
          await audioRecorderPlayer.stopPlayer();
          setIsPlaying(false);
          setIsLoader(false);
        },
        style: 'default',
      },
    ]);
  };

  const pickVideo = async questionId => {
    setLoader(true);
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      // Process the picked video file here
      // console.log('Picked video:', res);

      const fileUri = res[0]?.uri;
      console.log('fileUri:', fileUri);

      const uploadResult = await AzureVideo(fileUri);

      console.log('uploadResult---->', uploadResult, uploadResult.success);
      if (uploadResult.success === true) {
        setLoader(false);
        setVideoUrl(uploadResult?.url);
        // onVideoSelected(uploadResult?.url, questionId);
        setSelectedItem(prevData => {
          return prevData.map(item => {
            if (item.questionId === questionId) {
              console.log('checkid--->', item.questionId, questionId);
              // Update the answer URL for the specific questionId
              onVideoSelected(uploadResult?.url, questionId);
              return {
                ...item,
                answer: uploadResult?.url,
                answered: 'yes',
              };
            }
            return item;
          });
        });
      } else {
        setLoader(false);
        Alert.alert('', 'Video can not be uploaded!', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'default',
          },
          {
            text: 'Ok',
            onPress: () => null,
            style: 'default',
          },
        ]);
      }
      // const pathSegments = uploadResult?.url.split('/');
      // const filename = pathSegments[pathSegments.length - 1];
      // console.log('imageurl---->', uploadResult?.url);
    } catch (err) {
      setLoader(false);
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        // Error handling
        console.log('Error picking video:', err);
      }
    }
  };

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
  const [openQuestionId, setOPenQuestionId] = useState('');
  const handleOpenBottomSheet = useCallback(questionId => {
    // console.log('questionId---->', questionId);
    setOPenQuestionId(questionId);
    try {
      // console.log('try--->');

      modalRef.current?.open();
      // console.log('try--->2');
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
              .then(async image => {
                setError(false);
                // onImageSelected(image.path, openQuestionId);
                // setImageData(image);
                const uploadResult = await AzureImage(image.path);
                // setImageUrl(uploadResult?.url);

                const pathSegments = uploadResult?.url.split('/');
                const filename = pathSegments[pathSegments.length - 1];
                console.log('filename--->', filename);
                console.log('image.path--->', image.path);
                setImageData(filename);
                console.log('imageurl---->', uploadResult?.url);
                setSelectedItem(prevData => {
                  return prevData.map(item => {
                    if (item.questionId === openQuestionId) {
                      console.log('checkid--->', item.questionId, questionId);
                      // Update the answer URL for the specific questionId
                      onImageSelected(uploadResult?.url, openQuestionId);
                      return {
                        ...item,
                        answer: uploadResult?.url,
                        answered: 'yes',
                      };
                    }
                    return item;
                  });
                });
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
        .then(async image => {
          setError(false);
          // setImageUrl(image.path);

          // onImageSelected(image.path, openQuestionId);
          const uploadResult = await AzureImage(image.path);
          // setImageUrl(uploadResult?.url);

          const pathSegments = uploadResult?.url.split('/');
          const filename = pathSegments[pathSegments.length - 1];
          console.log('filename--->', filename);
          console.log('image.path--->', image.path);
          setImageData(filename);
          console.log('imageurl---->', uploadResult?.url);
          setSelectedItem(prevData => {
            return prevData.map(item => {
              if (item.questionId === openQuestionId) {
                console.log('checkid--->', item.questionId, questionId);
                // Update the answer URL for the specific questionId
                onImageSelected(uploadResult?.url, openQuestionId);
                return {...item, answer: uploadResult?.url, answered: 'yes'};
              }
              return item;
            });
          });
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

  const handleTextInputChange = (item, newAnswer, questionId) => {
    setSelectedItem(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const questionIndex = newData.findIndex(
        items => items.questionId === questionId,
      );
      if (questionIndex !== -1) {
        newData[questionIndex].answer = newAnswer;
      }
      handleChangeText(questionId, newAnswer);
      return;
      console.log('newData---->', newData), newData;
    });
  };

  const handleSubmit = () => {
    onsubmit(allSkills, setOpenRecordModal);
  };

  const onSave = async (selectedItem, atdStatus) => {
    try {
      const questionId = selectedItem.questionId;

      // Ensure selectedItem is not null or undefined
      if (!selectedItem) {
        throw new Error('Selected item is null or undefined');
      }

      // Create a copy of selectedItem to avoid direct mutation
      const updatedItem = {
        ...selectedItem,
        active: atdStatus === 'yes' ? 'yes' : 'no',
      };

      // Ensure selectedQuestion is an array before mapping
      const modifiedButton = Array.isArray(selectedQuestion)
        ? selectedQuestion.map(element => {
            if (element.questionId === questionId) {
              return {...element, active: atdStatus === 'yes' ? 'yes' : 'no'};
            }
            return element;
          })
        : [];
      setSelectedQuestion(modifiedButton);

      setRecordSubmit(true);

      const fileUri = data;
      const uploadResult = await Azure(fileUri);

      if (uploadResult.success) {
        setUploadedQuestionIds(prevIds =>
          Array.isArray(prevIds) ? [...prevIds, questionId] : [questionId],
        );
        setResponseStatus(uploadResult?.status);
        onAnswerSet(uploadResult.url, questionId);
      } else {
        setSubmittedQuestionId(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 413) {
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
    }
  };

  const onSkipRecord = (item, status) => {
    // console.log('skip=--->', item, status);
    setSkippedQuestions(prevSkippedQuestions => [
      ...prevSkippedQuestions,
      item.questionId,
    ]);
    onSkipAnswer(item.questionId, status);
  };

  const singleOptionSelect = (item, selectedOption) => {
    setSelectedItem(prevItems => {
      return prevItems.map(prevItem => {
        if (prevItem.questionId === item.questionId) {
          const updatedItem = {
            ...prevItem,
            selectedOption: selectedOption,
            answered: 'yes',
          };
          console.log('Updated Item:', updatedItem);
          handleOptionSelect(updatedItem, item?.questionId);
          return updatedItem;
        }
        return prevItem;
      });
    });
  };

  const multiOptionSelect = (multiQuestion, selectedOption) => {
    console.log('selectedOption----->', multiQuestion, selectedOption);
    setSelectedItem(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === multiQuestion.questionId) {
          // Initialize selectedOption as an empty array if it's undefined
          const updatedSelectedOptions = item.selectedOption || [];

          // Check if selectedOption is already in the array
          const isSelected = updatedSelectedOptions.includes(selectedOption);

          // Update the array based on isSelected
          const updatedOptions = isSelected
            ? updatedSelectedOptions.filter(option => option !== selectedOption) // Remove the option
            : [...updatedSelectedOptions, selectedOption]; // Add the option

          console.log('updatedOptions--->', updatedOptions);
          handleOptionSelectMulti(updatedOptions, multiQuestion.questionId);
          return {...item, selectedOption: updatedOptions, answered: 'yes'};
        }
        return item;
      });
      return newData;
    });
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
        {studentAudio?.map((item, index) => {
          console.log('itemstude--->', item);
          return (
            <View style={styles.card}>
              <Text style={styles.title}>
                {' '}
                ପ୍ରଶ୍ନ ({index + 1}). {''} {item?.skillName}
              </Text>

              <>
                <View
                  style={{
                    paddingBottom: 20,
                    paddingTop: 10,
                    alignSelf: 'center',
                  }}>
                  <View style={{}}>
                    {item?.quizStatus === 'complete' ? (
                      <TouchableOpacity>
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
                              fontSize: 14,
                              paddingLeft: 10,
                              textAlign: 'center',
                              padding: 10,
                              top: -5,
                              color: 'white',
                            }}>
                            Completed
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
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
              </>
            </View>
          );
        })}
      </>

      {/* modal start */}
      <Modal visible={openRecordModal} onRequestClose={() => back()}>
        <ScrollView>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{justifyContent: 'center', alignSelf: 'center'}}
            />
          ) : (
            <View style={styles.centeredView}>
              {Array.isArray(selectedItem) ? (
                selectedItem?.map((item, index) => {
                  // console.log('check map---->', item);
                  const isSelectedItemRecording =
                    currentRecordingState === 'recording' &&
                    showRecordingCard &&
                    recordId === item.questionId;

                  const isStopButtonClickedForItem =
                    currentRecordingState === 'stopped' &&
                    recordId === item.questionId;

                  const isSelectedItemPlaying =
                    currentRecordingState === 'stopped' &&
                    recordId === item.questionId &&
                    isPlayings;

                  const isStopButtonClickedForThisQuestion =
                    isStopButtonClickeds && recordId === item.questionId;
                  const isSkipped = skippedQuestions.includes(item.questionId);

                  console.log('isSkipped---->', isSkipped);

                  return (
                    <View
                      style={[
                        styles.modalView,
                        {
                          width: window.WindowWidth * 0.95,
                          borderRadius: 20,
                          paddingBottom: 150,
                        },
                      ]}
                      key={index}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: FontFamily.poppinsMedium,
                          color: 'black',
                          alignSelf: 'flex-start',
                        }}>
                        Q({index + 1}). {item?.question}
                      </Text>

                      {item.instructions?.length > 0 ? (
                        <View
                          style={{
                            width: window.WindowWidth * 0.8,
                            alignSelf: 'center',
                            borderColor: Color.royalblue,
                            borderWidth: 0.5,
                            paddingBottom: 5,
                            // paddingTop: 10,
                            // bottom: -20,
                            marginTop: 19,
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

                      {item.questionMediaType === 'audio' && (
                        <>
                          <View
                            style={{
                              // paddingBottom: 15,
                              // paddingTop: 15,
                              // top: '-15%',
                              padding: 10,
                              alignSelf: 'center',
                            }}>
                            <View
                              style={{
                                width: window.WindowWidth * 0.9,
                                paddingBottom: 20,
                                backgroundColor: Color.ghostwhite,
                                borderRadius: 10,

                                paddingTop: 10,
                                alignSelf: 'center',
                              }}>
                              <>
                                {isPlaying == false ? (
                                  <>
                                    {isLoader ? (
                                      <ActivityIndicator
                                        size="large"
                                        color={Colors.primary}
                                        style={{
                                          justifyContent: 'center',
                                          alignSelf: 'center',
                                        }}
                                      />
                                    ) : (
                                      <TouchableOpacity
                                        style={{
                                          top: '8%',
                                          flexDirection: 'row',
                                        }}
                                        onPress={() =>
                                          startPlayback(item, 'play')
                                        }>
                                        <Image
                                          style={{
                                            width: 30,
                                            top: -30,
                                            height: 30,
                                            left: 20,

                                            paddingBottom: 10,
                                            alignSelf: 'flex-start',
                                          }}
                                          source={require('../assets/Image/Player.png')}
                                        />
                                        <Text
                                          style={{
                                            fontSize: 13,
                                            color: '#000000',
                                            fontFamily:
                                              FontFamily.poppinsMedium,
                                            left: 20,
                                            top: -25,
                                          }}>
                                          {' '}
                                          Play Audio
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </>
                                ) : (
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
                                          }}
                                          source={require('../assets/Image/waves.gif')}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  </>
                                )}
                              </>
                            </View>
                          </View>
                        </>
                      )}

                      {item.questionMediaType === 'video' && (
                        <View
                          style={{
                            width: '100%',
                            paddingBottom: 40,
                            backgroundColor: 'white',
                            borderRadius: 10,

                            paddingTop: 20,
                            paddingLeft: 20,
                            paddingRight: 20,
                            alignSelf: 'center',
                          }}>
                          <View style={{aspectRatio: 17 / 9}}>
                            <TouchableOpacity
                              onPress={() => openVideoModal(item)}>
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
                      )}

                      {item.questionMediaType === 'image' && (
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
                            backgroundColor: Colors.white,
                          }}>
                          {loadingImage ? (
                            <ActivityIndicator
                              size="large"
                              color={Colors.yourLoaderColor}
                            />
                          ) : (
                            <Image
                              source={{uri: `${item.questionMedia}`}}
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
                      )}

                      {/* {answerType Video} */}
                      {item.answerType === 'videoInput' && (
                        <>
                          {loader ? (
                            <ActivityIndicator
                              size="large"
                              color={Colors.primary}
                              style={{
                                justifyContent: 'center',
                                alignSelf: 'center',
                              }}
                            />
                          ) : (
                            <View>
                              {videoUrl?.length > 0 ||
                              item?.answer?.length > 0 ? (
                                <TouchableOpacity>
                                  <View
                                    style={{
                                      marginTop: 35,
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
                                  onPress={() => pickVideo(item.questionId)}>
                                  <Image
                                    style={{
                                      width: 200,
                                      height: 200,
                                      top: '15%',
                                    }}
                                    resizeMode="cover"
                                    source={require('../assets/Image/uploadvideo.png')}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </>
                      )}

                      {/*Answer type audio */}
                      {item.answerType === 'audioInput' &&
                        (submittedQuestionId === item.questionId ||
                        (uploadedQuestionIds &&
                          uploadedQuestionIds.includes(item.questionId)) ||
                        item.answered === 'yes' ? (
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
                        ) : isSkipped ? (
                          <>
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
                                Skipped
                              </Text>
                            </View>
                            <View
                              style={{
                                justifyContent: 'space-evenly',
                                flexDirection: 'row',
                              }}>
                              <TouchableOpacity
                                onPress={() =>
                                  onSkipCancelRecord(item.questionId, item)
                                }
                                style={{
                                  backgroundColor: '#FF0000',
                                  borderRadius: 30,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  flexGrow: 1 / 2,
                                  marginTop: 10,
                                }}>
                                <Text
                                  style={[
                                    styles.textss,
                                    {marginTop: 10, marginBottom: 10},
                                  ]}>
                                  Re-record
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : item.answered === 'skip' ? (
                          <>
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
                                Skipped
                              </Text>
                            </View>
                          </>
                        ) : !isSelectedItemRecording &&
                          !isStopButtonClickedForItem &&
                          !isSelectedItemPlaying ? (
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
                              ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ
                              ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ ।
                            </Text>

                            <TouchableOpacity
                              onPress={() => onStartRecord(item, index)}
                              style={{
                                backgroundColor: Color.royalblue,
                                borderRadius: 30,
                                width: 126,
                                paddingBottom: 20,
                                flexDirection: 'row',
                                alignSelf: 'center',
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
                              <Text style={[styles.textss, {top: '8%'}]}>
                                Record
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => onSkipRecord(item, 'skip')}
                              style={{
                                backgroundColor: '#FF0000',
                                borderRadius: 30,
                                width: 126,
                                paddingBottom: 20,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                top: '5%',
                                flexGrow: 1,
                                marginTop: 10,
                              }}>
                              <Text style={[styles.textss, {top: '8%'}]}>
                                Skip
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : isSelectedItemRecording &&
                          !isStopButtonClickedForItem ? (
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
                            {/* Content for recording view */}
                            <Text
                              style={{
                                fontSize: 13,
                                color: '#333333',
                                alignSelf: 'center',
                                flexWrap: 'wrap',
                                paddingTop: 10,
                              }}>
                              ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ
                              ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରି ନିଜର ଉତ୍ତର ରେକର୍ଡ କରନ୍ତୁ ।
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
                        ) : (
                          isStopButtonClickedForThisQuestion && (
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
                              {/* Content for the view after stopping recording */}
                              {isPlayings == false ? (
                                <TouchableOpacity
                                  onPress={() => startPlaybacks(item, 'play')}
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
                                      onPress={() =>
                                        stopPlaybacks(item, 'stop')
                                      }
                                      style={{top: '8%'}}>
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
                                          height: 80,
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
                                {/* Additional content for the view after stopping recording */}
                                ଆପଣଙ୍କ ଉତ୍ତର ରେକର୍ଡ ହୋଇଯାଇଛି । ଯଦି ନିଶ୍ଚିତ
                                ଅଛନ୍ତି ତେବେ submit ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ ଅଥବା
                                re-record ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରି ଆଉଥରେ ରେକର୍ଡ
                                କରନ୍ତୁ।
                              </Text>
                              <View
                                style={{
                                  justifyContent: 'space-evenly',
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  onPress={onStartReRecord}
                                  style={[styles.records, {marginTop: 23}]}>
                                  <Text style={styles.textss}>Re-record</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => onSave(item, 'yes')}
                                  style={[styles.records, {marginTop: 23}]}>
                                  <Text style={[styles.textss, {top: 5}]}>
                                    Submit
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'space-evenly',
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    onCancelRecord(item.questionId)
                                  }
                                  style={{
                                    backgroundColor: '#FF0000',
                                    borderRadius: 30,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    flexGrow: 1 / 2,
                                    marginTop: 10,
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
                          )
                        ))}
                      {/* Answer type audio */}

                      {/* Answer type text */}
                      {item.answerType === 'textInput'
                        ? (console.log('text-->', item),
                          (
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
                                handleTextInputChange(
                                  item,
                                  newAnswer,
                                  item.questionId,
                                )
                              }
                              value={item?.answer ? item?.answer : ''}
                            />
                          ))
                        : null}
                      {/* Answer type text */}

                      {/* Answer type Image */}
                      {item.answerType === 'imageInput' && (
                        <>
                          {/* //Image modal starts */}
                          <ButtomSheet
                            modalRef={modalRef}
                            modalHeight={modalHeight}>
                            <View style={styles.modalContainer}>
                              <TouchableOpacity
                                onPress={() => modalRef.current?.close()}
                                style={styles.modalButtonContainer}>
                                <CloseIcon
                                  name="closesquare"
                                  size={30}
                                  color={Colors.primary}
                                />
                                {/* <Text style={{color: 'white'}}>Close</Text> */}
                              </TouchableOpacity>
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
                                width: window.WindowWidth * 0.9,
                                paddingBottom: 10,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                // borderWidth: 1,
                                // borderColor: Color.royalblue,
                                paddingTop: 20,
                              }}>
                              <Image
                                style={
                                  {
                                    // width: '100%',
                                    // top: '-5%',
                                    // height: 'auto',
                                    // aspectRatio: 13 / 15,
                                    // alignSelf: 'center',
                                  }
                                }
                                resizeMode="cover"
                                source={
                                  error
                                    ? null
                                    : imageUrl[item?.questionId]
                                    ? {uri: imageUrl[item?.questionId]}
                                    : item?.answer?.length > 0
                                    ? {uri: item?.answer}
                                    : null
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

                              {imageUrl[item?.questionId]?.length > 0 ||
                              item?.answer.length > 0 ? (
                                <TouchableOpacity
                                  //onPress={() => onStartRecord(ele, i, 1)}
                                  key={index}
                                  style={{
                                    backgroundColor: 'green',
                                    borderRadius: 30,
                                    width: '50%',
                                    paddingBottom: 5,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // top: '5%',
                                    flexGrow: 1,
                                  }}>
                                  <View>
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
                                  //onPress={() => onStartRecord(ele, i, 1)}
                                  key={index}
                                  onPress={() =>
                                    handleOpenBottomSheet(item.questionId)
                                  }
                                  style={{
                                    backgroundColor: 'green',
                                    backgroundColor: studentAudio?.filter(x =>
                                      x?.active === 'yes'
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
                              )}
                            </View>
                          </View>
                        </>
                      )}
                      {/* Answer type Image */}

                      {/* Answer type options */}
                      {item.answerType === '4options' &&
                        item.optionType === 'single' && (
                          <>
                            <View>
                              <View key={item.questionId}>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'a')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'a'
                                          ? item?.selectedOption?.[0] ===
                                            item?.correctOption?.[0]
                                            ? '#0060ca'
                                            : '#0060ca'
                                          : 'white',
                                      borderRadius: 20,
                                      borderWidth: 1,
                                      color: 'white',
                                      width: SIZES.WindowWidth * 0.8,
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
                                          item?.selectedOption?.[0] === 'a'
                                            ? item?.selectedOption?.[0] ===
                                              item?.correctOption?.[0]
                                              ? 'white' // Matched option, change text color to white
                                              : 'white' // Default text color
                                            : 'black', // Default text color
                                        paddingLeft: 10,
                                        fontSize: 15,
                                      }}>
                                      {' '}
                                      A . {item.optionA}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'b')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'b'
                                          ? item?.selectedOption?.[0] ===
                                            item?.correctOption?.[0]
                                            ? '#0060ca' // Matched option, change background color to blue
                                            : '#0060ca' // Selected but incorrect option, change background color to blue (for example)
                                          : 'white', // Default background color
                                      borderRadius: 20,
                                      borderWidth: 1,
                                      color: 'white',
                                      width: SIZES.WindowWidth * 0.8,
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
                                          item?.selectedOption?.[0] === 'b'
                                            ? item?.selectedOption?.[0] ===
                                              item?.correctOption?.[0]
                                              ? 'white' // Matched option, change text color to white
                                              : 'white' // Default text color
                                            : 'black', // Default text color
                                        paddingLeft: 10,
                                        fontSize: 15,
                                      }}>
                                      {' '}
                                      B . {item.optionB}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'c')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'c'
                                          ? item?.selectedOption?.[0] ===
                                            item?.correctOption?.[0]
                                            ? '#0060ca' // Matched option, change background color to blue
                                            : '#0060ca' // Selected but incorrect option, change background color to blue (for example)
                                          : 'white', // Default background color
                                      borderRadius: 20,
                                      borderWidth: 1,
                                      color: 'white',
                                      width: SIZES.WindowWidth * 0.8,
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
                                          item?.selectedOption?.[0] === 'c'
                                            ? item?.selectedOption?.[0] ===
                                              item?.correctOption?.[0]
                                              ? 'white' // Matched option, change text color to white
                                              : 'white' // Default text color
                                            : 'black', // Default text color
                                        paddingLeft: 10,
                                        fontSize: 15,
                                      }}>
                                      {' '}
                                      C . {item.optionC}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'd')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'd'
                                          ? item?.selectedOption?.[0] ===
                                            item?.correctOption?.[0]
                                            ? '#0060ca' // Matched option, change background color to blue
                                            : '#0060ca' // Selected but incorrect option, change background color to blue (for example)
                                          : 'white', // Default background color
                                      borderRadius: 20,
                                      borderWidth: 1,
                                      color: 'white',
                                      width: SIZES.WindowWidth * 0.8,
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
                                          item?.selectedOption?.[0] === 'd'
                                            ? item?.selectedOption?.[0] ===
                                              item?.correctOption?.[0]
                                              ? 'white' // Matched option, change text color to white
                                              : 'white' // Default text color
                                            : 'black', // Default text color
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
                              <View
                                key={item.questionId}
                                style={{position: 'absolute', right: 43}}>
                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'a')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'a',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'a')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '17%'}}>
                                    <Text>{item.optionA}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'b')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'b',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'b')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '17%'}}>
                                    <Text>{item.optionB}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'c')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'c',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'c')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '17%'}}>
                                    <Text>{item.optionC}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'd')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'd',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'd')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '17%'}}>
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
                                  onPress={() => singleOptionSelect(item, 'a')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,

                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'a'
                                          ? // &&
                                            // item?.selectedOption?.[0] ===
                                            //   item?.correctOption?.[0]
                                            '#0060ca'
                                          : item?.selectedOption?.[0] === 'a'
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
                                          item?.selectedOption?.[0] === 'a'
                                            ? // &&
                                              // item?.selectedOption?.[0] ===
                                              //   item?.correctOption?.[0]
                                              'white' // Matched option, change text color to white
                                            : 'black', // Default text color
                                        paddingLeft: 10,
                                        fontSize: 15,
                                      }}>
                                      {' '}
                                      A . {item.optionA}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'b')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'b'
                                          ? // &&
                                            // item?.selectedOption?.[0] ===
                                            //   item?.correctOption?.[0]
                                            '#0060ca' // Matched option, change background color to blue
                                          : item?.selectedOption?.[0] === 'b'
                                          ? '#0060ca' // Selected but incorrect option, change background color to red (for example)
                                          : 'white', // Default background color
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
                                          item?.selectedOption?.[0] === 'b'
                                            ? // &&
                                              // item?.selectedOption?.[0] ===
                                              //   item?.correctOption?.[0]
                                              'white' // Matched option, change text color to white
                                            : 'black', // Default text color
                                        paddingLeft: 10,
                                        fontSize: 15,
                                      }}>
                                      {' '}
                                      B . {item.optionB}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'c')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'c'
                                          ? // &&
                                            // item?.selectedOption?.[0] ===
                                            //   item?.correctOption?.[0]
                                            '#0060ca' // Matched option, change background color to blue
                                          : item?.selectedOption?.[0] === 'c'
                                          ? '#0060ca' // Selected but incorrect option, change background color to red (for example)
                                          : 'white', // Default background color
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
                                          item?.selectedOption?.[0] === 'c'
                                            ? // &&
                                              // item?.selectedOption?.[0] ===
                                              //   item?.correctOption?.[0]
                                              'white' // Matched option, change text color to white
                                            : 'black', // Default text color
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
                              <View
                                key={item.questionId}
                                style={{position: 'absolute', right: 50}}>
                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'a')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'a',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'A')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '19%'}}>
                                    <Text>{item.optionA}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'b')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'b',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'b')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '19%'}}>
                                    <Text>{item.optionB}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'c')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'c',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'c')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '19%'}}>
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
                                  onPress={() => singleOptionSelect(item, 'a')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'a' &&
                                        item?.selectedOption?.[0] ===
                                          item?.correctOption?.[0]
                                          ? '#0060ca' // Matched option, change background color to blue
                                          : item?.selectedOption?.[0] === 'a'
                                          ? 'red' // Selected but incorrect option, change background color to red (for example)
                                          : 'white', // Default background color
                                      borderRadius: 20,
                                      borderWidth: 1,
                                      color: 'white',
                                      width: SIZES.WindowWidth * 0.8,
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
                                          item?.selectedOption?.[0] === 'a' &&
                                          item?.selectedOption?.[0] ===
                                            item?.correctOption?.[0]
                                            ? 'white' // Matched option, change text color to white
                                            : 'black', // Default text color
                                        paddingLeft: 10,
                                        fontSize: 15,
                                      }}>
                                      {' '}
                                      A . {item.optionA}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => singleOptionSelect(item, 'b')}>
                                  <View
                                    style={{
                                      borderColor: Color.royalblue,
                                      backgroundColor:
                                        item?.selectedOption?.[0] === 'b' &&
                                        item?.selectedOption?.[0] ===
                                          item?.correctOption?.[0]
                                          ? '#0060ca' // Matched option, change background color to blue
                                          : item?.selectedOption?.[0] === 'b'
                                          ? 'red' // Selected but incorrect option, change background color to red (for example)
                                          : 'white', // Default background color
                                      borderRadius: 20,
                                      borderWidth: 1,
                                      color: 'white',
                                      width: SIZES.WindowWidth * 0.8,
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
                                          item?.selectedOption?.[0] === 'b' &&
                                          item?.selectedOption?.[0] ===
                                            item?.correctOption?.[0]
                                            ? 'white' // Matched option, change text color to white
                                            : 'black', // Default text color
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
                              <View
                                key={item.questionId}
                                style={{position: 'absolute', right: 52}}>
                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'a')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'a',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'a')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '19%'}}>
                                    <Text>{item.optionA}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}
                                  onPress={() => multiOptionSelect(item, 'b')}>
                                  <View
                                    style={{
                                      alignSelf: 'stretch',
                                      paddingLeft: 20,
                                      top: 10,
                                    }}>
                                    <CheckBox
                                      value={item?.selectedOption?.includes(
                                        'b',
                                      )}
                                      style={{alignSelf: 'center'}}
                                      tintColors={{
                                        true: '#0060ca',
                                        false: '#0060ca',
                                      }}
                                      onChange={() =>
                                        multiOptionSelect(item, 'b')
                                      }
                                    />
                                  </View>
                                  <View style={{top: '19%'}}>
                                    <Text>{item.optionB}</Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </>
                        )}

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
                                      singleOptionSelect(item, option.value)
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
                                      singleOptionSelect(item, option.value)
                                    }
                                    labelStyle={{
                                      fontSize: 15,
                                      color:
                                        item?.selectedOption?.length > 0
                                          ? item?.selectedOption[0] ===
                                            option.value[0]
                                          : item?.selectedOption ===
                                            option.value
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

                      {/* Answer type options */}
                    </View>
                  );
                })
              ) : (
                <Text>Selected item is not an array.</Text>
              )}

              {selectedItem?.length > 0 ? (
                <TouchableOpacity onPress={handleSubmit} style={styles.records}>
                  <Text style={styles.textss}>Submit</Text>
                </TouchableOpacity>
              ) : (
                <Nocontents />
              )}

              {/* {Array.isArray(selectedItem)?.length > 0 ? (
                <TouchableOpacity onPress={handleSubmit} style={styles.records}>
                  <Text style={styles.textss}>Submit</Text>
                </TouchableOpacity>
              ) : // <Nocontents />
              null} */}
            </View>
          )}
        </ScrollView>
      </Modal>

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
              rate={playbackRate} // Apply the playback rate here
            />
            <Button title="Increase Speed" onPress={increasePlaybackSpeed} />
            <Button title="Decrease Speed" onPress={decreasePlaybackSpeed} />
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
            {/* <TouchableOpacity onPress={downloadVideo}>
                            <Text>Download Video</Text>
                          </TouchableOpacity> */}
          </View>
        </ScrollView>
      </Modal>
      {/* ------------------------button section-------------------------- */}
      {/*modal end */}
    </ScrollView>
  );
};

export default AudioAssessment;

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
    paddingBottom: 15,
    // padding: 10,
    top: '20%',
    flexDirection: 'row',
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    top: '-3%',
    // position: 'absolute',
    // bottom: 0,
    // // flexGrow: 1,
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
    // padding: 10,
    // paddingBottom: 30,
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
    // marginBottom: -38,
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

const radioOptions = [
  {label: 'ହଁ', value: ['yes']},
  {label: 'ନା', value: ['no']},
];
