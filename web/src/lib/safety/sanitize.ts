const MAX_LENGTH = 500;

/**
 * Substrings that could be used to close or spoof the delimiters used to
 * wrap trusted directory data / the user query. Removed entirely.
 */
const DELIMITER_SUBSTRINGS = [
  "</directory_data>",
  "</user_query>",
  "<directory_data>",
  "<user_query>",
];

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/**
 * Sanitize raw user input before it is used in search or sent to a provider.
 * Returns an empty string for invalid/empty input.
 */
export function sanitizeInput(raw: unknown): string {
  if (typeof raw !== "string") return "";

  let value = raw;

  // Strip control characters (keeps printable text only).
  value = value.replace(CONTROL_CHARS, " ");

  // Remove delimiter-closing/spoofing substrings outright.
  for (const sub of DELIMITER_SUBSTRINGS) {
    value = value.split(sub).join("");
  }

  // Normalize whitespace.
  value = value.replace(/\s+/g, " ").trim();

  // Cap length.
  if (value.length > MAX_LENGTH) {
    value = value.slice(0, MAX_LENGTH).trim();
  }

  return value;
}
