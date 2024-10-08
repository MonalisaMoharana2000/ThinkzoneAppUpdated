import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  PanResponder,
  AppState,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import DropdownComponent from '../components/DropdownComponent';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';

const Pgeactivity = ({navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const appState = useRef(AppState.currentState);
  const teacherdata = useSelector(state => state.UserSlice?.user);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const [subject, setSubject] = useState('odia');
  const [sclass, setSclass] = useState(1);
  const [customModal, setCustomModal] = useState(true);
  const [program, setProgram] = useState('pge');
  const [language, setLanguage] = useState('od');
  const [content, setContent] = useState([]);

  const topicName = content[0]?.topicName;
  console.log('content----------------->', topicName);

  const [isLoading, setIsloading] = useState(true);
  const user = useSelector(state => state.UserSlice?.user?.data?.resData);
  const dispatch = useDispatch();

  useEffect(() => {
    API.get(
      `getMasterStudActTopics/${program}/${
        user[0]?.usertype
      }/${language}/${'formative'}/${sclass}/${subject.toLowerCase()}`,
    ).then(
      response => {
        setContent(response.data);
        console.log('set=================>', setContent);
        setIsloading(false);
      },
      err => {
        //
      },
    );
  }, [sclass, subject]);
  const getClass = item => {
    //
    setSclass(item.id);
  };
  const getSubject = item => {
    setSubject(item.class);
  };
  console.log('content2--------', content.topicImage);
  const getTopicDetails = item => {
    console.log('content2--------', content.topicImage);
    navigation.navigate('Content', {
      item,
      subject,
      sclass,
      topicImage: content.topicImage,
    });

    // API.get(
    //   `getmasterpgeactivitiydetailsnostage/${item.preferedlanguage}/${item.program}/${item.subject}/${item.class}/${item.skillsetid}`,
    // ).then(suc => {
    //
    //   navigation.navigate('Content', suc.data);
    //   err => {
    //     //
    //   };
    // });
  };
  //
  // const closeModal = () => {
  //
  //   // setCustomModal(false);
  //   // navigation.goBack();
  // };

  // const timerId = useRef(false);
  // const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
  //   useState(600);
  // useEffect(() => {
  //   resetInactivityTimeout();
  // }, []);

  // const panResponder = React.useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponderCapture: () => {
  //       resetInactivityTimeout();
  //     },
  //   }),
  // ).current;

  // const resetInactivityTimeout = () => {
  //   clearTimeout(timerId.current);
  //   timerId.current = setTimeout(() => {
  //     // action after user has been detected idle
  //     //
  //     navigation.navigate('home');
  //   }, timeForInactivityInSecond * 1000);
  // };
  return (
    <View
    // style={{flex: 1, backgroundColor: Color.ghostwhite}}
    // {...panResponder.panHandlers}
    >
      <View>
        <>
          {/* <DropdownComponent
              data={classArr}
              onChange={getClass}
              label={'class'}
            />
            <DropdownComponent
              data={subjectArr}
              onChange={getSubject}
              label={'class'}
            /> */}

          {isLoading ? (
            <View>
              {/* <PgeSkeleton /> */}
              <Loading />
            </View>
          ) : (
            <>
              <DropdownComponent
                data={classArr}
                onChange={getClass}
                label={'class'}
                image={require('../assets/Image/book-square.png')}
              />
              <DropdownComponent
                data={subjectArr}
                onChange={getSubject}
                label={'label'}
                // image={require('../assets/Image/driver.png')}
                image={require('../assets/Image/driver.png')}
              />
              {content.length > 0 ? (
                <ScrollView
                  style={{
                    height: window.WindowHeigth * 0.65,
                    overflow: 'scroll',
                    paddingBottom: 40,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly',
                    }}>
                    {content.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => getTopicDetails(item)}>
                        {item.topicImage?.length > 0 ? (
                          <View
                            style={{
                              // borderWidth: 1.2,
                              // borderColor: Color.royalblue,
                              // backgroundColor: Color.ghostwhite,
                              alignSelf: 'center',
                              margin: 10,
                              // // shadowColor: '#000',
                              width: window.WindowWidth * 0.43,
                              backgroundColor: Color.ghostwhite,
                            }}>
                            <Image
                              style={{
                                width: window.WindowWidth * 0.427,
                                borderRadius: 5,
                                // height: window.WindowHeigth * 0.195,
                                alignSelf: 'center',
                                aspectRatio: 15 / 15,
                                // borderBottomLeftRadius: 9,
                                // borderBottomRightRadius: 9,
                              }}
                              source={{uri: `${item.topicImage}`}}
                              // loadingIndicatorSource={require('../assets/Image/loaderimage.png')}
                              // onError={() => {
                              //   console.error('Image failed to load');
                              //   // Display a default/local image when an error occurs
                              //   setImageError(true);
                              // }}
                            />
                          </View>
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
                </ScrollView>
              ) : (
                // <FlatList
                //   // keyExtractor={message => message._id}
                //   background
                //   removeClippedSubviews={true}
                //   maxToRenderPerBatch={10}
                //   initialNumToRender={10}
                //   updateCellsBatchingPeriod={40}
                //   data={content}
                //   renderItem={({item, index}) => (
                //     <ListItem
                //       backgroundColor="#1C5C72"
                //       color="white"
                //       onPress={() => getTopicDetails(item)}
                //       image={require('../assets/Photos/bookc.png')}
                //       title={item.skillsetname}
                //       subTitle={item.class}
                //     />
                //   )}
                // />
                <Nocontents />
                // <Modals
                //   visible={customModal}
                //   heading={'No Topic Available'}
                //   backgroundColor={'white'}
                //   onpressok={() => closeModal()}
                //   okstatus={true}
                // />
              )}
            </>
          )}
        </>
      </View>
    </View>
  );
};

export default Pgeactivity;

const styles = StyleSheet.create({
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
const classArr = [
  {id: 1, class: 'ଶ୍ରେଣୀ-୧'},
  {id: 2, class: 'ଶ୍ରେଣୀ-୨'},
  {id: 3, class: 'ଶ୍ରେଣୀ-୩'},
  {id: 4, class: 'ଶ୍ରେଣୀ-୪'},
  {id: 5, class: 'ଶ୍ରେଣୀ-୫'},
];
const subjectArr = [
  {id: 1, class: 'odia', label: 'Odia'},
  {id: 2, class: 'english', label: 'English'},
  {id: 3, class: 'maths', label: 'Maths'},
  {id: 4, class: 'evs', label: 'EVS'},
];
