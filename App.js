import React, {useEffect} from 'react';
import {Platform, Alert, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import StackNavigator from './src/navigation/StackNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataThunk} from './src/redux_toolkit/features/users/UserThunk';
import messaging from '@react-native-firebase/messaging';
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.user);
  console.log('User:', user);

  // useEffect(() => {
  //   // Initialize Firebase
  //   const firebaseConfig = {
  //     type: 'service_account',
  //     project_id: 'teacher-push-notification',
  //     private_key_id: '47d540da783e45b50a0e684824dc4b0fb1ab599b',
  //     private_key:
  //       '-----BEGIN PRIVATE KEY-----\n...your private key...\n-----END PRIVATE KEY-----\n',
  //     client_email:
  //       'firebase-adminsdk-oqmgg@teacher-push-notification.iam.gserviceaccount.com',
  //     client_id: '102257215925186752402',
  //     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  //     token_uri: 'https://oauth2.googleapis.com/token',
  //     auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  //     client_x509_cert_url:
  //       'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-oqmgg%40teacher-push-notification.iam.gserviceaccount.com',
  //   };

  //   if (!firebase.apps.length) {
  //     firebase.initializeApp(firebaseConfig);
  //   }

  //   // Request permission for notifications
  //   const requestUserPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //     }
  //   };

  //   requestUserPermission();

  //   // Get FCM token
  //   const getFCMToken = async () => {
  //     const token = await messaging().getToken();
  //     console.log('FCM Token:', token);
  //     // Here you can save the token to your server if needed
  //   };

  //   getFCMToken();

  //   // Handle incoming messages
  //   const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   // Handle background messages
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //   });

  //   // Clean up the listener on unmount
  //   return () => {
  //     unsubscribeOnMessage();
  //   };
  // }, [dispatch]);

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('token--->', token);
    // Alert.alert(token);
    const smallIcon =
      Platform.OS === 'android'
        ? 'ic_notification' // Replace with the actual drawable resource name for Android
        : 'ic_notification';
    const largeIcon =
      Platform.OS === 'android'
        ? 'ic_notification' // Replace with the actual drawable resource name for Android
        : 'ic_notification';
    // storeage.storeValue('fcm_token', token, smallIcon, largeIcon);

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging().sendMessage({
        to: token,
        notification: {
          android: {
            // smallIcon: smallIcon,
            largeIcon: largeIcon,
          },
        },
      });
      // console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging().sendMessage({
        to: token,
        notification: {
          android: {
            // smallIcon: smallIcon,
            // largeIcon: largeIcon,
          },
        },
      });
      console.log('Authorization Status', authStatus);
    }
    showNotification();
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then(token => {
          // console.log('token------------------->', token);
        });
    } else {
      console.log('Failed token status : ', authStatus);
    }

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.navigateto);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('notification', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
