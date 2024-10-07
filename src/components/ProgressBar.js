import {StyleSheet, Text, View, Animated} from 'react-native';
import React, {useState} from 'react';
import Color from '../utils/Colors';

const ProgressBar = ({total, complete}) => {
  console.log(total, complete, 'complete');
  const [progress, setProgress] = useState(new Animated.Value(0));
  const progressAnim = progress.interpolate({
    inputRange: [0, total],
    outputRange: ['0%', '100%'],
  });
  Animated.timing(progress, {
    toValue: complete,
    duration: 1000,
    useNativeDriver: false,
  }).start();

  // Animated.timing(progress, {
  //   toValue: 0,
  //   duration: 1000,
  //   useNativeDriver: false,
  // }).start();
  return (
    <View
      style={{
        width: '80%',
        height: 8,
        borderRadius: 30,
        backgroundColor: '#00000020',
        left: 100,
        top: -20,
      }}>
      <Animated.View
        style={[
          {
            height: 8,
            borderRadius: 20,
            backgroundColor: '#A3D735',
            //  Color.success,
          },
          {
            width: progressAnim,
          },
        ]}></Animated.View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
