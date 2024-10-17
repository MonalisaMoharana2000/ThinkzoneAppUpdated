import React, {useRef, useState, useEffect} from 'react';
import {Text, View, Image, Platform, Dimensions, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Pages/Home';
import Profile from '../Pages/Profile';
import Leaderboard from '../Pages/Leaderboard';
import Myachivement from '../Pages/Myachivement';
import {Color, FontFamily} from '../GlobalStyle';
import API from '../environment/Api';
import {useSelector} from 'react-redux';
const Tab = createBottomTabNavigator();
const {height, width} = Dimensions.get('window');

const BottomTabNavigator = () => {
  const user = useSelector(state => state.UserSlice.user[0]);
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const [selectedTab, setSelectedTab] = useState('Home');
  const [maintainanceStatus, setMaintainanceStatus] = useState({});
  const [maintainanceModal, setmaintainanceModal] = useState(false);

  function getWidth() {
    let width = Dimensions.get('window').width;
    width = width - 56;
    return width / 5;
  }

  useEffect(() => {
    const positionMap = {
      Home: 0,
      Profile: getWidth() * 1.5,
      Leaderboard: getWidth() * 3.1,
      Rewards: getWidth() * 4.4,
    };

    Animated.spring(tabOffsetValue, {
      toValue: positionMap[selectedTab],
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  const resetToHome = navigation => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };
  const handleBackGesture = ({navigation, route}) => {
    if (route.name !== 'Home') {
      Animated.spring(tabOffsetValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if (route.name == 'Rewards') {
      Animated.spring(tabOffsetValue, {
        toValue: getWidth() * 4.4,
        useNativeDriver: true,
      }).start();
    } else if (route.name == 'Profile') {
      Animated.spring(tabOffsetValue, {
        toValue: getWidth() * 1.5,
        useNativeDriver: true,
      }).start();
    } else if (route.name == 'Leaderboard') {
      Animated.spring(tabOffsetValue, {
        toValue: getWidth() * 3.1,
        useNativeDriver: true,
      }).start();
    }
  };
  const handleTabGesture = (e, selectedTabName) => {
    setSelectedTab(selectedTabName);
    const positionMap = {
      Home: 0,
      Profile: getWidth() * 1.5,
      Leaderboard: getWidth() * 3.1,
      Rewards: getWidth() * 4.4,
    };
    Animated.spring(tabOffsetValue, {
      toValue: positionMap[selectedTabName],
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    API.get(`getMaintainanceStatus/${user?.usertype}`)
      .then(response => {
        setMaintainanceStatus(response.data);
        setmaintainanceModal(response.data?.overallApp);
      })
      .catch(err => {
        console.error('Failed to fetch maintenance status:', err);
      });
  }, []);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            marginHorizontal: 0,
            width: width - 0.5,
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
          listeners={({navigation, route}) => ({
            // tabPress: () => resetToHome(navigation),
            // Onpress Update....
            tabPress: e => {
              // console.log('Tab Pressed:', route.name);
              // resetToHome(navigation);
              handleTabGesture(e, 'Home');
            },
            blur: e => {
              // console.log('Tab Blurred:', route.name);
              handleBackGesture({navigation, route});
            },
          })}
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
          listeners={({navigation, route}) => ({
            // Onpress Update....
            tabPress: e => {
              // console.log('e2--->', e.target);
              // Animated.spring(tabOffsetValue, {
              //   toValue: getWidth() * 1.5,
              //   useNativeDriver: true,
              // }).start();
              handleTabGesture(e, 'Profile');
              setSelectedTab('Profile');
            },
            blur: e => {
              handleBackGesture({navigation, route});
            },
          })}
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
          listeners={({navigation, route}) => ({
            // Onpress Update....
            tabPress: e => {
              // console.log('e3--->', e.target);
              // Animated.spring(tabOffsetValue, {
              //   toValue: getWidth() * 3.1,
              //   useNativeDriver: true,
              // }).start();
              handleTabGesture(e, 'Leaderboard');
              setSelectedTab('Leaderboard');
            },
            blur: e => {
              handleBackGesture({navigation, route});
            },
          })}
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
          listeners={({navigation, route}) => ({
            // Onpress Update....
            tabPress: e => {
              // console.log('e4--->', e.target);
              // Animated.spring(tabOffsetValue, {
              //   toValue: getWidth() * 4.4,
              //   useNativeDriver: true,
              // }).start();
              handleTabGesture(e, 'Rewards');
              setSelectedTab('Rewards');
            },
            blur: e => {
              handleBackGesture({navigation, route});
            },
          })}
        />
      </Tab.Navigator>
      <Animated.View
        style={{
          width:
            selectedTab === 'Leaderboard' ? getWidth() + 15 : getWidth() - 7, // Increase width for Leaderboard
          height: 5,
          backgroundColor: Color.royalblue,
          position: 'absolute',
          bottom: 4, // Moved it lower to display below the text
          left: selectedTab === 'Leaderboard' ? 0 : 20, // Adjust 'left' for Leaderboard
          borderRadius: 20,
          transform: [{translateX: tabOffsetValue}],
        }}></Animated.View>
    </>
  );
};

export default BottomTabNavigator;
