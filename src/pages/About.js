import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Color, Border, FontSize, FontFamily} from '../GlobalStyle';

const About = () => {
  const openGoogleMaps = () => {
    // Replace with your actual coordinates
    const latitude = 20.480857900811053;
    const longitude = 85.82002402558189;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const initiateCall = () => {
    const phoneNumber = '+91-9178198947';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmail = () => {
    const email = 'info@thinkzone.in';
    Linking.openURL(`mailto:${email}`);
  };
  const openFacebook = () => {
    Linking.openURL('https://www.facebook.com/ThinkZoneIndia/');
  };

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/thinkzoneindia/');
  };

  const openLinkedIn = () => {
    Linking.openURL(
      'https://www.linkedin.com/company/thinkzoneindia/mycompany/',
    );
  };

  const openTwitter = () => {
    Linking.openURL('https://twitter.com/ThinkZoneIndia');
  };

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com/c/ThinkZoneIndia');
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image
        style={styles.tinyLogo}
        // resizeMode="contain"
        source={require('../assets/Image/AboutUsImage.png')}
      />
      {/* <View style={styles.container}> */}
      <ScrollView></ScrollView>
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>About Us</Text>
        <Text style={styles.aboutUsText}>
          ThinkZone empowers parents and educators to develop foundational
          skills of children aged 3 to 10 years by leveraging accessible tech
          solutions and community-led interventions.{'\n'}
          {'\n'}
          Our mobile app is a one-stop solution to help educators in developing
          pedagogy and 21st-century skills. We also support at-home learning for
          children by assisting parents with simple tech tools.
          {'\n'}
          {'\n'}
          Academic researchers and independent evolutions have validated that
          our work has resulted in learning gains among children along with
          improved educators’ skill sets and parental engagement.
        </Text>
        <Text style={styles.heading}>Contact Us</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity onPress={openGoogleMaps}>
            <Image
              style={styles.contactLogo}
              resizeMode="contain"
              source={require('../assets/Image/location2.png')}
            />
          </TouchableOpacity>
          <Text style={styles.contactText} onPress={openGoogleMaps}>
            2nd Floor, Plot No 2B/1096, Sector 11, {'\n'}CDA Cuttack 753015,
            Odisha
          </Text>
        </View>

        <View style={styles.contactContainer}>
          <TouchableOpacity onPress={initiateCall}>
            <Image
              style={styles.contactLogo}
              resizeMode="contain"
              source={require('../assets/Image/call-calling.png')}
            />
          </TouchableOpacity>
          <Text style={styles.contactText} onPress={initiateCall}>
            +91-9178198947
          </Text>
        </View>

        <View style={styles.contactContainer}>
          <TouchableOpacity onPress={openEmail}>
            <Image
              style={styles.contactLogo}
              resizeMode="contain"
              source={require('../assets/Image/sms.png')}
            />
          </TouchableOpacity>
          <Text style={styles.contactText} onPress={openEmail}>
            info@thinkzone.in
          </Text>
        </View>

        <View style={styles.followContainer}>
          <Text style={styles.followText}>Follow Us</Text>

          <View
            style={[
              styles.socialIconsContainer,
              {flexDirection: 'row', paddingBottom: 50},
            ]}>
            <TouchableOpacity onPress={openFacebook} style={styles.socialIcon}>
              <Image
                style={styles.followIcon}
                source={require('../assets/Image/facebook.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openInstagram} style={styles.socialIcon}>
              <Image
                style={styles.followIcon}
                source={require('../assets/Image/instagram.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openLinkedIn} style={styles.socialIcon}>
              <Image
                style={styles.followIcon}
                source={require('../assets/Image/linkedIn.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTwitter} style={styles.socialIcon}>
              <Image
                style={[{width: 25, height: 25, top: 2}]}
                source={require('../assets/Image/twitter.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openYouTube} style={styles.socialIcon}>
              <Image
                style={styles.followIcon}
                source={require('../assets/Image/youtube.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  tinyLogo: {
    width: 393,
    height: 252,
    // aspectRatio: 13 / 7,
    // marginVertical: 10,
    // top: 5,
  },
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  curveCorner: {
    backgroundColor: '#f0f0f0',
    height: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginVertical: -50,
    borderRadius: 20,
    elevation: 3,
    width: '100%',
  },
  heading: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
  },
  aboutUsText: {
    textAlign: 'left',
    marginBottom: 20,
    fontSize: 13,
    // fontFamily: poppinsMedium,
    fontFamily: FontFamily.poppinsRegular,
    color: '#333333',
  },
  addressText: {
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLogo: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  followContainer: {
    marginTop: 20,
  },
  followText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
  },
  // socialIconsContainer: {
  //   flexDirection: 'row',
  // },
  socialIcon: {
    marginHorizontal: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  contactLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  contactText: {
    fontSize: 13,
    fontFamily: FontFamily.poppinsRegular,
    color: '#333333',
  },
  followIcon: {
    width: 32,
    height: 32,
  },
});

export default About;
