import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useEffect, useState, useCallback, useRef} from 'react';
import React from 'react';
import {Color, FontFamily} from '../GlobalStyle';
import * as window from '../utils/dimensions';

const ModalComponent = ({modalVisible, data, navigation, onClick}) => {
  console.log(data, 'leader');
  const [modal, setModal] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.tinyLogos}
              source={require('../assets/Photos/userss.png')}
            />
            <View style={{alignSelf: 'center', justifyContent: 'space-evenly'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/user-tag.png')}
                />
                <Text style={styles.username}>
                  User Name - <Text style={{width: 50}}>{data.username}</Text>
                </Text>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/user-search.png')}
                />
                <Text style={styles.username}>
                  Manager Name - {data.managername}
                </Text>
              </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/location.png')}
                />
                <Text style={styles.username}>
                  Place - {data.blockname},{data.districtname}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/user-search.png')}
                />
                <Text style={[styles.username, {textTransform: 'capitalize'}]}>
                  Manager - {''}
                  {data.managername}
                </Text>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/books.png')}
                />
                <Text style={styles.username}>
                  ପ୍ରସ୍ତୁତି Mark - {data.secured_monthly}/{data.total_monthly}
                </Text>
              </View> */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/timer.png')}
                />
                <Text style={styles.username}>
                  Spent - {data.spent_time} Minutes
                </Text>
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={styles.img}
                  source={require('../assets/Image/chart-success.png')}
                />
                <Text style={styles.username}>
                  Total Score - {data.finalrank}
                </Text>
              </View>
            </View>
            {/* <Text style={styles.username}>
              <Image source={require('../assets/Image/user-tag.png')} />
              {''}
              <Text style={{width: 60}}>User Name:- {data.username}</Text>
            </Text> */}
            {/* <Text style={[styles.username, {textTransform: 'capitalize'}]}>
              <Image source={require('../assets/Image/user-search.png')} />{' '}
              Manager - {''}
              {data.managername}
            </Text>
            <Text style={[styles.username, {textTransform: 'capitalize'}]}>
              <Image source={require('../assets/Image/location.png')} /> Place -{' '}
              {''}
              {''}
              {data.block}, {''}
              {data.district}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.username}>
                {' '}
                <Image source={require('../assets/Image/books.png')} />{' '}
                ପ୍ରସ୍ତୁତି Mark- {''}
              </Text>
              {data.secured_monthly}/{data.total_monthly}
            </Text>

            <Text style={styles.modalText}>
              <Text style={styles.username}>
                {' '}
                <Image source={require('../assets/Image/timer.png')} /> Time
                Spent -{' '}
              </Text>
              {data.spent_time} Minutes
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.username}>
                {' '}
                <Image
                  source={require('../assets/Image/chart-success.png')}
                />{' '}
                Total Score -{' '}
              </Text>
              {data.finalrank}
            </Text> */}
            <TouchableOpacity
              style={{
                width: 250,
                height: 44,
                backgroundColor: Color.royalblue,
                borderRadius: 50,
                marginTop: 30,
              }}
              onPress={onClick}>
              <Text style={styles.textStyle}>Okay, take me to the list</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: window.WindowWidth * 0.92,
    // paddingTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    justifyContent: 'space-evenly',
    fontFamily: FontFamily.poppinsMedium,
  },
  modalText: {
    fontSize: 13,
    fontFamily: FontFamily.poppinsMedium,
    color: '#000000',
    marginBottom: 15,
    width: 250,
    textAlign: 'left',
    fontWeight: '700',
  },
  username: {
    fontSize: 13,
    fontFamily: FontFamily.poppinsMedium,
    // color: '#01507B',
    color: '#000000',
    width: 250,
    textTransform: 'capitalize',
    marginBottom: 15,
    textAlign: 'left',
    fontWeight: '700',
    left: 10,
  },
  score: {
    fontSize: 15,
    fontFamily: FontFamily.poppinsMedium,
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '900',
  },
  tinyLogos: {
    width: 150,
    height: 150,
    // marginLeft: 12,
    alignSelf: 'center',

    // marginTop: -30,
  },
  img: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    width: 22,
    height: 22,
    // paddingRight: 20,
  },
});
