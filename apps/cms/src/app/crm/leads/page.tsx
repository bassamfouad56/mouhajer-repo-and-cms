'use client';

import { useState, useEffect } from 'react';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';
import EmptyState, { EmptyStateIcons } from '@/components/EmptyState';
import Button from '@/components/Button';
import LeadFormModal from '@/components/CRM/LeadFormModal';
import OnboardingTooltip from '@/components/CRM/OnboardingTooltip';
import LeadStatusGuide from '@/components/CRM/LeadStatusGuide';
import LeadScoreExplainer from '@/components/CRM/LeadScoreExplainer';
import ConversionWizard from '@/components/CRM/ConversionWizard';
import Modal from '@/components/Modal';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  source: string;
  status: string;
  score: number;
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
  qualified: boolean;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
  averageScore: number;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // New modal states
  const [showStatusGuide, setShowStatusGuide] = useState(false);
  const [showConversionWizard, setShowConversionWizard] = useState(false);
  const [selectedLeadForConversion, setSelectedLeadForConversion] = useState<Lead | null>(null);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);
  const [selectedLeadForScore, setSelectedLeadForScore] = useState<Lead | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [qualifiedFilter, setQualifiedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score-high');

  // Fetch leads and stats on mount
  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetLeads {
              leads {
                leads {
                  id
                  name
                  email
                  phone
                  source
                  status
                  score
                  projectType
                  budgetRange
                  timeline
                  qualified
                  assignedTo
                  createdAt
                  updatedAt
                }
                total
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        if (data?.leads?.leads) {
          setLeads(data.leads.leads);
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetLeadStats {
              leadStats {
                total
                new
                contacted
                qualified
                proposal
                won
                lost
                averageScore
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setStats(data.leadStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleNewLead = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleQualifyLead = async (leadId: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation QualifyLead($id: ID!) {
              qualifyLead(id: $id) {
                id
                qualified
                status
              }
            }
          `,
          variables: { id: leadId },
        }),
      });

      if (response.ok) {
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error('Error qualifying lead:', error);
    }
  };

  const handleConvertLead = async (lead: Lead) => {
    setSelectedLeadForConversion(lead);
    setShowConversionWizard(true);
  };

  const handleConversionSubmit = async (conversionData: any) => {
    if (!selectedLeadForConversion) return;

    try {
      setIsConverting(true);
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ConvertLead($id: ID!, $createDeal: Boolean!, $dealValue: Float) {
              convertLead(id: $id, createDeal: $createDeal, dealValue: $dealValue) {
                success
                contact {
                  id
                  firstName
                  lastName
                }
                deal {
                  id
                  titleEn
                }
              }
            }
          `,
          variables: {
            id: selectedLeadForConversion.id,
            createDeal: conversionData.createDeal,
            dealValue: conversionData.dealData?.value
          },
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        if (data.convertLead.success) {
          setShowConversionWizard(false);
          fetchLeads();
          fetchStats();
          // Show success message
          alert(`Lead converted successfully! Contact: ${data.convertLead.contact.firstName} ${data.convertLead.contact.lastName}`);
        }
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Failed to convert lead. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleShowScoreBreakdown = (lead: Lead) => {
    setSelectedLeadForScore(lead);
    setShowScoreExplainer(true);
  };

  const handleSaveLead = async (formData: any) => {
    try {
      setIsSaving(true);
      const mutation = selectedLead ? 'updateLead' : 'createLead';
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ${mutation === 'createLead' ? 'CreateLead' : 'UpdateLead'}(${mutation === 'updateLead' ? '$id: ID, ' : ''}$input: ${mutation === 'createLead' ? 'CreateLeadInput' : 'UpdateLeadInput'}!) {
              ${mutation}(${mutation === 'updateLead' ? 'id: $id, ' : ''}input: $input) {
                id
                name
                status
              }
            }
          `,
          variables: {
            ...(selectedLead && { id: selectedLead.id }),
            input: formData,
          },
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchLeads();
        fetchStats();
      } else {
        const error = await response.json();
        alert(error.errors?.[0]?.message || 'Failed to save lead');
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Error saving lead');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation DeleteLead($id: ID!) {
              deleteLead(id: $id)
            }
          `,
          variables: { id: leadId },
        }),
      });

      if (response.ok) {
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Filter and sort leads
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesQualified =
        qualifiedFilter === 'all' ||
        (qualifiedFilter === 'qualified' && lead.qualified) ||
        (qualifiedFilter === 'unqualified' && !lead.qualified);

      return matchesSearch && matchesStatus && matchesSource && matchesQualified;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score-high':
          return b.score - a.score;
        case 'score-low':
          return a.score - b.score;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  const sourceOptions: FilterOption[] = [
    { value: 'all', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'phone', label: 'Phone' },
  ];

  const qualifiedOptions: FilterOption[] = [
    { value: 'all', label: 'All Leads' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'unqualified', label: 'Unqualified' },
  ];

  const sortOptions: FilterOption[] = [
    { value: 'score-high', label: 'Highest Score' },
    { value: 'score-low', label: 'Lowest Score' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      won: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Leads Management
                <OnboardingTooltip
                  title="What are Leads?"
                  content="Leads are potential clients who have shown interest but haven't been fully vetted yet. Qualify them before converting to Contacts."
                  position="right"
                />
              </h1>
              <p className="text-gray-600 mt-1">Track and manage potential clients</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowStatusGuide(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status Guide
            </Button>
            <Button onClick={handleNewLead}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
            <div className="text-sm text-blue-600">New</div>
            <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
            <div className="text-sm text-purple-600">Contacted</div>
            <div className="text-2xl font-bold text-purple-900">{stats.contacted}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
            <div className="text-sm text-green-600">Qualified</div>
            <div className="text-2xl font-bold text-green-900">{stats.qualified}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
            <div className="text-sm text-yellow-600">Proposal</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.proposal}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg shadow p-4 border border-emerald-200">
            <div className="text-sm text-emerald-600">Won</div>
            <div className="text-2xl font-bold text-emerald-900">{stats.won}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
            <div className="text-sm text-red-600">Lost</div>
            <div className="text-2xl font-bold text-red-900">{stats.lost}</div>
          </div>
          <div className="bg-indigo-50 rounded-lg shadow p-4 border border-indigo-200">
            <div className="text-sm text-indigo-600">Avg Score</div>
            <div className="text-2xl font-bold text-indigo-900">{stats.averageScore}</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search leads by name, email, or phone..."
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Source"
            options={sourceOptions}
            value={sourceFilter}
            onChange={setSourceFilter}
          />
          <FilterDropdown
            label="Qualified"
            options={qualifiedOptions}
            value={qualifiedFilter}
            onChange={setQualifiedFilter}
          />
          <FilterDropdown
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'card' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l ${
              viewMode === 'table' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={EmptyStateIcons.Users}
          title="No leads found"
          description="Get started by creating your first lead or adjust your filters"
          actionLabel="Create Lead"
          onAction={handleNewLead}
        />
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-600">{lead.projectType.replace(/_/g, ' ')}</p>
                </div>
                <button
                  onClick={() => handleShowScoreBreakdown(lead)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.score)} hover:ring-2 hover:ring-offset-1 hover:ring-current transition-all cursor-pointer`}
                  title="Click to see score breakdown"
                >
                  Score: {lead.score}
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {lead.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {lead.email}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {lead.phone}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <OnboardingTooltip
                    title={`Status: ${lead.status}`}
                    content={`This lead is in "${lead.status}" status. Click the Status Guide button at the top to learn what this means and what to do next.`}
                    position="top"
                    icon="help"
                  />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {lead.source.replace(/_/g, ' ')}
                </span>
                {lead.budgetRange && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {lead.budgetRange.replace(/_/g, ' ')}
                  </span>
                )}
                {lead.qualified && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Qualified
                  </span>
                )}
              </div>

              {/* Timeline */}
              {lead.timeline && (
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Timeline:</span> {lead.timeline.replace(/_/g, ' ')}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {!lead.qualified && (
                  <button
                    onClick={() => handleQualifyLead(lead.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                  >
                    Qualify
                  </button>
                )}
                <button
                  onClick={() => handleConvertLead(lead)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                  title="Convert to Contact"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Convert
                </button>
                <button
                  onClick={() => handleDeleteLead(lead.id)}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    {lead.qualified && (
                      <span className="text-xs text-green-600">✓ Qualified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.phone}</div>
                    {lead.email && <div className="text-sm text-gray-500">{lead.email}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.projectType.replace(/_/g, ' ')}</div>
                    {lead.budgetRange && (
                      <div className="text-sm text-gray-500">{lead.budgetRange.replace(/_/g, ' ')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {!lead.qualified && (
                        <button
                          onClick={() => handleQualifyLead(lead.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Qualify
                        </button>
                      )}
                      <button
                        onClick={() => handleConvertLead(lead)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Convert to Contact"
                      >
                        Convert
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        lead={selectedLead}
        isSaving={isSaving}
      />

      {/* Status Guide Modal */}
      <LeadStatusGuide
        isOpen={showStatusGuide}
        onClose={() => setShowStatusGuide(false)}
      />

      {/* Conversion Wizard */}
      <ConversionWizard
        isOpen={showConversionWizard}
        onClose={() => {
          setShowConversionWizard(false);
          setSelectedLeadForConversion(null);
        }}
        lead={selectedLeadForConversion}
        onConvert={handleConversionSubmit}
        isConverting={isConverting}
      />

      {/* Score Explainer Modal */}
      {selectedLeadForScore && (
        <Modal
          isOpen={showScoreExplainer}
          onClose={() => {
            setShowScoreExplainer(false);
            setSelectedLeadForScore(null);
          }}
          title={`Lead Score Breakdown - ${selectedLeadForScore.name}`}
          size="lg"
        >
          <LeadScoreExplainer
            score={selectedLeadForScore.score}
            budgetRange={selectedLeadForScore.budgetRange}
            source={selectedLeadForScore.source}
            timeline={selectedLeadForScore.timeline}
            projectType={selectedLeadForScore.projectType}
            hasEmail={!!selectedLeadForScore.email}
            hasWhatsApp={false}
            hasMessage={!!selectedLeadForScore.message}
          />
        </Modal>
      )}
    </div>
  );
}
