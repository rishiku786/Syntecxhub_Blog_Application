export const calculateReadingTime = (content) => {
  if (!content) return 1;
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return minutes < 1 ? 1 : minutes;
};
