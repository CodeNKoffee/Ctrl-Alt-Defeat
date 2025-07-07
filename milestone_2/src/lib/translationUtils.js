// Safe translation utility function
export const createSafeT = (t, ready) => {
  return (key) => {
    if (!ready || !t) {
      console.warn(`Translation not ready for key: ${key}`);
      const fallbackKey = key.split('.').pop();
      return fallbackKey.charAt(0).toUpperCase() + fallbackKey.slice(1);
    }

    try {
      const translation = t(key);
      // Check if translation is just the key (meaning translation failed)
      if (translation === key) {
        console.warn(`Missing translation for key: ${key}`);
        const fallbackKey = key.split('.').pop();
        return fallbackKey.charAt(0).toUpperCase() + fallbackKey.slice(1);
      }
      return translation;
    } catch (error) {
      console.error(`Translation error for key ${key}:`, error);
      const fallbackKey = key.split('.').pop();
      return fallbackKey.charAt(0).toUpperCase() + fallbackKey.slice(1);
    }
  };
}; 