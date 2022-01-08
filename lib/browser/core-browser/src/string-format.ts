/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export function toTitleCase (text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
export function stripTags (text: string): string {
  return text.replace(/<[^>]+>/g, '')
}
