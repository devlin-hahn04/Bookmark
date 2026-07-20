const isExtension = typeof chrome !== 'undefined' && chrome.storage?.local;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    if (isExtension) {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? null;
    }
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  async set(key: string, value: any): Promise<void> {
    if (isExtension) {
      await chrome.storage.local.set({ [key]: value });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  async remove(key: string): Promise<void> {
    if (isExtension) {
      await chrome.storage.local.remove(key);
    } else {
      localStorage.removeItem(key);
    }
  },
};
