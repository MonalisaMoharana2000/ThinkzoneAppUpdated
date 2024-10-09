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
    // <View style={{flex: 1, flexDirection: 'row'}}>
    //   <WebView style={{flex: 1}} source={source} />
    //   {/* <HTMLView value={htmlContent} stylesheet={styles} /> */}
    // </View>
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
  // li: {
  //   // marginTop: -18,
  //   // display: 'flex',
  //   // flexDirection: 'row',
  //   // marginRight: 10,

  //   fontSize: 30, // Adjust the font size of list items
  //   marginVertical: 55, // Adjust the vertical margin of list items
  // },
  ul: {
    // paddingLeft: 20,
    fontSize: 24,
    width: '95%',
    // marginVertical: 7,
    // marginBottom: 5,
    // top: 55,
  },
  li: {
    fontSize: 21,
    marginTop: -6,
    // paddingLeft: 25, // Adjust spacing between bullet and content
    // position: 'relative',
  },
  // '::before': {
  //   content: '""',
  //   position: 'absolute',
  //   left: 0,
  //   top: 8, // Adjust vertical position of bullet
  //   width: 10, // Adjust width of bullet
  //   height: 10, // Adjust height of bullet
  //   backgroundColor: 'black', // Adjust bullet color
  //   borderRadius: 5, // Adjust border radius to make it round
  // },

  // th,
  table: {
    // borderWidth: 0.6,
    borderColor: '#666666',
    width: '90%',
    alignSelf: 'center',
    // borderRadius: 5,
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
