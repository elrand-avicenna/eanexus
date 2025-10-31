import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { useGameStore } from '../stores/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Social() {
  const router = useRouter();
  const { npcs, affinities } = useGameStore();

  const friends = npcs.filter(npc => {
    const affinity = affinities.find(a => a.npc_id === npc.id);
    return affinity?.is_friend;
  });

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
            <Text style={styles.headerTitle}>Réseau Social</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.socialContainer}>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={32} color="#00ffff" />
                <Text style={styles.statValue}>{friends.length}</Text>
                <Text style={styles.statLabel}>Amis</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="earth" size={32} color="#00ccff" />
                <Text style={styles.statValue}>{npcs.length}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Vos Amis</Text>
            
            {friends.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="person-add" size={64} color="#666" />
                <Text style={styles.emptyText}>
                  Vous n'avez pas encore d'amis
                </Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => router.push('/messenger')}
                >
                  <Text style={styles.addButtonText}>
                    Aller au Messenger
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              friends.map((npc) => {
                const affinity = affinities.find(a => a.npc_id === npc.id);
                return (
                  <TouchableOpacity
                    key={npc.id}
                    style={styles.friendCard}
                    onPress={() => router.push(`/messenger/${npc.id}`)}
                  >
                    <LinearGradient
                      colors={['#1a1e3f', '#0a0e27']}
                      style={styles.friendCardGradient}
                    >
                      <Image
                        source={{ uri: npc.avatar }}
                        style={styles.friendAvatar}
                      />
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{npc.name}</Text>
                        <Text style={styles.friendLocation}>
                          Étage {npc.current_floor} • Salle {npc.current_room}
                        </Text>
                        {affinity && (
                          <Text style={styles.friendAffinity}>
                            Affinité: {affinity.points}/100
                          </Text>
                        )}
                      </View>
                      <Ionicons name="chatbubble" size={24} color="#00ff88" />
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })
            )}

            <Text style={styles.sectionTitle}>Fil d'Actualité</Text>
            
            <View style={styles.feedCard}>
              <Ionicons name="newspaper" size={48} color="#666" />
              <Text style={styles.feedEmptyText}>
                Aucune activité récente
              </Text>
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
  socialContainer: {
    flex: 1,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    margin: 16,
    backgroundColor: '#1a1e3f',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#00ccff',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#00ccff',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 16,
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#00ccff',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00ffff',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  friendCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  friendCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 16,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 4,
  },
  friendLocation: {
    fontSize: 12,
    color: '#00ccff',
    marginBottom: 4,
  },
  friendAffinity: {
    fontSize: 11,
    color: '#00ff88',
  },
  feedCard: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#1a1e3f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  feedEmptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
  },
});
