import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Colors from '../utils/Colors';
import Loading from '../components/Loading';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const MatchingExercises = ({route}) => {
  const user = useSelector(state => state.UserSlice.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const answered = route?.params?.match;
  const data = route.params.topicData;
  const topicId = data[0].topicId;
  const navigation = useNavigation();
  const [correctAnswerCount, setCorrectAnswerCount] = useState(false);
  const [webviewKey, setWebviewKey] = useState(0); // State to trigger reload
  const [webViewMessage, setWebViewMessage] = useState(''); // State to store WebView message

  // Function to reload the WebView
  const reloadWebView = () => {
    setWebviewKey(prevKey => prevKey + 1); // Update key to reload WebView
  };

  // Handle the back button press
  const handleBackButtonPress = useCallback(() => {
    Alert.alert(
      'Confirm Exit',
      'Are you sure you want to go back? The page will reload.',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            reloadWebView(); // Reload the page
            navigation.goBack(); // Go back to the previous page
          },
        },
      ],
      {cancelable: false},
    );
    return true;
  }, [navigation]);

  // UseEffect to add BackHandler listener
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, [handleBackButtonPress]);

  const IndicatorLoadingView = () => {
    return <Loading />;
  };

  // Function to handle messages from the WebView
  const handleMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('data---------->', data);
    if (data.correctAnswerCount) {
      setCorrectAnswerCount(data.correctAnswerCount);
      Alert.alert('', 'Matching Saved!', [
        // {
        //   text: 'Cancel',
        //   onPress: () => null,
        //   style: 'default',
        // },
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
          style: 'default',
        },
      ]);
    } else if (data.allAnswer) {
      Alert.alert('', `${data.allAnswer}`, [
        // {
        //   text: 'Cancel',
        //   onPress: () => null,
        //   style: 'default',
        // },
        {
          text: 'Ok',
          onPress: () => null,
          style: 'default',
        },
      ]);
    } else {
      Alert.alert('', 'Matching Saved failed!', [
        // {
        //   text: 'Cancel',
        //   onPress: () => null,
        //   style: 'default',
        // },
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
          style: 'default',
        },
      ]);
    }
  };

  const injectDataToWeb = () => {
    const script = `
      window.postMessage(${JSON.stringify(answered?.otherData)}, "*");
    `;
    return script;
  };

  return (
    <View style={styles.container}>
      <WebView
        key={webviewKey} // Key to trigger WebView reload
        source={{
          uri: `https://checkserver.azurewebsites.net/matching/${userid}/${username}/${usertype}/${managerid}/${managername}/${passcode}/${topicId}`,
        }}
        style={styles.webview}
        renderLoading={IndicatorLoadingView}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage} // Listen for messages from WebView
        injectedJavaScript={injectDataToWeb()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  button: {
    backgroundColor: '#0060ca',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    alignItems: 'center',
    top: '1.5%',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
});

export default MatchingExercises;
