import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {useEffect, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import * as studentstypes from '../redux/slices/StudentSlice';
// import Colors from '../utils/Colors';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Norecord from '../components/Norecord';
import Modals from '../components/Modals';
// import Color from '../utils/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
// import {FlatList} from 'react-native-gesture-handler';
// import QuizSkeleton from '../skeletons/QuizSkeleton';
import {FontFamily, Color} from '../GlobalStyle';
import {log} from 'console';

// import Animated from 'react-native-reanimated';

const PaymentAccordian = ({
  route,
  studentName,
  className,
  totalAmount,
  paidAmount,
  navigation,
  paymentDetails,
  program,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showPpt, setShowPpt] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showEndline, setShowEndline] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
  // const [totalAmount, setTotalAmount] = useState(0);
  const [inputTotalAmount, setInputTotalAmount] = useState(0);
  const [inputPaidAmount, setInputPaidAmount] = useState(0);
  // const [paidAmount, setPayedAmount] = useState(0);
  const [paindingAmount, setPaindingAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState([]);
  const [selectedStudent, setSlectedStudent] = useState({});

  const studentData = useSelector(state => state.studentdata.students);
  console.log(studentData, 'studentData---------------------------------->');
  //
  // const Name = studentData.studentname;
  // const className = studentData.class;
  const teacherdata = useSelector(state => state.userdata.user);
  const toggleListItem = () => {
    // const config = {
    //   duration: 300,
    //   toValue: showContent ? 0 : 1,
    //   useNativeDriver: true,
    // };
    // Animated.timing(animationController, config).start();
    setShowContent(!showContent);
  };
  const toggleListItems = () => {
    // const config = {
    //   duration: 300,
    //   toValue: showContent ? 0 : 1,
    //   useNativeDriver: true,
    // };
    // Animated.timing(animationController, config).start();
    setShowPpt(!showPpt);
  };

  const toggleListItemTraining = () => {
    // const config = {
    //   duration: 300,
    //   toValue: showContent ? 0 : 1,
    //   useNativeDriver: true,
    // };
    // Animated.timing(animationController, config).start();
    setShowTraining(!showTraining);
  };
  const toggleListItemEndline = () => {
    // const config = {
    //   duration: 300,
    //   toValue: showContent ? 0 : 1,
    //   useNativeDriver: true,
    // };
    // Animated.timing(animationController, config).start();
    setShowEndline(!showEndline);
  };

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });
  // const getPayDetails = item => {
  //   setSlectedStudent(item);
  //   setPayedAmount(0);
  //   setTotalAmount(0);
  //   setPaymentRecord([]);
  //   setModalStatus(false);
  //   handleOpenBottomSheet();
  //   //thinkzone.in.net/thinkzone/getalltchpaymentdetailsbystudentid/1667819009430
  //   //
  //   API.get(`getalltchpaymentdetailsbystudentid/${item.studentid}`).then(
  //     response => {
  //
  //       setPaymentRecord(response.data);
  //       const paidAmount = response.data.reduce(
  //         (preValue, curValue) => preValue + curValue.amount,
  //         0,
  //       );
  //       const totalAmount = response.data ? response.data[0].total_amount : 0;
  //       setPayedAmount(paidAmount);
  //       setTotalAmount(totalAmount);
  //       //
  //     },
  //     err => {
  //       //
  //     },
  //   );
  // };

  // useEffect(() => {
  //   setSlectedStudent(item);
  //   setPayedAmount(0);
  //   setTotalAmount(0);
  //   setPaindingAmount(0);
  //   setPaymentRecord([]);
  //   setModalStatus(true);
  //   API.get(`getalltchpaymentdetailsbystudentid/${item.studentid}`).then(
  //     response => {
  //       //
  //
  //       setPaymentRecord(response.data);
  //     },
  //     err => {
  //       //
  //     },
  //   );
  // }, []);
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => toggleListItem()}>
          <View>
            <View style={styles.titleContainer}>
              <View>
                <Text style={styles.title}> {studentName}</Text>
                {program == 'pge' ? (
                  <Text
                    style={[
                      {
                        color: '#666666',
                        fontFamily: FontFamily.poppinsMedium,
                        fontSize: 12,
                        top: '10%',
                        left: '4.8%',
                      },
                    ]}>
                    Class : {className}
                  </Text>
                ) : (
                  <Text
                    style={[
                      {
                        color: '#666666',
                        fontFamily: FontFamily.poppinsMedium,
                        fontSize: 12,
                        top: '10%',
                        left: '4.8%',
                      },
                    ]}>
                    Level : {className}
                  </Text>
                )}

                <Text
                  style={[
                    {
                      color: '#666666',
                      fontFamily: FontFamily.poppinsMedium,
                      fontSize: 12,
                      top: '8%',
                      left: '4.8%',
                    },
                  ]}>
                  Program :
                  <Text style={{textTransform: 'uppercase'}}> {program}</Text>
                </Text>
              </View>

              <Animated.View style={{transform: [{rotateZ: arrowTransform}]}}>
                {/* <Icon
                      name="keyboard-arrow-right"
                      style={{marginLeft: -20}}
                      size={30}
                      color={'black'}
                    /> */}
                {/* <Image
                      style={styles.tinyLogos}
                      source={require('../assets/Image/info-circles.png')}
                    /> */}
                <Entypo
                  name={showContent ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={Color.royalblue}
                  style={{marginRight: '3.5%'}}
                />
              </Animated.View>
            </View>
          </View>
        </TouchableOpacity>
        {showContent && (
          <View style={styles.body}>
            <View>
              <View style={styles.tableView}>
                <Text
                  style={{
                    color: '#666666',
                    fontWeight: '600',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Total Amount :
                </Text>
                <Text
                  style={{
                    color: '#666666',
                    fontWeight: '600',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  {totalAmount}
                </Text>
              </View>
              <View style={styles.tableView}>
                <Text
                  style={{
                    color: '#666666',
                    fontWeight: '600',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Paid Amount :
                </Text>
                {/* {paymentRecord.map((item, index) => ( */}
                <Text
                  style={{
                    color: '#666666',
                    fontWeight: '600',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  {/* {item.paidAmount} */}
                  {paidAmount}
                </Text>
                {/* ))} */}
              </View>
              <View style={styles.tableView}>
                <Text
                  style={{
                    color: '#666666',
                    fontWeight: '600',
                    fontFamily: FontFamily.poppinsMedium,
                  }}></Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('paymentDetails', {
                      paymentDetails: paymentDetails,
                    })
                  }>
                  <Text
                    style={{
                      color: '#13538A',
                      fontWeight: 'bold',
                      marginTop: '8%',
                      marginRight: -10,
                    }}>
                    Check Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default PaymentAccordian;

const styles = StyleSheet.create({
  container: {
    padding: '4%',
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    width: window.WindowWidth * 0.92,
    marginLeft: 17,
    marginTop: 10,
    // overflow: 'hidden',
  },
  tableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  title: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '700',
    // marginTop: -10,
    fontFamily: FontFamily.poppinsMedium,
    // color: Color.greyGrey700,
    textTransform: 'capitalize',
  },
  body: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  titleContainer: {
    width: window.WindowWidth * 0.85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  markContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  title1: {
    marginRight: 20,
    flex: 1,
    textAlign: 'right',
    // fontWeight: 'bold',
    color: 'black',
  },

  headerButton: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'column',
  },
});
