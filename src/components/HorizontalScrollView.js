import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import {TextSize} from 'victory-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FabButton from '../components/FabButton';
import {FontFamily, Color} from '../GlobalStyle';

const SquareView = props => {
  return (
    <TouchableOpacity
      style={{
        height: props.size,
        width: props.size,
        backgroundColor: props.color,
      }}
    />
  );
};

const HorizontalScrollView = ({moduleArr, callbackfun}) => {
  const [selectedModule, setSelectedModule] = React.useState(0);
  const modulArr = moduleArr;
  const postModuleid = (item, index) => {
    // callbackfun(item);
    // setSelectedModule(index);
    //
    if (item.lockstatus == 'lock') {
      Alert.alert(
        'ଆଗକୁ ବଢିବା ପାଇଁ ପୂର୍ବ ମଡ୍ୟୁଲ୍ ସଂପୂର୍ଣ୍ଣ କରନ୍ତୁ ।',
        '',
        [
          {
            text: 'Cancel',
            // onPress: () => Alert.alert('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'OK',
            // onPress: () => submitFun(),
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      callbackfun(item);
      setSelectedModule(index);
    }
  };
  return (
    <ScrollView horizontal={true}>
      {moduleArr.map((item, index) => (
        // <SquareView key={item.key}>
        //   <Text style={{color: 'red'}}>{item.name}</Text>
        // </SquareView>
        <TouchableOpacity
          onPress={() => postModuleid(item, index)}
          key={item.moduleid}
          style={{
            marginTop: 10,
            margin: 2,
            // height: 40,
            // color: 'white',
            flexDirection: 'row',
            // width: 120,
            borderWidth: 2,
            borderRadius: 60,
            borderColor:
              index === selectedModule ? Color.royalblue : Color.white,
            // backgroundColor:
            //   index === selectedModule ? '#ecfeff' : Colors.white,
            backgroundColor:
              item.iscomplete == 1 ? Color.royalblue : Color.white,
            color: index === selectedModule ? Color.white : Color.white,
            color: item.iscomplete == 1 ? Color.white : Color.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {item.iscomplete == 1 ? (
            <Text
              style={{
                color: 'white',
                padding: 10,
                fontFamily: FontFamily.balooBhaiRegular,
              }}>
              {item.modulename}
            </Text>
          ) : (
            <Text
              style={{
                color: '#000000',
                padding: 10,
                fontFamily: FontFamily.balooBhaiRegular,
              }}>
              {item.modulename}
            </Text>
          )}

          {item.lockstatus == 'lock' ? (
            // <FontAwesome name="lock" color={Colors.primary} size={22} />
            <Image
              style={{width: 20, height: 20, marginRight: 10}}
              source={require('../assets/Image/key.png')}
            />
          ) : (
            <></>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default HorizontalScrollView;

const styles = StyleSheet.create({});
