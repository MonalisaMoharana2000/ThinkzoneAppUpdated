import React, {useState, useEffect} from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import ListItem from '../components/ListItem';
import SearchBar from '../components/SearchBar';
import Colors from '../utils/Colors';
import API from '../environment/Api';
import SearchIcon from 'react-native-vector-icons/EvilIcons';
import {Color, FontFamily} from '../GlobalStyle';
import * as window from '../utils/dimensions';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

const Dictionary = ({navigation}) => {
  const [word, setWord] = useState('');
  const [wordDetail, setWordDetail] = useState([]);
  const [modal, setModal] = useState(false);

  const searchWord = () => {
    API.get(`/getdictionarysearchresult/${word}`)
      .then(response => {
        setWordDetail(response.data);
        setModal(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          onChangeText={setWord}
          placeholder="Search for a word..."
          width={294}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchWord}>
          <SearchIcon name="search" size={28} color="gray" />
        </TouchableOpacity>
      </View>
      {wordDetail?.length > 0 ? (
        <FlatList
          data={wordDetail}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.wordContainer}>
              {item.meta ? (
                <>
                  <Text style={styles.wordTitle}>{item.meta.id}</Text>
                  <Text style={styles.wordType}>{`\u25CF ${item.fl}`}</Text>
                  <View style={styles.definitionContainer}>
                    <Text style={styles.definitionTitle}>Definitions:</Text>
                    {item.shortdef.map((def, index) => (
                      <Text key={index} style={styles.definitionText}>
                        {index + 1}. {def}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.stemsContainer}>
                    <Text style={styles.stemTitle}>Related Forms:</Text>
                    {item.meta.stems.map((stem, index) => (
                      <Text key={index} style={styles.stemText}>
                        {`\u25CF ${stem}`}
                      </Text>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.noWordText}>No definitions available.</Text>
              )}
            </View>
          )}
          style={styles.resultsContainer}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Image
            style={styles.dictionaryImage}
            resizeMode="contain"
            source={require('../assets/Image/dictionary.jpg')}
          />
          <Text style={styles.noResultsTitle}>Welcome to the Dictionary</Text>
          <Text style={styles.noResultsSubtitle}>
            Type a word to get started
          </Text>
        </View>
      )}
    </View>
  );
};

export default Dictionary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#effafc',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 10,
    margin: 10,
  },
  searchButton: {
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 6,
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  wordContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  wordTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FontFamily.poppinsMedium,
    color: Color.darkslategray_100,
    marginBottom: 5,
  },
  wordType: {
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    color: Colors.darkGray,
    marginBottom: 10,
    fontFamily: FontFamily.poppinsMediumItalic,
  },
  definitionContainer: {
    marginTop: 10,
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 8,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 5,
  },
  definitionText: {
    fontSize: 16,
    color: Color.darkslategray_100,
    marginTop: 5,
    fontFamily: FontFamily.poppinsMedium,
  },
  stemsContainer: {
    marginTop: 15,
  },
  stemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 5,
  },
  stemText: {
    fontSize: 15,
    color: Color.darkslategray_100,
    marginTop: 2,
    fontFamily: FontFamily.poppinsMedium,
  },
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
    backgroundColor: Color.whiteSmoke,
  },
  dictionaryImage: {
    width: windowWidth * 0.8, // 60% of the screen width
    height: windowWidth * 0.8, // 60% of the screen width (keeps it square)
    marginBottom: 20,
    opacity: 0.8,
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.darkslategray_300,
    marginBottom: 8,
    fontFamily: FontFamily.serif,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: Color.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});
