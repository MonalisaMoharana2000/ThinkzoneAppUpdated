/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store';
import messaging from '@react-native-firebase/messaging';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (AppState.currentState === 'background') {
  }
  console.log('Message handled in the background! index', remoteMessage);
});
const Root = () => (
  <GestureHandlerRootView style={{flex: 1}}>
    <Provider store={store}>
      <App />
    </Provider>
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => Root);
