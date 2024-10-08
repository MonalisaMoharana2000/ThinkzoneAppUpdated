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

import Colors from '../utils/Colors';
import Nocontents from '../components/Nocontents';
import Loading from '../components/Loading';
import {Color, FontFamily} from '../GlobalStyle';


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

  const [isLoading, setIsLoading] = useState(false);

  const [subModuleId, setSubModuleId] = useState([]);

  const [moduleType, setModuleType] = useState(type ? type : null);
  const [selectedModule, setSelectedModule] = React.useState(0);
  const [modules, setModules] = useState([]);

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

  const errorImageUrl = require('../assets/Image/books.jpg'); // Replace with your error image URL

  const [imagesss, setImagesss] = useState(imageUrl);

  const [imageError, setImageError] = useState(false);
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View>
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
