import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../utils/Colors';
import ColorName from '../utils/ColorName';
import * as SIZES from '../utils/dimensions';
import API from '../environment/Api';

import {Avatar, Provider as PaperProvider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {List} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FabButton from '../components/FabButton';

import ProgressBar from './ProgressBar';
import {useEffect} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {Color, FontFamily} from '../GlobalStyle';

const AccoedC = ({
  onPress,
  userSubModule,
  subModules,
  navigation,
  training_type,
}) => {
  const [data, setData] = useState([]);
  let contentDetails = useSelector(
    state => state.trainingdata.pptcontentDetails,
  );
  let userContentDetails = useSelector(
    state => state.trainingdata.pptuserdetails,
  );
  const [usercontentDetails, setUsercontentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newArr = contentDetails.map(item => {
      const d = item.topicdetails.map(item1 => {
        const neData = userContentDetails.find(
          item2 => item2?.topicid === item1.topicid,
        );
        return {
          ...item1,
          ...neData,
        };
      });
      let count = 0;
      d.map(item2 => {
        //console.log(item2, 'item1');

        if (item2.topic_percentage == '100%') {
          count += 1;

          // console.log(count, 'count');
        }
        // item.completed_topic = count;
      });
      //console.log(d);
      return {
        ...item,
        completed_topic: count,
        dat: d,
      };
    });
    //console.log(newArr, 'new');
    setUsercontentDetails(newArr);
  }, [contentDetails, userContentDetails]);
  // console.log(data, 'contentDetails');
  // console.log(training_type, 'training_type');
  // console.log(subModules, 'subModules');
  const user = useSelector(state => state.userdata.user?.resData);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [subModulesdata, setSubModulesData] = useState([]);
  const [language, setLanguage] = useState('od');
  const [topicIndex, setTopicIndex] = useState(null);

  const handlePress = () => setExpanded(!expanded);

  const topicClicked = (topic, c_type) => {
    // setIsLoading(true);
    ///console.log(topic, c_type, 'topic');
    if (c_type == 'assignment') {
      navigation.navigate('preprogram_training_assignment', {
        data_type: c_type,
        data: topic,
      });
    } else {
      navigation.navigate('preprogram_training_content', {
        data: topic,
        data_type: c_type,
      });
      // if (training_type == 'monthly') {
      //   API.get(
      //     `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}`,
      //   )
      //     .then(res1 => {
      //       console.log(res1, 'res1');
      //       const data = res1.data;
      //       if (data == undefined || data.length == 0) {
      //         API.get(
      //           `getalltrainingcontents/${user[0].usertype}/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}/${language}`,
      //         ).then(res => {
      //           const data1 = res.data;
      //           console.log(
      //             data1,
      //             'res2dhaneswars---------------------------->',
      //           );
      //           setIsLoading(false);
      //           navigation.navigate('contentdetails', {
      //             data: res.data,
      //             data_type: c_type,
      //           });
      //         });
      //       } else {
      //         setIsLoading(false);
      //         setSubModulesData(data);
      //         console.log(data, 'res1');
      //         navigation.navigate('contentdetails', {
      //           data: data,
      //           data_type: c_type,
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err, 'err');
      //     });
      // } else if (training_type == 'ppt') {
      //   API.get(
      //     `ppt_trans_gettopicdetails/${user[0].userid}/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}`,
      //   )
      //     .then(res1 => {
      //       const data = res1.data;
      //       // console.log(res1, 'res1data');
      //       if (data == undefined || data.length == 0) {
      //         API.get(
      //           `ppt_getallcontents/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}/${language}`,
      //         ).then(res => {
      //           const data1 = res.data;
      //           console.log(res, 'res');
      //           setIsLoading(false);
      //           navigation.navigate('preprogram_training_content', {
      //             data: res.data,
      //             data_type: c_type,
      //           });
      //         });
      //       } else {
      //         setSubModulesData(data);
      //         setIsLoading(false);
      //         // console.log(data, 'res1');
      //         navigation.navigate('preprogram_training_content', {
      //           data: data,
      //           data_type: c_type,
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err, 'err');
      //     });
      // } else {
      //   Alert.alert('Please Select a traing type');
      // }
    }
  };

  const mname = usercontentDetails.map(x => x.modulename);

  return (
    <>
      <View style={styles.container}>
        {/* <LinearGradient
          end={{x: 0, y: 0}}
          start={{x: 1, y: 0}}
          colors={['#0e7490', '#06b6d4', '#fafafa']}
          style={styles.linearGradient}>
          <View style={styles.moduleContainer}>
            <Text style={styles.moduleText}>{mname[0]}</Text>
          </View>
        </LinearGradient> */}

        {usercontentDetails?.map((item, index) => {
          // console.log('item content-->', item);
          return (
            <ScrollView>
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  key={item._id}
                  onPress={() => {
                    setCurrentIndex(index === currentIndex ? null : index);
                  }}>
                  <View style={styles.card}>
                    {/* <Avatar.Text
                size={50}
                label={item.submodulename[0]}
                labelStyle={styles.avatarText}
                style={{backgroundColor: ColorName[item.submodulename[0]]}}
              /> */}
                    <View style={styles.subModuContainer}>
                      <Text style={styles.subModule}>{item.submodulename}</Text>
                      <View style={{marginTop: 10}}>
                        <ProgressBar
                          total={item?.dat?.length}
                          complete={item.completed_topic}
                        />
                      </View>

                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Image
                          style={{width: 20, height: 20}}
                          source={require('../assets/Image/timer.png')}
                        />
                        <Text style={styles.subModuleTopic}>
                          {/* {item.submoduleDuration} min */}
                          {item.submoduleDuration} min
                        </Text>
                        <Image
                          style={{width: 20, height: 20, marginLeft: 10}}
                          source={require('../assets/Image/bookss.png')}
                        />
                        <Text style={styles.subModuleTopic}>
                          {/* {item.completed_topic}/{item.dat.length} Topics */}
                          {item.dat.length} Chapters
                        </Text>

                        <Image
                          style={{width: 20, height: 20, marginLeft: 10}}
                          source={require('../assets/Image/coin.png')}
                        />
                        <Text style={styles.subModuleTopic}>
                          {/* {item.submoduleDuration} min */}
                          {/* {item.submoduleDuration}  */}2 coins
                        </Text>
                        {/* <ProgressBar
                        total={item?.dat?.length}
                        complete={item.completed_topic}
                      /> */}
                      </View>
                    </View>
                    {/* <AntDesign
                      name="circledown"
                      size={25}
                      color={Colors.black}
                    /> */}
                  </View>
                </TouchableOpacity>
                {index === currentIndex && (
                  <View style={styles.topic}>
                    {item.dat.map((topic, toicindex) => (
                      <ScrollView>
                        <View
                          style={{
                            width: SIZES.WindowWidth * 0.85,
                            // height: 40,
                            padding: 10,
                            borderRadius: 10,
                            // backgroundColor: Colors.whiteShade,
                            borderColor: Color.ghostwhite,
                            borderWidth: 2,
                            marginBottom: 2.5,
                            fontFamily: FontFamily.poppinsMedium,
                            // alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {/* <TouchableOpacity onPress={() => topicClicked(topic)}> */}

                          <TouchableOpacity
                            onPress={() =>
                              setTopicIndex(
                                toicindex === topicIndex ? null : toicindex,
                              )
                            }>
                            <Text style={styles.tpoicText} key={topic._id}>
                              {topic.topicname}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}>
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
                              <View>
                                <Entypo
                                  name="stopwatch"
                                  color={Colors.darkGreey}
                                  size={22}
                                />
                                <Text>{topic.topicDuration} min</Text>
                              </View>
                            </View>
                          </TouchableOpacity>

                          {toicindex === topicIndex &&
                            (console.log('mname ppt---------->', topic),
                            (
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'space-evenly',
                                  marginTop: 15,
                                  padding: 10,
                                  paddingBottom: 20,
                                  width: 290,
                                  // Width: SIZES.WindowWidth * 1,
                                }}>
                                {topic.content_status ? (
                                  <View
                                    style={[
                                      styles.conquiz,
                                      {
                                        backgroundColor: Color.royalblue,
                                        color: 'white',
                                      },
                                    ]}>
                                    <TouchableOpacity
                                      style={{flexDirection: 'row'}}
                                      onPress={() =>
                                        topicClicked(topic, 'content')
                                      }>
                                      <Text style={{color: 'white'}}>
                                        Content
                                      </Text>
                                      <Image
                                        style={{
                                          marginLeft: 10,
                                          justifyContent: 'center',
                                          marginRight: '60%',
                                          alignContent: 'flex-end',
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
                                        topicClicked(topic, 'content')
                                      }>
                                      <Text style={{color: 'black'}}>
                                        Content
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                )}

                                {topic.quiz_status ? (
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
                                        })
                                      }>
                                      <Text style={{color: 'white'}}>Quiz</Text>
                                      <Image
                                        style={{
                                          marginLeft: 40,
                                          // alignItems: 'flex-end',
                                          justifyContent: 'center',
                                          // marginRight: 15,
                                          width: 24,
                                          height: 19.8,
                                          // float
                                        }}
                                        source={require('../assets/Image/done.png')}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <View style={styles.conquiz}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        topicClicked(topic, 'quiz')
                                      }>
                                      <Text style={{color: 'black'}}>Quiz</Text>
                                    </TouchableOpacity>
                                  </View>
                                )}
                                {/* <View style={styles.conquiz}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      topicClicked(topic, 'assignment')
                                    }>
                                    <Text>Assignment </Text>
                                  </TouchableOpacity>
                                </View> */}
                              </View>
                            ))}
                        </View>
                      </ScrollView>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          );
        })}
      </View>
    </>
  );
};

export default AccoedC;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: SIZES.WindowWidth * 0.96,
    borderWidth: 2,
    borderColor: '#0060ca',
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginTop: 10,
  },
  moduleContainer: {},

  moduleText: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
    margin: 10,
  },
  cardContainer: {
    flexGrow: 1,
    // width: '100%',
    margin: 8,
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
    letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 18,
    width: 300,
    fontWeight: '600',
  },
  subModuleTopic: {
    color: '#a9a9a9',
    letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 11,
    fontWeight: '600',
    left: '10%',
  },
  topic: {
    flexWrap: 'wrap',
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
    borderColor: Color.royalblue,
    FontFamily: FontFamily.poppinsMedium,
    marginBottom: 10,
  },
});
