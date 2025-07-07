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

// Helper function to translate month names
export const translateMonth = (safeT, month, short = false) => {
  const monthNames = {
    'January': 'january', 'February': 'february', 'March': 'march', 'April': 'april',
    'May': 'may', 'June': 'june', 'July': 'july', 'August': 'august',
    'September': 'september', 'October': 'october', 'November': 'november', 'December': 'december',
    'Jan': 'jan', 'Feb': 'feb', 'Mar': 'mar', 'Apr': 'apr',
    'Jun': 'jun', 'Jul': 'jul', 'Aug': 'aug', 'Sep': 'sep',
    'Oct': 'oct', 'Nov': 'nov', 'Dec': 'dec'
  };

  const monthKey = monthNames[month];
  if (!monthKey) return month;

  const prefix = short ? 'company.months.short.' : 'company.months.full.';
  return safeT(prefix + monthKey);
};

// Helper function to format translated dates
export const formatTranslatedDate = (safeT, dateString, options = {}) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear();
  const day = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });

  const translatedMonth = translateMonth(safeT, monthName, options.short);

  if (options.short) {
    return `${translatedMonth} ${day}, ${year}`;
  }

  return `${translatedMonth} ${day}, ${year}`;
}; 