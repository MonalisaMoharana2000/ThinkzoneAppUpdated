import {
  StyleSheet,
  Text,
  View,
  Button,
  // TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Image,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  ImageBackground,
  Animated,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import Color from '../utils/Colors';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors, DataTable} from 'react-native-paper';
import {BackHandler} from 'react-native';
import Accordion from '../components/Accordion';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import API from '../environment/Api';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import * as window from '../utils/dimensions';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import {
  green200,
  red200,
} from 'react-native-paper/lib/typescript/styles/colors';
import RewardTransaction from './RewardTransaction';
import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
// import {Tooltip, Text, lightColors} from '@rneui/themed';
// const {width: windowWidth} = Dimensions.get('window');
// import Tooltip from 'react-native-tooltip';
const {height} = Dimensions.get('window');
import {WebView} from 'react-native-webview';
import Loading from '../components/Loading';
import {useIsFocused} from '@react-navigation/native';
// import * as FcmSlice from '../redux/slices/FcmSlice';
// import AmazonGiftVoucherScreen from '../components/AmazonGiftVoucherScreen';
import ProgressBar from '../components/ProgressBar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Myachivement = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.user);
  const coin = useSelector(state => state.UserSlice.rewards);
  console.log('coins received------------------------------->', coin);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [versionModal, setVersionModal] = useState(false);
  const [couponModal, setCouponModal] = useState(false);

  const [isStatus, setisStatus] = useState(false);
  const [achieve, setAchieve] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [timeSpent_record, setTimeSpent_record] = useState([]);
  const [transaction_record, setTransaction_record] = useState([]);
  const [maintainanceStatus, setMaintainanceStatus] = useState({});
  // console.log(transaction_record,"transaction_record====================");
  const [reward, setReward] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = React.useState(false);
  const data = [
    {id: 1, value: 'Baseline', baselineMark: '23'},
    {id: 2, value: 'Prabesha', endlineMark: '18'},
    {id: 3, value: 'Prastusti'},
    {id: 4, value: 'Endline'},
    {id: 5, value: 'NSDC'},
  ];
  let tableHead = ['Months', 'TimeSpent'];
  // let tableTitle = ['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun','Jul','Aug','Sep', 'Oct','Nov','Dec'];
  //  let tableTitle = [];
  let tableData = [
    {month: 'Jan', time: 12},
    {month: 'Feb', time: 23},
    {month: 'Mar', time: 34},
    {month: 'Apr', time: 45},
    {month: 'May', time: 67},
    {month: 'Jun', time: 34},
    {month: 'Jul', time: 56},
    {month: 'Aug', time: 45},
    {month: 'Sep', time: 23},
    {month: 'Oct', time: 34},
    {month: 'Nov', time: 56},
    {month: 'Dec', time: 12},
  ];

  const labels = [
    'ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ',
    'ପ୍ରବେଶ',
    'ପ୍ରସ୍ତୁତି',
    'ଏଣ୍ଡ୍ ଲାଇନ୍',
    'NSDC',
  ];

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Color.primary,
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: Color.primary,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Color.primary,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Color.primary,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: 'black',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#000000',
    labelSize: 13,
    currentStepLabelColor: Color.primary,
  };
  const numColumns = 5;
  const [background, setBackground] = useState();

  function handlePress() {
    setisStatus(true);
    //
  }
  //For My achievement aPI

  // useEffect(() => {
  //   API.get(`getUserProgress/${user[0].userid}`).then(
  //     // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
  //     response => {
  //       //
  //       setAchieve(response.data);
  //       setTimeSpent_record(response.data[0].timeSpentData);
  //       setIsloading(false);
  //     },
  //     err => {},
  //   );
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await API.get(`getUserProgress/${user[0].userid}`);
          setAchieve(response.data);
          setTimeSpent_record(response.data[0].timeSpentData);
          setIsloading(false);
        } catch (error) {
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
        }
      };
      fetchData();
    }, []),
  );

  //For Transaction aPI
  useFocusEffect(
    React.useCallback(() => {
      API.get(`getLast5CoinsTransaction/${user[0]?.userid}`).then(
        response => {
          // console.log(
          //   'dataaaaaaaaaaaaaaaaaaa-----------------',
          //   response.data,
          //   // user[0].userid,
          // );
          setTransaction_record(response.data.data);
          //  console.log(response.data.data,"response.data------------------------------------------");
          setIsloading(false);
        },
        err => {},
      );
    }, []),
  );

  // useEffect(() => {
  //   // API.get(`getTotalCoins/${user[0].userid}`).then(response => {
  //   //
  //   //   setReward(response.data[0].coins);
  //   // });
  //   dispatch(types.rewardsUserstart(user[0].userid));
  // }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     //
  //     // Do something when the screen is focused
  //     dispatch(types.rewardsUserstart(user[0].userid));
  //   }, []),
  // );

  // For Info modal
  const [show, setShow] = useState(false);

  //  const lastFiveTransactions = transaction_record.slice(-5);

  // -----------------------milestoneApi (dhaneswar)------------------
  const scrollX = useRef(new Animated.Value(0)).current;
  const [milstone, setMilstone] = useState([]);
  const [modal, setModal] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [amazonCode, setAmazonCode] = useState({});
  const [couponsData, setCouponsData] = useState([]);
  const [EachModalData, setEachModalData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [loader, setloader] = useState(false);
  const [isloader, setIsloader] = useState(true);
  const [inLeaderBoard, setInLeaderBoard] = useState(false);
  const [redeemCount, setRedeemCount] = useState(null);
  const reversedCouponsData = [...couponsData].reverse();
  // setCouponsData(reversedCouponsData);

  console.log('amazoneCode', amazonCode?.couponCode);
  // console.log('EachModalData', EachModalData);
  // console.log('couponsData', couponsData);

  // useEffect(() => {
  //   API.get(`getTransUserProgress/${user[0].userid}`).then(
  //     // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
  //     response => {
  //       //
  //       setMilstone(response.data);
  //       // console.log(
  //       //   '====================================response.data',
  //       //   response.data,
  //       // );

  //       // setTimeSpent_record(response.data[0].timeSpentData);
  //       // setIsloading(false);
  //     },
  //     err => {},
  //   );
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await API.get(
            `getTransUserProgress/${user[0]?.userid}`,
          );
          setMilstone(response.data);
        } catch (error) {
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
        }
      };
      fetchData();
    }, []),
  );

  useEffect(() => {
    API.get(`checkUserInLboard/${user[0].userid}/${user[0].usertype}`)
      .then(response => {
        // console.log('leaderboardAPI', response?.data[0]?.useridExists);
        setInLeaderBoard(response?.data[0]?.useridExists);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    API.get(`getMaintainanceStatus/fellow`)
      .then(response => {
        setMaintainanceStatus(response.data);
        // setmaintainanceModal(false);
      })
      .catch(e => {
        console.log(e.message);
      });
  }, []);

  const fetchData = async () => {
    setloader(true);
    try {
      const response = await API.get(
        `getAllRedeemedCoupons/${user[0]?.userid}`,
      );
      setRedeemCount(response?.data?.redeemCount);
      setCouponsData(response?.data?.couponsData);
      setloader(false);
    } catch (error) {
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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openTooltip = index => {
    setTooltipContent(index);
    setTooltipVisible(true);
  };

  // const confirmRedeem = () => {
  //   Alert.alert(
  //     'ସୂଚନା',
  //     'ବର୍ତ୍ତମାନ ଆପଣଙ୍କ Amazon Coupons ରେ କାମ ଚାଲୁଅଛି l',
  //     [
  //       {
  //         text: 'OK',
  //         style: 'cancel',
  //       },
  //     ],
  //     {cancelable: false},
  //   );
  //   // Alert.alert(
  //   //   'Redeem Coupons',
  //   //   'ଆପଣ କଏନ୍ Redeem କରି Amazon Voucher ପାଇବା ପାଇଁ  ସୁନିଶ୍ଚିତ ଅଛନ୍ତି ?',
  //   //   [
  //   //     {
  //   //       text: 'Cancel',
  //   //       style: 'cancel',
  //   //     },
  //   //     {
  //   //       text: 'Redeem',
  //   //       onPress: () => openModel(),
  //   //     },
  //   //   ],
  //   //   {cancelable: false},
  //   // );
  // };

  const confirmRedeem = () => {
    const coins = coin[0]?.coins;
    if (coins && coins < 700) {
      const coinsNeeded = 700 - coins;
      const message = `ଆପଣଙ୍କ ପାଖରେ ଆବଶ୍ୟକ ଟି କଏନ୍ ଉପଲବ୍ଧ ନାହିଁ । Amazon Pay Voucher ପାଇବା ପାଇଁ ଆପ୍ଲିକେସନରେ କଏନ୍ ସଂଗ୍ରହ କରନ୍ତୁ।`;
      Alert.alert(
        'ଆବଶ୍ୟକ କଏନ୍ ଉପଲବ୍ଧ ନାହିଁ ।',
        message,
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else if (coins && redeemCount >= 2 && coins < 200) {
      Alert.alert(
        'ଆବଶ୍ୟକ କଏନ୍ ଉପଲବ୍ଧ ନାହିଁ ।',
        'Amazon Pay Voucher ପାଇବା ପାଇଁ ନ୍ୟୁନତମ ୨୦୦ ଟି କଏନ୍ ଆବଶ୍ୟକ ।',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else if (!coins) {
      const message = `ଆପଣଙ୍କ ପାଖରେ ଆବଶ୍ୟକ ଟି କଏନ୍ ଉପଲବ୍ଧ ନାହିଁ । Amazon Pay Voucher ପାଇବା ପାଇଁ ଆପ୍ଲିକେସନରେ କଏନ୍ ସଂଗ୍ରହ କରନ୍ତୁ।`;
      Alert.alert(
        'ଆବଶ୍ୟକ କଏନ୍ ଉପଲବ୍ଧ ନାହିଁ ।',
        message,
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      // User can redeem, proceed with confirmation
      Alert.alert(
        'Redeem Coupons',
        'ଆପଣ କଏନ୍ Redeem କରି Amazon Voucher ପାଇବା ପାଇଁ  ସୁନିଶ୍ଚିତ ଅଛନ୍ତି ?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Redeem',
            onPress: () => openModel(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  const openModel = async () => {
    // Assuming you have access to the user's coin balance
    try {
      // console.log('isloader', isloader);
      const response = await API.get(`getRewardCoupon/${user[0]?.userid}`);
      console.log('Amazone Code Response', response);
      if (response?.status === 200) {
        setAmazonCode(response.data);
        setVersionModal(true);
        setIsloader(false);
      } else if (response?.status === 204) {
        Alert.alert(
          `ବର୍ତ୍ତମାନ Amazon Voucher ଗୁଡ଼ିକୁ ଅପଡେଟ କରାଯାଉଅଛି ।\n ଦୟାକରି କିଛି ସମୟ ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ ।`,
        );
        setIsloader(false);
      } else {
        Alert.alert('ଦୟାକରି କିଛି ସମୟ ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ ।');
        setIsloader(false);
      }
    } catch (error) {
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
    }
  };

  const couponModalOpen = coupon => {
    setEachModalData(coupon);
    setCouponModal(true);
  };

  // const needMoreCoins = () => {
  //   console.log('incefficent coins');
  //   const coinsAvailable = coin[0]?.coins;
  //   const coinsNeeded = 700 - coinsAvailable;
  //   const message = `ଆପଣଙ୍କ ପାଖରେ ${coinsAvailable} ଟି କଏନ୍ ଉପଲବ୍ଧ ଅଛି । Amazon Pay Voucher ପାଇବା ପାଇଁ ଆଉ ${coinsNeeded} ଟି କଏନ୍ ଆବଶ୍ୟକ ।`;
  //   Alert.alert(
  //     'ଆବଶ୍ୟକ କଏନ୍ ଉପଲବ୍ଧ ନାହିଁ ।',
  //     message,
  //     [
  //       {text: 'OK', onPress: () => console.log('OK Pressed')}, // You can add a callback function if needed
  //     ],
  //     {cancelable: false},
  //   );
  // };

  const closeModel = () => {
    setVersionModal(false);
    dispatch(types.rewardsUserstart(user[0].userid));
    fetchData();
  };
  const closeCouponModal = () => {
    setCouponModal(false);
    dispatch(types.rewardsUserstart(user[0].userid));
  };

  const closeTooltip = () => {
    setTooltipVisible(false);
  };
  const openMessage = index => {
    setSelectedIndex(index);
  };

  //-------------------------Opening Transactions---------------

  const openTransactionModal = () => {
    setModalOpen(true);
  };

  const openRewardModal = () => {
    setRewardModal(true);
  };

  const closeTransactionModal = () => {
    setModalOpen(false);
  };
  const closeRewardModal = () => {
    setRewardModal(false);
  };
  const redirectURL = 'https://www.amazon.in/gp/css/gc/payment';
  const copyToClipboard = couponCode => {
    Clipboard.setString(couponCode);
  };
  const IndicatorLoadingView = () => {
    return <Loading />;
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     dispatch(FcmSlice.clearfcmMessage());
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  //--------------------------------------------------------------

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {maintainanceStatus?.tchReward === true ? (
        <ModuleUnderDevlopment />
      ) : (
        <ScrollView>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={versionModal}
              onRequestClose={() => closeModel()}>
              <TouchableOpacity style={{flex: 1}} onPress={() => closeModel()}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: windowWidth,
                    height: windowHeight,
                    backgroundColor: 'rgba(0,0,0,0.5)', // Adjust the opacity as needed
                  }}
                />
                {isloader ? (
                  <ActivityIndicator
                    size="large"
                    color={Color.royalblue}
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: windowHeight / 2 - 25, // Adjusted marginTop for centering
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* Background Image */}
                    <View
                      style={{
                        backgroundColor: 'white',
                        height: windowHeight * 0.78,
                        width: windowWidth * 0.8,
                        margin: 20,
                        borderRadius: 15,
                        padding: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {/* Amazon Logo */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 30,
                          marginBottom: 20,
                        }}>
                        <Image
                          source={require('../assets/Image/imageAmazon.png')}
                          style={{
                            marginTop: 20,
                            height: 45,
                            width: 120,
                          }}
                        />
                        <Text
                          style={{
                            // fontFamily: FontFamily.poppinsMedium,
                            color: '#333333',
                            fontSize: 30,
                            fontWeight: 'bold',
                            marginLeft: 40,
                          }}>
                          ₹{amazonCode?.amount}
                        </Text>
                      </View>
                      <View style={{alignItems: 'center', marginVertical: 20}}>
                        {/* <Text
                      style={{
                        fontFamily: FontFamily.poppinsMedium,
                        color: '#333333',
                        fontSize: 14,
                      }}>
                      ଅଭିନନ୍ଦନ ଆପଣ କୁପନ୍ ପାଇଛନ୍ତି
                    </Text> */}
                        <Text
                          style={{
                            fontFamily: FontFamily.poppinsMedium,
                            color: '#333333',
                            fontSize: 13,
                            textAlign: 'center',
                          }}>
                          ଆପଣ Amazon ରେ ଉପଲବ୍ଧ ଥିବା ବିଭିନ୍ନ ସେବାଗୁଡିକରେ (ଜିନିଷ
                          କିଣିବା/ରିଚାର୍ଜ କରିବା ଆଦି) ବ୍ୟବହାର କରିପାରିବେ ।
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 10,
                        }}>
                        {Array.from({length: 15}, (_, index) => (
                          <View
                            key={index}
                            style={{
                              width: '4%',
                              borderBottomWidth: 1,
                              borderBottomColor: 'grey',
                            }}
                          />
                        ))}
                      </View>
                      <View style={{alignItems: 'center', marginVertical: 20}}>
                        <View
                          style={{
                            width: '80%',
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginVertical: 10,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: FontFamily.poppinsMedium,
                            color: '#333333',
                            fontSize: 13,
                            textAlign: 'center',
                            alignItems: 'center',
                            // marginBottom: 10,
                          }}>
                          ଅଭିନନ୍ଦନ ଏହା ଆପଣଙ୍କର କୁପନ୍ କୋଡ୍ | ତଳେ ଦିଆଯାଇଥିବା
                          ୧୪-ସଂଖ୍ୟକ କୋଡ୍ ଉପରେ କ୍ଲିକ୍ କରି ଏହାକୁ copy କରିପାରିବେ ।
                        </Text>
                        {/* Coupon Section */}
                        <TouchableOpacity
                          onPress={() =>
                            copyToClipboard(amazonCode?.couponCode)
                          }>
                          {/* Coupon Code */}
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: 'transparent', // Set border color to transparent
                              padding: 15,
                              borderRadius: 50, // Increase border radius for a rounder shape
                              marginVertical: 20,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center', // Align text in the center horizontally
                              // width: '100%',
                              marginBottom: 10,
                              backgroundColor: '#0060CA', // Apply background color to the container
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                color: 'white',
                                textAlign: 'center',
                              }}>
                              {amazonCode?.couponCode}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontFamily: FontFamily.poppinsMedium,
                            color: '#333333',
                            fontSize: 12,
                            textAlign: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          ତଳେ ଦିଆଯାଇଥିବା ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରି ଆପଣ ସିଧାସଳଖ ଭାବରେ
                          Amazonରେ ଏହି Amazon Gift Voucher (14-digit) କୁ Redeem
                          କରିପାରିବେ ।
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(
                              'https://www.amazon.in/gp/css/gc/payment',
                            ); // Replace 'YOUR_NEW_LINK_HERE' with your desired URL
                          }}>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: 'transparent',
                              padding: 10,
                              borderRadius: 50,
                              marginVertical: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#0060CA',
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: 'white',
                                textAlign: 'center',
                              }}>
                              Reedem କରନ୍ତୁ ।
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontFamily: FontFamily.poppinsMedium,
                            color: '#333333',
                            fontSize: 12,
                            fontWeight: '100',
                            // width: window.WindowWidth * 0.9,
                          }}>
                          Expire Date: {''}
                          {moment(amazonCode?.expireDate).format('DD-MM-YYYY')}
                        </Text>

                        {/* Additional Text */}
                        {/* <Text
                      style={{
                        fontFamily: FontFamily.poppinsMedium,
                        color: '#333333',
                        fontSize: 14,
                        textAlign: 'center',
                      }}>
                      ଯଦି ଆପଣ ଏହାକୁ କିପରି ବ୍ୟବହାର କରିବେ ଜାଣନ୍ତି ନାହିଁ, ଭିଡିଓ
                      ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖିବା ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ | .
                    </Text> */}

                        {/* Video Tutorial Link */}
                        {/* <TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 14,
                          textAlign: 'center',
                          fontWeight: 'bold',
                          marginTop: 20,
                        }}>
                        video
                      </Text>
                    </TouchableOpacity> */}
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Modal>

            <Modal
              visible={rewardModal}
              onRequestClose={closeRewardModal}
              animationType="slide">
              <View style={{flex: 1}}>
                <View style={{backgroundColor: Color.royalblue, padding: 10}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginLeft: 5,
                      fontFamily: FontFamily.poppinsMedium,
                    }}>
                    REWARD COUPONS
                  </Text>
                </View>
                <ScrollView style={{backgroundColor: 'white'}}>
                  {loader ? (
                    <ActivityIndicator
                      size="large"
                      color={Color.royalblue}
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: 50,
                      }}
                    />
                  ) : redeemCount && redeemCount > 0 ? (
                    <View
                      style={{
                        // height: window.WindowHeigth * 1,
                        // height: 300, // Example height
                        // width: 360,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        borderRadius: 6,
                        // top: 20,
                        // margin: 10,
                        flexDirection: 'column',
                        // paddingBottom: 25,
                        paddingTop: 15,
                        alignItems: 'center',
                      }}>
                      <ScrollView
                        style={{flex: 1}}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}>
                        {reversedCouponsData &&
                          reversedCouponsData?.length > 0 &&
                          reversedCouponsData?.map((coupon, index) => (
                            <View
                              key={index}
                              // onPress={() => handleSelect(index)}
                              style={{
                                position: 'relative',
                                paddingTop: 10,
                                paddingBottom: 20,
                                backgroundColor: 'transparent',
                              }}>
                              <View
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}>
                                <ImageBackground
                                  source={require('../assets/Image/AmazonCoupBG.png')} // Replace with your background image
                                  style={{
                                    height: 170,
                                    width: windowWidth * 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    padding: 20,
                                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: 1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                  }}
                                  resizeMode="cover">
                                  <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View
                                      style={{paddingTop: 50, marginLeft: 10}}>
                                      <View>
                                        <Image
                                          source={require('../assets/Image/imageAmazon.png')}
                                          style={{
                                            width: 110,
                                            height: 40,
                                            borderRadius: 10,
                                          }}
                                        />
                                      </View>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        marginTop: -13,
                                        marginLeft: 20,
                                      }}>
                                      {Array.from({length: 10}, (_, index) => (
                                        <View
                                          key={index}
                                          style={{
                                            height: 10.5, // Adjust the height as needed
                                            borderLeftWidth: 1,
                                            borderLeftColor: 'grey',
                                            marginBottom: 5, // Adjust the margin as needed
                                          }}
                                        />
                                      ))}
                                    </View>
                                    <View
                                      style={{
                                        flex: 1,
                                        paddingLeft: 5,
                                        top: -10,
                                      }}>
                                      <Text
                                        style={{
                                          fontFamily: FontFamily.poppinsMedium,
                                          color: '#333333',
                                          fontSize: 25,
                                          fontWeight: '900',
                                          fontWeight: 'bold',
                                          marginLeft: 18,
                                          paddingTop: 5,
                                        }}>
                                        ₹{''}
                                        {coupon?.amount}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: FontFamily.poppinsMedium,
                                          color: '#333333',
                                          fontSize: 10,
                                          fontWeight: '100',
                                          marginLeft: 20,
                                          // width: window.WindowWidth * 0.9,
                                        }}>
                                        Redeemed :{' '}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: FontFamily.poppinsMedium,
                                          color: '#333333',
                                          fontSize: 10,
                                          fontWeight: '100',
                                          marginLeft: 20,
                                          // width: window.WindowWidth * 0.9,
                                        }}>
                                        {moment(coupon?.redeemedOn).format(
                                          'DD-MM-YYYY',
                                        )}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: FontFamily.poppinsMedium,
                                          color: '#333333',
                                          fontSize: 10,
                                          fontWeight: '100',
                                          marginLeft: 20,
                                          // width: window.WindowWidth * 0.9,
                                        }}>
                                        Expired :{' '}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: FontFamily.poppinsMedium,
                                          color: '#333333',
                                          fontSize: 10,
                                          fontWeight: '100',
                                          marginLeft: 20,
                                          // width: window.WindowWidth * 0.9,
                                        }}>
                                        {moment(coupon?.expireDate).format(
                                          'DD-MM-YYYY',
                                        )}
                                      </Text>
                                      <TouchableOpacity
                                        onPress={() => {
                                          couponModalOpen(coupon);
                                        }}
                                        style={{
                                          // width: '100%', // Adjust the width as needed
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          // marginRight: 70,
                                          right: 25,
                                          marginTop: 5, // Adjust the margin as needed
                                        }}>
                                        <Text
                                          style={{
                                            color: Color.white,
                                            fontWeight: '600',
                                            fontSize: 11,
                                            fontFamily:
                                              FontFamily.poppinsSemibold,
                                            backgroundColor: Color.royalblue,
                                            paddingHorizontal: 8,
                                            paddingVertical: 1,
                                            borderRadius: 50,
                                          }}>
                                          View Coupon
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </ImageBackground>
                              </View>
                            </View>
                          ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <Text
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        paddingTop: 60,
                        // paddingBottom: 30,
                        padding: 10,
                        fontFamily: FontFamily.poppinsMedium,
                        color: '#333333',
                        fontSize: 14,
                        textAlign: 'center',
                        width: window.WindowWidth * (1.7 / 2),
                      }}>
                      ବର୍ତ୍ତମାନ ଆପଣଙ୍କ ପାଖରେ କୌଣସି Amazon Voucher ଉପଲବ୍ଧ ନାହିଁ ।
                      Amazon Voucher ପାଇବା ପାଇଁ ଉପରେ ଦିଆଯାଇଥିବା Redeem ବଟନ୍ ଉପରେ
                      କ୍ଲିକ୍ କରନ୍ତୁ ।
                    </Text>
                  )}
                </ScrollView>
              </View>
            </Modal>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 30,
              }}>
              <View
                style={{
                  width: 149,
                  // height: 201,
                  backgroundColor: 'white',
                  borderRadius: 6,
                  alignItems: 'center',
                  paddingTop: 5,
                  paddingBottom: 20,
                }}>
                <Image
                  source={require('../assets/Image/2385856.png')}
                  style={{width: 68.05, height: 78.39}}
                />
                <Text
                  style={{
                    fontFamily: FontFamily.poppinsMedium,
                    color: '#333333',
                    fontSize: 13,
                  }}>
                  Your StreakDays
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.poppinsMedium,
                    color: '#333333',
                    fontSize: 22,
                    fontWeight: '900',
                  }}>
                  {coin[0]?.streakDays}
                </Text>
              </View>
              <View
                style={{
                  width: 149,
                  // height: 201,
                  backgroundColor: 'white',
                  borderRadius: 6,
                  alignItems: 'center',
                  paddingTop: 5,
                  paddingBottom: 20,
                }}>
                <Image
                  source={require('../assets/Image/Screenshot.png')}
                  style={{width: 83.81, height: 80.3}}
                />
                <Text
                  style={{
                    fontFamily: FontFamily.poppinsMedium,
                    color: '#333333',
                    fontSize: 13,
                  }}>
                  ThinkZone coins
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.poppinsMedium,
                    color: '#333333',
                    fontSize: 22,
                    fontWeight: '900',
                  }}>
                  {coin[0]?.coins > 0 ? coin[0]?.coins : 0}
                </Text>
                <TouchableOpacity
                  onPress={confirmRedeem}
                  style={{
                    color: Color.royalblue,
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    marginTop: 3,
                    // width: window.WindowWidth * 0.21,
                    // paddingTop: 2,
                  }}>
                  <Text
                    style={{
                      color: Color.white,
                      fontWeight: '600',
                      fontFamily: FontFamily.poppinsSemibold,
                      backgroundColor: Color.royalblue,
                      padding: 5,
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      // paddingLeft: 16,
                      // paddingRight: 2,
                      borderRadius: 20,
                      fontSize: 14,
                    }}>
                    Redeem
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* ----------------------------------------------coupons List--------------------------------------------------------- */}
            <View
              style={{
                width: window.WindowWidth * 0.9,
                alignSelf: 'center',
                // top: 50,
                margin: 10,
                top: '1%',
                backgroundColor: Color.ghostwhite,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Color.royalblue,
              }}>
              <Text style={styles.text1}>Amazon Coupon History</Text>
            </View>
            {loader ? (
              <ActivityIndicator
                size="large"
                color={Color.royalblue}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: 50,
                }}
              />
            ) : redeemCount && redeemCount > 0 ? (
              <View
                style={{
                  // height: window.WindowHeigth * 1.,
                  // height: 300, // Example height
                  width: window.WindowWidth * 1,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  borderRadius: 6,
                  top: 20,
                  margin: 10,
                  flexDirection: 'column',
                  paddingBottom: 25,
                  paddingTop: 25,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: windowWidth * 0.9,
                  }}>
                  <Text
                    style={{
                      fontFamily: FontFamily.poppinsMedium,
                      color: '#333333',
                      fontSize: 12,
                      fontWeight: '100',
                      // marginLeft: 20,
                    }}>
                    ପ୍ରଥମ ଥର Amazon Pay Voucher ରିଡ଼ିମ୍ କରିବା ପାଇଁ{' '}
                    <Text style={{fontWeight: 'bold'}}>୭୦୦</Text> ଟି କଏନ୍ କିମ୍ବା
                    ଲିଡରବୋର୍ଡରେ ସ୍ଥାନ ପାଇଥିବା ଆବଶ୍ୟକ ଅଟେ । ପରବର୍ତ୍ତୀ ସମୟରେ ଆପଣ
                    କେବଳ
                    <Text style={{fontWeight: 'bold'}}> ୨୦୦</Text> ଟି କଏନ୍
                    ରିଡ଼ିମ୍ କରିପାରିବେ ।
                  </Text>
                </View>
                <ScrollView
                  style={{flex: 1}}
                  // nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}>
                  {reversedCouponsData &&
                    reversedCouponsData?.length > 0 &&
                    reversedCouponsData?.slice(0, 5)?.map((coupon, index) => (
                      <View
                        key={index}
                        // onPress={() => handleSelect(index)}
                        style={{
                          position: 'relative',
                          paddingTop: 10,
                          paddingBottom: 20,
                          backgroundColor: 'transparent', // Make the container transparent to see the background image
                        }}>
                        <View
                        // nestedScrollEnabled={true}
                        // showsVerticalScrollIndicator={false}
                        >
                          {/* {index === 0 && (
                          <Text
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              paddingBottom: 20,
                            }}>
                            700 କଇନ୍ ସହିତ ଆପଣଙ୍କର ପ୍ରଥମ କୁପନ୍ ପାଆନ୍ତୁ! 🌟
                          </Text>
                        )} */}
                          <ImageBackground
                            source={require('../assets/Image/AmazonCoupBG.png')} // Replace with your background image
                            style={{
                              height: 170,
                              width: window.WindowWidth * 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              borderRadius: 20,
                              padding: 20,
                              shadowColor: 'rgba(0, 0, 0, 0.2)',
                              shadowOffset: {width: 0, height: 2},
                              shadowOpacity: 1,
                              shadowRadius: 4,
                              elevation: 3,
                            }}
                            resizeMode="cover">
                            {/* <Image
                            source={require('../assets/Image/lockIcon.png')} // Replace with your lock icon
                            style={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              width: 20,
                              height: 20,
                            }}
                          /> */}
                            <View style={{flex: 1, flexDirection: 'row'}}>
                              <View style={{paddingTop: 50}}>
                                <View>
                                  <Image
                                    source={require('../assets/Image/imageAmazon.png')}
                                    style={{
                                      width: 110,
                                      height: 40,
                                      borderRadius: 10,
                                      marginLeft: 5,
                                    }}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  marginTop: -13,
                                  marginLeft: 20,
                                }}>
                                {Array.from({length: 10}, (_, index) => (
                                  <View
                                    key={index}
                                    style={{
                                      height: 10.5, // Adjust the height as needed
                                      borderLeftWidth: 1,
                                      borderLeftColor: 'grey',
                                      marginBottom: 5, // Adjust the margin as needed
                                    }}
                                  />
                                ))}
                              </View>

                              <View style={{flex: 1, paddingLeft: 5, top: -10}}>
                                <Text
                                  style={{
                                    fontFamily: FontFamily.poppinsMedium,
                                    color: '#333333',
                                    fontSize: 25,
                                    fontWeight: '900',
                                    fontWeight: 'bold',
                                    marginLeft: 18,
                                    paddingTop: 5,
                                  }}>
                                  ₹{''}
                                  {coupon?.amount}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily.poppinsMedium,
                                    color: '#333333',
                                    fontSize: 10,
                                    fontWeight: '100',
                                    marginLeft: 20,
                                    // width: window.WindowWidth * 0.9,
                                  }}>
                                  Redeemed :{' '}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily.poppinsMedium,
                                    color: '#333333',
                                    fontSize: 10,
                                    fontWeight: '100',
                                    marginLeft: 20,
                                    // width: window.WindowWidth * 0.9,
                                  }}>
                                  {moment(coupon?.redeemedOn).format(
                                    'DD-MM-YYYY',
                                  )}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily.poppinsMedium,
                                    color: '#333333',
                                    fontSize: 10,
                                    fontWeight: '100',
                                    marginLeft: 20,
                                    // width: window.WindowWidth * 0.9,
                                  }}>
                                  Expired :{' '}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily.poppinsMedium,
                                    color: '#333333',
                                    fontSize: 10,
                                    fontWeight: '100',
                                    marginLeft: 20,
                                    // width: window.WindowWidth * 0.9,
                                  }}>
                                  {moment(coupon?.expireDate).format(
                                    'DD-MM-YYYY',
                                  )}
                                </Text>

                                <TouchableOpacity
                                  onPress={() => {
                                    couponModalOpen(coupon);
                                  }}
                                  style={{
                                    // width: '100%', // Adjust the width as needed
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // marginRight: 70,
                                    right: 28,
                                    marginTop: 5, // Adjust the margin as needed
                                  }}>
                                  <Text
                                    style={{
                                      color: Color.white,
                                      fontWeight: '600',
                                      fontSize: 11,
                                      fontFamily: FontFamily.poppinsSemibold,
                                      backgroundColor: Color.royalblue,
                                      paddingHorizontal: 8,
                                      paddingVertical: 1,
                                      borderRadius: 50,
                                    }}>
                                    View Coupon
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                          {/* {index === 0 && (
                          <Text
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              paddingTop: 20,
                              paddingBottom: 30,
                              width: window.WindowWidth * (1.4 / 2),
                            }}>
                            କେବଳ ପ୍ରଥମ କୁପନ୍ ରିଡିମ କରିବା ପରେ, ତୁମେ ପରବର୍ତ୍ତୀ
                            କୁପନ୍ ଗୁଡିକୁ ରିଡିମ କରିପରିଵ | ସେ ଯାଏଁ ଏହା ଲକ ରହିବ
                          </Text>
                        )} */}
                        </View>
                      </View>
                    ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={openRewardModal}
                  style={{
                    color: Color.royalblue,
                    alignSelf: 'flex-end',
                    // padding: 10,
                    borderWidth: 2,
                    borderColor: Color.royalblue,
                    width: 100,
                    height: 30,
                    top: '1%',
                    borderRadius: 5,
                    right: '4%',
                  }}>
                  <Text
                    style={{
                      color: Color.royalblue,
                      fontWeight: '600',
                      // top: -4,
                      top: 2,
                      textAlign: 'center',
                      fontSize: 13,
                      fontFamily: FontFamily.poppinsSemibold,
                    }}>
                    View More
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingTop: 60,
                  // paddingBottom: 30,
                  padding: 10,
                  fontFamily: FontFamily.poppinsMedium,
                  color: '#333333',
                  fontSize: 14,
                  textAlign: 'center',
                  width: window.WindowWidth * (1.7 / 2),
                }}>
                ବର୍ତ୍ତମାନ ଆପଣଙ୍କ ପାଖରେ କୌଣସି Amazon Voucher ଉପଲବ୍ଧ ନାହିଁ ।
                Amazon Voucher ପାଇବା ପାଇଁ ଉପରେ ଦିଆଯାଇଥିବା Redeem ବଟନ୍ ଉପରେ
                କ୍ଲିକ୍ କରନ୍ତୁ ।
              </Text>
            )}
            <Modal
              animationType="slide"
              transparent={true}
              visible={couponModal}
              onRequestClose={() => closeCouponModal()}>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => closeCouponModal()}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: windowWidth,
                    height: windowHeight,
                    backgroundColor: 'rgba(0,0,0,0.5)', // Adjust the opacity as needed
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: windowHeight * 0.79,
                      width: windowWidth * 0.8,
                      margin: 20,
                      borderRadius: 15,
                      padding: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 30,
                        marginBottom: 20,
                      }}>
                      <Image
                        source={require('../assets/Image/imageAmazon.png')}
                        style={{
                          marginTop: 20,
                          height: 45,
                          width: 120,
                        }}
                      />
                      <Text
                        style={{
                          // fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 30,
                          fontWeight: 'bold',
                          marginLeft: 40,
                        }}>
                        ₹ {EachModalData?.amount}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        marginVertical: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 13,
                          textAlign: 'center',
                        }}>
                        ଆପଣ Amazon ରେ ଉପଲବ୍ଧ ଥିବା ବିଭିନ୍ନ ସେବାଗୁଡିକରେ (ଜିନିଷ
                        କିଣିବା/ରିଚାର୍ଜ କରିବା ଆଦି) ବ୍ୟବହାର କରିପାରିବେ ।
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 10,
                      }}>
                      {Array.from({length: 15}, (_, index) => (
                        <View
                          key={index}
                          style={{
                            width: '4%',
                            borderBottomWidth: 1,
                            borderBottomColor: 'grey',
                          }}
                        />
                      ))}
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        marginVertical: 20,
                      }}>
                      <View
                        style={{
                          width: '80%',
                          borderBottomColor: 'black',
                          borderBottomWidth: 1,
                          marginVertical: 10,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 13,
                          textAlign: 'center',
                          alignItems: 'center',
                          // marginBottom: 10,
                        }}>
                        ଅଭିନନ୍ଦନ ଏହା ଆପଣଙ୍କର କୁପନ୍ କୋଡ୍ | ତଳେ ଦିଆଯାଇଥିବା
                        ୧୪-ସଂଖ୍ୟକ କୋଡ୍ ଉପରେ କ୍ଲିକ୍ କରି ଏହାକୁ copy କରିପାରିବେ ।
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(EachModalData?.couponCode)
                        }>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: 'transparent', // Set border color to transparent
                            padding: 15,
                            borderRadius: 50, // Increase border radius for a rounder shape
                            marginVertical: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center', // Align text in the center horizontally
                            // width: '100%',
                            marginBottom: 10,
                            backgroundColor: '#0060CA', // Apply background color to the container
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              color: 'white',
                              textAlign: 'center', // Center the text inside the container
                            }}>
                            {EachModalData?.couponCode}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 12,
                          textAlign: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        ତଳେ ଦିଆଯାଇଥିବା ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରି ଆପଣ ସିଧାସଳଖ ଭାବରେ
                        Amazonରେ ଏହି Amazon Gift Voucher (14-digit) କୁ Redeem
                        କରିପାରିବେ ।
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            'https://www.amazon.in/gp/css/gc/payment',
                          ); // Replace 'YOUR_NEW_LINK_HERE' with your desired URL
                        }}>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: 'transparent',
                            padding: 10,
                            borderRadius: 50,
                            marginVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#0060CA',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'white',
                              textAlign: 'center',
                            }}>
                            Reedem କରନ୍ତୁ ।
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 14,
                          fontWeight: '100',
                          // marginBottom: 20,
                          // width: window.WindowWidth * 0.9,
                        }}>
                        Expire Date: {''}
                        {moment(amazonCode?.expireDate).format('DD-MM-YYYY')}
                      </Text>
                      {/* <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: '#333333',
                          fontSize: 14,
                          textAlign: 'center',
                        }}>
                        ଯଦି ଆପଣ ଏହାକୁ କିପରି ବ୍ୟବହାର କରିବେ ଜାଣନ୍ତି ନାହିଁ, ଭିଡିଓ
                        ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖିବା ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ | .
                      </Text>
                      <TouchableOpacity>
                        <Text
                          style={{
                            fontFamily: FontFamily.poppinsMedium,
                            color: '#333333',
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            marginTop: 20,
                          }}>
                          video
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* ----------------------------------------------coupons List--------------------------------------------------------- */}

            {/* ------------------------------------------Mile Stone---------------------------------------------- */}
            <View style={{top: 20, paddingBottom: 25}}>
              <View style={{position: 'absolute'}}>
                {selectedIndex !== null && (
                  <></>
                  // <>
                  //   <View
                  //     style={{
                  //       backgroundColor: 'ghostwhite',
                  //       width: window.WindowWidth * 0.8,
                  //       position: 'relative',
                  //       alignSelf: 'flex-start',
                  //       left: '10%',
                  //       // height: 100,
                  //       justifyContent: 'center',
                  //       top: '60%',
                  //       borderRadius: 20,
                  //       alignItems: 'center',
                  //       padding: 20, // Adding padding for better spacing
                  //       shadowColor: 'rgba(0, 0, 0, 0.2)', // Adding shadow for tooltip effect
                  //       shadowOffset: {width: 0, height: 2},
                  //       shadowOpacity: 1,
                  //       shadowRadius: 4,
                  //       elevation: 3, // Elevation for Android shadow
                  //     }}>
                  //     {milstone[selectedIndex]?.heading?.length != '' ? (
                  //       <Text
                  //         style={{
                  //           top: '-55%',
                  //           // marginTop: '80%',
                  //           fontSize: 15,
                  //           width: 300,
                  //           fontWeight: '800',
                  //           color: 'black',
                  //           position: 'absolute',
                  //           paddingBottom: 20,
                  //           paddingTop: 5,
                  //           alignSelf: 'center',
                  //           textAlign: 'center',
                  //         }}>
                  //         {milstone[selectedIndex]?.heading}
                  //       </Text>
                  //     ) : (
                  //       <Text
                  //         style={{
                  //           top: '-65%',
                  //           // marginTop: '80%',
                  //           fontSize: 17,
                  //           width: 300,
                  //           fontWeight: '800',
                  //           color: 'black',
                  //           position: 'absolute',
                  //           paddingBottom: 30,
                  //           paddingTop: 5,
                  //           alignSelf: 'center',
                  //           textAlign: 'center',
                  //         }}>
                  //         ମୋ ପ୍ରଗତି
                  //       </Text>
                  //     )}

                  //     <View>
                  //       <Text
                  //         style={{
                  //           fontSize: 13,
                  //           color: '#595F65',
                  //           fontWeight: '800',
                  //         }}>
                  //         {milstone[selectedIndex]?.msg}
                  //       </Text>
                  //       {milstone[selectedIndex]?.msg ? (
                  //         <View style={{top: '5%'}}>
                  //           <Text
                  //             style={{
                  //               fontSize: 11,
                  //               color: '#595F65',
                  //               fontWeight: '800',
                  //             }}>
                  //             Date-
                  //             {moment(
                  //               milstone[selectedIndex]?.createdon,
                  //             ).format('DD/MM/YY')}
                  //           </Text>
                  //           {milstone[selectedIndex]?.transactionType ===
                  //           'credit' ? (
                  //             <Text
                  //               style={{
                  //                 fontSize: 11,
                  //                 top: '4%',
                  //                 color: 'green',
                  //                 fontWeight: '800',
                  //               }}>
                  //               <Text
                  //                 style={{
                  //                   fontSize: 11,
                  //                   top: '4%',
                  //                   color: '#595F65',
                  //                   fontWeight: '800',
                  //                 }}>
                  //                 Coin: {''}
                  //               </Text>
                  //               +{milstone[selectedIndex]?.coins}
                  //             </Text>
                  //           ) : (
                  //             <Text
                  //               style={{
                  //                 fontSize: 11,
                  //                 top: '4%',
                  //                 color: '#eb3875',
                  //                 fontWeight: '800',
                  //               }}>
                  //               <Text
                  //                 style={{
                  //                   fontSize: 11,
                  //                   top: '4%',
                  //                   color: '#595F65',
                  //                   fontWeight: '800',
                  //                 }}>
                  //                 Coin: {''}
                  //               </Text>
                  //               -{milstone[selectedIndex]?.coins}
                  //             </Text>
                  //           )}
                  //         </View>
                  //       ) : (
                  //         <ActivityIndicator
                  //           size="large"
                  //           color="blue"
                  //           style={{
                  //             justifyContent: 'center',
                  //             alignSelf: 'center',
                  //           }}
                  //         />
                  //       )}
                  //     </View>
                  //   </View>
                  // </>
                )}
              </View>

              {/* <View
                style={{
                  flexDirection: 'row',
                  width: window.WindowWidth * 0.95,
                  backgroundColor: 'white',
                  // position: 'absolute',
                  top: 10,
                  alignSelf: 'center',
                  // borderRadius: 10,
                  // justifyContent: 'space-evenly',
                  // flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  paddingTop: 200,
                  borderRadius: 15,
                }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {milstone.map((item, index) => (
                    <>
                      <View
                        key={index}
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          padding: 20,
                          alignItems: 'flex-start',

                          paddingRight: 50,

                          margin: 7,
                          borderBottomWidth: selectedIndex === index ? 2 : null,
                          width: 50,
                          borderColor:
                            selectedIndex === index ? Color.royalblue : '',
                        }}>
                        <TouchableOpacity
                          key={index}
                          onPress={() => openMessage(index)}
                          style={{
                            // backgroundColor: '#A3D735',
                            backgroundColor:
                              selectedIndex === index ? '#0060CA' : '#A3D735',

                            letterSpacing: selectedIndex === index ? 2 : 0,
                            borderRadius: 50,
                            width: 30.72,
                            // alignSelf: 'center',
                            height: 31.66,
                            // left: '7%',
                            // top: 15,
                          }}>
                          <Text>{item.msg}</Text>
                          <Text
                            style={{
                              fontSize: 15,
                              textAlign: 'center',
                              // justifyContent: 'center',
                              alignItems: 'center',
                              // flex: 1,
                              fontWeight: 'bold',
                              // color: 'black',
                              color:
                                selectedIndex === index ? '#FFFFFF' : '#595F65',
                              top: 3,
                            }}>
                            {index + 1}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ))}
                </ScrollView>
              </View> */}
            </View>
            {/* ------------------------------------------Mile Stone End---------------------------------------------- */}

            <Modal
              visible={modalOpen}
              onRequestClose={closeTransactionModal}
              animationType="slide">
              <View style={{flex: 1}}>
                <View style={{backgroundColor: Color.royalblue, padding: 10}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginLeft: 5,
                      fontFamily: FontFamily.poppinsMedium,
                    }}>
                    TRANSACTIONS
                  </Text>
                </View>
                <ScrollView style={{backgroundColor: '#f5f5f5'}}>
                  <RewardTransaction />
                </ScrollView>
              </View>
            </Modal>
            <View style={{top: '1%', margin: 10, paddingBottom: 10}}>
              <View
                style={{
                  width: window.WindowWidth * 0.92,
                  alignSelf: 'center',
                  // top: 50,
                  margin: 10,
                  top: '1%',
                  backgroundColor: Color.ghostwhite,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: Color.royalblue,
                }}>
                <Text style={styles.text1}>Reward Transaction History</Text>
              </View>

              {transaction_record.length > 0 ? (
                <View
                  style={{
                    // width: window.WindowWidth * 0.92,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    borderRadius: 6,
                    top: 20,
                    margin: 10,
                    flexDirection: 'column',
                    width: 360,
                    paddingBottom: 25,
                    paddingTop: 25,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      paddingBottom: 15,
                    }}>
                    <Text style={[styles.headerText, {right: '145%'}]}>
                      Activity
                    </Text>
                    {/* <Text style={{fontSize: 17, fontWeight: 'bold', color: 'black'}}>
                Date
              </Text> */}
                    <Text
                      style={[
                        styles.headerText,
                        {alignSelf: 'center', right: 0, left: '125%'},
                      ]}>
                      Coins
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomWidth: 0.7,
                      borderBottomColor: Color.greyGrey300,
                      // marginLeft: 20,
                      paddingBottom: 5,
                      top: '-2%',
                    }}></View>
                  {transaction_record.map((item, index) => (
                    <View>
                      {item.transactionType === 'credit' ? (
                        <>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                // marginLeft: 32,
                                flexDirection: 'column',
                                color:
                                  item.transactionType === 'credit'
                                    ? '#000000'
                                    : '#000000',
                                width: 252,
                                padding: 10,
                              }}>
                              <Text
                                style={{
                                  top: -2,
                                  fontWeight: '500',
                                  color: '#666666',
                                }}>
                                {moment(item.createdon).format('DD/MM/YY')}
                              </Text>
                              {'\n'}
                              {'\n'}
                              {item.msg}
                            </Text>
                            {/* <Text
                    style={{
                      marginLeft: 36,
                      color:
                        item.transactionType === 'credit'
                          ? '#666666'
                          : '#666666',
                    }}> */}
                            {/* {moment(item.createdon).format('DD/MM/YY')}
                  </Text> */}
                            {item?.transactionType === 'credit' ? (
                              <View style={{flexDirection: 'column'}}>
                                <Image
                                  style={{
                                    marginLeft: 58,
                                    top: '15%',
                                    width: 22,
                                    height: 22,
                                  }}
                                  source={require('../assets/Image/coinss.png')}
                                />
                                <Text
                                  style={{
                                    marginLeft: 57,
                                    color: 'green',
                                    top: '20%',
                                  }}>
                                  +{item.currentBalance - item.previousBalance}
                                </Text>
                              </View>
                            ) : (
                              <View style={{flexDirection: 'column'}}>
                                <Image
                                  style={{
                                    marginLeft: 58,
                                    top: '15%',
                                    width: 22,
                                    height: 22,
                                  }}
                                  source={require('../assets/Image/coinss.png')}
                                />
                                <Text
                                  style={{
                                    marginLeft: 57,
                                    color: 'green',
                                    top: '20%',
                                  }}>
                                  -{item.currentBalance - item.previousBalance}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              borderBottomWidth: 0.7,
                              borderBottomColor: Color.greyGrey300,
                            }}></View>
                        </>
                      ) : (
                        <>
                          {/* <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{marginLeft: 32, color: 'red', width: 100}}>
                          {item.msg}
                        </Text>

                        <Text style={{marginLeft: 23, color: 'red'}}>
                          {moment(item.createdon).format('DD/MM/YY')}
                        </Text>
                        <Image
                          style={{
                            marginLeft: 58,
                            top: '15%',
                            width: 22,
                            height: 22,
                          }}
                          source={require('../assets/Image/coinss.png')}
                        />
                        <Text style={{marginLeft: 63, color: 'red'}}>
                          {item.currentBalance - item.previousBalance}
                        </Text>
                      </View> */}
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                // marginLeft: 32,
                                flexDirection: 'column',
                                color: 'red',

                                width: 252,
                                padding: 10,
                              }}>
                              <Text
                                style={{
                                  top: -2,
                                  fontWeight: '500',
                                  color: '#666666',
                                }}>
                                {moment(item.createdon).format('DD/MM/YY')}
                              </Text>
                              {'\n'}
                              {'\n'}
                              {item.msg}
                            </Text>
                            {/* <Text
                    style={{
                      marginLeft: 36,
                      color:
                        item.transactionType === 'credit'
                          ? '#666666'
                          : '#666666',
                    }}> */}
                            {/* {moment(item.createdon).format('DD/MM/YY')}
                  </Text> */}
                            {item?.transactionType === 'credit' ? (
                              <View style={{flexDirection: 'column'}}>
                                <Image
                                  style={{
                                    marginLeft: 58,
                                    top: '15%',
                                    width: 22,
                                    height: 22,
                                  }}
                                  source={require('../assets/Image/coinss.png')}
                                />
                                <Text
                                  style={{
                                    marginLeft: 57,
                                    color: 'red',
                                    top: '20%',
                                  }}>
                                  +{item.currentBalance - item.previousBalance}
                                </Text>
                              </View>
                            ) : (
                              <View style={{flexDirection: 'column'}}>
                                <Image
                                  style={{
                                    marginLeft: 58,
                                    top: '15%',
                                    width: 22,
                                    height: 22,
                                  }}
                                  source={require('../assets/Image/coinss.png')}
                                />
                                <Text
                                  style={{
                                    marginLeft: 57,
                                    color: 'red',
                                    top: '20%',
                                  }}>
                                  {item.currentBalance - item.previousBalance}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              borderBottomWidth: 0.7,
                              borderBottomColor: Color.greyGrey300,
                            }}></View>
                        </>
                      )}

                      {/* ) : null} */}
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={openTransactionModal}
                    style={{
                      color: Color.royalblue,
                      alignSelf: 'flex-end',
                      // padding: 10,
                      borderWidth: 2,
                      borderColor: Color.royalblue,
                      width: 100,
                      height: 30,
                      top: '2%',
                      borderRadius: 5,
                      right: '2%',
                    }}>
                    <Text
                      style={{
                        color: Color.royalblue,
                        fontWeight: '600',
                        // top: -4,
                        top: 2,
                        textAlign: 'center',
                        fontSize: 13,
                        fontFamily: FontFamily.poppinsSemibold,
                      }}>
                      View More
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : isLoading ? (
                <View>
                  <ActivityIndicator
                    size="large"
                    color="blue"
                    style={{justifyContent: 'center', alignSelf: 'center'}}
                  />
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: 22,
                    textAlign: 'center',
                    color: 'red',
                    marginTop: 12,
                  }}>
                  No data found
                </Text>
              )}
            </View>
            {/* <View
              style={{
                paddingLeft: -19,
                paddingRight: -19,
                width: window.WindowWidth * 0.92,
                alignSelf: 'center',
                // top: 50,
                margin: 10,
              }}>
              <Text style={styles.text}>Time Spent Report</Text>
            </View> */}

            {/* {timeSpent_record.length > 0 ? (
              <View
                style={{
                  width: window.WindowWidth * 0.92,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  borderRadius: 6,
                  // top: 20,
                  margin: 10,
                }}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{flex: 3, marginLeft: 36}}>
                      Year
                    </DataTable.Title>
                    <DataTable.Title style={{flex: 3}}>Month</DataTable.Title>
                    <DataTable.Title style={{flex: 3}}>
                      Time Spent
                    </DataTable.Title>
                  </DataTable.Header>
                  <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    updateCellsBatchingPeriod={40}
                    data={timeSpent_record}
                    renderItem={({item, index}) => (
                      <DataTable.Row style={{flex: 3}}>
                        <DataTable.Cell style={{marginLeft: 32}}>
                          {item.year ? item.year : 'NA'}
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 1, paddingLeft: 20}}>
                          {item.month === 1
                            ? 'Jan'
                            : item.month === 2
                            ? 'Feb'
                            : item.month === 3
                            ? 'March'
                            : item.month === 4
                            ? 'April'
                            : item.month === 5
                            ? 'May'
                            : item.month === 6
                            ? 'June'
                            : item.month === 7
                            ? 'July'
                            : item.month === 8
                            ? 'Aug'
                            : item.month === 9
                            ? 'Sep'
                            : item.month === 10
                            ? 'Oct'
                            : item.month === 11
                            ? 'Nov'
                            : item.month === 12
                            ? 'Dec'
                            : 'NA'}
                        </DataTable.Cell>
                        <DataTable.Cell style={{paddingLeft: 13}}>
                        

                          {item.timeSpent ? item.timeSpent + 'mins' : '0 mins'}
                        </DataTable.Cell>
                      </DataTable.Row>
                    )}
                  />
                </DataTable>
              </View>
            ) : isLoading ? (
              <View>
                <ActivityIndicator
                  size="large"
                  color="blue"
                  style={{justifyContent: 'center', alignSelf: 'center'}}
                />
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 22,
                  textAlign: 'center',
                  color: 'red',
                  marginTop: 12,
                }}>
                No data found
              </Text>
            )} */}
          </View>
        </ScrollView>
      )}
    </GestureHandlerRootView>
  );
};

export default Myachivement;

const styles = StyleSheet.create({
  tab: {paddingTop: 6},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text2: {textAlign: 'center', color: 'black'},
  container: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    backgroundColor: '#e7e7e7',
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  text: {
    flexDirection: 'row',
    marginTop: 15,
    textAlign: 'center',

    backgroundColor: Color.royalblue,

    paddingBottom: 15,
    paddingTop: 20,
    borderRadius: 12,

    fontSize: 20,

    color: 'white',
    fontFamily: FontFamily.poppinsSemibold,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalt: {
    color: 'white',
    fontSize: 15,
    marginLeft: 20,
    textAlign: 'right',
    paddingRight: 70,
    paddingBottom: 10,
    fontWeight: '700',
    fontFamily: 'serif',
    // justifyContent: 'flex-start',
  },
  view: {
    paddingTop: 20,
  },
  textFeedback: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    color: 'black',
    paddingLeft: 8,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    // borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // width: '100%', // Adjust width as needed
    // maxWidth: 800, // Maximum width
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'green',
    // marginTop: 184,
    marginTop: 29,
    paddingLeft: 49,
    paddingRight: 49,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 19,
  },
  backgroundImage: {
    // ...StyleSheet.absoluteFillObject,
    width: window.WindowWidth * 13,
    height: window.WindowHeigth * 0.25,
    aspectRatio: 17 / 7,
    // aspectRatio: 17 / 2,
    // alignSelf: 'center',
    top: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // modalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },

  username: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    // textTransform: 'capitalize',
    textAlign: 'center',
    fontWeight: '800',
  },
  steps: {
    width: window.WindowWidth * 0.7,
    fontSize: 15,
    marginTop: 10,
    fontWeight: '800',
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    // textTransform: 'capitalize',
    textAlign: 'left',
    lineHeight: 22,
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
  giftText: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
    // textTransform: 'capitalize',
    fontSize: 13,
    color: 'white',
    margin: 30,
    // marginBottom: 25,
    // marginTop: 40,
  },

  bu: {
    marginTop: 30,
    width: window.WindowWidth * 0.8,
    backgroundColor: Color.royalblue,
    padding: 4,
    borderRadius: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
    padding: 2,
  },

  buttonz: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 30,
    width: window.WindowWidth * 0.8,
    backgroundColor: Color.royalblue,
    padding: 5,
    // borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
