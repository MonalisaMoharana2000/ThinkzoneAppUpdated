import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import {TextSize} from 'victory-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FabButton from '../components/FabButton';

const QuizReviewHeader = ({reviewQuestions, callbackfun}) => {
  // console.log(
  //   reviewQuestions,
  //   'reviewQuestions Quizheader--------------------->',
  // );
  const [selectedModule, setSelectedModule] = React.useState(0);
  // console.log('selectedModule----->', selectedModule);
  // const modulArr = reviewQuestions;
  // console.log(
  //   modulArr.filter(x => x.answer === x.selectedOption),
  //   'filter set-------------->',
  // );

  const postModuleid = (item, index) => {
    console.log('check index----->', item, index, selectedModule);
    callbackfun(item, index);
    setSelectedModule(index);
  };
  return (
    <ScrollView horizontal={true}>
      {reviewQuestions.map((item, index) => (
        <TouchableOpacity
          onPress={() => postModuleid(item, index)}
          key={index}
          style={{
            marginTop: 22,
            margin: 2,
            flexDirection: 'row',
            borderWidth: 2,
            width: 45.72,
            height: 46.66,
            borderRadius: 100,
            borderColor: index === selectedModule ? 'grey' : Colors.white,
            backgroundColor:
              item.selectedOption === item.answer ? '#A3D735' : '#FF9515',
            marginLeft: 19,
            // marginRight: 16,
            justifyContent: 'space-evenly',
          }}>
          <Text style={{color: 'white', padding: 10}}>{index + 1}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default QuizReviewHeader;

const styles = StyleSheet.create({});
