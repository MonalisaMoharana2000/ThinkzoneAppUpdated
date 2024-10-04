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

const Loading = ({route}) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        // backgroundColor: Color.primaryContrast,
        // flex: 1,
      }}>
      <Image
        source={require('../assets/Image/boy_studying.gif')}
        // source={require('../assets/Image/walking_pencil.gif')}
        style={{
          width: 400,
          top: 36,
          alignSelf: 'center',
          height: 450,
          right: -10,
          //   position: 'absolute',
          //   alignSelf: 'center'
        }}
      />
      <View style={{}}>
        <Text style={styles.loadingText}>Just a sec...</Text>
      </View>
    </View>
  );
};

export default Loading;

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
  loadingText: {
    color: '#595F65',
    fontSize: 20,
    // top: 50,
    marginTop: 73,
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
    fontWeight: 'bold',
  },
});
