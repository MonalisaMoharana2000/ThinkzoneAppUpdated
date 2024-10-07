import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../utils/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRef} from 'react';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import {FlatList} from 'react-native-gesture-handler';

// import Animated from 'react-native-reanimated';

const Accordion = ({
  baselineMark,
  pptMark,
  odiaMark,
  engMark,
  mathMark,
  pedMark,
  techMark,
  days,
  trainingMark,
  traindays,
  user,
  endlineMark,
  odiaMarkEndline,
  engMarkEndline,
  mathMarkEndline,
  techMarkEndline,
  pedMarkEndline,
  nsdcMark,
  achieve,
}) => {
  const [showContent, setShowContent] = useState(false);
  console.log('showContent--->', showContent);
  const [showPpt, setShowPpt] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showEndline, setShowEndline] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleListItem = () => {
    setShowContent(!showContent);
  };
  const toggleListItems = () => {
    setShowPpt(!showPpt);
  };

  const toggleListItemTraining = () => {
    setShowTraining(!showTraining);
  };
  const toggleListItemEndline = () => {
    setShowEndline(!showEndline);
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={40}
        data={achieve}
        renderItem={({item, index}) => (
          <>
            {/* //For Teacher Baseline */}

            {user[0].usertype == 'fellow' ? (
              <>
                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItem()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ</Text>

                          <Text style={styles.title1}>
                            {item.baselineStatus === 'incomplete'
                              ? 'Incomplete'
                              : // : item.baselineMarks + '%'}
                                item.baselineData.securedmark +
                                '/' +
                                item.baselineData.totalmark}
                          </Text>
                        </View>

                        {item.baselineStatus === 'incomplete' ? (
                          console.log('null')
                        ) : (
                          // : item.baselineMarks + '%'}
                          <Icon
                            name="keyboard-arrow-down"
                            style={{marginLeft: -20}}
                            size={30}
                            color={'black'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {item.baselineStatus === 'incomplete'
                    ? console.log('incomplete')
                    : showContent && (
                        <View style={styles.body}>
                          <View>
                            <View style={styles.tableView}>
                              <Text
                                style={{color: 'black', fontWeight: 'bold'}}>
                                Subject
                              </Text>
                              <Text
                                style={{color: 'black', fontWeight: 'bold'}}>
                                Marks
                              </Text>
                            </View>
                            <View style={[styles.tableView, {marginTop: 12}]}>
                              <Text>ଓଡ଼ିଆ</Text>
                              <Text>
                                {item.baselineData.odia_category
                                  ? item.baselineData.odia_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଗଣିତ</Text>
                              <Text>
                                {item.baselineData.math_category
                                  ? item.baselineData.math_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଇଂରାଜୀ</Text>
                              <Text>
                                {item.baselineData.eng_category
                                  ? item.baselineData.eng_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଟେକ୍ନୋଲୋଜି</Text>
                              <Text>
                                {item.baselineData.technology_category
                                  ? item.baselineData.technology_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଶିଶୁ ବିକାଶ</Text>
                              <Text>
                                {item.baselineData.pedagogy_category
                                  ? item.baselineData.pedagogy_category
                                  : 'NA'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                </View>

                {/* //For PPT */}
                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItems()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ପ୍ରବେଶ</Text>

                          <Text style={styles.title1}>
                            {/* {item.pptStatus === 'incomplete'
                          ? 'Incomplete'
                          : // : item.pptMarks + '%'}
                            item.pptData.securedmark +
                            '/' +
                            item.pptData.totalmark} */}
                            {item.pptStatus === 'incomplete' ? (
                              'Incomplete'
                            ) : (
                              // : item.pptMarks + '%'}
                              <Text>{item.pptMarks}%</Text>
                            )}
                          </Text>
                        </View>

                        {item.pptStatus === 'incomplete' ? (
                          console.log('null')
                        ) : (
                          // : item.baselineMarks + '%'}
                          <Icon
                            name="keyboard-arrow-down"
                            style={{marginLeft: -20}}
                            size={30}
                            color={'black'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {item.pptStatus === 'incomplete'
                    ? console.log('Status Incomplete')
                    : showPpt && (
                        <View style={styles.body}>
                          <View style={styles.tableView}>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Subject
                            </Text>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Marks
                            </Text>
                          </View>
                          <FlatList
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            initialNumToRender={10}
                            updateCellsBatchingPeriod={40}
                            data={days}
                            renderItem={({item, index}) => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: 12,
                                }}>
                                <Text>{item._id ? item._id : 'NA'}</Text>
                                <Text>
                                  {item.securedMarks && item.totalMarks
                                    ? item.securedMarks + '/' + item.totalMarks
                                    : 'NA'}
                                </Text>
                              </View>
                            )}
                          />
                        </View>
                      )}
                </View>

                {/* //For Training */}

                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItemTraining()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ପ୍ରସ୍ତୁତି</Text>

                          <Text style={styles.title1}>
                            {/* {item.trainingStatus === 'incomplete'
                          ? 'Incomplete'
                          : // : item.trainingMarks + '%'}
                            item.trainingData.securedmark +
                            '/' +
                            item.trainingData.totalmark} */}
                            {item.trainingStatus === 'incomplete' ? (
                              'Incomplete'
                            ) : (
                              // : item.trainingMarks + '%'}
                              <Text> {item.trainingMarks}%</Text>
                            )}
                          </Text>
                        </View>

                        {item.trainingStatus === 'incomplete' ? (
                          console.log('null')
                        ) : (
                          // : item.baselineMarks + '%'}
                          <Icon
                            name="keyboard-arrow-down"
                            style={{marginLeft: -20}}
                            size={30}
                            color={'black'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {item.trainingStatus === 'incomplete'
                    ? console.log('Status Incomplete')
                    : showPpt && (
                        <View style={styles.body}>
                          <View style={styles.tableView}>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Subject
                            </Text>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Marks
                            </Text>
                          </View>
                          <FlatList
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            initialNumToRender={10}
                            updateCellsBatchingPeriod={40}
                            data={traindays}
                            renderItem={({item, index}) => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: 12,
                                }}>
                                <Text>{item._id ? item._id : 'NA'}</Text>
                                <Text>
                                  {item.securedMarks && item.totalMarks
                                    ? item.securedMarks + '/' + item.totalMarks
                                    : 'NA'}
                                </Text>
                              </View>
                            )}
                          />
                        </View>
                      )}
                </View>

                {/* //For Endline */}

                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItemEndline()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ଏଣ୍ଡ୍ ଲାଇନ୍</Text>

                          <Text style={styles.title1}>
                            {item.endlineStatus === 'incomplete'
                              ? 'Incomplete'
                              : // : item.endlineMarks + '%'}
                                item.endlineData.securedmark +
                                '/' +
                                item.endlineData.totalmark}
                          </Text>
                        </View>

                        {item.endlineStatus === 'incomplete' ? (
                          console.log('null')
                        ) : (
                          // : item.baselineMarks + '%'}
                          <Icon
                            name="keyboard-arrow-down"
                            style={{marginLeft: -20}}
                            size={30}
                            color={'black'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {item.endlineStatus === 'incomplete'
                    ? console.log('Status Incomplete')
                    : showEndline && (
                        <View style={styles.body}>
                          <View style={styles.tableView}>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Subject
                            </Text>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Marks
                            </Text>
                          </View>
                          <View style={{marginTop: 12}}>
                            <View style={styles.tableView}>
                              <Text>ଓଡ଼ିଆ</Text>
                              <Text>
                                {item.endlineData.odia_category
                                  ? item.endlineData.odia_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଗଣିତ</Text>
                              <Text>
                                {item.endlineData.math_category
                                  ? item.endlineData.math_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଇଂରାଜୀ</Text>
                              <Text>
                                {item.endlineData.eng_category
                                  ? item.endlineData.eng_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଟେକ୍ନୋଲୋଜି</Text>
                              <Text>
                                {item.endlineData.technology_category
                                  ? item.endlineData.technology_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଶିଶୁ ବିକାଶ</Text>
                              <Text>
                                {item.endlineData.pedagogy_category
                                  ? item.endlineData.pedagogy_category
                                  : 'NA'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                </View>

                {/* For NSDC */}

                {/* <View style={styles.container}>
                  <TouchableOpacity>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>NSDC</Text>

                          <Text style={styles.title1}>
                            {item.nsdcStatus === 'complete' &&
                            item.nsdcMarks !== 'null'
                              ? item.nsdcMarks
                              : // : item.endlineMarks + '%'}
                              item.nsdcStatus === 'incomplete'
                              ? 'Incomplete'
                              : 'null'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View> */}
              </>
            ) : (
              <>
                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItem()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ପ୍ରାରମ୍ଭ</Text>

                          <Text style={styles.title1}>
                            {item.baselineStatus === 'incomplete'
                              ? 'Incomplete'
                              : // : item.baselineMarks + '%'}
                                item.baselineData.securedmark +
                                '/' +
                                item.baselineData.totalmark}
                          </Text>
                        </View>

                        <Icon
                          name="keyboard-arrow-down"
                          style={{marginLeft: -20}}
                          size={30}
                          color={'black'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {item.baselineStatus === 'incomplete'
                    ? console.log('incomplete')
                    : showContent && (
                        <View style={styles.body}>
                          <View>
                            <View style={styles.tableView}>
                              <Text
                                style={{color: 'black', fontWeight: 'bold'}}>
                                Subject
                              </Text>
                              <Text
                                style={{color: 'black', fontWeight: 'bold'}}>
                                Marks
                              </Text>
                            </View>
                            <View style={[styles.tableView, {marginTop: 12}]}>
                              <Text>ଓଡ଼ିଆ</Text>
                              <Text>
                                {item.baselineData.odia_category
                                  ? item.baselineData.odia_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଗଣିତ</Text>
                              <Text>
                                {item.baselineData.math_category
                                  ? item.baselineData.math_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଇଂରାଜୀ</Text>
                              <Text>
                                {item.baselineData.odia_category
                                  ? item.baselineData.odia_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଟେକ୍ନୋଲୋଜି</Text>
                              <Text>
                                {item.baselineData.technology_category
                                  ? item.baselineData.technology_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଶିଶୁ ବିକାଶ</Text>
                              <Text>
                                {item.baselineData.pedagogy_category
                                  ? item.baselineData.pedagogy_category
                                  : 'NA'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                </View>

                {/* //For PPT */}
                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItems()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ପଞ୍ଜିକରଣ</Text>

                          <Text style={styles.title1}>
                            {/* {item.pptStatus === 'incomplete'
                        ? 'Incomplete'
                        : // : item.pptMarks + '%'}
                          item.pptData.securedmark +
                          '/' +
                          item.pptData.totalmark} */}
                            {item.allStudAssessComplete === false
                              ? 'Incomplete'
                              : // : item.pptMarks + '%'}
                                Complete}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* //For Training */}

                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItemTraining()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ପ୍ରସଙ୍ଗ</Text>

                          <Text style={styles.title1}>
                            {/* {item.trainingStatus === 'incomplete'
                        ? 'Incomplete'
                        : // : item.trainingMarks + '%'}
                          item.trainingData.securedmark +
                          '/' +
                          item.trainingData.totalmark} */}
                            {item.trainingStatus === 'incomplete'
                              ? 'Incomplete'
                              : // : item.trainingMarks + '%'}
                                item.trainingMarks}
                          </Text>
                        </View>

                        <Icon
                          name="keyboard-arrow-down"
                          style={{marginLeft: -20}}
                          size={30}
                          color={'black'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {item.trainingStatus === 'incomplete'
                    ? console.log('Status Incomplete')
                    : showPpt && (
                        <View style={styles.body}>
                          <View style={styles.tableView}>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Subject
                            </Text>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Marks
                            </Text>
                          </View>
                          <FlatList
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            initialNumToRender={10}
                            updateCellsBatchingPeriod={40}
                            data={traindays}
                            renderItem={({item, index}) => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: 12,
                                }}>
                                <Text>{item._id ? item._id : 'NA'}</Text>
                                <Text>
                                  {item.securedMarks && item.totalMarks
                                    ? item.securedMarks + '/' + item.totalMarks
                                    : 'NA'}
                                </Text>
                              </View>
                            )}
                          />
                        </View>
                      )}
                </View>

                {/* //For Endline */}

                <View style={styles.container}>
                  <TouchableOpacity onPress={() => toggleListItemEndline()}>
                    <View>
                      <View style={styles.titleContainer}>
                        <View style={styles.markContainer}>
                          <Text style={styles.title}>ପ୍ରସ୍ଥାପିତ</Text>

                          <Text style={styles.title1}>
                            {item.endlineStatus === 'incomplete'
                              ? 'Incomplete'
                              : // : item.endlineMarks + '%'}
                                item.endlineData.securedmark +
                                '/' +
                                item.endlineData.totalmark}
                          </Text>
                        </View>

                        <Icon
                          name="keyboard-arrow-down"
                          style={{marginLeft: -20}}
                          size={30}
                          color={'black'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {item.endlineStatus === 'incomplete'
                    ? console.log('Status Incomplete')
                    : showEndline && (
                        <View style={styles.body}>
                          <View style={styles.tableView}>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Subject
                            </Text>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                              Marks
                            </Text>
                          </View>
                          <View style={{marginTop: 12}}>
                            <View style={styles.tableView}>
                              <Text>ଓଡ଼ିଆ</Text>
                              <Text>
                                {item.endlineData.odia_category
                                  ? item.endlineData.odia_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଗଣିତ</Text>
                              <Text>
                                {item.endlineData.math_category
                                  ? item.endlineData.math_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଇଂରାଜୀ</Text>
                              <Text>
                                {item.endlineData.eng_category
                                  ? item.endlineData.eng_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଟେକ୍ନୋଲୋଜି</Text>
                              <Text>
                                {item.endlineData.technology_category
                                  ? item.endlineData.technology_category
                                  : 'NA'}
                              </Text>
                            </View>
                            <View style={styles.tableView}>
                              <Text>ଶିଶୁ ବିକାଶ</Text>
                              <Text>
                                {item.endlineData.pedagogy_category
                                  ? item.endlineData.pedagogy_category
                                  : 'NA'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                </View>
              </>
            )}
          </>
        )}
      />
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    // backgroundColor: '#e7e7e7',
  },

  container: {
    // alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    // //  backgroundColor: 'white',
    // backgroundColor: '#1C5C72',
    // borderRadius: 15,
    // marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 10,
    // width: '100%',
    padding: '2%',
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    // overflow: 'hidden',
  },
  tableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    color: '#2d2d2d',
    fontWeight: 'bold',
  },
  body: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  markContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title1: {
    marginRight: 20,
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: 'black',
  },

  headerButton: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'column',
  },
});

const arr = [
  {key: 'ପ୍ରବେଶ'},
  {key: 'ପ୍ରସ୍ତୁତି'},
  {key: 'ଏଣ୍ଡ୍ ଲାଇନ୍'},
  {key: 'NSDC'},
];
