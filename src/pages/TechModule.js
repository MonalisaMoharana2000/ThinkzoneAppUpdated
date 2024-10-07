import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  PanResponder,
  ActivityIndicator,
  AppState,
  BackHandler,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';
import * as window from '../utils/dimensions';
import HorizontalScrollView from '../components/HorizontalScrollView';
import AccordianComponent from '../components/AccordianComponent';

import TechAccoed from '../components/TechAccoed';
// import * as TechSlice from '../redux/slices/TechSlice';
import Norecord from '../components/Norecord';
// import * as FcmSlice from '../redux/slices/FcmSlice';
import {log} from 'console';
import {useFocusEffect} from '@react-navigation/native';
import HorizontalScrollViewNew from '../components/HorizontalScrollViewNew';
import Api from '../environment/Api';
import Colors from '../utils/Colors';
import Nocontents from '../components/Nocontents';
import Loading from '../components/Loading';
import {Color, FontFamily} from '../GlobalStyle';
import TrainingModulesPage from './TrainingModulesPage';

const TechModule = ({navigation, route}) => {
  const type = route.params.type;
  const headerTYpe = route.params.head;
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const user = useSelector(state => state.UserSlice.user);
  console.log('user------------>', user);

  const moduleArrNew = useSelector(state => state.techdata.techmodule);
  const submoduleArrNew = useSelector(state => state.techdata.techsubmodule);
  const loadingModule = useSelector(state => state.techdata.techsubmodule);
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const [isLoadingSubmodule, setIsLoadingSubmodule] = useState(false);

  const [subModuleId, setSubModuleId] = useState([]);
  const [submoduleArr, setSubModuleArr] = useState([]);
  const [moduleType, setModuleType] = useState(type ? type : null);
  const [selectedModule, setSelectedModule] = React.useState(0);
  const [modules, setModules] = useState([]);
  const [submodules, setSubmodules] = useState([]);

  // useEffect(() => {
  //   const d_data = {
  //     userid: user[0].userid,
  //     usertype: user[0].usertype,
  //     trainingType: moduleType,
  //   };

  //   dispatch(TechSlice.getTechModuleStart({d_data}));
  // }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchData = async () => {
  //       try {
  //         setIsLoading(true);
  //         const moduleResponse = await Api.get(
  //           `getAllModulesWithMarks/${user[0].userid}/${user[0].usertype}/${moduleType}/od`,
  //         );
  //         setModules(moduleResponse.data);
  //         setSubModuleArr(submoduleArrNew);
  //         setIsLoading(false);
  //         setIsLoader(false);

  //         if (moduleResponse.data.length > 0) {
  //           // const submoduleResponse = await Api.get(
  //           //   `getAllSubmodulesAndTopics/${user[0].userid}/${user[0].usertype}/training2/od/${moduleResponse.data[0].moduleId}`,
  //           // );
  //           // setSubmodules(submoduleResponse.data);
  //           setIsLoadingSubmodule(true);
  //           const data = {
  //             userid: user[0].userid,
  //             usertype: user[0].usertype,
  //             moduleId:
  //               subModuleId.length > 0
  //                 ? subModuleId
  //                 : moduleResponse.data[0].moduleId,
  //             // moduleId: selectedModule,
  //             trainingType: moduleType,
  //           };
  //           dispatch(TechSlice.getTechSubModuleStart({data}));
  //           setIsLoadingSubmodule(false);
  //         }
  //       } catch (error) {
  //         if (error.response.status === 413) {
  //           console.log('error is---------------->', error);
  //           setIsLoading(false);
  //           Alert.alert('The entity is too large !');
  //         } else if (error.response.status === 504) {
  //           console.log('Error is--------------------->', error);
  //           setIsLoading(false);
  //           Alert.alert('Gateway Timeout: The server is not responding!');
  //         } else if (error.response.status === 500) {
  //           console.error('Error is------------------->:', error);
  //           setIsLoading(false);
  //           Alert.alert(
  //             'Internal Server Error: Something went wrong on the server.',
  //           );
  //         } else {
  //           console.error('Error is------------------->:', error);
  //           setIsLoading(false);
  //         }
  //       }
  //     };

  //     fetchData();
  //   }, [subModuleId]),
  // );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const moduleResponse = await Api.get(
  //         `getAllModulesWithMarks/${user[0].userid}/${user[0].usertype}/${moduleType}/od`,
  //       );

  //       console.log('module---->', moduleResponse.data);
  //       setModules(moduleResponse.data);

  //       if (moduleResponse.data.length > 0) {
  //         const submoduleResponse = await Api.get(
  //           `getAllSubmodulesAndTopics/${user[0].userid}/${user[0].usertype}/training2/od/${moduleResponse.data[0].moduleId}`,
  //         );
  //         console.log('submodule---->', submoduleResponse.data);
  //         setSubmodules(submoduleResponse.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  //
  const getModuleId = (moduleid, index) => {
    //
    // console.log('moduleid---->', moduleid, index, moduleid.moduleIsComplete);
    navigation.navigate('TrainingSubmodulePage', {
      moduleName: moduleid.moduleName,
      status: moduleid.moduleIsComplete,
      moduleId: moduleid.moduleId,
      trainingType: moduleType,
      moduleImage: modules[0]?.moduleImage,
    });
    setSubModuleId(moduleid.moduleId);
    setSelectedModule(index);
    const data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleId: moduleid.moduleId,
      trainingType: moduleType,
    };
    // dispatch(TechSlice.getTechSubModuleStart({data}));
  };

  // console.log('isLoadingsss------------------>', isLoading);
  const imageUrl = require('../assets/Image/books.jpg');
  const defaultImageUrl = require('../assets/Image/books.jpg');
  const errorImageUrl = require('../assets/Image/books.jpg'); // Replace with your error image URL
  const defaultAccessibilityLabel = `Default Image Accessibility Label`;
  const [imagesss, setImagesss] = useState(imageUrl);
  const handleImageError = () => {
    setImagesss(errorImageUrl);
  };
  const [imageError, setImageError] = useState(false);
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View>
          {/* <View
            style={{
              backgroundColor: '#0060ca',
              height: 66,
              width: window.WindowWidth * 1.1,
              marginTop: -16,
              marginLeft: -20,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                marginTop: 15,
                textAlign: 'center',
              }}>
              {route.params.skillsetname}
              {headerTYpe}
            </Text>
          </View> */}
          {isLoading ? (
            <View>
              {/* <PgeSkeleton /> */}
              <Loading />
            </View>
          ) : modules.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  // alignSelf: 'center',
                  // paddingLeft: '2%',
                }}>
                {modules.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => getModuleId(item)}
                    key={item.moduleId}
                    style={{
                      // borderWidth: 1.2,
                      // borderColor: Color.royalblue,
                      // borderRadius: 10,
                      backgroundColor: Color.ghostwhite,
                      alignSelf: 'center',
                      margin: 10,
                      shadowColor: '#000',

                      // flexWrap: 'wrap',

                      // shadowRadius: 8,
                      // height: window.WindowWidth * 0.6,
                      width: window.WindowWidth * 0.43,
                      backgroundColor: Color.ghostwhite,
                      // justifyContent: 'center',

                      // padding:10
                      // height: window.WindowWidth * 0.6,
                    }}>
                    {item.moduleIsComplete == false ? (
                      <View
                      // style={{
                      //   flexDirection: 'column',
                      // }}
                      >
                        {/* <Text
                          style={{
                            color: 'black',
                            fontSize: 15,
                            fontWeight: '900',

                            fontFamily: FontFamily.balooBhaiRegular,

                            marginTop: 7,
                            marginLeft: 5,
                            paddingBottom: 20,
                          }}>
                          {item.moduleName}
                        </Text> */}
                        {/* {} */}

                        {item.moduleImage?.length != 0 ? (
                          <Image
                            style={{
                              width: window.WindowWidth * 0.427,
                              // height: window.WindowHeigth * 0.195,
                              alignSelf: 'center',
                              aspectRatio: 15 / 15,
                              // borderBottomLeftRadius: 9,
                              // borderBottomRightRadius: 9,
                            }}
                            source={{uri: `${item.moduleImage}`}}
                            loadingIndicatorSource={require('../assets/Image/loaderimage.png')}
                            onError={() => {
                              console.error('Image failed to load');
                              // Display a default/local image when an error occurs
                              setImageError(true);
                            }}
                          />
                        ) : (
                          <View>
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
                              {item.moduleName}
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
                      </View>
                    ) : (
                      <>
                        <View
                          style={{
                            flexDirection: 'column',
                          }}>
                          {item.moduleImage?.length != 0 ? (
                            <Image
                              style={{
                                width: window.WindowWidth * 0.427,
                                // height: window.WindowHeigth * 0.195,
                                alignSelf: 'center',
                                aspectRatio: 15 / 15,
                                // borderBottomLeftRadius: 9,
                                // borderBottomRightRadius: 9,
                              }}
                              source={{uri: `${item.moduleImage}`}}
                              loadingIndicatorSource={require('../assets/Image/loaderimage.png')}
                              onError={() => {
                                console.error('Image failed to load');
                                // Display a default/local image when an error occurs
                                setImageError(true);
                              }}
                            />
                          ) : (
                            <View>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: 15,
                                  fontWeight: '900',

                                  fontFamily: FontFamily.balooBhaiRegular,
                                  alignSelf: 'center',
                                  // marginTop: 7,
                                  marginLeft: 5,
                                  paddingBottom: 10,
                                }}>
                                {item.moduleName}
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
                        </View>
                      </>
                    )}
                    {item.lockStatus == true ? (
                      <FontAwesome
                        name="lock"
                        color={Colors.primary}
                        size={22}
                      />
                    ) : (
                      <></>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : modules.length === 0 && submoduleArrNew.length === 0 ? (
            // <NoContent />
            <Nocontents />
          ) : (
            <View>
              {/* <PgeSkeleton /> */}
              <Loading />
            </View>
          )}
          {/* {modules.length > 0 && submoduleArrNew.length === 0 && (
            <Text>No submodules available.</Text>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default TechModule;

const styles = StyleSheet.create({
  certificateContainer: {
    flexGrow: 1,
    width: '96%',
    // margin: 15,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginLeft: 20,
    // marginRight: 8,
    borderRadius: 10,
    elevation: 10,
    right: 10,
  },
  certificateCard: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  certificateText: {
    fontSize: 13,
    color: '#333333',
    alignSelf: 'center',
    top: 20,
    // textTransform: 'capitalize',
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
  },
  certificateLogo: {
    width: 164.81,
    height: 110.5,
    left: '60%',
    position: 'absolute', // Set the position to relative
    // Add a shadow with reduced opacity
    shadowColor: Color.royalblue, // Adjust opacity by changing the last value (0.3)
    top: '2%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1, // You can adjust the shadow opacity here
    shadowRadius: 4,
  },
  clickButton: {
    backgroundColor: Color.royalblue,
    marginLeft: 20,
    borderRadius: 20,
    width: window.WindowWidth * 0.22,
  },
  clickText: {
    FontFamily: FontFamily.poppinsMedium,
    color: '#333333',
    textAlign: 'center',
    color: 'white',
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 13,
  },
});
