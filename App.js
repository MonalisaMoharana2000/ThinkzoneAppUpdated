// App.js
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import StackNavigator from './src/navigation/StackNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataThunk} from './src/redux_toolkit/features/users/UserThunk';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.user);
  console.log('====================================user', user);

  useEffect(() => {
    dispatch(fetchUserDataThunk());
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
