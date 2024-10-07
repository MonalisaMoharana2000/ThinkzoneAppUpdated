import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Button,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StudentList from '../Pages/StudentList';
import StudentAttendance from '../Pages/StudentAttendance';
import CallList from '../Pages/CallList';
import StudentRegister from '../Pages/StudentRegister';
import TeacherBaseline from '../Pages/TeacherBaseline';
import TeacherBaselineReviewPage from '../Pages/TeacherBaselineReviewPage';
// import ReviewQuiz from '../Pages/ReviewQuiz';
import Home from '../Pages/Home';

import AttendancemodalList from '../Pages/AttendancemodalList';
import CallResponse from '../Pages/CallResponse';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ecactivity from '../Pages/Ecactivity';
import Pgeactivity from '../Pages/Pgeactivity';

import Pgecontentdetails from '../Pages/Pgecontentdetails';
import EcContent from '../Pages/EcContent';

import Books from '../Pages/Books';
import Payment from '../Pages/Payment';
import Dictionary from '../Pages/Dictionary';
import FlnContent from '../Pages/FlnContent';
import About from '../Pages/About';
import FlnContentView from '../Pages/FlnContentView';

import Booklist from '../Pages/Booklist';
import BookView from '../Pages/BookView';

import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

import Profile from '../Pages/Profile';
import EditProfile from '../Pages/EditProfile';

import AudioVideoAcces from '../Pages/AudioVideoAcces';

import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Attendancelist from '../Pages/Attendancelist';
import PaymentDetails from '../Pages/PaymentDetails';
import Leaderboard from '../Pages/Leaderboard';
import Myachivement from '../Pages/Myachivement';

import RewardTransaction from '../Pages/RewardTransaction';
import Auro from '../Pages/Auro';
import Feedback from '../Pages/Feedback';
import TechModule from '../Pages/TechModule';
import QuickIns from '../Pages/QuickIns';
import TechContent from '../Pages/TechContent';
import TechAssignment from '../Pages/TechAssignment';
import TechReviewQuiz from '../Pages/TechReviewQuiz';
import {useSelector} from 'react-redux';
import CommonMonthlyPage from '../Pages/CommonMonthlyPage';
import CommonMonthlyQuiz from '../Pages/CommonMonthlyQuiz';
import CommonMonthlyReview from '../Pages/CommonMonthlyReview';
import StudentAssessmentPage from '../Pages/StudentAssessmentPage';
import StudentAssessmentDetails from '../Pages/StudentAssessmentDetails';
import StudentsActivitityQuiz from '../Pages/StudentsActivitityQuiz';
import CommunityEngagementContentView from '../Pages/CommunityEngagementContentView';
import CommunityEngagementPage from '../Pages/CommunityEngagementPage';
import Certificate from '../Pages/Certificate';
import StudentListPage from '../Pages/StudentListPage';
import Games from '../Pages/Games';
import DragAndDrop from '../components/DragAndDrop';
import SwipeCard from '../components/SwipeCards';
import ClickablePopUps from '../components/ClickablePopUps';
import HotSpot from '../components/HotSpot';
import MatchingExercises from '../components/MatchingExercises';
import DivergentPaths from '../components/DivergentPaths';
import ReviewQuizPage from '../Pages/ReviewQuizPage';
import Notification from '../Pages/Notification';
import NotificationPage from '../Pages/NotificationPage';
import StudentReview from '../Pages/StudentReview';
import StudentProgressReport from '../Pages/StudentProgressReport';
import IntroQuizPage from '../Pages/IntroQuizPage';
import TrainingModulesPage from '../Pages/TrainingModulesPage';
import TechAccoed from '../components/TechAccoed';
import TrainingSubmodulePage from '../Pages/TrainingSubmodulePage';
import DragAndDrops from '../Pages/DragAndDrop';
import StudentListActivity from '../Pages/StudentListActivity';
import CommonMonthlyReviewPage from '../Pages/CommonMonthlyReviewPage';
import Faq from '../Pages/Faq';
import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
import AmazonGiftVoucherScreen from '../components/AmazonGiftVoucherScreen';
import Mopragati from '../Pages/Mopragati';
import {upperCase} from 'lodash';
import RegisterPasscode from '../Pages/RegisterPasscode';
import Login from '../Pages/Login';
import AssignmentPreview from '../components/AssignmentPreview';
import DownloadedData from '../Pages/DownloadedData';
import DownloadDetails from '../Pages/DownloadDetails';
import FillInTheBlank from '../components/FillInTheBlanks';
import DragWords from '../Pages/DragWords';
import RearranageWord from '../Pages/RearranageWord';
import SelectFromMultiple from '../Pages/SelectFromMultipleGames';
import SelectFromMultipleGames from '../Pages/SelectFromMultipleGames';

const Stack = createStackNavigator();

const OtherStackNavigation = ({navigation, title}) => {
  const usertype = useSelector(
    state => state.userdata.user?.resData[0].usertype,
  );

  // console.log('usertype---->', usertype);
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        topBar: {
          backButton: {},
        },
        headerStyle: {
          backgroundColor: Color.royalblue,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          // fontWeight: 'bold',
          fontFamily: FontFamily.poppinsSemibold,
          letterSpacing: 1,
          fontSize: 25,
          alignItems: 'center',
        },
        // headerLeft:()=>(
        //   <AntDesign name="arrowleft" size={23} color="white" />
        // )
      }}>
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
          title: 'ThinkZone',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}>
              {/* <Image
                source={require('../assets/Photos/logo1.png')}
                style={styles.logo}
              /> */}
              {/* <Entypo
                style={{marginLeft: 15}}
                name="menu"
                size={25}
                color={Color.white}
                onPress={() => {
                  navigation.openDrawer();
                }}
              /> */}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Entypo
              name="bell"
              size={25}
              color={Color.white}
              onPress={
                () =>
                  ToastAndroid.show(
                    'This Module is under maintenance. It will be LIVE soon.',
                    ToastAndroid.SHORT,
                  )
                // navigation.navigate('audiovideo', {
                //   type: 'audiovideo',
                // })
              }
            />
          ),
        }}
      />

      {/* <Stack.Screen
        name="login"
        component={Login}
        options={{
          title: 'Edit Profile',
          headerShown: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            // letterSpacing: 2,
          },
        }}
      /> */}

      {/* Student Module */}
      <Stack.Screen
        name="studentlist"
        component={StudentList}
        options={{
          // headerShown: false,
          title: 'ଶିକ୍ଷାର୍ଥୀ ସୂଚନା',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="studentregister"
        component={StudentRegister}
        options={{
          // headerShown: false,
          title: 'ଶିକ୍ଷାର୍ଥୀ ପଞ୍ଜୀକରଣ',
          // headerLeft: false,
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
              {/* <Image
                source={require('../assets/Photos/logo1.png')}
                style={styles.logo}
              /> */}
              <AntDesign
                style={{marginLeft: 15}}
                name="arrowleft"
                size={25}
                color={Color.white}
              />
            </TouchableOpacity>
          ),
          headerTitleStyle: {
            // fontWeight: '700',
            // fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="studentAttendance"
        component={StudentAttendance}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ଉପସ୍ଥାନ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="attendanceList"
        component={Attendancelist}
        options={{
          title: ' 7 ଦିନର ଉପସ୍ଥାନ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="calllist"
        component={CallList}
        options={{
          title: 'Call List',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="teacherbaselinereviewpage"
        component={TeacherBaselineReviewPage}
        options={{title: 'Quiz Review'}}
      />
      <Stack.Screen
        name="teacherBaseline"
        component={TeacherBaseline}
        options={{
          headerShown: false,
          title: 'ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ',
        }}
      />
      <Stack.Screen
        name="attendancelist"
        component={AttendancemodalList}
        options={{title: 'ଉପସ୍ଥାନ ସୂଚନା'}}
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
        name="callresponseList"
        component={CallResponse}
        options={{
          title: 'Call Response',
          headerTitleStyle: {
            // fontWeight: '700',
            textTransform: 'uppercase',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      {/* Teacher Modules */}
      <Stack.Screen
        name="commonmonthlypage"
        component={CommonMonthlyPage}
        options={{
          title: 'ନିଜ ବୁଝାମଣା ଯାଞ୍ଜ କରନ୍ତୁ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="commonmonthlyquiz"
        component={CommonMonthlyQuiz}
        options={{
          title: 'ନିଜ ବୁଝାମଣା ଯାଞ୍ଜ କରନ୍ତୁ',
          headerLeft: false,
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="commonmonthlyquizreview"
        component={CommonMonthlyReview}
        options={{
          title: 'ମୋ ପ୍ରଗତି',
          headerLeft: false,
          headerShown: false,
        }}
      /> */}
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
      {/* <Stack.Screen
        name="quizreviewpage"
        component={ReviewQuiz}
        options={{
          title: 'Review Quiz',
          headerLeft: false,
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name="studentassessment"
        component={StudentAssessmentPage}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerLeft: false,
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="studentreview"
        component={StudentReview}
        options={{
          headerShown: false,
          title: 'Student Review',
          // headerLeft: false,
          // headerShown: false,
        }}
      />

      <Stack.Screen
        name="studentlistpage"
        component={StudentListPage}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerLeft: false,
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="studentassessmentdetails"
        component={StudentAssessmentDetails}
        options={{
          // title: 'ଶିକ୍ଷାର୍ଥୀ ବିକାଶ',
          // headerLeft: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StudentsActivitityQuiz"
        component={StudentsActivitityQuiz}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ସୂଚନା',
          headerTitleAlign: 'left',
          // headerLeft: false,
          fontFamily: FontFamily.poppinsMedium,
          // headerShown: false,
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="StudentsListActivity"
        component={StudentListActivity}
        options={{
          title: 'STUDENT ACTIVITY',
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
        name="techcontent"
        component={TechContent}
        options={{
          // title: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="techAssignment"
        component={TechAssignment}
        options={{
          title: 'TechAssignment',
          headerLeft: false,
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
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      {/* <Stack.Screen name="fln" component={Fln} options={{title: 'FLN'}} /> */}
      <Stack.Screen
        name="flncontent"
        component={FlnContent}
        options={{
          title: 'FLN ଗତିବିଧି',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="flncontentview"
        component={FlnContentView}
        options={{headerShown: false, headerLeft: false}}
      />

      <Stack.Screen
        name="communityengagementpage"
        component={CommunityEngagementPage}
        options={{
          title: 'ଗୋଷ୍ଠୀ ସମ୍ପୃକ୍ତିକରଣ',
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
        name="Content"
        component={Pgecontentdetails}
        options={{title: 'ପ୍ରାଥମିକ ଗତିବିଧି', headerShown: false}}
      />

      <Stack.Screen
        name="TrainingSubmodulePage"
        component={TrainingSubmodulePage}
        options={{title: 'SUBMODULE', headerShown: false}}
      />
      {/* Other Modules */}
      {/* <Stack.Screen name="NSDC" component={NSDC} options={{title: 'NSDC'}} /> */}

      <Stack.Screen
        name="payment"
        component={Payment}
        options={{
          title: 'ଦେୟ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
        name="booklist"
        component={Booklist}
        options={{
          title: 'BOOKLIST',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="bookview"
        component={BookView}
        options={{
          title: 'BOOKVIEW',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
        name="profile"
        component={Profile}
        options={{title: 'profile', headerShown: false}}
      />
      <Stack.Screen
        name="editprofile"
        component={EditProfile}
        options={{
          title: 'EditProfile',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Auro"
        component={Auro}
        options={{
          title: 'Auro Scholar',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Certificate"
        component={Certificate}
        options={{
          title: 'Certificate',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
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
        name="audiovideo"
        component={AudioVideoAcces}
        options={{
          title: 'Audio Assessment',
          headerLeft: () => (
            <AntDesign
              name="arrowleft"
              color="white"
              size={27}
              style={{marginLeft: 15}}
              onPress={() => {
                Alert.alert(
                  'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
                  'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?  ',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () => navigation.navigate('home'),
                      style: 'default',
                    },
                  ],
                );
              }}
            />
          ),
        }}
      />
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
        name="downloadfile"
        component={DownloadedData}
        options={{
          title: 'Off-line',
          // headerShown: false,
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="downloadfiledetails"
        component={DownloadDetails}
        options={{
          title: 'Off-line',
          // headerShown: false,
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
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
        // options={{
        //   title: 'INTRO QUIZ ',

        //   headerLeft: false,
        //   // headerShown: false,
        //   // headerTitleAlign: 'center',

        //   headerTitleStyle: {
        //     // fontWeight: '700',

        //     headerTitleAlign: 'center',
        //     fontFamily: FontFamily.poppinsMedium,
        //     // letterSpacing: 2,
        //   },
        // }}
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
      {/* <Stack.Screen
        name="techmodule"
        component={TechModule}
        options={{
          title: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      /> */}
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
      {/* <Stack.Screen
        name="DragAndDrop"
        component={DragAndDrop}
        options={{
          title: 'Drag And Drop',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      /> */}
      <Stack.Screen
        name="DragAndDrop"
        component={DragAndDrops}
        options={{
          title: 'Drag And Drop',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SwipeCards"
        component={SwipeCard}
        options={{
          title: 'Swipe Cards',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ClickablePopups"
        component={ClickablePopUps}
        options={{
          title: 'Clickable Popups',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Hotspot"
        component={HotSpot}
        options={{
          title: 'Clickable Hotspot',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="MatchingExercises"
        component={MatchingExercises}
        options={{
          title: 'Matching Exercises',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="FillInTheBlanks"
        component={FillInTheBlank}
        options={{
          title: 'Fill In The Blanks',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
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
        name="DivergentPaths"
        component={DivergentPaths}
        options={{
          title: 'Divergent Paths',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
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
        name="DragWords"
        component={DragWords}
        options={{
          title: 'Rearrange',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="RearrangeWords"
        component={RearranageWord}
        options={{
          title: 'Puzzle',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
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
        name="StudentProgressReport"
        component={StudentProgressReport}
        options={{
          title: 'Student Progress Report',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
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
        name="amazongiftvoucherscreen"
        component={AmazonGiftVoucherScreen}
        options={{
          title: 'Gift Voucher',
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
    </Stack.Navigator>
  );
};

export default OtherStackNavigation;

const styles = StyleSheet.create({
  logo: {
    width: 55,
    height: 55,
    marginLeft: 5,
  },
});
