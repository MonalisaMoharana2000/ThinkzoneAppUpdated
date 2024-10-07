import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Pages/HomeScreen';
import Home from '../Pages/Home';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{title: 'Home', headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
