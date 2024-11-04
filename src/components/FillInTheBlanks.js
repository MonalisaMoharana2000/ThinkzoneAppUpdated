import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Api from '../environment/Api';
import {useSelector} from 'react-redux';
import {Version} from '../environment/Api';
import {app_versions} from '../Pages/Home';
import Loading from './Loading';
import {Dimensions} from 'react-native';
const windowHeight = Dimensions.get('window').height;

const FillInTheBlank = ({navigation, route}) => {
  const [gamifiedData, setGamifiedData] = useState([]);
  const [questions, setQuestions] = useState([]);
  console.log('questions------->', questions);
  const [selectedBlank, setSelectedBlank] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state
  //   const user = useSelector(state => state.userdata.user?.resData);
  const user = useSelector(state => state.UserSlice.user);
  const {userid, managername, passcode, managerid, usertype} = user[0];
  const data = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // Show loader
          const responseGamified = await Api.get(
            `/getTchTrainingGamified/${userid}/gamified/${data.topicData[0].topicId}`,
          );

          console.log(
            'data received----------->',
            responseGamified?.data.mediaProcessedData,
          );
          setGamifiedData(responseGamified?.data.mediaProcessedData);
        } catch (error) {
          console.error('Error fetching data: ', error);
        } finally {
          setLoading(false); // Hide loader
        }
      };

      fetchData();
    }, [userid, data.topicData]),
  );

  const filteredData = gamifiedData?.filter(
    item => item.gameType === 'fillInBlanks',
  );

  console.log('Filtered Data:', filteredData);
  useEffect(() => {
    if (gamifiedData.length > 0) {
      const formattedQuestions = gamifiedData
        .map((item, index) => {
          return item?.fillInBlanksArr.map((fillInBlank, fillIndex) => {
            return {
              id: index * 10 + fillIndex, // Generate unique ID based on index
              type:
                fillInBlank.correctInput.length === 1 ? 'single' : 'paragraph',
              text: fillInBlank.text,
              options: fillInBlank.options,
              selectedOption: null,
              correctInput: fillInBlank?.correctInput,
              selectedOptions: Array(fillInBlank.correctInput.length).fill(
                null,
              ),
            };
          });
        })
        .flat();
      setQuestions(formattedQuestions);
    }
  }, [gamifiedData]);

  const handleOptionClick = (questionId, option, questionData) => {
    console.log('questionId---->', questionId, questionData);

    const question = questions.find(q => q.id === questionId);

    // Alert for already selected options in paragraph type
    if (
      question.type === 'paragraph' &&
      question.selectedOptions.includes(option)
    ) {
      Alert.alert(
        '⚠️ Option Already Selected',
        'Please choose another option.',
      );
      return;
    }

    if (selectedBlank === null) {
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === questionId
            ? {
                ...q,
                selectedOption: option,
                userInput: [
                  {
                    blank: questionData?.correctInput[0]?.blank || 1,
                    answer: option,
                    correct: questionData?.correctInput[0].answer === option,
                  },
                ],
              }
            : q,
        ),
      );
    } else {
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === questionId
            ? {
                ...q,
                selectedOptions: q.selectedOptions.map((opt, idx) =>
                  idx === selectedBlank ? option : opt,
                ),
                userInput: [
                  ...(q.userInput || []),
                  {
                    blank: selectedBlank + 1,
                    answer: option,
                    correct:
                      questionData?.correctInput[selectedBlank]?.answer ===
                      option,
                  },
                ],
              }
            : q,
        ),
      );
      setSelectedBlank(null);
    }
  };

  const handleBlankClick = (questionId, blankIndex) => {
    setSelectedBlank(blankIndex);
  };

  const resetParagraphOptions = questionId => {
    const question = questions.find(q => q.id === questionId);

    // Check if all blanks are already empty
    const allBlanksEmpty = question.selectedOptions.every(
      option => option === null,
    );

    if (allBlanksEmpty) {
      Alert.alert(
        '🔄 Reset କରିବାକୁ କିଛି ନାହିଁ',
        'ସମସ୍ତ ଶୂନ୍ୟସ୍ଥାନ ଖାଲି ଅଛି ,ସେଥିପାଇଁ କିଛି Reset କରିବାକୁ ନାହିଁ!',
        [
          {
            text: 'ଠିକ ଅଛି 👍',
            style: 'default',
          },
        ],
        {cancelable: true},
      );
      return;
    }

    // Proceed with resetting the selected options
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === questionId
          ? {
              ...question,
              selectedOptions: Array(question.selectedOptions.length).fill(
                null,
              ),
            }
          : question,
      ),
    );
  };

  const handleSubmit = () => {
    const unansweredQuestions = questions.filter(question => {
      if (question.type === 'single') {
        return question.selectedOption === null;
      } else if (question.type === 'paragraph') {
        return question.selectedOptions.includes(null);
      }
      return false;
    });

    if (unansweredQuestions.length > 0) {
      Alert.alert(
        '🚫 ଦାଖଲଟି ଅସଂପୂର୍ଣ୍ଣ  ଅଟେ',
        'ଦୟାକରି ଦାଖଲ କରିବା ପୂର୍ବରୁ ସମସ୍ତ ଶୂନ୍ୟସ୍ଥାନ ପୂରଣ କରନ୍ତୁ। ✍️',
        [
          {
            text: 'ଠିକ ଅଛି, ମୁଁ କରିବି 👍',
            style: 'default',
          },
        ],
        {cancelable: true},
      );
      return;
    }

    const userInputData1 = questions.map(q => ({
      id: q.id,
      text: q.text,
      correctInput: q.correctInput,
      userInput: q.userInput,
      options: q.options,
    }));
    console.log('User Input Data:', JSON.stringify(userInputData1, null, 2));

    // Prepare user input data
    const userInputData = gamifiedData
      .filter(gameItem => gameItem.gameType === 'fillInBlanks')
      .map(gameItem => {
        const fillInBlanksArr = gameItem.fillInBlanksArr.map(
          (fillInBlank, index) => {
            const question = questions[index]; // Use index to get the matching question
            console.log('questoin--------<', question);
            if (!question) {
              return fillInBlank; // If no matching question found, return as is
            }

            // Get user input based on question type
            let userInput = [];
            if (question.type === 'single') {
              const selectedOption = question.selectedOption;
              if (selectedOption) {
                userInput = [
                  {
                    blank: 1,
                    answer: selectedOption,
                    correct:
                      question?.correctInput[0].answer === selectedOption
                        ? true
                        : false,
                  },
                ];
              }
            } else if (question.type === 'paragraph') {
              userInput = question.selectedOptions.map((answer, idx) => ({
                blank: idx + 1,
                answer: answer || '',
                correct:
                  question?.correctInput[0].answer === selectedOption
                    ? true
                    : false,
              }));
            }

            // Return updated fillInBlank object with user input in inputAnswer
            return {
              ...fillInBlank,
              userInput,
              inputAnswer: userInput.map(input => input.answer),
            };
          },
        );

        // Collect all user answers into inputAnswer for the game item
        const allUserAnswers = fillInBlanksArr
          .flatMap(fillInBlank => fillInBlank.inputAnswer)
          .filter(answer => answer !== undefined);

        return {
          ...gameItem,
          fillInBlanksArr,
          inputAnswer: allUserAnswers,
        };
      });

    console.log('userInputData--------->', userInputData[0]?.fillInBlanksArr);
    console.log('question check--------->', questions);
    const updateData = userInputData?.map(item => ({
      ...item,
      answered: true,
      fillInBlanksArr: item.fillInBlanksArr.map(blankItem => ({
        text: blankItem.text,
        correctInput: blankItem.correctInput,
        options: blankItem.options,
        userInput: blankItem.userInput,
      })),
      inputAnswer: item.fillInBlanksArr.map(blankItem => ({
        text: blankItem.text,
        correctInput: blankItem.correctInput,
        options: blankItem.options,
        userInput: blankItem.userInput,
      })),
    }));

    const submissionPayload = {
      answered: 'yes',
      gamifiedSecuredMarks: 0,
      gamifiedTotalMarks: userInputData.length,
      managerid: managerid,
      managername: managername,
      passcode: passcode,
      topicId: data.topicData[0].topicId,
      transGamifiedData: updateData, // Updated data with user's inputAnswer
      masterGamifiedData: gamifiedData,
      userid: userid,
      username: user[0].username,
      usertype: usertype,
      appVersion: Version,
    };

    console.log('updateData---->', updateData[0]?.fillInBlanksArr);
    console.log(
      'updateData2---->',
      updateData[0]?.fillInBlanksArr[0]?.correctInput,
    );
    console.log('updateData1---->', updateData);
    // Use JSON.stringify to expand and view the full object structure
    // console.log(
    //   'Submission Payload:',
    //   JSON.stringify(submissionPayload, null, 2),
    // );

    // Uncomment the API call to submit data
    // Api.post(`saveTransTchTrainingGamified`, submissionPayload)
    //   .then(res => {
    //     if (res.status === 200 || res.status === 201) {
    //       console.log('Woo hoo, success');
    //       Alert.alert(
    //         '🎉 Success',
    //         'ଆପଣଙ୍କର ଉତ୍ତର ସଫଳତାର ସହିତ ସଂରକ୍ଷିତ ହୋଇଛି! ✅',
    //         [
    //           {
    //             text: 'ବହୁତ ଭଲ 🚀',
    //             style: 'default',
    //           },
    //         ],
    //         {cancelable: true},
    //       );
    //       navigation.goBack();
    //     }
    //   })
    //   .catch(error => {
    //     console.log('oh no...error');
    //     Alert.alert(
    //       '❌ ତ୍ରୁଟି',
    //       `କିଛି ଭୁଲ ହୋଇଗଲା, ଦୟାକରି କିଛି ସମୟ ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।`,
    //       [
    //         {
    //           text: 'ଠିକ ଅଛି 😟',
    //           style: 'default',
    //         },
    //       ],
    //       {cancelable: true},
    //     );
    //   });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loading />
        </View>
      ) : filteredData[0]?.answered === true ? (
        filteredData[0]?.fillInBlanksArr?.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.serialNumber}>{index + 1}.</Text>
            <View>
              <TouchableOpacity style={styles.questionButton}>
                <Text style={styles.questionText}>
                  {question.text.split('__________').map((part, partIndex) => (
                    <React.Fragment key={partIndex}>
                      {part}
                      {partIndex !==
                        question.text.split('__________').length - 1 && (
                        <Text
                          style={[
                            styles.blank,
                            {textDecorationLine: 'underline'},
                          ]}>
                          {
                            // Display the user's answer if provided, otherwise show '__________'
                            question.userInput[partIndex]?.answer ||
                              '__________'
                          }
                        </Text>
                      )}
                    </React.Fragment>
                  ))}
                </Text>
              </TouchableOpacity>
              <View style={styles.optionList}>
                {question.options.map((option, optIndex) => (
                  <TouchableOpacity
                    key={optIndex}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: question.userInput.some(
                          input => input.answer === option,
                        )
                          ? '#d1e7dd'
                          : '#ffffff',
                      },
                    ]}>
                    <Text style={styles.optionButtonText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))
      ) : (
        questions.map((question, index) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.serialNumber}>{index + 1}.</Text>
            {question.type === 'single' ? (
              <View>
                <TouchableOpacity style={styles.questionButton}>
                  <Text style={styles.questionText}>
                    {question.text
                      .split('__________')
                      .map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                          {part}
                          {partIndex !==
                            question.text.split('__________').length - 1 && (
                            <Text
                              style={[
                                styles.blank,
                                {
                                  textDecorationLine: 'underline',
                                },
                              ]}>
                              {question.selectedOption || '__________'}
                            </Text>
                          )}
                        </React.Fragment>
                      ))}
                  </Text>
                </TouchableOpacity>
                <View style={styles.optionList}>
                  {question.options.map((option, optIndex) => (
                    <TouchableOpacity
                      key={optIndex}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor:
                            question.selectedOption === option
                              ? '#d1e7dd'
                              : '#ffffff',
                        },
                      ]}
                      onPress={() =>
                        handleOptionClick(question.id, option, question)
                      }>
                      <Text style={styles.optionButtonText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    paddingBottom: '10%',
                  }}>
                  <View>
                    <View style={styles.questionButton}>
                      <Text style={styles.questionText}>
                        {question.text
                          .split('__________')
                          .map((part, partIndex) => (
                            <React.Fragment key={partIndex}>
                              {part}
                              {partIndex !==
                                question.text.split('__________').length -
                                  1 && (
                                <Text
                                  onPress={() =>
                                    handleBlankClick(question.id, partIndex)
                                  }
                                  style={[
                                    styles.blank,
                                    {
                                      textDecorationLine: 'underline',
                                    },
                                  ]}>
                                  {question.selectedOptions[partIndex] ||
                                    '__________'}
                                </Text>
                              )}
                            </React.Fragment>
                          ))}
                      </Text>
                    </View>
                    <View style={styles.optionList}>
                      {question.options.map((option, optIndex) => (
                        <TouchableOpacity
                          key={optIndex}
                          style={[
                            styles.optionButton,
                            {
                              backgroundColor:
                                question.selectedOptions.includes(option)
                                  ? '#d1e7dd'
                                  : '#ffffff',
                            },
                          ]}
                          onPress={() =>
                            handleOptionClick(question.id, option)
                          }>
                          <Text style={styles.optionButtonText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {/* Place reset button below options */}
                    <TouchableOpacity
                      onPress={() => resetParagraphOptions(question.id)}
                      style={styles.resetButton}>
                      <Text style={styles.resetButtonText}>
                        Reset Paragraph
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        ))
      )}
      {loading
        ? null
        : !filteredData[0]?.answered && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    marginBottom: 20,
    flex: 1,
    flexDirection: 'row',
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  questionButton: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
    marginTop: -8,
    color: 'black',
  },
  blank: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderColor: '#ced4da',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButtonText: {
    fontSize: 14,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10, // Adjust spacing from options
    alignSelf: 'center', // Center the button below the options
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resetButtonPosition: {
    position: 'absolute',
    top: windowHeight * 0.319,
    left: '40%',
    transform: [{translateX: -55}],
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default FillInTheBlank;
