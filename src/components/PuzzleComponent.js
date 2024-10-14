import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
const {width} = Dimensions.get('window');
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const shuffleArray = array => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function getIdSequence(arr) {
  return arr.map(item => item.wordOrder);
}

const PuzzleItem = ({
  levels,
  onDragEnd,

  handleSave,

  answered,
}) => {
  const [data, setData] = useState(levels);

  const colors = [
    '#rgb(255,153,153)',
    '#FFB380',
    '#FFFF99',
    '#90EE90',
    '#800080',
  ];

  const updatedArray = levels.map((item, index) => ({
    ...item,
    color: colors[index],
  }));

  useEffect(() => {
    setData(shuffleArray([...updatedArray]));
  }, [levels]);

  const levelHeight = levels.length > 0 ? 400 / levels.length : 67;

  const handleDragEnd = ({data}) => {
    console.log('datadrag----->', data);
    setData(data);
    onDragEnd(data);
    const sequence1 = getIdSequence(data);
    const sequence2 = getIdSequence(levels);
    console.log('sequence1--->', sequence1);
    console.log('sequence2--->', sequence2);
    const areSequencesEqual =
      JSON.stringify(sequence1) === JSON.stringify(sequence2);
    console.log(areSequencesEqual);
    if (areSequencesEqual) {
      Alert.alert('Matched', '', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {
          text: 'Ok',
          onPress: () => handleSave(),
          style: 'default',
        },
      ]);
    }
  };

  return (
    <View style={styles.puzzleItem}>
      <View style={styles.bulb}>
        <DraggableFlatList
          data={data}
          onDragEnd={handleDragEnd}
          keyExtractor={item => item.wordOrder}
          renderItem={({item, drag, isActive}) => (
            console.log('word item--->', item),
            (
              <TouchableOpacity
                onPressIn={answered ? null : drag}
                style={[
                  styles.level,
                  {
                    backgroundColor: isActive ? 'gray ' : item.color,
                    height: levelHeight,
                  },
                ]}>
                <Text style={styles.levelText}>{item.wordValue}</Text>
              </TouchableOpacity>
            )
          )}
        />
      </View>
    </View>
  );
};

const PuzzleComponent = ({
  puzzles,
  handleDragEnd,
  contentStatus,
  handleSave,
  answered,
}) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <DraggableFlatList
          data={puzzles}
          renderItem={({item, index}) => (
            console.log('item------------->', item),
            (
              <PuzzleItem
                levels={
                  answered
                    ? item?.otherData?.inputAnswer
                    : item.value
                    ? item.value
                    : item.correctAnswer
                }
                onDragEnd={newLevels => handleDragEnd(index, newLevels)}
                handleSave={handleSave}
                contentStatus={contentStatus}
                answered={answered}
              />
            )
          )}
          keyExtractor={(item, index) => `puzzle-${index}`}
          horizontal
          pagingEnabled
        />
        <Image
          style={{
            width: 70,
            height: 70,
            position: 'absolute',
            right: 0,
            zIndex: 5,
            alignSelf: 'center',
            bottom: 0,
          }}
          source={require('../assets/Image/top.gif')}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default PuzzleComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ff',
    // paddingTop: 10,
    // padding: 10,
    // margin: '1%',
    alignSelf: 'center',
  },
  puzzleItem: {
    width: width,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  ovalShape: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: screenHeight * 0.25,
    padding: 10,
  },
  bulb: {
    width: 300,
    height: 400,
    borderRadius: 140,
    overflow: 'hidden',
    backgroundColor: '#49a0ff61',

    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Android Shadow
    elevation: 20,
  },

  level: {
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeLevel: {
    opacity: 0.7,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
