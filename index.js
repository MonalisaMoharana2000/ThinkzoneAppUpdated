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
messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (AppState.currentState === 'background') {
  }
  console.log('Message handled in the background! index', remoteMessage);
});
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// Register the app component
AppRegistry.registerComponent(appName, () => Root);
