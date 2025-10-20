'use client';

import { useState, useEffect } from 'react';
import SearchInput from '@/components/SearchInput';
import EmptyState, { EmptyStateIcons } from '@/components/EmptyState';
import Button from '@/components/Button';
import DealFormModal from '@/components/CRM/DealFormModal';

interface Deal {
  id: string;
  titleEn: string;
  titleAr: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate?: string;
  contactId: string;
  companyId?: string;
  projectType: string;
  createdAt: string;
  updatedAt: string;
}

interface PipelineStats {
  totalDeals: number;
  totalValue: number;
  averageDealSize: number;
  stageBreakdown: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
}

const PIPELINE_STAGES = [
  { id: 'initial_consultation', name: 'Initial Consultation', color: 'bg-blue-50 border-blue-200' },
  { id: 'site_visit', name: 'Site Visit', color: 'bg-purple-50 border-purple-200' },
  { id: 'design_proposal', name: 'Design Proposal', color: 'bg-indigo-50 border-indigo-200' },
  { id: 'quotation', name: 'Quotation', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-50 border-orange-200' },
  { id: 'contract_sent', name: 'Contract Sent', color: 'bg-pink-50 border-pink-200' },
  { id: 'contract_signed', name: 'Contract Signed', color: 'bg-green-50 border-green-200' },
  { id: 'won', name: 'Won', color: 'bg-emerald-50 border-emerald-200' },
  { id: 'lost', name: 'Lost', color: 'bg-red-50 border-red-200' },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDeals();
    fetchStats();
  }, []);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetDeals {
              deals {
                deals {
                  id
                  titleEn
                  titleAr
                  stage
                  value
                  probability
                  expectedCloseDate
                  contactId
                  companyId
                  projectType
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
        setDeals(data.deals.deals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
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
            query GetPipelineStats {
              pipelineStats {
                totalDeals
                totalValue
                averageDealSize
                stageBreakdown {
                  stage
                  count
                  value
                }
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setStats(data.pipelineStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleNewDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (formData: any) => {
    try {
      setIsSaving(true);
      const mutation = selectedDeal ? 'updateDeal' : 'createDeal';
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ${mutation === 'createDeal' ? 'CreateDeal' : 'UpdateDeal'}($id: ID, $input: ${mutation === 'createDeal' ? 'CreateDealInput' : 'UpdateDealInput'}!) {
              ${mutation}(${mutation === 'updateDeal' ? 'id: $id, ' : ''}input: $input) {
                id
                titleEn
                stage
              }
            }
          `,
          variables: {
            ...(selectedDeal && { id: selectedDeal.id }),
            input: formData,
          },
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchDeals();
        fetchStats();
      } else {
        const error = await response.json();
        alert(error.errors?.[0]?.message || 'Failed to save deal');
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Error saving deal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDealStageChange = async (dealId: string, newStage: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation UpdateDeal($id: ID!, $input: UpdateDealInput!) {
              updateDeal(id: $id, input: $input) {
                id
                stage
                probability
              }
            }
          `,
          variables: {
            id: dealId,
            input: { stage: newStage },
          },
        }),
      });

      if (response.ok) {
        fetchDeals();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating deal stage:', error);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const title = deal.titleEn.toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  const dealsByStage = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    deals: filteredDeals.filter((deal) => deal.stage === stage.id),
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Track deals through your sales process</p>
          </div>
          <Button onClick={handleNewDeal}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Deals</div>
                <div className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDeals}</div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600">Total Pipeline Value</div>
                <div className="text-3xl font-bold text-green-900 mt-1">{formatCurrency(stats.totalValue)}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg shadow p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600">Average Deal Size</div>
                <div className="text-3xl font-bold text-purple-900 mt-1">{formatCurrency(stats.averageDealSize)}</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search deals by title..."
        />
      </div>

      {/* Kanban Board */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealsByStage.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              {/* Stage Header */}
              <div className={`rounded-t-lg border-2 ${stage.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stage.deals.length} deal{stage.deals.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {stats && stats.stageBreakdown.find(s => s.stage === stage.id) && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(stats.stageBreakdown.find(s => s.stage === stage.id)?.value || 0)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Cards */}
              <div className={`border-2 border-t-0 ${stage.color.replace('bg-', 'border-').replace('-50', '-200')} rounded-b-lg p-4 space-y-3 min-h-[400px]`}>
                {stage.deals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    No deals in this stage
                  </div>
                ) : (
                  stage.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-move"
                    >
                      {/* Deal Title */}
                      <h4 className="font-semibold text-gray-900 mb-2">{deal.titleEn}</h4>

                      {/* Deal Value */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(deal.value)}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {deal.probability}% probability
                        </span>
                      </div>

                      {/* Project Type */}
                      <div className="mb-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {deal.projectType.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Expected Close Date */}
                      {deal.expectedCloseDate && (
                        <div className="text-sm text-gray-600 mb-3">
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(deal.expectedCloseDate)}
                        </div>
                      )}

                      {/* Stage Change Buttons */}
                      <div className="flex gap-2">
                        {stage.id !== 'initial_consultation' && (
                          <button
                            onClick={() => {
                              const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                              if (currentIndex > 0) {
                                handleDealStageChange(deal.id, PIPELINE_STAGES[currentIndex - 1].id);
                              }
                            }}
                            className="flex-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                          >
                            ← Previous
                          </button>
                        )}
                        {stage.id !== 'won' && stage.id !== 'lost' && (
                          <button
                            onClick={() => {
                              const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                              if (currentIndex < PIPELINE_STAGES.length - 1) {
                                handleDealStageChange(deal.id, PIPELINE_STAGES[currentIndex + 1].id);
                              }
                            }}
                            className="flex-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                          >
                            Next →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Breakdown Stats */}
      {stats && stats.stageBreakdown.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pipeline Breakdown</h2>
          <div className="space-y-3">
            {stats.stageBreakdown.map((breakdown) => {
              const stage = PIPELINE_STAGES.find(s => s.id === breakdown.stage);
              return (
                <div key={breakdown.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${stage?.color.replace('bg-', 'bg-').replace('-50', '-400')}`} />
                    <span className="font-medium text-gray-900">{stage?.name || breakdown.stage}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-600">
                      {breakdown.count} deal{breakdown.count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 w-32 text-right">
                      {formatCurrency(breakdown.value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deal Form Modal */}
      <DealFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        deal={selectedDeal}
        isSaving={isSaving}
      />
    </div>
  );
}
