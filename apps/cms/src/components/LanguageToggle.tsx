'use client';

import React from 'react';

interface LanguageToggleProps {
  currentLanguage: 'EN' | 'AR';
  onChange: (language: 'EN' | 'AR') => void;
  variant?: 'default' | 'compact' | 'pill';
  showLabels?: boolean;
}

export default function LanguageToggle({
  currentLanguage,
  onChange,
  variant = 'default',
  showLabels = true
}: LanguageToggleProps) {
  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
        <button
          onClick={() => onChange('EN')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentLanguage === 'EN'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          English
        </button>
        <button
          onClick={() => onChange('AR')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentLanguage === 'AR'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          العربية
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={() => onChange(currentLanguage === 'EN' ? 'AR' : 'EN')}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        title="Toggle Language"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="font-medium text-sm">{currentLanguage}</span>
      </button>
    );
  }

  // Default variant with toggle switch
  return (
    <div className="flex items-center gap-3">
      {showLabels && (
        <span className={`text-sm font-medium transition-colors ${
          currentLanguage === 'EN' ? 'text-blue-600' : 'text-gray-500'
        }`}>
          EN
        </span>
      )}

      <button
        onClick={() => onChange(currentLanguage === 'EN' ? 'AR' : 'EN')}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        role="switch"
        aria-checked={currentLanguage === 'AR'}
      >
        <span className="sr-only">Toggle language</span>
        <span
          className={`${
            currentLanguage === 'AR' ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform`}
        />
      </button>

      {showLabels && (
        <span className={`text-sm font-medium transition-colors ${
          currentLanguage === 'AR' ? 'text-blue-600' : 'text-gray-500'
        }`}>
          AR
        </span>
      )}
    </div>
  );
}

// Styled Language Selector with Flags
export function LanguageSelector({
  currentLanguage,
  onChange
}: {
  currentLanguage: 'EN' | 'AR';
  onChange: (language: 'EN' | 'AR') => void;
}) {
  return (
    <div className="relative inline-block">
      <select
        value={currentLanguage}
        onChange={(e) => onChange(e.target.value as 'EN' | 'AR')}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        <option value="EN">🇬🇧 English</option>
        <option value="AR">🇸🇦 العربية</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 20 20">
          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// Animated Toggle with Icons
export function AnimatedLanguageToggle({
  currentLanguage,
  onChange
}: {
  currentLanguage: 'EN' | 'AR';
  onChange: (language: 'EN' | 'AR') => void;
}) {
  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-1">
      <div className="relative flex items-center bg-white rounded-lg shadow-sm">
        <div
          className={`absolute inset-y-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-all duration-300 ease-out ${
            currentLanguage === 'EN' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
          }`}
        />

        <button
          onClick={() => onChange('EN')}
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
            currentLanguage === 'EN' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>

        <button
          onClick={() => onChange('AR')}
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
            currentLanguage === 'AR' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <span>🇸🇦</span>
          <span>العربية</span>
        </button>
      </div>
    </div>
  );
}