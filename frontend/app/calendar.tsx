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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Calendar() {
  const router = useRouter();
  const currentDate = new Date();
  currentDate.setFullYear(2316);

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
            <Text style={styles.headerTitle}>Calendrier</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.calendarContainer}>
            <LinearGradient
              colors={['#1a1e3f', '#0a0e27']}
              style={styles.dateCard}
            >
              <Text style={styles.dateYear}>2316</Text>
              <Text style={styles.dateMonth}>
                {format(currentDate, 'MMMM', { locale: fr })}
              </Text>
              <Text style={styles.dateDay}>
                {format(currentDate, 'EEEE d', { locale: fr })}
              </Text>
            </LinearGradient>

            <Text style={styles.sectionTitle}>Événements à venir</Text>
            
            <View style={styles.eventCard}>
              <View style={styles.eventIndicator} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>Aucun événement prévu</Text>
                <Text style={styles.eventDescription}>
                  Les événements apparaitront ici
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Informations</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                • Le calendrier suit le temps réel de l'an 2316
              </Text>
              <Text style={styles.infoText}>
                • Les NPCs se déplacent selon l'heure de la journée
              </Text>
              <Text style={styles.infoText}>
                • Certains événements sont temporels
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
  calendarContainer: {
    flex: 1,
  },
  dateCard: {
    margin: 16,
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00ffff',
    alignItems: 'center',
  },
  dateYear: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 8,
  },
  dateMonth: {
    fontSize: 24,
    color: '#00ccff',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  dateDay: {
    fontSize: 18,
    color: '#00ccff',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#00ccff',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 16,
    letterSpacing: 1,
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#1a1e3f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
    flexDirection: 'row',
  },
  eventIndicator: {
    width: 4,
    backgroundColor: '#00ffff',
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#00ccff',
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#1a1e3f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ffff33',
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: '#00ccff',
    marginBottom: 8,
    lineHeight: 20,
  },
});
