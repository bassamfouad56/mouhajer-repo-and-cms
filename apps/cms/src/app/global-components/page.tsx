'use client';

import React, { useState, useEffect } from 'react';
import LanguageToggle from '@/components/LanguageToggle';

interface GlobalComponent {
  id: string;
  type: string;
  displayName: string;
  dataEn: any;
  dataAr: any;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GlobalComponentsPage() {
  const [components, setComponents] = useState<GlobalComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<GlobalComponent | null>(null);
  const [viewLanguage, setViewLanguage] = useState<'EN' | 'AR'>('EN');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/global-components');
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      }
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComponentSelect = (component: GlobalComponent) => {
    setSelectedComponent(component);
    setEditData(viewLanguage === 'EN' ? component.dataEn : component.dataAr);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!selectedComponent) return;

    try {
      const updateData: any = {
        id: selectedComponent.id,
      };

      if (viewLanguage === 'EN') {
        updateData.dataEn = editData;
      } else {
        updateData.dataAr = editData;
      }

      const response = await fetch('/api/global-components', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('✅ Component updated successfully!');
        fetchComponents();
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to update component:', error);
      alert('❌ Failed to update component');
    }
  };

  const handleToggleEnabled = async (component: GlobalComponent) => {
    try {
      const response = await fetch('/api/global-components', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: component.id,
          enabled: !component.enabled,
        }),
      });

      if (response.ok) {
        fetchComponents();
      }
    } catch (error) {
      console.error('Failed to toggle component:', error);
    }
  };

  const componentIcons: { [key: string]: string } = {
    navbar: '🧭',
    footer: '🦶',
    sidebar: '📑',
    announcement: '📢',
  };

  const renderComponentEditor = () => {
    if (!selectedComponent) return null;

    const data = viewLanguage === 'EN' ? selectedComponent.dataEn : selectedComponent.dataAr;

    if (selectedComponent.type === 'navbar') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="text"
              value={editData.logo || ''}
              onChange={(e) => setEditData({ ...editData, logo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Links</label>
            <div className="space-y-2">
              {editData.links?.map((link: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...editData.links];
                      newLinks[index].label = e.target.value;
                      setEditData({ ...editData, links: newLinks });
                    }}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={!editMode}
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const newLinks = [...editData.links];
                      newLinks[index].href = e.target.value;
                      setEditData({ ...editData, links: newLinks });
                    }}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={!editMode}
                  />
                  {editMode && (
                    <button
                      onClick={() => {
                        const newLinks = editData.links.filter((_: any, i: number) => i !== index);
                        setEditData({ ...editData, links: newLinks });
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => {
                    const newLinks = [...(editData.links || []), { label: '', href: '' }];
                    setEditData({ ...editData, links: newLinks });
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Link
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (selectedComponent.type === 'footer') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
            <input
              type="text"
              value={editData.copyright || ''}
              onChange={(e) => setEditData({ ...editData, copyright: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Footer Columns</label>
            <div className="space-y-4">
              {editData.columns?.map((column: any, colIndex: number) => (
                <div key={colIndex} className="border border-gray-200 p-4 rounded-lg">
                  <input
                    type="text"
                    value={column.title}
                    onChange={(e) => {
                      const newColumns = [...editData.columns];
                      newColumns[colIndex].title = e.target.value;
                      setEditData({ ...editData, columns: newColumns });
                    }}
                    placeholder="Column Title"
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
                    disabled={!editMode}
                  />
                  {column.links?.map((link: any, linkIndex: number) => (
                    <div key={linkIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newColumns = [...editData.columns];
                          newColumns[colIndex].links[linkIndex].label = e.target.value;
                          setEditData({ ...editData, columns: newColumns });
                        }}
                        placeholder="Label"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={!editMode}
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const newColumns = [...editData.columns];
                          newColumns[colIndex].links[linkIndex].href = e.target.value;
                          setEditData({ ...editData, columns: newColumns });
                        }}
                        placeholder="URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={!editMode}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Generic JSON editor for other component types
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Component Data (JSON)</label>
        <textarea
          value={JSON.stringify(editData, null, 2)}
          onChange={(e) => {
            try {
              setEditData(JSON.parse(e.target.value));
            } catch (error) {
              // Invalid JSON, ignore
            }
          }}
          className="w-full h-96 px-4 py-2 font-mono text-sm border border-gray-300 rounded-lg"
          disabled={!editMode}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-sm border-r overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Components</h2>

          <div className="space-y-2">
            {components.map((component) => (
              <div
                key={component.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedComponent?.id === component.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleComponentSelect(component)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{componentIcons[component.type] || '📦'}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{component.displayName}</h3>
                      <p className="text-sm text-gray-500">{component.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEnabled(component);
                    }}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      component.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {component.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedComponent ? (
          <div className="max-w-4xl mx-auto p-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-3xl">{componentIcons[selectedComponent.type] || '📦'}</span>
                    {selectedComponent.displayName}
                  </h1>
                  <p className="text-gray-600 mt-1">Type: {selectedComponent.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <LanguageToggle
                    currentLanguage={viewLanguage}
                    onChange={(lang) => {
                      setViewLanguage(lang);
                      setEditData(lang === 'EN' ? selectedComponent.dataEn : selectedComponent.dataAr);
                    }}
                    variant="pill"
                  />
                  {!editMode ? (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setEditData(viewLanguage === 'EN' ? selectedComponent.dataEn : selectedComponent.dataAr);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setEditData(viewLanguage === 'EN' ? selectedComponent.dataEn : selectedComponent.dataAr);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Component Configuration ({viewLanguage})
              </h2>
              {renderComponentEditor()}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Select a component to edit</h3>
              <p className="text-gray-600 mt-1">Choose from the sidebar to configure global components</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}