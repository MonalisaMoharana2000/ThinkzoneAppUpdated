import React from 'react';
import {StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '../utils/Colors';

function ErrorMessage({error, visible}) {
  if (!visible || !error) return null;

  return (
    <View style={styles.container}>
      <Animatable.Text
        animation="fadeInLeft"
        duration={500}
        direction="alternate"
        style={styles.error}>
        {error}
      </Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  error: {
    color: Colors.danger,
    fontSize: 15,
    letterSpacing: 1,
  },
});

export default ErrorMessage;
