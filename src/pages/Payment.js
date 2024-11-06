import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  BackHandler,
  Image,
  Dimensions,
} from 'react-native';
import Color from '../utils/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {useEffect, useState, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../utils/Colors';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Modals from '../components/Modals';
import PaymentAccordion from '../components/PaymentAccordian';
import {FontFamily} from '../GlobalStyle';
import * as types from '../redux_toolkit/features/users/UserSlice';
import Loading from '../components/Loading';
import {
  fetchPaymentDetails,
  savePaymentDetails,
  fetchUserDataThunk,
} from '../redux_toolkit/features/users/UserThunk';
import {fetchStudentsDataThunk} from '../redux_toolkit/features/students/StudentThunk';
import {useFocusEffect} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;

const Payment = ({route, navigation}) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const modalHeight = window.WindowHeigth * 0.9;
  const [selectedStudent, setSlectedStudent] = useState({});
  const [modalStatus, setModalStatus] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inputTotalAmount, setInputTotalAmount] = useState(0);
  const [inputPaidAmount, setInputPaidAmount] = useState(0);
  const [paidAmount, setPayedAmount] = useState(0);
  const [paindingAmount, setPaindingAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customModal, setCustomModal] = useState(true);
  const [paymentRecord, setPaymentRecord] = useState([]);
  const [studentData, setStudentData] = useState([]);
  console.log('studentData_UseState', studentData);
  const studentList = useSelector(state => state.StudentSlice.students);
  // console.log('student_List_payment---->', studentList);
  const teacherdata = useSelector(state => state.UserSlice.user);
  console.log('teacherdata-------------->', teacherdata?.data?.resData);
  // const studentData = useSelector(state => state.UserSlice?.payments);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherdata[0]?.userid) {
        console.warn('User ID is undefined.');
        return;
      }
      console.log(
        'Fetching payment details for user ID:',
        teacherdata[0].userid,
      );
      setIsLoading(true);

      try {
        const response = await API.get(
          `getstudentswithpaymentdetails/${teacherdata[0].userid}`,
        );
        console.log('Fetched payment data:', response.data.data);
        setStudentData(response.data.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teacherdata]);

  useEffect(() => {
    if (!teacherdata[0]?.userid) {
    } else {
      dispatch(fetchPaymentDetails(teacherdata[0]?.userid));
    }
  }, [teacherdata]);

  useFocusEffect(
    useCallback(() => {
      try {
        dispatch(fetchStudentsDataThunk(teacherdata[0]?.userid));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching or modifying student data:', error);
      } finally {
        setIsLoading(false);
      }
    }, [teacherdata, studentData]),
  );

  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);
  //
  const savePayment = () => {
    if (inputTotalAmount <= 0 || inputPaidAmount <= 0) {
      Alert.alert('Info', 'Please enter valid amounts for payment!');
      return;
    }

    const newPaidAmount = parseInt(paidAmount) + parseInt(inputPaidAmount);
    const newTotalPayment = inputTotalAmount || totalAmount;

    if (newTotalPayment < newPaidAmount) {
      Alert.alert('Info', 'Paid amount cannot exceed total amount.');
      return;
    }

    const data = {
      userid: selectedStudent.userid,
      username: selectedStudent.username,
      studentid: selectedStudent.studentid,
      studentname: selectedStudent.studentname,
      program: selectedStudent.program,
      class: selectedStudent.class,
      registration_date: selectedStudent.registration_date,
      total_amount: newTotalPayment,
      amount: inputPaidAmount,
      status: newTotalPayment === newPaidAmount,
    };

    API.post(`savetchpaymentdetails/`, data)
      .then(res => {
        if (res.status === 200) {
          Alert.alert('Info', 'Payment saved successfully!');
          // Optionally reset state or update UI after successful save
        } else {
          Alert.alert('Error', 'Failed to save payment. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error saving payment:', error);
        Alert.alert('Error', 'An unexpected error occurred.');
      });
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (studentData?.length === 0) {
        setCustomModal(true);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [studentData]);

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      {isLoading && !teacherdata[0]?.userid && !studentData ? (
        <Loading />
      ) : studentData && studentData.length > 0 ? (
        <View>
          <FlatList
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={40}
            data={studentData}
            renderItem={({item, index}) => (
              <PaymentAccordion
                studentName={item.studentname}
                className={item.class}
                program={item.program}
                navigation={navigation}
                totalAmount={item.totalpayment.totalamount}
                paidAmount={item.totalpayment.totalpaid}
                paymentDetails={item}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.noStudentContainer}>
          <Image
            source={require('../assets/Image/StudentPayments.jpg')} // replace with your image path
            style={styles.noStudentImage}
            resizeMode="contain"
          />
          <Text style={styles.Fln}>No Students</Text>
        </View>
      )}
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 30,
  },
  Flngati: {
    alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,
    height: 150,
    // width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    // textAlign: 'center',
    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  FlngatiText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    marginTop: 20,
  },

  tinyLogo: {
    width: 155,
    height: 112,
    marginRight: 60,
  },
  payment: {
    flexDirection: 'row',
    // paddingBottom: 40,
    paddingTop: 20,
  },
  view: {
    width: 110,
    // height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,

    backgroundColor: 'white',
    color: Colors.primary,
    fontSize: 17,
    textAlign: 'center',
    justifyContent: 'center',

    marginRight: 30,
    fontWeight: 'bold',
    // 137BD4, 7897B2
  },
  pay: {
    width: 110,
    // height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    color: 'white',
    borderWidth: 1,
    fontSize: 17,
    textAlign: 'center',

    justifyContent: 'center',

    fontWeight: 'bold',
  },
  viewdata: {
    alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,

    // height: 190,
    // width: '100%',
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
    marginTop: 90,
    boxShadow: 20,
  },
  viewdatas: {
    alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,

    height: 550,
    // width: '100%',
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
    marginTop: 90,
    boxShadow: 20,
  },
  Text: {
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  submitText: {
    paddingTop: 20,
    paddingBottom: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 16,
  },
  Textinput: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    marginTop: 20,
    borderColor: 'white',
    width: 320,
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginLeft: 30,
    borderRadius: 10,
  },
  noStudentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  noStudentImage: {
    width: windowWidth * 0.8, // 60% of the screen width
    height: windowWidth * 0.8, // 60% of the screen width (keeps it square)
  },
  Fln: {
    color: '#595F65',
    fontSize: 18,
    // top: 50,
    // marginTop: 160,
    fontFamily: FontFamily.poppinsMedium,
    // paddingBottom: 40,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: 370,
    // paddingLeft: 20,
    // paddingRight: 40,
    textAlign: 'center',
    alignSelf: 'center',
    bottom: 0,
  },
});
