import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import Api from '../environment/Api';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import DragWordComponent from '../components/RearrangeWordComponent';
import {useNavigation} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const RearrangeWords = ({route}) => {
  const {multipledata, topicData, gamifiedData, match} = route.params;
  const [data, setData] = useState(multipledata);
  console.log('multipledata-------->', match);

  const navigation = useNavigation();
  const user = useSelector(state => state.UserSlice.user);
  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const renderItem = ({item, drag, isActive}) => (
    <TouchableOpacity
      onPressIn={match?.otherData?.answered ? null : drag}
      style={styles.buttonWrapper}>
      <Text style={styles.buttonText}>{item.wordValue}</Text>
    </TouchableOpacity>
  );
  const shuffleArray = array => {
    // Make a copy of the array to avoid mutating the original
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  useEffect(() => {
    const updatedData = multipledata?.map(item => {
      const shuffledCorrectAnswer = shuffleArray(item.correctAnswer || []);
      return {
        ...item,
        correctAnswer: shuffledCorrectAnswer.map((ans, index) => ({
          ...ans,
          wordOrder: index + 1, // Update wordOrder based on shuffled position
        })),
      };
    });

    console.log('updatedData----------->', updatedData);
    setData(updatedData);
  }, [multipledata]);

  const handleDragEnd = (newData, questionId) => {
    // if (!Array.isArray(newData?.data)) {
    //   console.error('newData is not an array:', newData);
    //   return; // Prevent further processing
    // }
    console.log('newData--------->', newData);
    setData(prevData => {
      return prevData.map(questionData => {
        if (questionData.questionId === questionId) {
          // Update only the specific question's correctAnswer array
          const updatedCorrectAnswer = newData?.map((item, index) => ({
            ...item,
            wordOrder: index + 1, // Update wordOrder based on the new position
          }));

          console.log('updatedCorrectAnswer--------->', updatedCorrectAnswer);

          return {
            ...questionData,
            correctAnswer: updatedCorrectAnswer,
          };
        }

        // Return other question data unchanged
        return questionData;
      });
    });
  };

  const handleSave = async () => {
    const updatedData = data.map(item => ({
      ...item,
      answered: true,
      inputAnswer: item.correctAnswer,
    }));

    const body = {
      gamifiedSecuredMarks: 1,
      gamifiedTotalMarks: 3,
      topicId: topicData[0].topicId,
      userid: userid,
      username: username,
      usertype: usertype,
      answered: 'yes',
      managerid: managerid,
      managername: managername,
      passcode: passcode,
      transGamifiedData: updatedData,
      masterGamifiedData: gamifiedData,
    };

    console.log('data1------>', updatedData);
    console.log('data------>', data[0]);

    try {
      const res = await Api.post('saveTransTchTrainingGamified', body);
      if (res.status === 200) {
        Alert.alert(res.data.msg, '', [
          {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
        ]);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {data.map((questionData, index) => (
        <View key={questionData.questionId}>
          <Text style={styles.questionText}>
            Question {index + 1}: {questionData.question}
          </Text>

          {questionData.instructions?.length > 0 ? (
            <View
              style={{
                backgroundColor: '#eef6ff',
                padding: 10,
                borderRadius: 8,
                borderColor: '#cce0ff',
                borderWidth: 1,
                marginBottom: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#0056b3',
                  marginBottom: 5,
                  textAlign: 'center',
                }}>
                Instruction
              </Text>
              <Text style={[styles.title, {textAlign: 'center', fontSize: 15}]}>
                {' '}
                {/* {item.questionOrder}.{item.question} */}
                {questionData.instructions}
              </Text>
            </View>
          ) : null}

          {questionData.hints?.length > 0 ? (
            <View
              style={{
                backgroundColor: '#eef6ff',
                padding: 10,
                borderRadius: 8,
                borderColor: '#cce0ff',
                borderWidth: 1,
                marginBottom: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#0056b3',
                  marginBottom: 5,
                  textAlign: 'center',
                }}>
                Hints
              </Text>
              <Text style={[styles.title, {textAlign: 'center', fontSize: 15}]}>
                {' '}
                {/* {item.questionOrder}.{item.question} */}
                {questionData.hints}
              </Text>
            </View>
          ) : null}

          {questionData?.gameQuestionMedia ? (
            <Image
              source={{uri: questionData?.gameQuestionMedia}}
              style={{width: '100%', padding: '22%', marginBottom: 10}}
            />
          ) : null}
          <GestureHandlerRootView>
            <DragWordComponent
              data={
                questionData.inputAnswer.length > 0
                  ? questionData.inputAnswer
                  : questionData.correctAnswer
              }
              renderItem={renderItem}
              handleDragEnd={newData =>
                handleDragEnd(newData, questionData.questionId)
              } // Pass questionId
            />
          </GestureHandlerRootView>
        </View>
      ))}
      <TouchableOpacity
        style={[
          styles.button,
          match?.otherData?.answered ? styles.disabledButton : {},
        ]}
        disabled={match?.otherData?.answered}
        onPress={match?.otherData?.answered ? null : handleSave}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RearrangeWords;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    textShadowColor: 'transparent',
  },
  buttonWrapper: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#0060ca',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    alignItems: 'center',
    top: '-1%',
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
