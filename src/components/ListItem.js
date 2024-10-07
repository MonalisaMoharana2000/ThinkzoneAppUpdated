import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import React from 'react';
import Color from '../utils/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ListItem = ({
  backgroundColor,
  title,
  subTitle,
  IconComponent,
  IconComponent1,
  onPress,
  subSub,
  image,
  renderRightActions,
  renderLeftActions,
  rigthButton = true,
  color,
  IconComponent3,
}) => {
  // console.log(item, 'namelistitem');
  return (
    <ScrollView>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}>
        <TouchableHighlight underlayColor={Color.light} onPress={onPress}>
          <View
            style={[
              styles.container,
              {backgroundColor: backgroundColor, color: color},
            ]}>
            {IconComponent}
            {IconComponent1}
            {image && <Image style={styles.image} source={image} />}
            <View style={styles.detailsContainer}>
              {/* <Image style={styles.image} source={image} /> */}
              <Text style={[styles.title, {color: color}]} numberOfLines={1}>
                {title}
              </Text>
              {/* {subTitle && ( */}
              <Text style={[styles.subTitle, {color: color}]} numberOfLines={1}>
                {subTitle}
              </Text>
              <Text style={[styles.subTitle, {color: color}]} numberOfLines={1}>
                {subSub}
              </Text>
              {/* )} */}
            </View>
            {rigthButton && (
              <Icon color={'white'} name="chevron-right" size={25} />
            )}
            <View style={{flexDirection: 'row', paddingTop: 1}}>
              {IconComponent3}
            </View>
          </View>
        </TouchableHighlight>
      </Swipeable>
    </ScrollView>
    // <View style={styles.card}>
    //   <Text style={styles.listtext}>{item.studentname}</Text>
    //   <Text style={styles.listtext}>{item.class}</Text>
    //   <TouchableOpacity
    //     onPress={() => {
    //       Linking.openURL(`tel:${item.phone}`);
    //     }}>
    //     <Ionicons
    //       name="call-sharp"
    //       size={20}
    //       color={Color.white}
    //       style={styles.icon}
    //     />
    //   </TouchableOpacity>
    // </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    // backgroundColor: '#1C5C72',
    borderRadius: 15,
    marginBottom: 13,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 12,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 80,
    marginLeft: -25,
    marginTop: -20,
    // borderRadius: 30,
  },
  subTitle: {
    color: 'black',
    fontWeight: '400',
    fontSize: 18,
    marginTop: 5,
    textTransform: 'uppercase',
  },
  title: {
    color: 'black',
    fontWeight: '800',
    textTransform: 'capitalize',
    letterSpacing: 0.4,
    fontSize: 17,
    flex: 1,
  },
  // card: {
  //   margin: 8,
  //   padding: 20,
  //   height: 100,
  //   width: 350,
  //   backgroundColor: Color.primary,
  //   borderRadius: 10,
  // },
  // listtext: {
  //   color: Color.white,
  // },
});
