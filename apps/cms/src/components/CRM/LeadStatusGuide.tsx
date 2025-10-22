'use client';

import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';

interface StatusDefinition {
  status: string;
  icon: string;
  color: string;
  description: string;
  whatToDo: string[];
  averageTime: string;
}

const STATUS_DEFINITIONS: StatusDefinition[] = [
  {
    status: 'New',
    icon: '🆕',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Lead just received, no contact made yet',
    whatToDo: [
      'Review lead details and score',
      'Check if it looks like spam',
      'Prepare for first contact (research if B2B)',
      'Reach out within 24 hours (1 hour for hot leads)'
    ],
    averageTime: '0-24 hours'
  },
  {
    status: 'Contacted',
    icon: '📞',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Initial contact made (call, email, or WhatsApp)',
    whatToDo: [
      'Wait for client response',
      'Set follow-up reminder (3-7 days)',
      'Prepare answers to common questions',
      'Gather more project details when they respond'
    ],
    averageTime: '1-7 days'
  },
  {
    status: 'Qualified',
    icon: '✅',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Verified as serious prospect with appropriate budget and timeline',
    whatToDo: [
      'Convert to Contact immediately',
      'Create Deal for their project',
      'Schedule site visit or detailed consultation',
      'Send initial information packet'
    ],
    averageTime: 'Convert within 1-2 days'
  },
  {
    status: 'Proposal',
    icon: '📋',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Quotation or proposal sent, waiting for response',
    whatToDo: [
      'Follow up after 3-5 days',
      'Answer questions about pricing',
      'Schedule meeting to present proposal',
      'Be ready to negotiate or adjust scope'
    ],
    averageTime: '7-21 days'
  },
  {
    status: 'Won',
    icon: '🎉',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Client accepted and signed contract',
    whatToDo: [
      'Convert to Contact + Deal immediately',
      'Celebrate with team!',
      'Set up project in system',
      'Schedule kickoff meeting'
    ],
    averageTime: 'Immediate action required'
  },
  {
    status: 'Lost',
    icon: '❌',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'Not interested, disqualified, or went with competitor',
    whatToDo: [
      'ALWAYS document why they were lost',
      'Add to "Past Leads" list',
      'Set reminder to check back in 3-6 months',
      'Learn from it - update your process'
    ],
    averageTime: 'Archive immediately'
  }
];

interface LeadStatusGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadStatusGuide({ isOpen, onClose }: LeadStatusGuideProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusDefinition | null>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Status Guide"
      size="2xl"
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Got it!</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Understanding lead statuses helps you manage your pipeline effectively. Click any status below for details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATUS_DEFINITIONS.map((def) => (
            <button
              key={def.status}
              onClick={() => setSelectedStatus(selectedStatus?.status === def.status ? null : def)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedStatus?.status === def.status
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{def.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${def.color}`}>
                    {def.status}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedStatus?.status === def.status ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <p className="text-sm text-gray-600">{def.description}</p>

              {selectedStatus?.status === def.status && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">What to Do:</h5>
                    <ul className="space-y-1">
                      {def.whatToDo.map((action, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-500">Typical Duration:</span>
                    <span className="font-medium text-gray-700">{def.averageTime}</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Workflow Diagram */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Typical Lead Journey
          </h4>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium border border-blue-300">
              New
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium border border-purple-300">
              Contacted
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium border border-green-300">
              Qualified
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium border border-yellow-300">
              Proposal
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium border border-emerald-300">
              Won
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-600">
            💡 <strong>Pro Tip:</strong> Leads can also go to "Lost" from any stage. Always document why!
          </p>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span>✅</span>
              Do's
            </h5>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Update status in real-time</li>
              <li>• Always add notes when changing status</li>
              <li>• Convert qualified leads quickly</li>
              <li>• Set follow-up reminders</li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h5 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
              <span>❌</span>
              Don'ts
            </h5>
            <ul className="space-y-1 text-sm text-red-800">
              <li>• Let leads sit in "New" for days</li>
              <li>• Skip the qualification step</li>
              <li>• Delete leads without documenting</li>
              <li>• Mark as "Won" before contract signed</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
