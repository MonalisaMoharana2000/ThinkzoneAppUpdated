import React, {useEffect} from 'react';
import {Platform, Alert, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import StackNavigator from './src/navigation/StackNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataThunk} from './src/redux_toolkit/features/users/UserThunk';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
