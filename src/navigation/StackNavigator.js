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
import Certificate from '../Pages/Certificate';
import TechContent from '../Pages/TechContent';
import TechAssignment from '../Pages/TechAssignment';
import CommonMonthlyPage from '../Pages/CommonMonthlyPage';
import CommonMonthlyQuiz from '../Pages/CommonMonthlyQuiz';
import Profile from '../Pages/Profile';
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
    <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
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
          headerLeft: false,
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

      {/* traioning part ends here */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
