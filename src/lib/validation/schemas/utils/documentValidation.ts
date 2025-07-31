// --- Configuration for document number formats ---
const DOCUMENT_RULES = [
  {
    keywords: ["ταυτότητα", "(νέο)"],
    placeholder: "XX-######",
    pattern: /^[A-Z]{2}-\d{6}$/i,
    format: (value: string) => {
      const cleanValue = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
      let formatted = cleanValue.slice(0, 2);
      if (cleanValue.length > 2) {
        formatted += "-" + cleanValue.slice(2, 8);
      }
      return formatted;
    },
  },
  {
    keywords: ["ταυτότητα", "(παλιό)"],
    placeholder: "Α-######",
    pattern: /^[Α-Ω]-\d{6}$/i,
    format: (value: string) => {
      const cleanValue = value.replace(/[^Α-Ω0-9]/gi, "").toUpperCase();
      let formatted = cleanValue.slice(0, 1);
      if (cleanValue.length > 1) {
        formatted += "-" + cleanValue.slice(1, 7);
      }
      return formatted;
    },
  },
  {
    keywords: ["διαβατήριο"],
    placeholder: "AA#######",
    pattern: /^[A-Z]{2}\d{7}$/i,
    format: (value: string) => {
      return value
        .replace(/[^A-Z0-9]/gi, "")
        .toUpperCase()
        .slice(0, 9);
    },
  },
  {
    keywords: ["άδεια", "οδήγησης"],
    placeholder: "#########",
    pattern: /^\d{9}$/,
    format: (value: string) => {
      return value.replace(/\D/g, "").slice(0, 9);
    },
  },
  // Default fallback rule
  {
    keywords: [],
    placeholder: "Εισάγετε αριθμό...",
    pattern: null, // No validation
    format: (value: string) => value, // No formatting
  },
];

/**
 * Gets the validation rule for a given document type.
 * @param {string | undefined} type - The type of the document.
 * @returns The matching rule or the default rule.
 */
export function getValidationRule(type?: string) {
  if (!type) {
    return DOCUMENT_RULES[DOCUMENT_RULES.length - 1]; // Default rule
  }
  const typeLower = type.toLowerCase();
  return (
    DOCUMENT_RULES.find(
      (rule) =>
        rule.keywords.length > 0 &&
        rule.keywords.every((kw) => typeLower.includes(kw)),
    ) ||
    DOCUMENT_RULES.find(
      (rule) =>
        rule.keywords.length > 0 &&
        rule.keywords.some((kw) => typeLower.includes(kw)),
    ) ||
    DOCUMENT_RULES[DOCUMENT_RULES.length - 1]
  );
}
