'use client';

import { useState } from 'react';

interface TranslateButtonProps {
  sourceText: string;
  sourceLanguage: 'en' | 'ar';
  targetLanguage: 'en' | 'ar';
  contentType?: 'title' | 'description' | 'content' | 'alt' | 'general';
  onTranslationComplete: (translatedText: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function TranslateButton({
  sourceText,
  sourceLanguage,
  targetLanguage,
  contentType = 'general',
  onTranslationComplete,
  disabled = false,
  className = '',
}: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceText || sourceText.trim().length === 0) {
      setError('No text to translate');
      return;
    }

    try {
      setIsTranslating(true);
      setError('');

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage,
          targetLanguage,
          contentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      if (data.success && data.translatedText) {
        onTranslationComplete(data.translatedText);
      } else {
        throw new Error('No translation returned');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <button
        type="button"
        onClick={handleTranslate}
        disabled={disabled || isTranslating || !sourceText}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={`Translate to ${targetLanguage === 'ar' ? 'Arabic' : 'English'}`}
      >
        {isTranslating ? (
          <>
            <svg
              className="animate-spin -ml-0.5 mr-2 h-3 w-3 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Translating...
          </>
        ) : (
          <>
            <svg
              className="-ml-0.5 mr-2 h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            {targetLanguage === 'ar' ? 'AR' : 'EN'}
          </>
        )}
      </button>
      {error && (
        <span className="text-xs text-red-600 mt-1">{error}</span>
      )}
    </div>
  );
}
