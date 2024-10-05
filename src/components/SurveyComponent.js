import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppTextInput from './TextInput';
import * as SIZES from '../utils/dimensions';
import * as window from '../utils/dimensions';
import {RadioButton} from 'react-native-paper';
import {Checkbox} from 'react-native-paper';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Classlabal from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';
import {Picker} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StepIndicator} from 'react-native-step-indicator';
import Slider from '@react-native-community/slider';
import {Col} from 'react-native-table-component';
const emojis = ['😣', '😒', '😐', '😊', '😍'];
const rating = ['Worst', `Not\nGood`, 'Fine', 'Look\nGood', 'Very\nGood'];

const SurveyComponent = ({
  surveyQuestions,
  handleTextChange,
  handleTextAreaChange,
  onChangeRadio,
  onChangeCheckbox,
  handleSelectChange,
  onDateChange,
  sNames,
  surveyDescription,
  handleEmojiRating,
  onTimeValue,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  // console.log('selectedOption---->', selectedOption);

  const [selectedCheckedOption, setSelectedCheckedOption] = useState({});
  const [classLabal, setClassLabal] = useState('');
  const [dob, setDob] = useState('');
  const [feedbackTime, setFeedbackTime] = useState(new Date());

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [selectedAmPm, setSelectedAmPm] = useState('AM');

  const handleCheckboxChange = (questionId, optionId, option) => {
    setSelectedCheckedOption(prevSelectedOptions => {
      const key = `${questionId}_${optionId}`;
      return {
        ...prevSelectedOptions,
        [key]: !prevSelectedOptions[key],
      };
    });

    // Pass the selected option to the onChangeCheckbox function
    onChangeCheckbox(questionId, optionId, option);
  };

  const handleInput1Change = text => {
    // Allow only numeric values and limit to a maximum length of 2
    const numericText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const value = numericText.slice(0, 2); // Limit to 2 characters

    // Validate the value: Up to 12 is valid
    if (value <= 12) {
      setInput1(value);
    }
  };

  const handleInput2Change = text => {
    // Allow only numeric values and limit to a maximum length of 2
    const numericText = text.replace(/[^0-9]/g, '');
    const value = numericText.slice(0, 2);

    // Validate the value: Up to 60 is valid
    if (value <= 60) {
      setInput2(value);
    }
  };

  const handleAmPmChange = (questionId, value) => {
    setSelectedAmPm(value);
    const newTimeValue = `${input1}:${input2} ${value}`;
    onTimeValue(questionId, newTimeValue);
  };
  const [selectedRating, setSelectedRating] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  console.log('sliderValue---->', sliderValue);
  const handleRatingSelect = (emoji, index) => {
    console.log('emoji---->', emoji, index);
    setSelectedRating({emoji, index});
  };
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);
  // console.log('selectedEmoji--->', selectedEmoji);
  const chooseEmoji = (questionId, item) => {
    console.log('====================================', item);
    setSelectedEmoji(emojis[item]);
    setSliderValue(item);
    handleEmojiRating(questionId, item);
    // if (v == 0) setSelectedEmoji(emojis[0]);
    // else if (v == 1) setSelectedEmoji(emojis[1]);
    // else if (v == 2) setSelectedEmoji(emojis[2]);
    // else if (v == 3) setSelectedEmoji(emojis[3]);
    // else if (v == 4) setSelectedEmoji(emojis[4]);
    // else setSelectedEmoji(emojis[0]);
  };
  return (
    <ScrollView
      style={{
        alignSelf: 'center',
        // flex: 1,
        // left: '27%',
        // padding: 0,
        // top: '-18%',
        // height: 17,
        paddingBottom: 80,
      }}>
      <>
        {/* <View
          style={[
            styles.card,
            {
              backgroundColor: '#F5F5F5',
              marginTop: 12,
              width: window.WindowWidth * 0.9,
              borderRadius: 12,
            },
          ]}>
          <View style={styles.subModuContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <View>
                <View>
                  <View>
                    <Text
                      style={[
                        styles.name,
                        {
                          maxWidth: window.WindowWidth * 0.9,
                          color: Colors.royalblue,
                        },
                      ]}>
                      {sNames}
                    </Text>
                  </View>

                  <Text style={{textTransform: 'uppercase'}}>
                    {surveyDescription}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View> */}

        <View style={styles.card}>
          <View
            style={[
              styles.cardComponent,
              {
                backgroundColor: '#F5F5F5',
                marginTop: 12,
                width: window.WindowWidth * 0.9,
                borderRadius: 12,
              },
            ]}>
            {/* <View style={styles.subModuContainer}>
              <Text
                style={[
                  styles.name,
                  {
                    maxWidth: window.WindowWidth * 0.9,
                    color: Colors.royalblue,
                  },
                ]}>
                {sNames}
              </Text>
            </View> */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: '#F5F5F5',
                  marginTop: 12,
                  width: window.WindowWidth * 0.9,
                  borderRadius: 12,
                },
              ]}>
              <View style={styles.subModuContainer}>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}> */}
                <View>
                  <View>
                    <View>
                      <Text
                        style={[
                          styles.name,
                          {
                            maxWidth: window.WindowWidth * 0.9,
                            color: Colors.royalblue,
                            fontSize: 20,
                            // marginBottom: 5,
                            paddingBottom: 10,
                            marginLeft: '36%',
                          },
                        ]}>
                        {sNames}
                      </Text>
                    </View>

                    <Text style={{fontSize: 17}}>{surveyDescription}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* </View> */}
        </View>

        {surveyQuestions?.length > 0 ? (
          <>
            {surveyQuestions.map((item, index) => {
              return (
                <>
                  <View style={styles.card}>
                    <>
                      <View
                        style={[
                          styles.cardComponent,
                          {
                            backgroundColor: '#F5F5F5',
                            marginTop: 12,
                            width: window.WindowWidth * 0.9,
                            borderRadius: 12,
                          },
                        ]}>
                        <View style={styles.subModuContainer}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                            }}>
                            <View>
                              <Text style={styles.title}>
                                {' '}
                                {index + 1}.{item.question}
                                {item.required && (
                                  <View style={{marginLeft: 52}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                  </View>
                                )}
                              </Text>
                              {item.answerType === 'textfield' ? (
                                <TextInput
                                  allowFontScaling={false}
                                  underlineColorAndroid="transparent"
                                  placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                                  placeholderTextColor="grey"
                                  numberOfLines={5}
                                  multiline={true}
                                  keyboardType="ascii-capable"
                                  style={styles.shortinput}
                                  onChangeText={newAnswer =>
                                    handleTextChange(item.questionId, newAnswer)
                                  }
                                />
                              ) : null}

                              {item.answerType === 'textarea' ? (
                                <TextInput
                                  allowFontScaling={false}
                                  underlineColorAndroid="transparent"
                                  placeholder="ଆପଣଙ୍କ ଉତ୍ତର ଦିଅନ୍ତୁ"
                                  placeholderTextColor="grey"
                                  numberOfLines={12}
                                  multiline={true}
                                  keyboardType="ascii-capable"
                                  style={styles.input}
                                  onChangeText={newAnswer =>
                                    handleTextAreaChange(
                                      item.questionId,
                                      newAnswer,
                                    )
                                  }
                                />
                              ) : null}

                              {item.answerType === 'radio' ? (
                                <View
                                  style={{
                                    alignSelf: 'stretch',
                                    paddingLeft: -8,
                                    top: -6,
                                  }}>
                                  <RadioButton.Group
                                    onValueChange={value => {
                                      const clickedOption =
                                        item.allottedOption.find(
                                          option => option.id === value,
                                        );
                                      if (clickedOption) {
                                        // Update the selected options mapping with the clicked questionId
                                        setSelectedOption(prev => ({
                                          ...prev,
                                          [item.questionId]: clickedOption,
                                        }));
                                        onChangeRadio(
                                          item.questionId,
                                          clickedOption,
                                        );
                                      }
                                    }}
                                    value={
                                      selectedOption &&
                                      selectedOption[item.questionId]
                                        ? selectedOption[item.questionId].id
                                        : null
                                    }>
                                    {item.allottedOption.map(option => (
                                      <View
                                        key={option.id}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <RadioButton
                                          value={option.id}
                                          status={
                                            option.id ===
                                            (selectedOption &&
                                            selectedOption[item.questionId]
                                              ? selectedOption[item.questionId]
                                                  .id
                                              : null)
                                              ? 'checked'
                                              : 'unchecked'
                                          }
                                          color={
                                            option.id ===
                                            (selectedOption &&
                                            selectedOption[item.questionId]
                                              ? selectedOption[item.questionId]
                                                  .id
                                              : null)
                                              ? 'blue'
                                              : 'black'
                                          }
                                        />
                                        <Text
                                          onPress={() => {
                                            // Update the selected options mapping with the clicked questionId
                                            setSelectedOption(prev => ({
                                              ...prev,
                                              [item.questionId]: option,
                                            }));
                                            onChangeRadio(
                                              item.questionId,
                                              option,
                                            );
                                          }}>
                                          {option.value}
                                        </Text>
                                      </View>
                                    ))}
                                  </RadioButton.Group>
                                </View>
                              ) : null}

                              {item.answerType === 'checkbox' &&
                              item.allottedOption.length > 0
                                ? item.allottedOption.map((option, index) => (
                                    <View key={option.id}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          width: '90%',
                                        }}>
                                        <Checkbox
                                          status={
                                            selectedCheckedOption[
                                              `${item.questionId}_${option.id}`
                                            ]
                                              ? 'checked'
                                              : 'unchecked'
                                          }
                                          onPress={() =>
                                            handleCheckboxChange(
                                              item.questionId,
                                              option.id,
                                              option,
                                            )
                                          }
                                          color="#0060ca"
                                        />

                                        <Text
                                          onPress={() =>
                                            handleCheckboxChange(
                                              item.questionId,
                                              option.id,
                                              option,
                                            )
                                          }>
                                          {option.value}
                                        </Text>
                                      </View>
                                    </View>
                                  ))
                                : null}

                              {item.answerType === 'select' ? (
                                <View>
                                  <View style={styles.wrapper}>
                                    {/* <Classlabal
                                      name="md-bookmark"
                                      size={25}
                                      color={Colors.greyPrimary}
                                      style={styles.icon}
                                    /> */}
                                    <Picker
                                      selectedValue={classLabal}
                                      onValueChange={(itemValue, itemIndex) => {
                                        const selectedOption =
                                          item.allottedOption.find(
                                            option => option.id === itemValue,
                                          );

                                        if (selectedOption) {
                                          handleSelectChange(
                                            item.questionId,
                                            selectedOption,
                                          );
                                          setClassLabal(itemValue);
                                        }
                                      }}
                                      style={styles.picker}
                                      name="classlabal">
                                      <Picker.Item
                                        label="Choose your Answer"
                                        value="0"
                                        enabled={false}
                                        style={styles.placeHolder}
                                      />
                                      {item.allottedOption.map(item => (
                                        <Picker.Item
                                          label={item.value}
                                          value={item.id}
                                          key={item.id}
                                          style={styles.pickerSelectItem}
                                        />
                                      ))}
                                    </Picker>
                                  </View>
                                </View>
                              ) : null}

                              {item.answerType === 'date' ? (
                                <View style={styles.dob}>
                                  <MaterialIcons
                                    name="date-range"
                                    size={27}
                                    color={Colors.greyPrimary}
                                    style={styles.icon}
                                  />
                                  <DatePicker
                                    style={
                                      {
                                        // width: 363,
                                        // marginLeft: -5,
                                      }
                                    }
                                    date={dob}
                                    mode="date"
                                    placeholder={`DD/MM/YYYY`}
                                    placeholderTextColor={'black'}
                                    dateFormat="DD-MM-YYYY"
                                    //format="YYYY-MM-DD"
                                    format="DD-MM-YYYY"
                                    minDate="01-01-1990"
                                    maxDate="31-12-2020"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                      dateIcon: {
                                        display: 'none',
                                      },
                                      dateInput: {
                                        // marginLeft: -195,
                                        marginRight: -15,
                                        borderWidth: -1,
                                        // position: 'relative',
                                        flex: 1,

                                        height: 50,
                                        marginBottom: -10,
                                        borderRadius: 22,
                                      },
                                    }}
                                    onDateChange={date => {
                                      setDob(date);
                                      onDateChange(item.questionId, date);
                                    }}
                                  />
                                </View>
                              ) : null}

                              {item.answerType === 'rating' ? (
                                <View>
                                  <View>
                                    {/* <Text
                                      style={{
                                        marginBottom: 20,
                                        fontSize: 16,
                                        color: '#2071B2',
                                        fontFamily: FontFamily.poppinsMedium,
                                      }}>
                                      Share your experience in scaling
                                    </Text> */}
                                    <ScrollView horizontal>
                                      <View style={{flexDirection: 'row'}}>
                                        {rating.map((text, index) => (
                                          <TouchableOpacity
                                            key={index}
                                            onPress={() =>
                                              handleRatingSelect(
                                                emojis[index],
                                                index,
                                              )
                                            }
                                            style={{
                                              padding: 10,
                                              width: window.WindowWidth * 0.18,
                                              alignItems: 'center',
                                              backgroundColor: 'white',
                                            }}>
                                            <Text style={{fontSize: 22}}>
                                              {emojis[index]}
                                            </Text>
                                            <Text
                                              style={{
                                                color: 'black',
                                                fontSize: 14,
                                              }}>
                                              {text}
                                            </Text>
                                            {selectedRating &&
                                              selectedRating.index ===
                                                index && (
                                                <View
                                                  style={{
                                                    backgroundColor: '#2071B2',
                                                    height: 4,
                                                    width: '100%',
                                                    marginTop: 5,
                                                    borderRadius: 5,
                                                  }}
                                                />
                                              )}
                                          </TouchableOpacity>
                                        ))}
                                      </View>
                                    </ScrollView>
                                    <View
                                      style={{width: window.WindowWidth * 0.9}}>
                                      <Slider
                                        style={{
                                          width: window.WindowWidth * 0.9,
                                          height: window.WindowHeigth * 0.1,
                                          top: '-3%',
                                          paddingBottom: 12,
                                        }}
                                        // thumbImage={require('../assets/Image/book-square.png')}
                                        minimumValue={0}
                                        maximumValue={emojis.length - 1}
                                        step={1}
                                        value={sliderValue}
                                        onValueChange={value =>
                                          chooseEmoji(item.questionId, value)
                                        }
                                        minimumTrackTintColor={Color.royalblue}
                                        maximumTrackTintColor={Color.royalblue}
                                        thumbTintColor={Color.royalblue}
                                        trackStyle={{
                                          height: 30,
                                        }}
                                      />
                                    </View>

                                    {selectedEmoji && (
                                      <View style={{marginTop: 20}}>
                                        <Text
                                          style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            fontFamily:
                                              FontFamily.poppinsMedium,
                                            color: Color.royalblue,
                                          }}>
                                          You selected: {selectedEmoji}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                </View>
                              ) : null}

                              {item.answerType === 'time' ? (
                                <View style={styles.containerTime}>
                                  <TextInput
                                    allowFontScaling={false}
                                    style={styles.inputTime}
                                    placeholder="hh"
                                    maxLength={2}
                                    keyboardType="numeric"
                                    value={input1}
                                    onChangeText={handleInput1Change}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      paddingHorizontal: 5,
                                      marginTop: 12,
                                    }}>
                                    :
                                  </Text>
                                  <TextInput
                                    allowFontScaling={false}
                                    style={styles.inputTime}
                                    placeholder="mm"
                                    maxLength={2}
                                    keyboardType="numeric"
                                    value={input2}
                                    onChangeText={handleInput2Change}
                                  />
                                  <Picker
                                    selectedValue={selectedAmPm}
                                    style={styles.pickerTime}
                                    onValueChange={value =>
                                      handleAmPmChange(item.questionId, value)
                                    }>
                                    <Picker.Item label="AM" value="AM" />
                                    <Picker.Item label="PM" value="PM" />
                                  </Picker>
                                  <Text style={styles.selectedAmPmText}>
                                    {selectedAmPm}
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>
                    </>
                  </View>
                </>
              );
            })}
          </>
        ) : null}
      </>
    </ScrollView>
  );
};

export default SurveyComponent;

const styles = StyleSheet.create({
  cardComponent: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1,
  },
  subModuContainer: {
    padding: 10,
  },

  card: {
    borderRadius: 8,
    width: SIZES.WindowWidth * 1,
    padding: 14,
    margin: 8,
  },
  title: {
    fontSize: 17,
    color: 'royalblue',
    marginBottom: 8,
    paddingBottom: 20,
  },
  selectedAmPmText: {
    fontSize: 17,
    color: 'black',
    marginTop: 18,
    // marginLeft: -172,
  },
  input: {
    width: window.WindowWidth * 0.83,
    borderWidth: 1,
    borderRadius: 12,
    textAlignVertical: 'top', // Aligns text to the top
    paddingLeft: 10,
  },
  shortinput: {
    borderBottomWidth: 1,
    borderColor: 'black',
    // paddingLeft: 10,
    height: window.WindowHeigth * 0.1,
    marginTop: -42,
  },

  wrapper: {
    width: window.WindowWidth * 0.83,
    backgroundColor: '#f3f2ff',
    fontFamily: FontFamily.poppinsMedium,
  },
  placeHolder: {
    color: 'black',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  icon: {
    marginHorizontal: 5,
    marginVertical: 5,
    marginTop: 15,
  },
  picker: {
    flex: 1,
    color: Colors.black,
  },
  pickerSelectItem: {
    color: 'black',
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dob: {
    marginVertical: 5,
    flexDirection: 'row',
    paddingBottom: 10,
    marginBottom: 17,
    width: window.WindowWidth * 0.9,
    marginHorizontal: -1,
    paddingHorizontal: 11,
    // marginLeft: -2,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    placeholderTextColor: 'black',
  },
  placeholder: {
    fontSize: 18,
    color: 'gray',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputTime: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '19%', // Adjust the width as needed
    marginLeft: 12,
  },
  pickerTime: {
    width: '20%', // Adjust the width as needed
    color: 'red',
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
    // marginLeft: 25,
    top: '3%',
    fontWeight: 'bold',
  },
});
