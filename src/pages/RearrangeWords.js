import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Api from '../environment/Api';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DragWordComponent from '../components/RearrangeWordComponent';

const RearrangeWords = ({ route }) => {
  const { multipledata, topicData, gamifiedData, match } = route.params;
  const [data, setData] = useState(multipledata);
  const navigation = useNavigation();
  const user = useSelector(state => state.UserSlice.user);
  const { userid, username, usertype, managerid, managername, passcode } = user[0];

  const renderItem = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onPressIn={match?.otherData?.answered ? null : drag}
      style={styles.buttonWrapper}>
      <Text style={styles.buttonText}>{item.wordValue}</Text>
    </TouchableOpacity>
  );

  const shuffleArray = array => {
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
          wordOrder: index + 1,
        })),
      };
    });
    setData(updatedData);
  }, [multipledata]);

  const handleDragEnd = (newData, questionId) => {
    setData(prevData => {
      return prevData.map(questionData => {
        if (questionData.questionId === questionId) {
          const updatedCorrectAnswer = newData.map((item, index) => ({
            ...item,
            wordOrder: index + 1,
          }));
          return {
            ...questionData,
            correctAnswer: updatedCorrectAnswer,
          };
        }
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
      userid,
      username,
      usertype,
      answered: 'yes',
      managerid,
      managername,
      passcode,
      transGamifiedData: updatedData,
      masterGamifiedData: gamifiedData,
    };

    try {
      const res = await Api.post('saveTransTchTrainingGamified', body);
      if (res.status === 200) {
        Alert.alert(res.data.msg, '', [
          { text: 'Ok', onPress: () => navigation.goBack(), style: 'default' },
        ]);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={true}>
      {data.map((questionData, index) => (
        <View key={questionData.questionId}>
          <Text style={styles.questionText}>
            Question {index + 1}: {questionData.question}
          </Text>

          {questionData.instructions?.length > 0 && (
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionTitle}>Instruction</Text>
              <Text style={styles.instructionText}>{questionData.instructions}</Text>
            </View>
          )}

          {questionData.hints?.length > 0 && (
            <View style={styles.hintsContainer}>
              <Text style={styles.hintsTitle}>Hints</Text>
              <Text style={styles.hintsText}>{questionData.hints}</Text>
            </View>
          )}

          {questionData?.gameQuestionMedia && (
            <Image
              source={{ uri: questionData?.gameQuestionMedia }}
              style={styles.image}
            />
          )}
          
          <GestureHandlerRootView>
            <DragWordComponent
              data={
                questionData.inputAnswer.length > 0
                  ? questionData.inputAnswer
                  : questionData.correctAnswer
              }
              renderItem={renderItem}
              handleDragEnd={newData => handleDragEnd(newData, questionData.questionId)}
            />
          </GestureHandlerRootView>
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={match?.otherData?.answered ? handleBack : handleSave}>
        <Text style={styles.buttonText}>
          {match?.otherData?.answered ? 'Back' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RearrangeWords;

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
    color: 'black',
  },
  button: {
    backgroundColor: '#0060ca',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  instructionContainer: {
    backgroundColor: '#eef6ff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#cce0ff',
    borderWidth: 1,
    marginBottom: 15,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 5,
    textAlign: 'center',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 15,
  },
  hintsContainer: {
    backgroundColor: '#eef6ff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#cce0ff',
    borderWidth: 1,
    marginBottom: 15,
  },
  hintsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 5,
    textAlign: 'center',
  },
  hintsText: {
    textAlign: 'center',
    fontSize: 15,
  },
  image: {
    width: '100%',
    padding: '22%',
    marginBottom: 10,
  },
});
