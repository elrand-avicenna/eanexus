import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

interface User {
  id: string;
  username: string;
  current_floor: number;
  current_room: number;
  created_at: string;
  last_active: string;
}

interface NPC {
  id: string;
  name: string;
  personality: string;
  current_floor: number;
  current_room: number;
  bio: string;
  avatar: string;
  revealed_info: string[];
}

interface Affinity {
  id: string;
  user_id: string;
  npc_id: string;
  level: string;
  points: number;
  is_friend: boolean;
  messages_count: number;
  last_interaction: string;
}

interface GameState {
  user: User | null;
  npcs: NPC[];
  affinities: Affinity[];
  loading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  createUser: (username: string) => Promise<void>;
  loadUser: (userId: string) => Promise<void>;
  loadNPCs: () => Promise<void>;
  loadAffinities: (userId: string) => Promise<void>;
  addFriend: (npcId: string) => Promise<void>;
  updateUserPosition: (floor: number, room: number) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  npcs: [],
  affinities: [],
  loading: false,
  error: null,

  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      // Check if user exists in AsyncStorage
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (storedUserId) {
        await get().loadUser(storedUserId);
      }
      
      // Initialize game data
      await axios.post(`${API_URL}/api/init/game`);
      
      // Load NPCs
      await get().loadNPCs();
      
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  createUser: async (username: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/user/create`, {
        username
      });
      
      const user = response.data;
      await AsyncStorage.setItem('userId', user.id);
      
      set({ user, loading: false });
      
      // Load affinities
      await get().loadAffinities(user.id);
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  loadUser: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`);
      set({ user: response.data });
      
      // Load affinities
      await get().loadAffinities(userId);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadNPCs: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/npcs`);
      set({ npcs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadAffinities: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/affinity/${userId}`);
      set({ affinities: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addFriend: async (npcId: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await axios.post(`${API_URL}/api/affinity/${user.id}/${npcId}/friend`);
      
      // Reload affinities
      await get().loadAffinities(user.id);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateUserPosition: async (floor: number, room: number) => {
    const { user } = get();
    if (!user) return;
    
    try {
      await axios.put(`${API_URL}/api/user/${user.id}/position?floor=${floor}&room=${room}`);
      set({ user: { ...user, current_floor: floor, current_room: room } });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
