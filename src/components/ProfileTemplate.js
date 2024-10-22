import {Text, View, Image} from 'react-native';
import React from 'react';
import {Color, FontFamily} from '../GlobalStyle';

export const ProfileItem = ({iconSource, label, value, noTextTransform}) => (
  <View
    style={{
      flex: 1, // Takes up the full height of the screen
      justifyContent: 'center', // Vertically center the content
      alignItems: 'center', // Horizontally center the content
      borderBottomWidth: 0.7,
      borderBottomColor: Color.greyGrey300,
    }}>
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 0.7,
        borderBottomColor: Color.greyGrey300,
        height: 35,
        paddingBottom: 10,
        marginTop: 10,
        alignItems: 'center',
        width: '90%', // Adjust width for a better layout
      }}>
      <Image
        style={{
          width: 20, // Set icon size
          height: 20,
          marginRight: 15, // consistent spacing
        }}
        resizeMode="cover"
        source={iconSource}
      />
      <Text
        style={{
          fontWeight: '700',
          fontFamily: FontFamily.poppinsMedium,
          fontSize: 13.5,
          color: '#000',
        }}>
        {label}
      </Text>
      <Text
        style={{
          color: 'black',
          fontSize: 13.5,
          fontWeight: '500',
          fontFamily: FontFamily.poppinsMedium,
          flex: 1,
          textTransform: noTextTransform ? 'none' : 'capitalize',
          marginLeft: 10, // Adjust margin for spacing between label and value
        }}>
        {value}
      </Text>
    </View>
  </View>
);
