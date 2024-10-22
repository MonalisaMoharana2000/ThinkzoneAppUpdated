import React, {useEffect, useState} from 'react';
import {Text, View, Alert, BackHandler, style} from 'react-native';
import ReviewPage from '../components/ReviewPage';
import API from '../environment/Api';
import {useSelector, useDispatch} from 'react-redux';
import Loading from '../components/Loading';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import * as window from '../utils/dimensions';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';

const ReviewQuizPage = ({navigation, route}) => {
  const data = route.params.data;

  const {topicId} = data;
  const dataType = route.params.data_type;
  console.log('data check---->', data, dataType);

  const user = useSelector(state => state.UserSlice.user);
  console.log('user------>', user);

  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const [topicQuizData, setTopicQuizData] = useState([]);
  // console.log('====================================quiz1', topicQuizData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const responseQuiz = await API.get(
          `getTchTrainingQuiz/${user[0].userid}/${dataType}/${topicId}`,
        );
        console.log('resquizreview-------------', responseQuiz.data);
        setTopicQuizData(
          responseQuiz.data.quiz1Data
            ? responseQuiz.data.quiz1Data
            : responseQuiz.data.quiz2Data,
        );
        // setImageUrls(prevImageUrls => ({
        //   ...prevImageUrls,
        //   [questionId]: image,
        // }));
        // const responseQuiz2 = await API.get(
        //   `/getTchTrainingQuiz/${user[0].userid}/quiz2/${topicId}`,
        // );
        // console.log('resquiz2-------------', responseQuiz2.data);
        // setTopicQuizData2(responseQuiz2.data.quiz2Data);

        setIsLoading(false);
      } catch (error) {
        if (error.response.status === 413) {
          console.log('error is---------------->', error);
          setIsLoading(false);
          Alert.alert('The entity is too large !');
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
          setIsLoading(false);
          Alert.alert('Gateway Timeout: The server is not responding!');
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={{alignSelf: 'center', right: '27%'}}>
        {isLoading ? (
          <View style={{alignSelf: 'center', left: '20%'}}>
            <Loading />
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: '#0060ca',
                height: 66,
                width: window.WindowWidth * 1.1,

                marginLeft: '45%',
                paddingBottom: 20,
                // marginTop: -50,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  marginTop: 15,
                  alignSelf: 'flex-start',
                  left: '15%',
                  top: 5,
                }}>
                {data.topicName}
              </Text>
            </View>
            <View
              style={{
                width: window.WindowWidth * 0.92,
                alignSelf: 'center',
                // top: 50,
                margin: 10,
                backgroundColor: Color.ghostwhite,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Color.royalblue,
                left: '27%',
                padding: 5,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  // alignSelf: 'center',
                  // backgroundColor: Color.white,
                  top: '17.5%',
                  paddingBottom: 20,
                  // paddingTop: 15,
                  borderRadius: 12,
                  fontWeight: '700',
                  fontSize: 20,

                  color: 'black',
                  fontFamily: FontFamily.poppinsSemibold,
                }}>
                Review Quiz
              </Text>
            </View>
            <ReviewPage topicQuizData={topicQuizData} navigation={navigation} />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewQuizPage;
