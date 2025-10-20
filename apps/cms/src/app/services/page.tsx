'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';

interface Service {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  shortDescription: { en: string; ar: string };
  icon: string;
  images: string[];
  features: { en: string[]; ar: string[] };
  price: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchServices();
  }, []);

  // Check for action=new query param to open modal
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleNewService();
    }
  }, [searchParams]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setServiceImages(service.images || []);
    setIsModalOpen(true);
  };

  const handleNewService = () => {
    setSelectedService(null);
    setServiceImages([]);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setServices(services.filter(s => s.id !== id));
        } else {
          alert('Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service');
      }
    }
  };

  const handleSubmitService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    const serviceData = {
      title: {
        en: formData.get('title_en') as string,
        ar: formData.get('title_ar') as string,
      },
      description: {
        en: formData.get('description_en') as string,
        ar: formData.get('description_ar') as string,
      },
      shortDescription: {
        en: formData.get('short_description_en') as string,
        ar: formData.get('short_description_ar') as string,
      },
      icon: formData.get('icon') as string,
      images: serviceImages,
      price: formData.get('price') as string,
      featured: formData.get('featured') === 'on',
      features: {
        en: (formData.get('features_en') as string).split('\n').filter(f => f.trim()),
        ar: (formData.get('features_ar') as string).split('\n').filter(f => f.trim()),
      },
    };

    try {
      if (selectedService) {
        // Update existing service
        const response = await fetch(`/api/services/${selectedService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });

        if (response.ok) {
          const updatedService = await response.json();
          setServices(services.map(s => s.id === selectedService.id ? updatedService : s));
          setIsModalOpen(false);
        } else {
          alert('Failed to update service');
        }
      } else {
        // Create new service
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });

        if (response.ok) {
          const newService = await response.json();
          setServices([newService, ...services]);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to create service');
        }
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter and search services
  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.title.ar.includes(searchQuery) ||
        service.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDescription.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Featured filter
    if (featuredFilter === 'featured') {
      filtered = filtered.filter(service => service.featured);
    } else if (featuredFilter === 'not-featured') {
      filtered = filtered.filter(service => !service.featured);
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
  }, [services, searchQuery, featuredFilter, sortBy]);

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
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your service offerings and pricing.
                </p>
              </div>
              <button
                onClick={handleNewService}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Service
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search services by title or description..."
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
                  <span>Showing {filteredServices.length} of {services.length} services</span>
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

            {/* Services Grid */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Services ({filteredServices.length})</h3>
              </div>

              {isLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading services...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {services.length === 0 ? 'No services' : 'No services found'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {services.length === 0
                      ? 'Get started by creating a new service.'
                      : 'Try adjusting your search or filters.'}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleNewService}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      New Service
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Desktop/Tablet Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {service.title.en}
                            </h4>
                            {service.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 truncate">{service.shortDescription.en}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>Price: {service.price}</span>
                            <span>Features: {service.features.en.length}</span>
                            <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
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
                              {service.title.en}
                            </h4>
                            {service.featured && (
                              <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{service.shortDescription.en}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-700">Price:</span> {service.price}
                          </div>
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-700">Features:</span> {service.features.en.length}
                          </div>
                          <div className="col-span-2 text-gray-500">
                            <span className="font-medium text-gray-700">Created:</span> {new Date(service.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="flex-1 text-blue-600 hover:bg-blue-50 border border-blue-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="flex-1 text-red-600 hover:bg-red-50 border border-red-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
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

        {/* Modal for Create/Edit Service */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedService ? 'Edit Service' : 'New Service'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitService} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                      <input
                        name="title_en"
                        type="text"
                        defaultValue={selectedService?.title.en}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Service title in English"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title (Arabic)</label>
                      <input
                        name="title_ar"
                        type="text"
                        defaultValue={selectedService?.title.ar}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="عنوان الخدمة بالعربية"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Short Description (English)</label>
                      <input
                        name="short_description_en"
                        type="text"
                        defaultValue={selectedService?.shortDescription.en}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief service description"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Short Description (Arabic)</label>
                      <input
                        name="short_description_ar"
                        type="text"
                        defaultValue={selectedService?.shortDescription.ar}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="وصف مختصر للخدمة"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                      <textarea
                        name="description_en"
                        rows={4}
                        defaultValue={selectedService?.description.en}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed service description in English"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
                      <textarea
                        name="description_ar"
                        rows={4}
                        defaultValue={selectedService?.description.ar}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="وصف مفصل للخدمة بالعربية"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Icon</label>
                      <select
                        name="icon"
                        defaultValue={selectedService?.icon}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select icon</option>
                        <option value="design">Design</option>
                        <option value="renovation">Renovation</option>
                        <option value="consultation">Consultation</option>
                        <option value="planning">Planning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        name="price"
                        type="text"
                        defaultValue={selectedService?.price}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Starting from AED 5,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center pt-6">
                        <input
                          name="featured"
                          type="checkbox"
                          defaultChecked={selectedService?.featured}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured Service</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Images</label>

                    {/* Selected Images Display */}
                    {serviceImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {serviceImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Service image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setServiceImages(prev => prev.filter((_, i) => i !== index));
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
                      {serviceImages.length > 0 ? 'Add More Images' : 'Select Images from Media Library'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Features (English)</label>
                      <textarea
                        name="features_en"
                        rows={4}
                        defaultValue={selectedService?.features.en.join('\n')}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter features, one per line"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter each feature on a new line</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Features (Arabic)</label>
                      <textarea
                        name="features_ar"
                        rows={4}
                        defaultValue={selectedService?.features.ar.join('\n')}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="أدخل الميزات، واحدة في كل سطر"
                      />
                      <p className="mt-1 text-xs text-gray-500">أدخل كل ميزة في سطر جديد</p>
                    </div>
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
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center"
                    >
                      {isSaving && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      )}
                      {isSaving ? 'Saving...' : (selectedService ? 'Update Service' : 'Create Service')}
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
          setServiceImages(prev => [...prev, ...selectedUrls]);
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