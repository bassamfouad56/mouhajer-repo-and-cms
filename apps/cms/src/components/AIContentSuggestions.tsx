'use client';

import React, { useState, useEffect } from 'react';

interface ContentSuggestion {
  type: 'headline' | 'paragraph' | 'cta' | 'keyword' | 'improvement';
  text: string;
  reason?: string;
}

interface AIContentSuggestionsProps {
  content: string;
  contentType?: string;
  onApplySuggestion: (suggestion: string) => void;
  position?: 'sidebar' | 'inline';
}

export default function AIContentSuggestions({
  content,
  contentType = 'general',
  onApplySuggestion,
  position = 'sidebar'
}: AIContentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Generate suggestions when content changes
  useEffect(() => {
    if (content.length > 50) {
      const debounceTimer = setTimeout(() => {
        generateSuggestions();
      }, 1500);
      return () => clearTimeout(debounceTimer);
    }
  }, [content]);

  const generateSuggestions = async () => {
    if (!content || content.length < 20) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          contentType,
          action: 'generate'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'headline', label: 'Headlines', icon: '📰' },
    { id: 'paragraph', label: 'Content', icon: '📝' },
    { id: 'cta', label: 'CTAs', icon: '🎯' },
    { id: 'keyword', label: 'Keywords', icon: '🔑' },
    { id: 'improvement', label: 'Improvements', icon: '💡' }
  ];

  const filteredSuggestions = selectedCategory === 'all'
    ? suggestions
    : suggestions.filter(s => s.type === selectedCategory);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'headline': return '📰';
      case 'paragraph': return '📝';
      case 'cta': return '🎯';
      case 'keyword': return '🔑';
      case 'improvement': return '💡';
      default: return '✨';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'headline': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'paragraph': return 'bg-green-50 border-green-200 text-green-900';
      case 'cta': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'keyword': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'improvement': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  if (position === 'inline') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Suggestions
          </h4>
          {isGenerating && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </div>
          )}
        </div>

        {filteredSuggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onApplySuggestion(suggestion.text)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:shadow-md ${getSuggestionColor(suggestion.type)}`}
              >
                <span className="mr-1">{getSuggestionIcon(suggestion.type)}</span>
                {suggestion.text.length > 40 ? suggestion.text.substring(0, 40) + '...' : suggestion.text}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Start typing to see AI-powered suggestions...</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Content Assistant
        </h3>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
              {cat.id !== 'all' && (
                <span className="ml-1 bg-white/60 px-1 rounded">
                  {suggestions.filter(s => s.type === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-600">Analyzing content...</p>
            </div>
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="space-y-2">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getSuggestionColor(suggestion.type)}`}
                onClick={() => onApplySuggestion(suggestion.text)}
              >
                <div className="flex items-start">
                  <span className="text-xl mr-2 flex-shrink-0">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">{suggestion.text}</p>
                    {suggestion.reason && (
                      <p className="text-xs opacity-80">{suggestion.reason}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplySuggestion(suggestion.text);
                    }}
                    className="ml-2 px-2 py-1 bg-white/60 rounded text-xs font-medium hover:bg-white/80 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm">No suggestions yet</p>
            <p className="text-xs mt-1">Start writing to get AI-powered suggestions</p>
          </div>
        )}
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Refresh Suggestions'}
          </button>
        </div>
      )}
    </div>
  );
}