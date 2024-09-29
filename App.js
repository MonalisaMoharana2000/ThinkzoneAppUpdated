// App.js
import React, {useEffect} from 'react';
import {LogBox, Text} from 'react-native';
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
      <Text>App</Text>
    </>
  );
};

export default App;
