import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PhoneFrame } from '../../components/PhoneFrame';
import { useGameStore } from '../../stores/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  affinity_change: number;
}

export default function ChatScreen() {
  const router = useRouter();
  const { npc: npcId } = useLocalSearchParams();
  const { user, npcs, affinities, addFriend, loadAffinities } = useGameStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const npc = npcs.find(n => n.id === npcId);
  const affinity = affinities.find(a => a.npc_id === npcId);
  const isFriend = affinity?.is_friend || false;

  useEffect(() => {
    if (isFriend && user) {
      loadMessages();
    }
  }, [isFriend, user]);

  const loadMessages = async () => {
    if (!user || !npcId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/messages/${user.id}/${npcId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!npcId) return;
    
    try {
      await addFriend(npcId as string);
      Alert.alert('Succès', `${npc?.name} est maintenant votre ami!`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter cet ami.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !npcId || sending) return;
    
    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/api/messages/send?user_id=${user.id}`, {
        npc_id: npcId,
        content: inputText.trim()
      });
      
      // Add both messages
      setMessages([...messages, response.data.message, response.data.npc_reply]);
      setInputText('');
      
      // Reload affinities to update points
      if (user) {
        await loadAffinities(user.id);
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.detail || 'Impossible d\'envoyer le message');
    } finally {
      setSending(false);
    }
  };

  if (!npc) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>NPC introuvable</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#0a0e27']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <PhoneFrame>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#00ffff" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Image source={{ uri: npc.avatar }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>{npc.name}</Text>
                {affinity && (
                  <Text style={styles.headerAffinity}>
                    Affinité: {affinity.points}/100
                  </Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity onPress={() => {/* TODO: Show NPC profile */}}>
              <Ionicons name="information-circle" size={24} color="#00ffff" />
            </TouchableOpacity>
          </View>

          {!isFriend ? (
            <View style={styles.notFriendContainer}>
              <Ionicons name="lock-closed" size={64} color="#666" />
              <Text style={styles.notFriendText}>
                Vous devez être ami avec {npc.name} pour discuter
              </Text>
              <TouchableOpacity 
                style={styles.addFriendButton}
                onPress={handleAddFriend}
              >
                <Text style={styles.addFriendButtonText}>Ajouter en ami</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Messages */}
              <ScrollView 
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="#00ffff" />
                ) : messages.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Aucun message. Commencez la conversation!
                  </Text>
                ) : (
                  messages.map((msg) => (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageBubble,
                        msg.sender === 'user' 
                          ? styles.messageBubbleUser 
                          : styles.messageBubbleNPC
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          msg.sender === 'user' 
                            ? styles.messageTextUser 
                            : styles.messageTextNPC
                        ]}
                      >
                        {msg.content}
                      </Text>
                      {msg.affinity_change !== 0 && msg.sender === 'user' && (
                        <Text style={styles.affinityChange}>
                          {msg.affinity_change > 0 ? '+' : ''}{msg.affinity_change} affinité
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Message..."
                  placeholderTextColor="#666"
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    (!inputText.trim() || sending) && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || sending}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Ionicons name="send" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00ffff',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  headerAffinity: {
    fontSize: 11,
    color: '#00ccff',
  },
  notFriendContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  notFriendText: {
    fontSize: 16,
    color: '#00ccff',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  addFriendButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00ffff',
    borderRadius: 8,
  },
  addFriendButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#00ffff',
  },
  messageBubbleNPC: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1e3f',
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  messageText: {
    fontSize: 14,
  },
  messageTextUser: {
    color: '#000',
  },
  messageTextNPC: {
    color: '#00ffff',
  },
  affinityChange: {
    fontSize: 10,
    color: '#00ff88',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#00ffff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#00ffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#00ffff',
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  errorText: {
    color: '#ff6600',
    textAlign: 'center',
    marginTop: 32,
  },
});
