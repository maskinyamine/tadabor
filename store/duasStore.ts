import { create } from 'zustand';

const API_KEY = 'umh_67eb603517eb74322d87edaae21e0ebaf569a450';

export interface DuaCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  repeat: number;
}

interface DuasState {
  categories: DuaCategory[];
  duas: Dua[];
  isLoading: boolean;
  error: string | null;
  fetchDuas: () => Promise<void>;
  getDuasByCategory: (categoryId: string) => Dua[];
}

export const useDuasStore = create<DuasState>((set, get) => ({
  categories: [],
  duas: [],
  isLoading: false,
  error: null,

  fetchDuas: async () => {
    if (get().duas.length > 0 || get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('https://ummahapi.com/api/duas', {
        headers: { 'X-API-Key': API_KEY },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const json = await response.json();
      if (json?.success && json.data) {
        set({
          categories: json.data.categories || [],
          duas: json.data.duas || [],
          isLoading: false,
        });
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error: any) {
      set({ error: error.message || 'Erreur API', isLoading: false });
    }
  },

  getDuasByCategory: (categoryId: string) => {
    return get().duas.filter((d) => d.category === categoryId);
  },
}));
