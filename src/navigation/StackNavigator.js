import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StudentAssessmentPage from '../pages/StudentAssessmentPage';
import StudentAttendance from '../pages/StudentAttendance';
import Attendancelist from '../pages/Attendancelist';
import BottomTabNavigator from './BottomTabNavigator';
import StudentRegister from '../pages/StudentRegister';
import {FontFamily} from '../GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentList from '../pages/StudentList';
import {TouchableOpacity, ActivityIndicator, View} from 'react-native';
import {Color} from '../GlobalStyle';
import StudentListPage from '../pages/StudentListPage';
import StudentAssessmentDetails from '../pages/StudentAssessmentDetails';
import Page1 from '../pages/Page1';
import Page2 from '../pages/Page2';
import Page3 from '../pages/Page3';
import LoginScreen from '../pages/LoginScreen';
import Faq from '../pages/Faq';
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
import PhoneVerificationGoogle from '../pages/PhoneVerificationGoogle';
import Register from '../pages/Register';
import RegisterPasscode from '../pages/RegisterPasscode';
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
          <Stack.Screen name="Page2" component={Page2} />
          <Stack.Screen name="Page3" component={Page3} />

          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="registerpasscode" component={RegisterPasscode} />
        </>
      ) : null}

      <Stack.Screen name="Home" component={BottomTabNavigator} />
      {/*---------------------------------------------------- Student part starts-------------------------------------------------------- */}
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
      {/*----------------------------------------------------------------------- Student part ends ----------------------------------------------------------------*/}
      {/*------------Student Activities------------------------------- */}
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
          },
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
    </Stack.Navigator>
  );
};

export default StackNavigator;
