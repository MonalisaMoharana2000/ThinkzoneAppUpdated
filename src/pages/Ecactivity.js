import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Alert,
  AppState,
  PanResponder,
  Dimensions,
} from 'react-native';
import API from '../environment/Api';
import React, {useState, useEffect, useRef} from 'react';
import DropdownComponent from '../components/DropdownComponent';
import {useDispatch, useSelector} from 'react-redux';
// import ListColomItem from '../components/ListColomItem';
// import Separator from '../components/Separator';
import * as window from '../utils/dimensions';
// import Color from '../utils/Colors';
// import * as FcmSlice from '../redux/slices/FcmSlice';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Norecord from '../components/Norecord';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {app_versions} from './Home';
import * as UserSlice from '../redux_toolkit/features/users/UserSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Ecactivity = ({navigation}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const [studentClass, setStudentClass] = useState(1);
  console.log('====================================><', studentClass);
  const [isLoading, setIsloading] = useState(true);

  const [data, setData] = useState([]);
  const user = useSelector(state => state.UserSlice.user);

  console.log('user-------->', user);

  const dispatch = useDispatch();

  const [topicName, setSkillname] = useState([]);
  console.log('====================================topicName check', topicName);

  useEffect(() => {
    API.get(
      `getMasterStudActTopics/ece/${
        user[0]?.usertype
      }/od/${'formative'}/${studentClass}`,
    )
      .then(response => {
        setContent(response.data);
        setSkillname(response.data[0].topicName);
        console.log('set=================>', response.data[0].topicName); // Log the actual data, not the function
        setIsloading(false);
      })
      .catch(err => {
        // Handle error here, e.g., set an error state
      });
  }, [studentClass]);

  const getStudent = item => {
    setStudentClass(item.id);
  };
  // const topicName = setContent[0].topicName;
  const sikllSelected = item => {
    console.log('item', item);
    //
    if (studentClass == 0) {
      Alert.alert('Please select level');
    } else {
      navigation.navigate('eccontent', {
        contentDetails: item,
        class: studentClass,
        topicName: topicName,
        topicImage: content.topicImage,
      });
    }
  };

  const [content, setContent] = useState([]);

  return (
    <View style={{flex: 1, backgroundColor: Color.ghostwhite}}>
      <View style={styles.scrollView}>
        <View>
          {isLoading ? (
            <View>
              {/* <PgeSkeleton /> */}
              <Loading />
            </View>
          ) : (
            <>
              <DropdownComponent
                data={classArr}
                onChange={getStudent}
                image={require('../assets/Image/bookmark-2.png')}
                label={'class'}
              />
              <ScrollView
                style={{
                  height: 580,
                  overflow: 'scroll',
                }}>
                {content.length > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly',
                    }}>
                    {content?.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => sikllSelected(item)}
                        style={{
                          backgroundColor: Color.ghostwhite,
                          alignSelf: 'center',
                          margin: 10,
                          shadowColor: '#000',
                          width: window.WindowWidth * 0.43,
                          backgroundColor: Color.ghostwhite,
                        }}>
                        {item.topicImage?.length > 0 ? (
                          <Image
                            style={{
                              width: window.WindowWidth * 0.427,
                              borderRadius: 5,

                              alignSelf: 'center',
                              aspectRatio: 15 / 15,
                            }}
                            source={{uri: `${item.topicImage}`}}
                          />
                        ) : (
                          <View
                            style={{
                              borderWidth: 1.2,
                              borderColor: Color.royalblue,
                              borderRadius: 10,
                              backgroundColor: Color.ghostwhite,
                              alignSelf: 'center',
                              margin: 10,
                              shadowColor: '#000',

                              width: window.WindowWidth * 0.43,
                              backgroundColor: Color.ghostwhite,
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 15,
                                fontWeight: '900',

                                fontFamily: FontFamily.balooBhaiRegular,

                                // marginTop: 7,
                                marginLeft: 5,
                                paddingBottom: 10,
                              }}>
                              {item.topicName}
                            </Text>
                            <Image
                              style={{
                                width: window.WindowWidth * 0.425,
                                height: window.WindowHeigth * 0.195,

                                alignSelf: 'center',
                                borderRadius: 10,
                              }}
                              source={require('../assets/Image/books.jpg')}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Nocontents />
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default Ecactivity;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    top: 20,
  },
  Logo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: -30,
  },
  View: {
    width: 112,
    paddingBottom: 5,
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 6,
  },
  name: {
    fontFamily: FontFamily.balooBhaina2Medium,
    fontSize: 13,
    marginTop: -40,
    paddingBottom: 10,
    textAlign: 'center',
    color: Color.black,
  },
});
const classArr = [
  // {id: 0, class: 'ସ୍ତର ଚୟନ କରନ୍ତୁ '},

  {id: 1, class: 'ସ୍ତର ୧'},
  {id: 2, class: 'ସ୍ତର ୨'},
  {id: 3, class: 'ସ୍ତର ୩'},
];
