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
  AppState,
  Pressable,
  Image,
  ActivityIndicator,
  Share,
  StatusBar,
  TextInput,
  Button,
  Animated,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import * as SIZES from '../utils/dimensions';
// import * as FcmSlice from '../redux/slices/FcmSlice';
import * as window from '../utils/dimensions';
import axios from 'axios';
import API from '../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import FabButton from '../components/FabButton';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useFocusEffect} from '@react-navigation/native';
import {FontFamily, Color} from '../GlobalStyle';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Orientation from 'react-native-orientation-locker';

import VideoPlayer from 'react-native-video-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import PdfViewer from '../components/PdfViewer';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {app_versions} from './Home';
import YouTube from 'react-native-youtube-iframe';
const audioPlayer = new AudioRecorderPlayer();
const CommunityEngagementContentView = ({route, navigation}) => {
  const data = route.params.item;
  const datas = route.params;
  console.log('data------>', datas);
  const {topicId, topicName} = data;
  const {program, sclass, subject} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice?.user);
  const {username, userid, managerid, managername, usertype, passcode} =
    user[0];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [community, setCommunity] = useState([]);
  const [language, setLanguage] = useState('od');
  const [contentData, setContentData] = useState([]);
  console.log('datacontent----->', community);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [responseSave, setResponseSave] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  //Store Timespent
  const [stTime, setStTime] = useState(null);
  console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  console.log('appStateVisible------------->', appStateVisible);
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
      console
        .log
        // '======================== 2 Set Start Time========================= ',
        ();

      const x = AsyncStorage.getItem('stTime').then(value => {
        const y = new Date().getTime();
        console.log(
          // '<<<<<<<<<<<<<<<<<<<<<<<<<< if Not Idle:  Statrt time: ',
          value,
        );
        const timeSpent = y - value;
        setGetStartTime(timeSpent);
        console.log(
          // 'ooooooooooooooooooooooooooooooooooooooo timeSpent--->',
          timeSpent,
        );

        const resetTimeSpent = timeSpent / 1000;
        console.log('resetTimeSpent--->', resetTimeSpent);
        const duration = Math.floor(resetTimeSpent);
        console.log(
          // 'Community engagement duration--------------------->',
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
          modulename: 'communityActivity',
          duration: duration,
          month: month,
          year: year,
          appVersion: app_versions,
          start: new Date(parseInt(value)),
          end: new Date(parseInt(y)),
        };

        console.log('body passed community-------------------------->', data);

        API.post(`savetimespentrecord/`, data)
          .then(response => {
            // console.log(
            //   'timespent response in Community engagement content------------------->',
            //   response.data,
            // );
          })
          .catch(error => {
            // console.log('error in timespent post------------->', error);
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
  //         // console.log('>>>>>>>>>>>>>>>>>>> Idle:  Statrt time: ', value);
  //         const closeTime = new Date().getTime();
  //         // console.log('>>>>>>>>>>>>>>>>>>> Idle:  End time time: ', closeTime);

  //         const dur = (closeTime - value) / 1000;
  //         // console.log('>>>>>>>>>>>>>>>>>>>>>> 1 timeSpent--->', dur);
  //         AsyncStorage.setItem('stTime', closeTime.toString()) //clTime.toString()
  //           .then(() => {
  //             const duration = Math.floor(dur);
  //             // console.log(
  //             //   'Community engagement duration--------------------------->',
  //             //   duration,
  //             // );
  //             const year = new Date().getFullYear();
  //             // console.log('year--->', year);
  //             const month = new Date().getMonth() + 1;
  //             // console.log('month--->', month);
  //             const data = {
  //               userid: userid,
  //               username: username,
  //               usertype: usertype,
  //               managerid: managerid,
  //               passcode: passcode,
  //               modulename: 'communityActivity',
  //               duration: duration,
  //               month: month,
  //               year: year,
  //               appVersion: app_versions,
  //               start: new Date(parseInt(value)),
  //               end: new Date(parseInt(closeTime)),
  //             };

  //             API.post(`savetimespentrecord/`, data)
  //               .then(response => {
  //                 // console.log(
  //                 //   'timespent response in Community engagement content----------------->',
  //                 //   response.data,
  //                 // );
  //               })
  //               .catch(error => {
  //                 // console.log('error in timespent post------------->', error);
  //               });

  //             // console.log('stTime saved to AsyncStorage');
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(
          // `getTransStudActContents/${user[0].usertype}/${'od'}/${data.skillId}`,
          `getTransStudActCommunity/${userid}/${topicId}`,
        );
        setCommunity(response?.data?.contentData);
        setResponseSave(response.data.completionStatus);
        console.log(
          'check content data------>',
          response?.data?.completionStatus,
        );

        setIsLoading(false);
      } catch (error) {
        if (error.response.status === 504) {
          setIsLoading(false);
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
        } else {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       if (modal) {
  //         // If the modal is visible, close the modal
  //         setModal(false);
  //         return true; // Prevent default back button behavior
  //       } else {
  //         // Navigate back using the navigation prop
  //         navigation.goBack();
  //         return true; // Prevent default back button behavior
  //       }
  //     },
  //   );

  //   return () => {
  //     // Clean up the event listener when the component unmounts
  //     backHandler.remove();
  //   };
  // }, [modal, navigation]);
  const buildLink = async () => {
    let link = await axios({
      method: 'POST',
      url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyC_mMwlba3Rgb_Sgjh-pjK_9eWPw_z1cqw`,
      Headers: {
        'Content-Type': 'application/json',
      },
      data: {
        dynamicLinkInfo: {
          domainUriPrefix: 'https://thinkzoneapp.page.link',
          link: `https://thinkzone.in/=communityengagementcontent?${topicId}`,

          androidInfo: {
            androidPackageName: 'com.nrusingh.teacher_thinkzone1',
          },
          socialMetaTagInfo: {
            // socialImageLink:
            //   // 'https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg',
            //   snapImage,
            socialTitle: `<div style="height: 660px; width: 1331px;"> <h1>${data.topicName}</h1></div>`,
            socialDescription: `<p>Description${topicId} for ${data.topicName}</p>`,
            socialImageLink:
              // 'https://audioassessment.s3.us-east-2.amazonaws.com/1689667239744',
              'https://audioassessment.s3.us-east-2.amazonaws.com/1690004053237',
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
      if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  // const closeModal = () => {
  //   setCustomModal(false);
  //   navigation.goBack();
  // };

  const startPlayback = async item => {
    try {
      const path = item.value; // Replace with the actual audio file path
      // Set isLoading state to true to show the loader
      setIsLoader(true);
      await audioPlayer.startPlayer(path);
      setIsPlaying(true);
      setIsLoader(false);
      // Set isLoading state back to false when playback starts
      console.log('Playing audio:', path);
    } catch (error) {
      if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        setIsLoader(false);
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        setIsLoader(false);
      } else {
        console.error('Error is------------------->:', error);
        setIsLoader(false);
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
      if (error.response.status === 504) {
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
  // const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  // const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');
  const [isLoader, setIsLoader] = useState(false);

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );
  // const openModal = () => {
  //   Orientation.lockToLandscape(); // Lock to landscape when modal opens
  //   setModalVisible(true);
  // };

  // const closeModal = () => {
  //   // Orientation.unlockAllOrientations(); // Unlock orientation when modal closes
  //   Orientation.lockToPortrait(); // Lock to portrait mode

  //   setModalVisible(false);
  // };
  const onSeeking = currentTime => setCurrentTime(currentTime);
  const handleContentSave = async () => {
    const body = {
      username,
      userid,
      managerid,
      managername,
      usertype,
      passcode,
      activityType: 'community',
      language: 'od',
      topicId,
      topicName,
      appVersion: app_versions,
      completionStatus: true,
    };

    console.log('save content data1------>', body);
    try {
      // const response = await API.post(`saveTransStudActQuiz`, body);

      const response = await API.post(`saveTransActCommunity`, body);

      console.log('save response----->', response.status);
      if (response.status === 201) {
        setIsLoading(false);
        // setModal(true);
        // navigation.goBack();

        Alert.alert('Content Submited Successfully', '', [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ]);
      } else {
        Alert.alert(`Something went wrong`, '', [
          {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
        ]);
      }

      // API.post(`saveTransActCommunity`, body).then(response => {
      //   console.log('save response----->', response.status);
      //   if (response.status === 201) {
      //     setIsLoading(false);
      //     setModal(true);
      //   } else {
      //     Alert.alert(`Something went wrong`, '', [
      //       {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
      //     ]);
      //   }
      // });
    } catch (error) {
      console.log('error--->', error.response.status);
      console.log('err-->', error);
      if (error.response.status === 500) {
        // \"all contents/quiz/assignment not uploaded\
        Alert.alert('Something went wrong!', 'Please try again later', [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ]);

        console.log('res.data====>', error.response);
      } else {
        Alert.alert('Something went wrong!', 'Please try again later', [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ]);
      }
    }
  };
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
    console.log(
      '====================================setNowPlayingUrl',
      setNowPlayingUrl,
    );
    console.log();
    console.log('====================================');
    // Orientation.lockToLandscape(); // Lock to landscape when modal opens
    Orientation.lockToLandscape(); // Lock to portrait mode

    setModalVisible(true);
  };

  const closeModal = () => {
    // Unlock orientation when modal closes
    // Orientation.lockAllOrientations();
    setModalVisible(false);
    setIsVideoPlaying(false); // Pause the main video when modal closes
    Orientation.lockToPortrait();
  };
  const [videoLoading, setVideoLoading] = useState(true);
  const handleVideoLoad = () => {
    // console.log('==================================== video loaded');
    return true;
    // This function will be called when the video is loaded
    setVideoLoading(false);
  };
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(
  //       'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
  //       'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => null,
  //           style: 'default',
  //         },
  //         {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
  //       ],
  //     );
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);
  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }
  return (
    <ScrollView>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View
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
                alignSelf: 'flex-start',
                left: '15%',
                top: 5,
              }}>
              {data.topicName}
            </Text>
          </View>
          <ScrollView>
            {community?.length != 0 ? (
              <View>
                {community?.map((item, index) => {
                  return (
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: Colors.white,
                      }}>
                      {item.type === 'text' && (
                        <HtmlContentCoponent sourceData={item.value} />
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
                            backgroundColor: Colors.white,
                            alignSelf: 'center',
                          }}>
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
                              resizeMode="contain"
                              style={{
                                width: window.WindowWidth * 0.9,
                                // height: SIZES.WindowHeigth * 0.9,
                                aspectRatio: 13 / 8,
                                alignSelf: 'center',
                                paddingTop: 10,
                                // borderWidth: 2,

                                borderRadius: 10,
                              }}
                            />
                          )}
                        </ReactNativeZoomableView>
                      )}
                      {item.type === 'audio' && (
                        <>
                          <View style={styles.auc}>
                            <View
                              style={{
                                width: window.WindowWidth * 0.9,
                                paddingBottom: 10,
                                backgroundColor: Color.ghostwhite,
                                borderRadius: 10,
                                // borderWidth: 1,
                                // borderColor: Color.royalblue,
                                paddingTop: 20,
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

                                            // paddingBottom: 10,
                                            // alignSelf: 'flex-start',
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
                      {item.type === 'video' && (
                        <View
                          style={{
                            width: '100%',
                            paddingBottom: 40,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            // borderWidth: 1,
                            // borderColor: Color.royalblue,
                            paddingTop: 20,
                            paddingLeft: 20,
                            paddingRight: 20,
                            alignSelf: 'center',
                            // top: '-5%',
                          }}>
                          <Text
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
                          </Text>
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
                                    alignSelf: 'center',
                                  }}
                                  source={{uri: `${item.thumbnail}`}}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={() => openModal(item)}>
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
                  visible={modalVisible}
                  onRequestClose={() => closeModal()}>
                  <StatusBar hidden />
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
                        // controlsTimeout={150}
                        controls
                        onLoad={() => {
                          // console.log('xxxxxxxxxxxxxxx onload');
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
                <View style={{marginTop: 30}}>
                  <View
                    style={
                      {
                        // marginTop: 20,
                        // paddingTop: 20,
                        // marginLeft: 10,
                      }
                    }>
                    <FabButton
                      image={require('../assets/Image/share.png')}
                      // onPress={shareLink}
                      onPress={() =>
                        ToastAndroid.show(
                          'This Module is under development.',
                          ToastAndroid.SHORT,
                        )
                      }
                    />
                    {responseSave === true ? (
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
                      // <TouchableOpacity style={styles.button}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleContentSave}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            fontWeight: '700',
                            color: Colors.white,
                            fontFamily: FontFamily.poppinsMedium,
                          }}>
                          Mark as Complete
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <Nocontents />
            )}
          </ScrollView>
          <Modal animationType="slide" transparent={true} visible={modal}>
            <View style={[styles.centeredView]}>
              <View
                style={[
                  styles.modalView,
                  {
                    // height: window.WindowHeigth * 0.6,

                    width: window.WindowWidth * 0.9,
                    borderRadius: 20,
                  },
                ]}>
                {/* <Pressable onPress={() => setModal(false)}>
                <Entypo
                  name="circle-with-cross"
                  // color={Color.primary}
                  size={30}
                  style={{marginLeft: 255, marginTop: -25}}
                />
              </Pressable> */}
                <Image
                  style={[
                    styles.tinyLogos,
                    {
                      width: 250,
                      height: 220,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // marginTop: -40,
                    },
                  ]}
                  source={require('../assets/Image/success.gif')}
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
                      // width: 200,
                      alignSelf: 'center',
                    },
                  ]}>
                  Congratulations! {''}
                </Text>
                <Text
                  style={{
                    color: '#666666',
                    // fontWeight: '800',
                    fontWeight: '600',
                    fontFamily: FontFamily.poppinsMedium,

                    textTransform: 'capitalize',
                  }}>
                  {user[0].username}
                </Text>
                <Text
                  style={[
                    styles.username,
                    {
                      fontSize: 13,
                      // color: '#666666',
                      color: '#666666',
                      fontWeight: '400',
                      fontFamily: FontFamily.poppinsMedium,
                      marginTop: 10,
                      alignSelf: 'center',
                    },
                  ]}>
                  ଆପଣ ସଫଳତାର ସହ ଏହି {data.topicName} ବିଷୟଟିକୁ ସମ୍ପୂର୍ଣ୍ଣ
                  କରିଛନ୍ତି ଏବଂ{' '}
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>୫</Text> ଟି
                  କଏନ ହାସଲ କରିଛନ୍ତି ।
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={[
                    styles.bu,
                    {
                      marginTop: 40,
                    },
                  ]}>
                  <Text
                    style={{
                      fontSize: 15,
                      // color: Color.white,
                      // fontWeight: '900',
                      textAlign: 'center',
                      fontFamily: FontFamily.poppinsMedium,
                      color: 'white',
                    }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

export default CommunityEngagementContentView;

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
});
