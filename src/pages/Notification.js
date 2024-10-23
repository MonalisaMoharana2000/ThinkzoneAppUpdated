import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  PanResponder,
  AppState,
  Dimensions,
  Animated,
} from 'react-native';
import moment from 'moment';

import React, {useEffect, useState, useRef} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading from '../components/Loading';
import {useFocusEffect} from '@react-navigation/native';
import NoNotifyImg from '../components/NoNotifyImg';
import ListItemScroll from '../components/ListItemScroll';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Notification = ({navigation, route}) => {
  const appState = useRef(AppState.currentState);
  const teacherdata = useSelector(state => state.UserSlice.user);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();

  const {userid = ''} = teacherdata?.[0] || {};

  //   const skillName = content[0]?.skillName;
  console.log('teacherdata----------------->', userid);

  const [isLoading, setIsloading] = useState(false);
  // const user = useSelector(state => state.userSlice.user);
  const dispatch = useDispatch();

  const [allNotification, setAllNotification] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setIsloading(true);
      try {
        const fetchData = async () => {
          const response = await API.get(`getAllNotifs/${userid}`);
          console.log('response---->', response.data);
          setAllNotification(response.data);
          setIsloading(false);
        };

        fetchData();
      } catch (error) {
        if (error.response.status === 413) {
          console.log('error is---------------->', error);
          Alert.alert('The entity is too large !');
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
          Alert.alert('Gateway Timeout: The server is not responding!');
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Error is------------------->:', error);
        }
      }
    }, []),
  );

  const handleViewStatusUpdate = async item => {
    navigation.navigate('notificationPage', {data: item});
  };

  const handleDelete = item => {
    // console.log('item--->', item);
    Alert.alert('ଧ୍ୟାନ ଦିଅନ୍ତୁ!', 'Do You want to Delete this message?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'default',
      },
      {
        text: 'Ok',
        onPress: () => deletePermanently(item.notifId),
        style: 'default',
      },
    ]);

    // /deleteNotif/:notifId/:userid
  };

  const deletePermanently = async notifId => {
    // console.log('item--->', item);
    setIsloading(true);
    try {
      const response = await API.delete(`deleteNotif/${notifId}/${userid}`);
      // console.log('delete response---->', response.data, response.status);

      if (response.status === 200) {
        // Update the state to remove the deleted item
        setAllNotification(prevNotifications =>
          prevNotifications.filter(
            notification => notification.notifId !== notifId,
          ),
        );
        setIsloading(false);
      }
    } catch (error) {
      if (error.response.status === 413) {
        console.log('error is---------------->', error);
        setIsloading(false);
        Alert.alert('The entity is too large !');
      } else if (error.response.status === 504) {
        console.log('Error is--------------------->', error);
        setIsloading(false);
        Alert.alert('Gateway Timeout: The server is not responding!');
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
        setIsloading(false);
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
      } else {
        console.error('Error is------------------->:', error);
        setIsloading(false);
      }
    }
  };
  // const viewRef = useRef(null);

  // useEffect(() => {
  //   const animateView = () => {
  //     viewRef.current.bounceIn(1000).then(() => {
  //       // After the animation completes, you can trigger it again.
  //       animateView();
  //     });
  //   };

  //   animateView();
  // }, []);

  return (
    <ScrollView>
      <View>
        {isLoading ? (
          <Loading />
        ) : allNotification.length > 0 ? (
          <FlatList
            data={allNotification}
            keyExtractor={item => item.notifId}
            renderItem={({item, index}) => {
              const createdOn = moment(item.createdOn);
              const relativeTime = createdOn.fromNow();

              return (
                <ListItemScroll
                  style={styles.card}
                  key={item.notifId}
                  title={item.title}
                  subTitle={item.body}
                  time={relativeTime}
                  viewStatus={item.viewStatus}
                  onPress={() => handleViewStatusUpdate(item)}
                  call={
                    <>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <View
                          style={[
                            //styles.card,
                            {
                              margin: 10,
                            },
                          ]}>
                          <Text
                            style={{
                              color: 'white',

                              alignSelf: 'flex-end',
                              // bottom: 0,
                              justifyContent: 'center',
                              alignItems: 'center',
                              top: '120%',
                              right: 5,
                            }}>
                            <MaterialIcons
                              name="delete"
                              size={28}
                              color={'#eb3875'}
                              style={{top: '20%'}}
                            />
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  }
                />
              );
            }}
          />
        ) : (
          <NoNotifyImg />
        )}
      </View>
    </ScrollView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  card: {
    width: windowWidth * 0.96,
    paddingBottom: 50,
    borderRadius: 10,
    top: 10,
    backgroundColor: Color.ghostwhite,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 10,
  },
  header: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
    top: 20,
    textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
    fontWeight: '900',
  },
  desc: {
    fontSize: 13,
    //   color: '#0060CA',
    // alignSelf: 'center',
    top: 25,
    textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
    fontWeight: '500',
  },
  time: {
    fontSize: 10,
    color: Color.royalblue,
    // alignSelf: 'baseline',
    // right: '20%',
    top: 20,
    position: 'absolute',
    left: '77%',
    textTransform: 'capitalize',
    // paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 300,
    // fontWeight: '500',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    top: 20,
    // marginTop: -20,
  },
  new: {},
  newtext: {},
});
