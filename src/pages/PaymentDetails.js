import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  Modal,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';

// import AppTextInput from '../components/TextInput';
// import DatePicker from 'react-native-datepicker';
import Entypo from 'react-native-vector-icons/Entypo';

// import Color from '../utils/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {useEffect, useState, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import * as studentstypes from '../redux/slices/StudentSlice';
import * as studentstypes from '../redux_toolkit/features/students/StudentSlice';
// import * as types from '../redux/slices/UserSlice';
import * as types from '../redux_toolkit/features/users/UserSlice';
import Colors from '../utils/Colors';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Norecord from '../components/Norecord';
import Modals from '../components/Modals';
import PaymentAccordion from '../components/PaymentAccordian';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import {log} from 'console';
import Loading from '../components/Loading';
import moment from 'moment';
import Api from '../environment/Api';
import {useFocusEffect} from '@react-navigation/core';
import {app_versions} from './Home';

const PaymentDetails = ({route, navigation}) => {
  const paymentDetails = route.params.paymentDetails;

  console.log('paymentDetails------------------------------->', paymentDetails);

  const [data, setData] = useState(paymentDetails.totalpayment);

  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [selectedStudent, setSlectedStudent] = useState({});
  const [modalStatus, setModalStatus] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inputTotalAmount, setInputTotalAmount] = useState(0);
  const [inputPaidAmount, setInputPaidAmount] = useState(0);
  const [paidAmount, setPayedAmount] = useState(0);
  const [paindingAmount, setPaindingAmount] = useState('');
  // const isLoading = useSelector(state => state.Payment.isLoading);
  const paymentStatus = useSelector(state => state.userdata.payments);
  const [isLoading, setIsLoading] = useState(false);
  // console.log('paymentStatus---->', paymentStatus);

  const [customModal, setCustomModal] = useState(true);
  const [inputAmount, setInputAmount] = useState(0);
  const [paymentRecord, setPaymentRecord] = useState([]);
  const Payment = useSelector(state => state.StudentSlice.students);
  const teacherdata = useSelector(
    state => state.UserSlice?.user?.data?.resData,
  );
  const modalHeight = window.WindowHeigth * 0.9;
  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [isEditingTotalPay, setIsEditingTotalPay] = useState(false);

  useEffect(() => {
    dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
  }, []);

  // Get Payments Deatils.
  const getPayDetails = item => {
    setSlectedStudent(item);
    setPayedAmount(0);
    setTotalAmount(0);
    setPaymentRecord([]);
    setModalStatus(false);
    handleOpenBottomSheet();
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
        setPaymentRecord(response.data);
        const paidAmount = response.data.reduce(
          (preValue, curValue) => preValue + curValue.amount,
          0,
        );
        const totalAmount = response.data ? response.data[0].total_amount : 0;
        setPayedAmount(paidAmount);
        setTotalAmount(totalAmount);
        setPaindingAmount(totalAmount - paidAmount);
      },
      err => {},
    );

    handleOpenBottomSheet();
  };
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(types.getallpaymentsstart(paymentDetails.userid));
    }, [closeModal]),
  );

  const studentDataPayment = useSelector(state => state.userdata.payments);

  const selectedStudentData = studentDataPayment?.filter(
    item => item?._id === paymentDetails._id,
  );

  console.log('selectedStudentData=================>', selectedStudentData);

  const savePayment = async () => {
    setIsLoading(true);
    try {
      if (inputTotalAmount == 0 && inputPaidAmount == 0) {
        Alert.alert('info', 'Please add your amount!!');
      } else if (inputTotalAmount == 0 && inputPaidAmount > inputTotalAmount) {
        Alert.alert(
          'info',
          'You have to add a fixed total amount first before proceeding !',
        );
      } else {
        if (selectedStudentData[0].totalpayment.totalamount == 0) {
          if (inputPaidAmount > inputTotalAmount) {
            Alert.alert(
              'info',
              'Paid amount can not be greater than the pending amount.',
            );
          } else {
            let data = {
              userid: paymentDetails.userid,
              username: paymentDetails.username,
              studentid: paymentDetails.studentid,
              studentname: paymentDetails.studentname,
              program: paymentDetails.program,
              class: paymentDetails.class,
              registration_date: paymentDetails.registration_date,
              total_amount: inputTotalAmount,
              amount: inputPaidAmount,
              status: '',
            };

            console.log('body sent in saving---------------->', data);
            console.log('data userid----------------------->', data.userid);

            await dispatch(types.paymentsUserstart(data));
            await dispatch(types.getallpaymentsstart(data.userid));
            setInputPaidAmount(0);
            setInputTotalAmount(0);
            closeModal();
          }
        } else {
          if (
            selectedStudentData[0].totalpayment.totalpaid +
              parseInt(inputPaidAmount) >
            selectedStudentData[0].totalpayment.totalamount
          ) {
            Alert.alert(
              'info',
              'Paid amount cannot be greater than the amount to be paid !',
            );
          } else if (isEditingTotalPay) {
            if (
              inputTotalAmount < selectedStudentData[0].totalpayment.totalpaid
            ) {
              Alert.alert(
                'info',
                'The amount you are setting is smaller than the amount already paid !',
              );
            } else if (
              inputTotalAmount ===
              selectedStudentData[0].totalpayment.totalamount
            ) {
              Alert.alert('info', 'No changes have been made !');
            } else {
              let data = {
                userid: paymentDetails.userid,
                username: paymentDetails.username,
                studentid: paymentDetails.studentid,
                studentname: paymentDetails.studentname,
                program: paymentDetails.program,
                class: paymentDetails.class,
                registration_date: paymentDetails.registration_date,
                total_amount: inputTotalAmount,
                amount: 0,
                status: '',
                appVersion: app_versions,
              };

              try {
                const res = await Api.put('updatetchpaymentdata', data);
                if (res.status === 200) {
                  dispatch(types.getallpaymentsstart(data.userid));
                  setInputPaidAmount(0);
                  setInputTotalAmount(0);
                  closeModal();
                } else {
                  Alert.alert(
                    'Error',
                    res.error ||
                      'An error occurred while updating the payment data.',
                  );
                }
              } catch (error) {
                Alert.alert(
                  'Error',
                  'An error occurred while updating the payment data.',
                );
                console.error('Update Payment Data Error:', error);
              }
            }
          } else if (!isEditingTotalPay && inputPaidAmount === 0) {
            Alert.alert('info', 'You have not added any amount !');
          } else {
            let data1 = {
              userid: paymentDetails.userid,
              username: paymentDetails.username,
              studentid: paymentDetails.studentid,
              studentname: paymentDetails.studentname,
              program: paymentDetails.program,
              class: paymentDetails.class,
              registration_date: paymentDetails.registration_date,
              total_amount: selectedStudentData[0].totalpayment.totalamount,
              amount: inputPaidAmount,
              status: '',
            };

            try {
              await dispatch(types.paymentsUserstart(data1));
              await dispatch(types.getallpaymentsstart(data1.userid));
              setInputPaidAmount(0);
              setInputTotalAmount(0);
              closeModal();
            } catch (error) {
              Alert.alert(
                'Error',
                'An error occurred while processing the payment.',
              );
              console.error('Payment Error:', error);
            }
          }
        }
      }
    } catch (error) {
      // Alert.alert('Error', 'An unexpected error occurred.');
      console.error('Unexpected Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(
    'selectedStudentData[0].paymenthistory--------------------------------------->',
    selectedStudentData[0].paymenthistory,
  );

  const closeModal = () => {
    setCustomModal(false);
    setUpdateModal(false);
    setIsEditingTotalPay(false);
    // setIsLoading(false);
    // navigation.goBack();
  };

  const openModal = () => {
    setInputTotalAmount(
      selectedStudentData[0].totalpayment.totalamount.toString(),
    );
    setUpdateModal(true);
  };

  const handleCancel = () => {
    setUpdateModal(false);
    setIsEditingTotalPay(false);
    setInputPaidAmount(0);
  };

  // console.log(
  //   '-----------------------------------------------------------------------------------',
  // );
  // console.log('studentDataPayment---------------------->', studentDataPayment);
  // console.log('selectedStudentData--------------------->', selectedStudentData);
  // console.log('isEditingTotalPay-----------------', isEditingTotalPay);
  // console.log(
  //   'selectedStudentData[0].totalpayment.totalamount------------>',
  //   selectedStudentData[0].totalpayment.totalamount,
  // );
  // console.log('inputTotalAmount---------------->', inputTotalAmount);

  return (
    <>
      {isLoading ? (
        // <ActivityIndicator
        //   size="large"
        //   color={Color.primary}
        //   style={{justifyContent: 'center', alignSelf: 'center'}}
        // />
        <Loading />
      ) : (
        <>
          {Payment.length === 0 ? (
            <Modals
              visible={customModal}
              heading={'No Student Available'}
              backgroundColor={Colors.white}
              // onpressyes={closeModal}
              // onpressno={closeModal}
              onpressok={closeModal}
              okstatus={true}
            />
          ) : (
            <>
              <Modal animationType="slide" transparent={true} visible={modal}>
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        // height: window.WindowHeigth * 0.7,
                        marginTop: 50,
                        width: window.WindowWidth * 0.95,
                        justifyContent: 'space-around',
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.username,
                          {marginTop: 40, fontSize: 14},
                        ]}>
                        Fixed Monthly Payment
                      </Text>
                      <TouchableOpacity onPress={() => setModal(false)}>
                        <Image
                          source={require('../assets/Image/close-circle.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.p, {marginTop: 20}]}>
                      Are you sure you want to change the fixed monthly payment
                      for this student? Please note that the old amount will no
                      longer be fixed, and the new monthly payment will be
                      calculated based on the amount entered.
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 120,
                        }}>
                        Old Fixed Amount
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 50,
                        }}>
                        200
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 120,
                        }}>
                        New Fixed Amount
                      </Text>
                      <AppTextInput
                        style={[styles.Textinput, {right: 50}]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        name="aadhaar"
                        // maxLength={12}
                        // placeholder="Enter Aadhar Number"
                        value={200}
                        // onChangeText={value => setAadhaar(value)}
                      />
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <TouchableOpacity
                        onPress={() => setModal(false)}
                        style={{
                          width: 100,
                          height: 48,
                          borderRadius: 20,
                          //   marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginRight: 50,
                          marginTop: 20,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            marginTop: 10,
                            fontFamily: FontFamily.poppinsMedium,
                            color: 'white',
                            // marginLeft: 15,
                            textAlign: 'center',
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                          style={{
                            width: 100,
  
                            height: 48,
                            borderRadius: 20,
                            marginLeft: 20,
                            backgroundColor: Color.royalblue,
                            marginTop: 20,
                          }}>
                          <Text style={styles.buttonOpen}>Save</Text>
                        </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={updateModal}
                onRequestClose={closeModal}
                onShow={openModal}>
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        // height: window.WindowHeigth * 0.7,
                        marginTop: 50,
                        width: window.WindowWidth * 0.95,
                        justifyContent: 'space-around',
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.username,
                          {marginTop: 20, fontSize: 17},
                        ]}>
                        ଦେୟ ରେକର୍ଡ଼ କରନ୍ତୁ।
                      </Text>
                      <TouchableOpacity onPress={() => setUpdateModal(false)}>
                        <Image
                          source={require('../assets/Image/close-circle.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    {!isEditingTotalPay ? (
                      <Text style={[styles.p, {marginTop: 10}]}>
                        ଆପଣଙ୍କ ଦେୟ ରେକର୍ଡ଼ ହେବା ପରେ ତଥ୍ୟ ଅପଡେଟ ହେବ ।
                      </Text>
                    ) : (
                      <Text style={[styles.p, {marginTop: 10}]}>
                        ଦୟାକରି ଧ୍ୟାନ ଦିଅନ୍ତୁ ଯେ ନୂତନ ମାସିକ ଦେୟ ଅନୁସାରେ
                        ଶିକ୍ଷାର୍ଥୀର ଦେୟ ହିସାବ କରାଯିବ ।
                      </Text>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between',
                      }}></View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 100,
                          top: '5%',
                        }}>
                        Total Pay
                      </Text>
                      {isEditingTotalPay ? (
                        <AppTextInput
                          style={[
                            styles.Textinput,
                            {right: 0, marginRight: 20, left: 20},
                          ]}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          name="aadhaar"
                          value={inputTotalAmount.toString()}
                          onChangeText={value => {
                            const numericValue = value.replace(/[^0-9]/g, '');
                            setInputTotalAmount(numericValue);
                            setInputPaidAmount(0);
                          }}
                        />
                      ) : (
                        <>
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: FontFamily.poppinsMedium,
                              marginRight: 34,
                              marginLeft: '6%',
                            }}>
                            {selectedStudentData[0].totalpayment.totalamount}
                          </Text>
                          {selectedStudentData[0].totalpayment.totalamount ===
                          0 ? (
                            <>
                              <TouchableOpacity
                                onPress={() => setIsEditingTotalPay(true)}>
                                <Entypo
                                  name="squared-plus"
                                  size={25}
                                  color={Color.royalblue}
                                  style={{marginRight: '-1%'}}
                                />
                              </TouchableOpacity>
                            </>
                          ) : (
                            <>
                              <TouchableOpacity
                                onPress={() => setIsEditingTotalPay(true)}>
                                <Entypo
                                  name="new-message"
                                  size={25}
                                  color={Color.royalblue}
                                  style={{marginRight: '-1%'}}
                                />
                              </TouchableOpacity>
                            </>
                          )}
                        </>
                      )}
                    </View>
                    {!isEditingTotalPay ? (
                      <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: FontFamily.poppinsMedium,
                            marginRight: 100,
                            top: '5%',
                          }}>
                          Enter Amount
                        </Text>
                        <AppTextInput
                          style={[
                            styles.Textinput,
                            {right: 0, marginRight: 20, left: 20},
                          ]}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          name="aadhaar"
                          // maxLength={12}
                          // placeholder="Enter Aadhar Number"
                          value={inputPaidAmount
                            .toString()
                            .replace(/[^0-9]/g, '')}
                          onChangeText={value => {
                            const numericValue = value.replace(/[^0-9]/g, '');
                            setInputPaidAmount(numericValue);
                          }}
                        />
                      </View>
                    ) : null}
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <TouchableOpacity
                        onPress={handleCancel}
                        style={{
                          width: 111,
                          height: 48,
                          borderRadius: 50,
                          //   marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginRight: 50,
                          marginTop: 20,
                        }}>
                        <Text
                          style={{
                            fontSize: 17,
                            marginTop: 12,
                            fontFamily: FontFamily.poppinsMedium,
                            color: 'white',
                            // marginLeft: 15,
                            textAlign: 'center',
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={savePayment}
                        style={{
                          width: 111,
                          height: 48,
                          borderRadius: 50,
                          marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginTop: 20,
                        }}>
                        <Text style={styles.buttonOpen}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <ScrollView>
                <View
                  style={{
                    // backgroundColor: Color.ghostwhite,
                    backgroundColor: 'white',
                    width: window.WindowWidth * 0.92,
                    // height: window.WindowHeigth * 0.15,
                    paddingBottom: 30,
                    marginLeft: 15,
                    marginTop: 20,
                    borderRadius: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        textAlign: 'left',
                        marginTop: 10,
                        fontFamily: FontFamily.poppinsMedium,
                        color: '#333333',
                        marginLeft: 28,
                        fontSize: 19,
                        fontWeight: 'bold',
                      }}>
                      ଶିକ୍ଷାର୍ଥୀ ବିବରଣୀ
                    </Text>
                    {/* <TouchableOpacity
                        onPress={() => navigation.navigate('studentlist')}>
                        <Text style={styles.update}>Update</Text>
                      </TouchableOpacity> */}
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textStyle}>Name:</Text>
                    <Text style={styles.name}>
                      {paymentDetails.studentname}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textStyle}>Class:</Text>
                    <Text style={styles.class}>{paymentDetails.class}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textStyle}>Program:</Text>
                    <Text
                      style={{
                        textAlign: 'left',
                        marginTop: 10,
                        fontFamily: FontFamily.poppinsMedium,
                        color: '#666666',
                        marginLeft: '7%',
                      }}>
                      {paymentDetails.program.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 105,
                        height: 136,
                        backgroundColor: 'white',
                        marginTop: 20,
                        justifyContent: 'space-around',
                        // marginLeft: 12,
                      }}>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          // marginLeft: 10,
                          marginTop: 20,
                          fontWeight: '800',
                          fontSize: 23,
                          textAlign: 'center',
                        }}>
                        ₹ {selectedStudentData[0].totalpayment.totalamount}
                      </Text>
                      <Text
                        style={{
                          // width: 90,
                          textAlign: 'center',
                          // height: 26,
                          fontFamily: FontFamily.poppinsMedium,
                          fontSize: 16,
                          marginTop: 10,
                          paddingBottom: 8,
                          // left: '1%',
                          color: '#333333',
                          textAlign: 'center',
                        }}>
                        Total
                      </Text>
                      {/* <Text
                          style={{
                            color: '#666666',
                            fontSize: 10,
                            // marginLeft: 18,
                            textAlign: 'center',
                          }}>
                          (Feb-Aug)
                        </Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        width: 105,
                        height: 136,
                        backgroundColor: 'white',
                        marginTop: 20,
                        justifyContent: 'space-around',

                        // marginLeft: 12,
                      }}>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          // marginLeft: 10,
                          textAlign: 'center',
                          marginTop: 20,
                          fontWeight: '800',
                          fontSize: 23,
                        }}>
                        ₹ {selectedStudentData[0].totalpayment.totalpaid}
                      </Text>
                      <Text
                        style={{
                          // width: 90,
                          textAlign: 'center',
                          // height: 26,
                          fontFamily: FontFamily.poppinsMedium,
                          fontSize: 16,
                          marginTop: 10,
                          paddingBottom: 8,
                          // left: '1%',
                          color: '#333333',
                          textAlign: 'center',
                        }}>
                        Paid
                      </Text>
                      {/* <Text
                          style={{
                            color: '#666666',
                            fontSize: 10,
                            textAlign: 'center',
                          }}>
                          (Feb-Aug)
                        </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 105,
                        height: 136,
                        backgroundColor: 'white',
                        marginTop: 20,
                        justifyContent: 'space-around',

                        // marginLeft: 12,
                      }}>
                      {/* <Text
                          onPress={() => setModal(true)}
                          style={{
                            fontFamily: FontFamily.poppinsMedium,
                            color: Color.royalblue,
                            textAlign: 'right',
                            marginRight: 10,
                            marginTop: 10,
  
                            fontSize: 10,
                          }}>
                          Edit
                        </Text> */}
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          // marginLeft: 10,
                          marginTop: 22,
                          fontWeight: '800',
                          fontSize: 23,
                          textAlign: 'center',
                        }}>
                        ₹{' '}
                        {selectedStudentData[0].totalpayment.totalamount -
                          selectedStudentData[0].totalpayment.totalpaid}
                      </Text>
                      <Text
                        style={{
                          // width: 90,

                          // height: 26,
                          fontFamily: FontFamily.poppinsMedium,
                          fontSize: 16,
                          marginTop: 10,
                          paddingBottom: 8,
                          // left: '1%',
                          color: '#333333',
                          textAlign: 'center',
                        }}>
                        Pending
                      </Text>
                      {/* <Text
                          style={{
                            color: '#666666',
                            fontSize: 10,
                            // marginLeft: 15,
                            textAlign: 'center',
                            marginTop: -10,
                          }}>
                          Tuition Fee
                        </Text> */}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      backgroundColor: Color.royalblue,
                      width: window.WindowWidth * 0.93,
                      height: window.WindowHeigth * 0.2,
                      marginLeft: 15,
                      borderRadius: 10,
                      marginTop: 20,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: FontFamily.poppinsMedium,
                        fontSize: 16,
                        marginLeft: 20,
                        marginTop: 20,
                        fontWeight: '600',
                      }}></Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.poppinsMedium,
                        color: 'white',
                        marginLeft: 20,
                        width: 186,
                        height: 48,
                        marginTop: -10,
                        marginBottom: 4,
                      }}>
                      ଆପଣଙ୍କ ଦେୟ ବିବରଣୀ ଅପଡେଟ କରନ୍ତୁ।
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <TouchableOpacity
                          // onPress={() => navigation.navigate('attendanceList')}
                          onPress={() => setUpdateModal(true)}
                          style={{
                            backgroundColor: Color.white,
                            marginLeft: 20,
                            borderRadius: 20,
                            width: window.WindowWidth * 0.29,
                            heightgg: 30,
                            marginBottom: 10,
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              // width: 155,
                              FontFamily: FontFamily.balooBhaina2Medium,
                              color: '#333333',
                              textAlign: 'center',
                              // marginLeft: 10,
                              color: Color.royalblue,
                              // marginTop: 40,
                              paddingBottom: 7,
                              paddingTop: 7,
                              fontSize: 11,
                            }}>
                            ଦେୟ ରେକର୍ଡ଼ କରନ୍ତୁ
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Image
                          style={{
                            width: 100,
                            height: 95,
                            marginTop: -70,
                            left: '80%',
                            marginLeft: 20,
                          }}
                          source={require('../assets/Image/https___lottiefiles.com_42404-add-document.gif')}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <ScrollView
                  style={{
                    backgroundColor: 'white',
                    marginTop: 20,
                    borderRadius: 5,
                    width: window.WindowWidth * 0.96,
                    paddingBottom: 40,
                    marginLeft: 9,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: 16,
                        marginTop: 5,
                        marginLeft: 10,
                        fontWeight: 'bold',
                      }}>
                      ବିଗତ ବିବରଣୀ
                    </Text>
                    <Text
                      style={{
                        color: '#13538A',
                        fontSize: 14,
                        marginTop: 8,
                        marginLeft: 165,
                        fontWeight: '800',
                      }}>
                      Check all
                    </Text>
                  </View>
                  {selectedStudentData[0].paymenthistory.map(item => (
                    <>
                      {item.amount !== 0 ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            borderBottomWidth: 0.181,
                            borderBottomColor: '#666666',
                          }}>
                          <Text
                            style={{
                              color: '#666666',
                              fontSize: 13,
                              marginTop: 5,
                              marginLeft: 15,
                              paddingBottom: 15,
                            }}>
                            {moment(item.registration_date).format('DD/MM/YY')}
                          </Text>
                          <Text
                            style={{
                              color: '#666666',
                              fontSize: 13,
                              marginTop: 8,
                              marginLeft: 210,
                              paddingBottom: 15,
                            }}>
                            {item.amount}
                          </Text>
                        </View>
                      ) : null}
                    </>
                  ))}
                </ScrollView>
              </ScrollView>
              {/* {modalStatus ? (
                  <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
                    <LinearGradient
                      colors={['#4286f4', '#373b44']}
                      // style={styles.linearGradient}
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
                          onPress={() => {
                            savePayment();
                          }}
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
                        // style={styles.linearGradient}
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
                )} */}
              {/* <View>
                  <FlatList
                    // keyExtractor={message => message._id}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    updateCellsBatchingPeriod={40}
                    data={Payment}
                    renderItem={({item, index}) => (
                      <PaymentAccordion
                        studentName={item.studentname}
                        className={item.class}
                      />
                      // <View style={styles.Flngati}>
                      //   <View>
                      //     <Text style={styles.FlngatiText}>
                      //       {item.studentname}
                      //     </Text>
                      //   </View>
                      //   <View style={styles.payment}>
                      //     <View>
                      //       <Pressable onPress={() => getPayDetails(item)}>
                      //         <Text style={styles.view}>View</Text>
                      //       </Pressable>
                      //     </View>
                      //     <View>
                      //       <Pressable onPress={() => postPaymentDetails(item)}>
                      //         <Text style={styles.pay}>Pay</Text>
                      //       </Pressable>
                      //     </View>
                      //   </View>
                      // </View>
                    )}
                  />
                </View> */}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PaymentDetails;

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
    // marginLeft: 30,
    // marginRight: -50,
    borderRadius: 10,
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
    borderRadius: 24,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    fontSize: 17,
    marginTop: 12,

    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    // marginLeft: 15,
    textAlign: 'center',
  },
  update: {
    textAlign: 'right',
    marginLeft: 140,
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: '#13538A',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    textAlign: 'left',
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: '#666666',
    marginLeft: 30,
  },
  name: {
    textAlign: 'right',
    marginLeft: 46,
    marginTop: 10,
    // width: 200,
    textTransform: 'capitalize',
    fontFamily: FontFamily.poppinsMedium,
    color: '#666666',
  },
  class: {
    // textAlign: 'left',
    marginLeft: 51,
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: '#666666',
  },
  username: {
    fontFamily: FontFamily.poppinsMedium,
    color: '#333333',
    textAlign: 'left',
    marginRight: 90,
  },

  Logo: {
    width: 120,
    height: 120,
    marginLeft: 22,
    marginTop: -30,
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  submitText: {
    paddingTop: 20,
    paddingBottom: 20,
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 15,
  },
  p: {
    fontFamily: FontFamily.poppinsMedium,

    fontSize: 14,
    marginRight: 40,

    color: '#333333',
    width: 264,
  },

  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 10,
    borderRadius: 15,
  },
  view: {
    backgroundColor: 'white',
    width: window.WindowWidth * 0.9,
    marginLeft: 20,
    flex: 1,
    marginTop: 15,
    borderRadius: 5,
    padding: 10,
    // borderColor: 'black',
    // borderWidth: 0.9,
    // borderLeftColor: '#85d8ce',
    // borderRightColor: '#85d8ce',
    // borderBottomColor: '#85d8ce',
    // borderTopColor: '#85d8ce',
    justifyContent: 'space-evenly',
  },
  Textinput: {
    fontSize: 13,
    textAlign: 'center',
    color: 'black',

    fontWeight: 'bold',
    // marginTop: 20,
    borderColor: Color.ghostwhite,
    width: window.WindowWidth * 0.18,
    backgroundColor: Color.ghostwhite,
    height: 40,
    // margin: 12,
    borderWidth: 2,
    // padding: 10,
    // borderRadius: 20,
    // justifyContent: 'center',

    // marginLeft: 20,
  },
});
