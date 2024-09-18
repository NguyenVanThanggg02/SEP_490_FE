/**
 *
 * @param {text} text
 * @returns domain from text (that only allows letters, numbers, and underscores)
 */
export const textToDomain = (text) => {
  // REGEX only allows letters, numbers, and underscores
  const regex = /[^a-zA-Z0-9_]/g;
  const cleanText = text.toLowerCase().replaceAll(" ", "_");
  return cleanText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(regex, "");
};
