import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  AppState,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as SIZES from '../utils/dimensions';
import Api from '../environment/Api';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const NotificationPage = ({route, navigation}) => {
  console.log('route---->', route.params.data);
  const item = route.params.data;
  const teacherdata = useSelector(state => state.UserSlice.user);
  console.log('teacherdata---->', teacherdata);
  const {title, notifId, body, image, navigateto} = route.params.data;
  const [error, setError] = useState(false);
  console.log('check----->', navigateto);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.patch(
          `updateNotifViewStatus/${notifId}/${teacherdata[0].userid}`,
        );

        console.log('response status---->', response.data);
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
    };
    fetchData();
  }, []);

  const handleClick = () => {
    navigation.navigate(navigateto);
  };

  return (
    <ScrollView>
      <View>
        <View
          // key={index}

          style={styles.card}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.header}>{title}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: '100%',
                height: SIZES.WindowHeigth * 0.5,
                top: '20%',

                paddingBottom: 50,
                borderRadius: 20,
              }}
              resizeMode="cover"
              source={
                require('../assets/Image/notificationdemo.png')
                // error
                //   ? require('../assets/Photos/notificationdemo.png')
                //   : item.image
                //   ? {uri: item.image}
                //   : require('../assets/Photos/userss.png')
              }
              imageStyle={{
                width: '100%',
                height: window.WindowHeigth * 0.5,
              }}
              onError={() => {
                setError(true);
              }}
              // source={require('../assets/Image/group-35.png')}
            ></Image>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.desc}>{body}</Text>
          </View>
          {navigateto && navigateto.length > 0 ? (
            <TouchableOpacity style={styles.button} onPress={handleClick}>
              <Text style={styles.buttonText}>Click Here</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default NotificationPage;
const styles = StyleSheet.create({
  card: {
    width: windowWidth * 0.95,
    paddingBottom: 70,
    borderRadius: 10,
    top: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: Color.royalblue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 55,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
    top: 20,
    textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 300,
    fontWeight: '900',
  },
  desc: {
    fontSize: 13,
    top: '20%',
    textTransform: 'capitalize',
    paddingLeft: 20,
    alignSelf: 'center',
    fontFamily: FontFamily.poppinsMedium,
    width: 300,
    fontWeight: '700',
    paddingBottom: 30,
  },
  time: {
    fontSize: 11,
    color: '#0060CA',
    // alignSelf: 'center',
    top: 20,
    textTransform: 'capitalize',
    // paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 300,
    fontWeight: '500',
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
});
