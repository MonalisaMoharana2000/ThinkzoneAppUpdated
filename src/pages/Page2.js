import React, {useEffect} from 'react';
import {View, Button, BackHandler, StyleSheet} from 'react-native';

const Page2 = ({navigation}) => {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button
        title="Go to Page 3"
        onPress={() => navigation.navigate('Page3')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page2;
