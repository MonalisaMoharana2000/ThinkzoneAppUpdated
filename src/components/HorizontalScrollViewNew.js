import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
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

const HorizontalScrollViewNew = ({
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
  const CertificateSection = ({navigation}) => {
    return (
      <View style={styles.certificateContainer}>
        <View style={styles.certificateCard}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.certificateText}>
                Great job! You can view your certificate by clicking here.
              </Text>
              <View style={{top: '30%'}}>
                <TouchableOpacity
                  style={styles.clickButton}
                  onPress={viewCertificate}>
                  <Text style={styles.clickText}>Click Here</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <Image
              // style={styles.shadow}
              // style={{height: 50, width: 50, top: '2%'}}
              source={require('../assets/Image/Ellipsec.png')}
            /> */}
            <Image
              style={styles.certificateLogo}
              source={require('../assets/Image/contract.png')}
            />
          </View>
        </View>
      </View>
    );
  };

  const viewCertificate = () => {
    navigation.navigate('Certificate', {
      moduleName: moduleArr[selectedModule].moduleName,
      moduleId: moduleArr[selectedModule].moduleId,
    });
  };

  const status = moduleArr[selectedModule].moduleIsComplete;

  return (
    <>
      <ScrollView horizontal={true}>
        {moduleArr.map((item, index) => (
          // console.log('sort item---------->', item),
          // <SquareView key={item.key}>
          //   <Text style={{color: 'red'}}>{item.name}</Text>
          // </SquareView>
          <TouchableOpacity
            onPress={() => postModuleid(item, index)}
            key={item.moduleId}
            style={{
              marginTop: 11,
              marginLeft: 9.5,
              marginBottom: 6,
              flexDirection: 'row',
              // width: 120,
              borderWidth: 2,
              borderRadius: 40,
              borderColor:
                index === selectedModule ? Color.royalblue : Colors.white,
              // backgroundColor:
              //   index === selectedModule ? '#ecfeff' : Colors.white,
              backgroundColor:
                item.moduleIsComplete == true ? Color.royalblue : Colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 5,
            }}>
            {item.moduleIsComplete == true ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color:
                      item.moduleIsComplete == true
                        ? Color.white
                        : Colors.black,
                    padding: 10,
                    fontFamily: FontFamily.balooBhaiRegular,
                  }}>
                  {item.moduleName}
                </Text>
              </View>
            ) : (
              <>
                <Text
                  style={{
                    color: '#000000',
                    padding: 10,
                    fontFamily: FontFamily.balooBhaiRegular,
                  }}>
                  {item.moduleName}{' '}
                </Text>
              </>
            )}
            {item.lockStatus == true ? (
              <FontAwesome name="lock" color={Colors.primary} size={22} />
            ) : (
              <></>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {status === true && (
        <View>
          <CertificateSection />
        </View>
      )}
    </>
  );
};

export default HorizontalScrollViewNew;

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
    // left: '5%',
    // position: 'absolute',
    shadowColor: Color.royalblue,
    // top: '2%',
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
