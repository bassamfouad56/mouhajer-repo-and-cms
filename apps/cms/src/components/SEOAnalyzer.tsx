'use client';

import React, { useState, useEffect } from 'react';

interface SEOAnalyzerProps {
  titleEn?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  content?: string;
  slug?: string;
  keywords?: string[];
}

interface SEOScore {
  overall: number;
  title: number;
  description: number;
  content: number;
  keywords: number;
  technical: number;
}

interface SEOSuggestion {
  type: 'error' | 'warning' | 'success' | 'info';
  category: string;
  message: string;
}

export default function SEOAnalyzer({
  titleEn = '',
  titleAr = '',
  descriptionEn = '',
  descriptionAr = '',
  content = '',
  slug = '',
  keywords = []
}: SEOAnalyzerProps) {
  const [score, setScore] = useState<SEOScore>({
    overall: 0,
    title: 0,
    description: 0,
    content: 0,
    keywords: 0,
    technical: 0
  });
  const [suggestions, setSuggestions] = useState<SEOSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze SEO whenever content changes
  useEffect(() => {
    const analyzeTimer = setTimeout(async () => {
      await analyzeSEO();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(analyzeTimer);
  }, [titleEn, titleAr, descriptionEn, descriptionAr, content, slug, keywords]);

  const analyzeSEO = async () => {
    if (!titleEn && !descriptionEn && !content) {
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleEn,
          description: descriptionEn,
          content,
          url: slug,
          keywords
        })
      });

      if (response.ok) {
        const analysis = await response.json();

        // Calculate scores
        const newScore: SEOScore = {
          title: calculateTitleScore(analysis),
          description: calculateDescriptionScore(analysis),
          content: calculateContentScore(analysis),
          keywords: calculateKeywordScore(analysis),
          technical: calculateTechnicalScore(analysis),
          overall: 0
        };

        // Calculate overall score as weighted average
        newScore.overall = Math.round(
          (newScore.title * 0.25 +
           newScore.description * 0.2 +
           newScore.content * 0.3 +
           newScore.keywords * 0.15 +
           newScore.technical * 0.1)
        );

        setScore(newScore);
        setSuggestions(generateSuggestions(analysis));
      }
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTitleScore = (analysis: any): number => {
    let score = 100;

    if (!analysis.title.present) score -= 50;
    if (analysis.title.length < 30) score -= 20;
    if (analysis.title.length > 60) score -= 20;
    if (!analysis.title.hasKeyword) score -= 10;
    if (analysis.title.startsWithKeyword) score += 10;

    return Math.max(0, Math.min(100, score));
  };

  const calculateDescriptionScore = (analysis: any): number => {
    let score = 100;

    if (!analysis.description.present) score -= 50;
    if (analysis.description.length < 120) score -= 20;
    if (analysis.description.length > 160) score -= 20;
    if (!analysis.description.hasKeyword) score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const calculateContentScore = (analysis: any): number => {
    let score = 100;

    if (analysis.content.wordCount < 300) score -= 30;
    if (analysis.content.keywordDensity < 0.005) score -= 20;
    if (analysis.content.keywordDensity > 0.03) score -= 15;
    if (analysis.content.readabilityScore < 30) score -= 20;
    if (analysis.content.readabilityScore > 70) score -= 10;
    if (!analysis.content.hasHeadings) score -= 15;

    return Math.max(0, Math.min(100, score));
  };

  const calculateKeywordScore = (analysis: any): number => {
    let score = 100;

    if (!analysis.keywords.present) score -= 30;
    if (analysis.keywords.count < 3) score -= 20;
    if (analysis.keywords.count > 10) score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const calculateTechnicalScore = (analysis: any): number => {
    let score = 100;

    if (!analysis.url.present) score -= 20;
    if (analysis.url.length > 75) score -= 10;
    if (analysis.url.hasSpaces) score -= 20;
    if (!analysis.url.isLowercase) score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const generateSuggestions = (analysis: any): SEOSuggestion[] => {
    const suggestions: SEOSuggestion[] = [];

    // Title suggestions
    if (!analysis.title.present) {
      suggestions.push({
        type: 'error',
        category: 'Title',
        message: 'Add a page title for better SEO'
      });
    } else if (analysis.title.length < 30) {
      suggestions.push({
        type: 'warning',
        category: 'Title',
        message: `Title is too short (${analysis.title.length} chars). Aim for 30-60 characters`
      });
    } else if (analysis.title.length > 60) {
      suggestions.push({
        type: 'warning',
        category: 'Title',
        message: `Title is too long (${analysis.title.length} chars). Keep it under 60 characters`
      });
    } else {
      suggestions.push({
        type: 'success',
        category: 'Title',
        message: 'Title length is optimal'
      });
    }

    // Description suggestions
    if (!analysis.description.present) {
      suggestions.push({
        type: 'error',
        category: 'Description',
        message: 'Add a meta description to improve click-through rates'
      });
    } else if (analysis.description.length < 120) {
      suggestions.push({
        type: 'warning',
        category: 'Description',
        message: `Description is too short (${analysis.description.length} chars). Aim for 120-160 characters`
      });
    } else if (analysis.description.length > 160) {
      suggestions.push({
        type: 'warning',
        category: 'Description',
        message: `Description is too long (${analysis.description.length} chars). Keep it under 160 characters`
      });
    } else {
      suggestions.push({
        type: 'success',
        category: 'Description',
        message: 'Description length is optimal'
      });
    }

    // Content suggestions
    if (analysis.content.wordCount < 300) {
      suggestions.push({
        type: 'warning',
        category: 'Content',
        message: `Content is thin (${analysis.content.wordCount} words). Aim for at least 300 words`
      });
    }

    if (analysis.content.keywordDensity < 0.005) {
      suggestions.push({
        type: 'info',
        category: 'Keywords',
        message: 'Consider using your target keywords more frequently in the content'
      });
    } else if (analysis.content.keywordDensity > 0.03) {
      suggestions.push({
        type: 'warning',
        category: 'Keywords',
        message: 'Keyword density is too high. Avoid keyword stuffing'
      });
    }

    // Technical suggestions
    if (analysis.url.hasSpaces) {
      suggestions.push({
        type: 'error',
        category: 'URL',
        message: 'Remove spaces from the URL slug'
      });
    }

    if (!analysis.url.isLowercase) {
      suggestions.push({
        type: 'warning',
        category: 'URL',
        message: 'Use lowercase letters in URLs for consistency'
      });
    }

    return suggestions;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Real-time SEO Analysis
          {isAnalyzing && (
            <span className="ml-2 text-sm text-gray-500">Analyzing...</span>
          )}
        </h3>

        {/* Score Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score.overall / 100) * 351.86} 351.86`}
                className={getProgressColor(score.overall)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
                  {score.overall}
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Title', value: score.title, icon: '📝' },
            { label: 'Description', value: score.description, icon: '📄' },
            { label: 'Content', value: score.content, icon: '📖' },
            { label: 'Keywords', value: score.keywords, icon: '🔑' },
            { label: 'Technical', value: score.technical, icon: '⚙️' }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className={`text-xl font-semibold ${getScoreColor(item.value)}`}>
                {item.value}
              </div>
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(item.value)} transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          SEO Suggestions
        </h3>

        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Start typing to see SEO suggestions
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-start p-3 rounded-lg border ${
                  suggestion.type === 'error'
                    ? 'bg-red-50 border-red-200'
                    : suggestion.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : suggestion.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {suggestion.type === 'error' && (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {suggestion.type === 'warning' && (
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {suggestion.type === 'success' && (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {suggestion.type === 'info' && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{suggestion.category}</div>
                  <div className="text-sm text-gray-600">{suggestion.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}