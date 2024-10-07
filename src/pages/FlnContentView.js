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
  StatusBar,
  TextInput,
  AppState,
  Button,
  Animated,
  ToastAndroid,
  Dimensions,
  BackHandler,
  // StatusBar,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import YouTube from 'react-native-youtube-iframe';
import * as SIZES from '../utils/dimensions';
// import * as FcmSlice from '../redux/slices/FcmSlice';
import * as window from '../utils/dimensions';
import axios from 'axios';
import API from '../environment/Api';
import React, {useState, useRef} from 'react';
// import Quiz from '../components/Quiz';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import Colors from '../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import Norecord from '../components/Norecord';
// import * as TrainingSliceNew from '../redux/slices/TrainingSliceNew';
// import * as types from '../redux/slices/UserSlice';
// import Popup from '../components/Popup';
import {useEffect} from 'react';
import Modals from '../components/Modals';
import Entypo from 'react-native-vector-icons/Entypo';
// import FabButton from '../components/FabButton';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useFocusEffect} from '@react-navigation/native';
import {FontFamily, Color} from '../GlobalStyle';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VideoPlayer from 'react-native-video-player';
// import VideoPlayer from 'your-video-player-library';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';
import Video from 'react-native-video';
// import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
// import PdfViewer from '../components/PdfViewer';
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Nocontents from '../components/Nocontents';
import {app_versions} from './Home';
const audioPlayer = new AudioRecorderPlayer();
const FlnContentView = ({route, navigation}) => {
  const data = route.params.item;
  const datas = route.params;
  console.log('data------>', data?.topicId, data, datas);
  const subject = route.params.subject;
  const program = route.params.program;
  const sclass = route.params.sclass;
  // console.log('====================================subject', program);

  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice?.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const appState = useRef(AppState.currentState);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fln, setFln] = useState([]);
  const [language, setLanguage] = useState('od');
  const [contentData, setContentData] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const [buffering, setBuffering] = useState(true);

  const [clicked, setClicked] = useState(false);

  const [progress, setProgress] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState();

  const ref = useRef();
  const format = seconds => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getSeconds();
    return `${hh}:${mm}:${ss}`;
  };

  const toggleFullScreen = () => {
    setModalVisible(!modalVisible);

    if (!modalVisible) {
      Orientation.lockToLandscape(); // Lock to landscape when entering full-screen
    } else {
      Orientation.lockToPortrait(); // Lock to portrait when exiting full-screen
    }
  };
  //Store Timespent data
  const [stTime, setStTime] = useState(null);
  // console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  // console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  //for user back button press timespent calculation
  useEffect(() => {
    const resetStartTime = () => {
      // console.log('calling reset start time function----------------------->');
      AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
        .then(() => console.log('stTime saved to AsyncStorage'))
        .catch(error =>
          console.error('Error saving stTime to AsyncStorage:', error),
        );
    };
    resetStartTime();
    const backAction = () => {
      // console.log(
      //   '======================== 2 Set Start Time========================= ',
      // );

      const x = AsyncStorage.getItem('stTime').then(value => {
        const y = new Date().getTime();
        // console.log(
        //   '<<<<<<<<<<<<<<<<<<<<<<<<<< if Not Idle:  Statrt time: ',
        //   value,
        // );
        const timeSpent = y - value;
        setGetStartTime(timeSpent);
        // console.log(
        //   'ooooooooooooooooooooooooooooooooooooooo timeSpent--->',
        //   timeSpent,
        // );

        const resetTimeSpent = timeSpent / 1000;
        // console.log('resetTimeSpent--->', resetTimeSpent);
        const duration = Math.floor(resetTimeSpent);
        console.log(
          'FLN duration back-------------------------------->',
          duration,
        );
        const year = new Date().getFullYear();
        // console.log('year--->', year);
        const month = new Date().getMonth() + 1;
        // console.log('month--->', month);
        const data = {
          userid: userid,
          username: username,
          usertype: usertype,
          managerid: managerid,
          passcode: passcode,
          modulename: 'fln',
          duration: duration,
          month: month,
          year: year,
          appVersion: app_versions,
          start: new Date(parseInt(value)),
          end: new Date(parseInt(y)),
        };

        API.post(`savetimespentrecord/`, data)
          .then(response => {
            // console.log('timespent response in content------->', response.data);
          })
          .catch(error => {
            console.log('error in timespent post------------->', error);
          });
      });
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //Store Timespent data
  // let stTime = new Date().getTime();

  //For Screen idle timespent calculation
  useEffect(() => {
    AsyncStorage.getItem('stTime')
      .then(value => {
        if (value) {
          console.log('value--->', value);
          //setStTime(parseInt(value, 10));
        } else {
          setStTime(new Date().getTime());
        }
      })
      .catch(error =>
        console.error('Error loading stTime from AsyncStorage:', error),
      );
    const handleAppStateChange = nextAppState => {
      const x = AsyncStorage.getItem('stTime').then(value => {
        value = value ? value : new Date().getTime();
        if (appStateVisible === 'active' && nextAppState === 'background') {
          // console.log('>>>>>>>>>>>>>>>>>>> Idle:  Statrt time: ', value);
          const closeTime = new Date().getTime();
          // console.log('>>>>>>>>>>>>>>>>>>> Idle:  End time time: ', closeTime);

          const dur = (closeTime - value) / 1000;
          // console.log('>>>>>>>>>>>>>>>>>>>>>> 1 timeSpent--->', dur);
          AsyncStorage.setItem('stTime', closeTime.toString()) //clTime.toString()
            .then(() => {
              const duration = Math.floor(dur);
              console.log(
                'FLN duration on idle-------------------------------->',
                duration,
              );
              const year = new Date().getFullYear();
              console.log('year--->', year);
              const month = new Date().getMonth() + 1;
              console.log('month--->', month);
              const data = {
                userid: userid,
                username: username,
                usertype: usertype,
                managerid: managerid,
                passcode: passcode,
                modulename: 'fln',
                duration: duration,
                month: month,
                year: year,
                appVersion: app_versions,
                start: new Date(parseInt(value)),
                end: new Date(parseInt(closeTime)),
              };

              API.post(`savetimespentrecord/`, data)
                .then(response => {
                  console.log(
                    'timespent response in content------->',
                    response.data,
                  );
                })
                .catch(error => {
                  console.log('error in timespent post------------->', error);
                });

              console.log('stTime saved to AsyncStorage');
            })
            .catch(error =>
              console.error('Error saving stTime to AsyncStorage:', error),
            );
        } else if (
          appStateVisible === 'background' &&
          nextAppState === 'active'
        ) {
          setStTime(new Date().getTime()); // Reset stTime when the app comes back to the foreground
        } else if (appStateVisible === 'active' && nextAppState === 'active') {
          console.log('when Screen is on =====================>');
          AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
            .then(() => console.log('stTime saved to AsyncStorage1'))
            .catch(error =>
              console.error('Error saving stTime to AsyncStorage:', error),
            );
        }
      });

      setAppStateVisible(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const fetchData = async () => {
        try {
          const response = await API.get(
            `getMasterStudActContents/${
              data?.topicId ? data?.topicId : datas.contentDetails
            }`,
          );
          console.log(response.data, 'contentpge--------------------->');
          setFln(response.data);
          setIsLoading(false);
          setStatus(response.data);
        } catch (error) {
          if (error.response.status === 413) {
            console.log('error is---------------->', error);
          } else if (error.response.status === 504) {
            console.log('Error is--------------------->', error);
          } else if (error.response.status === 500) {
            console.error('Error is------------------->:', error);
          } else {
            console.error('Error is------------------->:', error);
          }
        }
      };

      fetchData();
    }, []),
  );

  useEffect(() => {
    const backAction = () => {
      // setModal(true);

      // Handle any other conditions or logic before going back

      // Directly go back to the previous screen
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // const closeModal = () => {
  //   setCustomModal(false);
  //   navigation.goBack();
  // };

  const startPlayback = async item => {
    try {
      const path = item.value; // Replace with the actual audio file path
      await audioPlayer.startPlayer(path);
      setIsPlaying(true);
      console.log(' playing audio:', path);
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const handleLoad = () => {
    setBuffering(false);
  };

  useEffect(() => {
    audioPlayer.setSubscriptionDuration(0.1);
    audioPlayer.addPlayBackListener(({current_position, duration}) => {
      setProgress(current_position);
      setDuration(duration);
    });

    return () => {
      audioPlayer.stopPlayer();
      audioPlayer.removePlayBackListener();
    };
  }, []);

  const stopPlayback = async item => {
    console.log('stop----->', item);
    try {
      await audioPlayer.stopPlayer();
      setIsPlaying(false);
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  // console.log(route.params, 'route');
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    // console.log(
    //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    // );
  };
  const [loadingImage, setLoadingImage] = useState(false);
  // const toggleFullScreen = () => {
  //   setIsFullScreen(!isFullScreen);
  // };
  // const videoPlayer = React.useRef();
  const goFullScreen = () => {
    if (videoPlayer.current) {
      videoPlayer.current.presentFullscreenPlayer();
    }
  };
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  //   const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');

  const onSeek = seek => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = playerState => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  //   const onReplay = () => {
  //     //Handler for Replay
  //     setPlayerState(PLAYER_STATES.PLAYING);
  //     videoPlayer.current.seek(0);
  //   };

  //   const onProgress = data => {
  //     // Video Player will progress continue even if it ends
  //     if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
  //       setCurrentTime(data.currentTime);
  //     }
  //   };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  // const onLoadStart = data => setIsLoading(true);

  //   const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  //   const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    Alert.alert('Exit full screen');
  };

  const enterFullScreen = () => {
    Alert.alert('Enter full screen');
  };

  const onFullScreen = () => {
    setIsFullScreen(!isFullScreen); // Toggle the isFullScreen state
    if (screenType === 'content') {
      setScreenType('cover');
      exitFullScreen();
    } else {
      setScreenType('content');
      enterFullScreen();
    }
  };

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
  // const openModal = item => {
  //   setNowPlayingUrl(item.value);
  //   Orientation.lockToLandscape(); // Lock to landscape when modal opens
  //   setModalVisible(true);
  // };

  // const closeModal = () => {
  //   setNowPlayingUrl('');
  //   Orientation.unlockAllOrientations(); // Unlock orientation when modal closes
  //   setModalVisible(false);
  // };
  const openModal = item => {
    setNowPlayingUrl(item.value);
    // Orientation.lockToLandscape(); // Lock to landscape when modal opens
    Orientation.lockToLandscape(); // Lock to portrait mode

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNowPlayingUrl('');
    // setIsVideoPlaying(false); // Pause the main video when modal closes
    Orientation.lockToPortrait();
  };
  const onSeeking = currentTime => setCurrentTime(currentTime);
  const [videoLoading, setVideoLoading] = useState(true);
  const handleVideoLoad = () => {
    // console.log('==================================== video loaded');
    return true;
    // This function will be called when the video is loaded
    setVideoLoading(false);
  };
  const TopicImage = data?.TopicImage;
  const defaultImage = 'https://i.imgur.com/6bJMDFs.png';
  const buildLink = async () => {
    let link;

    try {
      const response = await axios({
        method: 'POST',
        url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyC_mMwlba3Rgb_Sgjh-pjK_9eWPw_z1cqw`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          dynamicLinkInfo: {
            domainUriPrefix: 'https://thinkzoneapp.page.link',
            // link: `https://thinkzone.in/flncontentview?language=od&sclass=${sclass}&topicId=${data.topicId}`,
            link: `https://thinkzone.in/=flncontentview?${data?.topicId}?${sclass}`,
            androidInfo: {
              androidPackageName: 'com.nrusingh.teacher_thinkzone1',
            },
            socialMetaTagInfo: {
              // socialImageLink:
              //   // 'https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg',
              //   snapImage,
              socialTitle: `<div style="height: 660px; width: 1331px;"> <h1>${data.topicName}</h1></div>`,
              socialDescription: `<p>Description for ${data.topicName}</p>`,
              socialImageLink: TopicImage || defaultImage,
              // 'https://audioassessment.s3.us-east-2.amazonaws.com/1689667239744',
              // 'https://audioassessment.s3.us-east-2.amazonaws.com/1690004053237',
            },
            // iosInfo: {
            //   iosBundleId: 'com.example.ios',
            // },
          },
        },
      });

      console.log('Firebase Dynamic Links API Response:', response.data);

      if (response.status === 200) {
        link = response.data.shortLink;
      }
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }

    return link;
  };

  const shareLink = async () => {
    let shareUrl;
    try {
      shareUrl = await buildLink();
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }

    try {
      if (shareUrl) {
        // Check if shareUrl is not undefined or null
        const result = await Share.share({
          message: `Share your link ${shareUrl}`,
        });
      }
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };
  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }

  console.log('this is fln------------------------>');
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: '#0060ca',
          // height: 66,
          width: window.WindowWidth * 1.1,
          marginTop: -16,
          marginLeft: -20,
          paddingBottom: 20,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            marginTop: 15,
            alignSelf: 'flex-start',
            left: '15%',
            top: 5,
            width: 320,
          }}>
          {data?.topicName}
        </Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <>
          {/* <View
              style={{
                backgroundColor: '#0060ca',
                height: 66,
                width: window.WindowWidth * 1.1,
                marginTop: -16,
                marginLeft: -20,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  marginTop: 15,
                  textAlign: 'center',
                }}>
                {data.topicName}
             
              </Text>
            </View> */}
          <ScrollView>
            <>
              {fln?.length > 0 ? (
                <>
                  {fln?.map((item, index) => {
                    return (
                      <View
                        style={{
                          padding: 5,
                          backgroundColor: Colors.white,
                        }}>
                        {item.type === 'text' && (
                          <View style={{top: '2%'}}>
                            <HtmlContentCoponent sourceData={item.value} />
                          </View>
                        )}
                        {item.type === 'image' && (
                          <ReactNativeZoomableView
                            maxZoom={3} // Example: The image can be zoomed in up to 3 times its original size.
                            minZoom={1} // Example: The image cannot be zoomed out more than its original size.
                            zoomStep={0.5} // Example: Each zoom-in or zoom-out changes the zoom level by 0.5.
                            initialZoom={1} // Example: The image is displayed at its original size initially.
                            bindToBorders={true}
                            onZoomAfter={logOutZoomState}
                            style={{
                              padding: 10,
                              // paddingBottom: 20,
                              backgroundColor: Colors.white,
                            }}>
                            {/* <Text
                                style={{
                                  fontFamily: FontFamily.poppinsMedium,
                                  fontSize: 17,
                                  color: 'black',
                                  alignSelf: 'center',
                                  padding: 10,
                                }}>
                                {item.label}
                              </Text> */}
                            {loadingImage ? (
                              <ActivityIndicator
                                size="large"
                                color={Colors.yourLoaderColor}
                              />
                            ) : (
                              <Image
                                source={{uri: `${item.value}`}}
                                // onLoadStart={() => setLoadingImage(true)}
                                onLoad={() => setLoadingImage(false)}
                                // resizeMode="contain"
                                style={{
                                  width: window.WindowWidth * 0.9,
                                  // height: SIZES.WindowHeigth * 0.9,
                                  aspectRatio: 12 / 8,
                                  alignSelf: 'center',
                                  // paddingTop: 10,
                                  // borderWidth: 2,

                                  borderRadius: 10,
                                }}
                              />
                            )}
                          </ReactNativeZoomableView>
                        )}
                        {item.type === 'audio' && (
                          <View
                            style={{
                              // paddingBottom: 10,
                              // paddingTop: -5,
                              top: '-15%',
                              alignSelf: 'center',
                            }}>
                            {/* <Text
                                style={{
                                  fontFamily: FontFamily.poppinsMedium,
                                  fontSize: 17,
                                  color: 'black',
                                  alignSelf: 'center',
                                  padding: 10,
                                }}>
                                {item.label}
                              </Text> */}
                            <View
                              style={{
                                width: window.WindowWidth * 0.9,
                                paddingBottom: 20,
                                backgroundColor: Color.ghostwhite,
                                borderRadius: 10,
                                // borderWidth: 1,
                                // borderColor: Color.royalblue,
                                paddingTop: 20,
                              }}>
                              {isPlaying == false ? (
                                <TouchableOpacity
                                  style={{
                                    top: '8%',
                                    flexDirection: 'row',
                                  }}
                                  onPress={() => startPlayback(item, 'play')}>
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
                                      fontFamily: FontFamily.poppinsMedium,
                                      left: 20,
                                      top: -25,
                                    }}>
                                    {' '}
                                    Play Audio
                                  </Text>
                                </TouchableOpacity>
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

                                          // paddingBottom: 10,
                                          // alignSelf: 'flex-start',
                                        }}
                                        source={require('../assets/Image/waves.gif')}
                                      />
                                    </View>
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>
                          </View>
                        )}
                        {item.type === 'video' && (
                          <View
                            style={{
                              width: '100%',
                              paddingBottom: 35,
                              backgroundColor: 'white',
                              borderRadius: 10,
                              // borderWidth: 1,
                              // borderColor: Color.royalblue,
                              // paddingTop: 15,
                              paddingLeft: 20,
                              paddingRight: 20,
                              alignSelf: 'center',
                              // top: '-5%',
                            }}>
                            {/* <Text
                                style={{
                                  fontFamily: FontFamily.poppinsMedium,
                                  fontSize: 22,
                                  color: 'black',
                                  alignSelf: 'center',
                                  padding: 10,
                                  paddingBottom: -10,
                                  fontWeight: 'bold',
                                }}>
                                {item.label}
                              </Text> */}
                            {buffering && (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                {/* <ActivityIndicator
                                        size="large"
                                        color="#0060ca"
                                      /> */}
                              </View>
                            )}
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

                              {/* <VideoPlayer
                                    video={{
                                      uri: `${item.value}`,
                                    }}
                                    thumbnail={{
                                      uri: `${item.thumbnail}`,
                                    }}
                                    // buffering={buffering}
                                    onLoad={handleLoad}
                                    onPause={handleVideoPause}
                                    onPlay={handleVideoPlay}
                                    showDuration={true}
                                    fullScreenOnLongPress={true}
                                    controlTimeout={5000}
                                    resizeMode={'cover'}
                                    volume={1.0}
                                    rate={1.0}
                                    disableFullscreen={true} // Enable full-screen functionality
                                    // onEnterFullscreen={handleVideoPause} // Pause video when entering fullscreen
                                    onExitFullscreen={handleVideoPlay}
                                  /> */}
                              {item.thumbnail?.length > 0 ? (
                                <TouchableOpacity onPress={openModal}>
                                  <Image
                                    style={{
                                      width: 336,
                                      top: 2,
                                      height: 181,
                                      // left: 20,
                                      backgroundColor: 'white',
                                      paddingBottom: 20,
                                      // borderWidth: 0.1,
                                      borderColor: 'black',
                                      // borderRadius: 20,
                                      alignSelf: 'flex-end',
                                    }}
                                    source={{uri: `${item.thumbnail}`}}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => openModal(item)}>
                                  <Image
                                    style={{
                                      width: 336,
                                      top: 2,
                                      height: 181,
                                      // left: 20,
                                      backgroundColor: 'white',
                                      paddingBottom: 20,
                                      // borderWidth: 0.1,
                                      borderColor: 'black',
                                      // borderRadius: 20,
                                      alignSelf: 'center',
                                    }}
                                    source={require('../assets/Image/thumbnail.png')}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        )}
                        {/* {item.type === 'youtube' && (
                            <View style={{top: '2%', alignSelf: 'center'}}>
                              <YouTube
                                videoId={item.value}
                                // height={windowHeight * 8}
                                play={true}
                                resumePlayAndroid={false}
                                height={340}
                                width={349}
                                playerParams={{
                                  modestbranding: 1, // Enable YouTube logo
                                  controls: 0, // Disable player controls (including copy link button)
                                  disablekb: 1, // Disable keyboard controls
                                }}
                                onReady={onReady}
                                webViewStyle={{
                                  opacity: 0.99,
                                  display: isReadyForRender ? 'flex' : 'none',
                                }}
                                webViewProps={{
                                  androidLayerType: isReadyForRender
                                    ? 'hardware'
                                    : 'software',
                                }}
                                onChangeState={event => {
                                  console.log('State:', event.state);
                                  if (event.state === 'ended') {
                                    setFocusedIndex(null); // Reset focused index when the video ends
                                  }
                                }}
                                onError={error => console.log('Error:', error)}
                              />
                            </View>
                          )} */}
                      </View>
                    );
                  })}
                  <Modal
                    animationType="slide"
                    transparent={false}
                    onRequestClose={() => closeModal()}
                    visible={modalVisible}>
                    {/* <StatusBar hidden /> */}
                    <ScrollView>
                      <View style={{flex: 1}}>
                        {/* <Text>
                                        hlo {Dimensions.get('window').height}
                                      </Text> */}
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
                            uri: `${nowPlayingUrl}`,
                          }}
                          style={{
                            // top: '-20%',
                            width: '100%',
                            height: 300,
                          }}
                          autoplay
                          // duration={handleVideoLoad}
                          showDuration
                          onLoad={() => {
                            console.log('xxxxxxxxxxxxxxx onload');
                            handleVideoLoad;
                          }}
                          // onPause={handleVideoPause} // Pause video when modal is opened
                          // onPlay={handleVideoPlay} // Resume video when modal is closed
                          // other props...
                        />
                        <TouchableOpacity onPress={closeModal}>
                          <Image
                            style={{
                              width: 40,
                              top: 2,
                              height: 40,
                              // left: 20,
                              backgroundColor: 'white',
                              paddingBottom: 10,
                              alignSelf: 'flex-end',
                            }}
                            source={require('../assets/Image/minimize.png')}
                          />
                        </TouchableOpacity>
                        {/* <Button
                                        title="Close Full Screen"
                                        onPress={closeModal}
                                      /> */}
                      </View>
                    </ScrollView>
                  </Modal>
                  <View
                    style={{
                      marginTop: '30%',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    {/* <FabButton
                        image={require('../assets/Image/share.png')}
                        onPress={shareLink}
                        // onPress={() =>
                        //   // navigation.navigate('fln', {
                        //   //   type: 'fln',
                        //   // })
                        //   ToastAndroid.show(
                        //     'This Module is under  development. ',
                        //     ToastAndroid.SHORT,
                        //   )
                        // }
                      /> */}
                    {status?.completionStatus === true ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                          navigation.navigate('StudentsListActivity', {
                            // submoduleName: item.submoduleName,
                            topicId: data,
                            subject: subject,
                            program: program,
                            // activityType: 'fln',
                            // program: 'fln',
                          })
                        }>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            fontWeight: '700',
                            color: Colors.white,
                            fontFamily: FontFamily.poppinsMedium,
                          }}>
                          QUIZ COMPLETE
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      // <TouchableOpacity style={styles.button}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                          navigation.navigate('StudentsListActivity', {
                            // submoduleName: item.submoduleName,
                            topicId: data?.topicId,
                            topicName: data?.topicName,
                            subject: subject,
                            program: program,
                            activityType: program,
                            // program: 'fln',
                          })
                        }>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            fontWeight: '700',
                            color: Colors.white,
                            fontFamily: FontFamily.poppinsMedium,
                          }}>
                          Take Quiz
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {width: window.WindowWidth * 0.45},
                      ]}
                      onPress={shareLink}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 15,
                          fontWeight: '700',
                          color: Colors.white,
                          fontFamily: FontFamily.poppinsMedium,
                        }}>
                        Share{' '}
                        <FontAwesome
                          name="share"
                          size={17}
                          color={Colors.white}
                          style={styles.icon}
                        />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Nocontents />
              )}
            </>
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};
export default FlnContentView;

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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  // modalContainer: {
  //   height: window.WindowHeigth * 0.1,
  //   backgroundColor: Colors.white,
  //   elevation: 5,
  //   width: '100%',
  //   flex: 1,
  //   justifyContent: 'space-evenly',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  // },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  subModule: {
    color: Colors.black,
    // letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsMedium,
  },
  lebel: {
    color: Colors.greyPrimary,
    // letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 13,
    // fontWeight: '600',
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
  modalContainer: {
    flex: 1,
  },
  normalVideo: {
    // width: '100%',
    // height: 200,
    width: '100%',
    aspectRatio: 16 / 9, // Adjust the height as needed
  },
  fullScreenVideo: {
    width: '100%',
    height: Dimensions.get('window').height,
    // height: SIZES.WindowHeigth * 0.1,
    width: '100%',
    // aspectRatio: 16 / 9,
  },
  modalContainer: {
    flex: 1,
  },
  fullScreenVideo: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});
