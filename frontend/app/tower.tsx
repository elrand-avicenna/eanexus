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

export default function TowerMap() {
  const router = useRouter();
  const { user, npcs } = useGameStore();

  const currentFloor = user?.current_floor || 0;

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
            <Text style={styles.headerTitle}>Carte de la Tour</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.mapContainer}>
            {/* Your Position */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Votre Position</Text>
              <LinearGradient
                colors={['#1a1e3f', '#0a0e27']}
                style={styles.positionCard}
              >
                <Ionicons name="location" size={32} color="#00ffff" />
                <View style={styles.positionInfo}>
                  <Text style={styles.positionText}>
                    Étage {currentFloor}
                  </Text>
                  <Text style={styles.positionSubtext}>
                    Salle {user?.current_room || 0}/9
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* Floor Rooms */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Étage {currentFloor} - Salles</Text>
              <View style={styles.roomsGrid}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.roomCell,
                      i === user?.current_room && styles.roomCellCurrent,
                      i < (user?.current_room || 0) && styles.roomCellCompleted,
                    ]}
                  >
                    <Text style={styles.roomNumber}>{i}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* NPCs Positions */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Positions des Participants</Text>
              {npcs.map((npc) => (
                <View key={npc.id} style={styles.npcPositionCard}>
                  <View style={[
                    styles.npcDot,
                    { backgroundColor: '#00ff88' }
                  ]} />
                  <Text style={styles.npcName}>{npc.name}</Text>
                  <Text style={styles.npcPosition}>
                    Étage {npc.current_floor} • Salle {npc.current_room}
                  </Text>
                </View>
              ))}
            </View>

            {/* Tower Info */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Informations</Text>
              <LinearGradient
                colors={['#1a1e3f', '#0a0e27']}
                style={styles.infoCard}
              >
                <Text style={styles.infoText}>
                  • Total: 200 étages (100 haut, 100 bas)
                </Text>
                <Text style={styles.infoText}>
                  • Chaque étage: 10 salles
                </Text>
                <Text style={styles.infoText}>
                  • Vous êtes dans une tour parallèle
                </Text>
                <Text style={styles.infoText}>
                  • Les autres participants sont dans d'autres tours
                </Text>
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
  mapContainer: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#00ccff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  positionInfo: {
    marginLeft: 16,
  },
  positionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  positionSubtext: {
    fontSize: 14,
    color: '#00ccff',
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomCell: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#1a1e3f',
    borderWidth: 1,
    borderColor: '#00ffff33',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomCellCurrent: {
    backgroundColor: '#00ffff',
  },
  roomCellCompleted: {
    backgroundColor: '#00ff8833',
    borderColor: '#00ff88',
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  npcPositionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1e3f',
    borderRadius: 8,
    marginBottom: 8,
  },
  npcDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  npcName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ffff',
    flex: 1,
  },
  npcPosition: {
    fontSize: 12,
    color: '#00ccff',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  infoText: {
    fontSize: 14,
    color: '#00ccff',
    marginBottom: 8,
    lineHeight: 20,
  },
});
