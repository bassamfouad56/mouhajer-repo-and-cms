/**
 * AI Content Generator Component
 * Free, powerful AI content generation using Groq
 */

'use client';

import React, { useState } from 'react';

interface AIContentGeneratorProps {
  onGenerate: (content: {
    title: string;
    content: string;
    metaDescription?: string;
    keywords?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  }) => void;
  initialTopic?: string;
  language?: 'en' | 'ar';
}

export default function AIContentGenerator({
  onGenerate,
  initialTopic = '',
  language = 'en'
}: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'setup' | 'generating' | 'result'>('setup');

  // Form state
  const [topic, setTopic] = useState(initialTopic);
  const [contentType, setContentType] = useState<'blog' | 'service' | 'about' | 'product' | 'landing' | 'faq'>('blog');
  const [tone, setTone] = useState<'professional' | 'casual' | 'creative' | 'persuasive'>('professional');
  const [wordCount, setWordCount] = useState(800);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [includeOutline, setIncludeOutline] = useState(true);
  const [includeFAQ, setIncludeFAQ] = useState(true);
  const [includeMetaDescription, setIncludeMetaDescription] = useState(true);

  // Generated content
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const contentTypeDescriptions = {
    blog: 'Informative blog post with engaging content',
    service: 'Service page highlighting benefits and features',
    about: 'Company story and values',
    product: 'Product features and specifications',
    landing: 'High-converting landing page',
    faq: 'Comprehensive FAQ section',
  };

  const toneDescriptions = {
    professional: 'Formal and authoritative',
    casual: 'Friendly and conversational',
    creative: 'Engaging with storytelling',
    persuasive: 'Action-oriented and compelling',
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setStep('generating');
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          topic,
          contentType,
          tone,
          wordCount,
          keywords,
          language,
          includeOutline,
          includeFAQ,
          includeMetaDescription,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setGeneratedContent(data);
      setGenerationProgress(100);
      setStep('result');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content. Please try again.');
      setStep('setup');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleAcceptContent = () => {
    if (generatedContent) {
      onGenerate(generatedContent);
      setIsOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setStep('setup');
    setTopic(initialTopic);
    setKeywords([]);
    setGeneratedContent(null);
    setGenerationProgress(0);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI Content Generator
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => !isGenerating && setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl sm:my-8 sm:align-middle">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    AI Content Generator
                  </h3>
                  <button
                    onClick={() => !isGenerating && setIsOpen(false)}
                    disabled={isGenerating}
                    className="text-white hover:text-gray-200 disabled:opacity-50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {step === 'setup' && (
                  <div className="space-y-6">
                    {/* Topic Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's your topic? *
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Modern Kitchen Design Tips for Small Spaces"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>

                    {/* Content Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(contentTypeDescriptions).map(([type, desc]) => (
                          <button
                            key={type}
                            onClick={() => setContentType(type as any)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              contentType === type
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium capitalize">{type}</div>
                            <div className="text-xs text-gray-500 mt-1">{desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Writing Tone
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(toneDescriptions).map(([t, desc]) => (
                          <button
                            key={t}
                            onClick={() => setTone(t as any)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              tone === t
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium capitalize">{t}</div>
                            <div className="text-xs text-gray-500">{desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Keywords (SEO)
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                          placeholder="Add a keyword..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={handleAddKeyword}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                          >
                            {keyword}
                            <button
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Word Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Word Count: {wordCount}
                      </label>
                      <input
                        type="range"
                        min="300"
                        max="2000"
                        step="100"
                        value={wordCount}
                        onChange={(e) => setWordCount(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>300 words</span>
                        <span>2000 words</span>
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Include in Generation
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includeOutline}
                            onChange={(e) => setIncludeOutline(e.target.checked)}
                            className="mr-2 rounded text-purple-600"
                          />
                          <span>Content Outline</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includeFAQ}
                            onChange={(e) => setIncludeFAQ(e.target.checked)}
                            className="mr-2 rounded text-purple-600"
                          />
                          <span>FAQ Section (5 Q&A)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includeMetaDescription}
                            onChange={(e) => setIncludeMetaDescription(e.target.checked)}
                            className="mr-2 rounded text-purple-600"
                          />
                          <span>SEO Meta Description</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {step === 'generating' && (
                  <div className="py-12 text-center">
                    <div className="mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full animate-pulse">
                        <svg className="w-10 h-10 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Generating Your Content...</h4>
                    <p className="text-gray-600 mb-6">AI is crafting high-quality, SEO-optimized content</p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md mx-auto">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{generationProgress}% Complete</p>
                    </div>

                    <div className="mt-8 space-y-2 text-sm text-gray-500">
                      <p>✓ Researching topic...</p>
                      {generationProgress > 30 && <p>✓ Creating outline...</p>}
                      {generationProgress > 60 && <p>✓ Writing content...</p>}
                      {generationProgress > 80 && <p>✓ Optimizing for SEO...</p>}
                    </div>
                  </div>
                )}

                {step === 'result' && generatedContent && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Generated Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Generated Title
                      </label>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold">{generatedContent.title}</h3>
                      </div>
                    </div>

                    {/* Meta Description */}
                    {generatedContent.metaDescription && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm">{generatedContent.metaDescription}</p>
                        </div>
                      </div>
                    )}

                    {/* Main Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content ({generatedContent.content.split(' ').length} words)
                      </label>
                      <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                          {generatedContent.content}
                        </div>
                      </div>
                    </div>

                    {/* FAQs */}
                    {generatedContent.faqs && generatedContent.faqs.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          FAQs
                        </label>
                        <div className="space-y-3">
                          {generatedContent.faqs.map((faq: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <p className="font-medium mb-1">Q: {faq.question}</p>
                              <p className="text-sm text-gray-600">A: {faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SEO Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Readability Score</p>
                        <p className="text-2xl font-bold text-green-700">
                          {generatedContent.readabilityScore || 75}%
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">SEO Score</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {generatedContent.seoScore || 82}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-between">
                  {step === 'setup' && (
                    <>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={!topic.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Generate Content
                      </button>
                    </>
                  )}

                  {step === 'result' && (
                    <>
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        Generate New
                      </button>
                      <div className="space-x-3">
                        <button
                          onClick={() => navigator.clipboard.writeText(generatedContent.content)}
                          className="px-4 py-2 text-purple-600 hover:text-purple-700"
                        >
                          Copy to Clipboard
                        </button>
                        <button
                          onClick={handleAcceptContent}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
                        >
                          Use This Content
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}