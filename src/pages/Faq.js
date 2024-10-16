import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  BackHandler,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import {useFocusEffect} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
// import VideoPlayer from 'react-native-video-player';
import Api from '../environment/Api';
import Colors from '../utils/Colors';
import {FontFamily} from '../GlobalStyle';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';

const Faq = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [showContent, setShowContent] = useState([]);
  const [faqSections, setFaqSections] = useState([]);
  console.log('faqSections---->', faqSections);
  const [selectedSection, setSelectedSection] = useState('');
  console.log('selectedSection---->', selectedSection);
  const [loading, setLoading] = useState(false);
  const [questionArray, setQuestionArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const user = useSelector(state => state.UserSlice.user[0]);
  console.log('new_user', user);

  // Calculate responsive width based on screen width
  const {width: screenWidth} = Dimensions.get('window');
  const responsiveWidth = screenWidth * 0.9; // Adjust as needed

  // Calculate responsive height based on responsive width (assuming a 16:9 aspect ratio)
  const responsiveHeight = (responsiveWidth * 9) / 16; // Adjust aspect ratio as needed
  const toggleListItem = index => {
    const newShowContent = [...showContent];
    newShowContent[index] = !newShowContent[index];
    if (newShowContent[index]) {
      newShowContent.fill(false);
      newShowContent[index] = true;
    }
    setShowContent(newShowContent);
  };

  const animationController = useRef(new Animated.Value(0)).current;
  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      Api.get(`getAllFaqSection/${user?.usertype}`)
        .then(res => {
          if (res.status === 200) {
            setFaqSections(res.data);
            setSelectedSection(res.data[0]?.sectionId);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('Error:', error);
        });
    }, [user]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (selectedSection) {
        setIsLoading(true);
        Api.get(`getFaqSectionData/${user?.usertype}/${selectedSection}`)
          .then(res => {
            if (res.status === 200) {
              setQuestionArray(res.data);
              setShowContent(Array(res.data?.quizData?.length).fill(false));
              setIsLoading(false);
            } else {
              setIsLoading(false);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.error('Error:', error);
          });
      }
    }, [selectedSection, user]),
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleVideoLoad = () => {
    console.log('Video loaded');
    setVideoLoading(false);
    return true;
  };

  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : faqSections ? (
        <View>
          <ScrollView horizontal={true}>
            {faqSections.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSection(item.sectionId)}>
                <View
                  style={{
                    margin: 20,
                    padding: 10,
                    backgroundColor:
                      selectedSection === item.sectionId
                        ? Colors.royalblue
                        : 'white',
                    height: height * 0.146,
                    width: width * 0.4,
                    borderRadius: 13,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      top: '30%',
                      fontFamily: FontFamily.poppinsMedium,
                      color:
                        selectedSection === item.sectionId ? 'white' : 'black',
                    }}>
                    {item.sectionName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {isLoading ? (
            <ActivityIndicator size={50} color="blue" />
          ) : questionArray?.quizData?.length > 0 ? (
            <View
              style={{
                width: width * 0.9,
                backgroundColor: 'white',
                height: height * 0.619,
                margin: '5%',
                borderRadius: 12,
              }}>
              <ScrollView
                style={{
                  backgroundColor: 'white',
                  borderRadius: 6,
                  marginBottom: 10,
                }}>
                <View>
                  {questionArray?.quizData.length > 0 && (
                    <Text
                      style={{
                        fontFamily: FontFamily.poppinsMedium,
                        fontWeight: 'bold',
                        alignSelf: 'flex-start',
                        margin: '4%',
                      }}>
                      Top Questions
                    </Text>
                  )}
                  {questionArray?.quizData.map((qa, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        width: width * 0.86,
                        borderWidth: 0.5,
                        borderRadius: 5,
                        borderColor: 'grey',
                        marginBottom: '4%',
                        padding: 12,
                        left: '3%',
                        marginTop: '4%',
                      }}>
                      <TouchableOpacity
                        onPress={() => toggleListItem(index)}
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: '4%',
                        }}>
                        <Text style={styles.heading}>{qa.question}</Text>
                        <Animated.View
                          style={{transform: [{rotateZ: arrowTransform}]}}>
                          <Entypo
                            name={showContent[index] ? 'minus' : 'plus'}
                            size={25}
                            color="red"
                          />
                        </Animated.View>
                      </TouchableOpacity>
                      {showContent[index] && (
                        <View style={{marginTop: 10}}>
                          {qa.answerType === 'text' && (
                            <Text style={styles.answers}>{qa.answer}</Text>
                          )}
                          {/* {qa.answerType === 'videoInput' && (
                            <View>
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
                                video={{uri: `${qa?.answer}`}}
                                //video={{uri: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}}
                                style={{
                                  width: '100%',
                                  height: 300,
                                }}
                                autoplay
                                pauseOnPress
                                onLoad={handleVideoLoad}
                              />
                            </View>
                          )} */}
                          {qa.answerType === 'image' && (
                            <Image
                              source={{uri: qa.answer}}
                              style={styles.image}
                            />
                          )}

                          {qa?.answerType === 'youtube' && (
                            <YouTube
                              videoId={qa?.answer}
                              width={responsiveWidth}
                              height={responsiveHeight}
                              // play={index === focusedIndex}
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
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <Image
              source={require('../assets/Image/Group76686.png')}
              style={{
                width: width * 0.99,
                height: width * 0.99,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
      ) : (
        <Nocontents />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FontFamily.poppinsMedium,
    marginLeft: '2%',
    width: '90%',
  },
  answers: {
    color: 'grey',
    fontSize: 13,
    fontFamily: FontFamily.poppinsMedium,
    margin: '5%',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
});

export default Faq;
