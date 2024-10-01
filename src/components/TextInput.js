import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultStyles from '../utils/Style';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const AppTextInput = ({
  iconFirst,
  // width = '100%',

  iconSecond,
  handleSecondIconChange,
  secondIconColor,
  ...otherProps
}) => {
  return (
    /* Inpute box with icons and text inpute */
    <View style={[styles.container]}>
      {iconFirst && (
        <MaterialCommunityIcons
          name={iconFirst}
          size={27}
          color={defaultStyles.Colors.greyPrimary}
          style={styles.icon}
        />
      )}
      <TextInput
        allowFontScaling={false}
        placeholderTextColor={defaultStyles.Colors.greyPrimary}
        style={[defaultStyles.text, styles.inpute]}
        {...otherProps}
      />
      {iconSecond && (
        <TouchableOpacity onPress={handleSecondIconChange}>
          <MaterialCommunityIcons
            name={iconSecond}
            size={20}
            color={secondIconColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 17,
    // borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    placeholderTextColor: '#000000',
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
  },

  icon: {
    marginHorizontal: 9,
    marginVertical: 9,
    marginTop: 15,
  },

  inpute: {
    flex: 1,
    color: '#000000',
    fontSize: 13,
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
  },
});

export default AppTextInput;

// flexDirection: 'row',
// justifyContent: 'space-evenly',
// alignItems: 'center',
// borderBottomWidth: 1,
// borderBottomColor: defaultStyles.Colors.border,
// paddingBottom: 5,
// marginVertical: 5,
// backgroundColor:"grey",
// paddingHorizontal:10,

// borderRadius:100,
