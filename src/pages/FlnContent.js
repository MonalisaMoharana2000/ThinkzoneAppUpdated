import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import Colors from '../utils/Colors';

// import ListItem from '../components/ListItem';
import React, {useEffect, useState} from 'react';
import API from '../environment/Api';
// import PdfViewer from '../components/PdfViewer';
import {FontFamily, FontSize, Border, Color} from '../GlobalStyle';
import DropdownComponent from '../components/DropdownComponent';
import {useDispatch, useSelector} from 'react-redux';

import * as window from '../utils/dimensions';
import Modals from '../components/Modals';
import Norecord from '../components/Norecord';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';

const FlnContent = ({route, navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [fln, setFln] = useState([]);
  // const {studentDetails} = route.params;
  const [customModal, setCustomModal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // const teacherdata = useSelector(
  //   state => state.UserSlice?.user?.data?.resData,
  // );
  const teacherdata = useSelector(state => state.UserSlice.user);

  const [sclass, setSclass] = useState(1);
  const [program, setProgram] = useState('pge');
  const [subject, setSubject] = useState('foundationalLiteracy ');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          '',
          'Do you want to Leave this page?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );

        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const closeModal = () => {
    setCustomModal(false);
    // navigation.goBack();
  };
  const getProgram = item => {
    setProgram(item.class);
  };
  const getClass = item => {
    setSclass(item.id);
  };

  const getSubject = item => {
    setSubject(item.class);
  };

  const sikllSelected = item => {
    //
    if (studentClass == 0) {
      Alert.alert('Please select level');
    } else {
      navigation.navigate('eccontent', {
        contentDetails: item,
        class: studentClass,
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const body = {
        //   activityType: 'fln',
        //   usertype: teacherdata[0].usertype,
        //   language: 'od',
        //   program: program,
        //   class: sclass,
        //   subject: subject,
        // };
        // console.log('body======================', body);
        const response = await API.get(
          `getMasterStudActTopics/${'fln'}/${
            teacherdata[0].usertype
          }/${'od'}/${'formative'}/${sclass}/${subject}/${program}`,
        );
        setFln(response.data);
        setIsLoading(false);
        // console.log(response.data);
      } catch (error) {
        if (error.response.status === 413) {
          console.log('error is---------------->', error);
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
        } else {
          console.error('Error is------------------->:', error);
        }
      }
    };

    fetchData();
  }, [program, sclass, subject]);
  const getTopicDetails = item => {
    navigation.navigate('flncontentview', {item, subject, program, sclass});
  };
  return (
    <>
      {isLoading ? (
        // <ActivityIndicator
        //   size="large"
        //   color={Colors.primary}
        //   style={{justifyContent: 'center', alignSelf: 'center'}}
        // />
        <Loading />
      ) : (
        <View>
          <DropdownComponent
            data={programArr}
            onChange={getProgram}
            label={'label'}
            image={require('../assets/Image/book-square.png')}
          />
          {program === 'pge' ? (
            <DropdownComponent
              data={classArr}
              onChange={getClass}
              label={'class'}
              image={require('../assets/Image/driver.png')}
            />
          ) : null}

          {program === 'ece' ? (
            <DropdownComponent
              data={levelArr}
              onChange={getClass}
              label={'class'}
              image={require('../assets/Image/driver.png')}
            />
          ) : null}

          <DropdownComponent
            data={subjectArr}
            onChange={getSubject}
            label={'label'}
            image={require('../assets/Image/driver.png')}
          />
          {fln?.length > 0 ? (
            <>
              <ScrollView
                style={{
                  height: 500,
                  overflow: 'scroll',
                }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    height: window.WindowHeigth * 0.971,
                  }}>
                  {fln?.map((item, index) => (
                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}>
                      <TouchableOpacity onPress={() => getTopicDetails(item)}>
                        {item.topicImage?.length > 0 ? (
                          <View
                            style={{
                              // borderWidth: 1.2,
                              // borderColor: Color.royalblue,

                              // backgroundColor: Color.ghostwhite,
                              alignSelf: 'center',
                              margin: 10,
                              // shadowColor: '#000',

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
                        {/* <View>
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
                          </View> */}
                      </TouchableOpacity>
                    </ScrollView>
                  ))}
                </View>
              </ScrollView>
            </>
          ) : (
            <View style={{flex: 1}}>
              <Image
                style={{
                  width: windowWidth * 1, // You can adjust the scaling factor as needed
                  height: windowHeight * 0.5, // You can adjust the scaling factor as needed
                  // flex: 1,
                  // alignSelf: 'center',
                  // top: 20,
                }}
                source={require('../assets/Image/Group76686.png')}
                // resizeMode="contain" // You can change the resizeMode as per your requirement
              />
            </View>
            // <Nocontents />
          )}
        </View>
      )}
    </>
  );
};

export default FlnContent;

const styles = StyleSheet.create({
  image: {
    width: window.WindowWidth * 0.99,
    height: window.WindowHeigth * 0.39,
    flex: 1,
    alignSelf: 'center',
    top: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    top: -5,
  },
});

const programArr = [
  {id: 1, class: 'pge', label: 'PGE'},
  {id: 2, class: 'ece', label: 'ECE'},
];

const classArr = [
  {id: 1, class: 'ଶ୍ରେଣୀ-୧'},
  {id: 2, class: 'ଶ୍ରେଣୀ-୨'},
  {id: 3, class: 'ଶ୍ରେଣୀ-୩'},
  {id: 4, class: 'ଶ୍ରେଣୀ-୪'},
  {id: 5, class: 'ଶ୍ରେଣୀ-୫'},
];

const levelArr = [
  {id: 1, class: 'ସ୍ତର ୧'},
  {id: 2, class: 'ସ୍ତର ୨'},
  {id: 3, class: 'ସ୍ତର ୩'},
];

const subjectArr = [
  {id: 1, class: 'foundationalLiteracy', label: 'ମୌଳିକ ସାକ୍ଷରତା'},
  {id: 2, class: 'foundationalNumeracy', label: 'ମୌଳିକ ସଂଖ୍ୟାଜ୍ଞାନ'},
];
