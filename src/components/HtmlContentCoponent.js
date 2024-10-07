import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import RenderHtml from 'react-native-render-html';

const HtmlContentCoponent = ({sourceData}) => {
  console.log(sourceData, 'sourceData');
  const {width} = useWindowDimensions();
  const formated_sourcedata = sourceData.replace('<p><br></p>', '');

  const source = {
    html: `${formated_sourcedata}`,
  };

  return (
    <View style={{backgroundColor: 'white'}}>
      <RenderHtml source={source} tagsStyles={tagsStyles} />
    </View>
  );
};

export default HtmlContentCoponent;

const styles = StyleSheet.create({});
const tagsStyles = {
  h1: {
    color: 'black',
    alignSelf: 'center',
  },
  p: {
    fontSize: 20,
    width: '90%',
    marginLeft: 15,
    color: 'black',
  },

  a: {
    color: 'green',
  },
  ul: {
    fontSize: 24,
    width: '95%',
  },
  li: {
    fontSize: 21,
    marginTop: -6,
  },
  table: {
    borderColor: '#666666',
    width: '90%',
    alignSelf: 'center',
  },

  td: {
    borderWidth: 0.6,
    borderColor: '#666666',
    borderRadius: 0,
  },
  th: {
    borderWidth: 0.6,
    borderColor: '#666666',
    borderRadius: 0,
  },
};