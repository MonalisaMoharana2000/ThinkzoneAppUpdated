import React from 'react';
import {View, StyleSheet, TextInput, Image} from 'react-native';

import SearchIcon from 'react-native-vector-icons/EvilIcons';
import colors from '../utils/Colors';
import Colors from '../utils/Colors';

const SearchBar = ({placeholder, onChangeText, keyboardType, width}) => {
  return (
    <View style={[styles.container, {width: width}]}>
      {/* <SearchIcon
        name="search"
        size={28}
        color={Colors.lightDark}
        style={{marginHorizontal: 10}}
      /> */}
      <Image
        style={{marginHorizontal: 10, width: 24, height: 24}}
        //resizeMode="cover"
        source={require('../assets/Image/search-status.png')}
      />
      <TextInput
        allowFontScaling={false}
        style={styles.text}
        placeholder={placeholder}
        onChangeText={text => onChangeText(text)}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,

    margin: 15,
    height: 52,
    // width:287,
    borderRadius: 22,
    flexDirection: 'row',
    // backgroundColor: '#f3f2ff',
    // elevation: 3,
    marginLeft: 17,
  },
  text: {
    color: colors.black,
    fontSize: 16,
    textTransform: 'capitalize',
    fontWeight: '500',
    flex: 1,
    letterSpacing: 1,
  },
});

export default SearchBar;
