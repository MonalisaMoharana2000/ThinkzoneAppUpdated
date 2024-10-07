import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
import Entypo from 'react-native-vector-icons/Entypo';
import ProgressBar from './ProgressBar';
import {useEffect} from 'react';
import {Color, FontFamily} from '../GlobalStyle';

const AccordianComponentNew = ({
  onPress,
  userSubModule,
  subModules,
  navigation,
  training_type,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  let contentDetails = useSelector(
    state => state.trainingdataNew.contentDetails,
  );
  // console.log('contentDetails-->', contentDetails);

  let userContentDetails = useSelector(
    state => state.trainingdataNew.userTraingDetails,
  );
  // console.log(
  //   userContentDetails,
  //   'userContentDetails------------------------->',
  // );
  const [usercontentDetails, setUsercontentDetails] = useState([]);
  // console.log('userContentDetails------------->', usercontentDetails);
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
          // console.log(count, 'count');
        }
        // item.completed_topic = count;
      });
      // console.log(d);
      return {
        ...item,
        completed_topic: count,
        dat: d,
      };
    });
    // console.log(newArr, 'new');
    setUsercontentDetails(newArr);
  }, [contentDetails, userContentDetails]);
  // console.log(data, 'contentDetails');
  // console.log(training_type, 'training_type');
  // console.log(subModules, 'subModules');
  const user = useSelector(state => state.userdata.user);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [subModulesdata, setSubModulesData] = useState([]);
  const [language, setLanguage] = useState('od');
  const [topicIndex, setTopicIndex] = useState(null);

  // const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  const topicClicked = (topic, item, c_type) => {
    setIsLoading(true);
    // console.log(topic, 'topic1------>');
    // console.log(item, 'topic2------>');
    // console.log(c_type, 'topic3------>');
    if (c_type == 'assignment') {
      navigation.navigate('monthlytraining_assignment_new', {
        data_type: c_type,
        data: topic,
        whole_data: item,
      });
    } else {
      navigation.navigate('contentdetailsnew', {
        data: topic,
        whole_data: item,
        data_type: c_type,
      });
      // if (training_type == 'monthly') {
      //   API.get(
      //     `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}`,
      //     // `getalltrainingcontents/fellow/1667470853338/${topic.submoduleid}/${topic.topicid}/od`,
      //   )
      //     .then(res1 => {
      //       console.log(res1, 'res1');
      //       const data = res1.data;
      //       // console.log("training data---------------------------->",data)
      //       if (data == undefined || data.length == 0) {
      //         API.get(
      //           `getalltrainingcontents/${user[0].usertype}/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}/${language}`,
      //         ).then(res => {
      //           const data1 = res.data;
      //           console.log(res, 'res2');
      //           setIsLoading(false);
      //           navigation.navigate('contentdetails', {
      //             data: res.data,
      //             data_type: c_type,
      //           });
      //         });
      //       } else {
      //         setIsLoading(false);
      //         setSubModulesData(data);
      //         // console.log(data, 'res1');
      //         setIsLoading(false);
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
      //   setIsLoading(true);
      //   API.get(
      //     `ppt_trans_gettopicdetails/${user[0].userid}/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}`,
      //   )
      //     .then(res1 => {
      //       // console.log(res1, 'res1data');
      //       const data = res1.data;

      //       if (data == undefined || data.length == 0) {
      //         API.get(
      //           `ppt_getallcontents/${topic.moduleid}/${topic.submoduleid}/${topic.topicid}/${language}`,
      //         ).then(res => {
      //           const data1 = res.data;
      //           // console.log(res, 'res');
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
      //         setIsLoading(false);
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
  const mname = usercontentDetails.map(x => x.modulename.toUpperCase());
  // console.log('mname------->', mname);

  // console.log(
  //   check.filter(element => mname.includes(element)),
  //   'compare two arrays element----------->',
  // );

  return (
    <>
      <ScrollView style={styles.container}>
        {/* <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#0e7490', '#06b6d4', '#fafafa']}
            style={styles.linearGradient}> */}
        <View style={styles.moduleContainer}>
          <Text style={styles.moduleText}>{mname[0]}</Text>
        </View>
        {/* </LinearGradient> */}

        {usercontentDetails?.map((item, index) => {
          console.log('contentitem------>', item);
          return (
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
                    <Text style={styles.subModuleTopic}>
                      {item.completed_topic}/{item.dat.length} Topics
                    </Text>
                    <View style={{marginTop: 10}}>
                      <ProgressBar
                        total={item?.dat?.length}
                        // complete={item.completed_topic}
                        complete={item.completedTopicsCount}
                      />
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
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
                      <Text style={[styles.subModuleTopic, {left: 5}]}>
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
                  <AntDesign name="circledown" size={25} color={Colors.black} />
                </View>
              </TouchableOpacity>

              {index === currentIndex && (
                // console.log('check index--------->', index, currentIndex),
                <View style={styles.topic}>
                  {item.dat.map((topic, toicindex) => (
                    <View
                      style={{
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
                          {topic.contentStatus == 'complete' ? (
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
                                  topicClicked(item, topic, 'content')
                                }>
                                <Text style={{color: 'white'}}>Content</Text>
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
                                <Text style={{color: 'black'}}>Content</Text>
                              </TouchableOpacity>
                            </View>
                          )}

                          {topic.quizStatus == 'complete' ? (
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
                                  navigation.navigate('reviewquiztraining', {
                                    data: topic,
                                  })
                                }>
                                <Text style={{color: 'white'}}>Quiz</Text>
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
                                  topicClicked(item, topic, 'quiz')
                                }>
                                <Text style={{color: 'black'}}>Quiz</Text>
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
                                <Text style={{color: 'white'}}>Assignment</Text>
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
                                <Text style={{color: 'black'}}>Assignment</Text>
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
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default AccordianComponentNew;

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
    letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '600',
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
    marginTop: 5,
    padding: 10,
    borderColor: Color.royalblue,
    paddingBottom: 10,
  },
});
