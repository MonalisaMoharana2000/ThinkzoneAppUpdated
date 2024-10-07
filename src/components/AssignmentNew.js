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
  BackHandler,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import API from '../environment/Api';

import React, {useState, useMemo, useRef, useCallback} from 'react';
import Color from '../utils/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../utils/Colors';
import ErrorMessage from '../components/ErrorMessage';
import ButtomSheet from '../components/BottomSheet';
import Feather from 'react-native-vector-icons/Feather';
import Modals from '../components/Modals';
import {Buffer} from 'buffer';
import * as window from '../utils/dimensions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '@env';
// import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import Norecord from './Norecord';
import Nocontents from './Nocontents';
import {useFocusEffect} from '@react-navigation/native';
import Loading from './Loading';
import {FontFamily} from '../GlobalStyle';
import {log} from 'console';

// // AWS.config.update({
//   region: REGION,
//   accessKeyId: ACCESS_KEY,
//   secretAccessKey: SECRET_ACCESS_KEY,
// });

// const s3 = new AWS.S3();

const AssignmentNew = ({
  navigation,
  route,
  question,
  uploadFile,
  loading,
  submitloading,
  setSubmitloading,
  onChangeText,
  // handleTextChange,
}) => {
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
  const [link, setLink] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [input, setInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(true);
  console.log('input----->', input);
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
  const textAlerts = () => {
    Alert.alert('Alert !!', 'You Already Upload  The Answer.', [
      {
        text: 'ok',
        onPress: () => null,
        style: 'cancel',
      },
    ]);
  };
  const fileAlerts = () => {
    Alert.alert('Alert !!', 'You Already Type  The Answer.', [
      {
        text: 'ok',
        onPress: () => null,
        style: 'cancel',
      },
    ]);
  };
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images, // Images
          DocumentPicker.types.audio, // Audio files
          DocumentPicker.types.video,
          // DocumentPicker.types.plainText, // Text files
        ],
      });
      setSingleFile(res[0]);
      // setIsFileSelected(true);
      setShowTextInput(false);
      const displayname = res[0].name;
      const filetype = displayname.split('.').pop();
      const filename = displayname;
      console.log('filename--------->', filename);
      const formData = new FormData();
      const getFileExtension = filename => {
        return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
      };

      const fileExtension = getFileExtension(filename);
      let mimeType;

      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'mp4') {
        mimeType = 'video/mp4';
      } else if (fileExtension === 'webm') {
        mimeType = 'video/webm';
      } else if (fileExtension === 'ogg') {
        mimeType = 'audio/ogg';
      } else if (fileExtension === 'mp3') {
        mimeType = 'audio/mp3';
      } else {
        // Handle other file formats if needed
        mimeType = 'application/octet-stream'; // Default to binary data for unknown formats
      }

      formData.append('file', {
        uri: res[0].uri,
        type: mimeType,
        name: filename,
      });
      setSubmitloading(true);
      const response = await API.post(`uploadFileP/${filename}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('response=========>', response.data);
      setLink(response?.data?.url);
      setSubmitloading(false);
      // setImageUrl(response?.data?.url);
      // setImageData(response?.data?.url);
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
    } finally {
      setSubmitloading(false);
      // setLoading(false);
    }
  };

  // const selectFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //       // DocumentPicker.types.audio,
  //       // DocumentPicker.types.images,
  //       // DocumentPicker.types.plainText,
  //       // DocumentPicker.types.pdf,
  //       // DocumentPicker.types.xls,
  //       // DocumentPicker.types.doc,
  //     });
  //     setSingleFile(res[0]);
  //     // setIsFileSelected(true);

  //     const config = {
  //       headers: {
  //         accept: 'application/json',
  //         'content-type': 'multipart/form-data',
  //       },
  //     };
  //     console.log(res[0], 'res[0]');
  //     let displayname = res[0].name;
  //     console.log(displayname, 'displayname');
  //     let filetype = displayname.split('.').pop();
  //     console.log(filetype, 'displayname');
  //     let s3name = new Date().getTime() + '.' + filetype;
  //     console.log(s3name, 'displayname');
  //     let currentFileUpload = res[0];
  //     console.log(currentFileUpload, 'displayname');
  //     var formData = new FormData();
  //     formData.append('file', res[0]);
  //     formData.append('Content-Type', res[0].type);
  //     const uri = currentFileUpload.uri;
  //     handleCapture(uri);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       alert('କୌଣସି ଫାଇଲ ଚୟନ କରାଯାଇ ନାହିଁ।');
  //     } else {
  //       alert('unknown Error:' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // };

  const handleCapture = async uri => {
    try {
      // Save the certificate image to the device's file system
      await saveAssignment(uri);

      // Upload the saved image to the S3 bucket
      const bucketName = S3_BUCKET; // Replace with your bucket name
      // const fileName = 'Assignment-' + new Date().getTime() + '.jpg'; // Append timestamp to the file name to make it unique
      const fileName = new Date().getTime() + '.jpg';
      await uploadToS3(uri, bucketName, fileName);
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
  };

  const saveAssignment = async uri => {
    // const destPath = RNFS.PicturesDirectoryPath + '/Assignment.jpg';
    const directoryPath = `${RNFS.DocumentDirectoryPath}/recordings`;

    await RNFS.mkdir(directoryPath); // Create the directory if it doesn't exist
    const fileName = `Assignemnt${Date.now()}.jpg`;
    const recordingPath = `${directoryPath}/${fileName}`;

    try {
      await RNFS.copyFile(uri, recordingPath);
      Alert.alert('Upload Success', '', [
        {
          text: 'Ok',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
      console.log('Certificate saved at:', recordingPath);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const [urls, setUrls] = useState('');
  console.log('====================================urls', urls);

  const uploadToS3 = async (imageUri, bucketName, fileName) => {
    try {
      const fileContent = await RNFS.readFile(imageUri, 'base64');
      const buffer = Buffer.from(fileContent, 'base64');

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg', // Modify this based on your image type
        ACL: 'public-read', // Make the file public-readable or private as per your requirements
      };

      s3.upload(params, (err, data) => {
        console.log('check data---->', data);
        if (err) {
          console.error('Error uploading the file:', err);
        } else {
          console.log('File uploaded successfully:', data);
          setUrls(data.key);
          setLink(data.Location);
        }
      });
      console.log('Certificate image uploaded to S3 successfully!');
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const handleTextChange = newAnswer => {
    setInput(newAnswer.replace(/\s/g, ''));
    onChangeText(newAnswer);
  };

  //S3 url delete from bucket

  const handleDelete = async () => {
    navigation.goBack();
    // const body = {Key: urls};
    console.log('body----->', urls);
    var newArray = [];
    newArray.push(body);
    console.log('delete response-------->', newArray);

    try {
      const response = await API.post(`s3api/doDeleteMultiple`, newArray);
      console.log('delete response2-------->', response.data);
      // Api.post(`s3api/doDeleteMultiple`, newArray).then(response => {
      //   console.log('delete response2-------->', response.data);
      // });
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };

  const handleCancel = async () => {
    var newArray = [];
    newArray.push(body);
    console.log('delete response-------->', newArray);

    try {
      const response = await API.post(`s3api/doDeleteMultiple`, newArray);

      setSingleFile(0);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        Alert.alert(
          'Internal Server Error: Something went wrong on the server.',
        );
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
    setSingleFile({});
  };
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
          'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'default',
            },
            {text: 'Ok', onPress: () => handleDelete(), style: 'default'},
          ],
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const cancel = () => {
    Alert.alert(
      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
      'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {
          text: 'Ok',
          onPress: () => {
            setSingleFile({});
            setShowTextInput(true);
            handleCancel();
          },
          style: 'default',
        },
      ],
    );
  };
  return (
    <ScrollView style={{height: '300%', paddingBottom: 50}}>
      <ImageBackground
        style={[styles.root, {paddingBottom: 50}]}
        source={require('../assets/Photos/assignmentbg.jpg')}
        //   imageStyle={{borderRadius: 60}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          style={{top: '-5%'}}>
          <ScrollView>
            {loading ? (
              <View>
                <Loading />
              </View>
            ) : question && question.length > 0 ? (
              <>
                <View
                  style={
                    question?.length > 150 ? styles.styleBoxl : styles.styleBoxs
                  }>
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
                        marginLeft: 7,
                      }}>
                      {question}
                    </Text>
                  </ScrollView>
                </View>

                {input.length === 0 && Object.keys(singleFile).length === 0 ? (
                  <>
                    {showTextInput && (
                      <View
                        style={{
                          marginTop: 20,
                          // backgroundColor: Colors.primary,
                          color: Colors.white,
                          borderRadius: 20,
                          width: window.WindowWidth * 0.9,
                          //   height: window.WindowHeigth * 0.05,
                        }}>
                        <Text
                          style={{
                            color: Colors.primary,
                            alignSelf: 'center',
                            // justifyContent: 'center',
                            fontSize: 14,
                            paddingBottom: 5,
                            paddingTop: 5,
                            fontFamily: FontFamily.poppinsMedium,
                            fontWeight: '800',
                            left: '5%',
                            // marginLeft: 27,
                          }}>
                          Upload Your Answer Or Type Your Answer
                        </Text>
                      </View>
                    )}

                    {showTextInput ? (
                      <View>
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                          placeholderTextColor="grey"
                          numberOfLines={10}
                          multiline={true}
                          keyboardType="ascii-capable"
                          style={styles.input}
                          onChangeText={handleTextChange}
                        />
                      </View>
                    ) : singleFile?.name ? null : null}

                    <ScrollView>
                      <View style={styles.container}>
                        <Text
                          style={{
                            top: 20,
                            alignSelf: 'center',
                            fontWeight: '700',
                          }}>
                          Upload Your Answer
                        </Text>
                        <View
                          style={[
                            styles.editFormContainer,
                            {
                              marginTop: 40,
                              backgroundColor: 'white',
                              width: window.WindowWidth * 0.3,
                              height: window.WindowHeigth * 0.14,
                              borderRadius: 100,
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
                              style={{marginLeft: 2, marginBottom: 5}}
                            />
                          </TouchableOpacity>
                        </View>
                        <View>
                          <Text style={styles.text}>
                            File Name : {singleFile.name ? singleFile.name : ''}{' '}
                            {'\n'}
                          </Text>
                        </View>

                        {/* <TouchableOpacity
                          onPress={() => uploadFile(link)}
                          style={{marginTop: 30}}>
                          <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity> */}
                      </View>
                    </ScrollView>
                  </>
                ) : input.length > 0 ? (
                  <>
                    <View
                      style={{
                        marginTop: 20,
                        // backgroundColor: Colors.primary,
                        color: Colors.white,
                        borderRadius: 20,
                        width: window.WindowWidth * 0.9,
                        //   height: window.WindowHeigth * 0.05,
                      }}>
                      <Text
                        style={{
                          color: Colors.primary,
                          alignSelf: 'center',
                          // justifyContent: 'center',
                          fontSize: 14,
                          paddingBottom: 5,
                          paddingTop: 5,
                          fontFamily: FontFamily.poppinsMedium,
                          fontWeight: '800',
                          left: '5%',
                          // marginLeft: 27,
                        }}>
                        Upload Your Answer Or Type Your Answer
                      </Text>
                    </View>
                    {showTextInput ? (
                      <View>
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                          placeholderTextColor="grey"
                          numberOfLines={10}
                          multiline={true}
                          // keyboardType="ascii-capable"
                          style={styles.input}
                          onChangeText={handleTextChange}
                        />
                      </View>
                    ) : singleFile?.name ? null : null}
                    <ScrollView>
                      <View style={styles.container}>
                        <TouchableOpacity
                          onPress={fileAlerts}
                          style={[
                            styles.editFormContainer,
                            {
                              marginTop: 20,
                              backgroundColor: 'white',
                              width: window.WindowWidth * 0.3,
                              height: window.WindowHeigth * 0.14,
                              borderRadius: 100,
                            },
                          ]}>
                          {/* Profile image code */}

                          <TouchableOpacity
                            style={styles.editImageIconContainer}
                            // onPress={() => handleOpenBottomSheet()}
                            onPress={fileAlerts}>
                            <FontAwesome5Icon
                              name="upload"
                              size={50}
                              color={Colors.primary}
                              style={{marginLeft: 2, marginBottom: 5}}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.text}>
                            File Name : {singleFile.name ? singleFile.name : ''}{' '}
                            {'\n'}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => uploadFile(link)}
                          style={{marginTop: 30}}>
                          {submitloading ? (
                            <ActivityIndicator color="black" />
                          ) : link?.length > 0 || input?.length > 0 ? (
                            <Text style={styles.buttonText}>Submit</Text>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </>
                ) : Object.keys(singleFile).length > 0 ? (
                  <>
                    <View
                      style={{
                        marginTop: 20,
                        // backgroundColor: Colors.primary,
                        color: Colors.white,
                        borderRadius: 20,
                        width: window.WindowWidth * 0.9,
                        //   height: window.WindowHeigth * 0.05,
                      }}>
                      <Text
                        style={{
                          color: Colors.primary,
                          alignSelf: 'center',
                          // justifyContent: 'center',
                          fontSize: 14,
                          paddingBottom: 5,
                          paddingTop: 5,
                          fontFamily: FontFamily.poppinsMedium,
                          fontWeight: '800',
                          left: '5%',
                          // marginLeft: 27,
                        }}>
                        Upload Your Answer Or Type Your Answer
                      </Text>
                    </View>
                    {showTextInput ? (
                      <TouchableOpacity onPress={textAlerts}>
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                          placeholderTextColor="grey"
                          numberOfLines={10}
                          multiline={true}
                          keyboardType="ascii-capable"
                          style={styles.input}
                          onPressIn={textAlerts}
                          editable={false}
                        />
                      </TouchableOpacity>
                    ) : singleFile?.name ? null : null}

                    <ScrollView>
                      <View style={styles.container}>
                        <TouchableOpacity
                          onPress={selectFile}
                          style={[
                            styles.editFormContainer,
                            {
                              marginTop: 20,
                              backgroundColor: 'white',
                              width: window.WindowWidth * 0.3,
                              height: window.WindowHeigth * 0.14,
                              borderRadius: 100,
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
                              style={{marginLeft: 2, marginBottom: 5}}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.text}>
                            File Name : {singleFile.name ? singleFile.name : ''}{' '}
                            {'\n'}
                          </Text>
                          <TouchableOpacity
                            onPress={cancel}
                            style={{
                              // backgroundColor: Color.royalblue,
                              borderRadius: 10,
                              width: 100,
                              height: 40,
                              alignSelf: 'center',
                              borderWidth: 2,
                              borderColor: '#13538a',
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontFamily: FontFamily.poppinsMedium,
                                fontSize: 15,
                                top: '10%',
                              }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          onPress={() => uploadFile(link)}
                          style={{marginTop: 10}}>
                          {submitloading ? (
                            <ActivityIndicator color="black" />
                          ) : link?.length > 0 || input?.length ? (
                            <Text style={styles.buttonText}>Submit</Text>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </>
                ) : null}
              </>
            ) : question.length === 0 ? (
              <Nocontents />
            ) : (
              <View>
                <Loading />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
};

export default AssignmentNew;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 10,
  },
  image: {
    height: 100,
    width: 100,
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
    // height: window.WindowHeigth * 0.3,
    alignSelf: 'center',
    overflow: 'scroll',
    marginTop: 50,
    padding: 5,
    margin: 5,
    // alignItems: 'baseline',
  },
  styleBoxs: {
    borderWidth: 2,
    borderRadius: 20,
    width: window.WindowWidth * 0.9,
    marginTop: 50,
    alignItems: 'baseline',
    marginLeft: 18,
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
    height: 80,
    width: window.WindowWidth * 0.9,
    margin: 12,
    borderWidth: 1,
    paddingLeft: 15,
    fontSize: 18,
    // marginBottom: 25,
    // height: 52,
    borderBottomWidth: 1,
    textAlignVertical: 'top',
    borderRadius: 12,
    alignSelf: 'center',
    top: '20%',
    // position: 'absolute',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    marginLeft: 30,
    // paddingLeft: 5,
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
    // display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  buttonText: {
    width: window.WindowWidth * 0.8,
    height: window.WindowHeigth * 0.06,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,
    fontSize: 24,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    // marginTop: 30,
    marginLeft: 25,
    margin: 60,
    fontWeight: 'bold',
  },
  editFormContainer: {
    marginHorizontal: 13,
    marginVertical: 59,
    borderRadius: 8,
    marginLeft: 120,
    marginRight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.white,
    // marginRight: 100,
    // borderTopLeftRadius: 70,
  },
  editImageIconContainer: {
    // backgroundColor: 'black',
  },
  // input: {
  //   height: 60,
  //   width: window.WindowWidth * 0.83,
  //   borderWidth: 1,
  //   borderRadius: 12,
  //   textAlignVertical: 'top', // Aligns text to the top
  //   paddingLeft: 10,
  //   // position: 'absolute',
  //   top: '50%',
  //   padding: 20,
  //   margin: 20,

  //   alignSelf: 'center',
  // },
});
