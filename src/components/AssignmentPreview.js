import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
  BackHandler,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import API from '../environment/Api';
import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import Color from '../utils/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../utils/Colors';
import ErrorMessage from '../components/ErrorMessage';
import ButtomSheet from '../components/BottomSheet';
import Feather from 'react-native-vector-icons/Feather';
import Modals from '../components/Modals';
import {Buffer} from 'buffer';
import * as window from '../utils/dimensions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '@env';
// import AWS from 'aws-sdk';
import Loading from './Loading';
import {FontFamily} from '../GlobalStyle';
import {log} from 'console';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-controls';

const audioPlayer = new AudioRecorderPlayer();

// AWS.config.update({
//   region: REGION,
//   accessKeyId: ACCESS_KEY,
//   secretAccessKey: SECRET_ACCESS_KEY,
// });
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AssignmentPreview = ({navigation, route}) => {
  console.log('AssignmentPreview route--->', route);
  const data = route?.params?.data;
  console.log('data--->', data);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const modalHeight = window.WindowHeigth * 0.3;
  const user = useSelector(state => state.userdata.user.resData);
  const [multipleFile, setMultipleFile] = useState([]);
  const [error, setError] = useState(false);
  const [customModal, setCustomModal] = useState(true);
  const [link, setLink] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [previewAssignment, setPreviewAssignment] = useState({});
  console.log('previewAssignment', previewAssignment);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // const linkss = previewAssignment?.answer; // Assuming previewAssignment?.answer contains the link
  // console.log('li');
  // const concatenatedLink = `https://tzeducdn.azureedge.net/tzeducontainer/${linkss
  //   .split('/')
  //   .pop()}`;

  // console.log('linksss', concatenatedLink);

  console.log('input----->', input);
  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  // Inside your component
  const scale = useSharedValue(1);

  const onZoomEvent = useAnimatedGestureHandler({
    onActive: event => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  useEffect(() => {
    setLoading(true);
    const PreviewData = async () => {
      try {
        const response = await API.get(
          `getPreviewTchTrainingAssignment/${user[0]?.userid}/${data?.topicId}`,
        );
        console.log('PreviewData', response.data);
        setPreviewAssignment(response.data);
        setLoading(false);
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
    };
    PreviewData();
  }, []);
  console.log('previewAssignment?.length', previewAssignment);

  const startPlayback = async item => {
    try {
      const path = item; // Replace with the actual audio file path
      await audioPlayer.startPlayer(path);
      setIsPlaying(true);
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

  useEffect(() => {
    audioPlayer.setSubscriptionDuration(0.1);
    audioPlayer.addPlayBackListener(({current_position, duration}) => {
      // setProgress(current_position);
      // setDuration(duration);
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

  const handleVideoLoad = () => {
    console.log('==================================== video loaded');
    setVideoLoading(false);
    return true;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  //todo--------------------Console logs----------------------------
  console.log('previewAssignment------------------->', previewAssignment);

  return (
    <ScrollView style={{height: '100%', paddingBottom: 50}}>
      <View
        style={{
          backgroundColor: '#0060ca',
          height: 68,
          width: window.WindowWidth * 1.1,
          marginTop: -16,
          marginLeft: -1,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            marginTop: 25,
            marginLeft: 25,
            // textAlign: 'center',
          }}>
          Assignment Preview
        </Text>
      </View>
      <ImageBackground
        style={[styles.root, {paddingBottom: 50}]}
        source={require('../assets/Photos/assignmentbg.jpg')}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          style={{flex: 1}}>
          {loading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Loading />
            </View>
          ) : previewAssignment ? (
            <>
              <View style={styles.styleBoxl}>
                <ScrollView>
                  <Text
                    style={{
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: 18,
                      color: 'black',
                      letterSpacing: 1,
                      fontWeight: '600',
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginLeft: 7,
                    }}>
                    ପ୍ରଶ୍ନ:{previewAssignment?.question}
                  </Text>
                </ScrollView>
              </View>
              <View
                style={{
                  // marginTop: 20,
                  borderRadius: 20,
                  width: '90%',
                  alignSelf: 'center',
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    alignSelf: 'center',
                    fontSize: 18,
                    paddingBottom: 5,
                    paddingTop: 5,
                    fontFamily: FontFamily.poppinsMedium,
                    fontWeight: '800',
                  }}>
                  ଉତ୍ତର:
                </Text>
                {previewAssignment?.answerType === 'textInput' ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: 'gray',
                      padding: 10,
                      margin: 7,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'sans-serif',
                        color: 'black',
                        letterSpacing: 1,
                        fontWeight: '600',
                      }}>
                      {previewAssignment?.answer}
                    </Text>
                  </View>
                ) : previewAssignment?.answerType === 'imageInput' ? (
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      margin: 10,
                      borderRadius: 14,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      marginVertical: 10,
                      // overflow: '', // Clip the shadow to prevent it from being cut off
                    }}>
                    <PinchGestureHandler onGestureEvent={onZoomEvent}>
                      <Animated.View>
                        {isLoading && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                          </View>
                        )}
                        <AnimatedImage
                          source={{uri: previewAssignment?.answer}}
                          style={[
                            {
                              width: windowWidth * 0.8,
                              aspectRatio: 1,
                              borderRadius: 10,
                            },
                            animatedStyle,
                          ]}
                          resizeMode="contain"
                          onLoad={() => {
                            handleImageLoad;
                          }}
                          loadingIndicatorSource={require('../assets/Image/loaderimage.png')}
                        />
                      </Animated.View>
                    </PinchGestureHandler>
                  </View>
                ) : previewAssignment?.answerType === 'audioInput' ? (
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 5,
                      margin: 5,
                      borderRadius: 14,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      marginVertical: 10,
                      // overflow: '', // Clip the shadow to prevent it from being cut off
                    }}>
                    <View
                      style={{
                        // paddingBottom: 10,
                        // paddingTop: 5,
                        // top: '-15%',
                        alignSelf: 'center',
                      }}>
                      <View
                        style={{
                          width: window.WindowWidth * 0.8,
                          paddingBottom: 10,
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
                              startPlayback(previewAssignment?.answer, 'play')
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
                                stopPlayback(previewAssignment?.answer, 'stop')
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
                  </View>
                ) : previewAssignment?.answerType === 'videoInput' ? (
                  <ScrollView
                    style={{
                      backgroundColor: 'white',
                      width: window.WindowWidth * 0.89,
                      padding: 5,
                      margin: 5,
                      borderRadius: 14,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      marginVertical: 10,
                      // overflow: '', // Clip the shadow to prevent it from being cut off
                    }}>
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
                          uri: `${previewAssignment?.answer}`,
                          // uri: `https://tzeducdn.azureedge.net/tzeducontainer/${previewAssignment?.answer
                          //   ?.split('/')
                          //   .pop()}`,
                          // uri: `https://tzeducdn.azureedge.net/tzeducontainer/bigvid.mp4`,
                          // uri: `https://tzeducdn.azureedge.net/thinkzonecontainer/VID-20240523-WA0001.mp4`,
                        }}
                        style={{
                          width: '100%',
                          height: 300,
                        }}
                        autoplay
                        // duration={handleVideoLoad}
                        pauseOnPress={true}
                        // controls
                        showDuration
                        onLoad={() => {
                          console.log('xxxxxxxxxxxxxxx onload');
                          handleVideoLoad;
                        }}
                      />
                      {/* <VLCPlayer
                        style={{width: '100%', height: 300}}
                        videoAspectRatio="16:9"
                        source={{
                          uri: `${previewAssignment?.answer}`,
                        }}
                      /> */}
                      {/* <TouchableOpacity>
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
                      </TouchableOpacity> */}
                    </View>
                  </ScrollView>
                ) : null}
              </View>
            </>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.outerContainer}>
                <View style={styles.container}>
                  <Image
                    source={require('../assets/Image/Group76686.png')}
                    style={styles.image}
                  />
                  <View style={styles.blankSpace} />
                </View>
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
};

export default AssignmentPreview;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 10,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 75,
    alignSelf: 'center',
  },

  cameraicon: {
    paddingLeft: 252,
    marginTop: -33,
    paddingLeft: 219,
    // backgroundColor:Color.white,
    // height: 150,
    // marginTop:-100,
    // paddingLeft:12
  },
  modalContainer: {
    height: window.WindowHeigth * 0.3,
    backgroundColor: Color.white,
    elevation: 5,
    // width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  styleBoxl: {
    borderWidth: 2,
    borderRadius: 20,
    width: window.WindowWidth * 0.9,
    // height: window.WindowHeigth * 0.3,
    alignSelf: 'center',
    overflow: 'scroll',
    marginTop: 30,
    padding: 5,
    margin: 5,
    // alignItems: 'baseline',
  },
  styleBoxs: {
    borderWidth: 2,
    borderRadius: 20,
    width: window.WindowWidth * 0.9,
    marginTop: 50,
    alignItems: 'baseline',
    marginLeft: 18,
  },
  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  modalButtonText: {
    fontSize: 13,
    color: Color.black,
  },
  name: {
    backgroundColor: 'white',
    marginTop: -10,
    marginBottom: 14,
    paddingLeft: 70,
    fontSize: 22,
    fontWeight: 'bold',
    borderRadius: 12,
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 70,
    marginBottom: 12,
    backgroundColor: Color.primary,
  },
  input: {
    height: 80,
    width: window.WindowWidth * 0.9,
    margin: 12,
    borderWidth: 1,
    paddingLeft: 15,
    fontSize: 18,
    // marginBottom: 25,
    // height: 52,
    borderBottomWidth: 1,
    textAlignVertical: 'top',
    borderRadius: 12,
    alignSelf: 'center',
    top: '20%',
    // position: 'absolute',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    marginLeft: 30,
    // paddingLeft: 5,
  },
  wrapper: {
    borderWidth: 1,
    height: 52,
    marginTop: -13,
    marginLeft: 22,
    marginRight: 20,
    marginBottom: 45,
    borderRadius: 12,
    paddingLeft: 15,
    // borderBottomWidth: 1,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
    marginLeft: 15,
    fontFamily: 'serif',
  },
  root: {
    width: window.WindowWidth,
    height: window.WindowHeigth * 1.1,
    // display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  buttonText: {
    width: window.WindowWidth * 0.8,
    height: window.WindowHeigth * 0.06,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,
    fontSize: 24,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    // marginTop: 30,
    marginLeft: 25,
    margin: 60,
    fontWeight: 'bold',
  },
  editFormContainer: {
    marginHorizontal: 13,
    marginVertical: 59,
    borderRadius: 8,
    marginLeft: 120,
    marginRight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.white,
    // marginRight: 100,
    // borderTopLeftRadius: 70,
  },
  editImageIconContainer: {
    // backgroundColor: 'black',
  },
  container: {
    flex: 1,
    paddingTop: (windowHeight * 0.3) / 2, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.ghostwhite, // Change this background color if needed
  },
  image: {
    width: windowWidth * 0.8, // Adjust as needed
    height: windowWidth * 0.99, // Maintain the aspect ratio
    marginBottom: 200,
  },
  text: {
    color: '#595F65',
    fontSize: 16,
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // input: {
  //   height: 60,
  //   width: window.WindowWidth * 0.83,
  //   borderWidth: 1,
  //   borderRadius: 12,
  //   textAlignVertical: 'top', // Aligns text to the top
  //   paddingLeft: 10,
  //   // position: 'absolute',
  //   top: '50%',
  //   padding: 20,
  //   margin: 20,

  //   alignSelf: 'center',
  // },
});
