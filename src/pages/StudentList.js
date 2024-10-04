import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  SafeAreaView,
  Dimensions,
  BackHandler,
} from 'react-native';
import axios from 'axios';
import Colors from '../utils/Colors';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {FontFamily, FontSize, Border, Color} from '../GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';
import * as window from '../utils/dimensions';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../components/SearchBar';
import Norecord from '../components/Norecord';
import InputModal from '../components/InputModal';
import Api from '../environment/Api';
import Loading from '../components/Loading';
import {openDatabase} from 'react-native-sqlite-storage';
import {app_versions} from './Home';
import {
  deleteStudentsDataThunk,
  fetchStudentsDataThunk,
} from '../redux_toolkit/features/students/StudentThunk';

const StudentList = ({navigation, route}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const teacherdata = useSelector(state => state.UserSlice.user);
  console.log('studentData list---->', teacherdata);
  const studentData = useSelector(state => state.StudentSlice.students);
  console.log('studentData list1---->', studentData);
  const isLoading = useSelector(state => state.StudentSlice.loading);

  const [customModal, setCustomModal] = useState(true);
  const [modal, setModal] = useState(false);
  // console.log('modal---------->', studentData);
  const [verifiedModalStatus, setVerifiedModalStatus] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [roll_number_error, set_roll_number_error] = useState(false);
  const [change, setChange] = useState([]);
  const [verifiedStudent, setVerifiedStudent] = useState({});
  // console.log('studentList----------->', studentList);
  const [studentName, setStudentName] = useState('');
  const [clas, setClas] = useState('');

  const sortedStudentList = [...studentList];

  sortedStudentList.sort((a, b) => {
    // If a's otp_isverified is false and b's is true, a comes first
    if (a.otp_isverified === false && b.otp_isverified === true) {
      return -1;
    } else if (a.otp_isverified === true && b.otp_isverified === false) {
      return 1;
    } else {
      // When otp_isverified values are the same, sort alphabetically by 'aa'
      const nameA = a?.studentname?.toLowerCase(); // Assuming 'name' is the property to sort
      const nameB = b?.studentname?.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }
  });

  //Sqlite Storage
  var db = openDatabase({name: 'StudentDatabase.db'});
  let [flatListItems, setFlatListItems] = useState([]);
  console.log('flatListItems--->', flatListItems);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
          var temp = [];
          var uniqueStudentIds = new Set();

          for (let i = 0; i < results.rows.length; ++i) {
            const item = results.rows.item(i);
            // Check if the studentid is already in the set
            if (!uniqueStudentIds.has(item.studentid)) {
              // Add the item to the array and set to ensure uniqueness
              temp.push(item);
              uniqueStudentIds.add(item.studentid);
            }
          }

          setFlatListItems(temp);
        });
      });
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      dispatch(fetchStudentsDataThunk(teacherdata[0].userid));
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      studentData ? setStudentList(studentData) : null;
    }, [studentData, navigation]),
  );

  const listItemDeletePressed = data => {
    const {studentid, studentname, otp_isverified} = data;
    const datas = {
      userid: teacherdata[0].userid,
      studentid: studentid,
      studentname: studentname,
      class: data.class,
      otp_isverified: otp_isverified,
    };
    console.log('datas--->', datas);
    console.log('data--->', data);

    setStudentName(data.studentname);
    setClas(data.clas);

    Alert.alert(
      data.studentname,
      'ଙ୍କ ବିବରଣୀ କାଟିବାକୁ ଚାହୁଁଛନ୍ତି ?',

      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {
          text: 'Ok',

          onPress: async () => (
            dispatch(deleteStudentsDataThunk(datas)),
            dispatch(fetchStudentsDataThunk(teacherdata[0].userid)),
            db.transaction(
              tx => {
                tx.executeSql(
                  'DELETE FROM table_user WHERE studentid=?',
                  [datas.studentid],
                  (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Success',
                        'User deleted successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => null,
                          },
                        ],
                        {cancelable: false},
                      );
                      // Update the local state after deletion
                      setFlatListItems(prevItems =>
                        prevItems.filter(
                          item => item.studentid !== datas.studentid,
                        ),
                      );
                    } else {
                      alert('Please insert a valid SRTUDENT Id');
                    }
                  },
                );
              },
              error => {
                console.error('Error during transaction', error);
              },
            ),
            await deleteStudentFromAsyncStorage(datas)
          ),

          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const listItemUpdatePressed = item => {
    navigation.navigate('studentregister', {updateData: item});
    console.log('item online---------------', item);
  };

  const searchStudent = text => {
    if (text != null && text != undefined && text.length >= 0) {
      let newdata = studentData.filter(item => {
        return item.studentname
          .toLocaleLowerCase()
          .includes(text.toLocaleLowerCase());
      });
      setStudentList(newdata);
    } else {
      setStudentList(studentData);
    }
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  const verifiyOTP = data => {
    console.log(data, data.length, 'jsgdbjgddgjdjgjgds=========>');
  };

  const resendOtp = () => {
    var rollno = 'TZ' + Math.floor(1000 + Math.random() * 9000);
    console.log('rollno------------------: ', rollno);
    var urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=TR&template_id=11454&sender_id=THNKZN&language=UC&template=%E0%AC%A5%E0%AC%BF%E0%AC%99%E0%AD%8D%E0%AC%95%E0%AC%9C%E0%AD%8B%E0%AC%A8%E0%AD%8D+%E0%AC%B0%E0%AD%87+${verifiedStudent.studentname}%E0%AC%B0+%E0%AC%A8%E0%AC%BE%E0%AC%AE+%E0%AC%AA%E0%AC%9E%E0%AD%8D%E0%AC%9C%E0%AD%80%E0%AC%95%E0%AC%B0%E0%AC%A3+%E0%AC%95%E0%AC%B0%E0%AC%BF%E0%AC%AC%E0%AC%BE%E0%AC%B0+%E0%AC%B0%E0%AD%8B%E0%AC%B2+%E0%AC%A8%E0%AC%AE%E0%AD%8D%E0%AC%AC%E0%AC%B0+%E0%AC%B9%E0%AD%87%E0%AC%89%E0%AC%9B%E0%AC%BF+${rollno}+%E0%A5%A4+%E0%AC%8F%E0%AC%B9%E0%AC%BE%E0%AC%95%E0%AD%81+%E0%AC%B6%E0%AC%BF%E0%AC%95%E0%AD%8D%E0%AC%B7%E0%AC%95+${teacherdata[0].username}%20 %E0%AC%99%E0%AD%8D%E0%AC%95%E0%AD%81+%E0%AC%A6%E0%AD%87%E0%AC%87+%E0%AC%AA%E0%AC%9E%E0%AD%8D%E0%AC%9C%E0%AD%80%E0%AC%95%E0%AC%B0%E0%AC%A3+%E0%AC%A8%E0%AC%BF%E0%AC%B6%E0%AD%8D%E0%AC%9A%E0%AC%BF%E0%AC%A4+%E0%AC%95%E0%AC%B0%E0%AC%A8%E0%AD%8D%E0%AC%A4%E0%AD%81+%E0%A5%A4+ThinkZone&contact_numbers=${verifiedStudent.phone}`;

    axios.get(urls).then(response => {
      if (response.data.code === 200) {
        ToastAndroid.show('Roll number generate success.', ToastAndroid.SHORT);
        Api.put(`updatestudentotp/${verifiedStudent._id}/${rollno}`).then(
          response => {
            setChange(response.data);
          },
        );
      } else {
        ToastAndroid.show(
          'Roll number generate error. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    });
  };

  const reversedStudentList = [...studentList].reverse();

  const handleVerifyChange = value => {
    setChange(value);
    set_roll_number_error(false);
    console.log('value---->', value, value.length);
    if (value.length === 6) {
      const body = {
        id: verifiedStudent._id,
        otp: value,
        userid: teacherdata[0].userid,
        studentname: verifiedStudent.studentname,
        class: verifiedStudent.class,
        phone: verifiedStudent.phone,
        appVersion: app_versions,
      };
      console.log('body--->', body);

      Api.post('verifystudentotp', body).then(response => {
        console.log('response.data--->', response.data);
        if (response.data.status == 'success') {
          dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
          setVerifiedModalStatus(false);
          setModal(true);
          setVerifiedModalStatus(false);
          showMessage({
            message: `Roll number verified.`,
            // description: 'Successfully student deleted.',
            type: 'success',
            backgroundColor: Colors.success,
          });
        } else {
          showMessage({
            message: `Wrong roll number.`,
            type: 'danger',
            backgroundColor: Colors.danger,
          });
          set_roll_number_error(true);
          // ToastAndroid.show('Wrong roll number.', ToastAndroid.SHORT);
          setModal(false);
          setVerifiedModalStatus(true);
        }
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <View style={{marginTop: -3}}>
              <View>
                <View style={styles.editFormContainer}>
                  {studentData.length != 0 && (
                    <SearchBar
                      placeholder="Search Student"
                      onChangeText={text => searchStudent(text)}
                      keyboardType="default"
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => navigation.navigate('studentregister')}
                    style={{
                      width: windowWidth * 0.95,
                      paddingBottom: 30,
                      borderRadius: 10,
                      top: 10,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      justifyContent: 'space-evenly',
                      marginBottom: 20,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../assets/Image/iconusersprofileadd.png')}
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#333333',
                            alignSelf: 'center',
                            top: 20,
                            textTransform: 'capitalize',
                            paddingLeft: 10,
                            fontFamily: FontFamily.poppinsMedium,
                            width: 250,
                          }}>
                          Register New Student
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,

                            paddingLeft: 12,
                            textAlign: 'left',
                            top: 20,
                            fontFamily: FontFamily.poppinsMedium,
                            color: '#666666',
                          }}>
                          Tap here to add a new student
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {studentList.length === 0 ? (
                    <Norecord />
                  ) : (
                    <>
                      {verifiedModalStatus && (
                        <InputModal
                          Title={'Roll No Verification'}
                          description={`We Will send you a roll number on 
       +91-${verifiedStudent.phone}`}
                          visible={verifiedModalStatus}
                          onClose={() => {
                            set_roll_number_error(false);
                            setVerifiedModalStatus(false);
                          }}
                          // onClose={resendOtp}
                          onSubmit={verifiyOTP}
                          onEdit={resendOtp}
                          onChangeText={handleVerifyChange}
                          maxLength={6}
                          roll_number_error={roll_number_error}
                        />
                      )}

                      {sortedStudentList.map((item, index) => (
                        <View key={index} style={styles.contener}>
                          <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('callresponseList', {
                                  item,
                                });
                              }}>
                              <Image
                                style={styles.call}
                                source={require('../assets/Image/Group-call.png')}
                              />
                            </TouchableOpacity>
                            <View
                              style={{
                                top: 15,
                              }}>
                              <Text style={styles.name}>
                                {item.studentname}
                              </Text>
                            </View>

                            <View style={{}}>
                              {item?.otp_isverified == true ? (
                                <View onPress={() => {}}>
                                  <Text style={styles.verifi}>
                                    Verified{' '}
                                    <AntDesign
                                      name="checkcircle"
                                      size={14}
                                      color={'#A3D735'}
                                    />
                                  </Text>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    setVerifiedStudent(item);
                                    setVerifiedModalStatus(true);
                                  }}
                                  style={{
                                    top: 5,

                                    right: -25,

                                    width: 110,

                                    backgroundColor: Color.royalblue,
                                    flexDirection: 'row',
                                    borderRadius: 5,

                                    height: 25,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      color: 'white',

                                      textTransform: 'capitalize',

                                      fontFamily: FontFamily.poppinsMedium,
                                      paddingRight: 5,
                                      paddingLeft: 10,
                                      top: 2,
                                      fontWeight: '900',
                                      textAlign: 'center',
                                    }}>
                                    Verify Now{' '}
                                  </Text>
                                  <Entypo
                                    name="warning"
                                    size={14}
                                    color={'#FF9515'}
                                    style={{top: 4}}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignSelf: 'flex-end',
                              justifyContent: 'flex-end',
                              right: 5,
                              top: 10,
                              marginLeft: 30,
                            }}>
                            <TouchableOpacity
                              onPress={() => listItemUpdatePressed(item)}
                              updateButton={true}
                              bgcolor={Color.success}
                              style={styles.editIcon}>
                              <FontAwesome5
                                name="edit"
                                size={22}
                                color={Color.royalblue}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => listItemDeletePressed(item)}
                              deleteButton={true}
                              bgcolor={Color.danger}
                              style={styles.delIcon}>
                              <MaterialIcons
                                name="delete"
                                size={29}
                                color={'#eb3875'}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              paddingTop: 10,
                            }}>
                            <Text style={styles.pogram}>
                              Program :
                              <Text style={{textTransform: 'uppercase'}}>
                                {item.program}
                              </Text>
                            </Text>

                            {item.program == 'pge' ? (
                              <Text style={styles.class}>
                                Class : {item.class}
                              </Text>
                            ) : (
                              <Text style={styles.class}>
                                Level : {item.class}
                              </Text>
                            )}
                            <Text style={styles.register}>
                              Registered on :
                              <Text style={{textTransform: 'uppercase'}}>
                                {moment(item.createdon).format('DD/MM/YY')}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              </View>
            </View>
            {/* )} */}
          </>
        )}

        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                {
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
                {teacherdata[0].username}
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
                ଆପଣ ସଫଳତାର ସହ {verifiedStudent.studentname} ଙ୍କ{' '}
                {verifiedStudent.class}ଶ୍ରେଣୀ ରେ ପଞ୍ଜୀକରଣ କରିଛନ୍ତି ଏବଂ ୪ଟି କଏନ
                ହାସଲ କରିଛନ୍ତି ।
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModal(false);
                  navigation.navigate('myachievement', {
                    type: 'myachievement',
                  });
                }}
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
                onPress={() => setModal(false)}
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
      </ScrollView>
    </SafeAreaView>
  );
};
export default StudentList;
const styles = StyleSheet.create({
  contener: {
    flex: 1,
    padding: 10,
    width: window.WindowWidth * 0.95,

    marginTop: 25,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: 'white',
    alignSelf: 'center',

    borderRadius: 10,
    paddingEnd: 5,
    paddingBottom: 15,
  },
  call: {
    width: 50,
    height: 50,
    marginLeft: 20,
    marginTop: 20,
  },
  name: {
    fontSize: 14,
    color: '#000',
    left: '25%',
    left: 20,
    fontFamily: FontFamily.poppinsMedium,

    textAlign: 'left',

    width: 120,

    textTransform: 'capitalize',
    paddingBottom: 20,
    flexDirection: 'row',
  },
  pogram: {
    fontSize: 11,
    color: Color.darkslategray_200,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',

    textTransform: 'capitalize',

    left: '25%',
    color: Color.dimgray_100,
    paddingTop: 10,
  },
  register: {
    left: '25%',
    fontSize: 11,
    color: Color.darkslategray_200,
    color: Color.dimgray_100,
    fontSize: FontSize.size_smi,
    textTransform: 'capitalize',
  },
  class: {
    fontSize: 11,
    color: Color.darkslategray_200,
    left: '25%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',

    position: 'absolute',
    textTransform: 'capitalize',
    color: Color.dimgray_100,
  },

  editIcon: {
    marginTop: -30,
    width: 30,
    height: 30,
  },
  delIcon: {marginLeft: 25, marginTop: -32},
  verify: {
    fontSize: 14,
    marginTop: 5,
    height: 70,
    right: '55%',

    position: 'absolute',

    paddingRight: 35,
    color: Color.royalblue,
    fontFamily: FontFamily.poppinsMedium,
  },
  verif: {
    fontSize: 11,
    marginTop: 8,
    height: 70,
    left: '-20%',
    marginLeft: 20,
    position: 'absolute',
    right: 10,
    color: Color.royalblue,
    marginLeft: 179,

    fontFamily: FontFamily.poppinsMedium,
  },
  verifi: {
    fontSize: 14,
    marginTop: 10,

    marginLeft: 60,
    position: 'absolute',
    fontWeight: '700',
    color: '#A3D735',
    textAlign: 'right',
    fontFamily: FontFamily.poppinsMedium,
  },
  editFormContainer: {},
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    top: 15,
  },
  progress: {
    right: 20,
    position: 'absolute',
    marginRight: 18,
  },
});
