'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';

export default function MarketingHandoffsPage() {
  const router = useRouter();
  const [handoffs, setHandoffs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHandoff, setSelectedHandoff] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchHandoffs();
  }, [statusFilter]);

  const fetchHandoffs = async () => {
    try {
      const url = statusFilter === 'all'
        ? '/api/marketing/handoffs'
        : `/api/marketing/handoffs?status=${statusFilter}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setHandoffs(data);
      }
    } catch (error) {
      console.error('Error fetching handoffs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (handoffId: string, projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/handoff`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchHandoffs();
        alert(`Handoff ${newStatus === 'approved' ? 'approved' : 'updated'} successfully!`);
      }
    } catch (error) {
      console.error('Error updating handoff:', error);
      alert('Failed to update handoff');
    }
  };

  const filteredHandoffs = handoffs.filter(handoff =>
    !searchQuery ||
    handoff.project?.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    handoff.project?.title.ar.includes(searchQuery) ||
    handoff.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusOptions: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Approved', value: 'approved' },
    { label: 'Published', value: 'published' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      submitted: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      approved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      published: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Marketing Handoffs</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review and approve project handoffs from the engineering team.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search handoffs by project name, client..."
              />
            </div>
            <div>
              <FilterDropdown
                label="Status"
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>
          {searchQuery && (
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Showing {filteredHandoffs.length} of {handoffs.length} handoffs</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Handoffs List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              All Handoffs ({filteredHandoffs.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading handoffs...</p>
            </div>
          ) : filteredHandoffs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No handoffs found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHandoffs.map((handoff) => (
                <div key={handoff.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {handoff.project?.title.en || 'Untitled Project'}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(handoff.status)}`}>
                          {handoff.status.toUpperCase()}
                        </span>
                        {handoff.clientRating && (
                          <span className="text-yellow-500">
                            {'⭐'.repeat(handoff.clientRating)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {handoff.clientName && (
                          <div>
                            <span className="font-medium">Client:</span> {handoff.clientName}
                          </div>
                        )}
                        {handoff.completionDate && (
                          <div>
                            <span className="font-medium">Completed:</span>{' '}
                            {new Date(handoff.completionDate).toLocaleDateString()}
                          </div>
                        )}
                        {handoff.budgetRange && (
                          <div>
                            <span className="font-medium">Budget:</span> {handoff.budgetRange}
                          </div>
                        )}
                        {handoff.squareFootage && (
                          <div>
                            <span className="font-medium">Size:</span> {handoff.squareFootage}
                          </div>
                        )}
                      </div>

                      {handoff.designConceptEn && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {handoff.designConceptEn}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {handoff.targetKeywords?.slice(0, 3).map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            #{keyword}
                          </span>
                        ))}
                        {handoff.targetKeywords?.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{handoff.targetKeywords.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedHandoff(handoff);
                          setShowDetails(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      >
                        View Details
                      </button>

                      {handoff.status === 'submitted' && (
                        <button
                          onClick={() => handleStatusChange(handoff.id, handoff.projectId, 'approved')}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                        >
                          Approve
                        </button>
                      )}

                      {handoff.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(handoff.id, handoff.projectId, 'published')}
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                        >
                          Mark Published
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedHandoff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedHandoff.project?.title.en}
                  </h2>
                  <span className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedHandoff.status)}`}>
                    {selectedHandoff.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedHandoff.completionDate && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Completion Date:</span>
                        <p className="text-gray-600 dark:text-gray-400">{new Date(selectedHandoff.completionDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedHandoff.duration && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                        <p className="text-gray-600 dark:text-gray-400">{selectedHandoff.duration}</p>
                      </div>
                    )}
                    {selectedHandoff.squareFootage && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Square Footage:</span>
                        <p className="text-gray-600 dark:text-gray-400">{selectedHandoff.squareFootage}</p>
                      </div>
                    )}
                    {selectedHandoff.numberOfRooms && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Rooms:</span>
                        <p className="text-gray-600 dark:text-gray-400">{selectedHandoff.numberOfRooms}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Information */}
                {(selectedHandoff.clientName || selectedHandoff.clientTestimonialEn) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Client Information</h3>
                    {selectedHandoff.clientName && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">Client:</span> {selectedHandoff.clientName}
                        {selectedHandoff.clientCompany && ` (${selectedHandoff.clientCompany})`}
                      </p>
                    )}
                    {selectedHandoff.clientTestimonialEn && (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300">
                        "{selectedHandoff.clientTestimonialEn}"
                      </blockquote>
                    )}
                    {selectedHandoff.clientRating && (
                      <p className="mt-2 text-yellow-500">
                        {'⭐'.repeat(selectedHandoff.clientRating)}
                      </p>
                    )}
                  </div>
                )}

                {/* Design Story */}
                {selectedHandoff.designConceptEn && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Design Concept</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedHandoff.designConceptEn}</p>
                  </div>
                )}

                {/* Marketing Assets */}
                {(selectedHandoff.beforePhotos?.length > 0 || selectedHandoff.videoLinks?.length > 0) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Marketing Assets</h3>
                    {selectedHandoff.beforePhotos?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before Photos:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedHandoff.beforePhotos.map((url: string, index: number) => (
                            <img key={index} src={url} alt="Before" className="w-full h-24 object-cover rounded" />
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedHandoff.videoLinks?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Links:</p>
                        {selectedHandoff.videoLinks.map((link: string, index: number) => (
                          <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            {link}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Keywords */}
                {selectedHandoff.targetKeywords?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Target Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHandoff.targetKeywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                {selectedHandoff.status === 'submitted' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedHandoff.id, selectedHandoff.projectId, 'approved');
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Handoff
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
