'use client';

import { useState } from 'react';
import FormInput from './FormInput';
import TranslateButton from './TranslateButton';

interface BilingualInputProps {
  labelEn: string;
  labelAr: string;
  nameEn: string;
  nameAr: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChangeAr: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea' | 'email' | 'url';
  required?: boolean;
  errorEn?: string;
  errorAr?: string;
  helperText?: string;
  contentType?: 'title' | 'description' | 'content' | 'alt' | 'general';
  rows?: number;
  disabled?: boolean;
  placeholder En?: string;
  placeholderAr?: string;
  autoTranslate?: boolean; // Enable auto-translate feature (default: true)
}

export default function BilingualInput({
  labelEn,
  labelAr,
  nameEn,
  nameAr,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  type = 'text',
  required = false,
  errorEn,
  errorAr,
  helperText,
  contentType = 'general',
  rows,
  disabled = false,
  placeholderEn,
  placeholderAr,
  autoTranslate = true,
}: BilingualInputProps) {
  const [showTranslateButtons, setShowTranslateButtons] = useState(true);

  const handleTranslateToArabic = (translatedText: string) => {
    // Simulate change event to update parent state
    const fakeEvent = {
      target: { name: nameAr, value: translatedText },
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    onChangeAr(fakeEvent);
  };

  const handleTranslateToEnglish = (translatedText: string) => {
    // Simulate change event to update parent state
    const fakeEvent = {
      target: { name: nameEn, value: translatedText },
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    onChangeEn(fakeEvent);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* English Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {labelEn}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {autoTranslate && valueEn && (
              <TranslateButton
                sourceText={valueEn}
                sourceLanguage="en"
                targetLanguage="ar"
                contentType={contentType}
                onTranslationComplete={handleTranslateToArabic}
                disabled={disabled}
              />
            )}
          </div>
          {type === 'textarea' ? (
            <textarea
              name={nameEn}
              value={valueEn}
              onChange={onChangeEn}
              rows={rows || 4}
              required={required}
              disabled={disabled}
              placeholder={placeholderEn}
              className="mt-1 block w-full rounded-md px-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ) : (
            <input
              type={type}
              name={nameEn}
              value={valueEn}
              onChange={onChangeEn}
              required={required}
              disabled={disabled}
              placeholder={placeholderEn}
              className="mt-1 block w-full rounded-md px-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          )}
          {errorEn && (
            <p className="mt-1 text-sm text-red-600">{errorEn}</p>
          )}
        </div>

        {/* Arabic Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {labelAr}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {autoTranslate && valueAr && (
              <TranslateButton
                sourceText={valueAr}
                sourceLanguage="ar"
                targetLanguage="en"
                contentType={contentType}
                onTranslationComplete={handleTranslateToEnglish}
                disabled={disabled}
              />
            )}
          </div>
          {type === 'textarea' ? (
            <textarea
              name={nameAr}
              value={valueAr}
              onChange={onChangeAr}
              rows={rows || 4}
              required={required}
              disabled={disabled}
              placeholder={placeholderAr}
              dir="rtl"
              className="mt-1 block w-full rounded-md px-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ) : (
            <input
              type={type}
              name={nameAr}
              value={valueAr}
              onChange={onChangeAr}
              required={required}
              disabled={disabled}
              placeholder={placeholderAr}
              dir="rtl"
              className="mt-1 block w-full rounded-md px-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          )}
          {errorAr && (
            <p className="mt-1 text-sm text-red-600">{errorAr}</p>
          )}
        </div>
      </div>
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
