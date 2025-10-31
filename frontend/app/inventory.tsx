import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { useGameStore } from '../stores/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

interface InventoryItem {
  item: {
    id: string;
    name: string;
    description: string;
    rarity: string;
    icon: string;
  };
  quantity: number;
  obtained_at: string;
}

export default function Inventory() {
  const router = useRouter();
  const { user } = useGameStore();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/inventory/${user.id}`);
      setInventory(response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#808080';
      case 'uncommon': return '#00ff00';
      case 'rare': return '#0080ff';
      case 'epic': return '#ff00ff';
      case 'legendary': return '#ffaa00';
      default: return '#808080';
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
            <Text style={styles.headerTitle}>Inventaire</Text>
            <View style={{ width: 24 }} />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00ffff" />
            </View>
          ) : inventory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>Votre inventaire est vide</Text>
              <Text style={styles.emptySubtext}>
                Explorez la tour pour trouver des objets
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.inventoryList}>
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  {inventory.length} types d'objets • {inventory.reduce((acc, item) => acc + item.quantity, 0)} total
                </Text>
              </View>

              {inventory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.itemCard}
                >
                  <LinearGradient
                    colors={['#1a1e3f', '#0a0e27']}
                    style={styles.itemCardGradient}
                  >
                    <View style={[
                      styles.itemIcon,
                      { borderColor: getRarityColor(item.item.rarity) }
                    ]}>
                      <Text style={styles.itemIconText}>{item.item.icon}</Text>
                    </View>

                    <View style={styles.itemInfo}>
                      <Text style={[
                        styles.itemName,
                        { color: getRarityColor(item.item.rarity) }
                      ]}>
                        {item.item.name}
                      </Text>
                      <Text style={styles.itemDescription}>
                        {item.item.description}
                      </Text>
                      <Text style={styles.itemRarity}>
                        {item.item.rarity.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.itemQuantity}>
                      <Text style={styles.quantityText}>x{item.quantity}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#00ccff',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  inventoryList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  statsText: {
    color: '#00ccff',
    fontSize: 14,
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemCardGradient: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  itemIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#0a0e27',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconText: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#00ccff',
    marginBottom: 4,
  },
  itemRarity: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
  },
  itemQuantity: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ffff',
  },
});
