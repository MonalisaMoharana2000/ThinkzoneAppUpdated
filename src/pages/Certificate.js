import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  Dimensions,
  Modal,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import Colors from '../utils/Colors';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import * as window from '../utils/dimensions';
import {Color, FontFamily} from '../GlobalStyle';
import {Buffer} from 'buffer';
// import Share from 'react-native-share';
// import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '@env';
import {log} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
import {useFocusEffect} from '@react-navigation/native';
import {app_versions} from './Home';
// const s3 = new AWS.S3();

const Certificate = ({certificateData, navigation, route}) => {
  const viewShotRef = useRef();
  const moduleName = route.params.moduleName;
  const moduleId = route.params.moduleId;
  const user = useSelector(state => state.UserSlice.user);
  const [userdata, setUserdata] = useState(user);
  const [notficationCount, setNotificationCount] = useState();
  const [link, setLink] = useState(null);
  const [dbutton, setDbutton] = useState(true);
  const [sbutton, setSbutton] = useState(false);
  const [modalsss, setModalsss] = useState(false);
  // console.log('moduleName', moduleName, 'moduleId', moduleId);
  // console.log('====================================user', user);
  // console.log('notficationCount====>', notficationCount);
  // console.log('====================================', link);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      API.get(`getuserbyuserid/${user[0]?.userid}`).then(response => {
        setUserdata(response.data);
      });

      API.get(`getUnreadNotifCount/${user[0]?.userid}`).then(response => {
        console.log('not--->', response.data);
        setNotificationCount(response.data);
      });
    }, []),
  );
  const handleCapture = async uri => {
    try {
      await saveCertificate(uri);
      const fileName = 'Certificate-' + new Date().getTime() + '.jpg'; // Append timestamp to the file name to make it unique
      // handleShare();
      // await uploadToS3(uri, bucketName, fileName);
      formData.append('file', {
        uri: uri,
        type: mimeType,
        name: fileName,
      });
      setSubmitLoading(true);
      const response = await API.post(`uploadFileP/${fileName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('response=========>', response.data);
      setLink(response?.data?.url);
      setSubmitLoading(false);
      const requestBody = {
        userid: userdata[0].userid,
        moduleId: moduleId,
        moduleCertificate: data.Location,
        appVersion: app_versions,
      };
      console.log('File uploaded successfully:--------------', requestBody);
      // Send the updated certificate URL to the API
      const apiResponse = await API.put('updateModuleCertificate', requestBody);
      showMessage({
        message: 'Successfully Completed',
        description: 'Successfully completed the topic.',
        type: 'success',
        backgroundColor: Colors.success,
      });
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        // Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        // Alert.alert(
        //   'Internal Server Error: Something went wrong on the server.',
        // );
        console.error('Error is------------------->:', error);
      } else {
        //
        console.error('Error is------------------->:', error);
      }
    }
  };

  // const saveCertificate = async uri => {
  //   const destPath = RNFS.PicturesDirectoryPath + '/Certificate.jpg';

  //   try {
  //     await RNFS.copyFile(uri, destPath);
  //     Alert.alert('Download Success', 'Now you can share your Certificate', [
  //       {
  //         text: 'Ok',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //     ]);
  //     console.log('Certificate saved at:', destPath);
  //   } catch (error) {
  //     console.error('Error saving the certificate:', error);
  //   }
  // };

  useEffect(() => {
    const backAction = () => {
      // setModal(true);

      // Handle any other conditions or logic before going back

      // Directly go back to the previous screen
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);
  const saveCertificate = async uri => {
    const destPath =
      RNFS.PicturesDirectoryPath +
      '/Certificate' +
      new Date().getTime() +
      '.jpg';

    try {
      // Check if the PicturesDirectoryPath exists, and create it if it doesn't
      const picturesDirExists = await RNFS.exists(RNFS.PicturesDirectoryPath);
      if (!picturesDirExists) {
        await RNFS.mkdir(RNFS.PicturesDirectoryPath);
      }

      // Copy the certificate image to the destination path
      await RNFS.copyFile(uri, destPath);
      setModalsss(true);
      // Alert.alert('Download Success', 'Now you can share your Certificate', [
      //   {
      //     text: 'Ok',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      // ]);
      // showMessage({
      //   message: 'Download Success',
      //   description: 'Now you can share your Certificate',
      //   type: 'success',
      //   backgroundColor: Colors.success,
      // });
      console.log('Certificate saved at:', destPath);
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        // Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        // Alert.alert(
        //   'Internal Server Error: Something went wrong on the server.',
        // );
        console.error('Error is------------------->:', error);
      } else {
        //
        console.error('Error is------------------->:', error);
      }
    }
  };

  const uploadToS3 = async (imageUri, bucketName, fileName) => {
    try {
      const fileContent = await RNFS.readFile(imageUri, 'base64');
      const buffer = Buffer.from(fileContent, 'base64');

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          console.error('Error uploading the file:', err);
        } else {
          console.log('File uploaded successfully:', data);

          // const fileUrl = data.Location;
          setLink(data.Location);
          // console.log('File URL:-------------------', setLink);
          // You can use the file URL for further processing, like displaying the image or sharing it.

          const requestBody = {
            userid: userdata[0].userid,
            moduleId: moduleId,
            moduleCertificate: data.Location,
            appVersion: app_versions,
          };
          console.log('File uploaded successfully:--------------', requestBody);
          // Send the updated certificate URL to the API
          const apiResponse = await API.put(
            'updateModuleCertificate',
            requestBody,
          );
          showMessage({
            message: 'Successfully Completed',
            description: 'Successfully completed the topic.',
            type: 'success',
            backgroundColor: Colors.success,
          });
        }
      });
      console.log('Certificate image uploaded to S3 successfully!');
    } catch (error) {
      console.log('err---->', error);
      if (error.response.status === 504) {
        // Alert.alert('Gateway Timeout: The server is not responding.');
      } else if (error.response.status === 500) {
        // Alert.alert(
        //   'Internal Server Error: Something went wrong on the server.',
        // );
        console.error('Error is------------------->:', error);
      } else {
        //
        console.error('Error is------------------->:', error);
      }
    }
  };
  const date = new Date();
  const formattedDate = moment(date).format('DD/MM/YYYY');
  // useEffect(() => {
  //   captureCertificate();
  // }, []);

  // const handleShare = async () => {
  //   if (!link) {
  //     console.error('No file URL available');
  //     return;
  //   }

  //   const bucketName = S3_BUCKET; // Replace with your bucket name
  //   const fileName = link; // Replace with the desired file name
  //   console.log('====================================', fileName);

  //   const s3Link = fileName;

  //   try {
  //     const result = await Share.share({
  //       url: s3Link,
  //     });
  //     console.log('Share result:', result);
  //   } catch (error) {
  //     console.error('Error sharing the certificate:', error);
  //   }
  // };
  const certificateImagePath = link;

  console.log(
    certificateImagePath,
    // '------------------------------------>certificateImagePath',
  );
  const handleShare = async () => {
    try {
      // const longUrl = certificateImagePath;
      // const shortenedUrl = await shortenUrl(longUrl);
      const certificateImageUrl = certificateImagePath;

      // Extract the filename from the URL
      const filename = extractFilenameFromUrl(certificateImageUrl);
      const shareOptions = {
        title: 'Share Certificate',
        message: 'Check out my certificate!',
        url: certificateImageUrl,
        type: 'image/png',
      };

      const result = await Share.open(shareOptions);
      console.log('Share Result:', result);
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
    function extractFilenameFromUrl(url) {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return filename;
    }
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `getModuleDescription/${userdata[0].userid}/${moduleId}`,
        );
        console.log(
          '====================================setData',
          userdata[0].userid,
          moduleId,
        );
        setData(response.data);
        // console.log(
        //   '====================================setData',
        //   response.data,
        // );
      } catch (error) {
        console.log('err---->', error);
        if (error.response.status === 504) {
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
        } else {
          console.error('Error is------------------->:', error);
        }
      }
    };

    fetchData();
  }, []);

  const captureCertificate = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await handleCapture(uri);

      setDbutton(false);
      setSbutton(true);

      // navigation.goBack();
    } catch (error) {
      if (error.response.status === 504) {
      } else if (error.response.status === 500) {
        console.error('Error is------------------->:', error);
      } else {
        console.error('Error is------------------->:', error);
      }
    }
  };
  const modalOff = () => {
    setModalsss(false);
  };
  console.log('userdata[0].userid----------------->', userdata[0].userid);
  console.log('moduleId----------------->', moduleId);
  console.log('data---------------->', data);

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 0.9,
          width: 500,
          result: 'tmpfile',
          snapshotContentContainer: false,
          top: -10,
        }}
        onCapture={handleCapture}>
        <View>
          <ImageBackground
            source={require('../assets/Image/Certificatebg.png')}
            resizeMode="contain" // Use "contain" instead of "cover"
            style={styles.image}>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Image
                source={require('../assets/Image/tzlogoNew1.png')}
                resizeMode="cover"
                style={styles.logo}
              />
              <Image
                source={require('../assets/Image/certificatebatch.png')}
                resizeMode="cover"
                style={styles.batch}
              />
            </View>
            <View>
              <Text style={styles.header1}>
                This certificate is presented to
              </Text>
              <Text style={styles.name}>{userdata[0]?.username}</Text>
              <View style={styles.cont} />
              {data.map((item, index) => (
                <Text style={styles.text}>
                  {/* has successfully completed{' '}
              <Text style={{fontWeight: '900'}}>{submoduleName}</Text>, an
              e-module provided by ThinkZone in ThinkZone mobile application.
              This 3 hours module aims to equip learner with a basic
              understanding of teaching pedagogies. */}
                  {item.moduleDescription}
                </Text>
              ))}
              {data.map((item, index) => (
                <Text style={styles.footer}>
                  {/* The identity of the learner is not verified by this certificate */}
                  {/* Presented this on {item.moduleCertificationDate} */}
                  Presented this on -{' '}
                  {moment(item.moduleCertificationDate).format(' Do MMM, YYYY')}
                </Text>
              ))}
            </View>
            {/* <Text style={styles.subtitle}>This certificate is awarded to:</Text> */}
          </ImageBackground>
          {/* <View style={styles.watermarkContainer}>
          <Image
            source={require('../assets/Photos/logo1.png')}
            style={styles.watermark}
            resizeMode="contain"
          />
        </View> */}
        </View>
      </ViewShot>
      <View>
        {dbutton == true ? (
          <TouchableOpacity
            style={styles.shareButton}
            // onPress={captureCertificate}
            onPress={() =>
              ToastAndroid.show(
                'This Module is under  development. ',
                ToastAndroid.SHORT,
              )
            }>
            <Text style={styles.shareButtonText}>
              Download Certificate{' '}
              {/* <FontAwesome
              name="download"
              color={Color.white}
              size={20}
              style={{marginLeft: 10}}
            /> */}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.shareButton}
              // onPress={handleShare}
              onPress={() =>
                ToastAndroid.show(
                  'This Module is under  development. ',
                  ToastAndroid.SHORT,
                )
              }>
              <Text style={styles.shareButtonText}>
                Share Your Certificate{' '}
                {/* <FontAwesome
              name="share-alt"
              color={Color.white}
              size={18}
              style={{margin: 2}}
            />{' '} */}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalsss}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                // height: window.WindowHeigth * 0.7,

                width: window.WindowWidth * 0.92,
                borderRadius: 20,
              },
            ]}>
            <Image
              style={[
                styles.tinyLogos,
                {
                  width: 250,
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -40,
                },
              ]}
              source={require('../assets/Image/success.gif')}
            />

            <Text
              style={[
                styles.username,
                {
                  fontSize: 18,
                  color: 'black',
                  fontWeight: '600',
                  fontFamily: FontFamily.poppinsMedium,
                  justifyContent: 'center',
                  textTransform: 'capitalize',
                  width: 200,
                  alignSelf: 'center',
                },
              ]}>
              Congratulations! {''}
            </Text>
            {/* <Text
                        style={{
                          color: 'black',
                          fontWeight: '800',
                          color: '#666666',
                          textTransform: 'capitalize',
                        }}>
                        {user[0].username}
                      </Text> */}

            <Text
              style={[
                styles.username,
                {
                  fontSize: 14,
                  color: 'black',
                  fontWeight: '400',
                  fontFamily: 'serif',
                  marginTop: 10,
                  FontFamily: FontFamily.poppinsMedium,
                },
              ]}>
              ଆପଣ ସଫଳତାର ସହ ସାର୍ଟିଫିକେଟ ଡାଉନ୍ ଲୋଡ କରିଛନ୍ତି, ଆପଣ ଏହାକୁ ନିଜର
              ସୋସିଆଲ ମିଡିଆରେ ସେୟାର କରିପାରିବେ
            </Text>
            <TouchableOpacity
              onPress={modalOff}
              style={{
                backgroundColor: Color.accent,
                padding: 20,
                width: '100%',
                borderRadius: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Color.blue,
                  fontSize: 20,
                }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
  },
  text: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 7,
    width: 300,
    marginLeft: 'auto', // Aligns text to the right
    marginRight: 'auto',
    fontFamily: FontFamily.poppinsRegular,
    color: 'black',
  },
  image: {
    justifyContent: 'center',
    width: window.WindowWidth * 1.0,
    height: window.WindowHeigth * 0.36, // Use percentage width to make it responsive
    // aspectRatio: 2, // Adjust the aspectRatio as needed to maintain the original image's aspect ratio
    // margin: 10,
    // top: '10%',
    // height: window.WindowHeigth * 0.5,
  },
  watermarkContainer: {
    position: 'absolute',
    top: '10%', // Adjust the position of the watermark vertically
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermark: {
    width: 300, // Adjust the width of the watermark
    height: 300, // Adjust the height of the watermark
    opacity: 0.1, // Adjust the opacity of the watermark (0 to 1)
  },
  // container: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // paddingHorizontal: 20,
  //   // backgroundColor: 'white',
  // },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    alignSelf: 'center',
    top: '7%',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
    top: '6%',
    color: '#1570B0',
    padding: 15,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 14,
    marginBottom: 30,
    alignSelf: 'center',
    top: '2%',
    color: 'black',
  },
  shareButton: {
    backgroundColor: Color.royalblue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    top: 150,
    width: window.WindowWidth * 0.8,
    height: 44,
    borderRadius: 50,
    alignSelf: 'center',
    textAlign: 'center',
    // position: 'absolute',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    top: -2,
  },
  logo: {
    width: windowWidth * 0.11,
    height: windowWidth * 0.11,
    alignSelf: 'center',
    left: '50%',
    top: '-5%',
  },
  batch: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    alignSelf: 'flex-end',
    left: '140%',
    top: -30,
  },
  cont: {
    borderWidth: 0.3,
    borderColor: '#002F6D',
    alignSelf: 'center',
    width: windowWidth * 0.6,
  },
  footer: {
    fontSize: 7,
    color: 'black',
    textAlign: 'center',
    bottom: 0,
    top: 18,
    // left: 35,
    fontFamily: FontFamily.poppinsMediumItalic,
  },
  header1: {
    fontSize: 7,
    color: 'black',
    textAlign: 'center',
    bottom: 0,
    top: 5,
    // left: 35,
    fontFamily: FontFamily.poppinsMediumItalic,
  },
  tinyLogo: {
    width: '100%',
    height: 815,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
  p: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',

    fontSize: 10,

    color: 'black',

    marginBottom: 10,
  },
  bu: {
    marginTop: 190,
    width: '100%',
    backgroundColor: '#2196f3',
    padding: 20,
    borderRadius: 5,
  },
  root: {
    width: window.WindowWidth,
    height: window.WindowHeigth,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
});

export default Certificate;
