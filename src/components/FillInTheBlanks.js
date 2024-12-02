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
  console.log('questions:', JSON.stringify(questions, null, 2));
  const [selectedBlank, setSelectedBlank] = useState(null);
  console.log('selectedBlank--->', selectedBlank);

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

  console.log('filteredData:', JSON.stringify(filteredData, null, 2));
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
    console.log('questionId:', questionId, 'questionData:', questionData);

    const question = questions.find(q => q.id === questionId);

    if (!question) {
      console.error(`Question with ID ${questionId} not found.`);
      return;
    }

    // Check for duplicate selection in paragraph-type questions
    if (
      question.type === 'paragraph' &&
      question.selectedOptions?.includes(option)
    ) {
      Alert.alert(
        '⚠️ Option Already Selected',
        'Please choose another option.',
      );
      return;
    }

    setQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id !== questionId) return q;

        const updatedUserInput = (q.userInput || []).map(input =>
          input.blank === (selectedBlank !== null ? selectedBlank + 1 : 1)
            ? {
                ...input,
                answer: option,
                correct:
                  questionData?.correctInput?.[selectedBlank ?? 0]?.answer ===
                  option,
              }
            : input,
        );

        if (
          !updatedUserInput.some(
            input =>
              input.blank === (selectedBlank !== null ? selectedBlank + 1 : 1),
          )
        ) {
          updatedUserInput.push({
            blank: selectedBlank !== null ? selectedBlank + 1 : 1,
            answer: option,
            correct:
              questionData?.correctInput?.[selectedBlank ?? 0]?.answer ===
              option,
          });
        }

        return {
          ...q,
          selectedOption: selectedBlank === null ? option : q.selectedOption,
          selectedOptions:
            selectedBlank !== null
              ? q.selectedOptions.map((opt, idx) =>
                  idx === selectedBlank ? option : opt,
                )
              : q.selectedOptions,
          userInput: updatedUserInput,
        };
      }),
    );

    // Reset selectedBlank after updating
    if (selectedBlank !== null) {
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

    // Prepare user input data
    const userInputData = gamifiedData
      .filter(gameItem => gameItem.gameType === 'fillInBlanks')
      .map(gameItem => {
        const updatedFillInBlanksArr = gameItem.fillInBlanksArr.map(
          (fillInBlank, index) => {
            const relatedQuestion = questions.find(
              q => q.questionId === gameItem.questionId,
            );
            if (relatedQuestion && !fillInBlank.userInput.length) {
              let userInput = [];

              if (relatedQuestion.type === 'single') {
                userInput = [
                  {
                    blank: 1,
                    answer: relatedQuestion.selectedOption,
                    correct:
                      relatedQuestion.selectedOption ===
                      relatedQuestion.correctInput[0].answer,
                  },
                ];
              } else if (relatedQuestion.type === 'paragraph') {
                userInput = relatedQuestion.selectedOptions.map(
                  (selectedOption, i) => {
                    const correctAnswer = relatedQuestion.correctInput.find(
                      input => input.blank === i + 1,
                    )?.answer;
                    return {
                      blank: i + 1,
                      answer: selectedOption,
                      correct: selectedOption === correctAnswer,
                    };
                  },
                );
              }

              return {
                ...fillInBlank,
                userInput,
              };
            }
            return fillInBlank;
          },
        );

        return {
          ...gameItem,
          fillInBlanksArr: updatedFillInBlanksArr,
        };
      });

    console.log('userInputData:', JSON.stringify(userInputData, null, 2));

    const createData3 = (userInputData, questions) => {
      return userInputData.map(item1 => {
        item1.fillInBlanksArr = item1.fillInBlanksArr.map(blankItem => {
          const matchedData2 = questions.find(d2 => d2.text === blankItem.text);

          if (matchedData2) {
            blankItem.userInput = matchedData2.userInput || [];
          }

          return blankItem;
        });

        return item1;
      });
    };

    const data3 = createData3(userInputData, questions);

    const updateData = data3?.map((question, qIndex) => ({
      ...question,
      answered: true,
      fillInBlanksArr: question?.fillInBlanksArr.map(correct => ({
        text: question.text,
        correctInput: correct,
        options: question.options,
        // userInput: correct.userInput,
      })),
    }));

    console.log('Submission Payload3:', JSON.stringify(updateData, null, 2));

    const submissionPayload = {
      answered: 'yes',
      gamifiedSecuredMarks: 0,
      gamifiedTotalMarks: userInputData.length,
      managerid: managerid,
      managername: managername,
      passcode: passcode,
      topicId: data.topicData[0].topicId,
      transGamifiedData: updateData,
      masterGamifiedData: gamifiedData,
      userid: userid,
      username: user[0].username,
      usertype: usertype,
      appVersion: Version,
    };

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
        <View style={styles.container}>
          {filteredData?.map((data, dataIndex) =>
            data.answered
              ? data.fillInBlanksArr?.map((question, index) => (
                  <View
                    key={`${dataIndex}-${index}`}
                    style={styles.questionContainer}>
                    <Text style={styles.serialNumber}>{dataIndex + 1}.</Text>
                    <View>
                      <TouchableOpacity style={styles.questionButton}>
                        <Text style={styles.questionText}>
                          {question.correctInput.text
                            .split('__________')
                            .map((part, partIndex) => (
                              <React.Fragment key={partIndex}>
                                {part}
                                {partIndex !==
                                  question.correctInput.text.split('__________')
                                    .length -
                                    1 && (
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
                        {question.correctInput.options.map(
                          (option, optIndex) => (
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
                              <Text style={styles.optionButtonText}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ),
                        )}
                      </View>
                    </View>
                  </View>
                ))
              : null,
          )}
        </View>
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
