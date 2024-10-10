import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../utils/Colors';
import API from '../environment/Api';

import {useSelector, useDispatch} from 'react-redux';
import * as SIZES from '../utils/dimensions';
import Loading from '../components/Loading';

const TechReviewQuiz = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  // console.log('reviewQuestions--->', reviewQuestions);
  const user = useSelector(state => state.userdata.user?.resData);
  const data = route.params.data;
  console.log('data--->', data);
  const {topicId} = data;
  console.log('====================================topicId', topicId);
  console.log();
  console.log('====================================');
  const dataType = route.params.data_type;
  console.log('dataType--->', dataType);
  useEffect(() => {
    // setIsLoading(true);
    API.get(
      `getTchTrainingQuiz/${'monalisamoharana99@gmail.com'}/${dataType}/${topicId}`,
    ).then(response => {
      console.log('response--->', response.data);
      setReviewQuestions(response.data.quiz1Data);
      setIsLoading(false);
    });
  }, []);

  const [header, setHeader] = useState('');
  //   const getQuizReview = (title, index) => {
  //     // console.log('reviewquiz---->', index + 1, title);
  //     setHeader(index + 1);
  //     setIsLoading(true);
  //     API.get(
  //       `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
  //     )
  //       .then(res1 => {
  //         const datas = res1.data;
  //         setReviewQuestions(datas[0].quiz);
  //         // console.log(res1.data, '1nd api');
  //         if (datas == undefined || datas.length == 0) {
  //           API.get(
  //             `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
  //           ).then(res => {
  //             const data1 = res.data;
  //             // console.log(res, '2nd api');
  //             setIsLoading(false);
  //             setContentData(res.data);
  //           });
  //         } else {
  //           setIsLoading(false);
  //           // setSubModulesData(data);
  //           setContentData(res1.data);
  //         }
  //       })
  //       .catch(err => {});
  //   };

  const correctQuiz = reviewQuestions.filter(
    x => x.answer === x.selectedOption,
  );
  // console.log('correctQuiz--->', correctQuiz.length);
  const incorrectQuiz = reviewQuestions.filter(
    x => x.answer !== x.selectedOption,
  );
  // console.log('incorrectQuiz--->', incorrectQuiz.length);
  // const indexData = Object.keys(
  //   reviewQuestions.reduce((o, c) => {
  //     console.log('o-->', o, c);
  //     Object.assign(o, c);
  //   }, 0),
  // );

  const indexData = Object.keys(
    reviewQuestions.reduce(function (max, curr) {
      // console.log('o-->', max, curr);
      return Object.assign(max, curr);
    }, 0),
  );
  const ngh = Object.assign({}, indexData);
  // console.log('ngh--->', ngh);

  const handlePrev = () => {
    if (header == 1) {
      console.log(
        header - 1,
        reviewQuestions.length,
        'check________________>1',
      );
    } else {
      setHeader(header - 1);
    }
  };
  // console.log(header.length, 'check________________>3');
  const handleNext = () => {
    if (header == reviewQuestions.length) {
      // setHeader(header);
      // console.log(header, reviewQuestions.length, 'check________________>2');
    } else {
      setHeader(header + 1);
      // setShowNextButton(true);
    }
  };

  const postModuleidHeader = (item, index) => {
    // console.log('check index2----->', item, index + 1);
    setHeader(index + 2);
    setIsLoading(true);
    // setShowPrevButton(true);
    // setShowNextButton(true);
    API.get(
      `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
    )
      .then(res1 => {
        const datas = res1.data;
        setReviewQuestions(datas[0].quiz);
        // console.log(res1.data, '1nd api');
        if (datas == undefined || datas.length == 0) {
          API.get(
            `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
          ).then(res => {
            const data1 = res.data;
            // console.log(res, '2nd api');
            setIsLoading(false);
            setContentData(res.data);
          });
        } else {
          setIsLoading(false);
          // setSubModulesData(data);
          setContentData(res1.data);
        }
      })
      .catch(error => {
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
      });
    // callbackfun(item, index);
    // setHeader(index);
  };
  return (
    <>
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: 12,
          marginLeft: 15,
          backgroundColor: 'white',
          paddingLeft: 22,
          paddingTop: 12,
          paddingBottom: 19,
          borderRadius: 19,
        }}>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 23}}>
          Quiz Review
        </Text>
        {/* <Text style={{color: 'black'}}>
        Total Questions : {reviewQuestions.length}
      </Text> */}

        <Text style={{color: 'grey', fontWeight: 'bold'}}>
          You have scored {correctQuiz.length} out of {reviewQuestions.length}
        </Text>

        {/* <Text style={{color: 'black', paddingLeft: 19}}>
          Incorrect Answer : {incorrectQuiz.length}
        </Text> */}

        <Text style={{color: 'grey', fontWeight: 'bold'}}>
          Click on question number to check answer
        </Text>
      </View>

      <ScrollView
        style={{
          marginTop: 12,
          marginLeft: 19,
          backgroundColor: 'white',
          paddingTop: 8,
          marginBottom: 23,
          borderRadius: 19,
        }}>
        <>
          {/* <QuizReviewHeader
          reviewQuestions={reviewQuestions}
          callbackfun={getQuizReview}
        /> */}
          <ScrollView horizontal={true}>
            {reviewQuestions.map((item, index) => (
              <TouchableOpacity
                onPress={() => postModuleidHeader(item, index)}
                key={index}
                style={{
                  marginTop: 22,
                  margin: 2,
                  flexDirection: 'row',
                  borderWidth: 2,
                  width: 45.72,
                  height: 46.66,
                  borderRadius: 100,
                  borderColor: index === header - 1 ? 'grey' : Colors.white,
                  backgroundColor:
                    item.selectedOption === item.answer ? '#A3D735' : '#FF9515',
                  marginLeft: 19,
                  // marginRight: 16,
                  justifyContent: 'space-evenly',
                }}>
                <Text style={{color: 'white', padding: 10}}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>

        {isLoading ? (
          // <ActivityIndicator
          //   size="large"
          //   color={Colors.primary}
          //   style={{justifyContent: 'center', alignSelf: 'center'}}
          // />
          <Loading />
        ) : (
          <>
            <ScrollView style={styles.container}>
              <>
                {/* <ScrollView style={styles.container2}> */}
                <ScrollView>
                  {/* <View
                style={styles.linearGradient}> */}
                  {/* <View style={styles.moduleContainer}> */}
                  <Text style={styles.moduleText}>
                    {header ? (
                      // <ScrollView style={styles.container2}>
                      <ScrollView>
                        {/* <View style={styles.linearGradient}> */}
                        {/* <View style={styles.moduleContainer}> */}
                        <Text style={styles.moduleText}>
                          <>
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flexGrow: 1,
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    paddingLeft: 10,
                                    paddingRight: 8,
                                    alignItems: 'center',
                                    color: 'black',
                                    width: 350,
                                    fontSize: 20,
                                  }}>
                                  {header}.{' '}
                                  {reviewQuestions[header - 1].question}
                                </Text>
                              </View>

                              {reviewQuestions[header - 1].A ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 19,
                                  }}>
                                  <Text
                                    style={[
                                      styles.item,
                                      {
                                        marginLeft: 5,
                                        backgroundColor:
                                          'A' ===
                                          reviewQuestions[header - 1].answer
                                            ? '#A3D735'
                                            : 'A' ===
                                              reviewQuestions[header - 1]
                                                .selectedOption
                                            ? '#0060ca'
                                            : '#D3D3D3',
                                        width: 50,
                                        height: 50,
                                        borderRadius: 39,
                                        paddingLeft: 13,
                                      },
                                    ]}>
                                    {' '}
                                    {reviewQuestions[header - 1].A
                                      ? 'A'
                                      : null}{' '}
                                  </Text>
                                  <Text style={styles.item}>
                                    {reviewQuestions[header - 1].A}
                                  </Text>
                                </View>
                              ) : null}
                              {reviewQuestions[header - 1].B ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 19,
                                  }}>
                                  <Text
                                    style={[
                                      styles.item,
                                      {
                                        marginLeft: 5,

                                        backgroundColor:
                                          'B' ===
                                          reviewQuestions[header - 1].answer
                                            ? '#A3D735'
                                            : 'B' ===
                                              reviewQuestions[header - 1]
                                                .selectedOption
                                            ? '#0060ca'
                                            : '#D3D3D3',
                                        width: 50,
                                        height: 50,
                                        borderRadius: 39,
                                        paddingLeft: 13,
                                      },
                                    ]}>
                                    {' '}
                                    {reviewQuestions[header - 1].B
                                      ? 'B'
                                      : null}{' '}
                                  </Text>
                                  <Text style={styles.item}>
                                    {reviewQuestions[header - 1].B}
                                  </Text>
                                </View>
                              ) : null}
                              {reviewQuestions[header - 1].C ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 19,
                                  }}>
                                  <Text
                                    style={[
                                      styles.item,
                                      {
                                        marginLeft: 5,

                                        backgroundColor:
                                          'C' ===
                                          reviewQuestions[header - 1].answer
                                            ? '#A3D735'
                                            : 'C' ===
                                              reviewQuestions[header - 1]
                                                .selectedOption
                                            ? '#0060ca'
                                            : '#D3D3D3',
                                        width: 50,
                                        height: 50,
                                        borderRadius: 39,
                                        paddingLeft: 13,
                                      },
                                    ]}>
                                    {' '}
                                    {reviewQuestions[header - 1].C
                                      ? 'C'
                                      : null}{' '}
                                  </Text>
                                  <Text style={styles.item}>
                                    {reviewQuestions[header - 1].C}
                                  </Text>
                                </View>
                              ) : null}
                              {reviewQuestions[header - 1].D ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 19,
                                  }}>
                                  <Text
                                    style={[
                                      styles.item,
                                      {
                                        marginLeft: 5,

                                        backgroundColor:
                                          'D' ===
                                          reviewQuestions[header - 1].answer
                                            ? '#A3D735'
                                            : 'D' ===
                                              reviewQuestions[header - 1]
                                                .selectedOption
                                            ? '#0060ca'
                                            : '#D3D3D3',
                                        width: 50,
                                        height: 50,
                                        borderRadius: 39,
                                        paddingLeft: 13,
                                      },
                                    ]}>
                                    {' '}
                                    {reviewQuestions[header - 1].D
                                      ? 'D .'
                                      : null}{' '}
                                  </Text>
                                  <Text style={styles.item}>
                                    {reviewQuestions[header - 1].D}
                                  </Text>
                                </View>
                              ) : null}
                              <View style={{marginTop: 9}}>
                                <Text style={[styles.itemCorrect]}>
                                  Correct Answer :{' '}
                                  {reviewQuestions[header - 1].answer}
                                </Text>
                                <Text style={styles.item}>
                                  Marked Answer :{' '}
                                  {reviewQuestions[header - 1].selectedOption}
                                </Text>
                              </View>
                              {/* Next Button */}
                              <View style={{flexDirection: 'row'}}>
                                {header == reviewQuestions.length ? (
                                  <TouchableOpacity
                                    onPress={handlePrev}
                                    style={{
                                      marginLeft: 19,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 2,
                                        marginLeft: 5,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-left.png')}
                                    />
                                  </TouchableOpacity>
                                ) : header == 1 ? (
                                  <TouchableOpacity
                                    onPress={handleNext}
                                    style={{
                                      marginLeft: 260,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 2,
                                        marginLeft: -85,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-right.png')}
                                    />
                                  </TouchableOpacity>
                                ) : (
                                  <>
                                    <TouchableOpacity
                                      onPress={handlePrev}
                                      style={{
                                        marginLeft: 19,
                                      }}>
                                      <Image
                                        style={{
                                          marginTop: 2,
                                          marginLeft: 5,
                                          width: 32,
                                          height: 32,
                                        }}
                                        source={require('../assets/Image/arrow-square-left.png')}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={handleNext}
                                      style={{
                                        marginLeft: 260,
                                      }}>
                                      <Image
                                        style={{
                                          marginTop: 2,
                                          marginLeft: -85,
                                          width: 32,
                                          height: 32,
                                        }}
                                        source={require('../assets/Image/arrow-square-right.png')}
                                      />
                                    </TouchableOpacity>
                                  </>
                                )}
                              </View>
                            </View>
                          </>
                        </Text>
                        {/* </View> */}
                        {/* </View> */}
                      </ScrollView>
                    ) : reviewQuestions.length > 0 ? (
                      <>
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              flexGrow: 1,
                              marginTop: 19,
                            }}>
                            <Text
                              style={{
                                flexGrow: 1,
                                flexShrink: 1,
                                paddingLeft: 10,
                                paddingRight: 8,
                                alignItems: 'center',
                                color: 'black',
                                width: 350,
                                fontSize: 20,
                              }}>
                              {1}. {reviewQuestions[0].question}
                            </Text>
                          </View>

                          {reviewQuestions[0].A ? (
                            <View style={{flexDirection: 'row', marginTop: 19}}>
                              <Text
                                style={[
                                  styles.item,
                                  {
                                    marginLeft: 5,
                                    backgroundColor:
                                      'A' === reviewQuestions[0].answer
                                        ? '#A3D735'
                                        : 'A' ===
                                          reviewQuestions[0].selectedOption
                                        ? '#0060ca'
                                        : '#D3D3D3',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 39,
                                    paddingLeft: 13,
                                  },
                                ]}>
                                {' '}
                                {reviewQuestions[0].A ? 'A' : null}{' '}
                              </Text>
                              <Text style={styles.item}>
                                {reviewQuestions[0].A}
                              </Text>
                            </View>
                          ) : null}
                          {reviewQuestions[0].B ? (
                            <View style={{flexDirection: 'row', marginTop: 19}}>
                              <Text
                                style={[
                                  styles.item,
                                  {
                                    marginLeft: 5,

                                    backgroundColor:
                                      'B' === reviewQuestions[0].answer
                                        ? '#A3D735'
                                        : 'B' ===
                                          reviewQuestions[0].selectedOption
                                        ? '#0060ca'
                                        : '#D3D3D3',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 39,
                                    paddingLeft: 13,
                                  },
                                ]}>
                                {' '}
                                {reviewQuestions[0].B ? 'B' : null}{' '}
                              </Text>
                              <Text style={styles.item}>
                                {reviewQuestions[0].B}
                              </Text>
                            </View>
                          ) : null}
                          {reviewQuestions[0].C ? (
                            <View style={{flexDirection: 'row', marginTop: 19}}>
                              <Text
                                style={[
                                  styles.item,
                                  {
                                    marginLeft: 5,

                                    backgroundColor:
                                      'C' === reviewQuestions[0].answer
                                        ? '#A3D735'
                                        : 'C' ===
                                          reviewQuestions[0].selectedOption
                                        ? '#0060ca'
                                        : '#D3D3D3',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 39,
                                    paddingLeft: 13,
                                  },
                                ]}>
                                {' '}
                                {reviewQuestions[0].C ? 'C' : null}{' '}
                              </Text>
                              <Text style={styles.item}>
                                {reviewQuestions[0].C}
                              </Text>
                            </View>
                          ) : null}
                          {reviewQuestions[0].D ? (
                            <View style={{flexDirection: 'row', marginTop: 19}}>
                              <Text
                                style={[
                                  styles.item,
                                  {
                                    marginLeft: 5,

                                    backgroundColor:
                                      'D' === reviewQuestions[0].answer
                                        ? '#A3D735'
                                        : 'D' ===
                                          reviewQuestions[0].selectedOption
                                        ? '#0060ca'
                                        : '#D3D3D3',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 39,
                                    paddingLeft: 13,
                                  },
                                ]}>
                                {' '}
                                {reviewQuestions[0].D ? 'D' : null}{' '}
                              </Text>
                              <Text style={styles.item}>
                                {reviewQuestions[0].D}
                              </Text>
                            </View>
                          ) : null}

                          <View style={{marginTop: 25}}>
                            <Text style={[styles.itemCorrect]}>
                              Correct Answer : {reviewQuestions[0].answer}
                            </Text>
                            <Text style={styles.item}>
                              Marked Answer :{' '}
                              {reviewQuestions[0].selectedOption}
                            </Text>
                          </View>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                          {reviewQuestions.map((item, index) => (
                            <TouchableOpacity
                              onPress={() => postModuleid(item, index)}
                              style={{
                                marginLeft: 260,
                              }}>
                              <Image
                                style={{
                                  marginTop: 2,
                                  marginLeft: 5,
                                  width: 32,
                                  height: 32,
                                }}
                                source={require('../assets/Image/arrow-square-right.png')}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </>
                    ) : null}
                  </Text>
                  {/* </View> */}
                  {/* </View> */}
                </ScrollView>
              </>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default TechReviewQuiz;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: -22,
    marginLeft: 27,
    // marginTop: -464,
  },
  container2: {
    backgroundColor: Colors.white,
    width: SIZES.WindowWidth * 0.95,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 50,
  },
  moduleText: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'black',

    // marginTop: 12,
  },
  item1: {
    color: 'black',
    height: 44,
    fontSize: 18,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'black',
    // marginTop: 12,
  },
  itemCorrect: {
    color: 'black',
    fontSize: 18,
    padding: 10,
    marginTop: -7,
  },
  itemQuestion: {
    padding: -29,
    fontSize: 18,
    // height: 99,
    color: 'black',
  },
});
