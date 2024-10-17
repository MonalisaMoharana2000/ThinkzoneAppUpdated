import React, {useState, useEffect} from 'react';
import {Animated, Text, TouchableOpacity, Image, View} from 'react-native';

const ProgressAccordion = ({
  data,
  navigateClick,
  selectedItem,
  moduleId,
  moduleName,
}) => {
  const [blinkAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000); // Blinking interval: 1 second

    return () => clearInterval(interval);
  }, [blinkAnimation]);

  const textStyle = {
    alignSelf: 'center',
    fontSize: 7,
    opacity: blinkAnimation,
    top: '30%',
  };

  return (
    <View>
      {data?.length > 0 ? (
        data.map((item, index) => (
          <View
            key={index}
            style={{
              width: '85%', // Adjusted width here
              paddingBottom: 10,
              padding: 2,
              alignSelf: 'center',
              top: '2%',
              margin: 2,
              flexDirection: 'row',
            }}>
            <Text> {index + 1}. </Text>

            <Text style={{width: 150}}>
              {selectedItem === item.moduleId ? item.submoduleName : null}
            </Text>
            <TouchableOpacity
              onPress={() => navigateClick(item, moduleId, moduleName)}>
              <Animated.Text
                style={[
                  textStyle,
                  {color: 'blue', textDecorationLine: 'underline'},
                ]}>
                Click Here to Complete
              </Animated.Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View
          style={{
            width: '100%',
            paddingBottom: 10,
            padding: 2,
            alignSelf: 'center',
            top: '2%',
            margin: 2,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/Image/pending.png')}
            style={{
              width: 25,
              height: 20,
              marginRight: 10,
            }}
          />
          <Text style={{width: 150}}>Submodules are not complete yet!</Text>
        </View>
      )}
    </View>
  );
};

export default ProgressAccordion;
