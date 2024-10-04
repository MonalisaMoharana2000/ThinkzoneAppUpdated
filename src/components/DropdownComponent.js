import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as SIZES from '../utils/dimensions';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/Feather';

// const data = [
//   {label: 'Item 1', value: '1'},
//   {label: 'Item 2', value: '2'},
//   {label: 'Item 3', value: '3'},
//   {label: 'Item 4', value: '4'},
//   {label: 'Item 5', value: '5'},
//   {label: 'Item 6', value: '6'},
//   {label: 'Item 7', value: '7'},
//   {label: 'Item 8', value: '8'},
// ];

const DropdownComponent = ({
  data,
  onChange,
  set,
  label,
  Dropdownlabel,
  IconComponent1,
  IconComponent,
  label2,
  image,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          {Dropdownlabel}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.data}
        bgColor={'grey'}
        color={'red'}
        data={data}
        search
        maxHeight={300}
        labelField={label}
        labelField2={label2}
        valueField="value"
        // placeholder={!isFocus ? 'Select item' : '...'}
        placeholder={set}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          // <AntDesign
          //   style={styles.icon}
          //   color={isFocus ? 'blue' : 'black'}
          //   name="Safety"
          //   size={20}
          // />
          <>
            {IconComponent}
            {IconComponent1}
            {image && <Image style={styles.image} source={image} />}
          </>
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    padding: 16,
    width: '100%',
  },
  dropdown: {
    height: 50,
    // width: SIZES.WindowWidth * 0.9,
    width: '100%',

    borderColor: 'black',
    borderWidth: 0.4,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  data: {
    color: '#123a7a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 25,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    marginLeft: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    color: Colors.lightGrey,
    height: 40,
    fontSize: 16,
  },
  image: {
    width: 25,
    height: 20,
    marginLeft: -2,
    paddingRight: -20,
    // marginTop: -20,
    // borderRadius: 30,
    marginHorizontal: 10,
  },
});
