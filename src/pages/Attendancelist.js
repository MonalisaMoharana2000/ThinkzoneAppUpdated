import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  Pressable,
  Image,
} from 'react-native';
import moment from 'moment';

import React, {useEffect, useState} from 'react';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import {useDispatch, useSelector} from 'react-redux';

import {style} from 'd3';
import Colors from '../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {fetchStudentsAttendanceThunk} from '../redux_toolkit/features/students/StudentThunk';
const Attendancelist = ({navigation}) => {
  const date = new Date();
  const [dob, setDob] = useState(new Date());

  const [todayatt, setTodayatt] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.StudentSlice.loading);
  const user = useSelector(state => state.UserSlice.user);
  const attendance = useSelector(state => state.StudentSlice.attendancedate);

  const attendDate = attendance.map(item => {
    const jki = new Date(item);

    return jki.getDate() + '/' + jki.getMonth() + 1 + '/' + jki.getFullYear();
  });

  const check = new Date(dob);

  const checkDate =
    check.getDate() + '/' + check.getMonth() + 1 + '/' + check.getFullYear();

  //
  // console.log("attendance--->",attendance)

  const checkCalendar = attendDate.filter(el => el === checkDate);

  // console.log(
  //   'filter-->',
  //   attendDate.filter(el => el === checkDate),
  // );

  let currentDate =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  useEffect(() => {
    // dispatch(
    //   studenttypes.getAttendanceListStart({
    //     userid: user[0].userid,
    //     attendancedate: currentDate,
    //   }),
    // );
    dispatch(
      fetchStudentsAttendanceThunk({
        userid: user[0].userid,
        // userid: 'pinkurajesh88@gmail.com',
        attendancedate: currentDate,
      }),
    );
  }, []);

  return (
    <>
      {isLoading ? (
        // <ActivityIndicator
        //   size="large"
        //   color={Color.primary}
        //   style={{justifyContent: 'center', alignContent: 'center'}}
        // />
        <Loading />
      ) : attendance.length === 0 ? (
        <Nocontents />
      ) : (
        <View style={{marginTop: 20}}>
          <FlatList
            data={attendance}
            renderItem={({item}) => (
              <Pressable
                onPress={() =>
                  navigation.navigate('attendancelist', {
                    // navigation.navigate('Attendancelist', {
                    takeAttendance: false,
                    userid: user[0].userid,
                    date: item,
                  })
                }>
                <View style={styles.card}>
                  <Text style={styles.listtext}>
                    {moment(item).format('DD/MM/YYYY')}
                  </Text>
                  <Ionicons
                    name="md-checkmark-done-circle-sharp"
                    size={20}
                    color={Colors.success}
                    style={[styles.icon, {marginRight: 10}]}
                  />
                </View>
              </Pressable>
            )}></FlatList>
        </View>
      )}
      {/* {attendanceList.length > 0 ? ( */}
    </>
  );
};

export default Attendancelist;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    height: 50,
    width: 340,
    backgroundColor: Colors.white,

    borderRadius: 10,
    // marginBottom: 409,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 39,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 71,
    marginBottom: 22,
    paddingBottom: 18,
    backgroundColor: '#677880',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 70,
    marginBottom: 12,
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    color: 'white',
    paddingLeft: 8,
  },
  dob: {
    // backgroundColor: '#7393B3',
    // backgroundColor: '#5e90af',
    todayBackgroundColor: Color.royalblue,
    selectedDayColor: Color.royalblue,
    selectedDayTextColor: Color.royalblue,
    marginBottom: 27,
    marginTop: 30,
    // marginLeft: 15,
    // marginRight: 15,
    // borderRadius: 12,
    // boxShadow: 2,
  },

  listtext: {
    paddingLeft: 15,
    textAlign: 'center',
    // color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FontFamily.poppinsMedium,
  },
  listtext1: {
    paddingLeft: 15,
    textAlign: 'center',
    color: Colors.black,
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 18,
    backgroundColor: '',
  },
});
