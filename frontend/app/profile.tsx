import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { useGameStore } from '../stores/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Profile() {
  const router = useRouter();
  const { user, affinities } = useGameStore();

  const friendsCount = affinities.filter(a => a.is_friend).length;
  const totalAffinity = affinities.reduce((acc, a) => acc + a.points, 0);
  const avgAffinity = affinities.length > 0 ? Math.round(totalAffinity / affinities.length) : 0;

  return (
    <LinearGradient
      colors={['#000000', '#0a0e27']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <PhoneFrame>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#00ffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profil</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.profileContainer}>
            {/* User Card */}
            <LinearGradient
              colors={['#1a1e3f', '#0a0e27']}
              style={styles.userCard}
            >
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={64} color="#00ffff" />
              </View>
              <Text style={styles.username}>{user?.username}</Text>
              <Text style={styles.userSubtitle}>Participant - Tour Parallèle</Text>
            </LinearGradient>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.current_floor}</Text>
                <Text style={styles.statLabel}>Étage Actuel</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{friendsCount}</Text>
                <Text style={styles.statLabel}>Amis</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{avgAffinity}</Text>
                <Text style={styles.statLabel}>Affinité Moy.</Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Progression</Text>
              <LinearGradient
                colors={['#1a1e3f', '#0a0e27']}
                style={styles.progressCard}
              >
                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Salles complétées</Text>
                  <Text style={styles.progressValue}>
                    {(user?.current_room || 0)} / 10
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((user?.current_room || 0) / 10) * 100}%` }
                    ]}
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Info */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Informations</Text>
              <LinearGradient
                colors={['#1a1e3f', '#0a0e27']}
                style={styles.infoCard}
              >
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Entré le:</Text>
                  <Text style={styles.infoValue}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dernière activité:</Text>
                  <Text style={styles.infoValue}>
                    {user?.last_active ? new Date(user.last_active).toLocaleDateString('fr-FR') : '-'}
                  </Text>
                </View>
              </LinearGradient>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00ffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffff',
    letterSpacing: 2,
  },
  profileContainer: {
    flex: 1,
  },
  userCard: {
    margin: 16,
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00ffff',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0a0e27',
    borderWidth: 3,
    borderColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 8,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#00ccff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1e3f',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#00ccff',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#00ccff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#00ccff',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0a0e27',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ffff',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#00ccff',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ffff',
  },
});
