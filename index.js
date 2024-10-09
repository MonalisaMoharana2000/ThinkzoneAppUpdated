/**
 * @format
 */

import {AppRegistry, AppState} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store';
import messaging from '@react-native-firebase/messaging';
import {getFcmMessage} from './src/redux_toolkit/features/fcm/FcmSlice'; // Import the async thunk

// Set the background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Check if the app is in the background state
  if (AppState.currentState === 'background') {
    // Dispatch the async thunk to handle the message
    await store.dispatch(getFcmMessage(remoteMessage.data));
  }
  console.log('Message handled in the background!', remoteMessage);
});

// Create the Root component with Redux Provider
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// Register the app component
AppRegistry.registerComponent(appName, () => Root);
