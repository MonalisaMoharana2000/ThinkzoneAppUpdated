import React from 'react';
import {Text, View, Image, Platform, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Pages/Home';
import Profile from '../Pages/Profile';
import Leaderboard from '../Pages/Leaderboard';
import Myachivement from '../Pages/Myachivement';
import {Color, FontFamily} from '../GlobalStyle';

const Tab = createBottomTabNavigator();
const {height, width} = Dimensions.get('window');

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 0,
          width: width - 5,
          height: 70,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowRadius: 5,
          elevation: 5,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/Image/home.png')}
                style={{
                  width: 32,
                  height: 32,
                  tintColor: focused ? Color.royalblue : 'gray',
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? Color.royalblue : 'gray',
                  marginTop: 5,
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/Image/users.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? Color.royalblue : 'gray',
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? Color.royalblue : 'gray',
                  marginTop: 5,
                }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{
          title: 'Leaderboard',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/Image/ranking.png')}
                style={{
                  width: 32,
                  height: 32,
                  tintColor: focused ? Color.royalblue : 'gray',
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? Color.royalblue : 'gray',
                  marginTop: 5,
                }}>
                Leaderboard
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Myachivement"
        component={Myachivement}
        options={{
          title: 'Myachivement',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/Image/cup.png')}
                style={{
                  width: 32,
                  height: 32,
                  tintColor: focused ? Color.royalblue : 'gray',
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? Color.royalblue : 'gray',
                  marginTop: 5,
                }}>
                Rewards
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
