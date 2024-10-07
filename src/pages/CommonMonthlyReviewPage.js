import React, {useEffect, useState} from 'react';
import {Text, View, Alert, BackHandler, styles} from 'react-native';
// import ReviewPage from '../components/ReviewPage';
import API from '../environment/Api';
import {useSelector, useDispatch} from 'react-redux';
import Loading from '../components/Loading';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import * as window from '../utils/dimensions';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';

const CommonMonthlyReviewPage = ({navigation, route}) => {
  const data = route.params.topic;
  const {topicId} = data;
  console.log(topicId);
  const user = useSelector(state => state.userdata.user.resData);
  // console.log('user------>', user);

  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const [topicQuizData, setTopicQuizData] = useState([]);
  console.log('topicQuizData---------------->', topicQuizData, userid);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const responseQuiz = await API.get(
          //   `/getTchTrainingQuiz/${user[0].userid}/${dataType}/${topicId}`,
          `/getTransTtlQuizQuestions/${user[0].userid}/${topicId}`,
        );
        console.log(
          'resquizreview-------------',
          responseQuiz.data[0].quizData,
        );
        setTopicQuizData(responseQuiz.data[0].quizData);

        setIsLoading(false);
      } catch (error) {
        if (error.response.status === 504) {
          setIsLoading(false);
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          setIsLoading(false);
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
          <View style={{flex: 1, alignSelf: 'center', top: '20%', left: '25%'}}>
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

            {/* <ReviewPage topicQuizData={topicQuizData} navigation={navigation} /> */}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default CommonMonthlyReviewPage;
