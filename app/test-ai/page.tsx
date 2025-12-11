'use client';

import { useState } from 'react';
import { AIImageGenerator } from '@/components/ai-chatbot/ai-image-generator';

export default function TestAIPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/ai/generate-image');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      setHealthStatus({ error: 'Failed to connect to API' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-SchnyderS text-5xl font-light text-neutral-950">
            AI Image Generation Test
          </h1>
          <p className="font-Satoshi text-lg text-neutral-600">
            Test the AI-powered design generation feature
          </p>
        </div>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 font-SchnyderS text-2xl font-light text-neutral-950">
            System Health Check
          </h2>
          <p className="mb-4 font-Satoshi text-sm text-neutral-600">
            Verify that all AI services are running on Mac Mini
          </p>

          <button
            onClick={checkHealth}
            disabled={checking}
            className="mb-4 rounded-lg bg-neutral-950 px-6 py-3 font-Satoshi text-sm font-medium text-white transition-colors hover:bg-[#d4af37] disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Check Health Status'}
          </button>

          {healthStatus && (
            <div className="rounded-lg bg-neutral-50 p-4">
              <pre className="overflow-auto font-mono text-xs">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 font-SchnyderS text-2xl font-light text-neutral-950">
            Generate AI Design
          </h2>
          <p className="mb-6 font-Satoshi text-sm text-neutral-600">
            Click the button below to open the AI design generator and test the full workflow
          </p>

          <button
            onClick={() => setShowGenerator(true)}
            className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8941f] px-8 py-4 font-Satoshi text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Open AI Design Studio
          </button>

          <div className="mt-8 space-y-4 border-t border-neutral-200 pt-8">
            <h3 className="font-SchnyderS text-lg font-light text-neutral-950">
              Test Checklist:
            </h3>
            <ul className="space-y-2 font-Satoshi text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Enter a valid email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>
                  Describe a design (e.g., "Luxury hotel lobby with marble floors and gold accents")
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Select a service category (optional)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Upload a reference image (optional)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Click "Generate Design Concept"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Wait 30-60 seconds for generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Check your email for the generated design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>
                  Verify lead in Sanity Studio: <a href="http://localhost:3333" className="text-[#d4af37] underline" target="_blank">localhost:3333</a>
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <h4 className="mb-2 font-SchnyderS text-base font-medium text-yellow-900">
              Before Testing:
            </h4>
            <ul className="space-y-1 font-Satoshi text-sm text-yellow-800">
              <li>• Ensure Mac Mini is powered on (100.111.21.66)</li>
              <li>• Ollama should be running on port 11434</li>
              <li>• ComfyUI should be running on port 8188</li>
              <li>• Models downloaded: llama3, llava, SDXL</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-neutral-950 p-8 text-white">
          <h2 className="mb-4 font-SchnyderS text-2xl font-light">
            Documentation
          </h2>
          <div className="space-y-2 font-Satoshi text-sm">
            <p>
              📖 <a href="/docs/AI_QUICK_START.md" className="text-[#d4af37] underline">Quick Start Guide</a>
            </p>
            <p>
              📚 <a href="/docs/AI_IMAGE_GENERATION_SETUP.md" className="text-[#d4af37] underline">Complete Setup Guide</a>
            </p>
            <p>
              📝 <a href="/docs/AI_FEATURE_SUMMARY.md" className="text-[#d4af37] underline">Feature Summary</a>
            </p>
          </div>
        </div>
      </div>

      {showGenerator && (
        <AIImageGenerator onClose={() => setShowGenerator(false)} />
      )}
    </div>
  );
}
