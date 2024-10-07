import React, {useState, useEffect} from 'react';
import * as window from '../utils/dimensions';

import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Api from '../environment/Api';
import {useSelector, useDispatch} from 'react-redux';

const DragWordComponent = ({
  data,
  renderItem,
  handleDragEnd,
  contentStatus,
}) => {
  //   const firstRowData = data.slice(0, 3);
  //   const secondRowData = data.slice(3);

  return (
    <View>
      <ScrollView horizontal showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.rowContainer}>
            <DraggableFlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.wordId}
              onDragEnd={({from, to}) => {
                handleDragEnd({
                  from: from,
                  to: to,
                  data,
                });
              }}
              horizontal={true}
              contentContainerStyle={styles.buttonContainer}
            />
          </View>
          <Image
            style={{
              width: 50,
              // width:window.WindowWidth0.8,
              top: 2,
              height: 50,

              paddingBottom: 20,
              borderRadius: 10,
              borderColor: 'black',

              alignSelf: 'center',
            }}
            source={require('../assets/Image/swap.gif')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DragWordComponent;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2ff',
    borderColor: 'black',
    borderWidth: 0.2,
    width: window.WindowWidth * 1,
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
    // backgroundColor: 'red',
  },
  buttonWrapper: {
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'blue',
    // height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeItem: {
    backgroundColor: '#ddd',
  },
});
