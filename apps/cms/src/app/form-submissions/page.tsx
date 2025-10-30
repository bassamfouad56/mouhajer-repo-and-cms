'use client';

import { useState, useEffect } from 'react';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';
import EmptyState, { EmptyStateIcons } from '@/components/EmptyState';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { formatDistanceToNow } from 'date-fns';

interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, any>;
  locale: string;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  notes?: string;
  submittedAt: string;
  readAt?: string;
}

interface SubmissionStats {
  total: number;
  new: number;
  read: number;
  archived: number;
  spam: number;
}

export default function FormSubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch submissions on mount
  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/form-submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/form-submissions/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update submission status
  const updateSubmissionStatus = async (id: string, status: string, notes?: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) throw new Error('Failed to update submission');

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status, notes } : sub))
      );

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Failed to update submission');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete submission
  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete submission');

      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      setIsDetailModalOpen(false);
      fetchStats();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/form-submissions/${id}/read`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, status: 'read', readAt: new Date().toISOString() } : sub
        )
      );
      fetchStats();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Open submission details
  const openSubmissionDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);

    // Mark as read if it's new
    if (submission.status === 'new') {
      markAsRead(submission.id);
    }
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter((sub) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const dataString = JSON.stringify(sub.data).toLowerCase();
        if (!dataString.includes(query) && !sub.formName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && sub.status !== statusFilter) {
        return false;
      }

      // Form filter
      if (formFilter !== 'all' && sub.formId !== formFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'form':
          return a.formName.localeCompare(b.formName);
        default:
          return 0;
      }
    });

  // Get unique form names for filter
  const uniqueForms = Array.from(new Set(submissions.map((sub) => sub.formName)));

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Export submissions to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Form', 'Status', 'Data'];
    const rows = filteredSubmissions.map((sub) => [
      new Date(sub.submittedAt).toLocaleString(),
      sub.formName,
      sub.status,
      JSON.stringify(sub.data),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Submissions</h1>
        <p className="text-gray-600">View and manage all form submissions from your website</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-sm text-blue-600">New</div>
            <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Read</div>
            <div className="text-2xl font-bold text-gray-900">{stats.read}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="text-sm text-yellow-600">Archived</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.archived}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <div className="text-sm text-red-600">Spam</div>
            <div className="text-2xl font-bold text-red-900">{stats.spam}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search submissions..."
            />
          </div>

          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'new', label: 'New' },
              { value: 'read', label: 'Read' },
              { value: 'archived', label: 'Archived' },
              { value: 'spam', label: 'Spam' },
            ]}
          />

          <FilterDropdown
            label="Form"
            value={formFilter}
            onChange={setFormFilter}
            options={[
              { value: 'all', label: 'All Forms' },
              ...uniqueForms.map((form) => ({ value: form, label: form })),
            ]}
          />

          <FilterDropdown
            label="Sort"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'form', label: 'By Form' },
            ]}
          />

          <Button onClick={exportToCSV} variant="secondary">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <EmptyState
          icon={EmptyStateIcons.inbox}
          title="No submissions found"
          description={
            searchQuery || statusFilter !== 'all' || formFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Submissions from your forms will appear here'
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openSubmissionDetails(submission)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{new Date(submission.submittedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {submission.formName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {Object.entries(submission.data)
                      .slice(0, 2)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSubmissionDetails(submission);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submission Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Submission Details"
        size="large"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Form:</span>
                  <span className="ml-2 text-gray-900">{selectedSubmission.formName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Locale:</span>
                  <span className="ml-2 text-gray-900">{selectedSubmission.locale}</span>
                </div>
                {selectedSubmission.ipAddress && (
                  <div>
                    <span className="font-medium text-gray-700">IP Address:</span>
                    <span className="ml-2 text-gray-900">{selectedSubmission.ipAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Data */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Submitted Data</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Field
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(selectedSubmission.data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
              <textarea
                value={selectedSubmission.notes || ''}
                onChange={(e) =>
                  setSelectedSubmission({ ...selectedSubmission, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about this submission..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <div className="space-x-2">
                <Button
                  onClick={() =>
                    updateSubmissionStatus(
                      selectedSubmission.id,
                      'read',
                      selectedSubmission.notes
                    )
                  }
                  variant="secondary"
                  disabled={isUpdating}
                >
                  Mark as Read
                </Button>
                <Button
                  onClick={() =>
                    updateSubmissionStatus(
                      selectedSubmission.id,
                      'archived',
                      selectedSubmission.notes
                    )
                  }
                  variant="secondary"
                  disabled={isUpdating}
                >
                  Archive
                </Button>
                <Button
                  onClick={() =>
                    updateSubmissionStatus(
                      selectedSubmission.id,
                      'spam',
                      selectedSubmission.notes
                    )
                  }
                  variant="secondary"
                  disabled={isUpdating}
                >
                  Mark as Spam
                </Button>
              </div>
              <Button
                onClick={() => deleteSubmission(selectedSubmission.id)}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
