'use client';

import { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  source: string;
  projectType: string;
  budgetRange?: string;
  propertySize?: string;
  timeline?: string;
  city?: string;
  area?: string;
  interestedIn: string[];
  stylePreference: string[];
  message?: string;
  notesEn?: string;
  notesAr?: string;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: string;
  projectType: string;
  budgetRange: string;
  propertySize: string;
  timeline: string;
  city: string;
  area: string;
  interestedIn: string[];
  stylePreference: string[];
  message: string;
  notesEn: string;
  notesAr: string;
}

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: LeadFormData) => Promise<void>;
  lead?: Lead | null;
  isSaving: boolean;
}

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
];

const PROJECT_TYPES = [
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'office', label: 'Office' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Café' },
  { value: 'retail_store', label: 'Retail Store' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'showroom', label: 'Showroom' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'spa', label: 'Spa' },
  { value: 'gym', label: 'Gym' },
  { value: 'other', label: 'Other' },
];

const BUDGET_RANGES = [
  { value: 'economical', label: 'Economical (< 100K AED)' },
  { value: 'mid_range', label: 'Mid Range (100K - 500K AED)' },
  { value: 'luxury', label: 'Luxury (500K - 1M AED)' },
  { value: 'ultra_luxury', label: 'Ultra Luxury (> 1M AED)' },
];

const TIMELINES = [
  { value: 'immediate', label: 'Immediate (< 1 month)' },
  { value: '1_month', label: '1 Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: 'flexible', label: 'Flexible' },
];

const STYLE_PREFERENCES = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'arabic', label: 'Arabic/Traditional' },
  { value: 'european', label: 'European' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'eclectic', label: 'Eclectic' },
];

const INTERESTED_IN = [
  { value: 'design', label: 'Interior Design' },
  { value: 'contracting', label: 'Contracting' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'consultation', label: 'Consultation Only' },
  { value: 'full_package', label: 'Full Package' },
];

const UAE_CITIES = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'
];

export default function LeadFormModal({ isOpen, onClose, onSave, lead, isSaving }: LeadFormModalProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    projectType: 'villa',
    budgetRange: 'mid_range',
    propertySize: '',
    timeline: 'flexible',
    city: 'Dubai',
    area: '',
    interestedIn: [],
    stylePreference: [],
    message: '',
    notesEn: '',
    notesAr: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when editing
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone,
        source: lead.source,
        projectType: lead.projectType,
        budgetRange: lead.budgetRange || 'mid_range',
        propertySize: lead.propertySize || '',
        timeline: lead.timeline || 'flexible',
        city: lead.city || 'Dubai',
        area: lead.area || '',
        interestedIn: lead.interestedIn || [],
        stylePreference: lead.stylePreference || [],
        message: lead.message || '',
        notesEn: lead.notesEn || '',
        notesAr: lead.notesAr || '',
      });
    } else {
      // Reset form for new lead
      setFormData({
        name: '',
        email: '',
        phone: '',
        source: 'website',
        projectType: 'villa',
        budgetRange: 'mid_range',
        propertySize: '',
        timeline: 'flexible',
        city: 'Dubai',
        area: '',
        interestedIn: [],
        stylePreference: [],
        message: '',
        notesEn: '',
        notesAr: '',
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSave(formData);
  };

  const toggleArrayValue = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(v => v !== value);
    }
    return [...array, value];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Lead' : 'New Lead'}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+971 50 123 4567"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SOURCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Project Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PROJECT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {BUDGET_RANGES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Size (sqm)</label>
              <input
                type="text"
                value={formData.propertySize}
                onChange={(e) => setFormData(prev => ({ ...prev, propertySize: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 200 sqm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {TIMELINES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {UAE_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area/Neighborhood</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Downtown, Marina"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Preferences</h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Style Preference</label>
            <div className="flex flex-wrap gap-2">
              {STYLE_PREFERENCES.map(style => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    stylePreference: toggleArrayValue(prev.stylePreference, style.value)
                  }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.stylePreference.includes(style.value)
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interested In</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTED_IN.map(interest => (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    interestedIn: toggleArrayValue(prev.interestedIn, interest.value)
                  }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.interestedIn.includes(interest.value)
                      ? 'bg-green-100 text-green-800 border-2 border-green-600'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Additional Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any specific requirements or messages..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (English)</label>
                <textarea
                  rows={2}
                  value={formData.notesEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, notesEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Internal notes in English..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Arabic)</label>
                <textarea
                  rows={2}
                  value={formData.notesAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, notesAr: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="ملاحظات داخلية بالعربية..."
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
