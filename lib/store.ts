import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  deals: Deal[];
  isConnected: boolean;
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export interface UIState {
  isShitpostMode: boolean;
  isKonamiMode: boolean;
  activeScene: 'hero' | 'deals' | 'leaderboard' | 'terminal';
  cameraPosition: [number, number, number];
  showWalletModal: boolean;
  showDealModal: boolean;
}

interface AppState {
  // User state
  user: User | null;
  isLoading: boolean;
  
  // UI state
  ui: UIState;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  addDeal: (deal: Omit<Deal, 'id' | 'timestamp'>) => void;
  toggleShitpostMode: () => void;
  toggleKonamiMode: () => void;
  setActiveScene: (scene: UIState['activeScene']) => void;
  setCameraPosition: (position: [number, number, number]) => void;
  setShowWalletModal: (show: boolean) => void;
  setShowDealModal: (show: boolean) => void;
}

// Mock data for demo
const mockUser: User = {
  id: '0x1234...5678',
  name: 'DegenApe',
  avatar: '/avatars/degen-ape.png',
  trustScore: 85,
  deals: [
    {
      id: '1',
      title: 'PEPE Moon Mission',
      amount: 0.5,
      token: 'ETH',
      timestamp: new Date(Date.now() - 3600000),
      status: 'completed',
      txHash: '0xabc...def'
    },
    {
      id: '2',
      title: 'Based Protocol Airdrop',
      amount: 1000,
      token: 'BASED',
      timestamp: new Date(Date.now() - 7200000),
      status: 'pending'
    }
  ],
  isConnected: false
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  
  ui: {
    isShitpostMode: false,
    isKonamiMode: false,
    activeScene: 'hero',
    cameraPosition: [0, 0, 5],
    showWalletModal: false,
    showDealModal: false,
  },
  
  // Actions
  connectWallet: async () => {
    set({ isLoading: true });
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    set({
      user: { ...mockUser, isConnected: true },
      isLoading: false,
      ui: { ...get().ui, showWalletModal: false }
    });
  },
  
  disconnectWallet: () => {
    set({
      user: null,
      ui: { ...get().ui, showWalletModal: false }
    });
  },
  
  addDeal: (dealData) => {
    const newDeal: Deal = {
      ...dealData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    set(state => ({
      user: state.user ? {
        ...state.user,
        deals: [newDeal, ...state.user.deals]
      } : null
    }));
  },
  
  toggleShitpostMode: () => {
    set(state => ({
      ui: { ...state.ui, isShitpostMode: !state.ui.isShitpostMode }
    }));
  },
  
  toggleKonamiMode: () => {
    set(state => ({
      ui: { ...state.ui, isKonamiMode: !state.ui.isKonamiMode }
    }));
  },
  
  setActiveScene: (scene) => {
    set(state => ({
      ui: { ...state.ui, activeScene: scene }
    }));
  },
  
  setCameraPosition: (position) => {
    set(state => ({
      ui: { ...state.ui, cameraPosition: position }
    }));
  },
  
  setShowWalletModal: (show) => {
    set(state => ({
      ui: { ...state.ui, showWalletModal: show }
    }));
  },
  
  setShowDealModal: (show) => {
    set(state => ({
      ui: { ...state.ui, showDealModal: show }
    }));
  },
})); 