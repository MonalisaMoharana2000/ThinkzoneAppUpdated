import React, {
  useEffect,
  useMemo,
  useState,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import {useFocusEffect, useNavigationState} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  Linking,
  Button,
  Alert,
  Modal,
  useWindowDimensions,
  ToastAndroid,
  RefreshControl,
  Platform,
  BackHandler,
  DeviceEventEmitter,
  PermissionsAndroid,
  Easing,
  FlatList,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import API from '../environment/Api';
import * as window from '../utils/dimensions';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import CarouselImage from '../components/CarouselImage';
import CarouselVideo from '../components/CarouselVideo';
import moment from 'moment';
import {fetchUserDataThunk} from '../redux_toolkit/features/users/UserThunk';
const {width} = Dimensions.get('window');

const Home = ({navigation}, props) => {
  const scrollRef = useRef();
  const image = [];
  const [activeSlide, setActiveSlide] = useState(0);
  const [maintainanceModal, setmaintainanceModal] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const user = useSelector(state => state.UserSlice.user);
  const [storageData, setStorageData] = useState([]);
  console.log('storageData----->', storageData);

  const fetchStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      console.log('storedData1--------->', storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Parsed storedData1--------->', parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error fetching stored data:', error);
    }
    return null; // Return null if no data or error occurs
  };
  useEffect(() => {
    const initializeData = async () => {
      const parsedData = await fetchStoredData();
      if (parsedData) {
        setStorageData(parsedData?.resData);
        const userSet = await dispatch(
          fetchUserDataThunk(parsedData?.resData[0]?.userid),
        );
        console.log('userSet1----------->', userSet);
      }
    };

    initializeData();
  }, []);
  // const {usertype} = user[0];

  const fetchDeviceId = async () => {
    try {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
      await AsyncStorage.setItem('deviceId', id);
    } catch (error) {
      console.error('Error fetching device ID:', error);
    }
  };

  const sessionFunction = async () => {
    const storedDeviceId = await AsyncStorage.getItem('deviceId');
    if (storedDeviceId) {
      console.log('storedDeviceId--->', storedDeviceId);
      try {
        const data = {
          userid: user[0].userid,
          username: user[0].username,
          usertype: user[0].usertype,
          managerid: user[0].managerid,
          managername: user[0].managername,
          passcode: user[0].passcode,
          lastUsed: new Date().getTime(),
          deviceId: storedDeviceId,
          app: 'tz',
          appVersion: app_versions,
        };
        console.log('data---->', data);
        const response = await Api.put(`syncAppSession`, data);
        console.log('sessionresponse--->', response.data, response.status);
        if (response.status === 200) {
          console.log('sessionresponse2--->', response.data, response.status);
        }
      } catch (err) {
        console.log('err in post---->', err);
      }
    }
  };

  const handleSessionOut = async () => {
    dispatch(types.logOutUser());
    const response = await Api.patch(
      `updateLogoutSession/${user[0].userid}/tz/${app_versions}`,
    );
    console.log('response--->', response.data, app_versions);
  };

  const fetchSessionData = async () => {
    const storedDeviceId = await AsyncStorage.getItem('deviceId');
    try {
      const response = await Api.get(
        `getUserAppSession/${'tz'}/${user[0].usertype}/${
          user[0].userid
        }/${storedDeviceId}`,
      );
      console.log(
        'sessionresponseget--->',
        response.data,
        response?.data[0]?.logout,
      );

      if (response?.data[0]?.logout === true) {
        try {
          Alert.alert('Your session is expired!', '', [
            // {
            //   text: 'Cancel',
            //   onPress: () => null,
            //   style: 'default',
            // },
            {
              text: 'Ok',
              onPress: () => handleSessionOut(),
              style: 'default',
            },
          ]);
        } catch (err) {
          console.log('err in post---->', err);
        }
      }
    } catch (err) {
      console.log('err---->', err);
    }
  };

  // -----------------------App Tour-------------------------------
  // const numberOfLoops = 3;
  const viewRef = useRef(null);
  const hasTourBeenShown = async () => {
    const value = await AsyncStorage.getItem('tourShown');
    console.log('value--->', value);
    return !!value;
  };

  const markTourAsShown = async () => {
    await AsyncStorage.setItem('tourShown', 'true');
  };

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const restrictScrolling = () => {
    setScrollEnabled(false);
    setTimeout(() => {
      setScrollEnabled(true);
    }, 6000);
  };

  const inputReducer = (state, action) => {
    if (action.type === 'SET_APPTOUR') {
      return {...state, appTour: [...state.appTour, action.data]};
    }
    return state;
  };
  // const appTourSequence = new AppTourSequence();
  const exampleOneViewRef = useRef(null);
  const exampleTwoViewRef = useRef(null);
  const exampleThreeViewRef = useRef(null);

  const exampleFourViewRef = useRef(null);
  const exampleFiveViewRef = useRef(null);
  const exampleSixViewRef = useRef(null);
  const exampleSevenViewRef = useRef(null);
  const exampleEightViewRef = useRef(null);
  const exampleNineViewRef = useRef(null);
  const exampleTenViewRef = useRef(null);
  const exampleElevenViewRef = useRef(null);
  const exampleTweleveViewRef = useRef(null);
  const exampleThirteenViewRef = useRef(null);

  const exampleFourteenViewRef = useRef(null);

  const exampleFifteenViewRef = useRef(null);

  const exampleSixteenViewRef = useRef(null);

  const [appTourTargets, dispatchAppTour, state] = useReducer(inputReducer, {
    appTour: [],
  });

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   let appTourSequence = new AppTourSequence();
  //   //   appTourTargets.appTour.forEach(appTourTarget => {
  //   //     appTourSequence.add(appTourTarget);
  //   //   });
  //   //   AppTour.ShowSequence(appTourSequence);
  //   // });
  // }, []);

  let tourOneProps = {
    order: 1,
    title: 'ଶିକ୍ଷଣ ଓ ଶିକ୍ଷାଦାନ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଶିକ୍ଷାର୍ଥୀମାନଙ୍କୁ ବୁଝିବା ଏବଂ ଗୁଣାତ୍ମକ ଶିକ୍ଷା ପ୍ରଦାନ କରିବା ସହଜସାଧ୍ୟ ହେବ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourTwoProps = {
    order: 2,
    title: 'ଏକବିଂଶ ଶତାବ୍ଦୀ କୌଶଳ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣଙ୍କୁ ନିଜର ଏକବିଂଶ ଶତାବ୍ଦୀ ଦକ୍ଷତା ଯଥା ଯୋଗାଯୋଗ, ସୃଜନାତ୍ମକ ଚିନ୍ତନ ଇତ୍ୟାଦି ବୃଦ୍ଧି କରିବା ସହ ଏଥି ସମ୍ବନ୍ଧୀୟ ସଚେତନ ହେବାରେ ସାହାଯ୍ୟ କରିବ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourThreeProps = {
    order: 3,
    title: 'ପ୍ରଯୁକ୍ତି ବିଦ୍ୟା',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣଙ୍କୁ ଟେକ୍ନୋଲୋଜି ସମ୍ବନ୍ଧୀୟ ଦକ୍ଷତା ଯଥା ମାଇକ୍ରୋସଫ୍ଟ ଏବଂ ଗୁଗୁଲ୍ ଭଳି ବିଭିନ୍ନ ଦକ୍ଷତା ବୃଦ୍ଧି କରିବାରେ ସାହାଯ୍ୟ କରିବ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourFourProps = {
    order: 4,
    title: ' ନିଜ ବୁଝାମଣା ଯାଞ୍ଜ କରନ୍ତୁ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଥିଙ୍କଜୋନ୍ ରେ ନିଜର ପ୍ରଗତି ଯାଞ୍ଚ କରିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourFiveProps = {
    order: 5,
    title: 'ପଞ୍ଜୀକରଣ ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଶିକ୍ଷାଦାନ କରୁଥିବା ଶିକ୍ଷାର୍ଥୀଙ୍କ ପଞ୍ଜୀକରଣ କରିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourSixProps = {
    order: 6,
    title: 'ଶିକ୍ଷାର୍ଥୀ ସୂଚନା',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ପଞ୍ଜୀକରଣ କରିଥିବା ଶିକ୍ଷାର୍ଥୀଙ୍କ ବିବରଣୀ ଯାଞ୍ଚ କରିପାରିବେ ଏବଂ ପରିବର୍ତ୍ତନ କରିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourSevenProps = {
    order: 7,
    title: 'ଉପସ୍ଥାନ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ପଢାଉଥିବା ଶିକ୍ଷାର୍ଥୀଙ୍କ ନିୟମିତ ଉପସ୍ଥାନ ରେକର୍ଡ କରିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourEightProps = {
    order: 8,
    title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପ୍ରଗତି ଯାଞ୍ଚ କରିପାରିବେ ଏବଂ ଶିକ୍ଷାଦାନ ପଦ୍ଧତିରେ ପରିବର୍ତ୍ତନ ଆଣିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourNineProps = {
    order: 9,
    title: 'ପ୍ରାକ୍ ଗତିବିଧି',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ୩ ରୁ ୫ ବର୍ଷ ମଧ୍ୟରେ ଥିବା ଶିକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ ଶ୍ରେଣୀ ଅନୁସାରେ ଶିକ୍ଷଣୀୟ ଗତିବିଧି ପାଇପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourTenProps = {
    order: 10,
    title: 'ପ୍ରାଥମିକ ଗତିବିଧି ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ପ୍ରଥମ ରୁ ଆରମ୍ଭ କରି ପଞ୍ଚମ ଶ୍ରେଣୀ ପର୍ଯ୍ୟନ୍ତ ପଢୁଥିବା ଶିକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ ଶ୍ରେଣୀ ଅନୁସାରେ ଶିକ୍ଷଣୀୟ ଗତିବିଧି ପାଇପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourElevenProps = {
    order: 11,
    title: ' FLN ଗତିବିଧି ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଅଙ୍ଗନବାଡ଼ି ଠାରୁ ପଞ୍ଚମ ଶ୍ରେଣୀ ପର୍ଯ୍ୟନ୍ତ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ ମୌଳିକ ସାକ୍ଷରତା ଓ ସଂଖ୍ୟାଜ୍ଞାନ ବିଷୟରେ ଗତିବିଧି ପାଇପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourTwelveProps = {
    order: 12,
    title: 'ଗୋଷ୍ଠୀ ସମ୍ପୃକ୍ତିକରଣ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ବିଭିନ୍ନ ଆବଶ୍ୟକୀୟ ମଡ୍ୟୁଲ୍ ପାଇପାରିବେ ଯାହା ଆପଣଙ୍କୁ ଶିକ୍ଷାଦାନ ଓ ନିଜର ଦକ୍ଷତା ବୃଦ୍ଧି କରିବାରେ ସାହାଯ୍ୟ କରିବ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourThirteenProps = {
    order: 13,
    title: 'ଦେୟ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ଦ୍ଵାରା ଆପଣଙ୍କୁ ମିଳୁଥିବା ଅର୍ଥରାଶୀ ରେକର୍ଡ କରିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourFourteenProps = {
    order: 14,
    title: 'ଅଭିଧାନ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଜାଣିବାକୁ ଚାହୁଁଥିବା ଯେକୌଣସି ଶବ୍ଦର ସରଳ ଅର୍ଥ ବୁଝିବା ପାଇଁ ବ୍ୟବହାର କରିପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourFifteenProps = {
    order: 15,
    title: 'ଦସ୍ତାବିଜ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଶ୍ରେଣୀ ଅନୁଯାୟୀ ପାଠ୍ୟପୁସ୍ତକ ଓ ବିଭିନ୍ନ ଆବଶ୍ୟକୀୟ ପୁସ୍ତକ ପାଇପାରିବେ ।',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  let tourSixteenProps = {
    order: 16,
    title: 'ମତାମତ',
    description:
      'ଏହି ବିଭାଗ ଅଧୀନରେ ଆପଣ ଆପ୍ଲିକେସନ୍ ସମ୍ବନ୍ଧୀୟ ନିଜର ମତାମତ ଦେଇପାରିବେ',
    outerCircleColor: Color.royalblue,
    titleTextSize: 22,
    titleTextColor: '#ffffff',
    descriptionTextSize: 14,
    descriptionTextColor: '#ffffff',
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('================token', token);

    // Alert.alert(token);
    // const smallIcon =
    //   Platform.OS === 'android'
    //     ? '@drawable/ic_notification' // Replace with the actual drawable resource name for Android
    //     : 'ic_notification';
    const largeIcon =
      Platform.OS === 'android'
        ? '@drawable/ic_notification' // Replace with the actual drawable resource name for Android
        : 'ic_notification';
    const fcm_obj = {
      userid: user[0]?.userid,
      username: user[0]?.username,
      token: token,
      refresh_token: token,
      // smallIcon: smallIcon,
      largeIcon: largeIcon, // Add the smallIcon property here
    };
    console.log('fcm_obj------->', fcm_obj);

    API.get(`getfcmtokenidbyuserid/${user[0]?.userid}`).then(
      getRes => {
        if (getRes.data.length > 0) {
          const tid = getRes.data[0]._id;
          API.put(`updatefcmtokenid/${tid}`, fcm_obj).then(upGet => {
            //
          });
        } else {
          API.post(`createnewfcmtokenid`, fcm_obj).then(res => {
            //
          });
        }
      },
      err => {
        // this.serverDownMsg.presentToast();
      },
    );
  };

  useEffect(() => {
    getToken();
  }, []);

  //Intro QuiZ sTARTS
  const [checkIntro, setCheckIntro] = useState(false);
  const [introStatus, setIntroStatus] = useState(null);
  const [introDatas, setIntroDatas] = useState([]);
  const [isLoadings, setIsLoadings] = useState(true);
  const [tourStatus, setTourStatus] = useState(false);
  const x = true;

  useEffect(() => {
    const fetchData = async () => {
      // Use async/await for API calls
      try {
        // setLoading(true);
        // setCheckIntro(false);
        const response = await API.get(
          `getTransIntroQuiz/${user[0]?.userid}/${user[0]?.usertype}`,
        );

        if (response.data.completionStatus === 'complete') {
          setIntroStatus(response.data.completionStatus);
          // setCheckIntro(true);

          // setLoading(false);
          // setModalVisibleIntro(false);
        } else {
          setIntroStatus(null);
          {
            usertype === 'fellow' ? navigation.navigate('IntroQuiz') : null;
          }
          // setLoading(false);

          // setModalVisibleIntro(true);
          // setIsloading(false);
          setIntroDatas(response.data.quizData);
        }
      } catch (error) {
        console.error('Error fetching intro quiz data:', error);
      } finally {
        setIsLoadings(false);
      }
    };

    fetchData();
  }, [x]);

  //iNTRO qUIZ eNDS

  // useEffect(() => {
  //   API.get(`getMaintainanceStatus/${user[0]?.usertype}`).then(
  //     response => {
  //       // setAchieve(response.data);
  //       setMaintainanceStatus(response.data);
  //       setmaintainanceModal(response.data?.overallApp);
  //       // setmaintainanceModal(false);
  //     },
  //     err => {
  //       //
  //     },
  //   );
  // }, []);
  //^--------------------Attendance Modal to alert user------------------------------

  // console.log('attendane---------------->', attendance);

  // const windowHeight = Dimensions.get('window').height;
  // const modalHeight = windowHeight / 2;

  // const openAttendModal = () => {
  //   setOpenAttendanceModal(true);
  // };

  // const closeAttendModal = () => {
  //   setOpenAttendanceModal(false);
  // };

  // const buttonOnClose = () => {
  //   setOpenAttendanceModal(false);
  // };

  const navigateAttendance = () => {
    navigation.navigate('studentAttendance', {
      type: 'studentAttendance',
    });
  };
  // console.log('current date------------------>', currentDate);
  // console.log('userdatas--------------------->', registrationDate);

  const showAlert = () => {
    Alert.alert(
      'ଧ୍ୟାନ ଦିଅନ୍ତୁ ! ',
      'ଆପଣ ବିଗତ ୭ ଦିନ ହେବ ପିଲାମାନଙ୍କର ଉପାସ୍ଥାନ ରେକର୍ଡ କରିନାହାନ୍ତି।',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Ok',
          onPress: () => navigateAttendance(),
        },
      ],
    );
  };

  // console.log('tourStatus------------------>', tourStatus);
  // iNTRO qUIZ eNDS
  const setTimeoutCalledRef = React.useRef(false);
  const routeName = useNavigationState(state => state.routes[state.index].name);
  // console.log('routeName---->', routeName);

  const [bubble, setBubble] = useState(null);
  // console.log('bubble---->', bubble);

  const saveAppTourStatus = async () => {
    try {
      const body = {
        userid: user[0].userid,
        tourStatus: true,
      };
      const response = await API.post(`saveAppTourStatus`, body);
      console.log('savetour-------->', response.data);
    } catch (error) {
      console.error('Error saving app tour status:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const bubbleResponse = await API.get(
          `getAppTourStatus/${user[0]?.userid}`,
        );

        if (!bubbleResponse?.data.tourStatus) {
          restrictScrolling();
        }
      };

      fetchData();
    }, []),
  );

  const handleClick = () => {};
  const [carouselData, setCarouselData] = useState([...image]);
  const {width: screenWidth} = Dimensions.get('window');

  // Calculate responsive width based on screen width
  const responsiveWidth = screenWidth * 0.9; // Adjust as needed

  // Calculate responsive height based on responsive width (assuming a 16:9 aspect ratio)
  const responsiveHeight = (responsiveWidth * 9) / 16; // Adjust aspect ratio as needed

  useEffect(() => {
    // Clone the original data and append it to the end
    //const extendedData = [...image, ...image];
    //setCarouselData(extendedData);
  }, []);

  const _renderItem = ({item, index}) => {
    console.log('item---->', item);
    return (
      <TouchableOpacity onPress={() => handlePageChange(item?.navigateTo)}>
        {imageSlider.mediatype === 'image' ? (
          <CarouselImage data={item} />
        ) : (
          <CarouselVideo data={item} />
        )}
      </TouchableOpacity>
    );
  };
  const handlePageChange = Item => {
    console.log('item', Item);
    navigation.navigate(`${Item}`);
  };

  // const handleSnapToItem = index => {
  //   if (index === 0) {
  //     if (loopCycles < maxLoopCycles - 1) {
  //       setLoopCycles(loopCycles + 1);
  //     } else {
  //       // Stop the autoplay after the desired loop cycles
  //       carouselRef.current.stopAutoplay();
  //     }
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      // Start autoplay when the screen is focused
      const autoplayTimer = setInterval(() => {
        // Your autoplay logic here
      }, 3000);

      return () => {
        // Stop autoplay when the screen is blurred or component unmounts
        clearInterval(autoplayTimer);
      };
    }, []),
  );

  const [isLoading, setIsloading] = useState(false);
  const [achieve, setAchieve] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [logOuts, setLogOuts] = useState(false);
  const [maintainanceStatus, setMaintainanceStatus] = useState({});
  const [imageSlider, setImageSlider] = useState([]);
  console.log('Imageslide', imageSlider);

  const [modalVisibleIntro, setModalVisibleIntro] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    API.get(`getUserProgress/${user[0]?.userid}`).then(
      // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
      response => {
        //
        setAchieve(response.data);
        //setTimeSpent_record(response.data[0].timeSpentData);
        setIsloading(false);
      },
      err => {
        //
      },
    );
  }, []);

  useEffect(() => {
    API.get(`getMaintainanceStatus/${user[0]?.usertype}`).then(
      response => {
        // setAchieve(response.data);
        setMaintainanceStatus(response.data);
        setmaintainanceModal(response.data?.overallApp);
        // setmaintainanceModal(false);
      },
      err => {
        //
      },
    );
  }, []);
  useEffect(() => {
    API.get(`getDboardSliders/${user[0]?.usertype}/${'image'}`).then(
      response => {
        // console.log('response------------------>', response.data);
        setImageSlider(response.data);
        // setAchieve(response.data);
        // setMaintainanceStatus(response.data);
        // setmaintainanceModal(response.data?.overallApp);
        // setmaintainanceModal(false);
      },
      err => {
        //
      },
    );
  }, []);

  //Check acahievement data

  const checkStatuses = () => {
    //
    if (achieve.length > 0) {
      if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'complete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 3;
      } else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'complete' &&
        achieve[0].endlineStatus === 'complete' &&
        achieve[0].nsdcStatus === 'complete'
      ) {
        return 5;
      } else if (
        achieve[0].baselineStatus === 'incomplete' &&
        achieve[0].pptStatus === 'incomplete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'incomplete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 0;
      } else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'incomplete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'incomplete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 1;
      } else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'incomplete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 2;
      }
      // else if (
      //   achieve[0].baselineStatus === 'complete' &&
      //   achieve[0].pptStatus === 'complete' &&
      //   achieve[0].trainingStatus === 'complete' &&
      //   achieve[0].endlineStatus === 'incomplete' &&
      //   achieve[0].nsdcStatus === 'incomplete'
      // )
      //  {
      //   return 3;
      // }
      else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'complete' &&
        achieve[0].endlineStatus === 'complete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 4;
      }
    }
  };
  const app_versions = '2.1.1';

  const dispatch = useDispatch();

  const [language, setLanguage] = useState('od');
  const [coin, setCoin] = useState('');
  const [imgActive, setImgActive] = useState(0);
  const [scrollx, setScrollx] = useState(0);
  const [result, setResult] = useState([]);
  const [modal, setModal] = useState(false);
  const [versionModal, setVersionModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [statusMsg, setStatusMsg] = useState([]);
  const [statusModal, setStatusModal] = useState(false);

  //-----------To be replaced with the single navigation--------

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       Alert.alert(
  //         'Exit App',
  //         'Do you want to exit the app?',
  //         [
  //           {
  //             text: 'Cancel',
  //             onPress: () => null,
  //             style: 'cancel',
  //           },
  //           {
  //             text: 'OK',
  //             onPress: () => {
  //               BackHandler.exitApp();
  //             },
  //           },
  //         ],
  //         {cancelable: false},
  //       );

  //       return true;
  //     },
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const handleDynamiclink = async ({url}) => {
    let decodeUrl = url.split('=');
    const [params1, params2, params3, params4, params5, params6] =
      decodeUrl[1].split('?');
    if (params1 == 'eccontent') {
      navigation.navigate(params1, {
        contentDetails: params2,
        class: params3,
      });
    } else if (params1 == 'flncontentview') {
      console.log('fln1--->', params2);
      console.log('fln2--->', params3);
      navigation.navigate(params1, {
        contentDetails: params2,
        class: params3,
      });
    } else if (params1 == 'techcontent') {
      console.log('techcontent1--->', params2);
      console.log('techcontent2--->', params3);
      console.log('techcontent3--->', params1, params4, params5);
      const response = await API.get(
        `getTopicCompletionStatus/${user[0].userid}/${params3}`,
      );
      console.log('techcontent1use--->', params2);
      console.log('techcontent2use--->', params3, params1, params4, params5);

      if (response?.data?.quiz1Status === 'complete' && params5 === 'content') {
        navigation.navigate(params1, {
          contentDetails: params2,
          class: params3,
          data_type: params5,
        });
      } else {
        Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ!', 'Quiz1 is not complete!', [
          // {
          //   text: 'Cancel',
          //   onPress: () => null,
          //   style: 'cancel',
          // },
          {text: 'Ok', onPress: () => navigation.navigate('home')},
        ]);
      }
    } else if (params1 == 'Content') {
      navigation.navigate(params1, {
        preferedlanguage: params2,
        program: params3,
        subject: params4,
        class: params5,
        skillsetid: params6,
      });
    } else if (params1 == 'contentdetails') {
      const topic = {
        moduleid: params2,
        submoduleid: params3,
        topicid: params4,
      };
    } else if (params1 == 'preprogram_training_content') {
      const topic = {
        moduleid: params2,
        submoduleid: params3,
        topicid: params4,
      };
      API.get(`getteacherbaselinestatus/${user[0].userid}`).then(res => {
        if (res.data.status == 'complete') {
          pptModuleArr.map(item => {
            if (item.moduleid == topic.moduleid) {
              if (item.lockstatus == 'unlock') {
                navigation.navigate(params1, {
                  data: topic,
                  data_type: 'content',
                });
              } else {
                ToastAndroid.show(
                  'Please Complete previous Modules.',
                  ToastAndroid.SHORT,
                );
              }
            } else {
              ToastAndroid.show(
                'Something went wrong. Please try again.',
                ToastAndroid.SHORT,
              );
            }
          });
        } else {
          Alert.alert(
            'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
            'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {text: 'Ok', onPress: () => null},
            ],
          );
        }
      });
    } else {
      ToastAndroid.show('url not found', ToastAndroid.SHORT);
    }
  };

  const openPPT = () => {
    // navigation.navigate('preprogramtraining', {
    //   type: 'ppt',
    // });
    API.get(`getteacherbaselinestatus/${user[0].userid}`).then(res => {
      //
      // console.log('responseppt--------->', res.data.status);
      if (res.data.status == 'complete') {
        navigation.navigate('preprogramtraining', {
          type: 'ppt',
        });
      } else {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
          'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'Ok', onPress: () => null},
          ],
        );
      }
    });
  };

  //New PPT
  const openPPTNew = () => {
    navigation.navigate('preprogramtrainingnew', {
      type: 'ppt',
    });
  };

  //For tick baseline

  const [statusBaseline, setStatusBaseline] = useState('');
  //
  useEffect(() => {
    API.get(`getteacherbaselinestatus/${user[0]?.userid}`).then(
      response => {
        //
        setStatusBaseline(response.data.status);
      },
      err => {
        //
      },
    );
  }, []);

  //For tick prabesha
  const [statusPPT, setStatusPPT] = useState(false);

  useEffect(() => {
    API.get(`ppt_trans_getoverallstatus/${user[0]?.userid}/${language}`).then(
      response => {
        //
        if (response.data.status == 'complete') {
          setStatusPPT(true);
        }
      },
    );
  }, []);

  //For tick endline

  const [statusMonthly, setStatusMonthly] = useState(false);
  const [statusEndline, setStatusEndline] = useState(false);

  //

  useEffect(() => {
    API.get(`gettrainingoverallmarks/${user[0]?.userid}/${language}`).then(
      response => {
        //

        if (response.data[0].training_status == 'complete') {
          setStatusMonthly(true);
        }
      },
      err => {
        //
      },
    );
    API.get(`checknsdceligibility/${user[0]?.userid}`).then(
      response => {
        if (response.data.status != 'endline incomplete') {
          setStatusEndline(true);
        }
      },
      err => {
        //
      },
    );
  }, []);

  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   // Alert.alert(token);
  //   // const smallIcon =
  //   //   Platform.OS === 'android'
  //   //     ? '@drawable/ic_notification' // Replace with the actual drawable resource name for Android
  //   //     : 'ic_notification';
  //   const largeIcon =
  //     Platform.OS === 'android'
  //       ? '@drawable/ic_notification' // Replace with the actual drawable resource name for Android
  //       : 'ic_notification';
  //   const fcm_obj = {
  //     userid: user[0].userid,
  //     username: user[0].username,
  //     token: token,
  //     refresh_token: token,
  //     // smallIcon: smallIcon,
  //     largeIcon: largeIcon, // Add the smallIcon property here
  //   };
  //   API.get(`getfcmtokenidbyuserid/${user[0].userid}`).then(
  //     getRes => {
  //       if (getRes.data.length > 0) {
  //         const tid = getRes.data[0]._id;
  //         API.put(`updatefcmtokenid/${tid}`, fcm_obj).then(upGet => {
  //           //
  //         });
  //       } else {
  //         API.post(`createnewfcmtokenid`, fcm_obj).then(res => {
  //           //
  //         });
  //       }
  //     },
  //     err => {
  //       // this.serverDownMsg.presentToast();
  //     },
  //   );
  // };

  useEffect(() => {
    // getToken();
    // axios
    //   .get('https://comms.globalxchange.com/coin/vault/get/all/coins')
    //   .then(response => {
    //     setCoin(response.data.coins);
    //   });
    const d_data = {
      userid: user[0]?.userid,
      usertype: user[0]?.usertype,
      language: language,
    };
    // dispatch(TrainingSlice.getModuleStart({d_data}));
    // dispatch(TrainingSlice.getPPTModuleStart({d_data}));
    // requestUserPermission();
  }, []);
  const onChange = nativeEvent => {
    //
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }
  };
  // const _renderItem = ({item, index}) => {
  //   return <CarouselImage data={item} autoplay />;
  // };

  useEffect(() => {
    API.get(`checkUserInLboard/${user[0]?.userid}/${user[0]?.usertype}`)
      .then(response => {
        //
        setResult(response.data);

        if (response.data[0]?.useridExists === true) {
          setModal(true);
        } else {
          setModal(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    API.get(`getappversion/com.nrusingh.teacher_thinkzone1`).then(
      response => {
        //
        //
        setResult(response.data);
        if (app_versions < response?.data[0]?.version) {
          setVersionModal(true);
        } else {
          setVersionModal(false);
        }
      },
      err => {
        //
      },
    );
    // logOut();
  }, []);

  useEffect(() => {
    API.get(`getAllStatus/${user[0]?.userid}`).then(
      // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
      response => {
        setStatus(response.data);
        if (response.data.msg !== '') {
          setStatusModal(true);
        } else {
          (' ');
        }
        // setStatusData(response.data.data);
        // setStatusMsg(response.data);
        // if (response.data.data[0].allStudentsBaselineStatus === 'incomplete') {
        //   setStatusModal(true);
        // } else {
        //   ('');
        // }
      },
      err => {
        //
      },
    );
  }, []);

  const logOut = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // await  GoogleSignin.signOut();
      GoogleSignin.signOut()
        .then(res => {
          setLogOuts(true);
        })
        .catch(err => {});
      dispatch(types.logOutUser());
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.nrusingh.teacher_thinkzone1',
      );
    } catch (error) {
      console.error(error);
    }
  };
  const MyWebComponent = () => {
    navigation.navigate('Auro', {
      type: 'Auro',
    });
  };

  const openPedagogy = () => {
    // dispatch(TechSlice.clearState());
    navigation.navigate('pedagogy', {
      type: 'training3',
      // head: ' ଶିକ୍ଷଣ ଓ ଶିକ୍ଷାଦାନ',
    });
  };
  const openTech = () => {
    // dispatch(TechSlice.clearState());
    navigation.navigate('techmodule', {
      type: 'training2',
      // head: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
    });
  };

  const open21st = () => {
    // dispatch(TechSlice.clearState());
    navigation.navigate('21st', {
      type: 'training1',
      // head: 'ଏକବିଂଶ ଶତାବ୍ଦୀକୌଶଳ',
    });
  };
  const openFln = () => {
    navigation.navigate('flncontent');
  };

  //------------------Modal view for Leaderboard, Profile and Myachievement-----

  const [rewardModal, setRewardModal] = useState(false);
  const [leaderboardModal, setLeaderboardModal] = useState(false);
  const [progressModal, setProgressModal] = useState(false);

  const openRewardModal = () => {
    setRewardModal(true);
  };
  const openMopragati = () => {
    navigation.navigate('Mopragati');
  };
  const closeRewardModal = () => {
    setRewardModal(false);
  };

  const openLeaderboardModal = () => {
    setLeaderboardModal(true);
  };

  const closeLeaderboardModal = () => {
    setLeaderboardModal(false);
  };

  const openProgressModal = () => {
    setProgressModal(true);
  };

  const closeProgressModal = () => {
    setProgressModal(false);
  };

  const closeMaintainanceModal = async () => {
    // logOut();
    try {
      await GoogleSignin.hasPlayServices();
      // await  GoogleSignin.signOut();
      GoogleSignin.signOut()
        .then(res => {})
        .catch(err => {});

      dispatch(types.logOutUser());
      navigation.navigate('login');
      setmaintainanceModal(false);
    } catch (error) {}
  };

  //----------------------------------------------------------------------------

  // const _renderItem = ({item, index}) => (
  //   <TouchableOpacity onPress={() => handlePageChange(item)}>
  //     <CarouselImage data={item} />
  //   </TouchableOpacity>
  // );
  //Introdata modal function

  const [statuss, setStatuss] = useState();
  // useEffect(() => {
  //   API.get(`getTransIntroQuiz/${user[0].userid}/${user[0].usertype}`).then(
  //     response => {
  //       // setStatuss(response.data.completionStatus);
  //       console.log('intro response------>', response.data.completionStatus);
  //       if (response.data.completionStatus === 'incomplete') {
  //         // setIsloading(true);
  //         setModalVisibleIntro(false);
  //         // setIntroDatas(response.data.quizData);
  //       } else {
  //         setModalVisibleIntro(true);
  //         setIsloading(false);
  //         setIntroDatas(response.data.quizData);
  //       }
  //     },
  //   );
  // }, []);

  //For TextInput Starts Quiz1
  const handleAnswerChange = useCallback(
    (questionOrder, newAnswer) => {
      setIntroDatas(prevData => {
        const newData = [...prevData];
        const questionIndex = newData.findIndex(
          item => item.questionId === questionOrder,
        );
        if (questionIndex !== -1) {
          newData[questionIndex].answer = newAnswer;
        }

        return newData;
      });
    },
    [setIntroDatas],
  );

  //For TextInput Ends

  //For OPtional Question i.e 4,3,2 Options starts    Quiz1
  const handleOptionSelect = (questionId, selectedOption) => {
    setIntroDatas(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, selectedOption};
        }
        return item;
      });
      return newData;
    });
  };
  //For optional question Ends

  //For AUDIO rECORDS s3 url starts   Quiz1

  const closeModals = (url, questionId) => {
    setIntroDatas(prevData => {
      const newData = prevData.map(item => {
        if (item.questionId === questionId) {
          return {...item, answer: url}; // Set the answer property to the url
        }
        return item;
      });
      return newData;
    });
  };

  //Fot Audio Records s3 url ends

  const handleQuizSubmit = () => {
    const checkDataLengthOption = introDatas.filter(
      x => x.selectedOption?.length,
    );
    const checkDataLengthAnswer = introDatas.filter(x => x.answer?.length);

    if (
      introDatas.length ===
      checkDataLengthOption.length + checkDataLengthAnswer.length
    ) {
      const body = {
        userid,
        username,
        usertype,
        managerid,
        managername,
        passcode,
        quizData: introDatas,
        securedMarks: 12,
        totalMarks: 20,
      };

      try {
        // const response = API.post(`saveTransTchTrainingQuiz`, data);

        API.post(`saveTransIntroQuiz`, body).then(response => {
          Alert.alert(`${response.data.msg}`, '', [
            {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
          ]);
          if (response.status === 201) {
            setModalVisibleIntro(false);
            const data = {
              loginType: 'google',
              emailid: user[0]?.emailid,
              contactnumber: user[0]?.contactnumber,
            };
            dispatch(types.loadUserStartbyphone(data));

            dispatch(types.introQuizStart());
          }
        });
      } catch (error) {}

      // API.post(`saveTransTchTrainingQuiz`, data).then(res => {
      //   console.log('res.data====>', res.data);
      // });
    } else {
      Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ! ', 'ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।', [
        {text: 'OK', onPress: () => null},
      ]);
    }
  };

  const carouselRef = useRef(null);
  const [loopCycles, setLoopCycles] = useState(0);
  const [isReadyForRender, setIsReadyForRender] = useState(false);

  function onReady() {
    setIsReadyForRender(true);
  }
  // const maxLoopCycles = 3; // Maximum number of loop cycles

  // //-------------------------Milestone on image click----------------------------
  // const [selectedIndex, setSelectedIndex] = useState(0);
  // const [milstone, setMilstone] = useState([]);

  // useEffect(() => {
  //   API.get(`getTransUserProgress/${'dhaneswarsetha.123@gmail.com'}`).then(
  //     response => {
  //       setMilstone(response.data);
  //     },
  //     err => {},
  //   );
  // }, []);

  // const openMessage = index => {
  //   setSelectedIndex(index);
  // };

  // //-----------------------------------------------------------------------------
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };
  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    if (checkPermission !== RESULTS.GRANTED) {
      const request = await requestNotificationPermission();
      if (request !== RESULTS.GRANTED) {
        // permission not granted
      }
    }
  };

  const [videos, setVideos] = useState([]);
  // const videos = [
  //   {uri: 'QgpRC29T-L8'},
  //   {uri: 'rU1FX9nvJ7A'},
  //   {uri: 'rU1FX9nvJ7A'},
  //   {uri: 'rU1FX9nvJ7A'},
  // ];
  const handleVideoPress = index => {
    if (focusedIndex === index) {
      setFocusedIndex(null); // Unfocus if already focused
    } else {
      setFocusedIndex(index);
    }
  };
  // console.log(videos, 'videos------------------------------------');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isFlatListFocused, setIsFlatListFocused] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    API.get(`getDboardSliders/${user[0]?.usertype}/${'video'}`).then(
      response => {
        setVideos(response.data);
        // console.log(
        //   response.data,
        //   'videos--------------------------------------->',
        // );
      },
      err => {
        // Handle error
      },
    );
  }, []);
  // const mediaUrl = 'A4LduNvkwvo';
  // console.log(mediaUrl, 'mediaUrl--------------------------------------->');
  const lastIndex = videos.length - 1;

  // const scrollViewRef = useRef();
  const [sBadges, setSbadges] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const fetchData = async () => {
    try {
      const response = await API.get(`getUserProgress/${user[0].userid}`);
      setSbadges(response.data.badgesData[0]);
    } catch (error) {
      if (error.response.status === 413) {
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
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

  const checkAndShowModal = async () => {
    const today = new Date().toISOString().split('T')[0];
    const lastShownDate = await AsyncStorage.getItem('lastModalShownDate');

    if (lastShownDate !== today) {
      if (sBadges?.bronzeBadges >= 1) {
        setModalMessage('You got a Bronze Medal!');
        setModalVisible(true);
      } else if (sBadges?.silverBadges >= 1) {
        setModalMessage('You got a Silver Medal!');
        setModalVisible(true);
      } else if (sBadges?.goldBadges >= 1) {
        setModalMessage('You got a Gold Medal!');
        setModalVisible(true);
      } else if (sBadges?.platinumBadges >= 1) {
        setModalMessage('You got a Platinum Medal!');
        setModalVisible(true);
      } else if (sBadges?.diamondBadges >= 1) {
        setModalMessage('You got a Diamond Medal!');
        setModalVisible(true);
      }

      await AsyncStorage.setItem('lastModalShownDate', today);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (sBadges && Object.keys(sBadges).length > 0) {
      checkAndShowModal();
    }
  }, [sBadges]);

  // useEffect(() => {
  //   const animation = Animated.loop(
  //     Animated.timing(rotateValue, {
  //       toValue: 1,
  //       duration: 3000, // 3 seconds for one complete rotation
  //       easing: Easing.linear,
  //       useNativeDriver: true,
  //     }),
  //   );

  //   animation.start();

  //   return () => {
  //     animation.stop(); // Cleanup function to stop the animation
  //   };
  // }, [rotateValue]);

  // const rotate = rotateValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '360deg'],
  // });
  const badgemodal = () => {
    setModal(false);
    navigation.navigate('leaderboard');
  };

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlide(index % imageSlider.length); // Adjust the activeSlide index
  };
  return (
    <>
      <ScrollView
        target={viewRef}
        ref={scrollRef}
        scrollEnabled={scrollEnabled}>
        <SafeAreaView style={styles.safeview}>
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View
                  style={[
                    styles.modalView,
                    {
                      height: window.WindowHeigth * 0.65,
                      width: window.WindowWidth * 0.9,
                      top: '-2%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        sBadges?.diamondBadges >= 1
                          ? '#9ac5db'
                          : sBadges?.platinumBadges >= 1
                          ? '#E5E4E2'
                          : sBadges?.goldBadges >= 1
                          ? '#BFA100'
                          : sBadges?.silverBadges >= 1
                          ? '#C0C0C0'
                          : 'rgb(205, 127, 50)',
                    },
                  ]}>
                  <ImageBackground
                    source={require('../assets/Image/celebration.gif')}
                    style={{
                      height: window.WindowHeigth * 0.6,
                      width: window.WindowWidth * 0.75,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    imageStyle={{borderRadius: 20}}>
                    <Text
                      style={{
                        fontSize: 20,
                        position: 'absolute',
                        top: 10,
                        textAlign: 'center',
                      }}>
                      𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧{' '}
                      <Text
                        style={[
                          styles.username,
                          {
                            marginTop: -20,
                            fontSize: 20,
                            left: -20,
                            color: 'black',
                          },
                        ]}>
                        {user[0]?.firstname}
                      </Text>
                      🎉{' '}
                    </Text>
                    <Text style={{fontSize: 17, top: 55, position: 'absolute'}}>
                      {' '}
                      𝐘𝐨𝐮 𝐠𝐨𝐭 𝐚 𝐧𝐞𝐰 𝐛𝐚𝐝𝐠𝐞𝐬
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Mopragati');
                      }}
                      style={[
                        styles.bu,
                        {
                          marginTop: 30,
                          width: window.WindowWidth * 0.5,
                          // height: window.WindowHeigth * 0.1,
                          bottom: 30,
                          position: 'absolute',
                        },
                      ]}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Color.white,
                          fontWeight: '900',
                          textAlign: 'center',
                          fontFamily: FontFamily.poppinsMedium,
                        }}>
                        Check Your Badge !!
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={[
                        styles.bu,
                        {
                          marginTop: 30,
                          backgroundColor: Color.ghostwhite,
                          width: window.WindowWidth * 0.5,
                          borderWidth: 1,
                          borderColor: Color.royalblue,
                          // height: window.WindowHeigth * 0.1,
                        },
                      ]}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Color.royalblue,
                          fontWeight: '900',
                          textAlign: 'center',
                          fontFamily: FontFamily.poppinsMedium,
                        }}>
                        Skip for now
                      </Text>
                    </TouchableOpacity>
                    {/* <Button onPress={() => setModalVisible(!modalVisible)} title="Close" /> */}
                  </ImageBackground>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={maintainanceModal}
              onRequestClose={closeMaintainanceModal}>
              <View style={styles.centeredView}>
                <View
                  style={[
                    styles.modalView,
                    {
                      height: window.WindowHeigth * 1.1,
                      width: window.WindowWidth * 1.1,
                      top: '-2%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Color.ghostwhite,
                    },
                  ]}>
                  <Image
                    style={{
                      // flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: window.WindowHeigth * 0.55,
                      width: window.WindowWidth * 0.98,
                      // width: 327,
                      // height: 384,
                    }}
                    source={require('../assets/Image/serverUnderMnt.png')}
                  />
                  <Text style={styles.p}>
                    ଧ୍ୟାନ ଦିଅନ୍ତୁ! ଆପ୍ଲିକେସନରେ କିଛି ଜରୁରୀ କାର୍ଯ୍ୟ ଚାଲୁଅଛି ।କିଛି
                    ସମୟପରେ ଚେଷ୍ଟା କରନ୍ତୁ ।
                  </Text>
                </View>
              </View>
            </Modal>

            {/* Introdata ends */}
            <Modal animationType="slide" transparent={true} visible={modal}>
              <View style={styles.centeredView}>
                <View
                  style={[
                    styles.modalView,
                    {
                      // height: window.WindowHeigth * 0.8,
                      // marginTop: -50,
                      width: window.WindowWidth * 0.92,
                    },
                  ]}>
                  {/* <TouchableOpacity onPress={() => setModal(false)}>
                  <Entypo
                    name="circle-with-cross"
                    color={Color.royalblue}
                    size={30}
                    style={{marginLeft: 225, marginTop: -30}}
                  />
                </TouchableOpacity> */}
                  <Image
                    source={require('../assets/Image/leader.gif')}
                    style={{width: 350, height: 320, top: -20}}
                  />
                  <Text
                    style={[
                      styles.username,
                      {fontSize: 20, top: -30, alignSelf: 'center'},
                    ]}>
                    Congratulations 🎊
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      {
                        marginTop: -20,
                        fontSize: 16,
                        left: -20,
                        color: '#666666',
                      },
                    ]}>
                    {user[0]?.username}
                  </Text>
                  <Text style={[styles.username, {fontSize: 12, top: 10}]}>
                    ଆପଣ ଲିଡରବୋର୍ଡରେ ସ୍ଥାନ ହାସଲ କରିଛନ୍ତି । ଆପଣ ଯଦି ଏହି ମାସ ଶେଷ
                    ସୁଦ୍ଧା ଲିଡରବୋର୍ଡରେ ନିଜ ସ୍ଥାନ ପ୍ରଥମ ୧୦ ଜଣଙ୍କ ମଧ୍ୟରେ ବଜାୟ
                    ରଖନ୍ତି ତା'ହାଲେ ଆପଣଙ୍କୁ ୨୦୦୦ କଏନ୍ ପ୍ରାପ୍ତ ହେବ । ଏହି କଏନ୍
                    ଗୁଡ଼ିକୁ ଆପଣ Amazon Voucher ରେ Reedem କରିପାରିବେ ।
                  </Text>
                  <TouchableOpacity
                    onPress={badgemodal}
                    // onPress={() => navigation.navigate('leaderboard')}
                    style={[
                      styles.bu,
                      {
                        marginTop: 30,
                        width: window.WindowWidth * 0.5,
                        // height: window.WindowHeigth * 0.1,
                      },
                    ]}>
                    <Text style={styles.badgesBut}>Check Your Score</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModal(false)}
                    style={[
                      styles.bu,
                      {
                        marginTop: 30,
                        backgroundColor: Color.ghostwhite,
                        width: window.WindowWidth * 0.5,
                        borderWidth: 1,
                        borderColor: Color.royalblue,
                        // height: window.WindowHeigth * 0.1,
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Color.royalblue,
                        fontWeight: '900',
                        textAlign: 'center',
                        fontFamily: FontFamily.poppinsMedium,
                      }}>
                      Skip for now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* </View> */}
            </Modal>
          </View>
          {/* <StatusBar backgroundColor={Color.royalblue} barStyle="white-content" /> */}
          {/* <AppHeader /> */}

          <ScrollView
            style={{marginTop: -30, marginBottom: 5}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Header navigation={navigation} handleClick={handleClick} />
            <View
              style={{
                marginTop: -670,
                backgroundColor: Color.ghostwhite,
                marginBottom: 20,
              }}>
              <View style={[styles.warp, {marginTop: 10, marginBottom: 40}]}>
                <View style={{marginTop: 5, marginBottom: 5}}>
                  <View style={styles.view}>
                    <Text
                      style={[
                        {
                          color: '#333333',
                          fontWeight: '500',
                          fontSize: FontSize.size_mid_9,
                          // fontWeight: 'bold',
                          textTransform: 'uppercase',
                          marginLeft: 105,
                          left: '2%',
                          fontFamily: FontFamily.balooBhaina2Medium,
                          paddingTop: 10,
                          paddingBottom: 12,
                        },
                      ]}>
                      {/* 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                      ଶିକ୍ଷକ ବିଭାଗ
                    </Text>

                    {storageData[0]?.usertype === 'fellow' ? (
                      <View
                        style={{
                          paddingTop: 8,
                          paddingBottom: 20,
                          marginLeft: -10,
                        }}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchTraining3
                                ? navigation.navigate('moduleunderdevlopment')
                                : openPedagogy();
                            }}>
                            <Image
                              ref={exampleOneViewRef}
                              style={styles.tinyLogo}
                              source={require('../assets/Image/note-2.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                ଶିକ୍ଷଣ ଓ{'\n'}ଶିକ୍ଷାଦାନ
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchTraining1
                                ? navigation.navigate('moduleunderdevlopment')
                                : open21st();
                            }}>
                            <Image
                              ref={exampleTwoViewRef}
                              style={styles.tinyLogo}
                              source={require('../assets/Image/global-edit.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                ଏକବିଂଶ ଶତାବ୍ଦୀ{'\n'}
                                {'      '}କୌଶଳ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchTraining2
                                ? navigation.navigate('moduleunderdevlopment')
                                : openTech();
                            }}>
                            <Image
                              ref={exampleThreeViewRef}
                              style={styles.tinyLogo}
                              source={require('../assets/Image/cpu.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                ପ୍ରଯୁକ୍ତିବିଦ୍ୟା
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchCmq
                                ? navigation.navigate('moduleunderdevlopment')
                                : openCmq();
                            }}>
                            <Image
                              ref={exampleFourViewRef}
                              style={[styles.tinyLogo]}
                              source={require('../assets/Image/status-up.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                ନିଜ ବୁଝାମଣା {'\n'} ଯାଞ୍ଜ କରନ୍ତୁ
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    ) : user[0]?.usertype === 'school' ? (
                      <View
                        style={{
                          paddingTop: 8,
                          paddingBottom: 20,
                          marginLeft: -10,
                        }}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchTraining3
                                ? navigation.navigate('moduleunderdevlopment')
                                : openPedagogy();
                            }}>
                            <Image
                              ref={exampleOneViewRef}
                              style={styles.tinyLogo}
                              source={require('../assets/Image/note-2.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                Prasanga 1
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchTraining1
                                ? navigation.navigate('moduleunderdevlopment')
                                : open21st();
                            }}>
                            <Image
                              ref={exampleTwoViewRef}
                              style={styles.tinyLogo}
                              source={require('../assets/Image/global-edit.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                prasanga 2
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchTraining2
                                ? navigation.navigate('moduleunderdevlopment')
                                : openTech();
                            }}>
                            <Image
                              ref={exampleThreeViewRef}
                              style={styles.tinyLogo}
                              source={require('../assets/Image/cpu.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                Prasanga 3
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchCmq
                                ? navigation.navigate('moduleunderdevlopment')
                                : openCmq();
                            }}>
                            <Image
                              ref={exampleFourViewRef}
                              style={[styles.tinyLogo]}
                              source={require('../assets/Image/status-up.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={[styles.FlngatiText]}>
                                Prasanga 4
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    ) : null}
                  </View>

                  <FlatList
                    data={imageSlider}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => handlePageChange(item?.navigateTo)}>
                        <CarouselImage data={item.mediaUrl} />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    onScroll={handleScroll}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    style={{width: width}} // Set the width dynamically
                  />

                  <View style={styles.view}>
                    <Text
                      style={[
                        {
                          color: '#333333',
                          fontWeight: '500',
                          fontSize: FontSize.size_mid_9,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          left: '2%',
                          fontFamily: FontFamily.balooBhaina2Medium,
                          // paddingTop: 10,
                          paddingBottom: 12,

                          // fontWeight:"bold"
                        },
                      ]}>
                      {/* 𝐒𝐓𝐔𝐃𝐄𝐍𝐓𝐒 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                      ଶିକ୍ଷାର୍ଥୀ ବିଭାଗ
                    </Text>

                    <View
                      style={{
                        // paddingTop: 8,
                        // paddingBottom: 20,
                        // marginLeft: 30,
                        // justifyContent: 'space-between',
                        // paddingRight: 40,
                        padding: '4.5%',
                        justifyContent: 'flex-end',
                        // marginLeft: '6%',
                      }}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {/* <TouchableOpacity
              onPress={() => navigation.navigate('studentregister')}>
              <Image
                ref={exampleFiveViewRef}
                style={styles.tinyLogo}
                source={require('../assets/Image/iconusersprofileadd.png')}
              />
              <View style={styles.text_sign}>
                <Text style={styles.FlngatiText}>ପଞ୍ଜୀକରଣ</Text>
              </View>
            </TouchableOpacity> */}

                        <TouchableOpacity
                          onPress={() => {
                            maintainanceStatus?.studDetails
                              ? navigation.navigate('moduleunderdevlopment')
                              : navigation.navigate('studentlist');
                          }}>
                          <Image
                            ref={exampleSixViewRef}
                            resizeMode="cover"
                            style={[styles.tinyLogo]}
                            source={require('../assets/Image/iconusersprofile2user.png')}
                          />
                          <View style={styles.text_sign}>
                            <Text style={styles.FlngatiText}>
                              ଶିକ୍ଷାର୍ଥୀ ସୂଚନା
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            maintainanceStatus?.studAttendance
                              ? navigation.navigate('moduleunderdevlopment')
                              : navigation.navigate('studentAttendance', {
                                  type: 'studentAttendance',
                                });
                          }}>
                          <Image
                            ref={exampleSevenViewRef}
                            style={styles.tinyLogo}
                            source={require('../assets/Image/iconcontent-editnotefavorite.png')}
                          />
                          <View style={styles.text_sign}>
                            <Text style={styles.FlngatiText}>ଉପସ୍ଥାନ</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            maintainanceStatus?.studAssess
                              ? navigation.navigate('moduleunderdevlopment')
                              : navigation.navigate('studentlistpage');
                          }}>
                          <Image
                            ref={exampleEightViewRef}
                            style={styles.tinyLogo}
                            source={require('../assets/Image/task-square.png')}
                          />
                          <View style={styles.text_sign}>
                            <Text style={styles.FlngatiText}>
                              ଶିକ୍ଷାର୍ଥୀ ବିକାଶ
                            </Text>
                          </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Games', {
                              type: 'Games',
                            })
                          }>
                          <Image
                            style={styles.tinyLogo}
                            source={require('../assets/Image/iconschoolbook1.png')}
                          />
                          <Text style={styles.FlngatiText}>ଖେଳ</Text>
                        </TouchableOpacity> */}
                      </ScrollView>
                    </View>
                  </View>
                  <View>
                    {videos?.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {videos?.map((video, index) => (
                          <>
                            <TouchableOpacity
                              key={index}
                              onPress={() => handleVideoPress(index)}
                              style={{
                                padding: 5,
                                alignSelf: 'center',
                                left: '7%',
                              }}>
                              {/* <YouTube
                                videoId={video.mediaUrl}
                                width={responsiveWidth}
                                height={responsiveHeight}
                                // play={index === focusedIndex}
                                onReady={onReady}
                                webViewStyle={{
                                  opacity: 0.99,
                                  display: isReadyForRender ? 'flex' : 'none',
                                }}
                                webViewProps={{
                                  androidLayerType: isReadyForRender
                                    ? 'hardware'
                                    : 'software',
                                }}
                                onChangeState={event => {
                                  console.log('State:', event.state);
                                  if (event.state === 'ended') {
                                    setFocusedIndex(null); // Reset focused index when the video ends
                                  }
                                }}
                                onError={error => console.log('Error:', error)}
                              /> */}
                            </TouchableOpacity>
                          </>
                        ))}
                      </ScrollView>
                    )}
                  </View>

                  <View style={[styles.view, {padding: 0}]}>
                    <Text
                      style={[
                        {
                          color: '#333333',
                          fontWeight: '500',
                          fontSize: FontSize.size_mid_9,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          left: '2%',
                          fontFamily: FontFamily.balooBhaina2Medium,
                          paddingTop: 10,
                          paddingLeft: 11,
                        },
                      ]}>
                      {/* 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                      ଗତିବିଧି ବିଭାଗ
                    </Text>

                    {storageData[0]?.usertype === 'fellow' ? (
                      <View style={{paddingTop: 8, paddingBottom: 20}}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.eceAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('ecactivity', {
                                    type: 'ecactivity',
                                  });
                            }}>
                            <Image
                              style={[styles.tinyLogos]}
                              source={require('../assets/Image/iconcontent-editdocumentnormal.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={styles.FlngatiTexts}>
                                ପ୍ରାକ୍{'\n'}ଗତିବିଧି
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.pgeAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('pgeactivity', {
                                    type: 'pgeactivity',
                                  });
                            }}>
                            <Image
                              // ref={exampleTenViewRef}
                              style={[
                                styles.tinyLogos,
                                // {alignSelf: 'center'}
                              ]}
                              source={require('../assets/Image/iconcontent-editnote.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={styles.FlngatiTexts}>
                                ପ୍ରାଥମିକ{'\n'}ଗତିବିଧି
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.flnAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : openFln();
                            }}>
                            <Image
                              // ref={exampleElevenViewRef}
                              // style={styles.tinyLogos}
                              style={[
                                styles.tinyLogos,
                                // {alignSelf: 'center'}
                              ]}
                              source={require('../assets/Image/iconprogramminghierarchy3.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {
                                    fontSize: 12,
                                    // color: Color.black,
                                    // position: 'absolute',
                                    fontFamily: FontFamily.poppinsMedium,
                                    textTransform: 'uppercase',
                                  },
                                ]}>
                                FLN {'\n'}ଗତିବିଧି
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.communityAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate(
                                    'communityengagementpage',
                                  );
                            }}>
                            <Image
                              // style={styles.tinyLogos}
                              style={[
                                styles.tinyLogos,
                                // {alignSelf: 'center', marginRight: 10},
                              ]}
                              source={require('../assets/Image/Samudaya.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={styles.FlngatiTexts}>
                                ଗୋଷ୍ଠୀ{'\n'}ସମ୍ପୃକ୍ତିକରଣ
                                {/* ସମୁଦାୟ{'\n'}ନିୟୋଜନ */}
                                {/* Samudaya{'\n'}niyajana */}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    ) : user[0]?.usertype === 'school' ? (
                      <View style={{paddingTop: 8, paddingBottom: 20}}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.flnAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : openFln();
                            }}>
                            <Image
                              // ref={exampleElevenViewRef}
                              // style={styles.tinyLogos}
                              style={[
                                styles.tinyLogos,
                                // {alignSelf: 'center'}
                              ]}
                              source={require('../assets/Image/iconprogramminghierarchy3.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {
                                    fontSize: 12,
                                    // color: Color.black,
                                    // position: 'absolute',
                                    fontFamily: FontFamily.poppinsMedium,
                                    textTransform: 'uppercase',
                                  },
                                ]}>
                                FLN {'\n'}ଗତିବିଧି
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.communityAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate(
                                    'communityengagementpage',
                                  );
                            }}>
                            <Image
                              // style={styles.tinyLogos}
                              style={[
                                styles.tinyLogos,
                                // {alignSelf: 'center', marginRight: 10},
                              ]}
                              source={require('../assets/Image/Samudaya.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={styles.FlngatiTexts}>
                                Baishayika{'\n'}Gatibidhi
                                {/* ସମୁଦାୟ{'\n'}ନିୟୋଜନ */}
                                {/* Samudaya{'\n'}niyajana */}
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.eceAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('ecactivity', {
                                    type: 'ecactivity',
                                  });
                            }}>
                            <Image
                              style={[styles.tinyLogos]}
                              source={require('../assets/Image/iconcontent-editdocumentnormal.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={styles.FlngatiTexts}>
                                Prakashak{'\n'}Camp
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.pgeAct
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('pgeactivity', {
                                    type: 'pgeactivity',
                                  });
                            }}>
                            <Image
                              // ref={exampleTenViewRef}
                              style={[
                                styles.tinyLogos,
                                // {alignSelf: 'center'}
                              ]}
                              source={require('../assets/Image/iconcontent-editnote.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text style={styles.FlngatiTexts}>
                                Prarambha{'\n'}Camp
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      maintainanceStatus?.tchReward
                        ? navigation.navigate('moduleunderdevlopment')
                        : openMopragati();
                    }}
                    style={{marginTop: 8}}>
                    <Image
                      source={require('../assets/Image/mopragati.png')}
                      resizeMode="contain"
                      style={{
                        height: window.WindowHeigth * 0.2,
                        width: window.WindowWidth * 0.9,
                        borderRadius: 5,
                        marginLeft: 18,
                        borderColor: 'black',
                      }}
                    />
                    {/* <Image
                      source={require('../assets/Image/touch1.gif')}
                      style={{
                        width: 40,
                        height: 40,
                        position: 'absolute',
                        zIndex: 1,
                        backgroundColor: 'white',

                        alignSelf: 'center',
                        borderRadius: 50,
                        width: 35.72,
                        height: 35.66,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 20,

                        // bottom: '-13%', // Ensure the GIF is on top
                      }}
                    /> */}
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => {
                      maintainanceStatus?.tchReward
                        ? navigation.navigate('moduleunderdevlopment')
                        : openRewardModal();
                    }}
                    style={{marginTop: 15}}>
                    <Image
                      source={require('../assets/Image/GroupRewards.png')}
                      resizeMode="contain"
                      style={{
                        height: window.WindowHeigth * 0.2,
                        width: window.WindowWidth * 0.9,
                        borderRadius: 5,
                        marginLeft: 18,
                        borderColor: 'black',
                      }}
                    />
                  </TouchableOpacity> */}

                  <View style={[styles.view, {marginBottom: 15}]}>
                    <Text
                      style={[
                        {
                          color: '#333333',
                          fontWeight: '500',
                          fontSize: FontSize.size_mid_9,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          left: '2%',
                          fontFamily: FontFamily.balooBhaina2Medium,
                          paddingTop: 10,
                        },
                      ]}>
                      {/* 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                      ଅତିରିକ୍ତ ବିଭାଗ
                    </Text>

                    <View style={{paddingTop: 8, paddingBottom: 20}}>
                      {user[0]?.usertype === 'fellow' ? (
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.payment
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('payment', {
                                    type: 'payment',
                                  });
                            }}>
                            <Image
                              // ref={exampleThirteenViewRef}
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              // source={require('../assets/img/hbl/bill.png')}

                              source={require('../assets/Image/iconmoneyemptywallettime.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 18},
                                ]}>
                                ଦେୟ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('dictionary', {
                                type: 'dictionary',
                              })
                            }>
                            <Image
                              // ref={exampleFourteenViewRef}
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/icondesign-toolscolorswatch.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 18},
                                ]}>
                                ଅଭିଧାନ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              maintainanceStatus?.gallery
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('books', {
                                    type: 'books',
                                  })
                            }>
                            <Image
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/iconcontent-editarchivebook.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 18},
                                ]}>
                                ଦସ୍ତାବିଜ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchSurvey
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('Feedback');
                            }}>
                            <Image
                              // ref={exampleSixteenViewRef}
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/messages.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 17},
                                ]}>
                                ମତାମତ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('faq');
                            }}>
                            <Image
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/faq.jpg')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 17},
                                ]}>
                                FAQ
                              </Text>
                            </View>
                          </TouchableOpacity>
                          {/* 
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('downloadfile');
                            }}>
                            <Image
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/faq.jpg')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 17},
                                ]}>
                                Off-Line
                              </Text>
                            </View>
                          </TouchableOpacity> */}
                        </ScrollView>
                      ) : user[0]?.usertype === 'school' ? (
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            onPress={() =>
                              maintainanceStatus?.gallery
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('books', {
                                    type: 'books',
                                  })
                            }>
                            <Image
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/iconcontent-editarchivebook.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 18},
                                ]}>
                                ଦସ୍ତାବିଜ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('dictionary', {
                                type: 'dictionary',
                              })
                            }>
                            <Image
                              // ref={exampleFourteenViewRef}
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/icondesign-toolscolorswatch.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 18},
                                ]}>
                                ଅଭିଧାନ
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              maintainanceStatus?.tchSurvey
                                ? navigation.navigate('moduleunderdevlopment')
                                : navigation.navigate('Feedback');
                            }}>
                            <Image
                              // ref={exampleSixteenViewRef}
                              style={[styles.tinyLogo, {marginLeft: 17}]}
                              source={require('../assets/Image/messages.png')}
                            />
                            <View style={styles.text_sign}>
                              <Text
                                style={[
                                  styles.FlngatiTexts,
                                  {marginRight: 17},
                                ]}>
                                Worksheet
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </ScrollView>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  safeview: {
    paddingBottom: -10,
    justifyContent: 'space-evenly',
    backgroundColor: Color.white,
  },
  homepageheader: {
    height: window.WindowHeigth * 0.3,
    backgroundColor: Color.royalblue,
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    borderWidth: 2,
    borderColor: Color.royalblue,
    elevation: 0,
  },
  card: {
    width: window.WindowWidth * 0.8,
    height: 150,
    overflow: 'hidden',
  },
  homeimgnm: {
    flexDirection: 'row-reverse',
    // alignItems: 'stretch',
  },
  studentmodule: {
    flexDirection: 'row',
    height: window.WindowHeigth * 0.45,
    width: window.WindowWidth * 0.9,
    backgroundColor: Color.white,
    alignSelf: 'center',
    borderRadius: 20,
    flexWrap: 'wrap',
    shadowColor: '#333333',
    elevation: 10,
    borderWidth: 2,
    borderBottomColor: Color.royalblue,
    borderRightColor: '#13678a',
    borderTopColor: '#13858a',
    borderLeftColor: '#138a71',
  },

  boxitem: {
    marginTop: 12,
    alignSelf: 'center',
    justifyContent: 'space-around',
    // backgroundColor: Color.royalblue,
    margin: '4.5%',
    height: 150,
    width: 95,
    borderRadius: 20,
    // elevation: 10,
  },
  warp: {
    // alignSelf: 'center',
    // elevation: 10,
  },
  warp1: {
    // marginLeft: window.WindowWidth * 0.35,
    // marginRight: window.WindowWidth * 0.15,
    // paddingLeft: window.WindowWidth * 0.1,
    // paddingRight: window.WindowWidth * 0.1,
    alignSelf: 'center',
    borderRadius: 20,
    // height: window.WindowHeigth * 0.25,
    // width: window.WindowWidth,
    // elevation: 10,
  },
  scrollimage: {
    marginLeft: window.WindowWidth * 0.15,
    marginRight: window.WindowWidth * 0.15,
    alignSelf: 'center',
    height: window.WindowHeigth * 0.22,
    width: window.WindowWidth * 0.7,
    borderRadius: 30,
  },
  warpOut: {
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: Color.royalblue,
  },
  dotInactive: {
    margin: 3,
    color: 'white',
  },
  top: {
    alignSelf: 'center',
    margin: 20,
  },
  firsttext: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    textTransform: 'capitalize',
  },
  secondtext: {
    color: 'black',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  ScrollView: {},
  box: {
    margin: 8,
    padding: 20,
    height: 100,
    width: 350,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
  },
  images: {
    // height: 200,
    // width: 100,
    borderRadius: 20,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  imagestext: {
    color: '#333333',
    fontSize: 10,
  },
  botnavigation: {
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 2,
  },
  botnavigationtext: {
    fontSize: 10.5,
    color: '#333333',
    fontFamily: FontFamily.poppinsSemibold,
  },
  name: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    color: 'black',
  },
  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  pricesymbol: {
    paddingLeft: 70,
  },
  price: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },

  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  FlngatiText: {
    marginLeft: 20,
    fontSize: 11,
    alignSelf: 'center',
    color: '#000000',
    alignSelf: 'center',
    marginTop: 12,
    // textAlign: 'center',
  },
  FlngatiTexts: {
    marginLeft: 35,
    fontSize: 11,
    alignSelf: 'center',
    color: '#000000',
    alignSelf: 'center',
    marginTop: 10,
    textAlign: 'center',
  },
  text_sign: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    alignSelf: 'center',
  },
  image: {
    borderRadius: 1000,
    height: 35,
    width: 35,
    shadowOpacity: 30,
  },

  tinyLogos: {
    width: 42,
    height: 42,
    marginLeft: 30,
    alignSelf: 'center',
    marginTop: 10,
  },
  tinyLogo: {
    width: 42,
    height: 42,
    marginLeft: 25,
    marginRight: 5,
    padding: 15,
    alignSelf: 'center',
    marginTop: 10,
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
  // textStyle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   textTransform: 'uppercase',
  // },

  username: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    textTransform: 'capitalize',

    textAlign: 'center',
    fontWeight: '900',
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
    color: '#595F65',
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 18,
    color: 'black',
    marginBottom: 25,
    marginTop: 40,
    textAlign: 'center',
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
    // marginLeft: 20,
    alignSelf: 'center',
    // flex: 1,
    marginTop: 12,
    borderRadius: 5,
    padding: 10,
    margin: 8,
    // borderColor: 'black',
    // borderWidth: 0.9,
    // borderLeftColor: '#85d8ce',
    // borderRightColor: '#85d8ce',
    // borderBottomColor: '#85d8ce',
    // borderTopColor: '#85d8ce',
    justifyContent: 'space-evenly',
  },
  textStyle: {
    color: 'white',
    fontWeight: '700',
    // alignSelf: 'flex-start',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 16,
    padding: 20,
    paddingBottom: 4,
    paddingTop: 4,

    textAlign: 'center',
    // marginTop: -20,
    textTransform: 'uppercase',
  },
  corsl: {
    marginTop: 5,
    marginBottom: 1,
  },
  carouselContainer: {
    position: 'relative',
    marginTop: 5,
    overflow: 'hidden',
    // alignSelf: 'center', // Adjust the marginTop as needed
  },
  videoContainer: {
    alignSelf: 'center',
    width: 353,
    height: 200,
  },
  video: {
    // flex: 1,
    width: 353,
    height: 200,
  },
  leftArrow: {
    position: 'absolute',
    top: '40%',
    left: 10,
    zIndex: 10,
    // backgroundColor: "#5e5e5fa6",
  },
  rightArrow: {
    position: 'absolute',
    top: '40%',
    right: 10,
    zIndex: 10,
    // backgroundColor: "#5e5e5fa6",
  },
  arrowImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'blue',
  },
  badges: {
    fontSize: 17,
    color: Color.black,
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    textTransform: 'uppercase',
    top: '3%',
  },
  badgesBut: {
    fontSize: 12,
    color: Color.white,
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
  },
});

export default Home;
