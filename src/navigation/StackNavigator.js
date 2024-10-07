import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import {TouchableOpacity} from 'react-native';
import {Color} from '../GlobalStyle';
import StudentListPage from '../Pages/StudentListPage';
import StudentAssessmentDetails from '../Pages/StudentAssessmentDetails';
import TechModule from '../Pages/TechModule';
import CommonMonthlyReviewPage from '../Pages/CommonMonthlyReviewPage';

import TrainingSubmodulePage from '../Pages/TrainingSubmodulePage';
import Certificate from '../Pages/Certificate';
import TechContent from '../Pages/TechContent';
import TechAssignment from '../Pages/TechAssignment';
import CommonMonthlyPage from '../Pages/CommonMonthlyPage';
import CommonMonthlyQuiz from '../Pages/CommonMonthlyQuiz';
const Stack = createNativeStackNavigator();

const StackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Page1" component={Page1} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Page3" component={Page3} />

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
      <Stack.Screen name="Home" component={BottomTabNavigator} />

      {/*---------------------------------------------------- Student part starts-------------------------------------------------------- */}

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
        name="attendancelist"
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

      {/*----------------------------------------------------------------------- Student part ends ----------------------------------------------------------------*/}
    </Stack.Navigator>
  );
};

export default StackNavigator;
