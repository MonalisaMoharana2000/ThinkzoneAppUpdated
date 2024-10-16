import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  AppState,
  Alert,
  Pressable,
  Image,
  ActivityIndicator,
  Share,
  StatusBar,
  TextInput,
  BackHandler,
  Button,
  Animated,
  Dimensions,
  ToastAndroid,
  Linking,
} from 'react-native';
import RearrangeComponent from '../components/PuzzleComponent';
// import DraggableFlatList, {
//   ScaleDecorator,
// } from 'react-native-draggable-flatlist';
// import Svg, {Rect, Circle} from 'react-native-svg';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import * as SIZES from '../utils/dimensions';
import Cameraicon from 'react-native-vector-icons/Feather';
import * as window from '../utils/dimensions';
import ButtomSheet from '../components/BottomSheet';
import axios from 'axios';
import API from '../environment/Api';
import React, {useState, useCallback, useRef} from 'react';
import Quiz from '../components/Quiz';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import Colors from '../utils/Colors';
// import * as FcmSlice from '../redux/slices/FcmSlice';
import {useSelector, useDispatch} from 'react-redux';
import Norecord from '../components/Norecord';
import Popup from '../components/Popup';
import {useEffect} from 'react';
import moment from 'moment';
import Modals from '../components/Modals';
import Entypo from 'react-native-vector-icons/Entypo';
import FabButton from '../components/FabButton';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
import {FontFamily, Color} from '../GlobalStyle';
import Video from 'react-native-video';
import NewQuizTemplate from '../components/NewQuizTemplate';
import NewQuiz from '../components/NewQuiz';
import {useFocusEffect} from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {WebView} from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {app_versions} from './Home';
import {openDatabase} from 'react-native-sqlite-storage';
import PdfViewer from '../components/PdfViewer';
import Orientation from 'react-native-orientation-locker';
// import StarRating from 'react-native-star-rating';
import {showMessage} from 'react-native-flash-message';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import YouTube from 'react-native-youtube-iframe';
import SelectFromMultiple from '../components/SelectFromMultiple';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
import CarouselImage from '../components/CarouselImage';

import Api from '../environment/Api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DragWordComponent from '../components/RearrangeWordComponent';
import Loader from '../components/Loader';
const audioPlayer = new AudioRecorderPlayer();
const textAudioPlayer = new AudioRecorderPlayer();
const HEIGHT = Dimensions.get('window').height;
const TechContent = ({route, navigation}) => {
  const data = route?.params?.whole_data;
  console.log('data---->', data);
  const textInputRef = useRef(null);

  const topicData = route?.params?.data;

  const nestedTopic = topicData?.topicData[0];

  console.log(
    route.params.data,
    'moduleid------------------------------------------>',
  );
  // console.log(
  //   route.params,
  //   'routeparams------------------------------------------>',
  // );
  const dataType = route.params.data_type;

  const trainingType = route.params.trainingType;
  const moduleImage = route.params.moduleImage;
  const ulternateImage = 'https://i.imgur.com/6bJMDFs.png';
  // const {topicId} = data;
  const topicName = nestedTopic?.topicName;

  const modalRef = useRef(null);
  const modalHeight = HEIGHT * 1.5;
  // const {moduleId, submoduleId} = route.params.data;

  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.user);
  console.log('user--->', user);
  const [userdata, setUserdata] = useState(user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const [puzzles, setPuzzles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fln, setFln] = useState([]);
  const [language, setLanguage] = useState('od');
  const [contentData, setContentData] = useState([]);
  console.log('contentData check------->', contentData);
  const check =
    contentData?.length > 0
      ? contentData?.filter(x => x.type === 'puzzle')
      : null;

  console.log('check2---->', check?.length > 0 ? check[0]?.inputAnswer : null);
  const [rearrangeWord, setRearrangeWord] = useState([]);
  console.log('rearrangeWord----->', rearrangeWord);
  const [rearrangeSequence, setRearrangeSequence] = useState([]);
  const [refData, setRefData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [isPlayingTextAudio, setIsPlayingTextAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [topicQuizData, setTopicQuizData] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [checkUrl, setCheckUrl] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [topicQuizData2, setTopicQuizData2] = useState([]);
  console.log('topicQuizData------->', topicQuizData);
  const [gamifiedData, setGamifiedData] = useState([]);
  // console.log('gamifiedData----->', gamifiedData);
  const [quiz_status, setQuiz_status] = useState(
    route.params.data_type == 'quiz1' ? true : false,
  );
  console.log('quiz_status----------------->', quiz_status);

  const [text, onChangeText] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [quiz_status2, setQuiz_status2] = useState(
    route.params.data_type == 'quiz2' ? true : false,
  );
  const [gamified_status, setGamified_status] = useState(
    route.params.data_type == 'gamified' ? true : false,
  );
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [discussion, setDiscussion] = useState([]);
  const [loadDiscuss, setLoadDiscuss] = useState(false);
  //^--------------------------Hotspot states and related modal functions-------------------
  const [rectModalVisible, setRectModalVisible] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [discussModal, setDiscussModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const rectPositions = [
    {x: 72, y: 70, message: 'ଏହା ଏକ ପର୍ଯ୍ୟବେକ୍ଷଣ ମାଧ୍ୟମରେ ଶିକ୍ଷଣ    '},
    {x: 72, y: 175, message: 'ଏହା ଏକ ଅଭ୍ୟାସ ଦ୍ଵାରା ଶିକ୍ଷଣ'},

    {x: 265, y: 75, message: 'ଏହା ରିଫ୍ଲେକ୍ସ ମାଧ୍ୟମରେ ଏକ ଶିକ୍ଷଣ'},
    {x: 265, y: 175, message: 'ଏହା ଏକ ଅନୁକରଣ ମାଧ୍ୟମରେ ଶିକ୍ଷ'},
  ];

  function getOrderSequence(arr) {
    return arr.map(item => item.wordOrder);
  }

  useFocusEffect(
    React.useCallback(() => {
      Api.get(`getuserbyuserid/${userdata[0].userid}`)
        .then(response => {
          //console.log(response.data, 'profileresponse------>');
          setUserdata(response.data);
        })
        .catch(error => {
          console.log('error----->', error);
        });
    }, []),
  );

  const handleRectPress = message => {
    setCurrentMessage(message);
    setRectModalVisible(true);
  };

  const closeRectModal = () => {
    setRectModalVisible(false);
  };

  const openMoreModal = () => {
    setMoreModal(true);
  };

  const closeMoreModal = () => {
    setMoreModal(false);
  };

  const getContentDiscussion = async () => {
    setLoadDiscuss(true); // Start loading
    try {
      const response = await API.get(
        `getTransTchTrainingContentDiscussion/${
          route?.params?.whole_data?.topicId
            ? route?.params?.whole_data?.topicId
            : route?.params?.class
        }`,
      );
      console.log('responsediscussion----->', response.data);
      setDiscussion(response?.data?.discussions);
    } catch (error) {
      console.error('Error fetching discussion:', error);
    } finally {
      setLoadDiscuss(false);
    }
  };

  const openDiscusModal = async () => {
    setDiscussModal(true);
    getContentDiscussion();
  };

  const closeDiscusModal = () => {
    setDiscussModal(false);
  };
  //^------------------------------------------------------------------------------------

  //------------------------------------Sqlite Storage-----------------------------------------
  var db = openDatabase({name: 'TrainingDatabase.db'});
  let [trainingItems, setTrainingItems] = useState([]);
  // console.log('trainingItems--->', trainingItems);

  useEffect(() => {
    const setupDatabase = async () => {
      const itemLength = await new Promise((resolve, reject) => {
        db.transaction(function (txn) {
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS table_training(_id INTEGER PRIMARY KEY AUTOINCREMENT, userid VARCHAR(20), username VARCHAR(20), managerid VARCHAR(20), managername VARCHAR(20), passcode VARCHAR(20), topicId INT(20),topicName INT(20), topicPercentage INT(10), contentData TEXT, videoPath INT(156))',
            [],
            async () => {
              console.log('Table created successfully.');
              // await deleteExistingData();
              txn.executeSql(
                'SELECT name FROM sqlite_master WHERE type="table" AND name="table_training"',
                [],
                function (tx, res) {
                  resolve(res.rows.length);
                },
              );
            },
          );
        });
      });

      console.log('Final item length:', itemLength);
    };

    setupDatabase();
  }, []);

  // const fetchData = () => {
  //   db.transaction(function (txn) {
  //     txn.executeSql('SELECT * FROM table_training', [], (tx, results) => {
  //       console.log('Results:', results);
  //       var temp = [];
  //       for (let i = 0; i < results.rows.length; ++i) {
  //         let item = results.rows.item(i);
  //         // item.contentData = JSON.parse(item.contentData);
  //         item.contentData = JSON.parse(item.contentData);
  //         console.log('daa----->', item);
  //         temp.push(item);
  //       }
  //       console.log('temp---->', temp);
  //       setTrainingItems(temp[0].contentData);
  //     });
  //   });
  // };

  //Delete Table
  const deleteExistingData = () => {
    return new Promise((resolve, reject) => {
      db.transaction(function (txn) {
        txn.executeSql(
          'DROP TABLE IF EXISTS table_training',
          [],
          (tx, result) => {
            console.log('Existing table deleted.');
            resolve();
          },
        );
      });
    });
  };

  //Delete table data
  const deleteData = () => {
    db.transaction(function (txn) {
      txn.executeSql('DELETE FROM table_training', [], (tx, results) => {
        // Handle success or error after deletion
        console.log('Deletion results:', results);
        alert('updated');
        // fetchData(); // Fetch data again after deletion
      });
    });
  };

  useEffect(() => {
    // fetchData();
    // deleteData();
    // deleteExistingData();
  }, []);

  //------------------------------------Sqlite Storage-----------------------------------------

  const handleToNextTopic = () => {
    if (dataType === 'quiz2') {
      const nextIncompleteTopic = topicData?.topicData?.find(
        topics => topics.quiz1Status === 'incomplete',
      );
      setFeedbackModal(false);
      navigation.goBack();

      if (nextIncompleteTopic) {
        navigation.navigate('techcontent', {
          data_type: 'quiz1',
          data: data,
          whole_data: nextIncompleteTopic,
        });
      }
    }
  };

  const [content_status, setContent_status] = useState(
    route.params?.data_type === 'content' ? true : false,
  );

  console.log(
    '====================================content_status',
    content_status,
  );

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  //!----------------------------------------------------------------------------------------------------------------------------
  //Store Timespent
  const [stTime, setStTime] = useState(null);
  console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  //for user back button press timespent calculation
  useEffect(() => {
    console.log('calling reset start time function----------------------->');
    const resetStartTime = () => {
      console.log('calling reset start time function----------------------->');
      AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
        .then(() => console.log('stTime saved to AsyncStorage'))
        .catch(error =>
          console.error('Error saving stTime to AsyncStorage:', error),
        );
    };
    resetStartTime();
  }, []);

  //Store Timespent data
  // let stTime = new Date().getTime();

  //For Screen idle timespent calculation
  // useEffect(() => {
  //   AsyncStorage.getItem('stTime')
  //     .then(value => {
  //       if (value) {
  //         console.log('value--->', value);
  //         //setStTime(parseInt(value, 10));
  //       } else {
  //         setStTime(new Date().getTime());
  //       }
  //     })
  //     .catch(error =>
  //       console.error('Error loading stTime from AsyncStorage:', error),
  //     );
  //   const handleAppStateChange = nextAppState => {
  //     console.log(
  //       '>>>>>>>>>>>>>>>>>>> Idle:  State change: appStateVisible= ',
  //       appStateVisible,
  //       '     nextAppState= ',
  //       nextAppState,
  //     );
  //     const x = AsyncStorage.getItem('stTime').then(value => {
  //       value = value ? value : new Date().getTime();
  //       if (appStateVisible === 'active' && nextAppState === 'background') {
  //         console.log('>>>>>>>>>>>>>>>>>>> Idle:  Statrt time: ', value);
  //         const closeTime = new Date().getTime();
  //         console.log('>>>>>>>>>>>>>>>>>>> Idle:  End time time: ', closeTime);

  //         const dur = (closeTime - value) / 1000;
  //         console.log('>>>>>>>>>>>>>>>>>>>>>> 1 timeSpent--->', dur);
  //         AsyncStorage.setItem('stTime', closeTime.toString()) //clTime.toString()
  //           .then(() => {
  //             const duration = Math.floor(dur);
  //             console.log('duration--->', duration);
  //             const year = new Date().getFullYear();
  //             console.log('year--->', year);
  //             const month = new Date().getMonth() + 1;
  //             console.log('month--->', month);
  //             const data = {
  //               userid: userid,
  //               username: username,
  //               usertype: usertype,
  //               managerid: managerid,
  //               passcode: passcode,
  //               modulename: 'eceactivity',
  //               duration: duration,
  //               month: month,
  //               year: year,
  //               appVersion: app_versions,
  //               start: new Date(parseInt(value)),
  //               end: new Date(parseInt(closeTime)),
  //             };

  //             API.post(`savetimespentrecord/`, data)
  //               .then(response => {
  //                 console.log(
  //                   'timespent response in content------->',
  //                   response.data,
  //                 );
  //               })
  //               .catch(error => {
  //                 console.log('error in timespent post------------->', error);
  //               });

  //             console.log('stTime saved to AsyncStorage');
  //           })
  //           .catch(error =>
  //             console.error('Error saving stTime to AsyncStorage:', error),
  //           );
  //       } else if (
  //         appStateVisible === 'background' &&
  //         nextAppState === 'active'
  //       ) {
  //         setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
  //       } else if (appStateVisible === 'active' && nextAppState === 'active') {
  //         console.log('when Screen is on =====================>');
  //         AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
  //           .then(() => console.log('stTime saved to AsyncStorage1'))
  //           .catch(error =>
  //             console.error('Error saving stTime to AsyncStorage:', error),
  //           );
  //       }
  //     });
  //     // const y = AsyncStorage.getItem('clTime');
  //     // console.log('checkGet data ooo ------------->', x, y);
  //     // console.log('checkstare------------->', appStateVisible, nextAppState);
  //     // if (appStateVisible === 'active' && nextAppState === 'background') {
  //     //   const clTime = new Date().getTime();
  //     //   console.log('clTime--->', clTime);
  //     //   const timeSpent = (clTime - stTime) / 1000;
  //     //   console.log(
  //     //     '****************************** 1 timeSpent--->',
  //     //     timeSpent,
  //     //   );
  //     //   const duration = Math.floor(timeSpent);
  //     //   console.log('duration--->', duration);
  //     //   const year = new Date().getFullYear();
  //     //   console.log('year--->', year);
  //     //   const month = new Date().getMonth() + 1;
  //     //   console.log('month--->', month);
  //     //   const data = {
  //     //     userid: userid,
  //     //     username: username,
  //     //     usertype: usertype,
  //     //     managerid: managerid,
  //     //     passcode: passcode,
  //     //     modulename: 'fln',
  //     //     duration: duration,
  //     //     month: month,
  //     //     year: year,
  //     //   };

  //     //   API.post(`savetimespentrecord/`, data).then(response => {
  //     //     console.log('timespent response in content------->', response.data);
  //     //   });

  //     //   // Save the current time in AsyncStorage for future use
  //     //   console.log(
  //     //     '======================== 1 Set Start Time========================= ',
  //     //   );
  //     //   AsyncStorage.setItem('stTime', null) //clTime.toString()
  //     //     .then(() => console.log('stTime saved to AsyncStorage'))
  //     //     .catch(error =>
  //     //       console.error('Error saving stTime to AsyncStorage:', error),
  //     //     );
  //     // } else if (
  //     //   appStateVisible === 'background' &&
  //     //   nextAppState === 'active'
  //     // ) {
  //     //   setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
  //     // }

  //     setAppStateVisible(nextAppState);
  //   };

  //   AppState.addEventListener('change', handleAppStateChange);

  //   // Cleanup function
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);
  //!----------------------------------------------------------------------------------------------------------------------------
  console.log(
    ' route?.params?.whole_data?.topicId------------------------->',
    route?.params?.whole_data?.topicId,
  );
  const [playbackPosition, setPlaybackPosition] = useState(0);
  console.log('playbackPosition1--->', playbackPosition === 'pause player');
  let filteredData;
  let rearrangeData;
  const [refLoad, setRefLoad] = useState(false);
  // const [puzzles, setPuzzles] = useState([]);

  console.log('puzzles---------->', puzzles);

  const shuffleArray = array => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // useEffect(() => {
  //   setRearrangeWord(shuffleArray(rearrangeWord));
  // }, [rearrangeData]);
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const responseQuiz = await API.get(
          `/getTchTrainingQuiz/${user[0].userid}/quiz1/${route?.params?.whole_data?.topicId}`,
        );
        console.log(
          'responseQuiz123=================>',
          responseQuiz?.data?.quiz1Data,
        );
        setTopicQuizData(responseQuiz?.data?.quiz1Data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData(); // Call the async function
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `getTchTrainingContent/${user[0].userid}/${
            route?.params?.whole_data?.topicId
              ? route?.params?.whole_data?.topicId
              : route?.params?.class
          }`,
        );

        setContentData(response.data.contentData);

        filteredData = response?.data?.contentData.filter(
          x => x.type === 'puzzle',
        );
        rearrangeData = response?.data?.contentData.filter(
          x => x.type === 'sentenceRearrangement',
        );
        console.log('filteredData---->', filteredData);

        setPuzzles(filteredData);

        setRearrangeWord(rearrangeData[0].value);
        setRearrangeSequence(shuffleArray(rearrangeData[0].value));
        console.log(
          '====================================setContentData',
          response.data,
        );

        if (response.data?.contentData?.length > 0) {
          const filterAudio = response.data?.contentData?.filter(
            item => item.type === 'text-audio',
          );

          if (
            filterAudio &&
            filterAudio[0]?.type === 'text-audio' &&
            content_status === true
          ) {
            try {
              const path = filterAudio[0].value;
              stopPlayback();
              setIsLoader(true);
              // if (playbackPosition > 0) {
              //   await textAudioPlayer.seekToPlayer(playbackPosition);
              // }

              await textAudioPlayer.startPlayer(path);
              setIsPlayingTextAudio(filterAudio[0]._id);
              setIsLoader(false);

              playbackListener = textAudioPlayer.addPlayBackListener(e => {
                console.log(
                  'Current Playback Position:',
                  e.currentPosition,
                  e.duration,
                );

                if (e.currentPosition >= e.duration) {
                  setIsPlayingTextAudio(null);
                  textAudioPlayer.stopPlayer();
                }
                // else {
                //   audioPlayer.stopPlayer();
                // }
              });
            } catch (error) {
              if (error.response.status === 413) {
                console.log('error is---------------->', error);
                setIsLoading(false);
                Alert.alert('The entity is too large !');
              } else if (error.response.status === 504) {
                console.log('Error is--------------------->', error);
                setIsLoading(false);
                Alert.alert('Gateway Timeout: The server is not responding!');
              } else if (error.response.status === 500) {
                console.error('Error is------------------->:', error);
                setIsLoading(false);
                Alert.alert(
                  'Internal Server Error: Something went wrong on the server.',
                );
              } else {
                console.error('Error is------------------->:', error);
                setIsLoading(false);
              }
            }
          }
        }

        // console.log();
        // console.log('====================================');
        setRefLoad(true);
        const responseReference = await API.get(
          `getTchTrainingReference/${user[0].userid}/${
            route?.params?.whole_data?.topicId
              ? route?.params?.whole_data?.topicId
              : route?.params?.class
          }`,
        );

        setRefData(responseReference?.data?.referenceData);
        setRefLoad(false);

        const responseGamified = await API.get(
          `/getTchTrainingGamified/${user[0].userid}/gamified/${route?.params?.whole_data?.topicId}`,
        );

        setGamifiedData(responseGamified.data?.gamifiedData);

        setIsLoading(false);
      } catch (error) {
        if (error.response.status === 413) {
          console.log('error is---------------->', error);
          setIsLoading(false);
          Alert.alert('The entity is too large !');
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
          setIsLoading(false);
          Alert.alert('Gateway Timeout: The server is not responding!');
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      stopTextAudio();
    };
  }, []);

  const fetchDataAgain = async () => {
    try {
      const responseQuiz2 = await API.get(
        `/getTchTrainingQuiz/${user[0].userid}/quiz2/${route?.params?.whole_data?.topicId}`,
      );
      if (textInputRef.current) {
        textInputRef.current.clear();
      }

      setTopicQuizData2(responseQuiz2.data.quiz2Data);
      // setAnserReset('');
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        setIsLoading(false);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        setIsLoading(false);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        setIsLoading(false);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDataAgain();
  }, []);

  const handleLinkPress = item => {
    // This function will be called when the link is pressed
    Linking.openURL(item.value);
  };

  const saveOffline = async contentData => {
    setIsLoading(true);
    // Ensure contentData is an array before filtering
    if (!Array.isArray(contentData)) {
      console.error('contentData is not an array:', contentData);
      return;
    }

    const offVideo = contentData.filter(item => item.type === 'video');
    console.log('offVideo---->', offVideo);
    let videoPath = '';

    try {
      if (offVideo && offVideo.length > 0) {
        const videoUrl = offVideo[0].value;
        console.log('Video URL:', videoUrl);

        try {
          const response = await fetch(videoUrl);
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
        } catch (error) {
          setIsLoading(false);
          console.error('Error accessing video URL:', error.message);
          alert(`Error accessing video URL: ${error.message}`);
          return;
        }

        const destPath = `${
          RNFS.PicturesDirectoryPath
        }/video${new Date().getTime()}.mp4`;

        try {
          const exists = await RNFS.exists(destPath);
          if (exists) {
            videoPath = destPath;
            console.log('Video already downloaded at:', destPath);

            setVideoUri(destPath);
          } else {
            const picturesDirExists = await RNFS.exists(
              RNFS.PicturesDirectoryPath,
            );
            if (!picturesDirExists) {
              await RNFS.mkdir(RNFS.PicturesDirectoryPath);
            }

            console.log(`Downloading video from ${videoUrl} to ${destPath}`);
            const response = await RNFS.downloadFile({
              fromUrl: videoUrl,
              toFile: destPath,
            });

            const result = await response.promise;

            if (result.statusCode === 200) {
              setIsLoading(false);
              videoPath = destPath;
              console.log('Video saved at:', destPath);
            } else {
              setIsLoading(false);
              console.error(
                'Error downloading video. Status code:',
                result.statusCode,
              );
              alert(
                `Error downloading video. Status code: ${result.statusCode}`,
              );
              return; // Stop further processing as download failed
            }
          }
        } catch (error) {
          console.error('Error saving the video:', error);
          alert(`Error saving the video: ${error.message}`);
          return; // Stop further processing as saving failed
        }
      }

      const data = {
        userid: user[0].userid,
        username: user[0].username,
        usertype: user[0].usertype,
        managerid: user[0].managerid,
        managername: user[0].managername,
        passcode: user[0].passcode,
        topicId: route?.params?.whole_data?.topicId,
        topicPercentage: 50,
        topicName: route?.params?.whole_data?.topicName,
        contentData: JSON.stringify(contentData),
        videoPath: videoPath,
      };

      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO "table_training" (
              "userid", 
              "username", 
              "managerid", 
              "managername", 
              "passcode", 
              "topicId", 
              "topicName",
              "topicPercentage", 
              "contentData",
              "videoPath"
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.userid,
            data.username,
            data.managerid,
            data.managername,
            data.passcode,
            data.topicId,
            data.topicName,
            data.topicPercentage,
            data.contentData,
            data.videoPath,
          ],
          function () {
            setIsLoading(false);
            console.log('Data saved offline successfully!');
            showMessage({
              message: 'Successfully Saved offline',
              description: 'Successfully saved the topic offline.',
              type: 'success',
              backgroundColor: Colors.success,
            });
          },
          function (tx, error) {
            console.error('Error inserting data:', error.message);
            alert('Error inserting data: ' + error.message);
          },
        );
      });
    } catch (error) {
      console.error('Error during saveOffline process:', error.message);
      alert('Error during saveOffline process: ' + error.message);
    }
  };

  const saveContent = () => {
    const data = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      topicId: route?.params?.whole_data?.topicId,
      topicPercentage: 50,
      contentData: contentData,
    };
    console.log('content data-------->', data);
    // const ch = contentData?.filter(item => item.type === 'puzzle');
    // console.log('content data1-------->', ch[0].inputAnswer);
    API.post('saveTransTchTrainingContent', data)
      .then(response => {
        if (response.status === 200) {
          showMessage({
            message: 'Successfully Completed',
            description: 'Successfully completed the topic.',
            type: 'success',
            backgroundColor: Colors.success,
          });
          navigation.goBack();
        } else {
          showMessage({
            message: 'Successfully Completed',
            description: `${response.status} `,
            type: 'success',
            backgroundColor: Colors.success,
          });
          navigation.goBack();
        }
      })
      .catch(error => {
        if (error.response.status === 400) {
          showMessage({
            message: 'Error',
            description: `${error.response.status} ${error.response.data.msg}`,
            type: 'danger',
            backgroundColor: Colors.danger,
          });
        } else {
          showMessage({
            message: 'Error',
            description: `${error.response.status} ${error.response.data.msg}`,
            type: 'danger',
            backgroundColor: Colors.danger,
          });
        }
      });
  };

  const buildLink = async () => {
    try {
      let link = await axios({
        method: 'POST',
        url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyC_mMwlba3Rgb_Sgjh-pjK_9eWPw_z1cqw`,
        Headers: {
          'Content-Type': 'application/json',
        },
        data: {
          dynamicLinkInfo: {
            domainUriPrefix: 'https://thinkzoneapp.page.link',
            link: `https://thinkzone.in/=techcontent?${trainingType}?${route?.params?.whole_data?.topicId}?${data?.contentStatus}?${route.params?.data_type}`,

            androidInfo: {
              androidPackageName: 'com.nrusingh.teacher_thinkzone1',
            },
            socialMetaTagInfo: {
              // socialImageLink:
              //   // 'https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg',
              //   snapImage,
              socialTitle: `<div style="height: 660px; width: 1331px;"> <h1>${topicName}</h1></div>`,
              socialDescription: `<p>Description${route?.params?.whole_data?.topicId} for ${topicName}</p>`,
              socialImageLink: moduleImage || ulternateImage,
              // 'https://audioassessment.s3.us-east-2.amazonaws.com/1689667239744',
              // 'https://audioassessment.s3.us-east-2.amazonaws.com/1690004053237',
            },
            // iosInfo: {
            //   iosBundleId: 'com.example.ios',
            // },
          },
        },
      });

      if (link.status === 200) {
        return link.data.shortLink;
      }
    } catch (error) {
      console.error('Error building dynamic link:', error);
      throw error;
    }
  };
  const shareLink = async () => {
    let shareUrl;

    try {
      shareUrl = await buildLink();
    } catch (error) {
      console.error('Error getting share link:', error);
      // Handle the error, show a message to the user, or perform appropriate actions.
      return;
    }

    try {
      if (shareUrl && shareUrl.trim() !== '') {
        const result = await Share.share({
          message: `Share your link ${shareUrl}`,
        });

        // Optionally, you can check the result and handle it accordingly.
        if (result.action === Share.sharedAction) {
          console.log('Link shared successfully');
        } else {
          console.log('Link sharing canceled');
        }
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
  };
  const [loadingImage, setLoadingImage] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalsss, setModalsss] = useState(false);

  const startPlayback = async item => {
    stopPlaybackTextAudio();
    try {
      const path = item.value; // Replace with the actual audio file path
      setIsLoader(true);
      await audioPlayer.startPlayer(path);
      setIsPlaying(item._id);
      setIsLoader(false);
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        setIsLoader(false);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        setIsLoader(false);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        setIsLoader(false);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
        setIsLoader(false);
      }
    }
  };
  const startPlaybackTextAudio = async item => {
    stopPlayback();
    try {
      const path = item.value;

      setIsLoader(true);
      await textAudioPlayer.startPlayer(path);
      setIsPlayingTextAudio(item._id);
      setIsLoader(false);
      // Set isLoading state back to false when playback starts
    } catch (error) {
      setIsLoader(false);
    }
  };
  const handleLoad = () => {
    setBuffering(false);
  };

  // useEffect(() => {
  //   audioPlayer.setSubscriptionDuration(0.1);
  //   audioPlayer.addPlayBackListener(({current_position, duration}) => {
  //     setProgress(current_position);
  //     setDuration(duration);
  //   });

  //   return () => {
  //     audioPlayer.stopPlayer();
  //     audioPlayer.removePlayBackListener();
  //   };
  // }, []);

  const stopPlayback = async item => {
    try {
      await audioPlayer.stopPlayer();
      setIsPlaying(false);
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

  const stopPlaybackTextAudio = async item => {
    try {
      setIsLoader(true);
      await textAudioPlayer.stopPlayer();
      setIsPlayingTextAudio(null);
      setIsLoader(false);
    } catch (error) {}
  };

  const handleBackButton = () => {
    if (quizModal) {
      setQuizModal(false);
      return true; // Prevent default back button behavior
    }
    return false; // Allow default back button behavior
  };

  //S3 url delete from bucket
  const extractedKeys = topicQuizData?.filter(item => item.keys !== undefined);

  const handleDelete = async () => {
    stopPlaybackTextAudio();
    navigation.goBack();
    const keysArray = extractedKeys.map(item => ({Key: item.keys}));

    const x = AsyncStorage.getItem('stTime').then(value => {
      const y = new Date().getTime();

      console.log('stTime saved to AsyncStorage2------->', y);
      console.log('stTime saved to AsyncStorage3------->', value);

      const timeSpent = y - value;
      setGetStartTime(timeSpent);

      const resetTimeSpent = timeSpent / 1000;

      const duration = Math.floor(resetTimeSpent);

      console.log('training content duration---------------------->', duration);

      const year = new Date().getFullYear();

      const month = new Date().getMonth() + 1;

      const data = {
        userid: userid,
        username: username,
        usertype: usertype,
        managerid: managerid,
        passcode: passcode,
        modulename: trainingType,
        duration: duration,
        month: month,
        year: year,
        start: new Date(parseInt(value)),
        end: new Date(parseInt(y)),
      };

      // console.log('body sent in training contents------------->', data);

      API.post(`savetimespentrecord/`, data)
        .then(response => {
          // console.log('check timespent---->', response.data);
        })
        .catch(error => {
          // console.log('error in timespent post------------->', error);
        });
    });

    try {
      const response = await API.post(`s3api/doDeleteMultiple`, keysArray);
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

  const back = async () => {
    if (topicQuizData?.length === 0 && topicQuizData2?.length === 0) {
      navigation.goBack();
    } else {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'default',
          },
          {text: 'Ok', onPress: () => handleDelete(), style: 'default'},
        ],
      );
    }
  };

  const backs = async () => {
    if (topicQuizData.length === 0 && topicQuizData2.length === 0) {
      navigation.goBack();
    } else {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {
            text: 'Continue',
            onPress: () => handleToNextTopic(),
            style: 'default',
          },
        ],
      );
    }
  };
  const backss = async () => {
    Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ!', 'ଆପଣ ଭିଡ଼ିଓଟିକୁ ସମ୍ପୂର୍ଣ୍ଣ ଦେଖିଛନ୍ତି ତ ?', [
      {
        text: 'ହଁ',
        onPress: () => closeModal(),
        style: 'default',
      },
      {
        text: 'ନାଁ',
        onPress: () => null,
        style: 'default',
      },
    ]);
  };

  //For TextInput Starts Quiz1
  const handleAnswerChange = useCallback(
    (questionOrder, newAnswer) => {
      setTopicQuizData(prevData => {
        return prevData.map(item => {
          if (item.questionId === questionOrder) {
            // Create a new object with the updated answer
            return {...item, answer: newAnswer, answered: 'yes'};
          }
          return item;
        });
      });
    },
    [setTopicQuizData],
  );

  //For TextInput Ends

  //For OPtional Question i.e 4,3,2 Options starts    Quiz1
  const handleOptionSelect = (questionId, selectedOption) => {
    // console.log('selected OPtion:', questionId, selectedOption);
    setTopicQuizData(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, selectedOption, answered: 'yes'};
        }
        return item;
      });
      return newData;
    });
  };
  //For optional question Ends

  //For Multi Option starts
  const handleOptionSelectMulti = (questionId, selectedOption) => {
    setTopicQuizData(prevData => {
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

          return {...item, selectedOption: updatedOptions, answered: 'yes'};
        }
        return item;
      });
      return newData;
    });
  };

  //For Multi Option Ends

  //For AUDIO rECORDS s3 url starts   Quiz1

  const closeModals = (url, questionId, keys) => {
    setCheckUrl(keys);
    // console.log('check url----->', url, questionId);
    setTopicQuizData(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url, keys: keys, answered: 'yes'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  //Fot Audio Records s3 url ends

  //For TextInput Starts Quiz2
  const [answerReset, setAnserReset] = useState('');
  const handleAnswerChange2 = useCallback(
    (questionOrder, newAnswer, item) => {
      // setAnserReset(item.answer);
      setTopicQuizData2(prevData => {
        const newData = [...prevData];
        const questionIndex = newData.findIndex(
          item => item.questionId === questionOrder,
        );
        if (questionIndex !== -1) {
          newData[questionIndex].answer = newAnswer;
          // setAnserReset('');
        }
        console.log('newData:', newData);
        return newData;
      });
    },
    [setTopicQuizData2],
  );

  //For TextInput Ends

  //For OPtional Question i.e 4,3,2 Options starts Quiz2
  const handleOptionSelect2 = (questionId, selectedOption) => {
    setTopicQuizData2(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, selectedOption, answered: 'yes'};
        }
        return item;
      });
      return newData;
    });
  };
  //For optional question Ends

  //For Multi Option starts Quiz2
  const handleOptionSelectMulti2 = (questionId, selectedOption) => {
    setTopicQuizData2(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          // Initialize selectedOption as an empty array if it's undefined
          const updatedSelectedOptions = item.selectedOption || [];

          // Check if selectedOption is already in the array
          const isSelected = updatedSelectedOptions.includes(selectedOption);

          // Update the array based on isSelected
          const updatedOptions = isSelected
            ? updatedSelectedOptions.filter(option => option !== selectedOption) // Remove the option
            : [...updatedSelectedOptions, selectedOption]; // Add the option

          return {...item, selectedOption: updatedOptions, answered: 'yes'};
        }
        return item;
      });
      return newData;
    });
  };

  //For Multi Option Ends

  //For AUDIO rECORDS s3 url starts Quiz2

  const closeModals2 = (url, questionId) => {
    setTopicQuizData2(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url, answered: 'yes'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  const azureUpload = async (uploadResult, questionId) => {
    console.log('uploadResult======>', uploadResult);
    console.log('questionId==========>', questionId);
    setTopicQuizData(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: uploadResult, answered: 'yes'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  const azureUpload2 = async (uploadResult, questionId) => {
    console.log('uploadResult======>', uploadResult);
    console.log('questionId==========>', questionId);
    setTopicQuizData2(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: uploadResult, answered: 'yes'}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };
  //Fot Audio Records s3 url ends

  const onend_quiz = async (secured_mark, total_mark, submitedAnswer) => {
    const checkDataLengthOption = topicQuizData.filter(
      x => x.selectedOption?.length,
    );
    const checkDataLengthAnswer = topicQuizData.filter(x => x.answer?.length);

    if (
      topicQuizData.length ===
      checkDataLengthOption.length + checkDataLengthAnswer.length
    ) {
      const quiz1Marks = topicQuizData.filter(item => {
        //
        //every method to check if every element in the
        //correctOption array is included in the selectedOption
        //array for the current object.
        // This ensures that all elements match.
        if (
          item.correctOption.length === item.correctOption.length &&
          item.correctOption.every(option =>
            item?.selectedOption?.includes(option),
          )
        ) {
          return true;
        }
        return false;
      });
      console.log('quiz1Marks--->', quiz1Marks);

      const data = {
        userid,
        topicId: route?.params?.whole_data?.topicId,
        quiz1Data: topicQuizData,
        quiz1TotalMarks: topicQuizData.length,
        quiz1SecuredMarks: quiz1Marks.length,
        username,
        usertype,
        managerid,
        managername,
        passcode,
        answered: 'yes',
      };
      console.log('quiz1---->', data);
      const confirmSubmit = await new Promise(resolve => {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
          'ଆପଣ କୁଇଜ୍ ର ଉତ୍ତର ଦାଖଲ କରିବାକୁ ସୁନିଶ୍ଚିତ ଅଛନ୍ତି ତ?',
          [
            {
              text: 'NO',
              onPress: () => resolve(false),
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => resolve(true),
            },
          ],
        );
      });

      console.log('data sent for Quiz-1 --------------------------->', data);

      if (confirmSubmit) {
        try {
          const response = await API.post(`saveTransTchTrainingQuiz`, data);
          if (response.status === 200) {
            Alert.alert(`${'କୁଇଜ୍ ସଫଳତାର ସହ ସେଭ୍ ହୋଇଛି ।'}`, '', [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          } else {
            Alert.alert(`${response.status}`, `${response.msg}`, [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          }
        } catch (error) {
          console.log('err-->', error.response);
          if (error.response.status === 406) {
            // \"all contents/quiz/assignment not uploaded\
            Alert.alert('all contents/quiz/assignment not uploaded', '', [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          } else {
            Alert.alert(
              `Status:${error.response.status}, ${error.response.data.msg}`,
              `${error.response.data.err}`,
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ],
            );
          }
        }
      }
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', [
        {text: 'OK', onPress: () => null},
      ]);
    }
  };
  let quiz2PassMark;
  const [modalMark, setModalMark] = useState('');
  const onend_quiz2 = async (secured_mark, total_mark, submitedAnswer) => {
    const checkDataLengthOption = topicQuizData2.filter(
      x => x.selectedOption?.length,
    );
    const checkCorrectLengthOption = topicQuizData2.filter(
      x => x.correctOption?.length,
    );
    const checkDataLengthAnswer = topicQuizData2.filter(x => x.answer?.length);

    if (
      topicQuizData2.length ===
      checkDataLengthOption.length + checkDataLengthAnswer.length
    ) {
      const quiz2Marks = topicQuizData2.filter(item => {
        //every method to check if every element in the
        //correctOption array is included in the selectedOption
        //array for the current object.

        // This ensures that all elements match.
        if (
          item.correctOption?.length != 0 &&
          item.correctOption?.length === item.selectedOption?.length &&
          item.correctOption.every(option =>
            item?.selectedOption?.includes(option),
          )
        ) {
          return true;
        }

        {
          return false;
        }
      });

      quiz2PassMark = Math.floor(
        (quiz2Marks.length / checkDataLengthOption.length) * 100,
      );

      console.log(
        'quiz2PassMark----->',
        quiz2PassMark,
        quiz2Marks.length,
        checkDataLengthOption.length,
      );
      setModalMark(quiz2PassMark);
      const data = {
        userid,
        topicId: route?.params?.whole_data?.topicId,
        quiz2Data: topicQuizData2,
        quiz2TotalMarks: topicQuizData2.length,
        quiz2SecuredMarks: quiz2Marks.length,
        username,
        usertype,
        managerid,
        managername,
        passcode,
        answered: 'yes',
      };
      const confirmSubmit = await new Promise(resolve => {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
          'ଆପଣ କୁଇଜ୍ ର ଉତ୍ତର ଦାଖଲ କରିବାକୁ ସୁନିଶ୍ଚିତ ଅଛନ୍ତି ତ?',
          [
            {
              text: 'NO',
              onPress: () => resolve(false),
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => resolve(true),
            },
          ],
        );
      });
      console.log('====================================', data);

      if (confirmSubmit) {
        if (quiz2Marks.length > 0 && quiz2PassMark > 60) {
          // setSuccessModal(true);

          // setQuiz_status2(false);
          console.log(
            'data sent for Quiz-2 --------------------------->',
            data,
          );

          try {
            const response = await API.post(`saveTransTchTrainingQuiz`, data);
            // console.log('res.data====>', response.data, response.status);
            if (response.status === 200) {
              // Alert.alert(
              //   `${'କୁଇଜ୍ ସଫଳତାର ସହ ସେଭ୍ ହୋଇଛି ।'}`,
              //   `You have Scored ${quiz2PassMark}%`,
              //   [
              //     {
              //       text: 'Ok',
              //       onPress: () => {
              //         setFeedbackModal(true);
              //       },
              //       style: 'default',
              //     },
              //   ],
              // );
              // navigation.goBack();
              setSuccessModal(true);
            } else {
              Alert.alert(`${response.status}`, `${response.msg}`, [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ]);
            }
          } catch (error) {
            if (error.response.status === 406) {
              // \"all contents/quiz/assignment not uploaded\
              Alert.alert('all contents/quiz/assignment not uploaded', '', [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ]);
            } else {
              Alert.alert(
                `Status:${error.response.status}, ${error.response.data.msg}`,
                `${error.response.data.err}`,
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.goBack(),
                    style: 'default',
                  },
                ],
              );
            }
          }
          //Only if subjective
        } else if (
          checkCorrectLengthOption.length === 0 &&
          checkDataLengthAnswer.length > 0
        )
          try {
            const response = await API.post(`saveTransTchTrainingQuiz`, data);

            if (response.status === 200) {
              Alert.alert(
                'କୁଇଜ୍ ସଫଳତାର ସହ ସେଭ୍ ହୋଇଛି ।',
                isNaN(quiz2PassMark)
                  ? ''
                  : quiz2PassMark === true
                  ? `You have Scored ${quiz2PassMark}%`
                  : quiz2PassMark === false
                  ? ''
                  : null,
                [
                  {
                    text: 'Ok',
                    onPress: () => {
                      // navigation.goBack();
                      setFeedbackModal(true);
                    },
                    style: 'default',
                  },
                ],
              );
            } else {
              Alert.alert(`${response.status}`, `${response.msg}`, [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ]);
            }
          } catch (error) {
            if (error.response.status === 406) {
              // \"all contents/quiz/assignment not uploaded\
              Alert.alert('all contents/quiz/assignment not uploaded', '', [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ]);
            } else {
              Alert.alert(
                `Status:${error.response.status}, ${error.response.data.msg}`,
                `${error.response.data.err}`,
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.goBack(),
                    style: 'default',
                  },
                ],
              );
            }
          }
        else {
          Alert.alert(`You have Scored very low !!`, `Please Retry`, [
            {
              text: 'Ok',
              onPress: () => {
                fetchDataAgain();
              },
              style: 'default',
            },
          ]);
        }
      }
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', [
        {text: 'OK', onPress: () => null},
      ]);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);

  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {};
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
  const openModal = item => {
    setNowPlayingUrl(item.value);
    // Orientation.lockToLandscape(); // Lock to landscape when modal opens
    Orientation.lockToLandscape(); // Lock to portrait mode

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsVideoPlaying(false); // Pause the main video when modal closes
    Orientation.lockToPortrait();
  };

  //fOR IMAGE UPLOAD
  const [imageUrls, setImageUrls] = useState({});
  // console.log('imageUrls--->', imageUrls);

  const [imageUrls2, setImageUrls2] = useState({});
  // console.log('imageUrls--->', imageUrls2);
  const handleImageSelected = (image, questionId) => {
    setImageUrls(prevImageUrls => ({
      ...prevImageUrls,
      [questionId]: image,
      answered: 'yes',
    }));

    setTopicQuizData(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          // Update the answer URL for the specific questionId
          return {...item, answer: image, answered: 'yes'};
        }
        return item;
      });
    });
  };

  const handleImageSelected2 = (image, questionId) => {
    setImageUrls2(prevImageUrls => ({
      ...prevImageUrls,
      [questionId]: image,
      answered: 'yes',
    }));

    setTopicQuizData2(prevData => {
      return prevData.map(item => {
        if (item.questionId === questionId) {
          console.log('checkid--->', item.questionId, questionId);
          // Update the answer URL for the specific questionId
          return {...item, answer: image, answered: 'yes'};
        }
        return item;
      });
    });
  };
  const [rating, setRating] = useState(0);

  const handleRatingChange = newRating => {
    setRating(newRating);
  };
  const handleSaveFeedback = async () => {
    const data = {
      userid: user[0].userid,
      topicId: route?.params?.whole_data?.topicId,
      feedbackData: [
        {ratingCategory: 'star', starRating: rating},
        {ratingCategory: 'text', textRating: text},
      ],
    };

    if (rating !== null && rating !== undefined && rating !== 0) {
      try {
        const response = await API.post(`saveTransTchFeedback`, data);

        if (response.status === 200) {
          setModalsss(true);
          showMessage({
            message: `Successfully Completed`,
            description: 'Successfully topic completed.',
            type: 'success',
            backgroundColor: Colors.success,
          });
        }
      } catch (err) {}
    } else {
      Alert.alert('ଦୟାକରି ସଠିକ୍ ମତାମତ ଦିଅନ୍ତୁ ।');
    }
  };

  const [imageNotFound, setImageNotFound] = useState(false);

  const [videoLoading, setVideoLoading] = useState(true);
  const handleVideoLoad = () => {
    return true;
    // This function will be called when the video is loaded
    setVideoLoading(false);
  };

  // const downloadVideo = async () => {
  //   // Implement video download logic here
  //   try {
  //     // Download the video and store it locally
  //     // For simplicity, you can use AsyncStorage to store the video URI
  //     await AsyncStorage.setItem('downloadedVideo', nowPlayingUrl);
  //   } catch (error) {
  //     console.error('Error downloading video:', error);
  //   }
  // };

  // const checkIfVideoDownloaded = async () => {
  //   try {
  //     // Check if the video is already downloaded
  //     const downloadedVideo = await AsyncStorage.getItem('downloadedVideo');

  //     if (downloadedVideo && modalVisible) {
  //       // Set the URI to the downloaded video
  //       // This will play the downloaded video when the device is offline
  //       // Update the state to trigger re-render
  //       setNowPlayingUrl(downloadedVideo);
  //     }
  //   } catch (error) {
  //     console.error('Error checking downloaded video:', error);
  //   }
  // };
  const [playbackRate, setPlaybackRate] = useState(1.0); // Default rate is 1.0

  // Function to increase playback speed
  const increasePlaybackSpeed = () => {
    setPlaybackRate(prevRate => (prevRate < 2.0 ? prevRate + 0.25 : 2.0)); // Adjust the increment and max rate as needed
  };

  // Function to decrease playback speed
  const decreasePlaybackSpeed = () => {
    setPlaybackRate(prevRate => (prevRate > 0.5 ? prevRate - 0.25 : 0.5)); // Adjust the decrement and min rate as needed
  };
  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }
  const onUpdateQuestions = updatedQuestions => {
    setGamifiedData(updatedQuestions);
  };
  const handleSave = async () => {
    setContentData(currentPuzzles =>
      currentPuzzles.map(puzzle => {
        console.log('currentPuzzles----->', puzzle);
        console.log('currentPuzzles2----->', puzzles[0].value);
        // Conditionally add inputAnswer only if puzzle type is 'puzzle'
        if (puzzle.type === 'sentenceRearrangement') {
          return {
            ...puzzle,
            inputAnswer: puzzles[0].value,
          };
        }

        // Return other items unchanged
        return puzzle;
      }),
    );
  };

  const [isPlayings, setIsPlayings] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoaders, setIsLoaders] = useState(false);

  // console.log('item2--->', filterAudio);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('item2--->', filterAudio);
  //     const fetchData = async () => {
  //       try {
  //         const path = filterAudio?.value;

  //         setIsLoaders(true);
  //         if (playbackPosition > 0) {
  //           await audioPlayer.seekToPlayer(playbackPosition);
  //         }
  //         await audioPlayer.startPlayer(path);
  //         setIsPlayings(true);
  //         setIsLoaders(false);
  //         // Set isLoading state back to false when playback starts
  //       } catch (error) {
  //         setIsLoaders(false); // Set isLoading state back to false if there's an error
  //         setIsLoaders(false);
  //       }
  //     };
  //     fetchData();
  //   }, []),
  // );

  const startTextAudio = async item => {
    console.log('itemauto--->', item);
    stopPlayback();
    try {
      const path = item.value;
      setPath(path);

      setIsLoaders(true);
      if (playbackPosition > 0) {
        await audioPlayer.seekToPlayer(playbackPosition);
      }
      await audioPlayer.startPlayer(path);

      setIsPlayings(true);
      setIsLoaders(false);
      audioPlayer.addPlayBackListener(e => {
        console.log('Current Playback Position:', e.currentPosition);
        if (e.currentPosition >= e.duration) {
          setIsPlayings(false);
          audioPlayer.stopPlayer();
        }
      });
    } catch (error) {
      setIsLoaders(false); // Set isLoading state back to false if there's an error
    }
  };
  // {
  //   content_status === 'content' &&
  //     useEffect(() => {
  //       startTextAudio();

  //       return () => {
  //         audioPlayer.stopPlayer();
  //       };
  //     }, []);
  // }

  const handleLoads = () => {
    setBuffering(false);
  };

  // useEffect(() => {
  //   audioPlayer.setSubscriptionDuration(0.1);
  //   audioPlayer.addPlayBackListener(({current_position, duration}) => {
  //     setProgress(current_position);
  //     setDuration(duration);
  //   });

  //   return () => {
  //     audioPlayer.stopPlayer();
  //     audioPlayer.removePlayBackListener();
  //   };
  // }, []);

  const stopTextAudio = async item => {
    try {
      const stoppedPosition = await audioPlayer.pausePlayer();
      await autoAudioPlayer.stopPlayer();
      setIsPlayings(false);
      setPlaybackPosition(stoppedPosition);
    } catch (error) {}
  };

  const dummyData = [
    'https://thinkzonestorage.blob.core.windows.net/thinkzonecontainer/training_pedagogy_1720523780828.jpg',
    'https://thinkzonestorage.blob.core.windows.net/thinkzonecontainer/training_pedagogy_1720523830438.jpg',
    'https://thinkzonestorage.blob.core.windows.net/thinkzonecontainer/training_pedagogy_1720523867123.jpg',
    'https://thinkzonestorage.blob.core.windows.net/thinkzonecontainer/training_pedagogy_1720523894251.jpg',
  ];

  console.log('contentDaata--------------------------------->', contentData);

  // const [moreModal, setMoreModal] = useState(false);
  // const [discussModal, setDiscussModal] = useState(false);

  // const openMoreModal = () => {
  //   // setModalContent(content);
  //   setMoreModal(true);
  // };

  // const closeMoreModal = () => {
  //   setMoreModal(false);
  //   // setMoreModal('');
  // };

  // const openDiscusModal = () => {
  //   // setModalContent(content);
  //   setDiscussModal(true);
  // };

  // const closeDiscusModal = () => {
  //   setDiscussModal(false);
  //   // setMoreModal('');
  // };
  const [inputText, setInputText] = useState('');

  const [answers, setAnswers] = useState([]);

  const handleSend = async () => {
    if (inputText.trim()) {
      const body = {
        topicId: route?.params?.whole_data?.topicId,
        userid: userdata[0].userid,
        appVersion: '2.3.0',
        msg: inputText,
        msgType: 'sent',
        username: userdata[0].username,
        usertype: userdata[0].usertype,
        managerid: userdata[0].managerid,
        managername: userdata[0].managername,
        passcode: userdata[0].passcode,
        topicName: route?.params?.whole_data?.topicName,
        moduleId: route?.params?.data?.moduleId,
        moduleName: route?.params?.data?.moduleName,
        submoduleId: route?.params?.data?.submoduleId,
        submoduleName: route?.params?.data?.submoduleName,
      };

      const response = await API.post(
        `saveTransTchTrainingContentDiscussion`,
        body,
      );

      console.log('discussion data--->', response.data, response.status);
      if (response.status === 200) {
        getContentDiscussion();
        setInputText('');
      }

      // setAnswers([
      //   ...answers,
      //   {
      //     text: inputText,
      //     likes: 0,
      //     hearts: 0,
      //     reactions: 0,
      //     liked: false,
      //     hearted: false,
      //     reacted: false,
      //     username: 'User2',
      //     profilePicture: 'https://via.placeholder.com/50', // Placeholder image URL
      //   },
      // ]);
      setInputText('');
    }
  };

  const toggleLike = index => {
    const newAnswers = [...answers];

    setAnswers(newAnswers);
  };

  const toggleHeart = index => {
    const newAnswers = [...answers];
    if (newAnswers[index].hearted) {
      newAnswers[index].hearts -= 1;
    } else {
      if (newAnswers[index].liked) {
        newAnswers[index].likes -= 1;
        newAnswers[index].liked = false;
      }
      if (newAnswers[index].reacted) {
        newAnswers[index].reactions -= 1;
        newAnswers[index].reacted = false;
      }
      newAnswers[index].hearts += 1;
    }
    newAnswers[index].hearted = !newAnswers[index].hearted;
    setAnswers(newAnswers);
  };

  const toggleReaction = index => {
    const newAnswers = [...answers];
    if (newAnswers[index].reacted) {
      newAnswers[index].reactions -= 1;
    } else {
      if (newAnswers[index].liked) {
        newAnswers[index].likes -= 1;
        newAnswers[index].liked = false;
      }
      if (newAnswers[index].hearted) {
        newAnswers[index].hearts -= 1;
        newAnswers[index].hearted = false;
      }
      newAnswers[index].reactions += 1;
    }
    newAnswers[index].reacted = !newAnswers[index].reacted;
    setAnswers(newAnswers);
  };

  const [webviewModal, setWebviewModal] = useState(false);
  const [url, setUrl] = useState('');

  const openWebviewModal = url => {
    setUrl(url);
    setWebviewModal(true);
  };
  const closeWebviewModal = () => {
    setWebviewModal(false);
  };
  const Card = ({text, url}) => {
    const truncatedText =
      text.length > 150 ? `${text.substring(0, 147)}...` : text;

    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{truncatedText}</Text>
        <TouchableOpacity onPress={() => openWebviewModal(url)}>
          <Icon name="open-in-browser" size={24} color={Colors.royalblue} />
        </TouchableOpacity>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      Api.get(`getuserbyuserid/${user[0]?.userid}`).then(response => {
        setUserdata(response.data);
        setIsLoading(false);
      });
    }, []),
  );

  //RearrangeWord

  // const renderItem = ({item, drag, isActive}) => (
  //   <ScaleDecorator>
  //     <TouchableOpacity
  //       onPressIn={data?.contentStatus !== 'complete' ? drag : null}
  //       disabled={isActive}
  //       style={[
  //         styles.buttonWrapper,
  //         {
  //           backgroundColor: isActive ? '#A3D735' : Color.royalblue,
  //           color: isActive ? 'black' : 'white',
  //         },
  //       ]}>
  //       <Text style={styles.buttonText}>{item.wordValue}</Text>
  //     </TouchableOpacity>
  //   </ScaleDecorator>
  // );

  const handleDragEnd = ({from, to, data}) => {
    console.log('drag---->', data);
    if (from === to) return;
    let newData = [...data];
    const [movedItem] = newData.splice(from, 1);
    newData.splice(to, 0, movedItem);
    setRearrangeSequence(newData);

    const sequence1 = getOrderSequence(rearrangeWord);
    const sequence2 = getOrderSequence(newData);

    console.log('sequence1--->', sequence1);
    console.log('sequence2--->', sequence2);

    const areSequencesEqual =
      JSON.stringify(sequence1) === JSON.stringify(sequence2);
    console.log(areSequencesEqual);

    if (areSequencesEqual) {
      Alert.alert('Sequenced', '', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {
          text: 'Ok',
          onPress: () => handleSave(),
          style: 'default',
        },
      ]);
    }
  };

  //puzzle
  // const [puzzles, setPuzzles] = useState([
  //   {
  //     title: 'Puzzle 1',
  //     levels: [
  //       {id: 1, key: 'evaluate', text: 'evaluate', color: '#FF0000'},
  //       {id: 2, key: 'create', text: 'create', color: '#FFA500'},
  //       {id: 3, key: 'understanding', text: 'understanding', color: '#00ffff'},
  //       {id: 4, key: 'analyze', text: 'analyze', color: '#00FF00'},
  //       {id: 5, key: 'apply', text: 'apply', color: '#0000FF'},
  //       {id: 6, key: 'remember', text: 'remember', color: '#800080'},
  //     ],
  //   },
  // ]);
  const [indexPuzzle, setIndexPuzzle] = useState('');

  console.log('indexPuzzle--->', indexPuzzle);

  const handleDragEndPuzzle = (index, newLevels) => {
    setIndexPuzzle(index); // Store the index of the dragged puzzle
    setPuzzles(currentPuzzles =>
      currentPuzzles.map((puzzle, i) =>
        i === index ? {...puzzle, levels: newLevels} : puzzle,
      ),
    );
  };

  const handleSavePuzzle = data => {
    // console.log('currentPuzzles1----->', data);
    setContentData(currentPuzzles =>
      currentPuzzles.map(puzzle => {
        // Log current puzzle for debugging
        console.log('currentPuzzles----->', puzzle);
        console.log('currentPuzzles2----->', puzzles[0].value);
        // Conditionally add inputAnswer only if puzzle type is 'puzzle'
        if (puzzle.type === 'puzzle') {
          return {
            ...puzzle,
            inputAnswer: puzzles[0].value,
          };
        }

        // Return other items unchanged
        return puzzle;
      }),
    );
  };

  return (
    <View style={{}}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ScrollView>
            {/* Content starts here */}

            <View>
              {content_status === true && (
                <>
                  {contentData?.length > 0 ? (
                    <ScrollView
                      style={{
                        backgroundColor: 'white',
                        padding: '1%',
                      }}>
                      <View
                        style={{
                          borderWidth: 2,
                          borderColor: Color.royalblue,
                          padding: '1%',
                          paddingBottom: -5,
                          // paddingTop:45,
                          borderRadius: 5,
                          flexGrow: 5,
                          flexShrink: 0,
                          margin: '1.5%',
                        }}>
                        {contentData?.map((item, index) => {
                          return (
                            <>
                              <View>
                                {item.type === 'text' && (
                                  <View
                                    style={{
                                      paddingBottom: -10,
                                      paddingLeft: 10,
                                      paddingRight: 10,
                                    }}>
                                    <Text
                                      style={{
                                        // fontFamily: FontFamily.poppinsMedium,
                                        // fontSize: 22,
                                        // color: 'black',
                                        // alignSelf: 'center',
                                        // // padding: 5,
                                        paddingBottom: -10,
                                        // fontWeight: 'bold',
                                      }}>
                                      {/* {item.label} */}
                                    </Text>
                                    <HtmlContentCoponent
                                      sourceData={item.value}
                                    />
                                  </View>
                                )}
                                {item.type === 'image' && (
                                  <View
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
                                        source={{uri: `${item.value}`}}
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
                                  </View>
                                )}
                                {item.type === 'audio' && (
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
                                          {isPlaying === item._id ? (
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
                                                  onPress={() =>
                                                    stopPlayback(item, 'stop')
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
                                                      }}
                                                      source={require('../assets/Image/waves.gif')}
                                                    />
                                                  </View>
                                                </TouchableOpacity>
                                              )}
                                            </>
                                          ) : (
                                            <>
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
                                            </>
                                          )}
                                        </>
                                      </View>
                                    </View>
                                  </>
                                )}
                                {item.type === 'text-audio' && (
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
                                      {isPlayingTextAudio === item._id ? (
                                        <>
                                          <TouchableOpacity
                                            onPress={() =>
                                              stopPlaybackTextAudio(
                                                item,
                                                'stop',
                                              )
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
                                            startPlaybackTextAudio(item, 'play')
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
                                              fontFamily:
                                                FontFamily.poppinsMedium,
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
                                {item.type === 'hotspot' && (
                                  <View
                                    style={{
                                      alignSelf: 'center',
                                      // top: '-8%',
                                      // padding: 20,
                                    }}>
                                    {loadingImage ? (
                                      <ActivityIndicator
                                        size="large"
                                        color={Colors.yourLoaderColor}
                                      />
                                    ) : (
                                      <View>
                                        <Image
                                          source={{
                                            uri: item.thumbnail.startsWith(
                                              'https',
                                            )
                                              ? item.thumbnail
                                              : `https://thinkzonestorage.blob.core.windows.net/thinkzonecontainer/${item.thumbnail}`,
                                          }}
                                          onLoad={() => setLoadingImage(false)}
                                          // style={{
                                          //   // width: '100%',
                                          //   aspectRatio: 30 / 20, // Adjusted to a more common aspect ratio
                                          //   alignSelf: 'center',
                                          //   paddingTop: 5,
                                          //   // height: undefined, // Allow height to adjust based on aspect ratio
                                          //   resizeMode: 'contain', // Ensure the image covers the area properly
                                          // }}
                                          style={{
                                            width: '100%',

                                            aspectRatio: 15 / 10,
                                            alignSelf: 'center',
                                            // paddingTop: 5,
                                            // borderWidth: 1.5,
                                            // borderColor: Color.royalblue,
                                            // borderRadius: 10,
                                          }}
                                        />

                                        <View
                                          style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                          }}>
                                          {item.value.map((pos, index) => (
                                            <Circle
                                              key={index}
                                              cx={pos.xCordinate - 3}
                                              cy={pos.yCordinate - 3}
                                              r={37}
                                              fill="transparent"
                                              stroke="red"
                                              strokeWidth={0.9}
                                              onPress={() =>
                                                handleRectPress(pos.spotDesc)
                                              }
                                            />
                                          ))}
                                        </View>
                                        {rectModalVisible === true && (
                                          <View
                                            style={{
                                              width: window.WindowWidth * 0.95,
                                              paddingBottom: '2%',
                                              borderColor: Color.royalblue,
                                              borderWidth: 2,
                                              marginVertical: '5%',
                                              borderRadius: 10,
                                              position: 'relative',
                                            }}>
                                            <TouchableOpacity
                                              onPress={closeRectModal}
                                              style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                zIndex: 10,
                                              }}>
                                              <Text
                                                style={{
                                                  fontSize: 40,
                                                  fontWeight: 'bold',
                                                  top: -11,
                                                }}>
                                                ×
                                              </Text>
                                            </TouchableOpacity>
                                            <Text
                                              style={{
                                                fontSize: 16,
                                                marginBottom: 2,
                                                alignSelf: 'center',
                                                padding: '2%',
                                                margin: '2%',
                                                fontWeight: 'bolder',
                                              }}>
                                              {currentMessage}
                                            </Text>
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                )}
                                {item.type === 'slider' && (
                                  <View style={styles.carouselContainer}>
                                    <Carousel
                                      data={item.value}
                                      renderItem={({item}) => {
                                        return (
                                          <TouchableOpacity>
                                            <CarouselImage data={item} />
                                          </TouchableOpacity>
                                        );
                                      }}
                                      onSnapToItem={index =>
                                        setActiveSlide(index)
                                      }
                                      loop={true}
                                      // autoplay={false}
                                      autoplayDirection={'ltr'}
                                      sliderWidth={window.WindowWidth}
                                      itemWidth={window.WindowWidth * 0.9}
                                    />

                                    {/* Pagination component */}
                                    <Pagination
                                      dotsLength={item?.value.length}
                                      activeDotIndex={activeSlide}
                                      dotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        marginHorizontal: 8,
                                        backgroundColor: 'white',
                                      }}
                                      inactiveDotOpacity={0.6}
                                      inactiveDotScale={0.8}
                                      containerStyle={{
                                        position: 'absolute',
                                        top: '70%',
                                        alignSelf: 'center',
                                      }}
                                    />
                                  </View>
                                )}
                                {item.type === 'video' && (
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
                                      {/* <TouchableOpacity onPress={openModal}>
                              <Image
                                style={{
                                  width: 40,
                                  top: -8,
                                  height: 40,
                                  left: 20,

                                  paddingBottom: 10,
                                  alignSelf: 'flex-start',
                                }}
                                source={{uri: `${item.thumbnail}`}}
                              />
                            </TouchableOpacity> */}

                                      {item.thumbnail?.length > 0 ? (
                                        <TouchableOpacity onPress={openModal}>
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
                                            source={{
                                              uri: `${item.thumbnail}`,
                                            }}
                                          />
                                          {/* <Image
                                  style={{
                                    width: 336,
                                    top: 2,
                                    height: 181,
                                    backgroundColor: 'white',
                                    paddingBottom: 20,
                                    borderColor: 'black',
                                    alignSelf: 'center',
                                  }}
                                  source={{
                                    uri: 'https://i.pinimg.com/564x/da/ac/de/daacde957999e2869480796333d567b7.jpg',
                                  }}
                                /> */}
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity
                                          onPress={() => openModal(item)}>
                                          <Image
                                            style={{
                                              width: 316,
                                              // width:window.WindowWidth0.8,
                                              top: 2,
                                              height: 190,
                                              // aspectRatio: 10 / 5,
                                              backgroundColor: 'white',
                                              paddingBottom: 20,
                                              borderRadius: 10,
                                              borderColor: 'black',

                                              alignSelf: 'center',
                                            }}
                                            source={require('../assets/Image/thumbnail.png')}
                                          />
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  </View>
                                )}

                                {item.type === 'puzzle' && (
                                  <>
                                    <View
                                      style={{
                                        marginTop: 20,
                                        borderWidth: 1.5,
                                        borderColor: 'black',
                                        borderRadius: 5,
                                        padding: 10,
                                      }}>
                                      <RearrangeComponent
                                        puzzles={puzzles}
                                        handleDragEnd={handleDragEndPuzzle}
                                        handleSave={handleSavePuzzle}
                                        contentStatus={data?.contentStatus}
                                      />
                                      <TouchableOpacity
                                        style={[
                                          styles.button,
                                          {alignSelf: 'center'},
                                        ]}>
                                        <Text style={styles.buttonText}>
                                          Save
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </>
                                )}

                                {item.type === 'sentenceRearrangement' && (
                                  <>
                                    <View
                                      style={{
                                        marginTop: 20,
                                        borderWidth: 1.5,
                                        borderColor: 'black',
                                        borderRadius: 5,
                                        padding: 10,
                                      }}>
                                      <DragWordComponent
                                        data={rearrangeSequence}
                                        renderItem={renderItem}
                                        handleDragEnd={handleDragEnd}
                                        contentStatus={data?.contentStatus}
                                      />

                                      <TouchableOpacity
                                        style={[
                                          styles.button,
                                          {alignSelf: 'center', top: '2%'},
                                        ]}>
                                        <Text style={styles.buttonText}>
                                          Save
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </>
                                )}
                              </View>
                            </>
                          );
                        })}

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
                              {/* <TouchableOpacity onPress={downloadVideo}>
                        <Text>Download Video</Text>
                      </TouchableOpacity> */}
                            </View>
                          </ScrollView>
                        </Modal>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            top: '5%',
                            flexWrap: 'wrap',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              refData?.length > 0
                                ? openMoreModal()
                                : ToastAndroid.show(
                                    'There is no Reference Links !.',
                                    ToastAndroid.SHORT,
                                  )
                            }
                            style={styles.titleButton}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 14,
                                fontWeight: '700',
                                color: 'green',
                                fontFamily: FontFamily.poppinsMedium,
                              }}>
                              ଅଧିକ ଜାଣିବା
                            </Text>
                          </TouchableOpacity>

                          {data?.contentStatus === 'complete' ? (
                            <TouchableOpacity
                              onPress={() => openDiscusModal()}
                              style={styles.titleButton}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 14,
                                  fontWeight: '700',
                                  color: 'green',
                                  fontFamily: FontFamily.poppinsMedium,
                                }}>
                                ଆସ ଆଲୋଚନା କରିବା
                              </Text>
                            </TouchableOpacity>
                          ) : null}

                          {/* <TouchableOpacity
                          style={styles.buttonOffline}
                          onPress={() => saveOffline(contentData)}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 10,
                                fontWeight: '700',
                                color: 'black',
                                // right: '5%',
                                left: '45%',

                                fontFamily: FontFamily.poppinsMedium,
                              }}>
                              Save for Offline{''}
                            </Text>
                            <Entypo
                              name="download"
                              color={Colors.royalblue}
                              size={18}
                              style={{left: '85%'}}
                            />
                          </View>
                        </TouchableOpacity> */}
                        </View>
                        {/* ------------------------------ଅଧିକ ଜାଣିବା Modal----------------------------------------- */}

                        <Modal
                          visible={moreModal}
                          transparent={false}
                          animationType="slide"
                          onRequestClose={closeMoreModal}>
                          <TouchableOpacity
                            onPress={closeMoreModal}
                            style={styles.closeButton}>
                            <FontAwesome name="close" size={20} color="black" />
                          </TouchableOpacity>
                          <ScrollView
                            contentContainerStyle={styles.modalContent}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: 'black',
                              }}>
                              {' '}
                              ଅଧିକ ଜାଣିବା{' '}
                            </Text>

                            {refLoad ? (
                              <Loading />
                            ) : (
                              refData?.map(item => (
                                <Card text={item.title} url={item.link} />
                              ))
                            )}

                            <TouchableOpacity
                              onPress={closeMoreModal}
                              style={styles.closeButton}>
                              <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                          </ScrollView>
                        </Modal>

                        <Modal
                          visible={webviewModal}
                          transparent={false}
                          animationType="slide"
                          onRequestClose={closeWebviewModal}>
                          <WebView source={{uri: url}} />
                          <TouchableOpacity
                            onPress={closeWebviewModal}
                            style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                          </TouchableOpacity>
                        </Modal>
                        {/* -----------------------------------------------ଆସ ଆଲୋଚନା କରିବା--------------------------------
                         */}
                        <Modal
                          visible={discussModal}
                          transparent={false}
                          animationType="slide"
                          onRequestClose={closeDiscusModal}>
                          <View style={styles.discussionContainer}>
                            <TouchableOpacity
                              onPress={closeDiscusModal}
                              style={styles.closeButton}>
                              <FontAwesome
                                name="close"
                                size={20}
                                color="black"
                              />
                            </TouchableOpacity>

                            {loadDiscuss ? ( // Loader view when loading
                              <View style={styles.loaderContainer}>
                                <Loader />
                              </View>
                            ) : (
                              <ScrollView
                                contentContainerStyle={styles.modalContent}>
                                <FlatList
                                  data={discussion}
                                  keyExtractor={(item, index) =>
                                    index.toString()
                                  }
                                  renderItem={({item, index}) => (
                                    <View
                                      style={[
                                        styles.answerContainer,
                                        item.userid === userdata[0]?.userid
                                          ? styles.currentUserContainer
                                          : styles.otherUserContainer,
                                      ]}>
                                      <View style={styles.profileContainer}>
                                        <View
                                          style={{
                                            borderWidth: 1,
                                            borderColor:
                                              item.userid ===
                                              userdata[0]?.userid
                                                ? 'transparent'
                                                : 'transparent',
                                            borderRadius: 40,
                                          }}>
                                          <Image
                                            source={
                                              item.userid ===
                                              userdata[0]?.userid
                                                ? {uri: userdata[0]?.image}
                                                : require('../assets/Photos/userss.png')
                                            }
                                            accessibilityLabel="User Profile Image"
                                            resizeMode="cover"
                                            onError={error => {
                                              console.log(
                                                error.nativeEvent,
                                                error.nativeEvent.code,
                                                'Image failed to load. Displaying fallback image.',
                                              );
                                              setImageNotFound(true);
                                            }}
                                            style={styles.profilePicture}
                                          />
                                        </View>

                                        <Text style={styles.username}>
                                          {item.userid === userdata[0]?.userid
                                            ? item.username
                                            : item.username}
                                          {item.userid ===
                                            userdata[0]?.userid && (
                                            <Image
                                              style={[
                                                styles.iconusersuserPosition,
                                                styles.iconusersuserLayout,
                                              ]}
                                              resizeMode="cover"
                                              // source={require('../assets/Image/bluetik.png')}
                                            />
                                          )}
                                        </Text>
                                      </View>

                                      <View style={styles.messageContainer}>
                                        <Text style={styles.answerText}>
                                          {item.msg}
                                        </Text>
                                      </View>
                                      <View style={styles.iconContainer}>
                                        <TouchableOpacity
                                          style={{flexDirection: 'row'}}
                                          onPress={() => toggleLike(index)}>
                                          <FontAwesome
                                            name="thumbs-up"
                                            size={20}
                                            color={
                                              item.liked ? '#0060ca' : 'gray'
                                            }
                                          />
                                          {item.likes > 0 && (
                                            <Text style={styles.countText}>
                                              +{item.likes}
                                            </Text>
                                          )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={{flexDirection: 'row'}}
                                          onPress={() => toggleHeart(index)}>
                                          <FontAwesome
                                            name="heart"
                                            size={20}
                                            color={
                                              item.hearted ? 'red' : 'gray'
                                            }
                                          />
                                          {item.hearts > 0 && (
                                            <Text style={styles.countText}>
                                              +{item.hearts}
                                            </Text>
                                          )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={{flexDirection: 'row'}}
                                          onPress={() => toggleReaction(index)}>
                                          <AntDesign
                                            name="dislike1"
                                            solid
                                            size={20}
                                            color={
                                              item.reacted ? 'orange' : 'gray'
                                            }
                                          />
                                          {item.reactions > 0 && (
                                            <Text style={styles.countText}>
                                              +{item.reactions}
                                            </Text>
                                          )}
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )}
                                />
                              </ScrollView>
                            )}

                            <View style={styles.inputContainer}>
                              <TextInput
                                style={styles.inputBox}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Type your answer here"
                              />
                              <TouchableOpacity
                                onPress={handleSend}
                                style={styles.sendButton}>
                                <FontAwesome
                                  name="send"
                                  size={20}
                                  color="white"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>

                        {/* ------------------------button section-------------------------- */}

                        <View style={{marginTop: '10%', paddingBottom: '25%'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                            }}>
                            {data?.contentStatus === 'complete' ? (
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.goBack()}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 15,
                                    fontWeight: '700',
                                    color: Colors.white,
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  GO BACK
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.button}
                                onPress={saveContent}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 15,
                                    fontWeight: '700',
                                    color: Colors.white,
                                    fontFamily: FontFamily.poppinsMedium,
                                  }}>
                                  Mark As Complete
                                </Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() => saveOffline(contentData)}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: 15,
                                  fontWeight: '700',
                                  color: Colors.white,
                                  fontFamily: FontFamily.poppinsMedium,
                                }}>
                                Save for Offline{' '}
                                <Entypo
                                  name="download"
                                  color={Colors.white}
                                  size={18}
                                  style={{left: '85%'}}
                                />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <FabButton
                            image={require('../assets/Image/share.png')}
                            style={styles.customFabButton}
                            onPress={shareLink}
                          />
                        </View>
                      </View>
                    </ScrollView>
                  ) : (
                    <Nocontents />
                  )}
                </>
              )}
            </View>

            {/* Content ends here */}
            {/* </View> */}

            {/* Quiz1 starts here */}
            <View>
              {quiz_status === true && (
                <>
                  <>
                    {topicQuizData?.length > 0 ? (
                      <Modal
                        animationType="slide"
                        onRequestClose={() => back()}
                        transparent={true}
                        visible={quiz_status}>
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

                                marginTop: -58,
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
                                {data.topicName}
                              </Text>
                            </View>
                            <View style={{alignSelf: 'center', right: '27%'}}>
                              <NewQuizTemplate
                                azureUpload={azureUpload}
                                handleSaveAssessment={onend_quiz}
                                topicQuizData={topicQuizData}
                                handleAnswerChange={handleAnswerChange}
                                handleOptionSelect={handleOptionSelect}
                                closeModal={closeModals}
                                handleOptionSelectMulti={
                                  handleOptionSelectMulti
                                }
                                imageUrl={imageUrls}
                                onImageSelected={handleImageSelected}
                              />
                            </View>
                          </View>
                        </View>
                        {/* </View> */}
                      </Modal>
                    ) : (
                      <Nocontents />
                    )}
                  </>
                </>
              )}
            </View>

            {/* Quiz1 ends here */}

            {/* Quiz2 starts here */}
            <View>
              {quiz_status2 === true && (
                <>
                  <>
                    {topicQuizData2?.length > 0 ? (
                      <Modal
                        animationType="slide"
                        onRequestClose={() => back()}
                        transparent={true}
                        visible={quiz_status2}>
                        <View style={[styles.centeredView]}>
                          <View
                            style={[
                              styles.modalView,
                              {
                                height: window.WindowHeigth * 1,
                                // marginTop: -0,
                                top: -10,
                                width: window.WindowWidth * 2,
                              },
                            ]}>
                            <View
                              style={{
                                backgroundColor: '#0060ca',
                                height: 66,
                                width: window.WindowWidth * 1.1,

                                marginTop: -38,
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
                                  top: 15,
                                }}>
                                {data.topicName}
                              </Text>
                            </View>
                            <View style={{alignSelf: 'center', right: '27%'}}>
                              <NewQuizTemplate
                                textInputRef={textInputRef}
                                handleSaveAssessment={onend_quiz2}
                                topicQuizData={topicQuizData2}
                                handleAnswerChange={handleAnswerChange2}
                                handleOptionSelect={handleOptionSelect2}
                                closeModal={closeModals2}
                                handleOptionSelectMulti={
                                  handleOptionSelectMulti2
                                }
                                imageUrl={imageUrls2}
                                onImageSelected={handleImageSelected2}
                                azureUpload={azureUpload2}
                                // answerReset={answerReset}
                              />
                            </View>
                          </View>
                        </View>
                      </Modal>
                    ) : (
                      <Nocontents />
                    )}
                  </>
                </>
              )}
            </View>

            {/* Gamified Quiz starts */}
            <View>
              {gamified_status === true && (
                <>
                  <>
                    {gamifiedData?.length > 0 ? (
                      <SelectFromMultiple
                        questions={gamifiedData}
                        onUpdateQuestions={onUpdateQuestions}
                        handleSave={handleSave}
                        gamified_status={gamified_status}
                        topicName={data.topicName}
                        navigation={navigation}
                      />
                    ) : (
                      // <Modal
                      //   animationType="slide"
                      //   onRequestClose={() => back()}
                      //   transparent={true}
                      //   visible={gamified_status}>
                      //   <View style={[styles.centeredView]}>
                      //     <View
                      //       style={[
                      //         styles.modalView,
                      //         {
                      //           height: window.WindowHeigth * 1,

                      //           width: window.WindowWidth * 2,
                      //         },
                      //       ]}>
                      //       <View
                      //         style={{
                      //           backgroundColor: '#0060ca',
                      //           height: 66,
                      //           width: window.WindowWidth * 1.1,

                      //           marginTop: -58,
                      //           flexDirection: 'row',
                      //           // marginLeft: -20,
                      //           marginBottom: 3,
                      //         }}>
                      //         <TouchableOpacity
                      //           onPress={() => {
                      //             Alert.alert(
                      //               'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                      //               'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
                      //               [
                      //                 {
                      //                   text: 'Cancel',
                      //                   onPress: () => null,
                      //                   style: 'default',
                      //                 },
                      //                 {
                      //                   text: 'Ok',
                      //                   onPress: () => navigation.goBack(),
                      //                   style: 'default',
                      //                 },
                      //               ],
                      //             );
                      //           }}>
                      //           <AntDesign
                      //             name="arrowleft"
                      //             size={23}
                      //             style={{left: '122%', marginTop: 25}}
                      //             color="white"
                      //           />
                      //         </TouchableOpacity>
                      //         <Text
                      //           style={{
                      //             color: 'white',
                      //             fontSize: 18,
                      //             // marginTop: 15,
                      //             alignSelf: 'center',
                      //             left: '75%',
                      //             top: 5,
                      //           }}>
                      //           {data.topicName}
                      //         </Text>
                      //       </View>
                      //       <View style={{alignSelf: 'center'}}>
                      //         <SelectFromMultiple
                      //           questions={gamifiedData}
                      //           onUpdateQuestions={onUpdateQuestions}
                      //           handleSave={handleSave}
                      //         />
                      //       </View>
                      //     </View>
                      //   </View>
                      //   {/* </View> */}
                      // </Modal>
                      <Nocontents />
                    )}
                  </>
                </>
              )}
            </View>

            {/* Gamified Quiz Ends */}

            {/* Quiz2 ends here */}
            <Modal
              animationType="slide"
              onRequestClose={() => backs()}
              transparent={true}
              visible={feedbackModal}>
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      height: window.WindowHeigth * 1,

                      top: -10,
                      width: window.WindowWidth * 2,
                    },
                  ]}>
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.modalText}>
                      {' '}
                      ଆପଣ ପଢିଥିବା ବିଷୟଟିକୁ ରେଟିଂ ଦିଅନ୍ତୁ ।
                    </Text>

                    <Text style={styles.modalText}>
                      ଏହି ବିଷୟରେ ଆପଣଙ୍କର ମତାମତ ଲେଖନ୍ତୁ ।
                    </Text>

                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholder=" ଆପଣ ନିଜର ମତାମତ ଦିଅନ୍ତୁ ।"
                      placeholderTextColor="grey"
                      numberOfLines={10}
                      multiline={true}
                      keyboardType="ascii-capable"
                      style={[styles.input]}
                      onChangeText={onChangeText}
                      value={text}
                    />

                    <Pressable
                      style={[styles.buttonFeedback, styles.buttonClose]}
                      onPress={handleSaveFeedback}>
                      <Text style={styles.textStyle}>SAVE</Text>
                    </Pressable>
                    {/* </View> */}
                  </View>
                </View>
              </View>
              {/* </View> */}
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={successModal}>
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      width: window.WindowWidth * 0.9,
                      borderRadius: 20,
                    },
                  ]}>
                  {/* <Image
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
                  /> */}
                  <Image
                    style={[
                      styles.tinyLogos,
                      {
                        width: 250,
                        height: 220,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                    source={require('../assets/Image/https_coin.gif')}
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

                        alignSelf: 'center',
                      },
                    ]}>
                    Congratulations! {''}
                  </Text>
                  <Text
                    style={{
                      color: '#666666',

                      fontWeight: '600',
                      fontFamily: FontFamily.poppinsMedium,
                      textTransform: 'capitalize',
                    }}>
                    {username}
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      {
                        fontSize: 13,

                        color: '#666666',
                        fontWeight: '400',
                        fontFamily: FontFamily.poppinsMedium,
                        marginTop: 10,
                        alignSelf: 'center',
                      },
                    ]}>
                    ଆପଣଙ୍କ କୁଇଜ୍ ସଫଳତାର ସହ ସେଭ୍ ହୋଇଛି ଆପଣ {modalMark}% ସ୍କୋର
                    କରିଛନ୍ତି ଏବଂ
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                      {' '}
                      ୧୦
                    </Text>{' '}
                    ଟି କଏନ ହାସଲ କରିଛନ୍ତି ।
                  </Text>

                  <TouchableOpacity
                    onPress={() => setFeedbackModal(true)}
                    style={[
                      styles.bu,
                      {
                        marginTop: 40,
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 15,

                        textAlign: 'center',
                        fontFamily: FontFamily.poppinsMedium,
                        color: 'white',
                      }}>
                      Go to Feedback
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                      styles.bu,
                      {
                        marginTop: 20,
                        backgroundColor: Color.ghostwhite,
                        width: window.WindowWidth * 0.5,
                        borderWidth: 1,
                        borderColor: Color.royalblue,
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 15,

                        textAlign: 'center',
                        fontFamily: FontFamily.poppinsMedium,
                        color: Color.royalblue,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={modalsss}>
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      width: window.WindowWidth * 0.9,
                      borderRadius: 20,
                    },
                  ]}>
                  {/* <Image
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
                  /> */}
                  <Image
                    style={[
                      styles.tinyLogos,
                      {
                        width: 250,
                        height: 220,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                    source={require('../assets/Image/https_coin.gif')}
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

                        alignSelf: 'center',
                      },
                    ]}>
                    Congratulations! {''}
                  </Text>
                  <Text
                    style={{
                      color: '#666666',

                      fontWeight: '600',
                      fontFamily: FontFamily.poppinsMedium,
                      textTransform: 'capitalize',
                    }}>
                    {username}
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      {
                        fontSize: 13,
                        color: '#666666',
                        fontWeight: '400',
                        fontFamily: FontFamily.poppinsMedium,
                        marginTop: 10,
                        alignSelf: 'center',
                      },
                    ]}>
                    ଆପଣ ସଫଳତାର ସହ ନିଜର ମତାମତ ଦେଇଛନ୍ତି ଏବଂ ଆପଣ
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                      {' '}
                      ୧୧{' '}
                    </Text>{' '}
                    ଟି କଏନ ହାସଲ କରିଛନ୍ତି । ଏବେ ଆପଣ ପରବର୍ତୀ ବିଷୟ କୁ ଯାଇପାରିବେ ।
                  </Text>

                  <TouchableOpacity
                    style={[styles.buttonsss]}
                    onPress={handleToNextTopic}>
                    <Text style={styles.text}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default TechContent;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: '#0060ca',
    height: 40,
    width: window.WindowWidth * 0.45,
    left: '2%',
    borderRadius: 156,
  },
  buttonOffline: {
    justifyContent: 'center',
    // backgroundColor: '#0060ca',
    height: 40,
    borderWidth: 1,
    borderColor: '#0060ca',
    width: window.WindowWidth * 0.39,
    // right: '1%',
    borderRadius: 6,
    // alignSelf: 'center',
    // position: 'absolute',
    top: '10%',
    paddingBottom: '-21%',
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
  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 60,
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
    alignSelf: 'center',
    justifyContent: 'center',
  },

  discussionContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },

  currentUserContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0f7fa', // Light green background for the current user's messages
  },

  otherUserContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5', // Light gray background for other users' messages
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
    width: SIZES.WindowWidth * 1,
    flex: 1,

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

  modaltext: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },

  modaltextRedeem: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    paddingLeft: 39,
  },
  cardContainer: {
    flexGrow: 1,

    margin: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 10,
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
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  subModule: {
    color: Colors.black,

    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsMedium,
  },
  lebel: {
    color: Colors.greyPrimary,

    textTransform: 'capitalize',
    fontSize: 13,

    fontFamily: FontFamily.poppinsMedium,
  },
  subModuleTopic: {
    color: '#a9a9a9',
    letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 11,
    fontWeight: '600',
  },
  topic: {
    padding: 10,
    justifyContent: 'space-between',
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
  modalText: {
    marginBottom: 15,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
    width: 350,
    paddingBottom: 30,
    paddingTop: 30,
  },
  modalViewFeedback: {
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
  buttonFeedback: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Color.royalblue,
    padding: 15,
    width: 350,
    alignSelf: 'center',
    top: '10%',
  },
  textStyle: {
    color: 'white',
    width: 85,
    height: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    top: -2,
  },
  input: {
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.9,

    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'left',

    alignSelf: 'center',
  },
  buttonsss: {
    paddingVertical: 12,
    paddingHorizontal: 37,
    borderRadius: 15,
    elevation: 3,

    alignSelf: 'center',
    justifyContent: 'space-around',

    marginBottom: 12,

    backgroundColor: Color.royalblue,
  },
  text: {
    textAlign: 'right',
    color: Color.dimgray_100,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
  },
  text: {
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,

    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
  },
  clickText: {
    position: 'absolute',
    zIndex: 1,
  },
  svg: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    // top: 0,
    // left: 0,
  },
  // textStyle: {
  //   color: 'green',
  //   borderWidth: 1,
  //   borderColor: 'royalblue',
  //   borderRadius: 10,
  //   padding: '2%',
  // },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    paddingTop: '10%',
    paddingBottom: 60,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
  },
  titleButton: {
    color: 'green',
    borderWidth: 1,
    borderColor: Color.royalblue,
    borderRadius: 10,
    padding: '2%',
    justifyContent: 'center',
    // backgroundColor: '#0060ca',
    height: 40,
    width: window.WindowWidth * 0.45,
    left: '2%',
    borderRadius: 156,
  },
  carouselContainer: {
    // position: 'relative',
    marginTop: 5,
    overflow: 'hidden',
    marginRight: '4%',
    // alignSelf: 'center', // Adjust the marginTop as needed
  },
  customFabButton: {
    top: '155%',
    paddingBottom: '5%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalContent: {
    flexGrow: 1,
    padding: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    width: 450,
    paddingTop: '2%',
  },

  answerContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    width: '70%',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
    // borderWidth: 2,
    // borderColor: 'black',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  answerText: {
    fontSize: 16,
    marginBottom: 10,
    overflow: 'scroll',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    top: '2%',
    paddingBottom: '2%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  inputBox: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
  },
  countText: {
    left: 2,
  },
  iconusersuserLayout: {
    height: 30,
    width: 30,
  },
  iconusersuserPosition: {
    left: 15,
    position: 'absolute',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  // closeButton: {
  //   marginTop: 20,
  //   padding: 10,
  //   backgroundColor: 'gray',
  //   alignItems: 'center',
  // },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginHorizontal: 25,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    minWidth: '50%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    // backgroundColor: Color.royalblue,
    // height: 39,
  },
});
