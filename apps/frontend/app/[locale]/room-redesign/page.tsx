'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const DESIGN_STYLES = [
  { value: 'modern', emoji: '🏢' },
  { value: 'minimalist', emoji: '⚪' },
  { value: 'industrial', emoji: '🏭' },
  { value: 'scandinavian', emoji: '🌲' },
  { value: 'bohemian', emoji: '🎨' },
  { value: 'luxury', emoji: '💎' },
  { value: 'traditional', emoji: '🏛️' },
  { value: 'contemporary', emoji: '✨' },
];

const ROOM_TYPES = [
  { value: 'living_room', emoji: '🛋️' },
  { value: 'bedroom', emoji: '🛏️' },
  { value: 'kitchen', emoji: '🍳' },
  { value: 'bathroom', emoji: '🚿' },
  { value: 'dining_room', emoji: '🍽️' },
  { value: 'office', emoji: '💼' },
  { value: 'entryway', emoji: '🚪' },
  { value: 'outdoor', emoji: '🌿' },
];

export default function RoomRedesignPage() {
  const t = useTranslations('RoomRedesign');
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const isRTL = locale === 'ar';

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [email, setEmail] = useState('');
  const [style, setStyle] = useState('modern');
  const [roomType, setRoomType] = useState('living_room');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError(t('errorFileType'));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(t('errorFileSize'));
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('email', email);
    formData.append('style', style);
    formData.append('roomType', roomType);
    formData.append('prompt', prompt);

    try {
      const response = await fetch('/api/room-redesign/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || t('errorUpload'));
      }
    } catch (err) {
      setError(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF5] px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center max-w-lg bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('successTitle')}</h2>
            <p className="text-gray-600 mb-4">
              {t('successMessage')}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-900">
                📧 {t('successEmailNote')} <strong className="font-semibold">{email}</strong> {t('successEmailText')}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {t('createAnother')} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5] py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 ${isRTL ? 'rtl' : ''}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('title')} ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                1. {t('uploadTitle')}
              </label>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-[#2C2B2B] bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={600}
                      height={400}
                      className="rounded-lg mx-auto"
                      style={{ maxHeight: '400px', width: 'auto' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {t('uploadDragText')}{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#2C2B2B] font-medium hover:text-gray-700 transition-colors"
                      >
                        {t('uploadBrowse')}
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{t('uploadFormats')}</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Room Type */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                2. {t('roomTypeTitle')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ROOM_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setRoomType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      roomType === type.value
                        ? 'border-[#2C2B2B] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{type.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {t(`roomTypes.${type.value}`)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Design Style */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                3. {t('designStyleTitle')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DESIGN_STYLES.map((designStyle) => (
                  <button
                    key={designStyle.value}
                    type="button"
                    onClick={() => setStyle(designStyle.value)}
                    className={`p-4 rounded-lg border-2 text-${isRTL ? 'right' : 'left'} transition-all hover:scale-105 ${
                      style === designStyle.value
                        ? 'border-[#2C2B2B] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{designStyle.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {t(`designStyles.${designStyle.value}.label`)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {t(`designStyles.${designStyle.value}.description`)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Prompt */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                4. {t('additionalPromptTitle')} ({t('additionalPromptTitle').toLowerCase().includes('optional') ? '' : 'Optional'})
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder={t('additionalPromptPlaceholder')}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#2C2B2B] focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                5. {t('emailTitle')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#2C2B2B] focus:border-transparent transition-all"
              />
              <p className="mt-2 text-xs text-gray-500">
                {t('emailNote')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file || !email}
              className="w-full bg-[#2C2B2B] text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('processing')}
                </span>
              ) : (
                `✨ ${t('submitButton')}`
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-[#2C2B2B] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-600">
                <strong className="text-gray-900">{t('howItWorks')}</strong> {t('howItWorksText')}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
