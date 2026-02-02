import localforage from 'localforage';

localforage.config({
  name: 'nst_storage'
});

const HEAVY_KEYS_REGEX = /^(nst_content_|nst_mcq_progress_|nst_custom_chapters_|cached_notes|nst_active_student_tab|weekly_test_mcqs)/;

export const storage = {
  getItem: async <T = any>(key: string): Promise<T | null> => {
    if (HEAVY_KEYS_REGEX.test(key)) {
      try {
        return await localforage.getItem<T>(key);
      } catch (err) {
        console.error(`Error reading ${key} from localforage:`, err);
        return null;
      }
    } else {
      const item = localStorage.getItem(key);
      if (!item) return null;
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        return item as unknown as T;
      }
    }
  },

  setItem: async (key: string, value: any): Promise<void> => {
    if (HEAVY_KEYS_REGEX.test(key)) {
      try {
        await localforage.setItem(key, value);
      } catch (err) {
        console.error(`Error writing ${key} to localforage:`, err);
      }
    } else {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, val);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    if (HEAVY_KEYS_REGEX.test(key)) {
      try {
        await localforage.removeItem(key);
      } catch (err) {
        console.error(`Error removing ${key} from localforage:`, err);
      }
    } else {
      localStorage.removeItem(key);
    }
  }
};
