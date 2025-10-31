import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useGameStore } from '../stores/gameStore';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const router = useRouter();
  const { user, initialize, createUser, loading } = useGameStore();
  const [username, setUsername] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  useEffect(() => {
    // Initialize game on mount
    initialize();
  }, []);

  useEffect(() => {
    // If user exists, skip intro
    if (user) {
      router.push('/phone');
    }
  }, [user]);

  const introTexts = [
    "Bienvenue dans la Tour de Survie.",
    "Année 2316.",
    "Vous vous réveillez dans une pièce vide.",
    "Un seul objet : un smartphone.",
    "200 étages. 100 vers le haut, 100 vers le bas.",
    "Votre mission : survivre et explorer.",
    "Résolvez les énigmes. Trouvez les trésors.",
    "Vous n'êtes pas seul...",
    "10 autres participants dans des tours parallèles.",
    "Le smartphone est votre seul lien.",
  ];

  const handleContinue = () => {
    if (introStep < introTexts.length - 1) {
      setIntroStep(introStep + 1);
    } else {
      setShowIntro(false);
    }
  };

  const handleStart = async () => {
    if (username.trim()) {
      await createUser(username.trim());
    }
  };

  if (showIntro) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0e27', '#1a1e3f']}
        style={styles.container}
      >
        <StatusBar style="light" />
        <View style={styles.introContainer}>
          <Text style={styles.introText}>{introTexts[introStep]}</Text>
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {introStep < introTexts.length - 1 ? 'Continuer' : 'Commencer'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#0a0e27', '#1a1e3f']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Tour de Survie</Text>
            <Text style={styles.year}>2316</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.subtitle}>Identifiez-vous</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom du participant</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Entrez votre nom"
                placeholderTextColor="#555"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.startButton,
                (!username.trim() || loading) && styles.startButtonDisabled
              ]} 
              onPress={handleStart}
              disabled={!username.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.startButtonText}>Entrer dans la Tour</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.warningText}>
              ⚠️ Une fois entré, vous ne pourrez pas revenir en arrière.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  introText: {
    fontSize: 24,
    color: '#00ffff',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 36,
    letterSpacing: 1,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  continueButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#00ffff',
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  formContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 3,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  year: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ccff',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 4,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#00ffff',
    marginBottom: 32,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#00ccff',
    marginBottom: 32,
    letterSpacing: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  label: {
    color: '#00ccff',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: '#00ffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#00ffff',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
  },
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#00ffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonDisabled: {
    opacity: 0.3,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  warningText: {
    color: '#ff6600',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
