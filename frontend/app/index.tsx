import React from 'react';
import { View, ImageBackground, Pressable, StyleSheet, Dimensions, Linking, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const handlePhonePress = async () => {
    const phoneNumber = '1234567899'; // 12 34 56 78 99
    const url = `tel:${phoneNumber}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone dialer is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open phone dialer');
    }
  };

  const handleEmailPress = async () => {
    const email = 'aaa@aaa.com';
    const url = `mailto:${email}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Email app is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email app');
    }
  };

  const handleWebsitePress = async () => {
    const url = 'https://elrand-avicenna.github.io/eanexus/';
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open website');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open website');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Container for the three buttons positioned over the circles */}
        <View style={styles.buttonsContainer}>
          {/* Left Button - Phone */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.leftButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handlePhonePress}
          >
            <View style={styles.buttonTouchArea} />
          </Pressable>

          {/* Middle Button - Email */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.middleButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleEmailPress}
          >
            <View style={styles.buttonTouchArea} />
          </Pressable>

          {/* Right Button - Website */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.rightButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleWebsitePress}
          >
            <View style={styles.buttonTouchArea} />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: height * 0.15, // Position buttons in the lower third where the circles are
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },
  button: {
    width: width * 0.2,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    // Left circle position
  },
  middleButton: {
    // Middle circle position
  },
  rightButton: {
    // Right circle position
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonTouchArea: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});
