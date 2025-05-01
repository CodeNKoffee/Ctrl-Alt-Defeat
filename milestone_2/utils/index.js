const getCurrentYear = () => {
  return new Date().getFullYear();
};

const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export { getCurrentYear, capitalizeWords };