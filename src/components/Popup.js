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
import {Modalize} from 'react-native-modalize';

import {ScrollView} from 'react-native-gesture-handler';
import * as window from '../utils/dimensions';

const Popup = ({
  modalVisible,
  data,
  width,
  height,
  navigation,
  onClick,
  backgroundColor,
  title,
  subTitle,
  IconComponent,
  IconComponent1,
  onPress,

  image,

  color,
}) => {
  console.log(data, 'leader');
  const [modal, setModal] = useState(true);
  return (
    <View
      style={[
        styles.centeredView,
        {
          backgroundColor: backgroundColor,
          color: color,
          width: width,
          height: height,
        },
      ]}>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {IconComponent}
              {IconComponent1}
              {image && <Image style={styles.image} source={image} />}
              <Text style={styles.username}>{title}</Text>

              <Text style={[styles.subTitle]}>{subTitle}</Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Image
                  style={{width: 80, height: 80}}
                  source={require('../assets/Photos/back.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
      {/* <TouchableOpacity
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
        </TouchableOpacity> */}
    </View>
  );
};

export default Popup;

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
    width: window.WindowWidth * 1,
    // height: 900,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  // buttonClose: {
  //   backgroundColor: '#2196F3',
  // },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'serif',
    color: '#01507B',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '900',
  },
  username: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#01507B',

    marginBottom: 15,
    paddingBottom: 50,
    textAlign: 'center',
    fontWeight: '900',
  },
  subTitle: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'serif',

    marginBottom: 15,
    paddingBottom: 50,

    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '900',
  },
  score: {
    fontSize: 15,
    fontFamily: 'serif',
    color: '#01507B',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '900',
  },
  tinyLogos: {
    width: 120,
    height: 120,
    marginLeft: 22,

    marginTop: -30,
  },
});
