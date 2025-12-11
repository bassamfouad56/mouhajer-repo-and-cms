'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Send, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';

interface AIImageGeneratorProps {
  onClose?: () => void;
}

export function AIImageGenerator({ onClose }: AIImageGeneratorProps) {
  const [email, setEmail] = useState('');
  const [prompt, setPrompt] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const serviceCategories = [
    { value: 'residential', label: 'Residential Design' },
    { value: 'commercial', label: 'Commercial Design' },
    { value: 'hospitality', label: 'Hospitality Design' },
    { value: 'mep', label: 'MEP Engineering' },
    { value: 'interior', label: 'Interior Design' },
    { value: 'landscape', label: 'Landscape Design' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }

      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setGeneratedImageUrl(null);

    // Validation
    if (!email || !prompt) {
      setError('Please provide your email and describe your design vision');
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('prompt', prompt);
      if (serviceCategory) {
        formData.append('serviceCategory', serviceCategory);
      }
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setSuccess(true);
      setGeneratedImageUrl(data.data.imageUrl);

      // Reset form after short delay
      setTimeout(() => {
        setEmail('');
        setPrompt('');
        setServiceCategory('');
        removeImage();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="p-8 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#d4af37]/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-[#d4af37]" />
            </div>
            <h2 className="font-SchnyderS text-3xl font-light text-neutral-950">
              AI Design Studio
            </h2>
          </div>
          <p className="font-Satoshi text-sm text-neutral-600">
            Describe your vision, and our AI will create a luxury design concept tailored to MIDC's signature style.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block font-Satoshi text-sm font-medium text-neutral-700 mb-2">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-colors font-Satoshi text-sm"
              required
              disabled={isGenerating}
            />
          </div>

          {/* Service Category */}
          <div className="mb-6">
            <label htmlFor="serviceCategory" className="block font-Satoshi text-sm font-medium text-neutral-700 mb-2">
              Service Type
            </label>
            <select
              id="serviceCategory"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-colors font-Satoshi text-sm"
              disabled={isGenerating}
            >
              <option value="">Select a service (optional)</option>
              {serviceCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Textarea */}
          <div className="mb-6">
            <label htmlFor="prompt" className="block font-Satoshi text-sm font-medium text-neutral-700 mb-2">
              Describe Your Vision <span className="text-red-500">*</span>
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A modern luxury living room with floor-to-ceiling windows, marble flooring, and gold accents..."
              rows={5}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-colors font-Satoshi text-sm resize-none"
              required
              disabled={isGenerating}
            />
            <p className="mt-2 font-Satoshi text-xs text-neutral-500">
              Be specific about materials, colors, style, and atmosphere you envision.
            </p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block font-Satoshi text-sm font-medium text-neutral-700 mb-2">
              Reference Image (Optional)
            </label>

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-colors"
              >
                <Upload className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
                <p className="font-Satoshi text-sm text-neutral-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="font-Satoshi text-xs text-neutral-500">
                  PNG, JPG up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isGenerating}
                />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="font-Satoshi text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-Satoshi text-sm font-medium text-green-700 mb-1">
                      Image Generated Successfully!
                    </p>
                    <p className="font-Satoshi text-sm text-green-600">
                      We've sent the design to your email. Our team will reach out within 24 hours.
                    </p>
                  </div>
                </div>

                {generatedImageUrl && (
                  <Image
                    src={generatedImageUrl}
                    alt="Generated design"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg mt-3"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating || success}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-neutral-950 text-white font-Satoshi text-sm font-medium rounded-lg hover:bg-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Your Design...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Design Sent!</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Generate Design Concept</span>
              </>
            )}
          </button>

          {isGenerating && (
            <p className="mt-3 text-center font-Satoshi text-xs text-neutral-500">
              This may take 30-60 seconds. Please don't close this window.
            </p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
