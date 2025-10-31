import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Change year to 2316
  const futureDate = new Date(currentTime);
  futureDate.setFullYear(2316);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Status Bar Cyberpunk */}
      <LinearGradient
        colors={['#0a0e27', '#1a1e3f']}
        style={styles.statusBar}
      >
        <View style={styles.statusBarContent}>
          <Text style={styles.timeText}>
            {format(futureDate, 'HH:mm:ss')}
          </Text>
          <Text style={styles.dateText}>
            {format(futureDate, 'dd MMM yyyy')}
          </Text>
        </View>
        <View style={styles.indicators}>
          <View style={styles.signalDot} />
          <View style={styles.signalDot} />
          <View style={styles.signalDot} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  statusBar: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffff',
    letterSpacing: 2,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#00ccff',
    letterSpacing: 1,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  signalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ffff',
    marginLeft: 4,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  batteryText: {
    fontSize: 10,
    color: '#00ffff',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
});
