'use client';

import { useState, useEffect } from 'react';
import MediaPicker from './MediaPicker';

interface ProjectHandoffFormProps {
  projectId: string;
  projectTitle: { en: string; ar: string };
  existingHandoff?: any;
  onSave: (data: any) => void;
  onSubmit: (data: any) => void;
}

const STEPS = [
  { id: 1, title: 'Project Overview', icon: '🚀', subtitle: 'What you built' },
  { id: 2, title: 'Case Study', icon: '📊', subtitle: 'Problem & results' },
  { id: 3, title: 'Visual Assets', icon: '📸', subtitle: 'Screenshots & media' },
  { id: 4, title: 'Social Proof', icon: '⭐', subtitle: 'Testimonials & awards' },
  { id: 5, title: 'Marketing', icon: '🎯', subtitle: 'SEO & targeting' },
];

export default function ProjectHandoffForm({
  projectId,
  projectTitle,
  existingHandoff,
  onSave,
  onSubmit,
}: ProjectHandoffFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('');

  const [formData, setFormData] = useState({
    // Step 1: Project Overview
    completionDate: existingHandoff?.completionDate || '',
    duration: existingHandoff?.duration || '',
    techStack: existingHandoff?.techStack || [],
    liveUrl: existingHandoff?.liveUrl || '',
    repositoryUrl: existingHandoff?.repositoryUrl || '',
    projectHighlightsEn: existingHandoff?.projectHighlightsEn || [],
    projectHighlightsAr: existingHandoff?.projectHighlightsAr || [],

    // Step 2: Problem-Solution-Results
    problemStatementEn: existingHandoff?.problemStatementEn || '',
    problemStatementAr: existingHandoff?.problemStatementAr || '',
    solutionApproachEn: existingHandoff?.solutionApproachEn || '',
    solutionApproachAr: existingHandoff?.solutionApproachAr || '',
    measurableResults: existingHandoff?.measurableResults || [],
    performanceMetrics: existingHandoff?.performanceMetrics || null,
    uniqueFeaturesEn: existingHandoff?.uniqueFeaturesEn || '',
    uniqueFeaturesAr: existingHandoff?.uniqueFeaturesAr || '',

    // Step 3: Visual Assets
    screenshots: existingHandoff?.screenshots || [],
    beforePhotos: existingHandoff?.beforePhotos || [],
    afterPhotos: existingHandoff?.afterPhotos || [],
    videoLinks: existingHandoff?.videoLinks || [],
    figmaLinks: existingHandoff?.figmaLinks || [],

    // Step 4: Client & Social Proof
    clientName: existingHandoff?.clientName || '',
    clientCompany: existingHandoff?.clientCompany || '',
    clientTestimonialEn: existingHandoff?.clientTestimonialEn || '',
    clientTestimonialAr: existingHandoff?.clientTestimonialAr || '',
    clientRating: existingHandoff?.clientRating || 5,
    useClientName: existingHandoff?.useClientName || false,
    useClientPhotos: existingHandoff?.useClientPhotos !== false,
    allowReference: existingHandoff?.allowReference || false,
    pressMentions: existingHandoff?.pressMentions || [],
    awards: existingHandoff?.awards || [],
    teamCredits: existingHandoff?.teamCredits || [],

    // Step 5: Marketing Strategy
    targetKeywords: existingHandoff?.targetKeywords || [],
    seoMetaDescEn: existingHandoff?.seoMetaDescEn || '',
    seoMetaDescAr: existingHandoff?.seoMetaDescAr || '',
    targetAudience: existingHandoff?.targetAudience || [],
    recommendedPlatforms: existingHandoff?.recommendedPlatforms || [],
    geographicFocus: existingHandoff?.geographicFocus || [],
    keySellingPoints: existingHandoff?.keySellingPoints || [],

    notes: existingHandoff?.notes || '',
  });

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  const handleSaveDraft = () => {
    onSave({ ...formData, status: 'draft' });
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      handleSaveDraft();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitHandoff = () => {
    onSubmit({ ...formData, status: 'submitted' });
  };

  const openMediaPicker = (target: string) => {
    setMediaPickerTarget(target);
    setShowMediaPicker(true);
  };

  const handleMediaSelect = (files: any) => {
    const urls = Array.isArray(files) ? files.map(f => f.url) : [files.url];

    setFormData(prev => ({
      ...prev,
      [mediaPickerTarget]: [...(prev[mediaPickerTarget as keyof typeof prev] as string[]), ...urls],
    }));
    setShowMediaPicker(false);
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const addArrayItem = (field: keyof typeof formData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
    }
  };

  // STEP 1: Project Overview & Technical Details
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 What marketing needs:</strong> Technical details that show expertise, live demos to share, and key features they can promote.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Project Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Completion Date</label>
          <input
            type="date"
            value={formData.completionDate}
            onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 3 months"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Live Demo URL</label>
          <input
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            placeholder="https://example.com"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">Marketing will share this link</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code Repository (Optional)</label>
          <input
            type="url"
            value={formData.repositoryUrl}
            onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
            placeholder="https://github.com/..."
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">For open-source or portfolio</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Stack</label>
        <input
          type="text"
          placeholder="e.g., React, Next.js, PostgreSQL (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('techStack', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.techStack.map((tech, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {tech}
              <button
                type="button"
                onClick={() => removeArrayItem('techStack', index)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Features (English) - Marketing will use these in promotional materials
        </label>
        <input
          type="text"
          placeholder="e.g., Real-time collaboration, AI-powered search (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('projectHighlightsEn', input.value);
              input.value = '';
            }
          }}
        />
        <div className="space-y-1">
          {formData.projectHighlightsEn.map((highlight, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
              <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
              <button
                type="button"
                onClick={() => removeArrayItem('projectHighlightsEn', index)}
                className="text-red-600 dark:text-red-400 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Features (Arabic)
        </label>
        <input
          type="text"
          placeholder="مثال: التعاون في الوقت الفعلي (اضغط Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('projectHighlightsAr', input.value);
              input.value = '';
            }
          }}
        />
        <div className="space-y-1">
          {formData.projectHighlightsAr.map((highlight, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
              <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
              <button
                type="button"
                onClick={() => removeArrayItem('projectHighlightsAr', index)}
                className="text-red-600 dark:text-red-400 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // STEP 2: Problem-Solution-Results (Case Study)
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 What marketing needs:</strong> A compelling story with measurable results they can use in case studies and portfolio pieces.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Case Study Narrative</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problem Statement (English)</label>
          <textarea
            rows={4}
            value={formData.problemStatementEn}
            onChange={(e) => setFormData({ ...formData, problemStatementEn: e.target.value })}
            placeholder="What challenge or problem was this project solving?"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">Example: "Client needed to reduce customer support load by 50%"</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problem Statement (Arabic)</label>
          <textarea
            rows={4}
            value={formData.problemStatementAr}
            onChange={(e) => setFormData({ ...formData, problemStatementAr: e.target.value })}
            placeholder="ما التحدي أو المشكلة التي كان هذا المشروع يحلها؟"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solution Approach (English)</label>
          <textarea
            rows={4}
            value={formData.solutionApproachEn}
            onChange={(e) => setFormData({ ...formData, solutionApproachEn: e.target.value })}
            placeholder="How did you solve the problem? What approach did you take?"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">Example: "Built an AI chatbot that handles 80% of common questions"</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solution Approach (Arabic)</label>
          <textarea
            rows={4}
            value={formData.solutionApproachAr}
            onChange={(e) => setFormData({ ...formData, solutionApproachAr: e.target.value })}
            placeholder="كيف قمت بحل المشكلة؟ ما هو النهج الذي اتبعته؟"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Measurable Results - Marketing loves numbers!
        </label>
        <input
          type="text"
          placeholder='e.g., "50% faster load time", "30% increase in conversions" (press Enter)'
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('measurableResults', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.measurableResults.map((result, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              📈 {result}
              <button
                type="button"
                onClick={() => removeArrayItem('measurableResults', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unique Features (English)</label>
          <textarea
            rows={3}
            value={formData.uniqueFeaturesEn}
            onChange={(e) => setFormData({ ...formData, uniqueFeaturesEn: e.target.value })}
            placeholder="What makes this project special or innovative?"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unique Features (Arabic)</label>
          <textarea
            rows={3}
            value={formData.uniqueFeaturesAr}
            onChange={(e) => setFormData({ ...formData, uniqueFeaturesAr: e.target.value })}
            placeholder="ما الذي يجعل هذا المشروع مميزًا أو مبتكرًا؟"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );

  // STEP 3: Visual Assets
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 What marketing needs:</strong> High-quality screenshots (PNG format), before/after comparisons, and video demos to showcase your work.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Visual Assets</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Screenshots - High quality PNG preferred
        </label>
        <button
          type="button"
          onClick={() => openMediaPicker('screenshots')}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400"
        >
          📸 Select Screenshots
        </button>
        <p className="mt-1 text-xs text-gray-500">Marketing will use these in social media, portfolio, and case studies</p>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {formData.screenshots.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt="Screenshot" className="w-full h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeArrayItem('screenshots', index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before Photos (Optional)</label>
          <button
            type="button"
            onClick={() => openMediaPicker('beforePhotos')}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            📷 Select Before Photos
          </button>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {formData.beforePhotos.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt="Before" className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeArrayItem('beforePhotos', index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After Photos (Optional)</label>
          <button
            type="button"
            onClick={() => openMediaPicker('afterPhotos')}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            📷 Select After Photos
          </button>
          <p className="mt-1 text-xs text-gray-500">Marketing will create before/after comparisons</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {formData.afterPhotos.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt="After" className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeArrayItem('afterPhotos', index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demo Videos & Walkthroughs</label>
        <input
          type="url"
          placeholder="Enter video URL (YouTube, Loom, etc.) and press Enter"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('videoLinks', input.value);
              input.value = '';
            }
          }}
        />
        <div className="space-y-1">
          {formData.videoLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 truncate flex items-center">
                <span className="mr-2">🎥</span>
                {link}
              </a>
              <button
                type="button"
                onClick={() => removeArrayItem('videoLinks', index)}
                className="text-red-600 dark:text-red-400 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Figma/Design Files (Optional)</label>
        <input
          type="url"
          placeholder="Enter Figma link and press Enter"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('figmaLinks', input.value);
              input.value = '';
            }
          }}
        />
        <div className="space-y-1">
          {formData.figmaLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 truncate flex items-center">
                <span className="mr-2">🎨</span>
                {link}
              </a>
              <button
                type="button"
                onClick={() => removeArrayItem('figmaLinks', index)}
                className="text-red-600 dark:text-red-400 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // STEP 4: Client & Social Proof
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 What marketing needs:</strong> Testimonials, ratings, and social proof to build credibility and trust with potential clients.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Client & Social Proof</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Company (Optional)</label>
          <input
            type="text"
            value={formData.clientCompany}
            onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Testimonial (English)</label>
          <textarea
            rows={4}
            value={formData.clientTestimonialEn}
            onChange={(e) => setFormData({ ...formData, clientTestimonialEn: e.target.value })}
            placeholder="What did the client say about working with you?"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Testimonial (Arabic)</label>
          <textarea
            rows={4}
            value={formData.clientTestimonialAr}
            onChange={(e) => setFormData({ ...formData, clientTestimonialAr: e.target.value })}
            placeholder="ماذا قال العميل عن العمل معك؟"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Satisfaction Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, clientRating: star })}
              className="text-3xl transition-transform hover:scale-110"
            >
              {star <= formData.clientRating ? '⭐' : '☆'}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {formData.clientRating}/5 stars
          </span>
        </div>
      </div>

      <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Permissions</p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.useClientName}
            onChange={(e) => setFormData({ ...formData, useClientName: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Allow using client name in marketing materials</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.useClientPhotos}
            onChange={(e) => setFormData({ ...formData, useClientPhotos: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Allow using project screenshots in marketing</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.allowReference}
            onChange={(e) => setFormData({ ...formData, allowReference: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Client can be contacted as reference</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Press Mentions (Optional)</label>
        <input
          type="url"
          placeholder="Enter article/feature URL and press Enter"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('pressMentions', input.value);
              input.value = '';
            }
          }}
        />
        <p className="text-xs text-gray-500 mb-2">Has this project been featured in publications, blogs, or media?</p>
        <div className="space-y-1">
          {formData.pressMentions.map((url, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 truncate">
                📰 {url}
              </a>
              <button
                type="button"
                onClick={() => removeArrayItem('pressMentions', index)}
                className="text-red-600 dark:text-red-400 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Awards & Certifications (Optional)</label>
        <input
          type="text"
          placeholder="e.g., Awwwards Site of the Day (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('awards', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.awards.map((award, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
              🏆 {award}
              <button
                type="button"
                onClick={() => removeArrayItem('awards', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Credits (Optional)</label>
        <input
          type="text"
          placeholder="e.g., John Doe (Lead Developer), Jane Smith (Designer) (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('teamCredits', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.teamCredits.map((credit, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              👤 {credit}
              <button
                type="button"
                onClick={() => removeArrayItem('teamCredits', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // STEP 5: Marketing Strategy & SEO
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 What marketing needs:</strong> SEO-optimized descriptions (150-160 chars), keywords, and targeting info to promote your project effectively.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Marketing Strategy & SEO</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Meta Description (English)
            <span className="ml-2 text-xs text-gray-500">
              {formData.seoMetaDescEn.length}/160 chars
            </span>
          </label>
          <textarea
            rows={3}
            maxLength={160}
            value={formData.seoMetaDescEn}
            onChange={(e) => setFormData({ ...formData, seoMetaDescEn: e.target.value })}
            placeholder="A compelling 150-160 character description for search engines"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">Used in Google search results and social media</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Meta Description (Arabic)
            <span className="ml-2 text-xs text-gray-500">
              {formData.seoMetaDescAr.length}/160 chars
            </span>
          </label>
          <textarea
            rows={3}
            maxLength={160}
            value={formData.seoMetaDescAr}
            onChange={(e) => setFormData({ ...formData, seoMetaDescAr: e.target.value })}
            placeholder="وصف مقنع من 150-160 حرفًا لمحركات البحث"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Keywords</label>
        <input
          type="text"
          placeholder="e.g., luxury villa design, modern architecture Dubai (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('targetKeywords', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.targetKeywords.map((keyword, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {keyword}
              <button
                type="button"
                onClick={() => removeArrayItem('targetKeywords', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
        <input
          type="text"
          placeholder="e.g., High-net-worth individuals, Real estate developers (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('targetAudience', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.targetAudience.map((audience, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              🎯 {audience}
              <button
                type="button"
                onClick={() => removeArrayItem('targetAudience', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Platforms</label>
        <input
          type="text"
          placeholder="e.g., Instagram, LinkedIn, Website, Behance (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('recommendedPlatforms', input.value);
              input.value = '';
            }
          }}
        />
        <p className="text-xs text-gray-500 mb-2">Where should marketing promote this project?</p>
        <div className="flex flex-wrap gap-2">
          {formData.recommendedPlatforms.map((platform, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              📱 {platform}
              <button
                type="button"
                onClick={() => removeArrayItem('recommendedPlatforms', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Geographic Focus</label>
        <input
          type="text"
          placeholder="e.g., Dubai Marina, Palm Jumeirah, UAE (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('geographicFocus', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.geographicFocus.map((location, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
              📍 {location}
              <button
                type="button"
                onClick={() => removeArrayItem('geographicFocus', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Selling Points</label>
        <input
          type="text"
          placeholder="e.g., Sustainable design, Smart home integration (press Enter)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              addArrayItem('keySellingPoints', input.value);
              input.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {formData.keySellingPoints.map((point, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200">
              ⭐ {point}
              <button
                type="button"
                onClick={() => removeArrayItem('keySellingPoints', index)}
                className="ml-2"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes for Marketing Team</label>
        <textarea
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any special instructions, context, or information the marketing team should know..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                  currentStep === step.id
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {currentStep > step.id ? '✓' : step.icon}
              </div>
              <span className={`mt-2 text-xs text-center font-medium ${currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.title}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 text-center">
                {step.subtitle}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`hidden md:block absolute h-0.5 w-20 mt-6 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} style={{ left: `${(idx + 1) * 20}%` }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep} of {STEPS.length}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            💾 Save Draft
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitHandoff}
              className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              🚀 Submit to Marketing
            </button>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
          multiple={true}
          fileType="image"
        />
      )}
    </div>
  );
}
