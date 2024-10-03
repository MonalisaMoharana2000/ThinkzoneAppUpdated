import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Modals = ({
  visible,
  height,
  width,
  backgroundColor,
  heading,
  yesStatus,
  noStatus,
  okstatus,
  onpressyes,
  onpressno,
  onpressok,
}) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View
        style={{
          backgroundColor: '#000000aa',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            borderRadius: 10,
            height: height,
            width: width,
            backgroundColor: backgroundColor,
          }}>
          <MaterialCommunityIcons
            size={30}
            name="emoticon-sad"
            color={Colors.primary}
            style={{alignSelf: 'center', marginTop: 10}}
          />
          <Text
            style={{
              fontSize: 15,
              color: Colors.primary,
              alignSelf: 'center',
              margin: 10,
              fontWeight: '700',
            }}>
            {heading}
          </Text>
          <TextInput allowFontScaling={false}></TextInput>
          {/* <Button title='OK' onPress={onpress}></Button> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              margin: 20,
            }}>
            {yesStatus && (
              <TouchableOpacity
                onPress={onpressyes}
                style={[styles.buttons, {backgroundColor: Colors.success}]}>
                <Text
                  style={{
                    alignItems: 'center',
                    color: Colors.white,
                    alignSelf: 'center',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            )}
            {noStatus && (
              <TouchableOpacity
                onPress={onpressno}
                style={[styles.buttons, {backgroundColor: Colors.danger}]}>
                <Text
                  style={{
                    alignItems: 'center',
                    color: Colors.white,
                    alignSelf: 'center',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            )}
            {okstatus && (
              <TouchableOpacity
                onPress={onpressok}
                style={[styles.buttons, {backgroundColor: Colors.danger}]}>
                <Text
                  style={{
                    alignItems: 'center',
                    color: Colors.white,
                    alignSelf: 'center',
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Modals;

const styles = StyleSheet.create({
  buttons: {
    height: 30,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
