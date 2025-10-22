'use client';

import { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';

interface Deal {
  id: string;
  titleEn: string;
  titleAr: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
  contactId: string;
  companyId?: string;
  projectType: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

interface DealFormData {
  titleEn: string;
  titleAr: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  contactId: string;
  companyId: string;
  projectType: string;
  descriptionEn: string;
  descriptionAr: string;
}

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: DealFormData) => Promise<void>;
  deal?: Deal | null;
  isSaving: boolean;
}

const PIPELINE_STAGES = [
  { value: 'initial_consultation', label: 'Initial Consultation', probability: 10 },
  { value: 'site_visit', label: 'Site Visit', probability: 20 },
  { value: 'design_proposal', label: 'Design Proposal', probability: 30 },
  { value: 'quotation', label: 'Quotation', probability: 40 },
  { value: 'negotiation', label: 'Negotiation', probability: 60 },
  { value: 'contract_sent', label: 'Contract Sent', probability: 70 },
  { value: 'contract_signed', label: 'Contract Signed', probability: 90 },
  { value: 'won', label: 'Won', probability: 100 },
  { value: 'lost', label: 'Lost', probability: 0 },
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

export default function DealFormModal({ isOpen, onClose, onSave, deal, isSaving }: DealFormModalProps) {
  const [formData, setFormData] = useState<DealFormData>({
    titleEn: '',
    titleAr: '',
    value: 0,
    stage: 'initial_consultation',
    probability: 10,
    expectedCloseDate: '',
    contactId: '',
    companyId: '',
    projectType: 'villa',
    descriptionEn: '',
    descriptionAr: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when editing
  useEffect(() => {
    if (deal) {
      setFormData({
        titleEn: deal.titleEn,
        titleAr: deal.titleAr,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
        contactId: deal.contactId,
        companyId: deal.companyId || '',
        projectType: deal.projectType,
        descriptionEn: deal.descriptionEn || '',
        descriptionAr: deal.descriptionAr || '',
      });
    } else {
      // Reset form for new deal
      const today = new Date();
      const futureDate = new Date(today.setMonth(today.getMonth() + 1));
      const defaultDate = futureDate.toISOString().split('T')[0];

      setFormData({
        titleEn: '',
        titleAr: '',
        value: 0,
        stage: 'initial_consultation',
        probability: 10,
        expectedCloseDate: defaultDate,
        contactId: '',
        companyId: '',
        projectType: 'villa',
        descriptionEn: '',
        descriptionAr: '',
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titleEn.trim()) {
      newErrors.titleEn = 'Title (English) is required';
    }

    if (!formData.titleAr.trim()) {
      newErrors.titleAr = 'Title (Arabic) is required';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }

    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required';
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

  const handleStageChange = (newStage: string) => {
    const stageInfo = PIPELINE_STAGES.find(s => s.value === newStage);
    if (stageInfo) {
      setFormData(prev => ({
        ...prev,
        stage: newStage,
        probability: stageInfo.probability
      }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'Edit Deal' : 'New Deal'}
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
            {isSaving ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deal Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Deal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.titleEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Villa Design - Downtown Dubai"
              />
              {errors.titleEn && <p className="text-red-500 text-sm mt-1">{errors.titleEn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Arabic) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                  errors.titleAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="مثال: تصميم فيلا - دبي وسط المدينة"
                dir="rtl"
              />
              {errors.titleAr && <p className="text-red-500 text-sm mt-1">{errors.titleAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Value (AED) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100000"
                min="0"
                step="1000"
              />
              {formData.value > 0 && (
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.value)}</p>
              )}
              {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PIPELINE_STAGES.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Win Probability (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.probability}
                  onChange={(e) => setFormData(prev => ({ ...prev, probability: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {formData.probability}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Auto-set based on stage, or adjust manually</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactId}
                onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.contactId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contact UUID"
              />
              <p className="text-xs text-gray-500 mt-1">Enter or select contact from contacts page</p>
              {errors.contactId && <p className="text-red-500 text-sm mt-1">{errors.contactId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company ID (Optional)</label>
              <input
                type="text"
                value={formData.companyId}
                onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Company UUID"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: Link to a company</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Description</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                rows={4}
                value={formData.descriptionEn}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the deal, project scope, client requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic)</label>
              <textarea
                rows={4}
                value={formData.descriptionAr}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                placeholder="وصف الصفقة ونطاق المشروع ومتطلبات العميل..."
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Deal Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Deal Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-blue-600 uppercase">Value</div>
              <div className="text-lg font-bold text-blue-900">{formatCurrency(formData.value)}</div>
            </div>
            <div>
              <div className="text-xs text-blue-600 uppercase">Probability</div>
              <div className="text-lg font-bold text-blue-900">{formData.probability}%</div>
            </div>
            <div>
              <div className="text-xs text-blue-600 uppercase">Expected Value</div>
              <div className="text-lg font-bold text-blue-900">
                {formatCurrency(formData.value * (formData.probability / 100))}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-600 uppercase">Stage</div>
              <div className="text-sm font-semibold text-blue-900">
                {PIPELINE_STAGES.find(s => s.value === formData.stage)?.label}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
