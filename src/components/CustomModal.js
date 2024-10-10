import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React from 'react';
import Color from '../utils/Colors';
import {useTranslation} from 'react-i18next';

const CustomModal = ({navigation, visible}) => {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.studentmodule}>
            <View style={styles.boxitem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('studentlist')}>
                <Image
                  source={require('../assets/Photos/Details.png')}
                  style={styles.images}></Image>
                <Text style={styles.imagestext}>{t('student_details')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxitem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('studentregister')}>
                <Image
                  source={require('../assets/Photos/registration.jpg')}
                  style={styles.images}></Image>
                <Text style={styles.imagestext}>Students List</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxitem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('studentAttendance')}>
                <Image
                  source={require('../assets/Photos/Attendance.jpg')}
                  style={styles.images}></Image>
                <Text style={styles.imagestext}>Students Attendance</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxitem}>
              <TouchableOpacity onPress={() => navigation.navigate('calllist')}>
                <Image
                  source={require('../assets/Photos/cl.jpg')}
                  style={styles.images}></Image>
                <Text style={styles.imagestext}>Call List</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={[styles.button, styles.buttonClose]}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: Color.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: Color.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  studentmodule: {
    flexDirection: 'row',
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.9,
    backgroundColor: Color.white,
    alignSelf: 'center',
    borderRadius: 20,
    flexWrap: 'wrap',
    shadowColor: Color.black,
    elevation: 10,
    borderWidth: 2,
    borderBottomColor: Color.primary,
    borderRightColor: '#13678a',
    borderTopColor: '#13858a',
    borderLeftColor: '#138a71',
  },
  boxitem: {
    marginTop: 12,
    alignSelf: 'flex-end',
    // backgroundColor: Color.primary,
    margin: '4.5%',
    height: 50,
    width: 50,
    borderRadius: 1000,
    elevation: 10,
  },
  images: {
    height: 50,
    width: 50,
    borderRadius: 1000,
  },
  imagestext: {
    color: Color.black,
    fontSize: 10,
  },
});
