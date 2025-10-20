/**
 * Custom hook for auto-translation in bilingual forms
 */

import { useState, useCallback } from 'react';
import { translateText, debounce } from '../translate';

export function useAutoTranslate(initialEnabled = true) {
  const [autoTranslate, setAutoTranslate] = useState(initialEnabled);
  const [translating, setTranslating] = useState<Record<string, boolean>>({});

  const handleTranslate = useCallback(
    async (
      fieldName: string,
      value: string,
      sourceLang: 'en' | 'ar',
      onTranslated: (translated: string, targetLang: 'en' | 'ar') => void
    ) => {
      if (!autoTranslate || !value || value.trim() === '') return;

      const targetLang = sourceLang === 'en' ? 'ar' : 'en';
      const translatingKey = `${fieldName}_${targetLang}`;

      setTranslating(prev => ({ ...prev, [translatingKey]: true }));

      try {
        const translated = await translateText(value, targetLang);
        onTranslated(translated, targetLang);
      } catch (error) {
        console.error('Translation failed:', error);
      } finally {
        setTranslating(prev => ({ ...prev, [translatingKey]: false }));
      }
    },
    [autoTranslate]
  );

  const debouncedTranslate = useCallback(
    debounce(
      (
        fieldName: string,
        value: string,
        sourceLang: 'en' | 'ar',
        onTranslated: (translated: string, targetLang: 'en' | 'ar') => void
      ) => {
        handleTranslate(fieldName, value, sourceLang, onTranslated);
      },
      1000
    ),
    [handleTranslate]
  );

  return {
    autoTranslate,
    setAutoTranslate,
    translating,
    translate: debouncedTranslate,
  };
}
