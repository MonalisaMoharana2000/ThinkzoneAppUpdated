import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import * as window from '../utils/dimensions';
// import Color from '../utils/Colors';
import React, {useEffect, useMemo, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import Colors from '../utils/Colors';

import Modals from '../components/Modals';

import AssignmentNew from '../components/AssignmentNew';

import {Color, Border, FontSize, FontFamily} from '../GlobalStyle';
import Nocontents from '../components/Nocontents';
import Loading from '../components/Loading';
import {app_versions} from './Home';
const TechAssignment = ({navigation, route}) => {
  const dispatch = useDispatch();
  const data = route.params.data;
  console.log('data--->', data);
  const user = useSelector(state => state.UserSlice.user);
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState('od');
  const [modal, setModal] = useState(false);
  const [modals, setModals] = useState(false);
  const [modalss, setModalss] = useState(false);
  const [modalsss, setModalsss] = useState(false);
  const [submitloading, setSubmitloading] = useState(false);

  const [assignment_status, setAssignment_status] = useState(
    route.params.data_type == 'assignment' ? true : false,
  );
  const {topicId, topicName} = route.params.whole_data;
  console.log('topicId--->', topicId);
  const [assignment_question, set_assignment_question] = useState([]);
  console.log('contentData assignment_question--->', assignment_question);
  const [contentData, setContentData] = useState([]);
  const [text, setText] = useState('');
  console.log('text------>', text);

  // console.log('contentData--->', contentData);
  const [customModal, setCustomModal] = useState(true);
  const {
    moduleid,
    modulename,
    submoduleid,
    submodulename,
    submoduleOrder,
    moduleOrder,
  } = route.params.data;
  const {topicname, topicid, contentStatus, quizStatus, topicOrder} =
    route.params.whole_data;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await API.get(
          `getTchTrainingAssignment/${user[0].userid}/${topicId}`,
        );
        set_assignment_question(response.data?.assignmentData);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 413) {
          console.log('error is---------------->', error);
          Alert.alert('The entity is too large !');
        } else if (error.response.status === 504) {
          console.log('Error is--------------------->', error);
          Alert.alert('Gateway Timeout: The server is not responding!');
        } else if (error.response.status === 500) {
          console.error('Error is------------------->:', error);
          Alert.alert(
            'Internal Server Error: Something went wrong on the server.',
          );
        } else {
          console.error('Error is------------------->:', error);
        }
      }
    };
    fetchData();
  }, []);

  const handleTextChange = value => {
    console.log('newAnswer----->', value);
    // const filteredText = text.replace(/\s/g, '');
    setText(value);
  };
  //New Api for Assignment ends
  const [link, setLink] = useState([]);
  console.log(link, 'link--------------------------');

  const getFileExtension = url => {
    return url.split('.').pop().toLowerCase();
  };

  const getAssignmentType = assignmentLink => {
    const extension = getFileExtension(assignmentLink);
    console.log('extension', extension);
    if (['jpeg', 'jpg', 'png'].includes(extension)) {
      return 'imageInput';
    }
    if (extension === 'mp3') {
      return 'audioInput';
    }
    if (extension === 'mp4') {
      return 'videoInput';
    }
    return null;
  };

  const updateAssignment = assignmentLink => {
    console.log('link--->', assignmentLink);

    setSubmitloading(true);
    let assignData = [
      {
        _id: assignment_question[0]._id,
        answer:
          assignmentLink?.length > 0
            ? assignmentLink
            : text.length > 0
            ? text
            : null,
        answerType:
          assignmentLink?.length > 0
            ? getAssignmentType(assignmentLink)
            : text.length > 0
            ? 'textInput'
            : null,
        correctAnswer: assignment_question[0].correctAnswer,
        optionA: assignment_question[0].optionA,
        optionB: assignment_question[0].optionB,
        optionC: assignment_question[0].optionC,
        optionD: assignment_question[0].optionD,
        question: assignment_question[0].question,
        questionCategory: assignment_question[0].questionCategory,
        questionId: assignment_question[0].questionId,
        questionMediaType: assignment_question[0].questionMediaType,
        questionOrder: assignment_question[0].questionOrder,
      },
      setLink(assignmentLink),
    ];

    const body = {
      topicId: topicId,
      userid: user[0].userid,
      assignmentData: assignData,
      topicPercentage: 75,
      appVersion: app_versions,
    };
    console.log('assignmentdata body1-------------->', body);

    API.post(`saveTransTchTrainingAssignment`, body).then(
      response => {
        console.log(
          'assignment response-------->',
          response.data,
          response.status,
        );
        setSubmitloading(false);
        if (Object.keys(response.data).length > 0) {
          const data = {
            userid: user[0].userid,
            usertype: user[0].usertype,
            trainingType: 'training',
            moduleid: moduleid,
            language: language,
          };

          setModalsss(true);
        }
      },
      err => {
        console.log(err, 'err--->');
      },
    );
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  return (
    <>
      <>
        <View
          style={{
            backgroundColor: '#0060ca',
            height: 66,
            width: window.WindowWidth * 1.1,
            marginTop: -16,
            marginLeft: -1,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              marginTop: 25,
              marginLeft: 25,
              // textAlign: 'center',
            }}>
            {topicName}
          </Text>
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

              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 17,
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 10,
                    FontFamily: FontFamily.poppinsMedium,
                  },
                ]}>
                {user[0].username} ଆପଣ ସଫଳତାର ସହ ଆସାଇନମେଣ୍ଟ ସମ୍ପୂର୍ଣ୍ଣ କରିଛନ୍ତି।
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
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
        {(assignment_status === true &&
          // contentDetails[0].topicData[0].contentStatus ==
          contentStatus == 'incomplete' &&
          quizStatus == 'incomplete' &&
          contentStatus == 'complete') ||
          (quizStatus == 'incomplete' && (
            <Modals
              visible={customModal}
              heading={'Please Complete the content or quiz.'}
              backgroundColor={Colors.white}
              onpressok={closeModal}
              okstatus={true}
            />
          ))}

        {assignment_status === true && (
          <View style={styles.container}>
            {loading ? (
              <Loading />
            ) : assignment_question.length > 0 ? (
              <AssignmentNew
                question={assignment_question[0]?.question}
                uploadFile={updateAssignment}
                navigation={navigation}
                loading={loading}
                submitloading={submitloading}
                onChangeText={handleTextChange}
                setSubmitloading={setSubmitloading}
                // handleTextChange={handleTextChange}
              />
            ) : (
              <Nocontents />
            )}
          </View>
        )}

        {/* )} */}
      </>
      {/* )} */}
    </>
  );
};

export default TechAssignment;

const styles = StyleSheet.create({
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
