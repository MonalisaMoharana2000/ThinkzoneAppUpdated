import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as window from '../utils/dimensions';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const Norecord = ({route}) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        // backgroundColor: Color.primaryContrast,
        // flex: 1,
      }}>
      <Image
        source={require('../assets/Image/cat-playing-animation.gif')}
        style={{
          // width: '100%',
          top: 20,
          alignSelf: 'center',
          // height: 196,
          // right: 20,
          // position: 'absolute',
          // alignSelf: 'center'posi
        }}
      />
      <View style={{}}>
        {/* <Text style={styles.Fln}>Network Error</Text> */}

        <Text style={styles.Fln}>
          It looks like there's nothing here. We're working on adding more data
          soon!
        </Text>
      </View>
    </View>
  );
};

export default Norecord;

const styles = StyleSheet.create({
  submit: {
    width: 140,
    height: 60,
    marginLeft: 120,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,

    marginTop: 40,
  },
  Fln: {
    color: '#595F65',
    fontSize: 13,
    // top: 50,
    marginTop: 160,
    fontFamily: FontFamily.poppinsMedium,
    paddingBottom: 40,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: 370,
    // paddingLeft: 20,
    // paddingRight: 40,
    textAlign: 'center',
    alignSelf: 'center',
    bottom: 0,
  },
});
