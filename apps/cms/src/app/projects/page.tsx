'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAutoTranslate } from '@/lib/hooks/useAutoTranslate';
import MediaPicker from '@/components/MediaPicker';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';
import EmptyState, { EmptyStateIcons } from '@/components/EmptyState';
import Button from '@/components/Button';

interface Project {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const { autoTranslate, setAutoTranslate, translate } = useAutoTranslate();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [formData, setFormData] = useState<{
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    category: string;
    featured: boolean;
    images: string[];
  }>({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    category: '',
    featured: false,
    images: [],
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Check for action=new query param to open modal
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleNewProject();
    }
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      featured: project.featured,
      images: project.images,
    });
    setIsModalOpen(true);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setFormData({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      category: '',
      featured: false,
      images: [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProjects(projects.filter(p => p.id !== id));
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  const handleSubmitProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const projectData = {
      ...formData,
    };

    try {
      if (selectedProject) {
        // Update existing project
        const response = await fetch(`/api/projects/${selectedProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });

        if (response.ok) {
          const updatedProject = await response.json();
          setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
          setIsModalOpen(false);
        } else {
          alert('Failed to update project');
        }
      } else {
        // Create new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });

        if (response.ok) {
          const newProject = await response.json();
          setProjects([newProject, ...projects]);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to create project');
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.title.ar.includes(searchQuery) ||
        project.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Featured filter
    if (featuredFilter === 'featured') {
      filtered = filtered.filter(project => project.featured);
    } else if (featuredFilter === 'not-featured') {
      filtered = filtered.filter(project => !project.featured);
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.en.localeCompare(b.title.en));
    }

    return filtered;
  }, [projects, searchQuery, featuredFilter, sortBy]);

  const featuredOptions: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Featured Only', value: 'featured' },
    { label: 'Not Featured', value: 'not-featured' }
  ];

  const sortOptions: FilterOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name (A-Z)', value: 'name' }
  ];

  return (
    <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your portfolio projects and showcase your work.
                </p>
              </div>
              <button
                onClick={handleNewProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Project
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search projects by title, description, or category..."
                  />
                </div>
                <div className="flex gap-3">
                  <FilterDropdown
                    label="Featured"
                    options={featuredOptions}
                    value={featuredFilter}
                    onChange={setFeaturedFilter}
                  />
                  <FilterDropdown
                    label="Sort"
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                  />
                </div>
              </div>
              {(searchQuery || featuredFilter !== 'all') && (
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span>Showing {filteredProjects.length} of {projects.length} projects</span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFeaturedFilter('all');
                      setSortBy('newest');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Projects Grid */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Projects ({filteredProjects.length})</h3>
              </div>

              {isLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading projects...</p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <EmptyState
                  icon={projects.length === 0 ? EmptyStateIcons.noProjects : EmptyStateIcons.noResults}
                  title={projects.length === 0 ? 'No projects' : 'No projects found'}
                  description={
                    projects.length === 0
                      ? 'Get started by creating a new project.'
                      : 'Try adjusting your search or filters.'
                  }
                  action={
                    projects.length === 0 ? (
                      <Button onClick={handleNewProject}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Your First Project
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Desktop/Tablet Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {project.title.en}
                            </h4>
                            {project.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 truncate">{project.description.en}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>Category: {project.category}</span>
                            <span>Images: {project.images.length}</span>
                            <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => router.push(`/projects/${project.id}/handoff`)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm font-medium px-3 py-1.5 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            title="Submit to Marketing"
                          >
                            📋 Handoff
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card Layout */}
                      <div className="sm:hidden space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-medium text-gray-900">
                              {project.title.en}
                            </h4>
                            {project.featured && (
                              <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description.en}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-700">Category:</span> {project.category}
                          </div>
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-700">Images:</span> {project.images.length}
                          </div>
                          <div className="col-span-2 text-gray-500">
                            <span className="font-medium text-gray-700">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => router.push(`/projects/${project.id}/handoff`)}
                            className="flex-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                          >
                            📋 Handoff
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="flex-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* Modal for Create/Edit Project */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedProject ? 'Edit Project' : 'New Project'}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoTranslate}
                        onChange={(e) => setAutoTranslate(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Auto-translate</span>
                    </label>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmitProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                      <input
                        type="text"
                        required
                        value={formData.title.en}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            title: { ...prev.title, en: value }
                          }));
                          translate('title', value, 'en', (translated: string) => {
                            setFormData(prev => ({
                              ...prev,
                              title: { ...prev.title, ar: translated }
                            }));
                          });
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Project title in English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title (Arabic)</label>
                      <input
                        type="text"
                        required
                        value={formData.title.ar}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            title: { ...prev.title, ar: value }
                          }));
                          translate('title', value, 'ar', (translated: string) => {
                            setFormData(prev => ({
                              ...prev,
                              title: { ...prev.title, en: translated }
                            }));
                          });
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="عنوان المشروع بالعربية"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                      <textarea
                        rows={3}
                        required
                        value={formData.description.en}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            description: { ...prev.description, en: value }
                          }));
                          translate('description', value, 'en', (translated: string) => {
                            setFormData(prev => ({
                              ...prev,
                              description: { ...prev.description, ar: translated }
                            }));
                          });
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Project description in English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
                      <textarea
                        rows={3}
                        required
                        value={formData.description.ar}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            description: { ...prev.description, ar: value }
                          }));
                          translate('description', value, 'ar', (translated: string) => {
                            setFormData(prev => ({
                              ...prev,
                              description: { ...prev.description, en: translated }
                            }));
                          });
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="وصف المشروع بالعربية"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select category</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Retail">Retail</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured Project</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

                    {/* Selected Images Display */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Project image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index)
                                }));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Select Images Button */}
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formData.images.length > 0 ? 'Add More Images' : 'Select Images from Media Library'}
                    </button>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                    >
                      {isSaving ? 'Saving...' : (selectedProject ? 'Update Project' : 'Create Project')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Media Picker Modal */}
        {showMediaPicker && (
          <MediaPicker
            onSelect={(files) => {
              const selectedUrls = Array.isArray(files)
                ? files.map(f => f.url)
                : [files.url];
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...selectedUrls]
              }));
              setShowMediaPicker(false);
            }}
            onClose={() => setShowMediaPicker(false)}
            multiple={true}
            fileType="image"
          />
        )}
    </div>
  );
}