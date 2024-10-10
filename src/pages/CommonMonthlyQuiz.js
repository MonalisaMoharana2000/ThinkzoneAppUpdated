import React from 'react';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  Text,
  View,
  BackHandler,
  Modal,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import NewQuizTemplate from '../components/NewQuizTemplate';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Api from '../environment/Api';
import {useState, useCallback} from 'react';
import Quiz from '../components/Quiz';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import NewQuiz from '../components/NewQuiz';
import Norecord from '../components/Norecord';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {FontFamily, Color} from '../GlobalStyle';
import {app_versions} from './Home';
const CommonMonthlyQuiz = ({route, navigation}) => {
  const data_quiz = route.params.data;
  console.log('data_quiz--->', data_quiz);

  const {topicId, topicName} = data_quiz;
  console.log('data_quiz--->', data_quiz, topicId);
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log('user--->', user);
  const {userid, username} = user[0];
  const [topicQuizData, setTopicQuizData] = useState([]);
  const [modal, setModal] = useState(false);
  const [quizModal, setQuizModal] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );
  const [isLoading, setIsLoading] = useState(false);
  console.log('topicQuizData--->', topicQuizData);
  const [checkUrl, setCheckUrl] = useState([]);
  //fOR IMAGE UPLOAD
  const [imageUrls, setImageUrls] = useState({});
  console.log('imageUrls--->', imageUrls);

  const [successModal, setSuccessModal] = useState(false);
  const [modalMark, setModalMark] = useState('');

  const handleImageSelected = (image, questionId) => {
    setImageUrls(prevImageUrls => ({
      ...prevImageUrls,
      [questionId]: image,
      answered: 'yes',
    }));
    console.log('check--->', image, questionId);
    setTopicQuizData(prevData => {
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
  useEffect(() => {
    setIsLoading(true);
    Api.get(`getMasterTtlQuizQuestions/${user[0].usertype}/od/${topicId}`).then(
      response => {
        // console.log('response---->', response.data);
        setTopicQuizData(response.data[0]?.quizData);
        setIsLoading(false);
      },
    );
  }, []);
  const backs = () => {
    setSuccessModal(true);
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
    setSuccessModal(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const backAction = () => {
        // setModal(true);

        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
          'ଆପଣ ଏହି ମଡ୍ୟୁଲ୍ ଛାଡିବାକୁ ଚାହୁଁଛନ୍ତି କି?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'default',
            },
            {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
          ],
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  // const handleBackButton = () => {
  //   if (quizModal) {
  //     setQuizModal(false);
  //     return true; // Prevent default back button behavior
  //   }
  //   return false; // Allow default back button behavior
  // };

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
        {text: 'Ok', onPress: () => handleDelete(), style: 'default'},
      ],
    );
  };

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  //   };
  // }, []);

  //For TextInput Starts
  const handleAnswerChange = useCallback(
    (questionOrder, newAnswer) => {
      console.log('index, newAnswer----->', questionOrder, newAnswer);
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

  //For OPtional Question i.e 4,3,2 Options starts
  const handleOptionSelect = (questionId, selectedOption) => {
    console.log('selected OPtion:', questionId, selectedOption);
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
    console.log('check----->', questionId, selectedOption);
    setTopicQuizData(prevData => {
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

  //For AUDIO rECORDS s3 url starts

  const closeModals = (url, questionId, keys) => {
    console.log('check url----->', url, questionId, keys);
    setCheckUrl(keys);
    setTopicQuizData(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  //Fot Audio Records s3 url ends
  let quiz2PassMark;

  const azureUpload = async (uploadResult, questionId) => {
    console.log('uploadResult======>', uploadResult);
    console.log('questionId==========>', questionId);
    setTopicQuizData(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: uploadResult}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  const onend_quiz = async () => {
    const checkDataLengthOption = topicQuizData.filter(
      x => x.selectedOption?.length,
    );
    const checkDataLengthAnswer = topicQuizData.filter(x => x.answer?.length);

    if (
      topicQuizData.length ===
      checkDataLengthOption.length + checkDataLengthAnswer.length
    ) {
      const quiz1Marks = topicQuizData.filter(item => {
        if (
          item.correctOption?.length !== 0 &&
          item.correctOption?.length === item.selectedOption?.length &&
          item.correctOption.every(option =>
            item.selectedOption.includes(option),
          )
        ) {
          return true;
        }
        return false;
      });

      quiz2PassMark = Math.floor(
        (quiz1Marks.length / checkDataLengthOption.length) * 100,
      );

      console.log('quiz2PassMark-------->', quiz2PassMark, 60, 80, 100);
      setModalMark(quiz2PassMark);

      const data2 = {
        totalMarks: checkDataLengthOption.length,
        topicId,
        topicName,
        module: 'teacher',
        quizData: topicQuizData,
        securedMarks: quiz1Marks.length,
        userid,
        appVersion: app_versions,
        answered: 'yes',
      };

      console.log(data2, 'data2------------->');
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

      if (confirmSubmit) {
        // if ([60, 80, 100].includes(quiz2PassMark)) {
        //   Alert.alert(`You have Scored ${quiz2PassMark}%`, '', [
        //     {
        //       text: 'Ok',
        //       onPress: () => backs(),
        //       style: 'default',
        //     },
        //   ]);
        // }

        try {
          const response = await Api.post(`saveTransTtlQuizData`, data2);
          console.log(
            'check response-------->',
            response,
            response.data,
            response.status,
          );
          if (response.status === 200) {
            if ([60, 80, 100].includes(quiz2PassMark)) {
              Alert.alert(`You have Scored ${quiz2PassMark}%`, '', [
                {
                  text: 'Ok',
                  onPress: () => backs(),
                  style: 'default',
                },
              ]);
            } else {
              Alert.alert(`Quiz Submitted Successfully`, '', [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                  style: 'default',
                },
              ]);
            }
          } else {
            Alert.alert('Something went wrong', 'Please try again later', [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          }
        } catch (error) {
          if (error.response.status === 500) {
            Alert.alert('Something went wrong', 'Please try again later', [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          } else {
            navigation.goBack();
            // Alert.alert(`You have Scored ${quiz2PassMark}%`, [
            //   {
            //     text: 'Ok',
            //     onPress: () => backs(),
            //     style: 'default',
            //   },
            // ]);
          }
        }
      }
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', [
        {text: 'OK', onPress: () => null},
      ]);
    }
  };

  //S3 url delete from bucket
  const handleDelete = async () => {
    navigation.goBack();
    // const body = {Key: checkUrl};
    const body = {Key: checkUrl};
    var newArray = [];
    newArray.push(body);

    console.log(
      'delete response-------->',
      body,
      newArray,
      typeof newArray,
      Array.isArray(newArray),
    );
    try {
      const response = await Api.post(`s3api/doDeleteMultiple`, newArray);
      console.log('delete response2-------->', response.data);
      // Api.post(`s3api/doDeleteMultiple`, newArray).then(response => {
      //   console.log('delete response2-------->', response.data);
      // });
    } catch (error) {
      if (error.response.status === 504) {
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  return (
    <View>
      {isLoading ? (
        // <ActivityIndicator
        //   size="large"
        //   color={Colors.primary}
        //   style={{justifyContent: 'center', alignSelf: 'center'}}
        // />
        <Loading />
      ) : topicQuizData?.length > 0 ? (
        <>
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
                  କରିଛନ୍ତି ଏବଂ{' '}
                  {modalMark === 60 && (
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>୨</Text>
                  )}
                  {modalMark === 80 && (
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>୪</Text>
                  )}
                  {modalMark === 100 && (
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>୬</Text>
                  )}{' '}
                  ଟି କଏନ ହାସଲ କରିଛନ୍ତି ।
                </Text>
                <TouchableOpacity
                  // onPress={() =>
                  //   navigation.navigate('myachievement', {
                  //     type: 'myachievement',
                  //   })
                  // }
                  onPress={() => setSuccessModal(false)}
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
                    Check Reward
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSuccessModal(false)}
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
                    Skip for now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => back()}
            visible={quizModal}>
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
                {/* <View style={{alignSelf: 'center', right: '27%'}}>
                <NewQuiz
                  questions={topicQuizData}
                  onend_quiz={onend_quiz}
                  navigation={navigation}
                />
              </View> */}
                <View style={{alignSelf: 'center', right: '27%'}}>
                  <View
                    style={{
                      backgroundColor: '#0060ca',
                      // height: 66,
                      width: window.WindowWidth * 1.1,
                      // marginTop: -19
                      marginTop: -37,
                      // marginLeft: -20,
                      paddingBottom: 20,
                      alignSelf: 'flex-start',
                      left: '27%',
                      flexDirection: 'row',
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
                        style={{left: '152%', marginTop: 22}}
                        color="white"
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 18,
                        marginTop: 15,
                        alignSelf: 'flex-start',
                        left: '95%',
                        top: 5,
                        width: 320,
                      }}>
                      {topicName.toUpperCase()}
                      {/* {eceHeading.map(x => x.header)} */}
                    </Text>
                  </View>
                  <NewQuizTemplate
                    azureUpload={azureUpload}
                    handleSaveAssessment={onend_quiz}
                    topicQuizData={topicQuizData}
                    handleAnswerChange={handleAnswerChange}
                    handleOptionSelect={handleOptionSelect}
                    closeModal={closeModals}
                    handleOptionSelectMulti={handleOptionSelectMulti}
                    imageUrl={imageUrls}
                    onImageSelected={handleImageSelected}
                  />
                </View>
              </View>
            </View>
            {/* </View> */}
          </Modal>
        </>
      ) : (
        <Nocontents />
      )}
    </View>
  );
};

export default CommonMonthlyQuiz;

const styles = StyleSheet.create({
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
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
});
