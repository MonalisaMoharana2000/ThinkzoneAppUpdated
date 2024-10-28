import React from 'react';
import {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import API from '../environment/Api';
import Colors from '../utils/Colors';

import Api from '../environment/Api';

import {Color, FontFamily, FontSize, Border, Padding} from '../GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

export default function CallResponse({navigation, route}) {
  const dispatch = useDispatch();

  const user = useSelector(state => state.UserSlice.user);
  console.log('user-->', user);

  const {userid, username, usertype} = user[0];
  const studentDataParams = route.params.item;
  const {phone, studentid, studentname} = studentDataParams;
  console.log('studentDataParams-->', studentDataParams);
  const [quiz, setQuiz] = useState([]);

  const dates = new Date();
  // console.log('dates-->', dates);
  const responseDate =
    new Date().getDate() +
    '/' +
    (new Date().getMonth() + 1) +
    '/' +
    new Date().getFullYear();

  const [response_data, set_response_data] = useState([]);
  const [response_yes, set_response_yes] = useState(false);
  console.log('response_yes-->', response_yes);
  const [load, setLoad] = useState(false);
  console.log('load---->', load);
  const date = new Date();
  const [currentMonth, setcurrentMonth] = useState(date.getMonth() + 1);
  const [currentYear, setcurrentYear] = useState(date.getFullYear());
  const [callrecords, setCallrecords] = useState([]);
  console.log('callrecords---->', callrecords);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [topicIndex, setTopicIndex] = useState(null);

  const alertResponse = () => {
    // dispatch(userscall.getCallActivityStart());
    // setActivity(dispatch(userscall.getCallActivityStart()));
    Api.get(`getmasterpostcallactivities/od/pge`).then(response => {
      console.log('call response data-->', response.data);
      set_response_data(response.data);
      set_response_yes(true);
    });
  };

  useEffect(() => {
    const quizs = response_data.map(item => {
      return {...item, answer: ''};
    });
    setQuiz(quizs);
  }, [response_data]);

  let stuyData = [];
  let stuyDataNo = [];
  const [stat, setStat] = useState();
  const callYes = (item, status) => {
    // console.log('item-->', item);
    // console.log(item, status, 'itwe');
    let quizContent = quiz.map(item1 => {
      // console.log(item1, 'item');
      if (item1._id === item._id) {
        // console.log('id match');
        item1.answer = status;
      }
      return item1;
    });
    setQuiz(quizContent);
    setStat(status);
  };

  const saveResponse = async data => {
    // const feedBack = data.map(({_id, question}) => {
    //   return {_id, question};
    // });
    // console.log('feedBack-->', feedBack);
    // console.log('response_data--->', response_data.length);

    const optionLength = quiz.filter(x => x.answer).length;
    // console.log('optionLength--->', optionLength);
    const datas = {
      calledon: dates,
      class: route.params.item.class,
      date: responseDate,
      feedback: quiz,
      // passcode: route.params.item.passcode,
      phonenumber: route.params.item.phone,
      program: route.params.item.program,
      schoolid: '',
      // schoolname: route.params.item.schoolname,
      studentid: studentid,
      studentname: studentname,
      udisecode: route.params.item.udisecode,
      userid: userid,
      username: username,
      usertype: usertype,
    };
    console.log('data-->', datas);

    if (response_data.length == optionLength) {
      const res = await API.post(`savetranspostcallactivity`, datas);
      console.log('call response---------->', res);
      if (res?.data?.status === 'success') {
        navigation.navigate('studentlist');
      } else {
        navigation.navigate('studentlist');
      }
    } else {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'Call Response ଅନ୍ତର୍ଗତ ସମସ୍ତ Question ର ଉତ୍ତର ଦିଅନ୍ତୁ।',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'OK', onPress: () => null},
        ],
      );
    }

    // {
    //   response_data.length == optionLength
    //     ? dispatch(userscall.postCallActivityStart(datas)) &&
    //       navigation.navigate('studentlist')
    //     : Alert.alert(
    //         'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
    //         'Call Response ଅନ୍ତର୍ଗତ ସମସ୍ତ Question ର ଉତ୍ତର ଦିଅନ୍ତୁ।',
    //         [
    //           {
    //             text: 'Cancel',
    //             onPress: () => null,
    //             style: 'cancel',
    //           },
    //           {text: 'OK', onPress: () => null},
    //         ],
    //       );
    // }
  };

  // dispatch(userscall.postCallActivityStart(datas));
  // navigation.navigate('home')

  useEffect(() => {
    setLoad(false);
    const data = {
      userid: user[0].userid,
      language: 'od',
      month: currentMonth,
      year: currentYear,
    };
    API.get(
      // `gettranspostcallactivitiesbyuserid/${data.userid}/${data.language}/${data.month}/${data.year}`,
      `getCallRecordsByStudentId/${data.userid}/${studentid}`,
    ).then(
      response => {
        setCallrecords(response.data);
        console.log('callresponse====>', response.data);
      },
      err => {
        // console.log(err);
      },
    );
    // getCallrecord();
  }, [currentMonth, currentYear]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused
  //     setLoad(false)
  //   }, []),
  // );

  return (
    <View>
      {/* <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          marginTop: 12,
          fontWeight: 'bold',
        }}>
        Call Response
      </Text> */}
      <ScrollView>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${phone}`);
            setLoad(true);
          }}>
          <LinearGradient
            colors={['#1387d4', '#259399', '#0b466e']}
            start={{x: 0, y: 0}} // Gradient starting coordinates
            end={{x: 0, y: 0.5}} // Gradient ending coordinates
            style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Call Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        {load === true ? (
          <>
            <FlatList
              data={[{index: 1, key: 'ପିତାମାତା କଲ୍ ର ଉତ୍ତର ଦେଲେ କି ?'}]}
              renderItem={({item}) => (
                // console.log('item select-->', item),
                <View>
                  <Text
                    style={{
                      marginLeft: 19,
                      fontSize: 20,
                      fontWeight: '600',
                      marginTop: 12,
                      color: Color.black,
                      fontFamily: FontFamily.balooBhaina2Medium,
                    }}>
                    {item.index}. {item.key}
                  </Text>
                </View>
              )}
            />

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Color.gray_100,
                  marginLeft: 62,
                  height: 52,
                  width: 50,
                  marginTop: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 12,
                  paddingRight: 15,
                  padding: Padding.p_3xs,
                  borderRadius: Border.br_7xs,
                  borderColor: Color.royalblue,
                  borderWidth: 1,
                  backgroundColor: response_yes ? '#0060ca' : '',
                  color: response_yes ? '0060ca' : '',
                }}
                onPress={() => alertResponse()}>
                <Text
                  style={{
                    fontSize: 20,
                    color: response_yes ? '#FFFFFF' : '#333333',
                    textAlign: 'center',
                  }}>
                  ହଁ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Color.ghostwhite,
                  marginLeft: 62,
                  height: 52,
                  width: 50,
                  marginTop: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 9,
                  paddingRight: 15,
                  padding: Padding.p_3xs,
                  borderRadius: Border.br_7xs,
                  borderColor: Color.royalblue,
                  borderWidth: 1,
                }}
                onPress={() => navigation.navigate('studentlist')}>
                <Text
                  style={{fontSize: 20, textAlign: 'center', color: '#333333'}}>
                  ନା
                </Text>
              </TouchableOpacity>
            </View>
            {response_data.length > 0 ? (
              <View>
                <FlatList
                  data={quiz}
                  renderItem={({item, index}) => (
                    // console.log('item check-->', item, index),
                    <View>
                      <Text
                        style={{
                          marginLeft: 19,
                          fontSize: 20,
                          fontWeight: '600',
                          marginTop: 12,
                          color: Color.black,
                          fontFamily: FontFamily.balooBhaina2Medium,
                        }}>
                        {index + 2}. {item.question} ?
                      </Text>

                      {/* If quiz.answer == yes then backgroundcolor Change */}

                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => {
                            callYes(item, 'yes');
                            // console.log('check answer-->', item.answer);
                          }}>
                          {item.answer === 'yes' ? (
                            <Text
                              style={[
                                styles.buttonGreen,
                                {
                                  backgroundColor: Color.royalblue,
                                  color: 'white',
                                  fontSize: 20,
                                  textAlign: 'center',
                                },
                              ]}>
                              ହଁ
                            </Text>
                          ) : (
                            <Text
                              // style={{
                              //   fontSize: 26,
                              //   fontWeight: 'bold',
                              //   color: 'black',

                              style={[
                                styles.buttonGreen,
                                {
                                  fontSize: 20,
                                  textAlign: 'center',
                                  color: 'black',
                                },
                              ]}>
                              ହଁ
                            </Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => callYes(item, 'no')}>
                          {item.answer === 'no' ? (
                            <Text
                              style={[
                                styles.buttonRed,
                                {
                                  fontSize: 20,
                                  // fontWeight: '700',
                                  textAlign: 'center',
                                  color: 'white',
                                  backgroundColor: Color.royalblue,
                                },
                              ]}>
                              ନା
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.buttonRed,
                                {
                                  fontSize: 20,
                                  color: 'black',
                                  textAlign: 'center',
                                },
                              ]}>
                              ନା
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                <TouchableOpacity
                  onPress={() => saveResponse()}
                  style={styles.buttonSave}>
                  <Text
                    style={{fontSize: 19, fontWeight: 'bold', color: 'white'}}>
                    SAVE
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // <Text>No length found</Text>
              <Text></Text>
            )}
          </>
        ) : load === false && callrecords.length > 0 ? (
          <>
            {/* <View
              style={{
                width: window.WindowWidth * 0.9,
                height: window.WindowHeigth * 0.14,
                marginLeft: 20,
                marginTop: 25,
                paddingBottom: 10,
                paddingTop: 5,
                backgroundColor: 'white',
                overflow: 'scroll',
                borderRadius: 10,
              }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 20,
                  marginTop: 20,
                }}
                source={require('../assets/Image/callg.png')}
              />

              <Text
                style={{
                  fontSize: 17,
                  color: Color.darkslategray_200,
                  left: '25%',
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '600',
                  textAlign: 'left',
                  // height: '2.38%',
                  position: 'absolute',
                  marginTop: 20,
                  textTransform: 'capitalize',
                }}>
               
                {studentname}
              </Text>
              <Text
                style={{
                  marginTop: 60,
                  fontSize: 17,
                  color: Color.darkslategray_200,

                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '500',
                  textAlign: 'left',
                  // height: '2.38%',
                  position: 'absolute',
                  textTransform: 'capitalize',
                  fontSize: FontSize.size_smi,
                  left: '25%',
                  color: Color.dimgray_100,
                }}>
                {' '}
                Call: {callrecords?.length}
              </Text>
            </View> */}

            {callrecords.length > 0
              ? callrecords.map((item, index) => {
                  return (
                    <>
                      <View style={styles.cardContainer}>
                        <TouchableOpacity
                          key={index + 1}
                          onPress={() => {
                            setCurrentIndex(
                              index === currentIndex ? null : index,
                            );
                          }}>
                          <View style={styles.card}>
                            <View style={styles.subModuContainer}>
                              <Text style={styles.subModule}>
                                {' '}
                                {moment(item.calledon).format('DD/MM/YYYY')}
                              </Text>
                            </View>
                            {/* <AntDesign name="circledown" size={25} color={Colors.black} /> */}
                          </View>
                        </TouchableOpacity>

                        {index === currentIndex && (
                          <View style={styles.topic}>
                            {item.feedback.map(
                              (que, queIndex) => (
                                console.log('que---->', que),
                                (
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
                                    <TouchableOpacity
                                      onPress={() =>
                                        setTopicIndex(
                                          queIndex === topicIndex
                                            ? null
                                            : queIndex,
                                        )
                                      }>
                                      <Text
                                        style={[
                                          styles.tpoicText,
                                          {color: 'black'},
                                        ]}
                                        key={queIndex + 1}>
                                        {que.question} ?
                                      </Text>
                                    </TouchableOpacity>

                                    {queIndex === topicIndex && (
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          justifyContent: 'space-evenly',
                                          marginTop: 15,
                                          padding: 7,
                                        }}>
                                        <View
                                          style={[
                                            styles.conquiz,
                                            {
                                              backgroundColor: Color.royalblue,
                                            },
                                          ]}>
                                          <TouchableOpacity
                                            style={{flexDirection: 'row'}}>
                                            <Text style={{color: 'white'}}>
                                              {que.answer}
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    )}
                                  </View>
                                )
                              ),
                            )}
                          </View>
                        )}
                      </View>
                    </>
                  );
                })
              : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGreen: {
    // backgroundColor: '#097969',
    backgroundColor: Color.ghostwhite,
    marginLeft: 62,
    height: 52,
    width: 50,
    marginTop: 12,
    paddingTop: 12,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    padding: Padding.p_3xs,
    borderRadius: Border.br_7xs,
    borderColor: Color.royalblue,
    borderWidth: 1,
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
  subModuContainer: {
    padding: 10,
    // height: SIZES.WindowHeigth * 0.06,
  },
  topic: {
    // flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  name: {
    fontSize: 13,
    color: '#000',
    left: '25%',
    fontFamily: FontFamily.poppinsMedium,
    // fontWeight: '500',
    textAlign: 'left',
    marginTop: 5,
    width: 170,
    // height: '2.38%',
    position: 'absolute',
    textTransform: 'capitalize',
    paddingBottom: 40,
    flexDirection: 'row',
  },
  buttonRed: {
    backgroundColor: Color.ghostwhite,
    marginLeft: 62,
    height: 52,
    width: 50,
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 11,
    paddingRight: 11,
    padding: Padding.p_3xs,
    borderRadius: Border.br_7xs,
    borderColor: Color.royalblue,
    borderWidth: 1,
  },
  conquiz: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    borderColor: Color.royalblue,
    paddingBottom: 10,
  },
  buttonSave: {
    // backgroundColor: Color.royalblue,
    // marginTop: 49,
    // paddingLeft: 162,
    // paddingTop: 12,
    // paddingBottom: 12,
    // marginLeft: 22,
    // marginRight: 22,
    // borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 15,
    elevation: 3,
    marginLeft: 30,
    marginTop: 50,
    marginRight: 45,
    // marginBottom: 12,
    // backgroundColor: '#00C0F0',
    backgroundColor: Color.royalblue,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
