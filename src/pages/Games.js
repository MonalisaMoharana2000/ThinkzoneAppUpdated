import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../utils/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Api from '../environment/Api';
import Norecord from '../components/Norecord';

const Games = ({navigation, route}) => {
  const data = route.params?.data?.topicData || [];
  const user = useSelector(state => state.UserSlice.user);
  const {userid} = user[0];

  const [gamifiedData, setGamifiedData] = useState([]);
  console.log('====================================gamifiedData', gamifiedData);

  const [loading, setLoading] = useState(true); // Loading state

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const responseGamified = await Api.get(
            `/getTchTrainingGamified/${userid}/gamified/${data[0]?.topicId}`,
          );
          setGamifiedData(responseGamified?.data?.mediaProcessedData || []);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Alert.alert('Info', 'Unable to fetch game data. Please try again.', [
          //   {
          //     text: 'Ok',
          //     onPress: () => navigation.goBack(),
          //     style: 'default',
          //   },
          // ]);
        } finally {
          setLoading(false); // Ensure loading ends
        }
      };

      fetchData();
    }, [userid, data]),
  );

  const gameTypeToScreen = {
    rearrangement: {title: 'Re-arrange Words', screen: 'DragWords'},
    puzzle: {title: 'Puzzle Game', screen: 'RearrangeWords'},
    matching: {title: 'Matching Exercises', screen: 'MatchingExercises'},
    fillInBlanks: {title: 'Fill In the Blanks', screen: 'FillInTheBlanks'},
    selectFromMultiple: {
      title: 'Select From Multiple',
      screen: 'SelectFromMultiple',
    },
  };

  const uniqueGameButtons = [];
  const addedGameTypes = new Set();

  gamifiedData.forEach(item => {
    if (!addedGameTypes.has(item.gameType)) {
      uniqueGameButtons.push({
        ...gameTypeToScreen[item.gameType],
        correctAnswer: item.correctAnswer,
        otherData: item,
      });
      addedGameTypes.add(item.gameType);
    }
  });

  const rearrangementData = gamifiedData.filter(
    item => item.gameType === 'rearrangement',
  );

  console.log('rearrangementData-------->', rearrangementData);
  // const handleNavigation = button => {
  //   const {otherData, correctAnswer, screen} = button;
  //   console.log('correctAnswer----->', correctAnswer);

  //   // Prevent navigation if data is missing or invalid
  //   if (!otherData || !correctAnswer || !screen) {
  //     Alert.alert('Error', 'Invalid game data. Please try again.');
  //     return;
  //   }

  //   // Safety check for puzzle game-specific data
  //   if (
  //     button.screen === 'RearrangeWords' &&
  //     otherData?.answered === false &&
  //     !Array.isArray(correctAnswer)
  //   ) {
  //     Alert.alert('Error', 'Puzzle game data is not available or invalid.');
  //     return;
  //   }

  //   if (rearrangementData.length > 1 && otherData?.answered === false) {
  //     navigation.navigate(screen, {
  //       multipledata: rearrangementData,
  //       topicData: data,
  //       moduleData: route.params?.data,
  //       gamifiedData: gamifiedData,
  //       match: button,
  //     });
  //   } else if (otherData?.answered === true) {
  //     Alert.alert('Gamified Quiz Completed', '', [
  //       {
  //         text: 'Ok',
  //         onPress: () => null,
  //         style: 'default',
  //       },
  //     ]);
  //   } else {
  //     navigation.navigate(screen, {
  //       // singledata: correctAnswer,
  //       multipledata: rearrangementData,
  //       topicData: data,
  //       moduleData: route.params?.data,
  //       match: button,
  //       gamifiedData: gamifiedData,
  //     });
  //   }
  // };

  const handleNavigation = button => {
    const {otherData, correctAnswer, screen} = button;
    console.log('correctAnswer----->', correctAnswer);

    // Prevent navigation if data is missing or invalid
    if (!otherData || !correctAnswer || !screen) {
      Alert.alert(
        '🚫 Error',
        'Oops! Something went wrong with the game data. Please try again! 🔄',
        [{text: 'OK', onPress: () => null, style: 'default'}],
      );
      return;
    }

    // Safety check for puzzle game-specific data
    if (
      button.screen === 'RearrangeWords' &&
      otherData?.answered === false &&
      !Array.isArray(correctAnswer)
    ) {
      Alert.alert(
        '🧩 Puzzle Error',
        'Uh-oh! The puzzle data is either unavailable or invalid. Please check and try again. 🛠️',
        [{text: 'OK', onPress: () => null, style: 'default'}],
      );
      return;
    }

    if (rearrangementData.length > 1 && otherData?.answered === false) {
      navigation.navigate(screen, {
        multipledata: rearrangementData,
        topicData: data,
        moduleData: route.params?.data,
        gamifiedData: gamifiedData,
        match: button,
      });
    } else if (otherData?.answered === true) {
      Alert.alert(
        '🎉 Gamified Quiz Completed!',
        'Well done! You have completed the quiz! ✅',
        [{text: 'Awesome!', onPress: () => null, style: 'default'}],
      );
    } else {
      navigation.navigate(screen, {
        multipledata: rearrangementData,
        topicData: data,
        moduleData: route.params?.data,
        match: button,
        gamifiedData: gamifiedData,
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.royalblue} />;
  }

  return (
    <>
      {uniqueGameButtons.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.container}>
            {uniqueGameButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleNavigation(button)}>
                <Text style={styles.buttonText}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Norecord />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 280,
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 50,
    backgroundColor: Colors.royalblue,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.whiteShade,
  },
});

export default Games;
