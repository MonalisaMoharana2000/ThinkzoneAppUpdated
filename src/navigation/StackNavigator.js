import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../Pages/LoginScreen';
import Page1 from '../Pages/Page1';
import Page2 from '../Pages/Page2';
import Page3 from '../Pages/Page3';
import StudentAssessmentPage from '../Pages/StudentAssessmentPage';
import StudentAttendance from '../Pages/StudentAttendance';
import Attendancelist from '../Pages/Attendancelist';
import BottomTabNavigator from './BottomTabNavigator';
import StudentRegister from '../Pages/StudentRegister';
import {FontFamily} from '../GlobalStyle';
import StudentList from '../Pages/StudentList';
import {TouchableOpacity, ActivityIndicator, View} from 'react-native';
import {Color} from '../GlobalStyle';
import StudentListPage from '../Pages/StudentListPage';
import StudentAssessmentDetails from '../Pages/StudentAssessmentDetails';
import TechModule from '../Pages/TechModule';
import CommonMonthlyReviewPage from '../Pages/CommonMonthlyReviewPage';
import PhoneVerificationGoogle from '../Pages/PhoneVerificationGoogle';
import Register from '../Pages/Register';
import RegisterPasscode from '../Pages/RegisterPasscode';
import OtpLoginPhone from '../Pages/OtpLoginPhone';
import GoogleVerificationPhone from '../Pages/GoogleVerificationPhone';
import TrainingSubmodulePage from '../Pages/TrainingSubmodulePage';
import TechContent from '../Pages/TechContent';
import TechAssignment from '../Pages/TechAssignment';
import SelectFromMultipleGames from '../Pages/SelectFromMultipleGames';
import Profile from '../Pages/Profile';
import Games from '../Pages/Games';
import RearrangeWords from '../Pages/RearrangeWords';
import Puzzles from '../Pages/Puzzles';
import MatchingExercises from '../Pages/MatchingExercises';
import About from '../Pages/About';
import Faq from '../Pages/Faq';
import Feedback from '../Pages/Feedback';
import Dictionary from '../Pages/Dictionary';
import Books from '../Pages/Books';
import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
import Mopragati from '../Pages/Mopragati';
import Leaderboard from '../Pages/Leaderboard';
import Myachivement from '../Pages/Myachivement';
import IntroQuizPage from '../Pages/IntroQuizPage';
import RewardTransaction from '../Pages/RewardTransaction';

import FirstScreen from '../Pages/FirstScreen';
import Landingpage from '../Pages/Landingpage';
import Landingpage1 from '../Pages/Landingpage1';

import Notification from '../Pages/Notification';
import ReviewQuizPage from '../Pages/ReviewQuizPage';
import AssignmentPreview from '../components/AssignmentPreview';
import Certificate from '../Pages/Certificate';

const Stack = createNativeStackNavigator();

const StackNavigator = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'firstScreen'}>
      {!isLoggedIn ? (
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
          <Stack.Screen name="Page1" component={Page1} />
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

          <Stack.Screen name="registerpasscode" component={RegisterPasscode} />
          <Stack.Screen name="otploginphone" component={OtpLoginPhone} />
          <Stack.Screen
            name="googleverificationphone"
            component={GoogleVerificationPhone}
          />
          <Stack.Screen name="register" component={Register} />
        </>
      ) : null}

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
        }}
      />

      {/*----------------------------- Student part starts --------------------------------*/}

      <Stack.Screen
        name="studentlist"
        component={StudentList}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ସୂଚନା',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="studentregister"
        component={StudentRegister}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ପଞ୍ଜୀକରଣ',
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
                color={Color.white}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="studentAttendance"
        component={StudentAttendance}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ଉପସ୍ଥାନ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="attendancelist"
        component={Attendancelist}
        options={{
          title: ' 7 ଦିନର ଉପସ୍ଥାନ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="studentassessment"
        component={StudentAssessmentPage}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="studentlistpage"
        component={StudentListPage}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
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
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="techmodule"
        component={TechModule}
        options={{
          title: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="21st"
        component={TechModule}
        options={{
          title: 'ଏକବିଂଶ ଶତାବ୍ଦୀ ଓ କୌଶଳ',
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
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SelectFromMultiple"
        component={SelectFromMultipleGames}
        options={{
          title: 'Select From Multiple',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />

      <Stack.Screen
        name="RearrangeWords"
        component={RearrangeWords}
        options={{
          title: 'Re-arrange Words',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="Puzzles"
        component={Puzzles}
        options={{
          title: 'Puzzles Words',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="MatchingExercises"
        component={MatchingExercises}
        options={{
          title: 'MatchingExercises',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
          // headerShown: false,
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          title: 'ମତାମତ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerLeft: false,
          // headerShown: false,
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="dictionary"
        component={Dictionary}
        options={{
          title: 'ଅଭିଧାନ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="books"
        component={Books}
        options={{
          title: 'ଦସ୍ତାବିଜ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
        options={{
          // headerTitleAlign: 'center',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Mopragati"
        component={Mopragati}
        options={{
          title: 'ମୋ ପ୍ରଗତି ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerLeft: false,
          // headerShown: false,
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="leaderboard"
        component={Leaderboard}
        options={{
          title: 'LEADERBOARD',
          headerTitleStyle: {
            fontFamily: FontFamily.poppinsMedium,
          },
        }}
      />

      <Stack.Screen
        name="myachievement"
        component={Myachivement}
        options={{
          title: 'REWARDS',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
          headerShown: false,
          title: 'Assignment Review',
          headerTitleStyle: {
            // fontWeight: '700',
            textTransform: 'uppercase',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
    </Stack.Navigator>
  );
};

export default StackNavigator;
