import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Color, FontFamily} from '../GlobalStyle';

const FabButton = ({onPress, title, iconName = 'share', style = {}}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={24} color={Color.royalblue} />
      </View>
      {title && <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default FabButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Color.white,
    borderRadius: 50,
    width: 56,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderColor: Color.royalblue,
    borderWidth: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    color: Color.royalblue,
    fontSize: 12,
    fontFamily: FontFamily.poppinsMedium,
  },
});
