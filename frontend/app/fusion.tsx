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

export default function Fusion() {
  const router = useRouter();

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
            <Text style={styles.headerTitle}>Hourglass Eye</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.fusionContainer}>
            <View style={styles.fusionIcon}>
              <Ionicons name="git-merge" size={80} color="#ff00ff" />
            </View>

            <Text style={styles.title}>Fusion d'Objets</Text>
            <Text style={styles.subtitle}>
              Combinez minimum 2 objets pour créer quelque chose de nouveau
            </Text>

            <View style={styles.placeholderContainer}>
              <View style={styles.fusionCircle}>
                <Ionicons name="add" size={48} color="#666" />
              </View>
              <View style={styles.fusionCircle}>
                <Ionicons name="add" size={48} color="#666" />
              </View>
            </View>

            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Sélectionner des objets</Text>
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Comment fonctionne la fusion?</Text>
              <Text style={styles.infoText}>
                • Sélectionnez 2 objets ou plus de votre inventaire
              </Text>
              <Text style={styles.infoText}>
                • La fusion peut échouer selon les objets
              </Text>
              <Text style={styles.infoText}>
                • Des objets rares peuvent être créés
              </Text>
              <Text style={styles.infoText}>
                • Les objets fusionnés disparaissent
              </Text>
            </View>

            <Text style={styles.comingSoon}>Fonctioné complète bientôt disponible</Text>
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
  fusionContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  fusionIcon: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff00ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#00ccff',
    textAlign: 'center',
    marginBottom: 32,
  },
  placeholderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  fusionCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1e3f',
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectButton: {
    backgroundColor: '#ff00ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  selectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#1a1e3f',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff00ff33',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff00ff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#00ccff',
    marginBottom: 8,
  },
  comingSoon: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginBottom: 32,
  },
});
