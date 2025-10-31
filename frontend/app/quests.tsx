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

export default function Quests() {
  const router = useRouter();

  const sampleQuests = [
    {
      id: '1',
      title: 'Premier Pas',
      description: 'Terminez la première salle de l\'étage 0',
      type: 'main',
      progress: 100,
      completed: true,
    },
    {
      id: '2',
      title: 'Faire Connaissance',
      description: 'Ajoutez 3 NPCs en amis',
      type: 'social',
      progress: 0,
      completed: false,
    },
    {
      id: '3',
      title: 'Explorateur',
      description: 'Terminez toutes les salles de l\'étage 0',
      type: 'main',
      progress: 10,
      completed: false,
    },
  ];

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
            <Text style={styles.headerTitle}>Tâches</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.questsContainer}>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Complétées</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>En cours</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Quêtes Actives</Text>
            
            {sampleQuests.map((quest) => (
              <TouchableOpacity key={quest.id} style={styles.questCard}>
                <LinearGradient
                  colors={quest.completed ? ['#00ff8833', '#00ff8811'] : ['#1a1e3f', '#0a0e27']}
                  style={styles.questCardGradient}
                >
                  <View style={styles.questHeader}>
                    <View style={[
                      styles.questIcon,
                      quest.completed && styles.questIconCompleted
                    ]}>
                      <Ionicons 
                        name={quest.completed ? 'checkmark' : 'hourglass'} 
                        size={24} 
                        color={quest.completed ? '#00ff88' : '#ffff00'} 
                      />
                    </View>
                    <View style={styles.questInfo}>
                      <Text style={styles.questTitle}>{quest.title}</Text>
                      <Text style={styles.questType}>
                        {quest.type === 'main' ? 'Principale' : 'Secondaire'}
                      </Text>
                    </View>
                    <Text style={styles.questProgress}>
                      {quest.progress}%
                    </Text>
                  </View>
                  
                  <Text style={styles.questDescription}>
                    {quest.description}
                  </Text>

                  {!quest.completed && (
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { width: `${quest.progress}%` }
                        ]} 
                      />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}

            <Text style={styles.comingSoon}>
              Nouvelles quêtes arrivées au fur et à mesure de votre progression
            </Text>
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
  questsContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#00ccff',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#00ccff',
    paddingHorizontal: 16,
    marginBottom: 12,
    letterSpacing: 1,
  },
  questCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  questCardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0a0e27',
    borderWidth: 2,
    borderColor: '#ffff00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questIconCompleted: {
    borderColor: '#00ff88',
  },
  questInfo: {
    flex: 1,
    marginLeft: 12,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 4,
  },
  questType: {
    fontSize: 12,
    color: '#00ccff',
  },
  questProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffff00',
  },
  questDescription: {
    fontSize: 14,
    color: '#00ccff',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#0a0e27',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffff00',
  },
  comingSoon: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    margin: 32,
  },
});
