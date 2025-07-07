// Safe translation utility function
export const createSafeT = (t, ready) => {
  return (key, fallback = key) => {
    if (!ready || typeof t !== 'function') {
      return fallback;
    }
    try {
      const result = t(key);
      return result || fallback;
    } catch (error) {
      console.warn(`Translation failed for key: ${key}`, error);
      return fallback;
    }
  };
};

// Helper function to translate filter option values
export const translateFilterValue = (safeT, value, type) => {
  if (!value || value === 'all') return value;

  // Translation mappings for different filter types
  const translations = {
    jobType: {
      'Full-time': safeT('company.posts.filters.fullTime'),
      'Part-time': safeT('company.posts.filters.partTime'),
      'Contract': safeT('company.posts.filters.contract'),
      'Internship': safeT('company.posts.filters.internship'),
    },
    jobSetting: {
      'Remote': safeT('company.posts.filters.remote'),
      'On-site': safeT('company.posts.filters.onSite'),
      'Hybrid': safeT('company.posts.filters.hybrid'),
    },
    paymentStatus: {
      'Paid': safeT('company.posts.filters.paid'),
      'Unpaid': safeT('company.posts.filters.unpaid'),
    }
  };

  // Return translated value or original if no translation found
  return translations[type]?.[value] || value;
}; 