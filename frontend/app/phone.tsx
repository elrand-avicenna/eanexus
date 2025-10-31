import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { AppIcon } from '../components/AppIcon';
import { useGameStore } from '../stores/gameStore';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Phone() {
  const router = useRouter();
  const { user, npcs, affinities } = useGameStore();

  // Count unread messages (for badge)
  const unreadCount = 0; // TODO: Implement unread messages count

  // Count friends
  const friendsCount = affinities.filter(a => a.is_friend).length;

  return (
    <LinearGradient
      colors={['#000000', '#0a0e27']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <PhoneFrame>
        <View style={styles.wallpaperContainer}>
          {/* Animated background pattern */}
          <LinearGradient
            colors={['#0a0e27', '#000000', '#0a0e27']}
            style={styles.wallpaper}
          >
            <View style={styles.gridPattern}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>
          </LinearGradient>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Bienvenue, {user?.username}</Text>
            <Text style={styles.locationText}>
              Étage {user?.current_floor} • Salle {user?.current_room}
            </Text>
          </View>

          {/* Apps Grid */}
          <ScrollView 
            style={styles.appsContainer}
            contentContainerStyle={styles.appsContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.appsRow}>
              <AppIcon
                label="Messenger"
                icon="chatbubbles"
                onPress={() => router.push('/messenger')}
                badge={unreadCount}
              />
              <AppIcon
                label="Carte"
                icon="map"
                onPress={() => router.push('/tower')}
                color="#ff6600"
              />
              <AppIcon
                label="Inventaire"
                icon="cube"
                onPress={() => router.push('/inventory')}
                color="#00ff88"
              />
            </View>

            <View style={styles.appsRow}>
              <AppIcon
                label="Hourglass Eye"
                icon="git-merge"
                onPress={() => router.push('/fusion')}
                color="#ff00ff"
              />
              <AppIcon
                label="Tâches"
                icon="list"
                onPress={() => router.push('/quests')}
                color="#ffff00"
              />
              <AppIcon
                label="Profil"
                icon="person"
                onPress={() => router.push('/profile')}
                color="#00ffff"
              />
            </View>

            <View style={styles.appsRow}>
              <AppIcon
                label="Calendrier"
                icon="calendar"
                onPress={() => router.push('/calendar')}
                color="#ff6600"
              />
              <AppIcon
                label="Réseau"
                icon="people"
                onPress={() => router.push('/social')}
                color="#00ccff"
                badge={friendsCount}
              />
            </View>
          </ScrollView>
        </View>
      </PhoneFrame>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wallpaperContainer: {
    flex: 1,
  },
  wallpaper: {
    ...StyleSheet.absoluteFillObject,
  },
  gridPattern: {
    flex: 1,
    opacity: 0.1,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#00ffff',
    marginVertical: 20,
  },
  welcomeContainer: {
    padding: 24,
    marginTop: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 8,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#00ccff',
    letterSpacing: 1,
  },
  appsContainer: {
    flex: 1,
  },
  appsContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  appsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
});
