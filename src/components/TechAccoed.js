import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import * as window from '../utils/dimensions';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import Colors from '../utils/Colors';
import ColorName from '../utils/ColorName';
import * as SIZES from '../utils/dimensions';
import API from '../environment/Api';

import {Avatar, Provider as PaperProvider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useSelector, useDispatch} from 'react-redux';
import {List} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ProgressBar from './ProgressBar';
import {useEffect} from 'react';
import {Color, FontFamily} from '../GlobalStyle';
import Modals from '../components/Modals';
// import Colors from '../utils/Colors';

const TechAccoed = ({
  onPress,
  userSubModule,
  subModules,
  navigation,
  training_type,
  route,
}) => {
  const [customModal, setCustomModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  let contentDetails = useSelector(state => state.techdata.techsubmodule);
  // console.log('====================================', contentDetails);

  let userContentDetails = useSelector(
    state => state.trainingdataNew.userTraingDetails,
  );
  // const users = useSelector(state => state.sdata.s?.resData);

  const [scontentDetails, setUsercontentDetails] = useState([]);

  useEffect(() => {
    const newArr = contentDetails.map(item => {
      const d = item.topicData.map(item1 => {
        const neData = userContentDetails.find(
          item2 => item2?.topicid === item1.topicid,
        );
        // console.log('neData----->', neData);
        return {
          ...item1,
          ...neData,
        };
      });
      let count = 0;
      d.map(item2 => {
        // console.log(item2, 'item1');
        if (item2.topic_percentage == '100%') {
          count += 1;
        }
      });

      return {
        ...item,
        completed_topic: count,
        dat: d,
      };
    });

    setUsercontentDetails(newArr);
  }, [contentDetails, userContentDetails]);

  // const user = useSelector(state => state.userdata.user);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [subModulesdata, setSubModulesData] = useState([]);
  const [language, setLanguage] = useState('od');
  const [topicIndex, setTopicIndex] = useState(null);
  const user = useSelector(state => state.userdata.user?.resData);

  // const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  const topicClicked = (topic, item, c_type) => {
    // setIsLoading(true);

    if (c_type === 'assignment') {
      if (item.contentStatus === 'incomplete') {
        Alert.alert('info', 'ଦୟାକରି Content ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ ।', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        // navigation.navigate('techAssignment', {
        //   data_type: c_type,
        //   data: topic,
        //   whole_data: item,
        // });
      } else {
        navigation.navigate('techAssignment', {
          data_type: c_type,
          data: topic,
          whole_data: item,
        });
      }
    } else {
      if (c_type === 'quiz1') {
        navigation.navigate('techcontent', {
          data: topic,
          whole_data: item,
          data_type: c_type,
        });
      } else if (c_type === 'content') {
        if (item.quiz1Status === 'incomplete') {
          Alert.alert('info', 'ଦୟାକରି ପୂର୍ବ ଜ୍ଞାନ ପରୀକ୍ଷା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          // navigation.navigate('techcontent', {
          //   data_type: c_type,
          //   data: topic,
          //   whole_data: item,
          // });
        } else {
          navigation.navigate('techcontent', {
            data_type: c_type,
            data: topic,
            whole_data: item,
          });
          // console.log(c_type, 'c_type--------');
          // console.log(data, 'topic--------');
          // console.log(whole_data, 'item--------');
        }
      } else if (c_type === 'quiz2') {
        if (item.assignmentStatus === 'incomplete') {
          Alert.alert('info', 'ଦୟାକରି Assignment ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          // navigation.navigate('techcontent', {
          //   data: topic,
          //   whole_data: item,
          //   data_type: c_type,
          // });
        } else {
          navigation.navigate('techcontent', {
            data: topic,
            whole_data: item,
            data_type: c_type,
          });
        }
      }
    }
  };
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  const handleToNextTopic = (topic, item, c_type) => {
    // console.log('nexttopic1----->', topic);
    // console.log('nexttopic2----->', item);
    // console.log('nexttopic3----->', c_type);

    if (c_type === 'quiz2' && item.quiz2Status === 'complete') {
      const nextIncompleteTopic = topic.topicData.find(
        topics => topics.quiz1Status === 'incomplete',
      );

      const currentIndex = topic.topicData.findIndex(topics => topics === item);
      // console.log('nextIncompleteTopic---->', currentIndex);

      if (currentIndex !== -1 && currentIndex < topic.topicData.length - 1) {
        const nextTopic = topic.topicData[currentIndex + 1];
        console.log('nextTopic---->', nextTopic);
        if (nextTopic.quiz1Status === 'incomplete') {
          navigation.navigate('techcontent', {
            data_type: 'quiz1',
            data: item,
            whole_data: nextTopic,
          });
        } else {
          // This is the last topic, show a different alert
          Alert.alert('', 'This is the last topic!', [
            {
              text: 'OK',
            },
          ]);
        }
      }

      // if (nextIncompleteTopic) {
    }
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [status, setstatus] = useState([]);
  // useEffect(() => {
  //   API.get(
  //     `getAllModulesWithMarks/${user[0].userid}/${user[0].usertype}/${moduleType}/od`,
  //   ).then(
  //     response => {
  //       setstatus(response.data);
  //       console.log('set=================>', setstatus);
  //       // setIsloading(false);
  //     },
  //     err => {
  //       //
  //     },
  //   );
  // }, []);
  // useFocusEffect(
  //   React.useCallback(topic => {
  //     // Reset the accordion state when the component is focused
  //     setCurrentIndex(topic);
  //     setTopicIndex(topic);

  //     return index => {};
  //   }, []),
  // );
  // React.useEffect(() => {
  //   // Check if the route has a state indicating the opened accordion index
  //   const persistedIndex = route.params?.openedIndex;

  //   if (persistedIndex !== undefined) {
  //     setCurrentIndex(persistedIndex);
  //   }
  // }, [route.params?.openedIndex]);

  // const handleAccordionPress = (index) => {
  //   setCurrentIndex((prevIndex) => (prevIndex === index ? null : index));
  //   // Persist the opened accordion index in the navigation state
  //   navigation.setParams({ openedIndex: index });
  // };
  React.useEffect(() => {
    // Check if the route object and its params property exist
    if (route && route.params) {
      // Check if the route has a state indicating the opened accordion index
      const persistedIndex = route.params.openedIndex;

      if (persistedIndex !== undefined) {
        setCurrentIndex(persistedIndex);
      }
    }
  }, [route]);

  const handleAccordionPress = index => {
    setCurrentIndex(prevIndex => (prevIndex === index ? null : index));
    // Persist the opened accordion index in the navigation state
    navigation.setParams({openedIndex: index});
  };
  return (
    <>
      <ScrollView style={styles.container}>
        {contentDetails?.map((item, index) => {
          console.log('contentitem------>', item.topicData);
          return (
            <View style={styles.cardContainer}>
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  setCurrentIndex(index === currentIndex ? null : index);
                }}>
                <View style={styles.card}>
                  <View style={[styles.subModuContainer]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.subModule}>{item.submoduleName}</Text>
                      {/* {item.submoduleIsComplete === false && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Certificate', {
                              submoduleName: item.submoduleName,
                              submoduleId: item.submoduleId,
                            })
                          }>
                          <Image
                            style={{width: 40, height: 40, marginLeft: 10}}
                            source={require('../assets/Image/certificate5.png')}
                          />
                        </TouchableOpacity>
                      )} */}
                    </View>
                    <View style={{marginTop: 10}}>
                      {/* <ProgressBar
                        total={100}
                        complete={item.completedTopicsCount}
                      /> */}
                    </View>
                    {/* <ProgressBar
                      total={item?.topicData?.length}
                      complete={item.completedTopicsCount}
                    /> */}
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Image
                        style={{width: 20, height: 20}}
                        source={require('../assets/Image/timers.png')}
                      />
                      <Text style={styles.subModuleTopic}>
                        {/* {item.submoduleDuration} min */}
                        {item.submoduleDuration} mins
                      </Text>
                      {/* <Image
                        style={{width: 20, height: 20, marginLeft: 10}}
                        source={require('../assets/Image/bookss.png')}
                      /> */}
                      {/* <Text style={[styles.subModuleTopic, {left: 5}]}>
                      
                        {item.dat.length} Chapters
                      </Text> */}
                      <Image
                        style={{width: 20, height: 20, marginLeft: 10}}
                        source={require('../assets/Image/coins.png')}
                      />
                      <Text style={styles.subModuleTopic}>
                        {/* {item.submoduleDuration} min */}
                        {/* {item.submoduleDuration}  */}
                        {item.submoduleCoins} coins
                      </Text>
                    </View>
                  </View>

                  <AntDesign name="circledown" size={25} color={Colors.black} />
                </View>
              </TouchableOpacity>

              {index === currentIndex && (
                // console.log('check index--------->', index, currentIndex),
                <View style={styles.topic}>
                  {item.topicData.map(
                    (topic, toicindex) => (
                      console.log('topic---->', topic),
                      (
                        <View
                          style={[
                            {
                              width: '100%',
                              // height: 40,
                              padding: 10,
                              borderRadius: 10,
                              // backgroundColor: Colors.whiteShade,
                              borderColor: Color.ghostwhite,
                              borderWidth: 3,
                              marginBottom: 2.5,
                              // alignItems: 'center',

                              justifyContent: 'center',
                            },
                            styles.topicBox,
                            {
                              // backgroundColor:
                              //   topic.topicIsComplete == false
                              //     ? Color.royalblue // Completed topic background color
                              //     : Color.whiteShade, // Incomplete topic background color
                            },
                          ]}
                          key={topic._id}>
                          {/* <TouchableOpacity onPress={() => topicClicked(topic)}> */}

                          <TouchableOpacity
                            style={{flexDirection: 'row'}}
                            onPress={() =>
                              setTopicIndex(
                                toicindex === topicIndex ? null : toicindex,
                              )
                            }>
                            <Text
                              style={[
                                styles.tpoicText,
                                // {
                                //   backgroundColor:
                                //     topic.topicIsComplete == false
                                //       ? Color.royalblue // Completed topic background color
                                //       : Color.whiteShade, // Incomplete topic background color
                                //   color:
                                //     topic.topicIsComplete == false
                                //       ? Color.ghostwhite // Completed topic background color
                                //       : Color.textPrimary,
                                // },
                              ]}
                              key={topic._id}>
                              {topic.topicName}
                            </Text>
                            {topic.topicIsComplete === true ? (
                              // <View
                              //   style={{
                              //     top: 0,
                              //     left: '55%',

                              //     width: 80,

                              //     backgroundColor: Color.royalblue,

                              //     borderRadius: 5,
                              //     // padding: 3,
                              //     height: 22,
                              //   }}>
                              //   <Text
                              //     style={{
                              //       fontSize: 11,
                              //       color: 'white',

                              //       textTransform: 'capitalize',
                              //       top: '10%',
                              //       fontFamily: FontFamily.poppinsMedium,

                              //       fontWeight: '900',
                              //       textAlign: 'center',
                              //     }}>
                              //     completed
                              //   </Text>
                              // </View>
                              <Image
                                style={{
                                  marginLeft: 5,
                                  top: -1,
                                  width: 22,
                                  height: 22,
                                }}
                                source={require('../assets/Image/tick-circle.png')}
                              />
                            ) : null}

                            {topic.topic_percentage == '100%' ? (
                              <View>
                                <Ionicons
                                  name="checkmark-done-circle"
                                  color={Colors.success}
                                  size={22}
                                />
                                <Text>
                                  {topic.score}/{topic.totalmark}
                                </Text>
                              </View>
                            ) : (
                              <></>
                            )}
                          </TouchableOpacity>

                          {toicindex === topicIndex && (
                            //   console.log(
                            //   'check topic index--------->',
                            //   toicindex,
                            //   topicIndex,
                            // ),
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                marginTop: 15,
                                padding: 7,
                              }}>
                              {topic.quiz1Status == 'complete' ? (
                                (console.log('topic review---->', topic),
                                (
                                  <View
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: Color.royalblue,
                                      },
                                    ]}>
                                    <TouchableOpacity
                                      style={{flexDirection: 'row'}}
                                      onPress={() =>
                                        navigation.navigate('reviewquiz', {
                                          data: topic,
                                          data_type: 'quiz1',
                                        })
                                      }
                                      // onPress={() =>
                                      //   ToastAndroid.show(
                                      //     'Quiz Review under development. ',
                                      //     ToastAndroid.SHORT,
                                      //   )
                                      // }
                                    >
                                      <Text style={{color: 'white'}}>
                                        ପୂର୍ବ ଜ୍ଞାନ ପରୀକ୍ଷା
                                      </Text>
                                      <Image
                                        style={{
                                          marginLeft: 10,
                                          width: 24,
                                          height: 19.8,
                                        }}
                                        source={require('../assets/Image/done.png')}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ))
                              ) : (
                                <View style={styles.conquiz}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'quiz1')
                                    }>
                                    <Text style={{color: 'black'}}>
                                      ପୂର୍ବ ଜ୍ଞାନ ପରୀକ୍ଷା
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}

                              {topic.contentStatus == 'complete' ? (
                                <View
                                  style={[
                                    styles.conquiz,
                                    {
                                      backgroundColor: Color.royalblue,
                                    },
                                  ]}>
                                  {item.topicData.quiz1Status ===
                                    'incomplete' && (
                                    <Modals
                                      visible={customModal}
                                      heading={
                                        'Please Complete the content or quiz1.'
                                      }
                                      backgroundColor={Colors.white}
                                      onpressok={closeModal}
                                      okstatus={true}
                                    />
                                  )}
                                  <TouchableOpacity
                                    style={{flexDirection: 'row'}}
                                    onPress={() =>
                                      topicClicked(item, topic, 'content')
                                    }>
                                    <Text style={{color: 'white'}}>
                                      Content
                                    </Text>
                                    <Image
                                      style={{
                                        marginLeft: 10,
                                        width: 24,
                                        height: 19.8,
                                      }}
                                      source={require('../assets/Image/done.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View style={styles.conquiz}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'content')
                                    }>
                                    <Text style={{color: 'black'}}>
                                      Content
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}

                              {topic.assignmentStatus == 'complete' ? (
                                <View
                                  style={[
                                    styles.conquiz,
                                    {
                                      backgroundColor: Color.royalblue,
                                    },
                                  ]}>
                                  <TouchableOpacity
                                    style={{flexDirection: 'row'}}
                                    onPress={() => null}>
                                    <Text style={{color: 'white'}}>
                                      Assignment
                                    </Text>
                                    <Image
                                      style={{
                                        marginLeft: 10,
                                        width: 24,
                                        height: 19.8,
                                      }}
                                      source={require('../assets/Image/done.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View style={styles.conquiz}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'assignment')
                                    }>
                                    <Text style={{color: 'black'}}>
                                      Assignment
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                              {topic.quiz2Status == 'complete' ? (
                                <View
                                  style={[
                                    styles.conquiz,
                                    {
                                      backgroundColor: Color.royalblue,
                                    },
                                  ]}>
                                  <TouchableOpacity
                                    style={{flexDirection: 'row'}}
                                    // onPress={() =>
                                    //   navigation.navigate('reviewquiztech', {
                                    //     data: topic,
                                    //     data_type: 'quiz2',
                                    //   })
                                    // }
                                    onPress={() => {
                                      navigation.navigate('reviewquiz', {
                                        data: topic,
                                        data_type: 'quiz2',
                                      });
                                    }}

                                    // onPress={() =>
                                    //   ToastAndroid.show(
                                    //     'Quiz Review under development. ',
                                    //     ToastAndroid.SHORT,
                                    //   )
                                    // }
                                  >
                                    <Text style={{color: 'white'}}>
                                      ପ୍ରାପ୍ତ ଜ୍ଞାନ ପରୀକ୍ଷା
                                    </Text>
                                    <Image
                                      style={{
                                        marginLeft: 10,
                                        width: 24,
                                        height: 19.8,
                                      }}
                                      source={require('../assets/Image/done.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View style={styles.conquiz}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(item, topic, 'quiz2')
                                    }>
                                    <Text style={{color: 'black'}}>
                                      ପ୍ରାପ୍ତ ଜ୍ଞାନ ପରୀକ୍ଷା
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                              {/* <View style={styles.conquiz}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(topic, 'assignment')
                                    }>
                                    <Text>Assignment</Text>
                                  </TouchableOpacity>
                                </View> */}
                            </View>
                          )}
                        </View>
                      )
                    ),
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default TechAccoed;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: SIZES.WindowWidth * 0.95,
    borderWidth: 2,
    borderColor: Color.royalblue,
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 50,
    marginTop: 10,
  },
  moduleContainer: {
    padding: 10,
  },

  moduleText: {
    color: Colors.black,
    letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '600',
  },
  cardContainer: {
    flexGrow: 1,
    width: '100%',
    // margin: 15,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    // marginRight: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
    right: 10,
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
    paddingLeft: 10,
    marginRight: 14,
  },
  subModule: {
    color: Colors.black,
    letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 1,
  },
  subModuleTopic: {
    color: '#a9a9a9',
    letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 11,
    fontWeight: '600',
    top: 3,
    left: 2,
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
    width: 200,
  },
  conquiz: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    borderColor: Color.royalblue,
    paddingBottom: 10,
  },
  certificateContainer: {
    flexGrow: 1,
    width: '96%',
    // margin: 15,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginLeft: 20,
    // marginRight: 8,
    borderRadius: 10,
    elevation: 10,
    right: 10,
  },
  certificateCard: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  certificateText: {
    fontSize: 13,
    color: '#333333',
    alignSelf: 'center',
    top: 20,
    // textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
  },
  certificateLogo: {
    width: 164.81,
    height: 110.5,
    left: '60%',
    position: 'absolute', // Set the position to relative
    // Add a shadow with reduced opacity
    shadowColor: Color.royalblue, // Adjust opacity by changing the last value (0.3)
    top: '2%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1, // You can adjust the shadow opacity here
    shadowRadius: 4,
  },
  clickButton: {
    backgroundColor: Color.royalblue,
    marginLeft: 20,
    borderRadius: 20,
    width: window.WindowWidth * 0.22,
  },
  clickText: {
    FontFamily: FontFamily.poppinsMedium,
    color: '#333333',
    textAlign: 'center',
    color: 'white',
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 13,
  },
});
