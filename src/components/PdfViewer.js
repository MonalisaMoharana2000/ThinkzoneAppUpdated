import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';
import * as SIZES from '../utils/dimensions';
import RNFetchBlob from 'react-native-blob-util';
// import utf8 from 'utf8';
const PdfViewer = ({source}) => {
  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={source}
        // cacheFileName={source.name}
        ref={pdf => {
          console.log(pdf, 'pdf');
        }}
        onLoadComplete={(numberOfPages, filePath, exparation) => {
          console.log(
            `Number of pages: ${numberOfPages}`,
            filePath,
            exparation,
          );
          // console.log(`Number of pages: ${numberOfPages}`,filePath);
        }}
        onPageChanged={(page, numberOfPages) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {flex: 1, width: SIZES.WindowWidth, height: SIZES.WindowHeigth},
});
