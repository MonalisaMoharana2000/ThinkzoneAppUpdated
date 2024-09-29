import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

const LoginScreen = ({navigation}) => {
  const handleClick = () => {
    console.log('Navigating to Page 1 (handleClick function)');
    navigation.navigate('Page1');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Go to Page 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Navigating to Page 2');
          navigation.navigate('Page2');
        }}>
        <Text style={styles.buttonText}>Go to Page 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
