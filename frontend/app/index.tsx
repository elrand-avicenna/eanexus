import React, { useState, useRef, useEffect } from 'react';
import { View, ImageBackground, Pressable, StyleSheet, Dimensions, Linking, Alert, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const videoRef = useRef<Video>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

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
      
      {/* Static background image as fallback */}
      <ImageBackground
        source={require('../assets/background-static.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Video background overlay */}
        <Video
          ref={videoRef}
          source={require('../assets/contact-bg.mp4')}
          style={styles.videoBackground}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          onLoad={() => setVideoLoaded(true)}
          onError={(error) => {
            console.log('Video error:', error);
          }}
        />

        {/* Dark overlay for better text readability */}
        <View style={styles.overlay} />

        {/* Header with name and title */}
        <View style={styles.header}>
          <Text style={styles.name}>ELRAND AVICENNA</Text>
          <Text style={styles.title}>GAME DESIGNER - ANIMATEUR LUDIQUE</Text>
        </View>

        {/* Container for the three buttons positioned over the circles */}
        <View style={styles.buttonsContainer}>
          {/* Left Button - Phone */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.leftButton,
              pressed ? styles.buttonPressed : null
            ]}
            onPress={handlePhonePress}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="call" size={48} color="#FFD700" />
            </View>
          </Pressable>

          {/* Middle Button - Email */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.middleButton,
              pressed ? styles.buttonPressed : null
            ]}
            onPress={handleEmailPress}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="mail" size={48} color="#FFD700" />
            </View>
          </Pressable>

          {/* Right Button - Website */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.rightButton,
              pressed ? styles.buttonPressed : null
            ]}
            onPress={handleWebsitePress}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="globe" size={48} color="#FFD700" />
            </View>
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
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better contrast
  },
  header: {
    position: 'absolute',
    top: height * 0.08,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#87CEEB',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    zIndex: 10,
  },
  button: {
    width: width * 0.2,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    minHeight: 80,
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
    transform: [{ scale: 0.95 }],
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(139, 69, 19, 0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
