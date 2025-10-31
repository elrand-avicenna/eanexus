import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PhoneFrame } from '../../components/PhoneFrame';
import { useGameStore } from '../../stores/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Messenger() {
  const router = useRouter();
  const { user, npcs, affinities, loadNPCs, loadAffinities } = useGameStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await loadNPCs();
    if (user) {
      await loadAffinities(user.id);
    }
    setLoading(false);
  };

  const getAffinityForNPC = (npcId: string) => {
    return affinities.find(a => a.npc_id === npcId);
  };

  const getAffinityColor = (level: string) => {
    switch (level) {
      case 'stranger': return '#666';
      case 'acquaintance': return '#00ccff';
      case 'friend': return '#00ff88';
      case 'close_friend': return '#ffff00';
      case 'best_friend': return '#ff00ff';
      default: return '#666';
    }
  };

  const getAffinityLabel = (level: string) => {
    switch (level) {
      case 'stranger': return 'Inconnu';
      case 'acquaintance': return 'Connaissance';
      case 'friend': return 'Ami';
      case 'close_friend': return 'Ami proche';
      case 'best_friend': return 'Meilleur ami';
      default: return 'Inconnu';
    }
  };

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
            <Text style={styles.headerTitle}>Messenger</Text>
            <View style={{ width: 24 }} />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00ffff" />
            </View>
          ) : (
            <ScrollView style={styles.npcList}>
              <Text style={styles.sectionTitle}>Participants ({npcs.length})</Text>
              
              {npcs.map((npc) => {
                const affinity = getAffinityForNPC(npc.id);
                const isFriend = affinity?.is_friend || false;
                
                return (
                  <TouchableOpacity
                    key={npc.id}
                    style={styles.npcCard}
                    onPress={() => router.push(`/messenger/${npc.id}`)}
                  >
                    <LinearGradient
                      colors={['#1a1e3f', '#0a0e27']}
                      style={styles.npcCardGradient}
                    >
                      <Image
                        source={{ uri: npc.avatar }}
                        style={styles.avatar}
                      />
                      
                      <View style={styles.npcInfo}>
                        <Text style={styles.npcName}>{npc.name}</Text>
                        <Text style={styles.npcPersonality}>
                          {npc.personality}
                        </Text>
                        
                        {affinity && (
                          <View style={styles.affinityContainer}>
                            <View
                              style={[
                                styles.affinityDot,
                                { backgroundColor: getAffinityColor(affinity.level) }
                              ]}
                            />
                            <Text
                              style={[
                                styles.affinityText,
                                { color: getAffinityColor(affinity.level) }
                              ]}
                            >
                              {getAffinityLabel(affinity.level)} ({affinity.points}/100)
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.npcActions}>
                        {isFriend ? (
                          <Ionicons name="chatbubble" size={24} color="#00ff88" />
                        ) : (
                          <Ionicons name="lock-closed" size={24} color="#666" />
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  npcList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#00ccff',
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 1,
    paddingHorizontal: 8,
  },
  npcCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  npcCardGradient: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a1e3f',
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  npcInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  npcName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 4,
  },
  npcPersonality: {
    fontSize: 12,
    color: '#00ccff',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  affinityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  affinityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  affinityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  npcActions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
