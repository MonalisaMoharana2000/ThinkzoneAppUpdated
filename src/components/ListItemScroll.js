import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Animated,
  Dimensions,
  AppState,
  Easing,
  Alert,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import API from '../environment/Api';

// import Color from '../utils/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import {log} from 'console';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ListItemScroll = ({
  backgroundColor,
  title,
  subTitle,
  IconComponent,
  IconComponent1,
  onPress,
  subSub,
  image,
  time,
  renderRightActions,
  renderLeftActions,
  rigthButton = true,
  color,
  IconComponent3,
  viewStatus,

  call,
}) => {
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [7, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      //   <TouchableOpacity activeOpacity={0.6}>
      <View style={styles.callBox}>
        <Animated.Text style={{transform: [{scale: scale}]}}>
          {' '}
          {call}
        </Animated.Text>
      </View>
      //   </TouchableOpacity>
    );
  };

  const teacherdata = useSelector(state => state.userdata.user?.resData);

  let stTime = new Date().getTime();
  const [animatedValue] = useState(new Animated.Value(0));
  const animatedStyles = {
    left: animatedValue.interpolate({
      inputRange: [0, 5],
      outputRange: ['70%', '0%'], // Adjust the values based on your design
    }),
  };
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 0.5,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: false,
      }),
    );

    animation.start(); // Start the looped animation

    // Cleanup the animation on component unmount (optional)
    return () => animation.stop();
  }, []);
  const {userid, username, usertype, managerid, managername, passcode} =
    teacherdata[0];

  const [isLoading, setIsloading] = useState(false);

  const [allNotification, setAllNotification] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setIsloading(true);
      try {
        const fetchData = async () => {
          const response = await API.get(`getAllNotifs/${userid}`);
          // console.log('response---->', response.data);
          setAllNotification(response.data);
          setIsloading(false);
        };

        fetchData();
      } catch (error) {
        console.log('err---->', error);
        if (error.response.status === 504) {
          Alert.alert('Gateway Timeout: The server is not responding.');
        } else if (error.response.status === 500) {
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
          console.error('Error is------------------->:', error);
        } else {
          console.error('Error is------------------->:', error);
        }
      }
    }, []),
  );

  return (
    <ScrollView>
      <Swipeable
        renderRightActions={leftSwipe}
        // renderLeftActions={renderLeftActions}
      >
        <TouchableHighlight underlayColor={Color.light}>
          <TouchableOpacity
            style={[
              styles.container,
              {backgroundColor: backgroundColor, color: color},
            ]}
            onPress={onPress}>
            {IconComponent}
            {IconComponent1}
            {image && <Image style={styles.image} source={image} />}
            <View style={styles.detailsContainer}>
              {/* <Image style={styles.image} source={image} /> */}
              <View
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'space-evenly',
                }}>
                <Text style={[styles.title, {color: color}]} numberOfLines={1}>
                  {title}
                </Text>
                {viewStatus === 'unread' ? (
                  <View
                    style={{
                      top: 20,

                      width: 50,
                      right: 40,
                      backgroundColor: Color.royalblue,
                      position: 'absolute',
                      borderRadius: 5,
                      // padding: 3,
                      height: 22,
                    }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: 'white',

                        textTransform: 'capitalize',

                        fontFamily: FontFamily.poppinsMedium,

                        fontWeight: '900',
                        textAlign: 'center',
                      }}>
                      New
                    </Text>
                  </View>
                ) : null}
              </View>
              {/* {subTitle && ( */}
              <Text style={[styles.subTitle, {color: color}]} numberOfLines={1}>
                {subTitle}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[styles.subTitle, {color: color}]}
                  numberOfLines={1}>
                  {subSub}
                </Text>
                <Text style={styles.time}>{time}</Text>
              </View>
              {/* )} */}
              <Animated.Text
                style={{
                  fontSize: 8,
                  color: Color.gray_100,
                  position: 'absolute',
                  textTransform: 'capitalize',
                  fontFamily: FontFamily.poppinsMedium,
                  width: 300,
                  fontWeight: '500',
                  top: '130%',
                  ...animatedStyles,
                }}>
                {`<<Swipe to delete`}
              </Animated.Text>
            </View>
          </TouchableOpacity>
        </TouchableHighlight>
      </Swipeable>
    </ScrollView>
  );
};

export default ListItemScroll;

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    // // backgroundColor: '#1C5C72',
    // borderRadius: 15,
    // marginBottom: 13,
    // marginLeft: 10,
    // marginRight: 10,
    // marginTop: 12,
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
    // shadowRadius: 4,
    // elevation: 2,
    borderRadius: 10,
    borderColor: '#666666',
    borderWidth: 0.5,
  },
  detailsContainer: {
    // flex: 1,
    // marginLeft: 10,
    // justifyContent: 'center',
    // flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 80,
    marginLeft: -25,
    marginTop: -20,
    // borderRadius: 30,
  },
  subTitle: {
    // color: 'black',
    // fontWeight: '400',
    // fontSize: 18,
    // marginTop: 5,
    // textTransform: 'uppercase',
    fontSize: 13,
    //   color: '#0060CA',
    // alignSelf: 'center',
    top: '50%',
    textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
    fontWeight: '500',
  },
  title: {
    // color: 'black',
    // fontWeight: '800',
    // textTransform: 'capitalize',
    // letterSpacing: 0.4,
    // fontSize: 17,
    // flex: 1,
    fontSize: 15,
    color: 'black',
    alignSelf: 'flex-start',
    top: 20,
    textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
    fontWeight: '900',
  },
  // card: {
  //   margin: 8,
  //   padding: 20,
  //   height: 100,
  //   width: 350,
  //   backgroundColor: Color.primary,
  //   borderRadius: 10,
  // },
  // listtext: {
  //   color: Color.white,
  // },
  time: {
    fontSize: 10,
    color: Color.royalblue,
    // alignSelf: 'baseline',
    // right: '20%',
    // top: '5%',
    top: '52%',
    position: 'absolute',
    left: '70%',
    textTransform: 'capitalize',
    // paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 300,
    // fontWeight: '500',
  },
});
