'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';

function ViewContent() {
  const t = useTranslations('RoomRedesignView');
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const isRTL = locale === 'ar';
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [redesign, setRedesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('errorInvalid'));
      setLoading(false);
      return;
    }

    fetchRedesign();
  }, [token]);

  const fetchRedesign = async () => {
    try {
      const response = await fetch(`/api/room-redesign/verify?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setRedesign(data.redesign);
      } else {
        if (data.expired) {
          setError(t('errorExpired'));
        } else if (data.processing) {
          setError(t('errorProcessing'));
        } else if (data.failed) {
          setError(t('errorFailed'));
        } else {
          setError(data.error || t('errorGeneric'));
        }
      }
    } catch (err) {
      setError(t('errorLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type: 'original' | 'generated' | 'both') => {
    if (!redesign) return;

    const downloadImage = async (url: string, filename: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    };

    try {
      if (type === 'original' || type === 'both') {
        await downloadImage(redesign.originalImageUrl, `original_${redesign.id}.jpg`);
      }
      if (type === 'generated' || type === 'both') {
        await downloadImage(redesign.generatedImageUrl, `redesigned_${redesign.id}.jpg`);
      }
    } catch (error) {
      alert(t('downloadFailed'));
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('title'),
          text: t('subtitle'),
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert(t('shareLinkCopied'));
    }
  };

  const submitFeedback = async () => {
    if (!token || rating === 0) return;

    try {
      const response = await fetch(`/api/room-redesign/verify?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setShowFeedback(false);
      }
    } catch (error) {
      alert(t('feedbackSubmitFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF5]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2C2B2B] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !redesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF5] px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('errorTitle')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href={`/${locale}/room-redesign`}
            className="inline-block bg-[#2C2B2B] text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            {t('createNew')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5] py-8 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')} ✨
          </h1>
          <p className="text-gray-600 text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Comparison Slider */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div style={{ height: '600px', maxHeight: '80vh' }}>
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={redesign.originalImageUrl}
                  alt={t('beforeSubtitle')}
                  style={{ objectFit: 'contain' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={redesign.generatedImageUrl}
                  alt={t('afterSubtitle')}
                  style={{ objectFit: 'contain' }}
                />
              }
              style={{ height: '100%' }}
              position={50}
            />
          </div>

          {/* Labels */}
          <div className="grid grid-cols-2 border-t border-gray-200">
            <div className="p-4 text-center border-r border-gray-200">
              <p className="text-sm font-semibold text-gray-700">{t('beforeLabel')}</p>
              <p className="text-xs text-gray-500">{t('beforeSubtitle')}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-semibold text-[#2C2B2B]">{t('afterLabel')}</p>
              <p className="text-xs text-gray-500">{redesign.style} {t('afterSubtitle')}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-[#2C2B2B] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900">{t('viewsLabel')}</h3>
            </div>
            <p className="text-2xl font-bold text-[#2C2B2B]">{redesign.viewCount}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900">{t('processingTimeLabel')}</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{redesign.processingTime}s</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="font-semibold text-gray-900">{t('aiModelLabel')}</h3>
            </div>
            <p className="text-lg font-bold text-green-600 uppercase">{redesign.aiModel}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => handleDownload('both')}
            className="bg-[#2C2B2B] text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 flex items-center shadow-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('downloadBoth')}
          </button>

          <button
            onClick={handleShare}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center shadow-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t('share')}
          </button>

          {!feedbackSubmitted && (
            <button
              onClick={() => setShowFeedback(!showFeedback)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center shadow-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {t('rate')}
            </button>
          )}
        </div>

        {/* Feedback Form */}
        {showFeedback && !feedbackSubmitted && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('feedbackTitle')}</h3>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">{t('feedbackRateLabel')}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl transition-all hover:scale-110"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('feedbackTextLabel')}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder={t('feedbackTextPlaceholder')}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={submitFeedback}
              disabled={rating === 0}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('feedbackSubmit')}
            </button>
          </div>
        )}

        {feedbackSubmitted && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded">
            <p className="text-green-800 font-medium">{t('feedbackThanks')}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <a
            href={`/${locale}/room-redesign`}
            className="inline-block bg-[#2C2B2B] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all"
          >
            {t('createAnother')} →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF5]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2C2B2B]"></div>
      </div>
    }>
      <ViewContent />
    </Suspense>
  );
}
