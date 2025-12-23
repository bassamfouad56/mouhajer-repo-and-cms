import type { Locale } from '@/i18n/config';

/**
 * Multilingual field type - can be a string or an object with en/ar keys
 */
export type MultilingualField<T = string> = T | { en?: T; ar?: T } | undefined | null;

/**
 * Extract localized string from a multilingual field
 * Handles both legacy single-language strings and new multilingual objects
 *
 * @param field - The field value (can be string or { en, ar } object)
 * @param locale - The target locale ('en' or 'ar')
 * @returns The localized string value or empty string if not found
 *
 * @example
 * // With multilingual object
 * getLocalizedField({ en: "Hello", ar: "مرحبا" }, "ar") // "مرحبا"
 *
 * // With legacy string (backwards compatible)
 * getLocalizedField("Hello", "ar") // "Hello"
 *
 * // With missing locale, falls back to English
 * getLocalizedField({ en: "Hello" }, "ar") // "Hello"
 */
export function getLocalizedField<T extends string = string>(
  field: MultilingualField<T>,
  locale: Locale
): T | '' {
  if (!field) return '' as T;

  // Legacy support: if it's already a string, return as-is
  if (typeof field === 'string') return field as T;

  // Multilingual object: try requested locale, then fallback to English, then Arabic
  if (typeof field === 'object') {
    return (field[locale] || field.en || field.ar || '') as T;
  }

  return '' as T;
}

/**
 * Extract localized array with localized nested fields
 * Useful for arrays like features[], process[], challenges[], etc.
 *
 * @param array - The array of items
 * @param locale - The target locale
 * @param fieldNames - Array of field names within each item that are multilingual
 * @returns New array with localized field values
 *
 * @example
 * const features = [
 *   { title: { en: "Design", ar: "تصميم" }, description: { en: "...", ar: "..." } }
 * ];
 * getLocalizedArray(features, "ar", ["title", "description"]);
 * // Returns: [{ title: "تصميم", description: "..." }]
 */
export function getLocalizedArray<T extends Record<string, unknown>>(
  array: T[] | undefined | null,
  locale: Locale,
  fieldNames: string[]
): T[] {
  if (!array || !Array.isArray(array)) return [];

  return array.map((item) => {
    const newItem = { ...item } as Record<string, unknown>;

    for (const field of fieldNames) {
      const value = item[field];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const multilingualValue = value as { en?: string; ar?: string };
        newItem[field] = multilingualValue[locale] || multilingualValue.en || '';
      }
    }

    return newItem as T;
  });
}

/**
 * Check if a field is in multilingual format
 *
 * @param field - The field to check
 * @returns true if the field is a multilingual object with en/ar keys
 */
export function isMultilingualField(field: unknown): field is { en?: string; ar?: string } {
  return (
    typeof field === 'object' &&
    field !== null &&
    !Array.isArray(field) &&
    ('en' in field || 'ar' in field)
  );
}

/**
 * Convert a single-language string to multilingual format
 * Useful for data migration or normalization
 *
 * @param value - The string value
 * @returns Multilingual object with value in both languages
 */
export function toMultilingual(value: string): { en: string; ar: string } {
  return { en: value, ar: value };
}
