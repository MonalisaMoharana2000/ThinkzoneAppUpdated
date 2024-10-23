import React, {useState, useRef, useEffect} from 'react';
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
  BackHandler,
  ScrollView,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import DropdownComponent from '../components/DropdownComponent';
import * as Progress from 'react-native-progress';

import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';

import * as window from '../utils/dimensions';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {FontFamily, Color, FontSize, Border, Padding} from '../GlobalStyle';
import LinearGradient from 'react-native-linear-gradient';

import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
// import {Tooltip, Text, lightColors} from '@rneui/themed';
const {width: windowWidth} = Dimensions.get('window');
// import Tooltip from 'react-native-tooltip';
const {height} = Dimensions.get('window');

import {LineChart} from 'react-native-chart-kit';
import Api from '../environment/Api';
import ProgressAccordion from '../components/ProgressAccordion';

const Mopragati = ({navigation}) => {
  const user = useSelector(state => state.UserSlice.user);
  const progress = useSelector(state => state.UserSlice.userProgress);
  console.log('progress---->', progress);
  const coin = useSelector(state => state.UserSlice.rewards);
  const [blinkAnimation] = useState(new Animated.Value(0));

  const dates = moment(dates).format('YYYY');
  const curMonth = new Date().getMonth() + 1;
  const yearList = [];
  const [year, setYear] = useState(dates);
  console.log('year--------->', year);
  // const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [month, setMonth] = useState('');

  for (var i = 0; i <= 100; i++) {
    var yearss = new Date().getFullYear() - i;
    if (yearss < 2022) break;
    else yearList.push({name: `${yearss}`, value: `${yearss}`});
  }
  yearList.sort((a, b) => parseInt(a.value) - parseInt(b.value));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000); // Blinking interval: 1 second

    return () => clearInterval(interval);
  }, [blinkAnimation]);
  const textStyle = {
    alignSelf: 'center',
    fontSize: 7,
    fontFamily: 'Poppins-Medium', // Assuming FontFamily.poppinsMedium is your font family variable
    opacity: blinkAnimation,
    top: '30%',
  };

  const scrollData = [
    {
      text: 'ଏକବିଂଶ ଶତାବ୍ଦୀ',
      value: 'training1',
      url: require('../assets/Image/global-edit1.png'),
    },
    {
      text: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
      value: 'training2',
      url: require('../assets/Image/cpu2.png'),
    },
    {
      text: 'ଶିକ୍ଷଣ ଓ ଶିକ୍ଷାଦାନ',
      value: 'training3',
      url: require('../assets/Image/img2.png'),
    },
  ];
  // console.log(scrollData[0].value, 'ugaudysguydguagd------------------------');
  const [selData, setSelData] = useState(scrollData[0].value);
  console.log('selData----->', selData);

  const [modalValue, setModalValue] = useState(null);
  // console.log('modalValue------->', modalValue);

  const animationController = useRef(new Animated.Value(0)).current;

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const dispatch = useDispatch();
  //
  const [versionModal, setVersionModal] = useState(false);

  const [isStatus, setisStatus] = useState(false);
  const [achieve, setAchieve] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [timeSpent_record, setTimeSpent_record] = useState([]);
  console.log(timeSpent_record, 'timeSpent_record==================>');
  const [transaction_record, setTransaction_record] = useState([]);
  const [maintainanceStatus, setMaintainanceStatus] = useState({});
  // console.log(transaction_record,"transaction_record====================");
  const [reward, setReward] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = React.useState(false);

  const numColumns = 5;

  function handlePress() {
    setisStatus(true);
    //
  }

  const [selectedSection, setSelectedSection] = useState('');
  const [sBadges, setSbadges] = useState([]);
  console.log(sBadges, 'sBadges================================>');

  const fetchData = async () => {
    try {
      const response = await API.get(`getUserProgress/${user[0].userid}`);
      console.log('timespent ------->', response.data.timeSpentData);
      setSbadges(response.data.badgesData);
      setAchieve(response.data);
      setTimeSpent_record(response.data.timeSpentData);
      setIsloading(false);
    } catch (error) {
      if (error.response.status === 413) {
        // console.log('error is---------------->', error);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        // console.log('Error is--------------------->', error);
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

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const handleYearChange = async value => {
    console.log('yearclick------>', value);
    setYear(value);
    try {
      const resp = await API.get(`getUserProgress/${user[0].userid}/${value}`);
      console.log('yearclick2-------->', resp.data.timeSpentData);
      setTimeSpent_record(resp.data?.timeSpentData);
    } catch (err) {
      console.log('err----->', err);
    }
  };

  const handleMonthChange = async value => {
    console.log('monthclick------>', value);
    setMonth(value);
    try {
      if (value === 0) {
        const resp = await API.get(`getUserProgress/${user[0].userid}/${year}`);
        console.log('yearclick-------->', resp.data.timeSpentData);
        setTimeSpent_record(resp.data?.timeSpentData);
      } else {
        const resp = await API.get(
          `getUserProgress/${user[0].userid}/${year}/${value}`,
        );
        console.log('monthclick2-------->', resp.data.timeSpentData);
        setTimeSpent_record(resp.data?.timeSpentData);
      }
    } catch (err) {
      console.log('err----->', err);
    }
  };
  const monthlist = [
    // {id: 1, name: 'Select Month'},
    {name: 'January', value: 1},
    {name: 'Febuary', value: 2},
    {name: 'March', value: 3},
    {name: 'April', value: 4},
    {name: 'May', value: 5},
    {name: 'June', value: 6},
    {name: 'July', value: 7},
    {name: 'August', value: 8},
    {name: 'September', value: 9},
    {name: 'October', value: 10},
    {name: 'November', value: 11},
    {name: 'December', value: 12},
    {name: 'All', value: 0},
  ];
  useEffect(() => {
    setIsloading(true);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const showAlert = () => {
      Alert.alert(
        'Info',
        'ଧ୍ୟାନ ଦେବେ! ଚୟନ କରାଯାଇଥିବା ମାସ ଚଳିତ ମାସ ଠାରୁ ଅଧିକ ହୋଇ ପାରିବ ନାହିଁ।',
        [
          {
            text: 'OK',
            onPress: () => {
              setYear(currentYear);
              setMonth(currentMonth);
              setTimeSpent_record([]);
              setIsloading(false);
            },
          },
        ],
      );
    };
    if (dates < year && curMonth < month) {
      showAlert();
    }
    if (dates == year && curMonth < month) {
      // showAlert();
    } else {
      setIsloading(false);
    }
  }, [month, year]);

  //For Transaction aPI
  useFocusEffect(
    React.useCallback(() => {
      API.get(`getLast5CoinsTransaction/${user[0].userid}`).then(
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
            // console.log('error is---------------->', error);
            Alert.alert('The entity is too large !');
          } else if (error.response.status === 504) {
            // console.log('Error is--------------------->', error);
            Alert.alert('Gateway Timeout: The server is not responding!');
          } else if (error.response.status === 500) {
            // console.error('Error is------------------->:', error);
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

  useFocusEffect(
    React.useCallback(() => {
      //
      // Do something when the screen is focused
      // dispatch(types.rewardsUserstart(user[0].userid));
    }, []),
  );

  // For Info modal

  //  const lastFiveTransactions = transaction_record.slice(-5);

  // -----------------------milestoneApi (dhaneswar)------------------
  const scrollX = useRef(new Animated.Value(0)).current;
  const [milstone, setMilstone] = useState([]);
  console.log('====================================milstone', milstone);

  const [modal, setModal] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [amazonCode, setAmazonCode] = useState('no code');

  const [dummyData1, setDummyData1] = useState([]);

  const [background, setBackground] = useState();

  function handlePress() {
    setisStatus(true);
    //
  }

  const [show, setShow] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const transUserProgressResponse = await API.get(
          `getTransUserProgress/${user[0].userid}`,
        );
        console.log('milestoneresponse------>', transUserProgressResponse.data);
        setMilstone(transUserProgressResponse.data.reverse());
      };
      fetchData();
    }, []),
  );

  useEffect(() => {
    API.get(`getMaintainanceStatus/fellow`)
      .then(response => {
        setMaintainanceStatus(response.data);
        // setmaintainanceModal(false);
      })
      .catch(error => {
        if (error.response.status === 413) {
          // console.log('error is---------------->', error);
          Alert.alert('The entity is too large !');
        } else if (error.response.status === 504) {
          // console.log('Error is--------------------->', error);
          Alert.alert('Gateway Timeout: The server is not responding!');
        } else if (error.response.status === 500) {
          // console.error('Error is------------------->:', error);
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Error is------------------->:', error);
        }
      });
  }, []);

  const coinsAvailable = coin[0]?.coins;

  const [isVisible, setIsVisible] = useState(false);
  const openMessage = index => {
    setSelectedIndex(index);
    setIsVisible(true);
  };

  //-------------------------Opening Transactions---------------
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const backAction = () => {
      dispatch(FcmSlice.clearfcmMessage());
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //--------------------------------------------------------------

  const images = [
    require('../assets/Image/img1.png'),
    require('../assets/Image/img2.png'),
    require('../assets/Image/img3.png'),
    require('../assets/Image/img4.png'),
  ];
  const imagess = [
    require('../assets/Image/img2.png'),
    require('../assets/Image/img4.png'),

    require('../assets/Image/img3.png'),
    require('../assets/Image/img1.png'),
  ];
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);

  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
    setSelectedImage1(imagess[randomIndex]);
  };
  const selectRandomImages = () => {
    const randomIndex = Math.floor(Math.random() * images.length);

    setSelectedImage1(imagess[randomIndex]);
  };

  useEffect(() => {
    selectRandomImage();
    selectRandomImages();
  }, []);

  const [modulesData, setModulesData] = useState([]);
  const [subModulesData, setSubModulesData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [showContent, setShowContent] = useState(
    Array(dummyData1.length).fill(false),
  );
  const [openAccordion, setOpenAccordion] = useState(-1);

  const toggleListItem = (item, index) => {
    setOpenAccordion(openAccordion === index ? -1 : index);
  };

  const [completeModule, setCompleteModule] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [typeClicked, setTypeClicked] = useState(scrollData[0].value);
  console.log(typeClicked, 'test-------------------->');
  const [dataClicked, setDataClicked] = useState('');

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchData = async () => {
  //       const response = await API.get(
  //         `getTchTrainingProgressNew/${user[0].userid}/${user[0].usertype}/${selData}/od`,
  //       );
  //       console.log('response progress new1---------->', response.data);

  //       setDummyData1(response?.data);
  //     };

  //     fetchData();
  //   }, []),
  // );
  let totalModules;
  useEffect(() => {
    const fetchData = async () => {
      const response = await API.get(
        `getTchTrainingProgress/${user[0].userid}/${user[0].usertype}/${selData}/od`,
      );
      console.log('response progress new1---------->', response.data);

      setDummyData1(response?.data);
    };

    fetchData();
  }, []);

  totalModules = dummyData1?.filter(x => x.moduleIsComplete === true);
  console.log('totalModules--->', totalModules);
  const modulePercentage = (totalModules?.length / dummyData1?.length) * 100;
  console.log('modulePercentage--->', modulePercentage);

  const handleTrainingClick = async item => {
    setSelData(item.value);
    setTypeClicked(item.value);
    setDataClicked(item.value);
    // console.log('response----->', user[0].userid, item.value);
    console.log('response2----->', item);
    try {
      const data = {
        userid: user[0].userid,
        usertype: 'fellow',
        trainingType: item.value,
      };

      // const response = await dispatch(types.userProgressStart(data));
      // console.log('progress2--->', response.data);

      const response = await API.get(
        `getTchTrainingProgress/${user[0].userid}/${user[0].usertype}/${
          item.value ? item.value : selData
        }/od`,
      );
      console.log('response progress new---------->', response.data);
      setDummyData1(response?.data);
    } catch (error) {
      if (error.response.status === 413) {
        // console.log('error is---------------->', error);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        // console.log('Error is--------------------->', error);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        // console.error('Error is------------------->:', error);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        // console.error('Error is------------------->:', error);
      }
    }
  };

  const progressValue = percentage;
  console.log('progressValue--->', progressValue);

  const formattedProgress = `${progressValue}%`;
  const [completeCount, setCompleteCount] = useState([]);
  const [defaultData, setDefaultData] = useState({});

  const fetchTrainingProgress = async () => {
    try {
      const data = {
        userid: user[0].userid,
        usertype: 'fellow',
        trainingType: dataClicked ? dataClicked : selData,
      };
      // console.log('ONE PAGE--------->', data);
      // const action = types.userProgressStart(data);
      // dispatch(action);
      // const data2 = await dispatch(types.userProgressStart(data));
      const data2 = await Api.get(
        `getTchTrainingProgress/${data.userid}/${data.usertype}/${data.trainingType}/"od"`,
      );
      // console.log('action progress--------->', data2);
      setDefaultData(data2.data);
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

  const moduleTrainingProgress = async () => {
    const data = {
      userid: user[0].userid,
      usertype: 'fellow',
      trainingType: dataClicked ? dataClicked : selData,
    };

    // const response = await dispatch(types.userProgressStart(data));
  };

  useEffect(() => {
    moduleTrainingProgress();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (typeClicked) {
        fetchTrainingProgress(typeClicked);
      }
      // moduleTrainingProgress();
    }, []),
  );

  console.log(dummyData1, 'dummyData1--------------------------------------->');
  const badges = [
    {
      image: require('../assets/Image/broze.png'),
      badgeName: 'Bronze Badge',
      badgeCount: sBadges[0]?.bronzeBadges,
      badgeDescription:
        'ଆପଣଙ୍କ ପାଖରେ Bronze ବ୍ୟାଚ ନାହିଁ  କି? 5 ଟି ଶିକ୍ଷଣ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ l',
    },
    {
      image: require('../assets/Image/sliver.png'),
      badgeName: 'Silver Badge',
      badgeCount: sBadges[0]?.silverBadges,
      badgeDescription:
        'ଆପଣଙ୍କ ପାଖରେ Silver ବ୍ୟାଚ ନାହିଁ  କି? 25 ଟି ଶିକ୍ଷଣ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ silver ବ୍ୟାଚ ହାସଲ କରନ୍ତୁ l  ',
    },
    {
      image: require('../assets/Image/golden.png'),
      badgeName: ' Gold Badge',
      badgeCount: sBadges[0]?.goldBadges,
      badgeDescription:
        'ଆପଣଙ୍କ ପାଖରେ Gold ବ୍ୟାଚ ନାହିଁ  କି? 5 ଟି  Silver ବ୍ୟାଚ ବଦଳରେ ଗୋଟିଏ  Gold ବ୍ୟାଚ ଜିତନ୍ତୁ l',
    },
    {
      image: require('../assets/Image/platinum.png'),
      badgeName: 'Platinum Badge',
      badgeCount: sBadges[0]?.platinumBadges,
      badgeDescription:
        'ଆପଣଙ୍କ ପାଖରେ Platinumବ୍ୟାଚ ନାହିଁ  କି? 5 ଟି Gold ବ୍ୟାଚ ହାସଲ ପରେ Platinum ନେଇ ପାରିବ ହାତରେ l',
    },
    {
      image: require('../assets/Image/dimond.png'),
      badgeName: 'Dimond Badge',
      badgeCount: sBadges[0]?.diamondBadges,
      badgeDescription:
        'ଆପଣଙ୍କ ପାଖରେ Diomond ନାହିଁ କି?ସବୁ ମଡୁଲ ଶେଷ କରିବା Diomond ବ୍ୟାଚ ଖୁସିରେ ନେବା l',
    },
  ];
  const AnimatedBadgeCount = ({badgeCount}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(
      animatedValue.__getValue(),
    );

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: badgeCount,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      animatedValue.addListener(({value}) =>
        setDisplayValue(Math.floor(value)),
      );

      return () => animatedValue.removeAllListeners();
    }, [badgeCount, animatedValue]);

    return (
      <Animated.Text style={styles.badgeCount}>{displayValue}</Animated.Text>
    );
  };
  const filteredBadges = badges.filter(badge => badge.badgeCount >= 0);

  useEffect(() => {
    setIsloading(true);
    if (dates < year && curMonth < month) {
      Alert.alert(
        'Info',
        'ଧ୍ୟାନ ଦେବେ! ଚୟନ କରାଯାଇଥିବା ମାସ ଚଳିତ ମାସ ଠାରୁ ଅଧିକ ହୋଇ ପାରିବ ନାହିଁ।',
        [
          {
            text: 'OK',
            onPress: () => {
              // timeSpent_record([]), setIsloading(false);
            },
          },
        ],
      );
    }
    if (dates == year && curMonth < month) {
      Alert.alert(
        'Info',
        'ଧ୍ୟାନ ଦେବେ! ଚୟନ କରାଯାଇଥିବା ମାସ ଚଳିତ ମାସ ଠାରୁ ଅଧିକ ହୋଇ ପାରିବ ନାହିଁ।',
        [
          {
            text: 'OK',
            onPress: () => {
              // timeSpent_record([]), setIsloading(false);
            },
          },
        ],
      );
    }
  }, [month, year]);
  return (
    <ScrollView style={{backgroundColor: Color.ghostwhite}}>
      {maintainanceStatus?.tchReward === true ? (
        <ModuleUnderDevlopment />
      ) : (
        <>
          <View
            style={{
              width: '100%',
              backgroundColor: '#0060CA',
              alignSelf: 'center',
              height: window.WindowHeigth * 0.55,
              flexDirection: 'row',
              gap: 10,
              flexShrink: 2,
              flexGrow: 2,
            }}>
            <View
              style={{
                top: 0,
                position: 'absolute',
                paddingBottom: '20%',
                padding: '80%',
                margin: '5%',
                borderRadius: 45,
              }}>
              <Tooltip
                isVisible={isVisible}
                content={
                  <>
                    <View
                      style={{
                        paddingBottom: '12%',
                      }}>
                      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#666666',
                            fontWeight: '800',
                            marginLeft: '2%',
                            // top: '2%',
                          }}>
                          {moment(milstone[selectedIndex]?.createdon).format(
                            'D MMM YYYY',
                          )}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#000000',
                          fontWeight: '800',
                          // top: '5%',
                          alignSelf: 'center',
                          padding: 10,
                        }}>
                        {milstone[selectedIndex]?.msg}
                      </Text>
                      {milstone[selectedIndex]?.msg ? (
                        <View style={{top: '5%', alignSelf: 'center'}}>
                          {milstone[selectedIndex]?.transactionType ===
                          'credit' ? (
                            <View style={{flexDirection: 'row'}}>
                              <Image
                                source={require('../assets/Image/Screenshot.png')}
                                style={{width: 43, height: 32}}
                              />
                              <Text
                                style={{
                                  fontSize: 16,
                                  // top: '3%',
                                  color: 'green',
                                  fontWeight: '800',
                                  left: '12%',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    top: '4%',
                                    color: '#595F65',
                                    fontWeight: '800',
                                  }}>
                                  {/* Coin: {''} */}
                                </Text>
                                +{milstone[selectedIndex]?.coins}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                paddingBottom: '-5%',
                              }}>
                              <Image
                                source={require('../assets/Image/Screenshot.png')}
                                style={{width: 40, height: 40}}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  top: '4%',
                                  color: '#eb3875',
                                  fontWeight: '800',
                                  left: '12%',
                                }}>
                                {/* <Text
                                  style={{
                                    fontSize: 11,
                                    top: '4%',
                                    color: '#595F65',
                                    fontWeight: '800',
                                  }}>
                                  Coin: {''}
                                </Text> */}
                                -{milstone[selectedIndex]?.coins}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <ActivityIndicator
                          size="large"
                          color="blue"
                          style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}
                        />
                      )}
                    </View>
                  </>
                }
                onClose={() => setIsVisible(false)}
                placement="top"
                useInteractionManager={true}
                topAdjustment={
                  Platform.OS === 'android' ? -StatusBar.currentHeight : 0
                }
                popover={{
                  width: 100,
                  height: 50,
                  anchorPoint: {x: 10, y: 1},
                  backgroundColor: 'white',
                  left: (selectedIndex * 100) / 2,
                  top: 0,
                }}
                // style={{borderRadius: 25}}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{flex: 1, top: '-5%', left: '3%'}}
              onScroll={() => setSelectedIndex(null)}>
              {milstone.map((item, index) => (
                <View
                  key={index}
                  style={{gap: 10, marginLeft: index !== 0 ? 60 : 0}}>
                  {index % 2 == 0 ? (
                    <LinearGradient
                      style={{
                        backgroundColor: 'transparent',
                        borderRadius: 42,
                        width: '102.11%',
                        height: '45.9%',
                        // position: 'absolute',
                        top: '18.07%',
                        right: '74.94%',
                        bottom: '9.03%',
                        left: '0.5%',
                        // position: 'absolute',
                      }}
                      // style={[styles.linearGradient04, styles.linearLayout]}
                      locations={[0, 5]}
                      colors={[
                        'rgba(255, 255, 255, 0.48)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      useAngle={true}
                      angle={179.95}>
                      <TouchableOpacity
                        key={index}
                        onPress={() => openMessage(index)}
                        style={{
                          backgroundColor: 'white',

                          borderRadius: 50,
                          width: 62.72,

                          height: 62.66,
                        }}>
                        {selectedImage && (
                          <Image
                            source={selectedImage}
                            style={{
                              width: 42,
                              height: 42,
                              resizeMode: 'cover',
                              alignSelf: 'center',
                              top: '15%',
                            }}
                          />
                        )}
                        <Image
                          source={require('../assets/Image/touch.png')}
                          style={{
                            width: 40,
                            height: 40,
                            position: 'absolute',
                            zIndex: 1,
                            bottom: '-13%',
                            alignSelf: 'center', // Ensure the GIF is on top
                          }}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  ) : (
                    <View key={index} style={{height: 500}}>
                      <LinearGradient
                        // style={[styles.linearGradient02, styles.linearLayout]}
                        style={{
                          backgroundColor: 'transparent',
                          borderRadius: 42,
                          width: '102.11%',
                          height: '35.9%',
                          // position: 'absolute',
                          top: '42.07%',
                          right: '74.94%',
                          bottom: '9.03%',
                          left: '-20.95%',
                          // position: 'absolute',
                        }}
                        // style={{
                        //   top: '10%',
                        //   // right: '45.94%',
                        //   // bottom: '22.9%',
                        //   left: '25.95%',
                        //   backgroundColor: 'red',
                        //   borderRadius: 42,
                        //   width: '20.11%',
                        //   height: '72.9%',
                        //   //position: 'relative',
                        // }}
                        locations={[0, 1]}
                        colors={[
                          'rgba(255, 255, 255, 0.48)',
                          'rgba(255, 255, 255, 0)',
                        ]}
                        useAngle={true}
                        angle={169.94}>
                        <TouchableOpacity
                          key={index}
                          onPress={() => openMessage(index)}
                          style={{
                            backgroundColor: 'white',
                            top: '63%',
                            borderRadius: 50,
                            width: 72.72,
                            height: 72.66,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                          }}>
                          {selectedImage1 && (
                            <Image
                              source={selectedImage1}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'cover',
                                borderRadius: 50,
                                position: 'absolute',
                              }}
                            />
                          )}
                          <Image
                            source={require('../assets/Image/touch.png')}
                            style={{
                              width: 40,
                              height: 40,
                              position: 'absolute',
                              zIndex: 1,
                              bottom: '-13%', // Ensure the GIF is on top
                            }}
                          />
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  )}
                </View>
              ))}

              {milstone.map((_, index) => (
                <Image
                  key={'image-' + index}
                  source={require('../assets/Image/Stats.png')}
                  style={{
                    width: 391,
                    height: 181,
                    resizeMode: 'center',
                    alignSelf: 'center',
                    opacity: 0.6,
                    top: '30%',
                    position: 'absolute',
                    marginLeft: index * 311, // Adjust this value according to your requirement
                  }}
                />
              ))}
            </ScrollView>
            {/* <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: '4%',
                backgroundColor: 'white',

                borderRadius: 50,
                width: 62.72,

                height: 62.66,
                justifyContent: 'center',
                alignItems: 'center',
              }}> */}
            {/* <Image
                source={require('../assets/Image/scroll.gif')}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: 'center',
                }}
              /> */}
            {/* </View> */}
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                fontFamily: FontFamily.poppinsMedium,
                position: 'absolute',
                bottom: 0,
                right: '4%',
              }}>
              Scroll{' '}
              <Image
                source={require('../assets/Image/arrow-left.png')}
                style={{width: 20, height: 20}}
              />
            </Text>
          </View>

          {/* -----------------------------------------Training module record-------------------------------- */}

          <View>
            <View style={{paddingTop: '5%', paddingBottom: '5%'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {scrollData?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleTrainingClick(item)}>
                    <View
                      style={{
                        margin: 10,
                        padding: 10,
                        paddingBottom: 10,
                        height: window.WindowHeigth * 0.146,
                        width: window.WindowWidth * 0.4,
                        borderRadius: 25,
                        backgroundColor:
                          typeClicked === item.value
                            ? Color.royalblue
                            : 'white',
                      }}>
                      <Image
                        source={item.url}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      />
                      <Text
                        style={{
                          alignSelf: 'center',
                          top: '30%',
                          fontFamily: FontFamily.poppinsMedium,
                          color: typeClicked === item.value ? 'white' : 'black',
                        }}>
                        {item.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                backgroundColor: Color.royalblue,
                width: window.WindowWidth * 0.92,
                borderRadius: 10,
                paddingBottom: '10%',
                padding: '2%',
                margin: '2%',
                alignSelf: 'center',
              }}>
              <View style={{flexDirection: 'row', top: '4.5%'}}>
                <Progress.Circle
                  size={55}
                  color={'white'}
                  progress={modulePercentage / 100 || 0}
                  textStyle={{color: 'white'}}
                  thickness={3}
                  borderColor={'#AFB4FF'}
                  borderWidth={1}
                  formatText={() => formattedProgress}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    alignSelf: 'center',
                    right: '75%',
                  }}>
                  {modulePercentage
                    ? `${modulePercentage.toFixed(1) || 0}%`
                    : '0%'}
                </Text>
                <View
                  style={{
                    top: '10%',
                    left: '19%',
                    position: 'absolute',
                  }}>
                  <Text style={{color: 'white'}}>
                    {' '}
                    This Module is almost done! 🔥
                  </Text>
                  <Text style={{color: '#AFB4FF', left: '2%'}}>
                    {totalModules ? totalModules?.length : totalModules?.length}{' '}
                    of {dummyData1 ? dummyData1?.length : dummyData1?.length}
                    completed
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <ScrollView>
                {dummyData1?.map((item, index) => (
                  <>
                    {item.submoduleData.length === 0 ? null : (
                      <TouchableOpacity
                        onPress={() => toggleListItem(item, index)}
                        key={index}>
                        <View
                          style={{
                            padding: '7%',
                            width: window.WindowWidth * 0.9,
                            backgroundColor: 'white',
                            borderColor: 'black',
                            marginTop: '2%',
                            borderRadius: 16,
                            alignSelf: 'center',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              width: '100%',
                              justifyContent: 'flex-start',
                            }}>
                            <View>
                              <Progress.Circle
                                size={65}
                                color={Color.royalblue}
                                borderColor={Color.gray_100}
                                borderWidth={1}
                                thickness={4}
                              />
                              <Image
                                source={require('../assets/Image/modulee.png')}
                                style={{
                                  width: 38,
                                  height: 38,
                                  alignSelf: 'center',
                                  top: '-50%',
                                }}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'column',
                                marginLeft: 20,
                                marginTop: 5,
                              }}>
                              <Text
                                style={{
                                  fontFamily: FontFamily.poppinsMedium,
                                  fontSize: 14,
                                  width: 150,
                                }}>
                                {item.moduleName}
                              </Text>
                              <Text
                                style={{
                                  color: '#9B9BA1',
                                  fontSize: 10,
                                  marginTop: 2,
                                }}>
                                Click Here
                              </Text>
                            </View>
                          </View>
                          {openAccordion === index && (
                            <>
                              {item.submoduleData.length === 0 ? null : (
                                <ProgressAccordion
                                  data={item.submoduleData}
                                  navigateClick={(
                                    check,
                                    moduleId,
                                    moduleName,
                                  ) => {
                                    // if (item.id === 'submodule') {
                                    console.log(
                                      'itemnaviagtecheck-->',
                                      item.id,
                                    );
                                    navigation.navigate(
                                      'TrainingSubmodulePage',
                                      {
                                        trainingType: typeClicked,
                                        moduleId: moduleId,
                                        moduleName: moduleName,
                                        status: '',
                                        moduleImage: '',
                                      },
                                    );
                                    // }
                                  }}
                                  moduleId={item.moduleId}
                                  moduleName={item.moduleName}
                                />
                              )}
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* <----------------------------------------Badges Start ------------------------------------------> */}
          <View>
            <ScrollView
              horizontal
              style={styles.scrollView}
              showsHorizontalScrollIndicator={false}>
              {filteredBadges.map((badge, index) => (
                <View key={index} style={styles.badgeContainer}>
                  <View style={styles.imageContainer}>
                    <Image source={badge.image} style={styles.image} />
                    <View style={styles.countOverlay}>
                      <AnimatedBadgeCount badgeCount={badge.badgeCount} />
                    </View>
                  </View>
                  <Text style={styles.badgeName}>{badge.badgeName}</Text>
                  <Text style={styles.badgeDescription}>
                    {badge.badgeDescription}
                  </Text>
                </View>
              ))}
            </ScrollView>
            {/* <Text>You have earned Bronze=25 ,silver=5</Text> */}
          </View>

          {/* <----------------------------------------Badges End ------------------------------------------> */}

          {/* <----------------------------------------Time Spent Report ------------------------------------------> */}

          <View>
            {/* {timeSpent_record.length > 0 ? ( */}
            <View
              style={{
                width: window.WindowWidth * 0.92,
                alignSelf: 'center',
                backgroundColor: 'white',
                borderRadius: 6,
                // top: 20,
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'space-evenly',
                  padding: 10,
                }}>
                <Image
                  source={require('../assets/Image/graph.png')}
                  style={{
                    width: 40,
                    height: 40,
                    left: '2%',
                    top: '20%',
                    alignSelf: 'flex-start',
                    position: 'absolute',
                  }}
                />
                <Text
                  style={{
                    left: '180%',
                    fontWeight: '700',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Time Spent Report
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  left: '1%',
                }}>
                <View style={{width: '48%'}}>
                  <DropdownComponent
                    data={yearList}
                    value={year}
                    label={'name'}
                    set={year}
                    onChange={item => {
                      setYear(item.value);

                      handleYearChange(item.value);
                    }}
                  />
                </View>

                <View style={{width: '48%'}}>
                  <DropdownComponent
                    data={monthlist}
                    value={month}
                    label={'name'}
                    set={
                      month == 1
                        ? 'Jan'
                        : month == 2
                        ? 'Feb'
                        : month == 3
                        ? 'March'
                        : month == 4
                        ? 'April'
                        : month == 5
                        ? 'May'
                        : month == 6
                        ? 'June'
                        : month == 7
                        ? 'July'
                        : month == 8
                        ? 'Aug'
                        : month == 9
                        ? 'Sep'
                        : month == 10
                        ? 'Oct'
                        : month == 11
                        ? 'Nov'
                        : month == 12
                        ? 'Dec'
                        : month == 13
                        ? 'All'
                        : 'All'
                    }
                    onChange={item => {
                      handleMonthChange(item.value);
                      setMonth(item.value);
                    }}
                  />
                </View>
              </View>
              {timeSpent_record.length > 0 ? (
                <View style={styles.chartContainer}>
                  <ScrollView horizontal>
                    <LineChart
                      data={{
                        labels: timeSpent_record.map(item => {
                          const monthNames = [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                          ];
                          const year = item.year.toString().slice(-2); // Extract last two digits of the year
                          return `${monthNames[item.month - 1]}-${year}`;
                        }),
                        datasets: [
                          {
                            data: timeSpent_record.map(item => item.timeSpent),
                          },
                        ],
                      }}
                      width={Math.max(timeSpent_record.length * 189, 200)} // Ensure minimum width
                      height={220}
                      yAxisLabel="min"
                      chartConfig={{
                        backgroundColor: 'white',
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 1,
                        color: (opacity = 1) =>
                          `rgba(107, 115, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
                        style: {
                          borderRadius: 6,
                          fontSize: 15,
                        },
                        rotation: 45, // Rotate labels by 45 degrees
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </ScrollView>
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
            {/* ) : isLoading ? (
              <View>
                <ActivityIndicator
                  size="large"
                  color="blue"
                  style={{justifyContent: 'center', alignSelf: 'center'}}
                />
              </View>
            ) : ( */}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Mopragati;

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
    // backgroundColor: '#e7e7e7',
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

  linearLayout: {
    backgroundColor: 'transparent',
    borderRadius: 42,
    width: '155.11%',
    height: '72.9%',
    // position: 'absolute',
  },
  // .............................
  linearGradient04: {
    top: '18.07%',
    right: '74.94%',
    bottom: '9.03%',
    left: '8.95%',
    position: 'absolute',
  },

  linearGradient02: {
    top: '0%',
    right: '50.94%',
    bottom: '-72.9%',
    left: '30.95%',
  },

  scrollView: {
    padding: 15,
    margin: 10,
    paddingBottom: 20,
  },
  badgeContainer: {
    width: windowWidth * 0.7,
    backgroundColor: Color.ghostwhite,
    borderRadius: 10,
    borderColor: Color.royalblue,
    borderWidth: 2,
    paddingBottom: '10%',
    marginHorizontal: 15,
    right: '3%',
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  image: {
    width: windowWidth * 0.5,
    height: windowWidth * 0.5,
    alignSelf: 'center',
  },
  countOverlay: {
    // position: 'absolute',
    // top: '50%',
    // // left: '50%',
    // transform: [{translateX: -10}, {translateY: -10}],
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // borderRadius: 15,
    // padding: 5,
    alignSelf: 'center',
    top: '-5%',
  },
  badgeCount: {
    color: Color.royalblue,
    fontSize: 25,
    fontWeight: 'bold',
  },
  badgeName: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    padding: '4%',
    // borderColor: Color.royalblue,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeDescription: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 11,
    width: 200,
    paddingBottom: '10%',
    top: '2%',
  },
});
