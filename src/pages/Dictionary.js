import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SectionList,
  ScrollView,
} from 'react-native';
// import Color from '../utils/Colors';
import ListItem from '../components/ListItem';
import React, {useState} from 'react';
import SearchBar from '../components/SearchBar';
import Colors from '../utils/Colors';
import SearchIcon from 'react-native-vector-icons/EvilIcons';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

// import Animated, {
//   color,
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';
// import {
//   Gesture,
//   GestureDetector,
//   ScrollView,
// } from 'react-native-gesture-handler';
import {useEffect} from 'react';
import {style} from 'd3';
// import {SafeAreaView} from 'react-native-safe-area-context';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 1;
const Dictionary = () => {
  const user = useSelector(state => state.UserSlice.user);
  const [word, setWord] = useState('');
  const [wordDetail, setWordDetail] = useState([]);
  const [modal, setModal] = useState(false);

  const searchWord = () => {
    API.get(`/getdictionarysearchresult/${word} `).then(suc => {
      setWordDetail(suc.data);
      setModal(true);
      err => {};
    });
  };

  return (
    <View style={styles.cont}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 89,
          paddingBottom: 8,
          paddingTop: 19,
        }}>
        <SearchBar
          onChangeText={word => setWord(word)}
          placeholder="Search Word"
          width={294}
        />

        <TouchableOpacity style={styles.button} onPress={() => searchWord()}>
          <Text
            style={{
              color: 'white',
              justifyContent: 'center',
              marginLeft: 5,
              // paddingRight: 5,
            }}>
            <SearchIcon
              name="search"
              size={28}
              color={'gray'}
              style={{marginHorizontal: 10}}
            />
          </Text>
        </TouchableOpacity>
      </View>

      {wordDetail.length > 0 ? (
        <ScrollView
          style={{
            backgroundColor: 'white',
            width: window.WindowWidth * 0.95,
            marginLeft: 10,
            borderRadius: 10,
          }}>
          <FlatList
            data={wordDetail}
            renderItem={({item, index}) => (
              <View>
                {item.meta ? (
                  <View>
                    <Text style={styles.text2}>{item.meta.id}</Text>

                    <Text
                      style={{
                        paddingLeft: 33,
                        paddingBottom: 12,
                        marginTop: -9,
                        fontSize: 19,
                        fontStyle: 'italic',
                        fontFamily: FontFamily.poppinsMediumItalic,
                      }}>
                      {`\u25CF ${item.fl}`}
                      {/* \u25CF --> For bullet characcter*/}
                    </Text>

                    <View style={styles.def}>
                      <Text style={{fontWeight: 'bold', fontSize: 19}}>
                        Defination:
                      </Text>
                      {item.shortdef.map(item => (
                        <Text
                          style={{
                            fontSize: 15,
                            textTransform: 'capitalize',
                            // fontStyle: 'italic',
                            marginTop: 10,
                            fontFamily: FontFamily.poppinsMedium,
                          }}>
                          {item}
                        </Text>
                      ))}
                    </View>
                    <ScrollView>
                      <View
                        style={{
                          // alignItems: 'center',
                          marginTop: 12,
                          flexDirection: 'column',
                          paddingBottom: 12,
                        }}>
                        {/* <Text
                      style={{
                        fontSize: 15,
                        whiteSpace: 'pre-line',
                        marginLeft: 12,
                        textTransform: 'capitalize',
                        backgroundColor: 'red',
                        paddingLeft: 39,
                        paddingRight: 39,
                        paddingTop: 19,
                        paddingBottom: 19,
                        borderRadius: 12,
                      }}> */}
                        {item.meta.stems.map(item => (
                          <Text
                            style={{
                              fontSize: 15,
                              textAlign: 'left',
                              // whiteSpace: 'pre-line',
                              marginLeft: 42,
                              textTransform: 'capitalize',
                              // backgroundColor: Color.royalblue,
                              fontFamily: FontFamily.poppinsMedium,
                              // paddingLeft: 39,
                              // paddingRight: 39,
                              // paddingTop: 19,
                              // paddingBottom: 19,
                              // borderRadius: 12,
                              color: Color.darkslategray_100,
                            }}>
                            {`\u25CF ${item.fl}`} {item}
                          </Text>
                        ))}
                        {/* </Text> */}
                      </View>
                    </ScrollView>

                    {/* <View>
                    {item.shortdef.map(item => (
                   
                      <Text
                        style={{
                          marginLeft: 19,
                          fontWeight: 'bold',
                          fontStyle: 'italic',
                        }}>
                        NOTE :{' '}
                        <Text style={{marginLeft: 25, fontWeight: 'bold'}}>
                          {item}
                        </Text>
                      </Text>
                    ))}
                  </View> */}
                  </View>
                ) : (
                  <Text>No such words</Text>
                )}
              </View>

              // )
            )}
          />
        </ScrollView>
      ) : (
        <View>
          <Image
            style={{marginLeft: -10, width: 400, height: 400, marginTop: 40}}
            resizeMode="cover"
            source={require('../assets/Image/openbook.gif')}
          />
        </View>
      )}
    </View>
  );
};

export default Dictionary;

const styles = StyleSheet.create({
  cont: {
    backgroundColor: Color.ghostwhite,
    flex: 1,
  },
  // button: {height: 30, width: 100, backgroundColor: Colors.success},
  button: {
    // backgroundColor: Color.royalblue,
    backgroundColor: Color.white,

    marginTop: 19,
    marginBottom: 17,
    // paddingLeft: 10,
    marginLeft: -5,
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 5,
    paddingTop: -2,
  },
  // sear: {
  // paddingLeft:12
  // },
  text: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 87,
    marginTop: 120,
    fontFamily: FontFamily.poppinsMedium,
  },
  text1: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontFamily: FontFamily.poppinsMedium,
  },
  text2: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontFamily: FontFamily.poppinsMedium,
  },
  texts: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 112,
    marginTop: 5,
    fontFamily: FontFamily.poppinsMedium,
  },
  tinyLogo: {
    width: 125,
    height: 125,
    marginLeft: 258,

    marginTop: -125,
  },
  def: {
    // backgroundColor: '#D5F5F5',
    justifyContent: 'center',
    paddingLeft: 25,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 29,
    paddingBottom: 29,
    borderRadius: 12,
  },

  // bottomSheetContainer: {
  //   height: SCREEN_HEIGHT,
  //   width: '100%',
  //   backgroundColor: 'white',
  //   position: 'absolute',
  //   top: SCREEN_HEIGHT,
  //   borderRadius: 25,
  // },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});
