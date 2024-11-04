// App.js
import React, {useEffect} from 'react';
import {Platform, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataThunk} from './src/redux_toolkit/features/users/UserThunk';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

const App = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.UserSlice.data);
  console.log('User Data:', user);

  useEffect(() => {
    dispatch(fetchUserDataThunk());
  }, []);

  // useEffect(() => {
  //   requestUserPermission();

  //   // Handle foreground notifications
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('Foreground notification:', remoteMessage);
  //     // Check if `data` is available and includes `navigateto`
  //     const navigateto = remoteMessage.data?.navigateto;
  //     if (navigateto) {
  //       Alert.alert(
  //         remoteMessage.notification?.title || 'Notification',
  //         remoteMessage.notification?.body || 'You have received a new message',
  //         [
  //           {
  //             text: 'Go to Page',
  //             onPress: () => navigation.navigate(navigateto), // Navigate based on `navigateto`
  //           },
  //           {text: 'Dismiss', style: 'cancel'},
  //         ],
  //       );
  //     }
  //   });

  //   // Handle background state notifications
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage,
  //     );
  //     const navigateto = remoteMessage.data?.navigateto;
  //     if (navigateto) {
  //       navigation.navigate(navigateto);
  //     }
  //   });

  //   // Handle quit state notifications
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage,
  //         );
  //         const navigateto = remoteMessage.data?.navigateto;
  //         if (navigateto) {
  //           navigation.navigate(navigateto);
  //         }
  //       }
  //     });

  //   // Set a background message handler
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //     const navigateto = remoteMessage.data?.navigateto;
  //     if (navigateto) {
  //       navigation.navigate(navigateto);
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted:', authStatus);
    } else {
      console.log('Notification permission denied');
    }
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // Optionally, you could save this token to your backend
  };

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
