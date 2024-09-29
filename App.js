// App.js
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserDataThunk} from './src/redux_toolkit/features/users/UserThunk';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.UserSlice.data);
  console.log('====================================user', user);

  useEffect(() => {
    dispatch(fetchUserDataThunk());
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
