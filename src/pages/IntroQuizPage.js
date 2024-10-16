import React, {useEffect, useState, useCallback, useRef} from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  BackHandler,
  Modal,
  FlatList,
  ImageBackground,
  Pressable,
  Image,
  Share,
  PermissionsAndroid,
  StatusBar,
  TextInput,
  Button,
  Animated,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import * as window from '../utils/dimensions';
import ButtomSheet from '../components/BottomSheet';
import Cameraicon from 'react-native-vector-icons/Feather';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';
import NewQuizTemplate from '../components/NewQuizTemplate';
import CheckBox from '@react-native-community/checkbox';
import Loader from '../components/Loader';
import {ScrollView} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../utils/Colors';
import * as SIZES from '../utils/dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import ProgressBar from '../components/ProgressBar';
import {app_versions} from './Home';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import LinearGradient from 'react-native-linear-gradient';

const IntroQuizPage = ({navigation, route}) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const user = useSelector(state => {
    // console.log('state----------##########--------------', state);
    return state.userdata?.user?.resData;
  });
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const [quiz_status, set_Quiz_status] = useState(false);
  const [introDatas, setIntroDatas] = useState([]);
  const [questionModal, setQuestionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState(0);
  const [isPlaying, setIsPlaying] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [error, setError] = useState(false);
  const [openQuestionId, setOPenQuestionId] = useState('');
  const [imageData, setImageData] = useState({});
  const audioPlayer = new AudioRecorderPlayer();
  const HEIGHT = Dimensions.get('window').height;
  const modalHeight = HEIGHT * 1.2;

  const radioOptions = [
    {label: 'ହଁ', value: ['yes']},
    {label: 'ନା', value: ['no']},
  ];

  useEffect(() => {
    if (user?.length > 0) {
      setLoading(true);
      API.get(`getTransIntroQuiz/${user[0]?.userid}/${user[0]?.usertype}`).then(
        response => {
          // setStatuss(response.data.completionStatus);

          set_Quiz_status(true);
          // console.log('intro response1------>', userid, usertype);
          // setLoading(false);
          if (response.data.completionStatus === 'complete') {
            navigation.navigate('home');
            setLoading(false);
            // setModalVisibleIntro(false);
          } else {
            setLoading(false);
            // setModalVisibleIntro(true);
            // setIsloading(false);
            setIntroDatas(response.data.quizData);
          }
        },
      );
    } else {
      navigation.navigate('login');
    }
  }, []);

  const handleOpenBottomSheet = useCallback(questionId => {
    // console.log('questionId---->', questionId);
    setOPenQuestionId(questionId);
    try {
      // console.log('try--->');

      modalRef.current?.open();
      // console.log('try--->2');
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  }, []);

  const handleSaveAssessment = () => {
    // console.log('check');
    navigation.navigate('dashboard');
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const backAction = () => {
        // setModal(true);

        Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'You have to attend this Quiz .', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'default',
          },
          {text: 'Ok', onPress: () => null, style: 'default'},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const azureUpload = async (uploadResult, questionId) => {
    console.log('uploadResult======>', uploadResult);
    console.log('questionId==========>', questionId);
    setIntroDatas(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: uploadResult, answered: 'no'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  const handleQuizSubmit = () => {
    const checkDataLengthOption = introDatas.filter(
      x => x.selectedOption?.length,
    );
    const checkDataLengthAnswer = introDatas.filter(x => x.answer?.length);

    if (
      introDatas?.length ===
      checkDataLengthOption.length + checkDataLengthAnswer.length
    ) {
      const body = {
        userid,
        username,
        usertype,
        managerid,
        managername,
        passcode,
        quizData: introDatas,
        securedMarks: 12,
        totalMarks: 20,
        appVersion: app_versions,
      };

      console.log('body---->', body);

      try {
        // dispatch(types.introQuizStart(data));
        console.log('Data has been saved!');
        API.post(`saveTransIntroQuiz`, body).then(response => {
          Alert.alert(`ପ୍ରାରମ୍ଭିକ କୁଇଜ୍ ସଫଳତାର ସହ ସେଭ୍ ହୋଇଛି।`, '', [
            {
              text: 'Ok',
              onPress: () => navigation.navigate('home'),
              style: 'default',
            },
          ]);
          // console.log('check intro------->', response);
          if (response.status === 201) {
            // setModalVisibleIntro(false);
            // const data = {
            //   loginType: 'google',
            //   emailid: user[0]?.emailid,
            //   contactnumber: user[0]?.contactnumber,
            // };
            // dispatch(types.loadUserStartbyphone(data));
            // dispatch(types.introQuizStart());
          }
        });
      } catch (error) {
        if (error.response.status === 413) {
          console.log('error is---------------->', error);
          Alert.alert('The entity is too large !');
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
          Alert.alert('Gateway Timeout: The server is not responding!');
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Error is------------------->:', error);
        }
      }

      // API.post(`saveTransTchTrainingQuiz`, data).then(res => {
      //   console.log('res.data====>', res.data);
      // });
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', [
        {text: 'OK', onPress: () => null},
      ]);
    }
  };

  const handleAnswerChange = (questionId, newAnswer) => {
    // console.log('check---->', questionId, newAnswer);
    setIntroDatas(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: newAnswer, answered: 'no'};
        }
        return item;
      });
    });

    // setIntroDatas(prevData => {
    //   const newData = [...prevData];
    //   const questionIndex = questionOrder;
    //   // const questionIndex = newData.findIndex(
    //   //   item => item.questionId === questionOrder.questionId,
    //   // );
    //   console.log('questionIndex----------------------->', questionIndex);
    //   if (questionIndex !== -1) {
    //     newData[questionIndex].answer = newAnswer;
    //   }
    //   console.log('newData:', newData);
    //   return newData;
    // });
  };

  //For TextInput Ends

  //For OPtional Question i.e 4,3,2 Options starts    Quiz1
  const handleOptionSelect = (questionId, selectedOption) => {
    // console.log('selected OPtion:', questionId, selectedOption);
    setIntroDatas(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, selectedOption, answered: 'no'};
        }
        return item;
      });
      return newData;
    });
  };
  //For optional question Ends

  //For Multi Option starts
  const handleOptionSelectMulti = (questionId, selectedOption) => {
    setIntroDatas(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          // Initialize selectedOption as an empty array if it's undefined
          const updatedSelectedOptions = item.selectedOption || [];

          // Check if selectedOption is already in the array
          const isSelected = updatedSelectedOptions.includes(selectedOption);

          // Update the array based on isSelected
          const updatedOptions = isSelected
            ? updatedSelectedOptions.filter(option => option !== selectedOption)
            : [...updatedSelectedOptions, selectedOption];

          return {...item, selectedOption: updatedOptions, answered: 'no'};
        }
        return item;
      });
      return newData;
    });
  };

  //For Multi Option End

  //fOR IMAGE UPLOAD
  const [imageUrls, setImageUrls] = useState({});
  // console.log('imageUrls--->', imageUrls);

  // console.log('imageUrls--->', imageUrls2);
  const handleImageSelected = (image, questionId) => {
    setImageUrls(prevImageUrls => ({
      ...prevImageUrls,
      [questionId]: image,
    }));

    setIntroDatas(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          // Update the answer URL for the specific questionId
          return {...item, answer: image, answered: 'no'};
        }
        return item;
      });
    });
  };

  //For AUDIO rECORDS s3 url starts   Quiz1

  const closeModals = (url, questionId) => {
    // console.log('check url----->', url, questionId);
    setIntroDatas(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url, answered: 'no'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  const startPlaybackAudio = async item => {
    try {
      const path = item.questionMedia;
      await audioPlayer.startPlayer(path);
      setIsPlaying(item._id);
      console.log(' playing audio:', path);
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const stopPlayback = async item => {
    // console.log('stop----->', item);
    try {
      setIsLoader(true);
      await audioPlayer.stopPlayer();
      setIsPlaying(null);
      setIsLoader(false);
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const handleSelection = async (flag, questionId) => {
    // console.log('flag--->', flag, questionId, openQuestionId);
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
                handleImageSelected(image.path, openQuestionId);
                setImageData(image);
              })
              .catch(err => {});
          } else {
            Alert.alert('Error', 'Camera Permission Not Granted');
          }
        } catch (error) {
          if (error.response.status === 413) {
            console.log('error is---------------->', error);
            Alert.alert('The entity is too large !');
          } else if (error.response.status === 504) {
            console.log('Error is--------------------->', error);
            Alert.alert('Gateway Timeout: The server is not responding!');
          } else if (error.response.status === 500) {
            console.error('Error is------------------->:', error);
            Alert.alert(
              'Internal Server Error: Something went wrong on the server.',
            );
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
          handleImageSelected(image.path, openQuestionId);

          setImageData(image);
        })
        .catch(err => {});
    } else {
    }
  };

  const startQuiz = () => {
    set_Quiz_status(false);
    setQuestionModal(true);
  };

  const handlePrev = () => {
    if (header > 0) {
      setHeader(header - 1);
    }
  };

  const handleNext = () => {
    if (header < introDatas?.length - 1) {
      setHeader(header + 1);
    } else {
    }
  };

  // console.log('current question------------------------->', introDatas[header]);
  console.log('introDatas-------------------------->', introDatas);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#0060CA', '#FFFFFF']}
      style={styles.container}>
      <Modal
        animationType="slide"
        style={{height: 30}}
        transparent={true}
        visible={quiz_status}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                top: '-2%',
                width: '90%',
                paddingBottom: '30%',
                height: window.WindowHeigth * 0.6,
              },
            ]}>
            <View
              style={
                {
                  // width: window.WindowWidth * 0.93,
                  // marginLeft: '-10%',
                }
              }>
              <Text
                style={{
                  color: '#13538A',
                  // borderRadius: 10,
                  fontSize: 28,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  // left: '22%',
                  // width: '100%',
                }}>
                Before Starting
              </Text>
              <Text
                style={{
                  color: Color.royalblue,
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  // left: '25%',
                  // width: '100%',
                  top: '48%',
                }}>
                Share your experience in MCQs
              </Text>
            </View>
            <View style={{alignSelf: 'center', right: '26%'}}>
              <View
                style={{
                  backgroundColor: Color.royalblue,
                  borderRadius: 80,
                  width: window.WindowWidth * 0.242,
                  height: window.WindowHeigth * 0.12,
                  top: '200%',
                  left: '25%',
                }}>
                <Entypo
                  name="arrow-right"
                  style={{color: 'white', left: '24%', top: '23%'}}
                  size={45}
                  onPress={() =>
                    // navigation.navigate('introQuizTemplate', {
                    //   data: {
                    //     handleSaveAssessment: handleQuizSubmit,
                    //     topicQuizData: introDatas,
                    //     handleAnswerChange: handleAnswerChange,
                    //     handleOptionSelect: handleOptionSelect,
                    //     closeModal: closeModals,
                    //     handleOptionSelectMulti: handleOptionSelectMulti,
                    //     imageUrl: imageUrls,
                    //     onImageSelected: handleImageSelected,
                    //   },
                    // })
                    startQuiz()
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        style={{height: 35}}
        transparent={true}
        visible={questionModal}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                top: '-2%',
                width: '90%',
                paddingBottom: '60%',
                // height: window.WindowHeigth * 0.6,
              },
            ]}>
            <View
              style={{
                width: window.WindowWidth * 1.1,
                // marginLeft: -20,
              }}>
              <View style={{left: -61, top: -15}}>
                <ProgressBar total={introDatas?.length} complete={header + 1} />
              </View>
              <Text
                style={{
                  fontSize: 17,
                  left: '15%',
                  width: '75%',
                  paddingBottom: 10,
                }}>
                {header + 1}. {introDatas[header]?.question}
              </Text>

              {introDatas[header]?.questionMediaType === 'audio' ? (
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
                    {isPlaying === introDatas[header]._id ? (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            stopPlayback(introDatas[header], 'stop')
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
                          startPlaybackAudio(introDatas[header], 'play')
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

              {/* {introDatas[header]?.questionMediaType === 'image' && (
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
                      resizeMode="cover"
                      source={
                        error
                          ? require('../assets/Photos/userss.png')
                          : introDatas[header]?.questionMedia
                          ? {uri: introDatas[header]?.questionMedia}
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
              )} */}

              {introDatas[header]?.answerType === 'textInput' ? (
                <View
                  style={{
                    borderWidth: 1,
                    width: 270,
                    borderRadius: 12,
                    height: 100,
                    overflow: 'hidden',
                    left: '15%',
                    top: '10%',
                  }}>
                  <TextInput
                    allowFontScaling={false}
                    style={{padding: 10}}
                    underlineColorAndroid="transparent"
                    placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                    placeholderTextColor="grey"
                    numberOfLines={6}
                    // style={{top: '-33%', left: '3%'}}
                    multiline={true}
                    keyboardType="ascii-capable"
                    value={introDatas[header]?.answer || ''}
                    onChangeText={newAnswer =>
                      handleAnswerChange(
                        introDatas[header].questionId,
                        newAnswer,
                      )
                    }
                  />
                </View>
              ) : null}
              {introDatas[header]?.answerType === 'yesNoOptions' && (
                <View
                  style={{
                    alignSelf: 'stretch',
                    paddingLeft: 20,
                    top: 30,
                  }}>
                  <RadioForm formHorizontal={true} animation={true}>
                    {radioOptions.map((option, index) => (
                      <View key={index} style={{}}>
                        <RadioButton labelHorizontal={true}>
                          <RadioButtonInput
                            obj={option}
                            index={index}
                            isSelected={
                              introDatas[header]?.selectedOption?.length > 0
                                ? Array.isArray(
                                    introDatas[header]?.selectedOption,
                                  )
                                  ? introDatas[header]?.selectedOption.includes(
                                      option.value[0],
                                    )
                                  : introDatas[header]?.selectedOption[0] ===
                                    option.value[0]
                                : introDatas[header]?.selectedOption ===
                                  option.value
                            }
                            onPress={() =>
                              handleOptionSelect(
                                introDatas[header]?.questionId,
                                option.value,
                              )
                            }
                            borderWidth={1}
                            buttonInnerColor={'#0060ca'}
                            buttonOuterColor={
                              introDatas[header]?.selectedOption?.length > 0
                                ? Array.isArray(
                                    introDatas[header]?.selectedOption,
                                  )
                                  ? introDatas[header]?.selectedOption.includes(
                                      option.value[0],
                                    )
                                    ? '#0060ca'
                                    : '#000'
                                  : introDatas[header]?.selectedOption[0] ===
                                    option.value[0]
                                  ? '#0060ca'
                                  : '#000'
                                : introDatas[header]?.selectedOption ===
                                  option.value
                                ? '#0060ca'
                                : '#000'
                            }
                            buttonSize={15}
                            buttonStyle={{}}
                            buttonWrapStyle={{marginLeft: 50}}
                          />
                          <RadioButtonLabel
                            obj={option}
                            index={index}
                            labelHorizontal={true}
                            onPress={() =>
                              handleOptionSelect(
                                introDatas[header]?.questionId,
                                option.value,
                              )
                            }
                            labelStyle={{
                              fontSize: 15,
                              color:
                                introDatas[header]?.selectedOption?.length > 0
                                  ? Array.isArray(
                                      introDatas[header]?.selectedOption,
                                    )
                                    ? introDatas[
                                        header
                                      ]?.selectedOption.includes(
                                        option.value[0],
                                      )
                                      ? '#0060ca'
                                      : '#000'
                                    : introDatas[header]?.selectedOption[0] ===
                                      option.value[0]
                                    ? '#0060ca'
                                    : '#000'
                                  : introDatas[header]?.selectedOption ===
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
              {introDatas[header]?.answerType === '2options' &&
                introDatas[header].optionType === 'single' && (
                  <>
                    <View>
                      <View key={introDatas[header]?.questionId}>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'A',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,

                              backgroundColor:
                                // currentSelectedOption === 'A'
                                introDatas[header].selectedOption === 'A'
                                  ? '#0060ca'
                                  : 'white',

                              // backgroundColor: Color.white,
                              borderRadius: 20,
                              borderWidth: 1,
                              color: 'white',
                              width: SIZES.WindowWidth * 0.8,
                              // height: 50,
                              top: 15,
                              textAlign: 'left',

                              margin: 15,
                              alignSelf: 'center',
                              fontFamily: FontFamily.poppinsMedium,
                              paddingBottom: 20,
                            }}>
                            <Text
                              style={{
                                marginTop: 10,
                                // color: 'black',
                                color:
                                  introDatas[header].selectedOption === 'A'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              A . {introDatas[header].optionA}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'B',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,
                              backgroundColor:
                                // currentSelectedOption === 'B'
                                introDatas[header].selectedOption === 'B'
                                  ? '#0060ca'
                                  : 'white',
                              // backgroundColor: Color.white,
                              borderRadius: 20,
                              borderWidth: 1,
                              color: 'white',
                              width: SIZES.WindowWidth * 0.8,
                              // height: 50,
                              top: 15,
                              textAlign: 'left',

                              margin: 15,
                              alignSelf: 'center',
                              fontFamily: FontFamily.poppinsMedium,
                              paddingBottom: 20,
                            }}>
                            <Text
                              style={{
                                marginTop: 10,
                                color:
                                  introDatas[header].selectedOption === 'B'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              B . {introDatas[header].optionB}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              {introDatas[header]?.answerType === '2options' &&
                introDatas[header].optionType === 'multi' && (
                  <>
                    <View>
                      <View key={introDatas[header].questionId}>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header].questionId,
                              'A',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('A')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header].questionId,
                                  'A',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionA}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header].questionId,
                              'B',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('B')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header].questionId,
                                  'B',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionB}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              {introDatas[header]?.answerType === '3options' &&
                introDatas[header]?.optionType === 'single' && (
                  <>
                    <View>
                      <View key={introDatas[header].questionId}>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'A',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,

                              backgroundColor:
                                // currentSelectedOption === 'A'
                                introDatas[header].selectedOption === 'A'
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
                                  introDatas[header].selectedOption === 'A'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              A . {introDatas[header].optionA}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'B',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,
                              backgroundColor:
                                // currentSelectedOption === 'B'
                                introDatas[header].selectedOption === 'B'
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
                                  introDatas[header].selectedOption === 'B'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              B . {introDatas[header].optionB}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'C',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,
                              backgroundColor:
                                // currentSelectedOption === 'C'
                                introDatas[header].selectedOption === 'C'
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
                                  introDatas[header].selectedOption === 'C'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              C . {introDatas[header].optionC}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}

              {introDatas[header]?.answerType === '3options' &&
                introDatas[header]?.optionType === 'multi' && (
                  <>
                    <View>
                      <View key={introDatas[header].questionId}>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header].questionId,
                              'A',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('A')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header].questionId,
                                  'A',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionA}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header].questionId,
                              'B',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('B')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header].questionId,
                                  'B',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionB}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header].questionId,
                              'C',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('C')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header].questionId,
                                  'C',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionC}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      {/* <Text>{isChecked ? 'Checked' : 'Unchecked'}</Text> */}
                    </View>
                  </>
                )}

              {introDatas[header - 1]?.answerType === '4options' &&
                introDatas[header - 1]?.optionType === 'single' && (
                  <>
                    <View>
                      <View key={introDatas[header].questionId}>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'A',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,

                              backgroundColor:
                                // currentSelectedOption === 'A'
                                introDatas[header].selectedOption === 'A'
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
                                  introDatas[header].selectedOption === 'A'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              A . {introDatas[header].optionA}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'B',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,
                              backgroundColor:
                                // currentSelectedOption === 'B'
                                introDatas[header].selectedOption === 'B'
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
                                  introDatas[header].selectedOption === 'B'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              B . {introDatas[header].optionB}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'C',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,
                              backgroundColor:
                                // currentSelectedOption === 'C'
                                introDatas[header].selectedOption === 'C'
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
                                  introDatas[header].selectedOption === 'C'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              C . {introDatas[header].optionC}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOptionSelect(
                              introDatas[header].questionId,
                              'D',
                            )
                          }>
                          <View
                            style={{
                              borderColor: Color.royalblue,
                              backgroundColor:
                                // currentSelectedOption === 'D'
                                introDatas[header].selectedOption === 'D'
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
                                  introDatas[header].selectedOption === 'D'
                                    ? 'white'
                                    : 'black',
                                paddingLeft: 10,
                                fontSize: 15,
                              }}>
                              {' '}
                              D . {introDatas[header].optionD}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              {introDatas[header]?.answerType === '4options' &&
                introDatas[header]?.optionType === 'multi' && (
                  <>
                    <View>
                      <View key={introDatas[header].questionId}>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header].questionId,
                              'A',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('A')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header]?.questionId,
                                  'A',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionA}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header]?.questionId,
                              'B',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('B')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header]?.questionId,
                                  'B',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionB}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header]?.questionId,
                              'C',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('C')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header]?.questionId,
                                  'C',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionC}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() =>
                            handleOptionSelectMulti(
                              introDatas[header]?.questionId,
                              'D',
                            )
                          }>
                          <View
                            style={{
                              alignSelf: 'stretch',
                              paddingLeft: 20,
                              top: 10,
                              left: '100%',
                            }}>
                            <CheckBox
                              value={introDatas[
                                header
                              ]?.selectedOption?.includes('D')}
                              style={{alignSelf: 'center'}}
                              tintColors={{
                                true: '#0060ca',
                                false: '#0060ca',
                              }}
                              onChange={() =>
                                handleOptionSelectMulti(
                                  introDatas[header]?.questionId,
                                  'D',
                                )
                              }
                            />
                          </View>
                          <View style={{top: '4%', left: '100%'}}>
                            <Text>{introDatas[header].optionD}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}

              {/* {introDatas[header]?.answerType === 'imageInput' && (
                <>
                  <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
                    <View style={styles.modalContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          handleSelection(
                            'camera',
                            introDatas[header]?.questionId,
                          );
                        }}
                        style={styles.modalButtonContainer}>
                        <Cameraicon
                          name="camera"
                          size={30}
                          color={Colors.primary}
                        />
                        <Text style={styles.modalButtonText}>Take Picture</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          handleSelection(
                            'gallery',
                            introDatas[header]?.questionId,
                          );
                        }}
                        style={styles.modalButtonContainer}>
                        <Cameraicon name="file" size={30} color={Colors.info} />
                        <Text style={styles.modalButtonText}>
                          choose_gallery
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ButtomSheet>
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
                        resizeMode="cover"
                        source={
                          error
                            ? require('../assets/Photos/userss.png')
                            : imageUrls[introDatas[header]?.questionId]
                            ? {uri: imageUrls[introDatas[header]?.questionId]}
                            : require('../assets/Photos/userss.png')
                        }
                        imageStyle={{
                          width: '100%',
                          height: window.WindowHeigth * 0.5,
                        }}
                        onError={() => {
                          setError(true);
                        }}
                      ></Image>
                      <TouchableOpacity
                        //onPress={() => onStartRecord(ele, i, 1)}
                        // key={index}
                        onPress={() =>
                          handleOpenBottomSheet(introDatas[header]?.questionId)
                        }
                        style={{
                          backgroundColor: 'green',
                          backgroundColor: introDatas?.filter(x =>
                            x.active === 'yes' ? 'green' : Color.royalblue,
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
              )} */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',

                // top: '100%',
                position: 'absolute',
                // top: '50%',
                bottom: 0,
              }}>
              {header !== 0 ? (
                <Entypo
                  name="arrow-left"
                  style={{
                    color: Color.royalblue,
                    // position: 'absolute',
                    right: 50,
                  }}
                  size={45}
                  onPress={() => handlePrev()}
                />
              ) : null}

              {header !== introDatas?.length - 1 ? (
                <Entypo
                  name="arrow-right"
                  style={{
                    color: Color.royalblue,
                    // position: 'absolute',
                    left: 50,
                  }}
                  size={45}
                  onPress={() => handleNext()}
                />
              ) : (
                <TouchableOpacity onPress={handleQuizSubmit}>
                  <View
                    style={{
                      backgroundColor: Color.royalblue,
                      borderRadius: 15,
                      width: window.WindowWidth * 0.242,
                      // height: window.WindowHeigth * 0.12,
                      // top: '200%',
                      // left: '25%',
                      padding: 5,
                      left: 50,
                      // justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white'}}>Submit</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default IntroQuizPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    // backgroundColor: Color.royalblue,
    // opacity: 7,
    // backdropFilter: 'blur(40px)',
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

  loadingText: {
    color: '#595F65',
    fontSize: 20,
    // top: 50,
    marginTop: 73,
    fontFamily: FontFamily.poppinsMedium,
    paddingBottom: 40,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: 370,
    // top: '30%',

    // paddingLeft: 20,
    // paddingRight: 40,
    textAlign: 'center',
    alignSelf: 'center',
    bottom: 0,
    fontWeight: 'bold',
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
  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 60,
  },
});
