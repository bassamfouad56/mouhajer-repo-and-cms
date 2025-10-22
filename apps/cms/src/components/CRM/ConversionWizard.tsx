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
}

interface ConversionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConvert: (data: ConversionData) => Promise<void>;
  isConverting: boolean;
}

interface ConversionData {
  createDeal: boolean;
  dealData?: {
    title: string;
    value: number;
    stage: string;
    expectedCloseDate: string;
  };
}

type WizardStep = 'confirm' | 'deal-options' | 'deal-details' | 'review';

export default function ConversionWizard({
  isOpen,
  onClose,
  lead,
  onConvert,
  isConverting
}: ConversionWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('confirm');
  const [createDeal, setCreateDeal] = useState(true);
  const [dealData, setDealData] = useState({
    title: '',
    value: 0,
    stage: 'initial_consultation',
    expectedCloseDate: ''
  });

  // Reset wizard when opened
  useEffect(() => {
    if (isOpen && lead) {
      setCurrentStep('confirm');
      setCreateDeal(true);
      setDealData({
        title: `${lead.projectType.replace(/_/g, ' ')} - ${lead.city || 'Dubai'}`,
        value: estimateValue(lead.budgetRange),
        stage: 'initial_consultation',
        expectedCloseDate: calculateExpectedCloseDate(lead.timeline)
      });
    }
  }, [isOpen, lead]);

  const estimateValue = (budgetRange?: string): number => {
    const estimates: Record<string, number> = {
      ultra_luxury: 1500000,
      luxury: 750000,
      mid_range: 300000,
      economical: 75000
    };
    return estimates[budgetRange || 'mid_range'] || 300000;
  };

  const calculateExpectedCloseDate = (timeline?: string): string => {
    const today = new Date();
    const daysToAdd: Record<string, number> = {
      immediate: 30,
      '1_month': 45,
      '3_months': 90,
      '6_months': 180,
      flexible: 60
    };

    const days = daysToAdd[timeline || 'flexible'] || 60;
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('deal-options');
    } else if (currentStep === 'deal-options') {
      if (createDeal) {
        setCurrentStep('deal-details');
      } else {
        setCurrentStep('review');
      }
    } else if (currentStep === 'deal-details') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'review') {
      if (createDeal) {
        setCurrentStep('deal-details');
      } else {
        setCurrentStep('deal-options');
      }
    } else if (currentStep === 'deal-details') {
      setCurrentStep('deal-options');
    } else if (currentStep === 'deal-options') {
      setCurrentStep('confirm');
    }
  };

  const handleConvert = async () => {
    const conversionData: ConversionData = {
      createDeal,
      ...(createDeal && { dealData })
    };
    await onConvert(conversionData);
  };

  const getStepProgress = (): number => {
    const steps: WizardStep[] = createDeal
      ? ['confirm', 'deal-options', 'deal-details', 'review']
      : ['confirm', 'deal-options', 'review'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert Lead to Contact"
      size="xl"
      footer={null}
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getStepProgress()}%` }}
          ></div>
        </div>

        {/* Step 1: Confirm Contact Details */}
        {currentStep === 'confirm' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Contact Details</h3>
                <p className="text-sm text-gray-600">Review the information that will be transferred to the contact</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-base text-gray-900 mt-1">{lead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-base text-gray-900 mt-1">{lead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-base text-gray-900 mt-1">{lead.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Source</label>
                  <p className="text-base text-gray-900 mt-1 capitalize">{lead.source.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Project Preferences</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Project Type</label>
                    <p className="text-sm text-gray-900 capitalize">{lead.projectType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Budget Range</label>
                    <p className="text-sm text-gray-900 capitalize">{lead.budgetRange?.replace(/_/g, ' ') || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Timeline</label>
                    <p className="text-sm text-gray-900 capitalize">{lead.timeline?.replace(/_/g, ' ') || 'Flexible'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Location</label>
                    <p className="text-sm text-gray-900">{lead.area ? `${lead.area}, ${lead.city}` : lead.city || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">What happens when you convert?</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• A new Contact record will be created with this information</li>
                    <li>• The lead will be marked as "Converted"</li>
                    <li>• All notes and history will be transferred</li>
                    <li>• You can optionally create a Deal for tracking this project</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Deal Options */}
        {currentStep === 'deal-options' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Deal?</h3>
                <p className="text-sm text-gray-600">Track this project opportunity in your sales pipeline</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCreateDeal(true)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  createDeal
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    createDeal ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {createDeal && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      ✅ Yes, create a deal
                      <span className="ml-2 text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Recommended</span>
                    </h4>
                    <p className="text-sm text-gray-600">
                      Create a deal to track this project in your pipeline. You'll set the project value, expected close date, and initial stage.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCreateDeal(false)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  !createDeal
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    !createDeal ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {!createDeal && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">No, just create contact</h4>
                    <p className="text-sm text-gray-600">
                      Only create the contact record. You can add a deal later if needed. Choose this if there's no specific project yet.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deal Details */}
        {currentStep === 'deal-details' && createDeal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Deal Details</h3>
                <p className="text-sm text-gray-600">Set up the project opportunity details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dealData.title}
                  onChange={(e) => setDealData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Villa Renovation - Palm Jumeirah"
                />
                <p className="text-xs text-gray-500 mt-1">Descriptive name for this project</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Value (AED) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dealData.value}
                  onChange={(e) => setDealData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="750000"
                  min="0"
                  step="1000"
                />
                <p className="text-xs text-gray-500 mt-1">Total estimated project value (you can adjust later)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Stage
                </label>
                <select
                  value={dealData.stage}
                  onChange={(e) => setDealData(prev => ({ ...prev, stage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="initial_consultation">Initial Consultation</option>
                  <option value="site_visit_scheduled">Site Visit Scheduled</option>
                  <option value="site_visit_completed">Site Visit Completed</option>
                  <option value="quotation_sent">Quotation Sent</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Where is this project currently?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={dealData.expectedCloseDate}
                  onChange={(e) => setDealData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-1">When do you expect to close this deal?</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {createDeal ? '4' : '3'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review & Confirm</h3>
                <p className="text-sm text-gray-600">Double-check everything before converting</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Contact Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  New Contact
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700 font-medium">Name:</span>
                    <span className="text-green-900 ml-2">{lead.name}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Phone:</span>
                    <span className="text-green-900 ml-2">{lead.phone}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Email:</span>
                    <span className="text-green-900 ml-2">{lead.email || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Location:</span>
                    <span className="text-green-900 ml-2">{lead.city || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Deal Summary */}
              {createDeal && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    New Deal
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Title:</span>
                      <span className="text-blue-900 ml-2">{dealData.title}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Value:</span>
                      <span className="text-blue-900 ml-2">{dealData.value.toLocaleString()} AED</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Stage:</span>
                      <span className="text-blue-900 ml-2 capitalize">{dealData.stage.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Expected Close:</span>
                      <span className="text-blue-900 ml-2">{new Date(dealData.expectedCloseDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* What Happens Next */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What happens after conversion?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Contact will be created and you'll be redirected to their profile</span>
                  </li>
                  {createDeal && (
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Deal will appear in your pipeline and be tracked for forecasting</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>A follow-up task will be automatically created</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>This lead will be marked as "Converted" for record-keeping</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div>
            {currentStep !== 'confirm' && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isConverting}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isConverting}
            >
              Cancel
            </Button>

            {currentStep !== 'review' ? (
              <Button
                onClick={handleNext}
                disabled={isConverting}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ) : (
              <Button
                onClick={handleConvert}
                disabled={isConverting || !dealData.title || dealData.value <= 0}
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Convert Lead
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
