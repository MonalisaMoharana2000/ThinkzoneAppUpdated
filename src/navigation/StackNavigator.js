import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../pages/LoginScreen';
import Page1 from '../pages/Page1';
import Page2 from '../pages/Page2';
import Page3 from '../pages/Page3';
import StudentAssessmentPage from '../pages/StudentAssessmentPage';
import StudentAttendance from '../pages/StudentAttendance';
import Attendancelist from '../pages/Attendancelist';
import BottomTabNavigator from './BottomTabNavigator';
import StudentRegister from '../pages/StudentRegister';
import {FontFamily} from '../GlobalStyle';
import StudentList from '../pages/StudentList';
import {TouchableOpacity, ActivityIndicator, View, Alert} from 'react-native';
import {Color} from '../GlobalStyle';
import StudentListPage from '../pages/StudentListPage';
import StudentListActivity from '../pages/StudentListActivity';
import StudentAssessmentDetails from '../pages/StudentAssessmentDetails';
import TechModule from '../pages/TechModule';
import CommonMonthlyReviewPage from '../pages/CommonMonthlyReviewPage';
import PhoneVerificationGoogle from '../pages/PhoneVerificationGoogle';
import Register from '../pages/Register';
import RegisterPasscode from '../pages/RegisterPasscode';
import OtpLoginPhone from '../pages/OtpLoginPhone';
import GoogleVerificationPhone from '../pages/GoogleVerificationPhone';
import TrainingSubmodulePage from '../pages/TrainingSubmodulePage';
import TechContent from '../pages/TechContent';
import TechAssignment from '../pages/TechAssignment';
import SelectFromMultipleGames from '../pages/SelectFromMultipleGames';
import Profile from '../pages/Profile';
import Games from '../pages/Games';
import RearrangeWords from '../pages/RearrangeWords';
import Puzzles from '../pages/Puzzles';
import MatchingExercises from '../pages/MatchingExercises';
import About from '../pages/About';
import Faq from '../pages/Faq';
import Feedback from '../pages/Feedback';
import Dictionary from '../pages/Dictionary';
import Books from '../pages/Books';
import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
import Mopragati from '../pages/Mopragati';
import Leaderboard from '../pages/Leaderboard';
import Myachivement from '../pages/Myachivement';
import IntroQuizPage from '../pages/IntroQuizPage';
import RewardTransaction from '../pages/RewardTransaction';
import CommonMonthlyPage from '../pages/CommonMonthlyPage';

import FirstScreen from '../pages/FirstScreen';
import Landingpage from '../pages/Landingpage';
import Landingpage1 from '../pages/Landingpage1';
import Notification from '../pages/Notification';
import ReviewQuizPage from '../pages/ReviewQuizPage';
import AssignmentPreview from '../components/AssignmentPreview';
import Certificate from '../pages/Certificate';
import EcContent from '../pages/EcContent';
import Ecactivity from '../pages/Ecactivity';
import Pgeactivity from '../pages/Pgeactivity';
import Pgecontentdetails from '../pages/Pgecontentdetails';
import FlnContent from '../pages/FlnContent';
import FlnContentView from '../pages/FlnContentView';
import CommunityEngagementPage from '../pages/CommunityEngagementPage';
import CommunityEngagementContentView from '../pages/CommunityEngagementContentView';
import Payment from '../pages/Payment';
import PaymentDetails from '../pages/PaymentDetails';
import EditProfile from '../pages/EditProfile';
import FillInTheBlank from '../components/FillInTheBlanks';
import CallResponse from '../pages/CallResponse';
import AttendancemodalList from '../pages/AttendancemodalList';
import CommonMonthlyQuiz from '../pages/CommonMonthlyQuiz';
import NotificationPage from '../pages/NotificationPage';

const Stack = createNativeStackNavigator();

const StackNavigator = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log('isLoggedIn---->', isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false); // Stop loading once check is complete
      }
    };

    checkLoginStatus();
  }, []);

  // Show loading indicator while checking async storage
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{
              title: 'Profile',
              headerTitleStyle: {
                fontFamily: FontFamily.poppinsMedium,
              },
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="landing"
            component={Landingpage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="landing1"
            component={Landingpage1}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="firstScreen"
            component={FirstScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Page1"
            options={{headerShown: false}}
            component={Page1}
          />
          <Stack.Screen
            name="phoneverificationgoogle"
            component={PhoneVerificationGoogle}
          />
          <Stack.Screen
            name="Page2"
            component={Page2}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Page3" component={Page3} />

          <Stack.Screen
            name="registerpasscode"
            options={{headerShown: false}}
            component={RegisterPasscode}
          />
          <Stack.Screen name="otploginphone" component={OtpLoginPhone} />
          <Stack.Screen
            name="googleverificationphone"
            component={GoogleVerificationPhone}
          />
          <Stack.Screen
            name="register"
            options={({navigation}) => ({
              title: 'Register',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                      'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => null,
                          style: 'default',
                        },
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('Login'),
                          style: 'default',
                        },
                      ],
                    );
                  }}>
                  <AntDesign
                    style={{marginLeft: 15}}
                    name="arrowleft"
                    size={25}
                    color="black"
                  />
                </TouchableOpacity>
              ),
            })}
            component={Register}
          />
        </>
      )}

      {/* <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      /> */}

      {/* <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="editprofile"
        component={EditProfile}
        options={({navigation}) => ({
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      {/*----------------------------- Student part starts --------------------------------*/}

      <Stack.Screen
        name="studentlist"
        component={StudentList}
        options={({navigation}) => ({
          title: 'ଶିକ୍ଷାର୍ଥୀ ସୂଚନା',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="studentregister"
        component={StudentRegister}
        options={({navigation}) => ({
          title: 'ଶିକ୍ଷାର୍ଥୀ ପଞ୍ଜୀକରଣ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                  'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'default',
                    },
                    {
                      text: 'Ok',
                      onPress: () => navigation.goBack(),
                      style: 'default',
                    },
                  ],
                );
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#0060ca',
          },
        })}
      />

      <Stack.Screen
        name="callresponseList"
        component={CallResponse}
        options={{
          title: 'Call Response',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="studentAttendance"
        component={StudentAttendance}
        options={({navigation}) => ({
          title: 'ଶିକ୍ଷାର୍ଥୀ ଉପସ୍ଥାନ',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="attendancelist"
        component={Attendancelist}
        options={({navigation}) => ({
          title: ' 7 ଦିନର ଉପସ୍ଥାନ',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="studentsattendance"
        component={AttendancemodalList}
        options={({navigation}) => ({
          title: 'ଉପସ୍ଥାନ ସୂଚନା',

          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="studentassessment"
        component={StudentAssessmentPage}
        options={({navigation}) => ({
          title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="studentlistpage"
        component={StudentListPage}
        options={({navigation}) => ({
          title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="StudentsListActivity"
        component={StudentListActivity}
        options={{
          title: 'STUDENT ACTIVITY',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="studentassessmentdetails"
        component={StudentAssessmentDetails}
        options={{
          headerShown: false,
        }}
      />

      {/*------------------------------ Student part ends --------------------------------*/}

      {/* training part starts here */}

      <Stack.Screen
        name="pedagogy"
        component={TechModule}
        options={{
          title: 'ଶିକ୍ଷଣ ଓ ଶିକ୍ଷାଦାନ',
          headerStyle: {
            backgroundColor: '#0060ca', // Set background color here
          },
          headerTitleStyle: {
            // fontWeight: '700',
            color: 'white',
            fontFamily: FontFamily.poppinsMedium,

            // letterSpacing: 2,
          },
          headerTintColor: 'white',
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="techmodule"
        component={TechModule}
        options={{
          title: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
          backgroundColor: 'red',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#0060ca', // Set background color here
            color: 'white',
          },
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
        }}
      />

      <Stack.Screen
        name="21st"
        component={TechModule}
        options={{
          title: 'ଏକବିଂଶ ଶତାବ୍ଦୀ ଓ କୌଶଳ',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#0060ca',
            color: 'white', // Set background color here
          },
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="techcontent"
        component={TechContent}
        options={{
          // title: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
          // headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="techAssignment"
        component={TechAssignment}
        options={{
          title: 'TechAssignment',
          // headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="TrainingSubmodulePage"
        component={TrainingSubmodulePage}
        options={{title: 'SUBMODULE', headerShown: false}}
      />

      <Stack.Screen
        name="Games"
        component={Games}
        options={{
          title: 'Games',

          headerStyle: {
            backgroundColor: Color.royalblue, // Set background color here
          },
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
          headerTintColor: 'white',
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SelectFromMultiple"
        component={SelectFromMultipleGames}
        options={{
          title: 'Select From Multiple',
          headerStyle: {
            backgroundColor: Color.royalblue, // Set background color here
          },
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="RearrangeWords"
        component={RearrangeWords}
        options={{
          title: 'Re-arrange Words',
          headerStyle: {
            backgroundColor: Color.royalblue, // Set background color here
          },
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Puzzles"
        component={Puzzles}
        options={{
          title: 'Puzzles Words',
          headerStyle: {
            backgroundColor: Color.royalblue, // Set background color here
          },
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="MatchingExercises"
        component={MatchingExercises}
        options={{
          title: 'MatchingExercises',
          headerStyle: {
            backgroundColor: Color.royalblue, // Set background color here
          },
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="commonmonthlypage"
        component={CommonMonthlyPage}
        options={{
          title: 'ନିଜ ବୁଝାମଣା ଯାଞ୍ଜ କରନ୍ତୁ',
          headerStyle: {
            backgroundColor: '#0060ca', // Set background color here
          },
          headerTitleStyle: {
            // fontWeight: '700',
            color: 'white',
            fontFamily: FontFamily.poppinsMedium,

            // letterSpacing: 2,
          },
          headerTintColor: 'white',
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="commonmonthlyquiz"
        component={CommonMonthlyQuiz}
        options={{
          title: 'ନିଜ ବୁଝାମଣା ଯାଞ୍ଜ କରନ୍ତୁ',
          headerStyle: {
            backgroundColor: '#0060ca', // Set background color here
          },
          headerTitleStyle: {
            // fontWeight: '700',
            color: 'white',
            fontFamily: FontFamily.poppinsMedium,

            // letterSpacing: 2,
          },
          headerTintColor: 'white',
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="commonmonthlyquizreview"
        component={CommonMonthlyReviewPage}
        options={{
          headerShown: false,
          title: 'Quiz Review',
          // headerLeft: false,
          headerTitleStyle: {
            textTransform: 'uppercase',
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      {/* traioning part ends here */}
      <Stack.Screen
        name="about"
        component={About}
        options={{
          title: 'ABOUT US',
          // headerShown: false,
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="faq"
        component={Faq}
        options={{
          title: 'FAQ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          title: 'ମତାମତ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="dictionary"
        component={Dictionary}
        options={{
          title: 'ଅଭିଧାନ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="books"
        component={Books}
        options={{
          title: 'ଦସ୍ତାବିଜ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="reviewquiz"
        component={ReviewQuizPage}
        options={{
          headerShown: false,
          title: 'Quiz Review',
          headerTitleStyle: {
            // fontWeight: '700',
            textTransform: 'uppercase',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="moduleunderdevlopment"
        component={ModuleUnderDevlopment}
        options={({navigation}) => ({
          title: 'Module Under Devlopment',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="Mopragati"
        component={Mopragati}
        options={({navigation}) => ({
          title: 'ମୋ ପ୍ରଗତି ',
          headerStyle: {
            backgroundColor: '#0060ca',
          },

          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="leaderboard"
        component={Leaderboard}
        options={{
          title: 'Leaderboard',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="myachievement"
        component={Myachivement}
        options={{
          title: 'REWARDS',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="IntroQuiz"
        component={IntroQuizPage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="rewardtransaction"
        component={RewardTransaction}
        options={{
          title: 'TRANSACTION',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />

      <Stack.Screen
        name="notification"
        component={Notification}
        options={{
          title: 'NOTIFICATION',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="notificationPage"
        component={NotificationPage}
        options={{
          title: 'NOTIFICATION',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="assignmentpreview"
        component={AssignmentPreview}
        options={{
          // headerShown: false,
          title: 'Assignment Preview',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="Certificate"
        component={Certificate}
        options={{
          title: 'Certificate',
          // headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="ecactivity"
        component={Ecactivity}
        options={{
          title: 'ପ୍ରାକ୍ ଗତିବିଧି',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="eccontent"
        component={EcContent}
        options={{
          title: 'ପ୍ରାକ୍ ଗତିବିଧି',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="pgeactivity"
        component={Pgeactivity}
        options={{
          title: 'ପ୍ରାଥମିକ ଗତିବିଧି',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="Content"
        component={Pgecontentdetails}
        options={{title: 'ପ୍ରାଥମିକ ଗତିବିଧି', headerShown: false}}
      />
      <Stack.Screen
        name="flncontent"
        component={FlnContent}
        options={{
          title: 'FLN ଗତିବିଧି',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="flncontentview"
        component={FlnContentView}
        options={{
          headerShown: false,
          // headerLeft: false
        }}
      />

      <Stack.Screen
        name="communityengagementpage"
        component={CommunityEngagementPage}
        options={{
          title: 'ଗୋଷ୍ଠୀ ସମ୍ପୃକ୍ତିକରଣ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="communityengagementcontent"
        component={CommunityEngagementContentView}
        options={{
          title: 'ସମୁଦାୟ ନିୟୋଜନ',
          headerShown: false,
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerLeft: false,
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="payment"
        component={Payment}
        options={{
          title: 'ଦେୟ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#0060ca',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="paymentDetails"
        component={PaymentDetails}
        options={{
          title: 'ଦେୟ ସୂଚନା',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />
      <Stack.Screen
        name="FillInTheBlanks"
        component={FillInTheBlank}
        options={{
          title: 'Fill In The Blanks',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
