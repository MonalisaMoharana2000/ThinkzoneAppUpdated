import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
  AppState,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Share,
  Button,
  Dimensions,
  // BackHandler,
  ToastAndroid,
  StatusBar,
  BackHandler,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
// import FabButton from '../components/FabButton';
import Entypo from 'react-native-vector-icons/Entypo';
import * as window from '../utils/dimensions';
import * as types from '../redux_toolkit/features/users/UserSlice';
import React, {useState, useEffect} from 'react';
import {useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import {showMessage} from 'react-native-flash-message';
import Colors from '../utils/Colors';
import Norecord from '../components/Norecord';
import {useTranslation} from 'react-i18next';
import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import VideoPlayer from 'react-native-video-player';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as SIZES from '../utils/dimensions';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YouTube from 'react-native-youtube-iframe';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {app_versions} from './Home';
import {WebView} from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const audioPlayer = new AudioRecorderPlayer();

const EcContent = ({route, navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice?.user?.data?.resData);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const dataEce = route.params;
  const topicId = dataEce.contentDetails?.topicId;
  const TopicImage = dataEce.contentDetails?.topicImage;
  const ulternateImage = 'https://i.imgur.com/6bJMDFs.png';
  console.log(
    '====================================',
    topicId,
    TopicImage,
    dataEce.contentDetails,
  );
  console.log();
  console.log('====================================');
  const subject = dataEce.subject;
  const topicName = dataEce.contentDetails.topicName;
  console.log('topicName', topicName);
  const appState = useRef(AppState.currentState);

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
          modulename: 'eceactivity',
          duration: duration,
          month: month,
          year: year,
          appVersion: app_versions,
          start: new Date(parseInt(value)),
          end: new Date(parseInt(y)),
        };

        console.log('body passed----------->', data);

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

  const scrollViewRef = useRef(null);
  const [data, setData] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [content_data, setContent_data] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');
  // const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [program, setProgram] = useState('ece');

  // const [progress, setProgress] = useState(null);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  // --------------------------------------content api....................................................
  const [pge, setPge] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const fetchData = async () => {
        try {
          const response = await API.get(
            `getMasterStudActContents/${
              topicId ? topicId : dataEce.contentDetails
            }`,
          );
          setPge(response.data);
          setData(response.data);
          console.log(response.data, 'contentpge--------------------->');
          setIsloading(false);
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

      fetchData();
    }, []),
  );

  const startPlayback = async item => {
    try {
      const path = item.value; // Replace with the actual audio file path
      await audioPlayer.startPlayer(path);
      setIsPlaying(true);
      console.log(' playing audio:', path);
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
  const submitFun = () => {
    //

    setModalVisible(true);
  };

  const handleSaveFeedback = () => {
    const data = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      passcode: user[0].passcode,
      complete: true,
      level: route.params.class,
      month: content_data[0].themeid,
      preferedlanguage: 'od',
      program: 'ece',
      subject: 'na',
      week: null,
      feedback: text,
    };

    if (text.trim().length > 0) {
      API.post(`tchactivitynew_saveactivity`, data).then(suc => {
        API.get(
          // `getmasterpgeactivitiydetailsnostage/od/ece/${dataEce.contentDetails[0].themeid}/${dataEce.contentDetails[0].class}/null`,
          `tchactivitynew_getactivitiydetails/od/${user[0].userid}/ece/na/${
            dataEce.contentDetails
          }/${null}/${dataEce.class}`,
        ).then(suc1 => {
          // console.log(
          //   suc1.data,
          //   'suc5---------------------------------------------->',
          // );
          if (suc1.data.length > 0) {
            setIsComplete(true);
          }
          err => {};
        });
        // console.log(
        //   suc.data,
        //   'datas--------------------------------------------------------------------------->',
        // );
        // setIsComplete(true);

        showMessage({
          message: `Successfully Completed`,
          description: 'Successfully topic completed.',
          type: 'success',
          backgroundColor: Colors.success,
        });
        err => {};
      });
      setModalVisible(!modalVisible);
      setModal(true);
      dispatch(types.rewardsUserstart(user[0].userid));
    } else {
      Alert.alert('ଦୟାକରି ସଠିକ୍ ମତାମତ ଦିଅନ୍ତୁ ।');
    }
  };
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    // console.log(
    //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    // );
  };

  const buildLink = async () => {
    try {
      const link = await axios({
        method: 'POST',
        url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyC_mMwlba3Rgb_Sgjh-pjK_9eWPw_z1cqw`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          dynamicLinkInfo: {
            domainUriPrefix: 'https://thinkzoneapp.page.link',
            link: `https://thinkzone.in/eccontent?topicId=${dataEce.contentDetails.topicId}&class=${dataEce.class}`,
            androidInfo: {
              androidPackageName: 'com.nrusingh.teacher_thinkzone1',
            },
            socialMetaTagInfo: {
              socialTitle: `Title for ${dataEce.contentDetails.topicId}`,
              socialDescription: `Description for ${dataEce.contentDetails.topicId}`,
              socialImageLink: TopicImage ? TopicImage : ulternateImage,
            },
          },
        },
      });
      console.log('Firebase Dynamic Links API Response:', link.data);
      if (link.status === 200) {
        return link.data.shortLink;
      }
    } catch (error) {
      console.error('Error building dynamic link:', error);
      // Handle the error, show a message to the user, or perform appropriate actions.
      return null;
    }
  };

  const shareLink = async () => {
    try {
      const shareUrl = await buildLink();
      if (shareUrl) {
        const result = await Share.share({
          message: `Share your link ${shareUrl}`,
        });
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

  const [loadingImage, setLoadingImage] = useState(false);
  const handleLoad = () => {
    setBuffering(false);
  };
  const [progress, setProgress] = useState(null);

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
  // const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
  //   // console.log(
  //   //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
  //   // );
  // };
  // const [loadingImage, setLoadingImage] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  //  const [modalVisible, setModalVisible] = useState(false);
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
                  // justifyContent: 'center',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                  // width: 200,
                  alignSelf: 'center',
                },
              ]}>
              Congratulations!
            </Text>

            <Text
              style={{
                color: 'black',
                fontWeight: '800',
                color: '#666666',
                textTransform: 'capitalize',
                alignSelf: 'center',
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
      </Modal>
      <View style={{flex: 1, marginBottom: 6, backgroundColor: 'white'}}>
        {isLoading ? (
          // <ActivityIndicator
          //   size="large"
          //   color={Colors.primary}
          //   style={{justifyContent: 'center', alignSelf: 'center'}}
          // />
          <Loading />
        ) : (
          <>
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
                {topicName}
                {/* {eceHeading.map(x => x.header)} */}
              </Text>
            </View>
            <ScrollView>
              <View>
                <>
                  {pge?.length > 0 ? (
                    <>
                      {pge?.map((item, index) => {
                        return (
                          <View
                            style={{
                              padding: 5,
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
                                initialZoom={1} // Example: The image is
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
                                  // paddingBottom: 10,
                                  // paddingTop: 5,
                                  // top: '-15%',
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
                                    paddingTop: 20,
                                  }}>
                                  {isPlaying == false ? (
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
                                  paddingBottom: 30,
                                  backgroundColor: 'white',
                                  borderRadius: 10,
                                  // borderWidth: 1,
                                  // borderColor: Color.royalblue,
                                  // paddingTop: 20,
                                  paddingLeft: 20,
                                  paddingRight: 20,
                                  alignSelf: 'center',
                                  top: '-5%',
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
                                          alignSelf: 'center',
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
                                          //
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
                        {data?.completionStatus === true ? (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                              navigation.navigate('StudentsListActivity', {
                                // submoduleName: item.submoduleName,
                                topicId: topicId,
                                // subject: '',
                                // program: 'ece',
                                activityType: 'ece',
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
                                topicId: topicId,
                                topicName: topicName,
                                // subject: '',
                                // program: 'ece',
                                activityType: 'ece',
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

export default EcContent;

const styles = StyleSheet.create({
  button: {
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
  input: {
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.7,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
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
    width: 85,
    height: 20,
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

const eceHeading = [
  {key: 1, header: 'ମୁଁ ଓ ମୋ ପରିବାର'},
  {key: 2, header: 'ମୋ ଘର'},
  {key: 3, header: 'ବୃତ୍ତି/ବେଉସା'},
  {key: 4, header: 'ପଶୁପକ୍ଷୀ'},
  {key: 4, header: 'ଗଛ,ପତ୍ର, ଫୁଲ, ଫଳ'},
  {key: 5, header: 'ବିଭିନ୍ନ ଋତୁ'},
  {key: 6, header: 'ଯାନବାହନ'},
  {key: 7, header: 'ମୋ ପ୍ରାକୃତିକ ପରିବେଶ'},
  {key: 8, header: 'ମୋ ସାମାଜିକ ପରିବେଶ'},
  {key: 9, header: 'ମୋ ସ୍ୱାସ୍ଥ୍ୟ ଓ ସୁରକ୍ଷା'},
];
