import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import Colors from '../utils/Colors';
import {FontFamily, Color} from '../GlobalStyle';
import * as window from '../utils/dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SquareView = props => {
  return (
    <TouchableOpacity
      style={{
        height: props.size,
        width: props.size,
        backgroundColor: props.color,
      }}
    />
  );
};

const TrainingModulesPage = ({
  moduleArr,
  callbackfun,
  navigation,
  route,
  selectedModule,
}) => {
  const postModuleid = (item, index) => {
    callbackfun(item, index);
    if (item.lockStatus == true) {
      Alert.alert(
        'ଆଗକୁ ବଢିବା ପାଇଁ ପୂର୍ବ ମଡ୍ୟୁଲ୍ ସଂପୂର୍ଣ୍ଣ କରନ୍ତୁ ।',
        '',
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'OK',
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      callbackfun(item, index);
      // setSelectedModule(index);
    }
  };

  const status = moduleArr[selectedModule].moduleIsComplete;

  //^-------------------------------------------------------------------------------------------------------------------------------
  console.log('moduleArr------------------>', moduleArr);
  //   const moduleName = moduleArr[0].moduleName;
  //   console.log('moduleName----------->', moduleName);
  return (
    <>
      <ScrollView></ScrollView>
      {status === true && (
        <View>
          <CertificateSection />
        </View>
      )}
    </>
  );
};

export default TrainingModulesPage;

const styles = StyleSheet.create({
  certificateContainer: {
    flexGrow: 1,
    width: window.WindowWidth * 0.97,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginLeft: 20,
    borderRadius: 10,
    elevation: 10,
    right: 10,
  },
  certificateCard: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  certificateText: {
    fontSize: 13,
    color: '#333333',
    alignSelf: 'center',
    top: 10,
    paddingLeft: 20,
    fontFamily: FontFamily.poppinsMedium,
    width: 250,
  },
  certificateLogo: {
    width: window.WindowWidth * 0.37,
    height: 'auto',
    // right: '52%',
    left: -25,
    shadowColor: Color.royalblue,
  },
  clickButton: {
    backgroundColor: Color.royalblue,
    marginLeft: 20,
    borderRadius: 20,
    width: window.WindowWidth * 0.25,
    top: '-25%',
  },
  clickText: {
    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    textAlign: 'center',
    color: 'white',
    paddingBottom: 4,
    paddingTop: 4,
    fontSize: 13,
  },
  shadow: {width: 150, height: 100, right: '20%'},
});
