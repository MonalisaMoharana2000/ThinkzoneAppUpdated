import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import RenderHtml from 'react-native-render-html';

const HtmlContentCoponent = ({sourceData}) => {
  console.log(sourceData, 'sourceData');
  // console.log(source, 'source');
  const {width} = useWindowDimensions();
  const formated_sourcedata = sourceData.replace('<p><br></p>', '');

  const source = {
    html: `${formated_sourcedata}`,
  };

  return (
    <View style={{backgroundColor: 'white'}}>
      <RenderHtml
        // contentWidth={width * 0.9}
        source={source}
        tagsStyles={tagsStyles}
      />
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
    // alignSelf: 'center',

    marginLeft: 15,
    color: 'black',
    // fontWeight: '600',
  },

  a: {
    color: 'green',
  },
  ul: {
    // paddingLeft: 20,
    fontSize: 24,
    width: '95%',
  },
  li: {
    fontSize: 21,
    marginTop: -6,
  },

  // th,
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
