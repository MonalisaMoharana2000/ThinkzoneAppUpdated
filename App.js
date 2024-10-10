// App.js
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataThunk} from './src/redux_toolkit/features/users/UserThunk';
import messaging from '@react-native-firebase/messaging';
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.data);
  console.log('====================================user', user);

  useEffect(() => {
    dispatch(fetchUserDataThunk());
  }, []);

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
    <>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
