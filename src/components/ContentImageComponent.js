import {StyleSheet, Text, View, FlatList, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import * as SIZES from '../utils/dimensions';
import CustomModal from './CustomModal';

const ContentImageComponent = ({item, onEnd, itemContent}) => {
  const [modalVisibile, setModalVisibile] = useState(false);
  const data = item;
  console.log(data, 'data');
  const onEndContent = () => {
    setModalVisibile(true);
    // Alert.alert(
    //   'Successfully Complete.',
    //   'Continue to Quiz',
    //   [
    //     {
    //       text: 'Cancel',
    //       // onPress: () => Alert.alert('Cancel Pressed'),
    //       style: 'destructive',
    //     },
    //     {
    //       text: 'OK',
    //       onPress: () => submitFun(),
    //       style: 'destructive',
    //     },
    //   ],
    //   {cancelable: false},
    // );
  };
  const submitFun = () => {
    onEnd(true);
  };
  return (
    <>
      <CustomModal visible={modalVisibile} />
      <View>
        <FlatList
          data={data}
          onEndReached={onEndContent}
          renderItem={({item}) => (
            <Image
              source={{uri: item[itemContent]}}
              style={{
                width: SIZES.WindowWidth,
                height: SIZES.WindowHeigth,
                borderWidth: 2,
                resizeMode: 'contain',
              }}
            />
          )}
        />
      </View>
    </>
  );
};

export default ContentImageComponent;

const styles = StyleSheet.create({});
