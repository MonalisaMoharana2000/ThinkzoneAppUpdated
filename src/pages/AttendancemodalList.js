import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useContext, createContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../utils/Colors';

import * as window from '../utils/dimensions';

import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
// import {DateContext} from './StudentAttendance';
import {useFocusEffect} from '@react-navigation/native';

import moment from 'moment';
import Loading from '../components/Loading';
import API from '../environment/Api';

const AttendancemodalList = ({navigation, route}) => {
  const [attendanceList, setAttendanceList] = useState([]);

  const [loader, setLoader] = useState(null);
  useEffect(() => {
    const delayLoader = () => {
      const delay = 2000; // milliseconds
      setTimeout(() => {
        setLoader(false);
      }, delay);
    };

    // Simulate API call or any asynchronous operation
    const isLoading = true; // Example value from useSelector
    setLoader(isLoading);

    if (isLoading) {
      delayLoader();
    }
  }, []);
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.user);

  const attendanceLists = useSelector(state => state.StudentSlice.students);

  const [newStudentList, setNewStudentList] = useState([]);
  const [modal, setModal] = useState(false);

  const [attendanceCheck, setAttendanceCheck] = useState([]);
  console.log('===========attendanceCheck', attendanceCheck);

  // useEffect(() => {
  //   setAttendanceCheck(attendanceLists);
  // }, [attendanceLists]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const res = await API.get(
          `getattendanceofteacherbydate/${route?.params?.userid}/${route?.params?.date}`,
        );
        console.log('res------>', res.data);
        setAttendanceCheck(res.data);
        setNewStudentList(res.data || []);
      };
      fetchData();
    }, [attendanceLists]),
  );

  let totalStudent = 0;
  let unattended = 0;
  let studentforattendance = useSelector(state => state.StudentSlice.students);

  const backActions = () => {
    setAttendanceCheck([]);
    navigation.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const backAction = () => {
        backActions();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    const resultArray = [];

    studentforattendance.forEach(obj => {
      //
      //
      const existingObject = resultArray.find(
        item => item.studentid === obj.studentid,
      );

      if (existingObject) {
        // If object with the same studentid exists, increment the count property
        existingObject.count = (existingObject.count || 1) + 1;
      } else {
        // If object with the same studentid doesn't exist, add it to the resultArray
        resultArray.push({...obj, count: 1});
      }
    });

    let data = [];

    if (resultArray?.length > 0) {
      totalStudent = resultArray.length;
      unattended = totalStudent;

      resultArray.forEach(element => {
        data.push({
          absentbutton: false,
          detail: element,
          presentbutton: false,
          selectionState: 0,
        });
      });
    }
    setNewStudentList(attendanceCheck);
  }, [studentforattendance]);

  // useEffect(() => {

  //   // dispatch(
  //   //   studenttypes.getAttendanceListStart({
  //   //     userid: route.params.userid,
  //   //     attendancedate: route.params.date,
  //   //   }),
  //   // );
  // }, []);

  useEffect(() => {
    const studentcategory = 'app';

    const fetchData = () => {
      const res = API.get(
        `getactivemaasterstudentsbyuseridbycategory/${route.params.userid}/${studentcategory}`,
      );
    };
    fetchData();
    // dispatch(
    //   studenttypes.getStudentListforAttendanceStart({
    //     userid: route.params.userid,
    //     studentcategory: studentcategory,
    //   }),
    // );
  }, []);
  const setAttendance = (item, atdStatus) => {
    console.log('adsttus----->', atdStatus);
    //
    if (atdStatus == 'present') {
      item.presentbutton = true;
    } else {
      item.absentbutton = true;
    }
    //
    const modifiedList = newStudentList.map(element => {
      if (element.studentid === item.studentid) {
        if (atdStatus == 'present') {
          item.presentbutton = true;
          return {...element, absentbutton: false, presentbutton: true};
        } else {
          return {...element, presentbutton: false, absentbutton: true};
        }
      }
      return element;
    });
    //
    setNewStudentList(modifiedList);
    const obj = {
      isholiday: false,
      holidayname: '',
      availability: atdStatus,
      userid: item.userid,
      username: item.username,
      centerid: '',
      centername: '',
      attendancedate: route.params.date,
      attendanceday: route.params.day,
      studentid: item.studentid,
      studentname: item.studentname,
      program: item.program,
      // geolocation: item.detail.geolocation,
    };

    if (attendanceList.length > 0) {
      let i = 0,
        index = -1;
      attendanceList.forEach(element => {
        if (element.studentid == item.studentid) {
          index = i;
          return;
        }
        i++;
      });
      if (index >= 0) {
        attendanceList.splice(index, 1, obj);
      } else {
        attendanceList.push(obj);
      }
    } else {
      attendanceList.push(obj);
    }
  };

  const closeModal = () => {
    setModal(false);
    navigation.goBack();
  };
  // const selectedDate = useContext(DateContext);

  const selectedDate = route.params.date;
  const filteredStudents = newStudentList?.filter(item => {
    const createdOnDate = moment(item.createdon);
    const routeDate = moment(route.params.date, 'DD-MM-YYYY');
    return createdOnDate.isSameOrBefore(routeDate, 'day');
  });

  const filteredNames = filteredStudents.map(item => {
    return {name: item.studentname, createdOn: item.createdon};
  });

  const allStudents = newStudentList.map(item => {
    return {name: item.studentname, createdOn: item.createdon};
  });

  const saveBut = async () => {
    {
      if (attendanceList.length === filteredStudents.length) {
        console.log('attendanceList--->', attendanceList);
        setLoader(true);

        const resp = await API.post(`saveattendance`, attendanceList);
        console.log('resp-------->', resp.data);
        // dispatch(studenttypes.postAttendanceStart(attendanceList));
        // AsyncStorage.setItem(
        //   'offlineAttendanceList',
        //   JSON.stringify(attendanceList),
        // );
        // navigation.navigate('home')
        // navigation.navigate('studentAttendance')
        if (navigation.canGoBack()) {
          setModal(true);
          setTimeout(() => {
            setLoader(false);
            // navigation.goBack();
            navigation.navigate('studentAttendance');
          }, 3000);
        }
      } else {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
          'ଆପଣ ଆପ୍ଲିକେନରେ ପଞ୍ଜିକରଣ କରିଥିବା ସମସ୍ତ ଶିକ୍ଷାର୍ଥୀଙ୍କ ଉପସ୍ଥାନ ରେକର୍ଡ କରନ୍ତୁ।',
          // [
          //   {
          //     text: 'Cancel',
          //     onPress: () => null,
          //     style: 'cancel',
          //   },
          //   {text: 'YES', onPress: () => null},
          // ],
          [
            {
              text: 'Ok',
              onPress: () => null,
              style: 'default',
            },
          ],
        );
      }
    }
  };

  console.log('attendanceLists---->', filteredStudents);
  console.log('newStudentList---->', newStudentList);
  // console.log(
  //   'attendanceLists------------------------------------>',
  //   attendanceLists,
  // );
  // console.log(
  //   '=====================================================================================',
  // );
  // console.log(
  //   'attendanceCheck------------------------------------>',
  //   attendanceCheck,
  // );
  // console.log(
  //   '=====================================================================================',
  // );
  // console.log(
  //   'NewStudentList------------------------------------>',
  //   newStudentList,
  // );
  // console.log(
  //   '=====================================================================================',
  // );
  // console.log(
  //   'filteredStudentList------------------------------------>',
  //   filteredStudents,
  // );
  // console.log(
  //   '=====================================================================================',
  // );

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                // height: window.WindowHeigth * 0.6,

                width: window.WindowWidth * 0.9,
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
                  // marginTop: -40,
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
              style={[
                styles.username,
                {
                  fontSize: 13,
                  // color: '#666666',
                  color: '#666666',
                  fontWeight: '400',
                  fontFamily: FontFamily.poppinsMedium,
                  marginTop: 10,
                  alignSelf: 'center',
                },
              ]}>
              ଆପଣ ସଫଳତାର ସହ ର ଉପସ୍ଥାନ ଦେଇଥିବାରୁ
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>୨ </Text>
              ଟି କଏନ ହାସଲ କରିଛନ୍ତି l
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('myachievement', {
                  type: 'myachievement',
                  returnToAttendance: true,
                })
              }
              style={[
                styles.bu,
                {
                  marginTop: 40,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  // fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: 'white',
                }}>
                Check Reward
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => closeModal()}
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
                  // fontWeight: '900',
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
      {/* {isLoading ? (
        <Loading />
      ) : ( */}
      <>
        <ScrollView>
          {loader ? (
            <Loading />
          ) : loader === false &&
            filteredStudents?.length === 0 &&
            attendanceCheck?.length === 0 ? (
            <View style={styles.imagecontainer}>
              <View>
                <Image
                  source={require('../assets/Image/noDataAvailable.png')}
                  style={styles.image}
                />
                <Text style={styles.imagetext}>
                  No student was registered on this date !
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.container}>
              {/* <Header /> */}
              {route.params.takeAttendance && filteredStudents.length > 0 ? (
                <View>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: FontFamily.balooBhaina2Medium,
                      right: 15,
                      fontWeight: '900',
                      AutoScaling: '250',
                      marginLeft: 57,
                      marginTop: 22,
                    }}>
                    ଏହି ତାରିଖ ପାଇଁ ଉପସ୍ଥାନ ନିଅନ୍ତୁ:{' '}
                    {moment(selectedDate).format('DD/MM/YY')}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      top: 15,
                      // alignSelf: 'center',
                      justifyContent: 'space-around',
                      paddingLeft: 20,
                    }}>
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: 13,
                        fontWeight: '600',
                        fontFamily: FontFamily.poppinsMedium,
                        right: 15,
                        fontWeight: '900',
                        AutoScaling: '250',
                        marginTop: 15,
                      }}>
                      Student Details
                    </Text>
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: 13,
                        fontWeight: '900',
                        fontFamily: FontFamily.poppinsMedium,
                        left: 15,
                        marginLeft: 26,
                        marginTop: 15,
                      }}>
                      Present
                    </Text>
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: 13,
                        fontWeight: '900',
                        fontFamily: FontFamily.poppinsMedium,
                        marginTop: 15,

                        // left: 10,
                      }}>
                      Absent
                    </Text>
                  </View>
                  {newStudentList?.map((item, index) => (
                    <View
                      style={{
                        width: window.WindowWidth * 0.9,
                        height: window.WindowHeigth * 0.14,
                        marginLeft: 17,
                        marginTop: 25,
                        paddingBottom: 10,
                        paddingTop: 5,
                        backgroundColor: 'white',
                        overflow: 'scroll',
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 19,
                          color: Color.darkslategray_200,
                          left: '9%',
                          fontFamily: FontFamily.poppinsMedium,
                          fontWeight: '500',
                          textAlign: 'left',
                          // height: '2.38%',
                          position: 'absolute',
                          textTransform: 'capitalize',
                          paddingTop: 5,
                        }}>
                        {item.studentname}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          right: 10,
                        }}>
                        <View>
                          {item.presentbutton ? (
                            <Pressable
                              onPress={() => {
                                setAttendance(item, 'present');
                              }}>
                              <Image
                                style={{
                                  marginLeft: 220,
                                  marginTop: 30,
                                  width: 35,
                                  height: 35,
                                }}
                                source={require('../assets/Image/user-tick.png')}
                              />
                            </Pressable>
                          ) : (
                            <Pressable
                              onPress={() => {
                                setAttendance(item, 'present');
                              }}>
                              <Image
                                style={{
                                  marginLeft: 220,
                                  marginTop: 30,
                                  width: 35,
                                  height: 35,
                                }}
                                source={require('../assets/Image/tick.png')}
                              />
                            </Pressable>
                          )}
                        </View>
                        {item.absentbutton ? (
                          <Pressable
                            onPress={() => {
                              setAttendance(item, 'absent');
                            }}>
                            <Image
                              style={{
                                marginLeft: 30,
                                marginTop: 30,
                                width: 35,
                                height: 35,
                              }}
                              source={require('../assets/Image/user-remove.png')}
                            />
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() => {
                              setAttendance(item, 'absent');
                            }}>
                            <Image
                              style={{
                                marginLeft: 30,
                                marginTop: 30,
                                width: 35,
                                height: 35,
                              }}
                              source={require('../assets/Image/remove.png')}
                            />
                          </Pressable>
                        )}
                      </View>
                      <Text
                        style={{
                          marginTop: 40,
                          fontSize: 17,
                          color: Color.darkslategray_200,
                          left: '25%',
                          fontFamily: FontFamily.poppinsMedium,
                          fontWeight: '500',
                          textAlign: 'left',
                          // height: '2.38%',
                          position: 'absolute',
                          textTransform: 'capitalize',
                          fontSize: FontSize.size_smi,
                          left: '9%',
                          color: Color.dimgray_100,
                        }}>
                        Program :
                        <Text style={{textTransform: 'uppercase'}}>
                          {item.program}
                        </Text>
                      </Text>
                      {item.program == 'pge' ? (
                        <Text
                          style={{
                            marginTop: 70,
                            fontSize: 17,
                            color: Color.darkslategray_200,
                            left: '25%',
                            fontFamily: FontFamily.poppinsMedium,
                            fontWeight: '500',
                            textAlign: 'left',
                            // height: '2.38%',
                            position: 'absolute',
                            textTransform: 'capitalize',
                            fontSize: FontSize.size_smi,
                            left: '9%',
                            color: Color.dimgray_100,
                          }}>
                          Class : {item.class}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 70,
                            fontSize: 17,
                            color: Color.darkslategray_200,
                            left: '25%',
                            fontFamily: FontFamily.poppinsMedium,
                            fontWeight: '500',
                            textAlign: 'left',
                            // height: '2.38%',
                            position: 'absolute',
                            textTransform: 'capitalize',
                            fontSize: FontSize.size_smi,
                            left: '9%',
                            color: Color.dimgray_100,
                          }}>
                          Level : {item.class}
                        </Text>
                      )}
                    </View>
                  ))}

                  {/* <ButtonComponent buttonName={'SAVE'} buttonPressed={saveBut} /> */}
                  {!loader &&
                  attendanceCheck?.length > 0 &&
                  filteredStudents.length > 0 ? (
                    <TouchableOpacity style={styles.button} onPress={saveBut}>
                      <Text style={styles.text}>SAVE</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : route.params.takeAttendance &&
                filteredStudents.length === 0 ? (
                <View style={styles.imagecontainer}>
                  <View>
                    <Image
                      source={require('../assets/Image/noDataAvailable.png')}
                      style={styles.image}
                    />
                    <Text style={styles.imagetext}>
                      No student was registered on this date !
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{}}>
                  <FlatList
                    data={attendanceCheck}
                    renderItem={({item, index}) => (
                      <View>
                        {item.isholiday === true ? (
                          <View>
                            <Text
                              style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                padding: 18,
                                fontSize: 23,
                                fontWeight: 'bold',
                                marginTop: 23,
                                backgroundColor: 'white',
                                borderRadius: 15,
                                marginBottom: 10,
                                marginLeft: 10,
                                marginRight: 10,
                              }}>
                              ଏହା ଏକ ଛୁଟିଦିନ ଅଟେ । 🙌😴
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <View style={styles.card}>
                              <Text style={styles.listtext}>
                                {item.studentname}
                              </Text>
                              {item.availability == 'present' ? (
                                // <AntDesign
                                //   name="checkcircle"
                                //   size={23}
                                //   color={Colors.success}
                                //   style={styles.icon}
                                // />
                                <Image
                                  style={{width: 35, height: 35}}
                                  source={require('../assets/Image/user-tick.png')}
                                />
                              ) : (
                                <Image
                                  style={{width: 35, height: 35}}
                                  source={require('../assets/Image/user-remove.png')}
                                />
                              )}
                            </View>
                          </View>
                        )}
                      </View>
                    )}></FlatList>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </>
      {/* )} */}
    </View>
  );
};

export default AttendancemodalList;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginTop: -3,
  },
  card: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 2,
    height: 68,
    width: 340,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 89,
    marginRight: 85,
    marginBottom: 16,
    backgroundColor: Color.royalblue,
    borderRadius: 15,
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  listtext: {
    // paddingStart: 10,
    // paddingTop: 15,
    // paddingBottom: 5,
    color: Colors.black,
    fontSize: 19,
    // fontWeight: 'bold',
    paddingLeft: 14,
    textTransform: 'capitalize',
  },
  icon: {
    paddingRight: 12,
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
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
  imagecontainer: {
    flex: 1,
    paddingTop: (windowHeight * 0.3) / 2, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.ghostwhite,
  },
  image: {
    width: windowWidth * 0.8, // Adjust as needed
    height: windowWidth * 0.99, // Maintain the aspect ratio
  },
  imagetext: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsMedium,
    color: 'grey',
    marginBottom: 250,
    marginTop: '-16%',
    marginLeft: 20,
  },
});
