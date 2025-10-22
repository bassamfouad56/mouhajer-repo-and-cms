'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectHandoffForm from '@/components/ProjectHandoffForm';

export default function ProjectHandoffPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [project, setProject] = useState<any>(null);
  const [existingHandoff, setExistingHandoff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch project details
      const projectRes = await fetch(`/api/projects/${id}`);
      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProject(projectData);
      }

      // Fetch existing handoff
      const handoffRes = await fetch(`/api/projects/${id}/handoff`);
      if (handoffRes.ok) {
        const handoffData = await handoffRes.json();
        setExistingHandoff(handoffData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const method = existingHandoff ? 'PATCH' : 'POST';
      const url = `/api/projects/${id}/handoff`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const savedHandoff = await response.json();
        setExistingHandoff(savedHandoff);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save handoff');
      }
    } catch (error) {
      console.error('Error saving handoff:', error);
      alert('Error saving handoff');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const method = existingHandoff ? 'PATCH' : 'POST';
      const url = `/api/projects/${id}/handoff`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: 'submitted' }),
      });

      if (response.ok) {
        alert('Handoff submitted successfully to marketing team!');
        router.push('/projects');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit handoff');
      }
    } catch (error) {
      console.error('Error submitting handoff:', error);
      alert('Error submitting handoff');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading project data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Project not found</p>
            <button
              onClick={() => router.push('/projects')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/projects')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-flex items-center"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Marketing Handoff: {project.title.en}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete this form to provide the marketing team with all the information they need to promote this project effectively.
          </p>
          {existingHandoff && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Status: {existingHandoff.status.toUpperCase()}
              {existingHandoff.status === 'submitted' && ' - Awaiting Marketing Approval'}
              {existingHandoff.status === 'approved' && ' - Approved ✓'}
            </div>
          )}
        </div>

        {/* Form */}
        <ProjectHandoffForm
          projectId={id}
          projectTitle={project.title}
          existingHandoff={existingHandoff}
          onSave={handleSave}
          onSubmit={handleSubmit}
        />

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            💾 Saving...
          </div>
        )}
      </div>
    </div>
  );
}
