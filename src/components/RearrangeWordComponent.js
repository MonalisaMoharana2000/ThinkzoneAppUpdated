import React from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

const DragWordContent = ({data, setData, renderItem, handleDragEnd}) => {
  const onDragEnd = ({from, to}) => {
    const updatedData = [...data];
    const movedItem = updatedData.splice(from, 1)[0]; // Remove item at 'from' index
    updatedData.splice(to, 0, movedItem); // Insert item at 'to' index

    // Update state with the new order
    // setData(updatedData);

    // Call the provided handleDragEnd function with updated data
    handleDragEnd({data: updatedData});
  };

  return (
    <View>
      <ScrollView horizontal showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.rowContainer}>
            <DraggableFlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.wordId.toString()}
              onDragEnd={onDragEnd}
              horizontal={true}
              contentContainerStyle={styles.buttonContainer}
            />
          </View>
          <Image
            style={styles.swapImage}
            source={require('../assets/Image/swap.gif')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DragWordContent;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2ff',
    borderColor: 'black',
    borderWidth: 0.2,
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 12,
    paddingTop: 25,
  },
  buttonContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  swapImage: {
    width: 50,
    height: 50,
    paddingBottom: 20,
    borderRadius: 10,
    borderColor: 'black',
    alignSelf: 'center',
  },
});
