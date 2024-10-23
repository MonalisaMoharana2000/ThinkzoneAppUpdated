import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  Image,
  AppState,
  PanResponder,
  ActivityIndicator,
  BackHandler,
  Animated,
  Dimensions,
} from 'react-native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Colors from '../utils/Colors';
import * as SIZES from '../utils/dimensions';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import * as window from '../utils/dimensions';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {fetchStudentsDataThunk} from '../redux_toolkit/features/students/StudentThunk';

const StudentListPage = ({navigation}) => {
  const user = useSelector(state => state.UserSlice.user);
  //   console.log('user--->', user);
  const coin = useSelector(state => state.UserSlice.rewards);
  const userCoins = coin[0]?.coins; // Replace with the actual number of user coins
  const studentData = useSelector(state => state.StudentSlice.students);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  console.log('studentList page--------------', studentData);

  useEffect(() => {
    dispatch(fetchStudentsDataThunk(user[0].userid));
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          '',
          'Do you want to Leave this page?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );

        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const resultArray = [];
      setIsLoading(true);
      studentData?.forEach(obj => {
        const existingObject = resultArray.find(
          item => item.studentid === obj.studentid,
        );

        if (existingObject) {
          existingObject.count = (existingObject.count || 1) + 1;
        } else {
          resultArray.push({...obj, count: 1});
        }
      });

      console.log('resultArray--->', resultArray);
      const students = [...resultArray];
      if (students?.length > 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

        setStudentList(students);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }, [studentData]),
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setTimeout(() => {
  //       setIsLoading(true);
  //     }, 3000);
  //   }, []),
  // );

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const fetchData = () => {
      if (isLoading) {
      } else if (studentList && studentList?.length > 0) {
        showMessage({
          message: `ଏପର୍ଯ୍ୟନ୍ତ... ଆପଣ ${
            studentList ? studentList?.length : 0
          } ଜଣ ଶିକ୍ଷାର୍ଥୀଙ୍କର ପଞ୍ଜୀକରଣ କରିଅଛନ୍ତି । ହାସଲ କରିଥିବା କଏନ: ${userCoins} ଆପଣ ଏହିପରି ଅନ୍ୟଶିକ୍ଷାର୍ଥୀଙ୍କୁ ପଞ୍ଜୀକରଣ କରି ଗୁଣାତ୍ମକ ଶିକ୍ଷଣର ସୁଯୋଗ ଦେଇପାରିବେ ।`,
          type: 'info',
          backgroundColor: Colors.success,
          duration: 5000,
        });

        return () => hideMessage();
      }
    };

    fetchData();
  }, [studentList]);
  const reversedStudentList = [...studentList].reverse();

  return (
    <>
      <ScrollView>
        {isLoading ? (
          <Loading />
        ) : studentData?.length === 0 ? (
          <Nocontents />
        ) : (
          <>
            {studentList.map((item, index) => {
              return (
                <View
                  style={{
                    width: window.WindowWidth * 0.9,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderColor: '#666666',
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    margin: 10,
                    top: '1%',
                  }}>
                  <TouchableOpacity
                    key={item._id}
                    onPress={() =>
                      navigation.navigate('studentassessment', {data: item})
                    }>
                    <View style={styles.card}>
                      <View style={styles.subModuContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            // justifyContent: 'space-evenly',
                          }}>
                          <View>
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                }}>
                                <FontAwesome
                                  name="user-circle"
                                  size={35}
                                  color={Color.royalblue}
                                />
                                <Text
                                  style={[
                                    styles.name,
                                    {maxWidth: window.WindowWidth * 0.9},
                                  ]}>
                                  {item.studentname}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}>
                              <Text style={styles.pogram}>
                                Program -
                                <Text style={{textTransform: 'uppercase'}}>
                                  {item.program}
                                </Text>
                              </Text>
                              <View
                                style={
                                  {
                                    // alignSelf: 'flex-end',
                                    // alignItems: 'flex-end',
                                  }
                                }>
                                <Entypo
                                  name="chevron-thin-right"
                                  size={25}
                                  color={Color.royalblue}
                                  style={{
                                    alignSelf: 'flex-end',
                                    left: '190%',
                                    // right: 0,
                                    // left: 0,
                                  }}
                                />
                              </View>
                            </View>

                            {item.program == 'pge' ? (
                              <Text style={styles.class}>
                                Class - {item.class}
                              </Text>
                            ) : (
                              <Text style={styles.class}>
                                Level - {item.class}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
            {/* {studentList?.length > 0 ? (
              <>
                <View
                  style={{
                    width: window.WindowWidth * 0.92,
                    alignSelf: 'center',
                    // top: 50,
                    margin: 10,
                    top: '1%',
                    backgroundColor: Color.ghostwhite,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Color.royalblue,
                  }}>
                  <Text style={styles.text1}>ଶିକ୍ଷାର୍ଥୀ ଚୟନ କରନ୍ତୁ </Text>
                </View>
              
              </>
            ) : (
              <Nocontents />
            )} */}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default StudentListPage;

const styles = StyleSheet.create({
  subModuContainer: {
    padding: 10,
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
    // letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsMedium,
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
  name: {
    fontSize: 19,
    color: '#000',
    fontFamily: FontFamily.poppinsMedium,
    textTransform: 'capitalize',
    paddingBottom: 5,
    maxWidth: '100%',
    paddingLeft: 20,
  },
  pogram: {
    fontSize: 11,
    color: Colors.darkslategray_200,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textTransform: 'capitalize',
    // fontSize: FontSize.size_smi,
    // left: '25%',
    color: Color.dimgray_100,
    paddingTop: 5,
    paddingBottom: 5,
    alignSelf: 'flex-start',
    right: '50%',
    // marginTop: 10,
  },
  register: {
    paddingTop: 30,
    left: '25%',
    fontSize: 11,
    color: Color.darkslategray_200,
    color: Color.dimgray_100,
    fontSize: FontSize.size_smi,
    textTransform: 'capitalize',
  },
  text1: {
    // flexDirection: 'row',
    // marginTop: 15,
    textAlign: 'center',
    // alignSelf: 'center',
    // backgroundColor: Color.white,
    top: '17.5%',
    paddingBottom: 20,
    // paddingTop: 15,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 20,

    color: 'black',
    fontFamily: FontFamily.poppinsSemibold,
  },
  class: {
    marginTop: 5,
    fontSize: 11,
    color: Colors.darkslategray_200,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: Colors.dimgray_100,
    left: '17%',
  },
});
