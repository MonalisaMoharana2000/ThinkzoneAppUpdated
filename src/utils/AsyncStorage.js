import AsyncStorage from '@react-native-async-storage/async-storage';

//Storing a value in Async storage
const storeValue = async (storage_Key, value) => {
  try {
    await AsyncStorage.setItem(storage_Key, value);
  } catch (error) {
    if (error.response.status === 413) {
      console.log('error is---------------->', error);
    } else if (error.response.status === 504) {
      console.log('Error is--------------------->', error);
    } else if (error.response.status === 500) {
      console.error('Error is------------------->:', error);
    } else {
      console.error('Error is------------------->:', error);
    }
  }
};

//Storing an object in Async storage
const storeObject = async (storage_Key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storage_Key, jsonValue);
    console.log('dataStored succefully------->');
  } catch (error) {
    if (error.response.status === 413) {
      console.log('error is---------------->', error);
    } else if (error.response.status === 504) {
      console.log('Error is--------------------->', error);
    } else if (error.response.status === 500) {
      console.error('Error is------------------->:', error);
    } else {
      console.error('Error is------------------->:', error);
    }
  }
};

//Getting a value in Async storage
const getValue = async storage_Key => {
  try {
    const value = await AsyncStorage.getItem(storage_Key);
    console.log('dataFetched succefully------->');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    if (error.response.status === 413) {
      console.log('error is---------------->', error);
    } else if (error.response.status === 504) {
      console.log('Error is--------------------->', error);
    } else if (error.response.status === 500) {
      console.error('Error is------------------->:', error);
    } else {
      console.error('Error is------------------->:', error);
    }
  }
};

//Getting an object in Async storage
const getObject = async storage_Key => {
  console.log('called get object');
  try {
    const jsonValue = await AsyncStorage.getItem(storage_Key);
    // console.log('jsonValue----->', jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
    // return jsonValue;
  } catch (error) {
    if (error.response.status === 413) {
      console.log('error is---------------->', error);
    } else if (error.response.status === 504) {
      console.log('Error is--------------------->', error);
    } else if (error.response.status === 500) {
      console.error('Error is------------------->:', error);
    } else {
      console.error('Error is------------------->:', error);
    }
  }
};

//Removing a value from Async storage
const removeValue = async storage_Key => {
  try {
    await AsyncStorage.removeItem(storage_Key);
  } catch (error) {
    if (error.response.status === 413) {
      console.log('error is---------------->', error);
    } else if (error.response.status === 504) {
      console.log('Error is--------------------->', error);
    } else if (error.response.status === 500) {
      console.error('Error is------------------->:', error);
    } else {
      console.error('Error is------------------->:', error);
    }
  }
};

//Clearing the Async storage
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    if (error.response.status === 413) {
      console.log('error is---------------->', error);
    } else if (error.response.status === 504) {
      console.log('Error is--------------------->', error);
    } else if (error.response.status === 500) {
      console.error('Error is------------------->:', error);
    } else {
      console.error('Error is------------------->:', error);
    }
  }
};

export default {
  getValue,
  getObject,
  storeValue,
  storeObject,
  removeValue,
  clearStorage,
};
