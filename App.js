// App.js
import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDataThunk } from './src/redux_toolkit/features/users/UserThunk';
import messaging from '@react-native-firebase/messaging';
import {
  PERMISSIONS,
  RESULTS,
  requestNotifications,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.data);
  console.log('User Data:', user);

  useEffect(() => {
    dispatch(fetchUserDataThunk());
  }, [dispatch]);

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

  const requestUserPermissions = async () => {
    try {
      const permissionsToRequest = [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      ];

      if (Platform.OS === 'android') {
        const { status } = await requestNotifications(['alert', 'badge', 'sound']);
        console.log('Notification permission status:', status);

        if (status !== RESULTS.GRANTED) {
          console.warn('Notification permission denied or set to never ask again');
          openSettings();
        }
      }

      const results = await requestMultiple(permissionsToRequest);
      console.log('Permission results:', results);

      let allPermissionsGranted = true;

      for (const permission in results) {
        if (results[permission] !== RESULTS.GRANTED) {
          console.warn(`Permission ${permission} denied`);
          allPermissionsGranted = false;

          if (results[permission] === RESULTS.NEVER_ASK_AGAIN) {
            openSettings();
            break;
          }
        }
      }

      if (allPermissionsGranted) {
        console.log('All permissions granted.');
        initializePushNotification();
      } else {
        console.warn('Some permissions were denied.');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      handleRequestError(error);
    }
  };

  const initializePushNotification = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      Alert.alert('New Notification', remoteMessage.notification?.title, [
        { text: 'OK' },
      ]);
    });
  };

  const handleRequestError = (error) => {
    if (error.response?.status === 413) {
      Alert.alert('The entity is too large!');
    } else if (error.response?.status === 504) {
      Alert.alert('Gateway Timeout: The server is not responding!');
    } else if (error.response?.status === 500) {
      Alert.alert('Internal Server Error: Something went wrong on the server.');
    } else {
      Alert.alert('An error occurred:', error.message);
    }
  };

  useEffect(() => {
    requestUserPermissions();
  }, []);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state due to notification:', remoteMessage.notification);
        }
      });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background state due to notification:', remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      Alert.alert('Notification', remoteMessage.notification?.body, [
        { text: 'OK' },
      ]);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
