import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import Api from '../environment/Api';
import React, {useState, useMemo, useRef, useCallback} from 'react';
import Color from '../utils/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../utils/Colors';
import ErrorMessage from '../components/ErrorMessage';
import ButtomSheet from '../components/BottomSheet';
import Feather from 'react-native-vector-icons/Feather';
import Modals from '../components/Modals';
import * as window from '../utils/dimensions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';

const Assignment = ({navigation, route, question, uploadFile}) => {
  const modalRef = useRef(null);
  const modalHeight = window.WindowHeigth * 0.3;
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user.resData);
  const [imageUrl, setImageUrl] = useState(user[0].image);
  const [imageData, setImageData] = useState({});
  const [singleFile, setSingleFile] = useState({});
  // console.log('singleFile---->', Object.keys(singleFile).length);
  const [multipleFile, setMultipleFile] = useState([]);
  const [error, setError] = useState(false);
  const [customModal, setCustomModal] = useState(true);

  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const handleSelection = async flag => {
    modalRef.current?.close();
    if (flag === 'camera') {
      if (Platform.OS === 'ios') {
        return;
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'ThinkZone App Camera Permission',
              message:
                'ThinkZone App needs access to your camera' +
                'so you can take pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
              compressImageMaxWidth: 300,
              compressImageMaxHeight: 300,
            })
              .then(image => {
                setError(false);
                setImageUrl(image.path);
                setImageData(image);
              })
              .catch(error => {
                console.log('err---->', error);
                if (error.response.status === 504) {
                  Alert.alert('Gateway Timeout: The server is not responding.');
                } else if (error.response.status === 500) {
                  Alert.alert(
                    'Internal Server Error: Something went wrong on the server.',
                  );
                  console.error('Error in onSave:', error);
                } else {
                  console.error('Error in onSave:', error);
                }
              });
          } else {
            Alert.alert('Error', 'Camera Permission Not Granted');
          }
        } catch (error) {
          console.log('err---->', error);
          if (error.response.status === 504) {
            Alert.alert('Gateway Timeout: The server is not responding.');
          } else if (error.response.status === 500) {
            Alert.alert(
              'Internal Server Error: Something went wrong on the server.',
            );
            console.error('Error in onSave:', error);
          } else {
            console.error('Error in onSave:', error);
          }
        }
      }
    } else if (flag === 'gallery') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
      })
        .then(image => {
          setError(false);
          setImageUrl(image.path);
          setImageData(image);
        })
        .catch(error => {
          console.log('err---->', error);
          if (error.response.status === 504) {
            Alert.alert('Gateway Timeout: The server is not responding.');
          } else if (error.response.status === 500) {
            Alert.alert(
              'Internal Server Error: Something went wrong on the server.',
            );
            console.error('Error in onSave:', error);
          } else {
            console.error('Error in onSave:', error);
          }
        });
    } else {
    }
  };

  const handleSubmit = () => {};
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        // DocumentPicker.types.audio,
        // DocumentPicker.types.images,
        // DocumentPicker.types.plainText,
        // DocumentPicker.types.pdf,
        // DocumentPicker.types.xls,
        // DocumentPicker.types.doc,
      });
      setSingleFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('cancell from single doc pickererror');
      } else {
        alert('unknown Error:' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const fileUpload = () => {
    const config = {
      headers: {
        accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    };
    console.log(singleFile, 'singleFile');
    let displayname = singleFile.name;
    console.log(displayname, 'displayname');
    let filetype = displayname.split('.').pop();
    console.log(filetype, 'displayname');
    let s3name = new Date().getTime() + '.' + filetype;
    console.log(s3name, 'displayname');
    let currentFileUpload = singleFile;
    console.log(currentFileUpload, 'displayname');
    var formData = new FormData();
    formData.append('file', singleFile);
    formData.append('Content-Type', singleFile.type);
    Api.post(`s3api/uploadroot/${s3name}`, formData, config).then(
      response => {
        console.log(response.data, 'response');
        if (response.data.s3path.length > 0) {
          Alert.alert(
            'Uploaded Successfully !!',
            '',
            [
              {
                text: 'OK',
                onPress: () => navigation?.navigate('monthlytraining'),
                // onPress: () => null,
                // onPress: () => navigation.goBack(),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
              // onDismiss: () => navigation.goBack(),
            },
          );
          uploadFile(response.data.s3path);
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  return (
    <ImageBackground
      style={styles.root}
      source={require('../assets/Photos/assignmentbg.jpg')}
      //   imageStyle={{borderRadius: 60}}
    >
      <View style={question.length > 150 ? styles.styleBoxl : styles.styleBoxs}>
        <ScrollView>
          <Text
            style={{
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 18,
              color: 'black',
              letterSpacing: 1,
              fontWeight: '600',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            {question}
          </Text>
        </ScrollView>
      </View>
      <View
        style={{
          marginTop: 40,
          // backgroundColor: Colors.primary,
          color: Colors.white,
          borderRadius: 20,
          width: window.WindowWidth * 0.9,
          //   height: window.WindowHeigth * 0.05,
        }}>
        <Text
          style={{
            color: Colors.primary,
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 19,
            paddingBottom: 10,
            paddingTop: 10,
            fontFamily: 'Babylonica-Regular',
            fontWeight: 'bold',
          }}>
          Upload Your Answer
        </Text>
      </View>

      <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => {
              handleSelection('camera');
            }}
            style={styles.modalButtonContainer}>
            <Feather name="camera" size={30} color={Color.primary} />
            <Text style={styles.modalButtonText}>Take Picture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleSelection('gallery');
            }}
            style={styles.modalButtonContainer}>
            <Feather name="file" size={30} color={Color.info} />
            <Text style={styles.modalButtonText}>choose_gallery</Text>
          </TouchableOpacity>
        </View>
      </ButtomSheet>
      <ScrollView>
        <View style={styles.container}>
          <View
            style={[
              styles.editFormContainer,
              {
                marginTop: 30,
                backgroundColor: 'white',
                width: window.WindowWidth * 0.3,
                height: window.WindowHeigth * 0.11,
                borderRadius: 75,
              },
            ]}>
            {/* Profile image code */}

            <TouchableOpacity
              style={styles.editImageIconContainer}
              // onPress={() => handleOpenBottomSheet()}
              onPress={selectFile}>
              <FontAwesome5Icon
                name="upload"
                size={50}
                color={Colors.primary}
                style={{marginLeft: 35, marginTop: 10}}
              />
              {/* <Cameraicon name="camera" color={Colors.primary} size={52} /> */}
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.text}>
              File Name :{singleFile.name ? singleFile.name : ''} {'\n'}
              Type :{singleFile.type ? singleFile.type : ''} {'\n'}
              File Size :{singleFile.size ? singleFile.size : ''} {'\n'}
              URI :{singleFile.uri ? singleFile.uri : ''} {'\n'}
            </Text>
            {/* <Image source={{uri: singleFile.uri ? singleFile.uri : ''}} /> */}
          </View>
          {/* <Button title="SAVE" onPress={handleSubmit} /> */}
          {Object.keys(singleFile).length > 0 ? (
            <TouchableOpacity onPress={fileUpload}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Assignment;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 70,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },

  cameraicon: {
    paddingLeft: 252,
    marginTop: -33,
    paddingLeft: 219,
    // backgroundColor:Color.white,
    // height: 150,
    // marginTop:-100,
    // paddingLeft:12
  },
  modalContainer: {
    height: window.WindowHeigth * 0.3,
    backgroundColor: Color.white,
    elevation: 5,
    // width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  styleBoxl: {
    borderWidth: 2,
    borderRadius: 20,
    width: window.WindowWidth * 0.9,
    height: window.WindowHeigth * 0.3,

    marginTop: 50,
    alignItems: 'baseline',
  },
  styleBoxs: {
    borderWidth: 2,
    borderRadius: 20,
    width: window.WindowWidth * 0.9,
    marginTop: 50,
    alignItems: 'baseline',
  },
  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  modalButtonText: {
    fontSize: 13,
    color: Color.black,
  },
  name: {
    backgroundColor: 'white',
    marginTop: -10,
    marginBottom: 14,
    paddingLeft: 70,
    fontSize: 22,
    fontWeight: 'bold',
    borderRadius: 12,
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 70,
    marginBottom: 12,
    backgroundColor: Color.primary,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingLeft: 15,
    fontSize: 18,
    marginBottom: 25,
    height: 52,
    borderBottomWidth: 1,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    paddingLeft: 8,
  },
  wrapper: {
    borderWidth: 1,
    height: 52,
    marginTop: -13,
    marginLeft: 22,
    marginRight: 20,
    marginBottom: 45,
    borderRadius: 12,
    paddingLeft: 15,

    // borderBottomWidth: 1,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
    marginLeft: 15,
    fontFamily: 'serif',
  },
  root: {
    width: window.WindowWidth,
    height: window.WindowHeigth,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    width: window.WindowWidth * 0.8,
    height: window.WindowHeigth * 0.06,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,
    fontSize: 24,
    textAlign: 'center',

    justifyContent: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
  editFormContainer: {
    marginHorizontal: 13,
    marginVertical: 59,
    borderRadius: 8,
    // backgroundColor: Colors.white,

    marginLeft: 90,
    //  borderTopLeftRadius: 70,
  },
});
