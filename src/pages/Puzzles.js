import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import Api from '../environment/Api';
import RearrangeComponent from '../components/PuzzleComponent';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PuzzleComponent from '../components/PuzzleComponent';

const Puzzles = ({route}) => {
  const data = route?.params?.match;
  const gameData = route?.params?.gamifiedData;

  const topicData = route?.params?.topicData;
  const wholeData = route.params?.match;
  console.log('wholeData---------->', data);
  const user = useSelector(state => state.UserSlice.user);

  const {userid, username, usertype, managerid, managername, passcode} =
    user[0];

  const navigation = useNavigation();
  const [puzzles, setPuzzles] = useState([data]);
  console.log('game puzzles-------->', puzzles);
  // console.log('game puzzles2-------->', puzzles[0].otherData);
  const [shuffle, setShuffle] = useState([]);
  // const [puzzles, setPuzzles] = useState([

  //   {
  //     title: 'Puzzle 1',
  //     levels: [
  //       {id: 1, key: 'evaluate', text: 'evaluate', color: '#FF0000'},
  //       {id: 2, key: 'create', text: 'create', color: '#FFA500'},
  //       {id: 3, key: 'understanding', text: 'understanding', color: '#00ffff'},
  //       {id: 4, key: 'analyze', text: 'analyze', color: '#00FF00'},
  //       {id: 5, key: 'apply', text: 'apply', color: '#0000FF'},
  //       {id: 6, key: 'remember', text: 'remember', color: '#800080'},
  //     ],
  //   },
  // ]);

  const handleDragEnd = (index, newLevels) => {
    console.log('sequence----->', index, newLevels);
    setShuffle(newLevels);

    setPuzzles(currentPuzzles =>
      currentPuzzles.map((puzzle, i) =>
        i === index ? {...puzzle, levels: newLevels} : puzzle,
      ),
    );
  };

  const handleMatched = () => {};

  const handleSave = async () => {
    const updatedGamifiedData = {
      ...wholeData?.otherData,
      answered: true,
      inputAnswer: shuffle,
    };

    const updatedShuffle = {
      ...wholeData?.otherData,
      answered: true,
      correctAnswer: shuffle,
    };

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
      transGamifiedData: [updatedGamifiedData],
      masterGamifiedData: gameData,
      // inputAnswer: shuffle,
    };
    console.log('game body----->', body);

    console.log('game body2----->', updatedGamifiedData);
    console.log('game body1----->', gameData);
    try {
      const res = await Api.post(`saveTransTchTrainingGamified`, body);
      console.log('response------->', res.data);

      if (res.status === 200) {
        Alert.alert(`${res.data.msg}`, '', [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ]);
      } else {
        navigation.goBack();
      }
    } catch (err) {
      console.log('err---->', err);
    }
  };

  return (
    <ScrollView>
      <View style={{justifyContent: 'space-between', flex: 1, margin: '5%'}}>
        {wholeData?.otherData && (
          <>
            {wholeData?.otherData?.instructions?.length > 0 ? (
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
                <Text
                  style={[styles.title, {textAlign: 'center', fontSize: 15}]}>
                  {wholeData?.otherData?.instructions}
                </Text>
              </View>
            ) : null}

            {wholeData?.otherData?.hints?.length > 0 ? (
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
                <Text
                  style={[styles.title, {textAlign: 'center', fontSize: 15}]}>
                  {wholeData?.otherData?.hints}
                </Text>
              </View>
            ) : null}
          </>
        )}
        {wholeData?.otherData?.gameQuestionMedia?.length > 0 && (
          <View
            style={
              {
                // width: window.WindowWidth * 0.8,
                // alignSelf: 'center',
                // borderColor: Color.royalblue,
                // borderWidth: 0.5,
                // margin: 15,
                // padding: 13,
                // borderRadius: 10,
                // paddingBottom: 10,
              }
            }>
            <Image
              source={{uri: `${wholeData?.otherData?.gameQuestionMedia}`}}
              style={{
                width: '100%',
                padding: '22%',
                marginBottom: 15,
              }}
            />
          </View>
        )}
        <GestureHandlerRootView>
          <PuzzleComponent
            puzzles={puzzles}
            handleDragEnd={handleDragEnd}
            handleSave={handleMatched}
            answered={data?.otherData?.answered}
          />
        </GestureHandlerRootView>

        <TouchableOpacity
          style={[
            styles.button,
            data?.otherData?.answered ? styles.disabledButton : {},
          ]}
          disabled={data?.otherData?.answered}
          onPress={data?.otherData?.answered ? null : handleSave}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Puzzles;

const styles = StyleSheet.create({
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
  disabledButton: {
    backgroundColor: '#cccccc',
    textShadowColor: 'transparent',
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
    paddingBottom: 20,
    fontWeight: '600',
  },
});
