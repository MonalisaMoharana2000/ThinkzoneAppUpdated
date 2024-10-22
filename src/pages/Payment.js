import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Color from '../utils/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {useEffect, useState, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import * as studentstypes from '../redux/slices/StudentSlice';
import Colors from '../utils/Colors';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Norecord from '../components/Norecord';
import Modals from '../components/Modals';
import PaymentAccordion from '../components/PaymentAccordian';
import {FontFamily} from '../GlobalStyle';
// import * as types from '../redux/slices/UserSlice';
import * as types from '../redux_toolkit/features/users/UserSlice';
import Loading from '../components/Loading';
import {
  fetchPaymentDetails,
  savePaymentDetails,
  fetchUserDataThunk,
} from '../redux_toolkit/features/users/UserThunk';

const Payment = ({route, navigation}) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [selectedStudent, setSlectedStudent] = useState({});
  const [modalStatus, setModalStatus] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inputTotalAmount, setInputTotalAmount] = useState(0);
  const [inputPaidAmount, setInputPaidAmount] = useState(0);
  const [paidAmount, setPayedAmount] = useState(0);
  const [paindingAmount, setPaindingAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customModal, setCustomModal] = useState(true);
  // const [studentData, setStudentData] = useState([]);
  const [paymentRecord, setPaymentRecord] = useState([]);
  // const studentData = useSelector(state => state.studentdata.students);
  const teacherdata = useSelector(
    state => state.UserSlice?.user?.data?.resData,
  );
  console.log('teacherdata-------------->', teacherdata);

  const modalHeight = window.WindowHeigth * 0.9;

  useEffect(() => {
    dispatch(fetchUserDataThunk());
    // dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
    // API.get(`getstudentswithpaymentdetails/${teacherdata[0].userid}`).then(
    //   response => {
    //     setStudentData(response.data.data);
    setIsLoading(false);
    //   },
    //   error => {
    //     setIsLoading(false);
    //   },
    // );
    if (!teacherdata[0]?.userid) {
    } else {
      dispatch(fetchPaymentDetails(teacherdata[0]?.userid));
    }
  }, []);

  const studentData = useSelector(state => state.UserSlice?.payments);
  // //console.log('paymentdata---->', studentData);

  // Get Payments Deatils.
  const getPayDetails = item => {
    setSlectedStudent(item);
    setPayedAmount(0);
    setTotalAmount(0);
    setPaymentRecord([]);
    setModalStatus(false);
    handleOpenBottomSheet();
    //thinkzone.in.net/thinkzone/getalltchpaymentdetailsbystudentid/1667819009430
    //
    setIsLoading(true);
    API.get(`getalltchpaymentdetailsbystudentid/${item.studentid}`).then(
      response => {
        //
        setPaymentRecord(response.data);
        setIsLoading(false);
        const paidAmount = response.data.reduce(
          (preValue, curValue) => preValue + curValue.amount,
          0,
        );
        const totalAmount = response.data ? response.data[0].total_amount : 0;
        setPayedAmount(paidAmount);
        setTotalAmount(totalAmount);
        //
      },
      err => {
        //
      },
    );
  };

  // Post payment details.
  const postPaymentDetails = item => {
    setSlectedStudent(item);
    setPayedAmount(0);
    setTotalAmount(0);
    setPaindingAmount(0);
    setPaymentRecord([]);
    setModalStatus(true);
    API.get(`getalltchpaymentdetailsbystudentid/${item.studentid}`).then(
      response => {
        //
        setPaymentRecord(response.data);
        const paidAmount = response.data.reduce(
          (preValue, curValue) => preValue + curValue.amount,
          0,
        );
        const totalAmount = response.data ? response.data[0].total_amount : 0;
        setPayedAmount(paidAmount);
        setTotalAmount(totalAmount);
        setPaindingAmount(totalAmount - paidAmount);
        //
      },
      err => {
        //
      },
    );
    //
    handleOpenBottomSheet();
  };
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);
  //
  const savePayment = () => {
    if (inputTotalAmount == 0 && inputPaidAmount == 0) {
      Alert.alert('info', 'Please add your amount!!!');
    } else {
      if (totalAmount !== 0 && totalAmount == paidAmount) {
        Alert.alert('info', 'All dues are cleared !!!');
      } else {
        //
        let newPaidAmount = parseInt(paidAmount) + parseInt(inputPaidAmount);
        let newTotalPayment = inputTotalAmount ? inputTotalAmount : totalAmount;
        let payMentStatus = false;
        Alert.alert('Info', 'Payment Success!!', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
        //
        //
        if (newTotalPayment == newPaidAmount) {
          payMentStatus = true;
          // Alert.alert('Payment Success!!');
        } else {
          payMentStatus = false;
        }
        if (newTotalPayment < newPaidAmount) {
          Alert.alert('Please Enter a Valid Input');
        } else {
          //

          let data = {
            userid: selectedStudent.userid,
            username: selectedStudent.username,
            studentid: selectedStudent.studentid,
            studentname: selectedStudent.studentname,
            program: selectedStudent.program,
            class: selectedStudent.class,
            registration_date: selectedStudent.registration_date,
            total_amount: inputTotalAmount ? inputTotalAmount : totalAmount,
            amount: inputPaidAmount,
            status: payMentStatus,
          };

          API.post(`savetchpaymentdetails/`, data).then(res => {
            if (res.status === 200) {
              console.log('response got-------------------->', res.data);
            } else {
              console
                .log('response status got-------------------->', res.status)
                .catch(error => {
                  console.error(
                    'The error in saving payment---------->',
                    error,
                  );
                });
            }
          });
          setInputTotalAmount(0);
        }
      }
    }
  };
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (studentData.length === 0) {
        setCustomModal(true);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [studentData]);

  //console.log(
  //   '----------------------------------------------------------------------------------',
  // );
  //console.log('isLoading------------->', isLoading);
  //console.log('studentData.length------------->', studentData.length);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {studentData.length > 0 ? (
            <>
              {modalStatus ? (
                <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
                  <LinearGradient
                    colors={['#4286f4', '#373b44']}
                    style={styles.viewdatas}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.Text}>
                        Total Amount :{totalAmount}
                      </Text>
                      <Text style={styles.Text}>Paid Amount :{paidAmount}</Text>
                      <Text style={styles.Text}>
                        Pending Amount :{paindingAmount}
                      </Text>

                      {totalAmount == 0 && (
                        <AppTextInput
                          style={styles.Textinput}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="number-pad"
                          name="name"
                          placeholder="Total Amount"
                          value={inputTotalAmount}
                          onChangeText={value => setInputTotalAmount(value)}
                        />
                      )}
                    </View>

                    <View style={styles.modalContainer}>
                      <AppTextInput
                        style={styles.Textinput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="number-pad"
                        name="name"
                        placeholder="Pay Amount"
                        value={inputPaidAmount}
                        onChangeText={value => setInputPaidAmount(value)}
                      />
                      <TouchableOpacity
                        onPress={savePayment}
                        style={styles.submit}>
                        <Text style={styles.submitText}>SAVE</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </ButtomSheet>
              ) : (
                <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
                  {paymentRecord ? (
                    <LinearGradient
                      colors={['#4286f4', '#373b44']}
                      style={styles.viewdata}>
                      <Text style={styles.Text}>
                        Total Amount: {totalAmount}
                      </Text>
                      <Text style={styles.Text}>Paid Amount: {paidAmount}</Text>

                      <FlatList
                        data={paymentRecord}
                        renderItem={({item, index}) => (
                          <View>
                            <Text style={styles.Text}> {item.amount}</Text>
                          </View>
                        )}
                      />
                    </LinearGradient>
                  ) : (
                    <Text style={[styles.Text, {color: 'red'}]}>
                      No Data Available
                    </Text>
                  )}
                </ButtomSheet>
              )}
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
            </>
          ) : (
            <Modals
              visible={customModal}
              heading={'No Student Available'}
              backgroundColor={Colors.white}
              onpressok={closeModal}
              okstatus={true}
            />
          )}
        </>
      )}
    </>
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
});
