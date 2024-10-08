import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  AppState,
  TextInput,
  Pressable,
  Button,
  Platform,
  // Share,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  StatusBar,
  ToastAndroid,
  // BackHandler,
} from 'react-native';
import Share from 'react-native-share';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import * as window from '../utils/dimensions';
import * as SIZES from '../utils/dimensions';
import VideoPlayer from 'react-native-video-player';
import NetInfo from '@react-native-community/netinfo';
import * as types from '../redux_toolkit/features/users/UserSlice';
import API from '../environment/Api';
import {useFocusEffect} from '@react-navigation/native';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import {Buffer} from 'buffer';
import Norecord from '../components/Norecord';
import Colors from '../utils/Colors';
import {FontFamily, Color} from '../GlobalStyle';
import Orientation from 'react-native-orientation-locker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {WebView} from 'react-native-webview';
import YouTube from 'react-native-youtube-iframe';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RenderHtml from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import {log} from 'console';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {app_versions} from './Home';
import AsyncStorage from '@react-native-async-storage/async-storage';

let STORAGE_KEY = '@pge_content';
const audioPlayer = new AudioRecorderPlayer();

const Pgecontentdetails = ({route, navigation}) => {
  const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const data = route.params.item;
  const subject = route.params.subject;
  const sclass = route.params.sclass;
  console.log('data------>', data, route.params);
  console.log('dat2------>', data?.topicId);
  const dispatch = useDispatch();
  const componentRef = useRef();
  const netInfo = NetInfo.useNetInfo();

  useEffect(() => {}, []);

  const [completeStatus, setCompleteStatus] = useState(false);

  const [language, setLanguage] = useState('od');
  const [isLoading, setIsloading] = useState(true);

  const [modal, setModal] = useState(false);
  const [content_data, setContent_data] = useState([]);
  console.log('content_data---->', content_data);
  // const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [offlineContent, setOfflineContent] = useState();
  console.log('offlineContent---->', offlineContent);
  // console.log('text2---->', text.length);
  const [status, setStatus] = useState();

  const user = useSelector(state => state.UserSlice?.user?.data?.resData);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const getStatus = () => {
    setModalVisible(true);
  };

  const [contentData, setContentData] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [pge, setPge] = useState([]);

  const [stTime, setStTime] = useState(null);
  console.log('stTime---->', stTime);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  console.log('appStateVisible------------->', appStateVisible);
  const [getStartTime, setGetStartTime] = useState(null);

  //for user back button press timespent calculation
  useEffect(() => {
    const resetStartTime = () => {
      console.log('calling reset start time function----------------------->');
      AsyncStorage.setItem('stTime', '' + new Date().getTime()) //clTime.toString()
        .then(() => console.log('stTime saved to AsyncStorage'))
        .catch(error =>
          console.error('Error saving stTime to AsyncStorage:', error),
        );
    };
    resetStartTime();
    const backAction = () => {
      console.log(
        '======================== 2 Set Start Time========================= ',
      );

      const x = AsyncStorage.getItem('stTime').then(value => {
        const y = new Date().getTime();
        console.log(
          '<<<<<<<<<<<<<<<<<<<<<<<<<< if Not Idle:  Statrt time: ',
          value,
        );
        const timeSpent = y - value;
        setGetStartTime(timeSpent);
        console.log(
          'ooooooooooooooooooooooooooooooooooooooo timeSpent--->',
          timeSpent,
        );

        const resetTimeSpent = timeSpent / 1000;
        console.log('resetTimeSpent--->', resetTimeSpent);
        const duration = Math.floor(resetTimeSpent);
        console.log('start time-------------->', value);
        console.log('x---------------------->', x);
        console.log('end time-------------->', y);

        console.log('duration--->', duration);
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
          modulename: 'tchTtlQuiz',
          duration: duration,
          month: month,
          year: year,
          appVersion: app_versions,
          start: new Date(parseInt(value)),
          end: new Date(parseInt(y)),
        };

        API.post(`savetimespentrecord/`, data)
          .then(response => {
            console.log('timespent response in content------->', response.data);
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
      console.log(
        '>>>>>>>>>>>>>>>>>>> Idle:  State change: appStateVisible= ',
        appStateVisible,
        '     nextAppState= ',
        nextAppState,
      );
      const x = AsyncStorage.getItem('stTime').then(value => {
        console.log('start time--------------------------->', value);
        value = value ? value : new Date().getTime();
        if (appStateVisible === 'active' && nextAppState === 'background') {
          console.log('>>>>>>>>>>>>>>>>>>> Idle:  Statrt time: ', value);
          const closeTime = new Date().getTime();
          console.log('>>>>>>>>>>>>>>>>>>> Idle:  End time time: ', closeTime);

          const dur = (closeTime - value) / 1000;
          console.log('>>>>>>>>>>>>>>>>>>>>>> 1 timeSpent--->', dur);
          AsyncStorage.setItem('stTime', closeTime.toString()) //clTime.toString()
            .then(() => {
              const duration = Math.floor(dur);
              console.log('duration--->', duration);
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
                modulename: 'tchTtlQuiz',
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
              data?.topicId ? data?.topicId : route.params.subject
            }`,
          );
          setPge(response.data);
          console.log(response.data, 'contentpge--------------------->');
          setIsloading(false);
          setStatus(response.data);
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

      fetchData();
    }, [route.params]),
  );

  const handleSaveFeedback = () => {
    if (completeStatus) {
      //
    } else {
      if (text.trim().length > 0) {
        let body = {
          preferedlanguage: content_data[0].preferedlanguage,
          passcode: user[0].passcode,
          managerid: user[0].managerid,
          userid: user[0].userid,
          managername: user[0].managername,
          program: content_data[0].program,
          subject: content_data[0].subject,
          month: content_data[0].skillsetid,
          week: content_data[0].skillsetid,
          feedback: text.trim(),
          // skill: this.skill,
          level: content_data[0].class,
          content: content_data[0]?.segment[0]?.value,
          complete: true,
        };

        API.post(`tchactivitynew_saveactivity`, body).then(suc => {
          console.log('pgecontentresponse---->', suc.data);

          setIsloading(false);

          err => {};
        });
        setModalVisible(!modalVisible);
        setModal(true);
        dispatch(types.rewardsUserstart(user[0].userid));
      } else {
        Alert.alert('ଦୟାକରି ସଠିକ୍ ମତାମତ ଦିଅନ୍ତୁ ।');
      }
    }
  };

  const [snapImage, setSnapImage] = useState(null);
  console.log('Captured image URI:', snapImage);
  const renderHtmlRef = useRef();

  const TopicImage = data?.topicImage;
  const defaultImage = 'https://i.imgur.com/6bJMDFs.png';
  const buildLink = async () => {
    let link;

    try {
      const response = await axios({
        method: 'POST',
        url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyC_mMwlba3Rgb_Sgjh-pjK_9eWPw_z1cqw`,
        Headers: {
          'Content-Type': 'application/json',
        },
        data: {
          dynamicLinkInfo: {
            domainUriPrefix: 'https://thinkzoneapp.page.link',
            link: `https://thinkzone.in/=Content?${subject}?${sclass}?${data.topicId}`,
            androidInfo: {
              androidPackageName: 'com.nrusingh.teacher_thinkzone1',
            },
            socialMetaTagInfo: {
              socialTitle: `<div style="height: 660px; width: 1331px;"> <h1>${data.topicId}</h1></div>`,
              socialDescription: `<p>Description for ${data.topicId}</p>`,
              socialImageLink: TopicImage || defaultImage,
            },
          },
        },
      });

      if (response.status === 200) {
        link = response.data.shortLink;
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

    return link;
  };

  const shareLink = async () => {
    let shareUrl;

    try {
      shareUrl = await buildLink();
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
    try {
      if (shareUrl) {
        const sharedUrl = `${shareUrl}`;
        console.log('sharedUrl--->', sharedUrl);
        await Share.open({
          url: sharedUrl,
          message: `Share your link ${shareUrl}`,
        });
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
  // const hdata = data[0].segment[0].value;
  //
  // {data[0].segment[0].value === undefined ? : data[0].segment[0].value}
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    // console.log(
    //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    // );
  };
  //
  // {data[0].segment[0].value === undefined ? : data[0].segment[0].value}
  const [loadingImage, setLoadingImage] = useState(false);

  const handleLoad = () => {};
  const [modalVisible, setModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [nowPlayingUrl, setNowPlayingUrl] = useState('');
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
  const startPlayback = async item => {
    try {
      const path = item.value; // Replace with the actual audio file path
      await audioPlayer.startPlayer(path);
      setIsPlaying(true);
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

  console.log('route.params.skillName', route.params.skillName);
  const [videoLoading, setVideoLoading] = useState(true);
  const handleVideoLoad = () => {
    console.log('==================================== video loaded');
    return true;
    // This function will be called when the video is loaded
    setVideoLoading(false);
  };
  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={styles.centeredView}>
          {/* <View	
            style={[	
              styles.modalView,	
              {	
                height: window.WindowHeigth * 0.25,	
                marginTop: -0,	
                width: window.WindowWidth * 0.5,	
              },	
            ]}> */}
          <View
            style={[
              styles.modalView,
              {
                // height: window.WindowHeigth * 0.7,

                width: window.WindowWidth * 0.92,
                borderRadius: 20,
              },
            ]}>
            <Image
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
                  // width: 200,
                  alignSelf: 'center',
                },
              ]}>
              Congratulations! {''}
            </Text>
            <Text
              style={{
                color: 'black',
                fontWeight: '800',
                color: '#666666',
                textTransform: 'capitalize',
              }}>
              {user[0].username}
            </Text>

            <Text
              style={[
                styles.username,
                {
                  fontSize: 16,
                  color: '#666666',
                  fontWeight: '400',
                  fontFamily: 'serif',
                  marginTop: 10,
                },
              ]}>
              ଆପଣ ସଫଳତାର ସହ ଏହି ବିଷୟ ସମ୍ପୁର୍ଣ୍ଣ କରିଥିବାରୁ ୨ଟି
              କଏନ୍ ହାସଲ କରିଛନ୍ତି।
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('myachievement', {
                  type: 'myachievement',
                })
              }
              style={[
                styles.bu,
                {
                  marginTop: 40,
                  width: window.WindowWidth * 0.5,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: 'white',
                }}>
                Check Reward
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
                  // color: Color.white,
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: Color.royalblue,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
      </Modal>
      <View style={{flex: 1, marginBottom: 6, backgroundColor: 'white'}}>
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
                  fontSize: 18,
                  marginTop: 15,
                  alignSelf: 'flex-start',
                  left: '15%',
                  top: 5,
                }}>
                {data?.topicName}
                {/* {eceHeading.map(x => x.header)} */}
              </Text>
            </View>
            <ScrollView>
              <View>
                <>
                  {pge?.length > 0 ? (
                    <>
                      {pge.map((item, index) => {
                        return (
                          <View
                            style={{
                              padding: 10,
                              backgroundColor: Colors.white,
                            }}>
                            {item.type === 'text' && (
                              <View style={{}}>
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

                                  // paddingBottom: 40,
                                  backgroundColor: Colors.white,
                                }}>
                                {loadingImage ? (
                                  <ActivityIndicator
                                    size="large"
                                    color={Colors.yourLoaderColor}
                                  />
                                ) : (
                                  <>
                                    <Image
                                      source={{uri: `${item.value}`}}
                                      // onLoadStart={() => setLoadingImage(true)}
                                      onLoad={() => setLoadingImage(false)}
                                      // resizeMode="contain"
                                      style={{
                                        width: window.WindowWidth * 0.9,
                                        // height: SIZES.WindowHeigth * 0.9,
                                        aspectRatio: 13 / 9,
                                        alignSelf: 'center',

                                        borderRadius: 10,
                                      }}
                                    />
                                  </>
                                )}
                              </ReactNativeZoomableView>
                            )}
                            {item.type === 'audio' && (
                              <View
                                style={{
                                  // paddingBottom: 15,
                                  // paddingTop: 15,
                                  top: '-15%',
                                  alignSelf: 'center',
                                }}>
                                <View
                                  style={{
                                    width: window.WindowWidth * 0.9,
                                    paddingBottom: 20,
                                    backgroundColor: Color.ghostwhite,
                                    borderRadius: 10,
                                    // borderWidth: 1,
                                    // borderColor: Color.royalblue,

                                    paddingTop: 10,
                                  }}>
                                  {isPlaying == false ? (
                                    <TouchableOpacity
                                      style={{
                                        top: '9%',
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
                                  paddingBottom: 10,
                                  backgroundColor: 'white',
                                  borderRadius: 10,
                                  // borderWidth: 1,
                                  // borderColor: Color.royalblue,
                                  // paddingTop: 20,
                                  // paddingLeft: 20,
                                  // paddingRight: 20,
                                  alignSelf: 'center',
                                  top: '-5%',
                                }}>
                                {buffering && (
                                  <View
                                    style={{
                                      flex: 1,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}></View>
                                )}
                                <View style={{aspectRatio: 17 / 9}}>
                                  {item.thumbnail?.length > 0 ? (
                                    <TouchableOpacity onPress={openModal}>
                                      <Image
                                        style={{
                                          width: 336,
                                          top: 2,
                                          height: 181,
                                          // left: 20,
                                          backgroundColor: 'white',
                                          // paddingBottom: 20,
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
                                          // top: 2,
                                          height: 181,
                                          // left: 20,
                                          backgroundColor: 'white',
                                          // paddingBottom: 20,
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
                            <VideoPlayer
                              video={{
                                uri: `${nowPlayingUrl}`,
                              }}
                              style={{
                                width: '100%',
                                height: 300,
                              }}
                              autoplay
                              showDuration
                              onLoad={() => {
                                console.log('xxxxxxxxxxxxxxx onload');
                                handleVideoLoad;
                              }}
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
                          </View>
                        </ScrollView>
                      </Modal>
                      <View
                        style={{
                          marginTop: '30%',
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                        }}>
                        {status?.completionStatus === true ? (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                              navigation.navigate('StudentsListActivity', {
                                // submoduleName: item.submoduleName,
                                skillId: data,
                                subject: subject,
                                program: 'pge',
                                activityType: 'pge',
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
                            // onPress={saveContent}
                            onPress={() =>
                              // navigation.navigate('StudentsListActivity', {
                              navigation.navigate('StudentsListActivity', {
                                // submoduleName: item.submoduleName,
                                topicId: data.topicId,
                                topicName: data.topicName,
                                subject: subject,
                                program: 'pge',
                                activityType: 'pge',
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
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </>
  );
};

export default Pgecontentdetails;

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
  //feedback modal style
  centeredViewFeedback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.7,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    // height: 40,
    // margin: 12,
    // borderWidth: 1,
    // padding: 10,
    // paddingLeft: 56,
    // paddingRight: 56,
    // borderRadius: 12,
  },
  modalViewFeedback: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // paddingLeft: 93,
    // paddingRight: 93,
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
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
  normalVideo: {
    // width: '100%',
    // height: 200,
    width: '100%',
    aspectRatio: 16 / 9, // Adjust the height as needed
  },
  fullScreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContainer: {
    flex: 1,
  },
});
