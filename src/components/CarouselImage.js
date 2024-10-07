import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Color from '../utils/Colors';
import * as window from '../utils/dimensions';

const CarouselImage = ({data}) => {
  // console.log('data------>', data);
  return (
    <View>
      <Image
        source={{uri: data}}
        resizeMode="contain"
        style={{
          height: window.WindowHeigth * 0.2,
          width: window.WindowWidth * 0.9,
          borderRadius: 2,
          // borderWidth: 0.8,
          borderColor: 'black',
        }}
      />
    </View>
  );
};

export default CarouselImage;

const styles = StyleSheet.create({});
