import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import Colors from '../utils/Colors';
import Loading from '../components/Loading';
import {useSelector, useDispatch} from 'react-redux';
import API from '../environment/Api';

const MatchingExercises = ({navigation, route}) => {
  const user = useSelector(state => state.UserSlice.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];
  const data = route.params.topicData;
  const topicId = data[0].topicId;
  console.log(
    '====================================user1',
    userid,
    username,
    usertype,
    managerid,
    passcode,
    managername,
    username,
  );
  const IndicatorLoadingView = () => {
    return (
      // <ActivityIndicator
      //   size="large"
      //   color={Colors.primary}
      //   style={{
      //     justifyContent: 'center',
      //     alignSelf: 'center',
      //     position: 'absolute',
      //     top: 50,
      //     bottom: 50,
      //   }}
      // />
      <Loading />
    );
  };
  // cons
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: `https://checkserver.azurewebsites.net/matching/${userid}/${username}/${usertype}/${managerid}/${managername}/${passcode}/${topicId}`,
        }}
        style={styles.webview}
        renderLoading={IndicatorLoadingView}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
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
});

export default MatchingExercises;
