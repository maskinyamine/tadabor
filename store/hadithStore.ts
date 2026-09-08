import { create } from 'zustand';

export interface HadithData {
  id?: string;
  collection_name?: string;
  hadithnumber?: number;
  arabic?: string;
  english?: string; // UmmahApi sometimes uses "english"
  translation?: string; // Or "translation"
  book_name?: string;
}

interface HadithState {
  hadith: HadithData | null;
  isLoading: boolean;
  error: string | null;
  fetchRandomHadith: () => Promise<void>;
}

const API_KEY = 'umh_67eb603517eb74322d87edaae21e0ebaf569a450';
const URL = 'https://ummahapi.com/api/hadith/random';

export const useHadithStore = create<HadithState>((set) => ({
  hadith: null,
  isLoading: true,
  error: null,

  fetchRandomHadith: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(URL, {
        headers: {
          'X-API-Key': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const json = await response.json();
      if (json && json.success && json.data) {
        set({ hadith: json.data, isLoading: false });
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error: any) {
      console.error('Erreur fetch hadith:', error);
      set({ error: error.message || 'Une erreur est survenue', isLoading: false });
    }
  },
}));
