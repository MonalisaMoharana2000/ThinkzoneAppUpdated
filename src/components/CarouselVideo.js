import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Color from '../utils/Colors';
import * as window from '../utils/dimensions';
// import VideoPlayer from 'react-native-video-controls';
import VideoPlayer from 'react-native-video-player';
const CarouselVideo = ({data, navigation}) => {
  useEffect(() => {
    // Pause the video when navigating away from the screen
    const unsubscribe = navigation.addListener('blur', () => {
      // Pause the video when the screen loses focus
      if (videoRef.current) {
        videoRef.current.pause();
      }
    });

    // Cleanup function to unsubscribe from the event
    return unsubscribe;
  }, [navigation]);

  const videoRef = React.createRef();
  // console.log('data------>', data);
  return (
    // <View style={styles.videoContainer}>
    //   <VideoPlayer
    //     ref={videoRef}
    //     source={{uri: data}}
    //     // autoplay={index === focusedIndex}
    //     style={styles.video}
    //     resizeMode="cover"
    //     disableFullscreen
    //   />
    // </View>
    <VideoPlayer
      video={{uri: data}}
      style={{
        width: '100%',
        height: 300,
      }}
      autoplay
      showDuration
      control={true}
    />
  );
};

export default CarouselVideo;

const styles = StyleSheet.create({
  videoContainer: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  video: {
    // flex: 1,
    width: 320,
    height: 200,
  },
});
