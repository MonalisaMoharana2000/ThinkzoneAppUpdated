import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  DropDown,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
// import Color from '../utils/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DropdownComponent from '../components/DropdownComponent';
import Norecord from '../components/Norecord';
import React from 'react';
import {useEffect, useRef, useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import ListItem from '../components/ListItem';
import LinearGradient from 'react-native-linear-gradient';
import ModalComponent from '../components/ModalComponent';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Loading from '../components/Loading';
import Nocontents from '../components/Nocontents';
import {ScrollView} from 'react-native-gesture-handler';
import ModuleUnderDevlopment from '../components/ModuleUnderDevlopment';
import {color} from 'd3';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Leaderboard = ({navigation}) => {
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const user = useSelector(state => state.UserSlice.user);
  const modalRef = useRef(null);
  const modalHeight = window.WindowHeigth * 0.3;
  const dates = moment(dates).format('YYYY');
  const curMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(dates);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // Year  filter dynamic

  const yearList = [];

  for (var i = 0; i <= 100; i++) {
    var yearss = new Date().getFullYear() - i;
    if (yearss < 2022) break;
    else yearList.push({name: `${yearss}`, value: `${yearss}`});
  }

  yearList.sort((a, b) => parseInt(a.value) - parseInt(b.value));

  // console.log(yearList);

  const [date, setDate] = useState('');
  const [result, setResult] = useState([]);
  const [language, setLanguage] = useState('od');
  const [isLoading, setIsloading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [maintainanceStatus, setMaintainanceStatus] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setIsloading(true);
    if (dates < year && curMonth < month) {
      Alert.alert(
        'Info',
        'ଧ୍ୟାନ ଦେବେ! ଚୟନ କରାଯାଇଥିବା ମାସ ଚଳିତ ମାସ ଠାରୁ ଅଧିକ ହୋଇ ପାରିବ ନାହିଁ।',
        [
          {
            text: 'OK',
            onPress: () => {
              setResult([]), setIsloading(false);
            },
          },
        ],
      );
    }
    if (dates == year && curMonth < month) {
      Alert.alert(
        'Info',
        'ଧ୍ୟାନ ଦେବେ! ଚୟନ କରାଯାଇଥିବା ମାସ ଚଳିତ ମାସ ଠାରୁ ଅଧିକ ହୋଇ ପାରିବ ନାହିଁ।',
        [
          {
            text: 'OK',
            onPress: () => {
              setResult([]), setIsloading(false);
            },
          },
        ],
      );
    } else if (dates == year && curMonth == month) {
      //
      API.get(`getLboarddata/${user[0].usertype}/${month}/${year}`)
        .then(response => {
          //
          setResult(response.data);

          setIsloading(false);
        })
        .catch(e => {
          console.error(e.message); // "oh, no!"
        });
    } else {
      //
      API.get(`getleaderboarddata/${user[0].usertype}/${month}/${year}`)
        .then(response => {
          console.log('leaderboard-------->', response.data);
          setResult(response.data);
          setIsloading(false);
        })
        .catch(e => {
          console.error(e.message); // "oh, no!"
        });
    }
  }, [month, year]);

  useEffect(() => {
    API.get(`getMaintainanceStatus/fellow`)
      .then(response => {
        setMaintainanceStatus(response?.data?.leaderboard);
        // setmaintainanceModal(false);
      })
      .catch(e => {
        console.error(e.message); // "oh, no!"
      });
  }, []);
  const handleClick = data1 => {
    setModalVisible(true);
    setModalData(data1);
  };

  useEffect(() => {
    API.get(`checkUserInLboard/${user[0].userid}/${user[0].usertype}`)
      .then(response => {
        //
        setResults(response.data);
      })
      .catch(err => {});
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {maintainanceStatus === true ? (
        <ModuleUnderDevlopment />
      ) : (
        <View style={{top: '-3%', position: 'absolute'}}>
          <ScrollView>
            <ModalComponent
              modalVisible={modalVisible}
              data={modalData}
              onClick={() => setModalVisible(false)}
            />
            {isLoading ? (
              <View>
                <Loading />
              </View>
            ) : result.length == 0 ? (
              <View>
                <DropdownComponent
                  data={yearList}
                  value={year}
                  label={'name'}
                  set={year}
                  onChange={item => setYear(item.value)}
                />
                <DropdownComponent
                  data={monthlist}
                  value={month}
                  label={'name'}
                  set={
                    month == 1
                      ? 'Jan'
                      : month == 2
                      ? 'Feb'
                      : month == 3
                      ? 'March'
                      : month == 4
                      ? 'April'
                      : month == 5
                      ? 'May'
                      : month == 6
                      ? 'June'
                      : month == 7
                      ? 'July'
                      : month == 8
                      ? 'Aug'
                      : month == 9
                      ? 'Sep'
                      : month == 10
                      ? 'Oct'
                      : month == 11
                      ? 'Nov'
                      : month == 12
                      ? 'Dec'
                      : 'NA'

                    //   ? month == 5
                    //   : 'May'
                    //   ? month == 6
                    //   : 'June'
                    //   ? month == 7
                    //   : 'July'
                    //   ? month == 8
                    //   : 'Aug'
                    //   ? month == 9
                    //   : 'Sep'
                    //   ? month == 10
                    //   : 'Oct'
                    //   ? month == 11
                    //   : 'Nov'
                    //   ? month == 12
                    //   : 'Dec'
                    // : 'NA'
                  }
                  onChange={item => setMonth(item.value)}
                />
                <Image
                  source={require('../assets/Image/Group76686.png')}
                  style={{
                    width: windowWidth * 0.99, // Adjust as needed
                    height: windowWidth * 0.99, // Maintain the aspect ratio
                    marginBottom: 200,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            ) : (
              <>
                <View style={{alignSelf: 'center', left: '1%'}}>
                  <View
                    style={{
                      width: window.WindowWidth * 0.9,
                      paddingBottom: 20,
                      paddingTop: 5,
                      backgroundColor: Color.ghostwhite,
                      padding: 10,
                      alignSelf: 'center',
                      // top: 5,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: Color.royalblue,
                      margin: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={require('../assets/Image/instruction.png')}
                        style={{
                          width: 80, // Adjust as needed
                          height: 80,
                          // alignSelf: 'center', // Maintain the aspect ratio
                        }}
                      />

                      <Text
                        style={{
                          color: Color.darkslategray_300,
                          fontWeight: '450',
                          width: 230,
                          fontSize: 12,
                        }}>
                        ମାସ ଶେଷରେ ଲିଡରବୋର୍ଡରେ ସ୍ଥାନ ପାଉଥିବା ପ୍ରଥମ ୧୦ ଜଣ Educator
                        ଙ୍କୁ ୨୦୦୦ ଟି କଏନ୍ ପ୍ରାପ୍ତ ହେବ । ଏହି କଏନ୍ ଗୁଡ଼ିକୁ ଆପଣ
                        <Text style={{fontWeight: '900'}}>
                          Amazon Voucher
                        </Text>{' '}
                        ରେ Redeem କରିପାରିବେ ।
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    left: '1%',
                  }}>
                  <View style={{width: '48%'}}>
                    <DropdownComponent
                      data={yearList}
                      value={year}
                      label={'name'}
                      set={year}
                      onChange={item => setYear(item.value)}
                    />
                  </View>

                  <View style={{width: '48%'}}>
                    <DropdownComponent
                      data={monthlist}
                      value={month}
                      label={'name'}
                      set={
                        month == 1
                          ? 'Jan'
                          : month == 2
                          ? 'Feb'
                          : month == 3
                          ? 'March'
                          : month == 4
                          ? 'April'
                          : month == 5
                          ? 'May'
                          : month == 6
                          ? 'June'
                          : month == 7
                          ? 'July'
                          : month == 8
                          ? 'Aug'
                          : month == 9
                          ? 'Sep'
                          : month == 10
                          ? 'Oct'
                          : month == 11
                          ? 'Nov'
                          : month == 12
                          ? 'Dec'
                          : 'NA'
                      }
                      onChange={item => setMonth(item.value)}
                    />
                  </View>
                </View>
                <View
                  style={{
                    height: windowHeight * 0.7,
                    paddingBottom: 150,
                  }}>
                  <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={30}
                    initialNumToRender={10}
                    updateCellsBatchingPeriod={40}
                    data={result}
                    renderItem={({item, index}) => (
                      <TouchableOpacity onPress={() => handleClick(item)}>
                        <View style={styles.view}>
                          {(index == 0) | (index == 1) | (index == 2) ? (
                            <View style={styles.first}>
                              <Image
                                style={styles.tinyLogos}
                                source={require('../assets/Photos/userss.png')}
                              />
                              <Text style={styles.FlngatiTexti}>
                                {item.username}
                              </Text>
                              <View style={styles.views}>
                                <Image
                                  style={styles.texts}
                                  source={require('../assets/Photos/lb.png')}
                                />
                                <Text style={styles.FlngatiTextss}>
                                  {item.finalrank.toFixed()}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View style={styles.Flngati}>
                              <Image
                                style={styles.tinyLogo}
                                source={require('../assets/Photos/userss.png')}
                              />
                              <Text style={styles.FlngatiText}>
                                {item.username}
                              </Text>
                              <View style={styles.views}>
                                <Entypo
                                  style={[
                                    styles.text,
                                    {
                                      color: Color.royalblue,
                                      fontSize: 25,
                                    },
                                  ]}
                                  name="star"
                                  color={'blue'}
                                />
                                <Text style={[styles.FlngatiTexts]}>
                                  {item.finalrank.toFixed()}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  Flngati: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    width: window.WindowWidth * 0.9,
    // height: 90,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  first: {
    alignItems: 'center',
    flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,
    // height: 10,
    backgroundColor: Color.royalblue,
    paddingBottom: 5,
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  FlngatiText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: FontFamily.poppinsMedium,
    // fontFamily: 'serif',
    // fontFamily: 'serif',
    textAlign: 'left',
    flex: 1,
    fontWeight: '600',
    // paddingRight: 5,
  },
  FlngatiTexti: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    textTransform: 'capitalize',
    // fontFamily: 'serif',
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'left',
    flex: 1,
  },
  FlngatiTexts: {
    fontSize: 13,
    fontWeight: 'bold',
    justifyContent: 'center',
    // letterSpacing: 1,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    left: 20,

    textAlign: 'center',
  },
  FlngatiTextss: {
    fontSize: 15,
    fontWeight: 'bold',

    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    // marginRight: 20,
    left: 15,
    top: 5,

    textAlign: 'center',
  },
  tinyLogo: {
    width: 60,
    height: 60,
    marginLeft: 5,
    marginLeft: 10,
    marginRight: 10,

    marginTop: 10,
  },
  tinyLogos: {
    width: 70,
    height: 85,

    marginLeft: 10,
    marginRight: 10,

    marginTop: 20,
  },
  view: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  views: {
    display: 'flex',
    justifyContent: 'space-around',
    flex: 1,
    // alignItems: 'auto',
    // flexDirection: 'flexEnd',
    // textAlign: 'right',
  },

  text: {
    // marginRight: 35,
    fontWeight: 'bold',
    alignSelf: 'center',
    left: 20,
  },
  texts: {
    marginLeft: 50,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 70,
    height: 70,
    right: '5%',
  },
  FlngatiTextsy: {
    fontSize: 15,
    fontWeight: 'bold',
    justifyContent: 'center',
    letterSpacing: 1,
    fontFamily: 'cursive',
    color: 'red',
    marginRight: 33,

    textAlign: 'right',
  },
  botnavigation: {
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 2,
    overflow: 'hidden',
    // position: 'absolute',
  },
  botnavigationtext: {
    fontSize: 10.5,
    color: '#333333',
    fontFamily: FontFamily.poppinsSemibold,
  },
  name: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    color: 'black',
  },
  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  pricesymbol: {
    paddingLeft: 70,
  },
  price: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },

  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
});
const monthlist = [
  // {id: 1, name: 'Select Month'},
  {name: 'January', value: 1},
  {name: 'Febuary', value: 2},
  {name: 'March', value: 3},
  {name: 'April', value: 4},
  {name: 'May', value: 5},
  {name: 'June', value: 6},
  {name: 'July', value: 7},
  {name: 'August', value: 8},
  {name: 'September', value: 9},
  {name: 'October', value: 10},
  {name: 'November', value: 11},
  {name: 'December', value: 12},
];

// const yearList = [
//   // {id: 1, name: 'Select Year'},
//   {name: '2022', value: 2022},
//   {name: '2023', value: 2023},
//   {name: '2024', value: 2024},
//   // {name: '2025', value: 2025},
//   // {name: '2026', value: 2026},
//   // {name: '2027', value: 2027},
//   // {name: '2028', value: 2028},
//   // {name: '2029', value: 2029},
//   // {name: '2030', value: 2030},
// ];
