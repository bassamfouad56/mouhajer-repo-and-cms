'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Settings,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  X,
  Save,
  Layout,
  Image as ImageIcon,
  FileText,
  Component as ComponentIcon,
} from 'lucide-react';
import DynamicFormRenderer from './DynamicFormRenderer';

interface ContentBlueprint {
  id: string;
  name: string;
  displayName: string;
  description: string;
  blueprintType: 'DOCUMENT' | 'COMPONENT';
  allowMultiple: boolean;
  isSystem: boolean;
  icon: string;
  category: string;
  fields: any[];
}

interface BlueprintInstance {
  id: string;
  blueprintId: string;
  blueprint?: ContentBlueprint;
  dataEn: Record<string, any>;
  dataAr: Record<string, any>;
  status: string;
  order: number;
}

interface VisualBlockComposerProps {
  pageId: string;
  locale: 'EN' | 'AR';
  onSave?: (instances: BlueprintInstance[]) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  layout: Layout,
  media: ImageIcon,
  content: FileText,
  general: ComponentIcon,
};

export default function VisualBlockComposer({ pageId, locale, onSave }: VisualBlockComposerProps) {
  const [blueprints, setBlueprints] = useState<ContentBlueprint[]>([]);
  const [instances, setInstances] = useState<BlueprintInstance[]>([]);
  const [showPalette, setShowPalette] = useState(true);
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blueprints
  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const response = await fetch('/api/blueprints');
        const data = await response.json();

        // Check if response is valid array
        if (!response.ok || !Array.isArray(data)) {
          console.error('Failed to fetch blueprints:', data);
          setBlueprints([]);
          return;
        }

        // Only show COMPONENT blueprints
        setBlueprints(data.filter((b: ContentBlueprint) => b.blueprintType === 'COMPONENT'));
      } catch (error) {
        console.error('Error fetching blueprints:', error);
        setBlueprints([]);
      }
    };

    fetchBlueprints();
  }, []);

  // Fetch existing instances for this page
  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const response = await fetch(`/api/pages/${pageId}/components`);
        if (response.ok) {
          const data = await response.json();
          setInstances(data);
        }
      } catch (error) {
        console.error('Error fetching instances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstances();
  }, [pageId]);

  // Filter blueprints by category
  const filteredBlueprints =
    selectedCategory === 'all'
      ? blueprints
      : blueprints.filter((b) => b.category === selectedCategory);

  // Add new instance
  const addInstance = (blueprint: ContentBlueprint) => {
    const newInstance: BlueprintInstance = {
      id: `temp_${Date.now()}`,
      blueprintId: blueprint.id,
      blueprint,
      dataEn: {},
      dataAr: {},
      status: 'draft',
      order: instances.length,
    };
    setInstances([...instances, newInstance]);
    setEditingInstanceId(newInstance.id);
  };

  // Remove instance
  const removeInstance = (id: string) => {
    setInstances(instances.filter((i) => i.id !== id));
    if (editingInstanceId === id) {
      setEditingInstanceId(null);
    }
  };

  // Duplicate instance
  const duplicateInstance = (instance: BlueprintInstance) => {
    const duplicate: BlueprintInstance = {
      ...instance,
      id: `temp_${Date.now()}`,
      order: instances.length,
    };
    setInstances([...instances, duplicate]);
  };

  // Move instance up/down
  const moveInstance = (index: number, direction: 'up' | 'down') => {
    const newInstances = [...instances];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= instances.length) return;

    [newInstances[index], newInstances[targetIndex]] = [
      newInstances[targetIndex],
      newInstances[index],
    ];

    // Update order values
    newInstances.forEach((inst, idx) => {
      inst.order = idx;
    });

    setInstances(newInstances);
  };

  // Update instance data
  const updateInstanceData = (id: string, data: Record<string, any>) => {
    setInstances(
      instances.map((inst) =>
        inst.id === id
          ? {
              ...inst,
              ...(locale === 'EN' ? { dataEn: data } : { dataAr: data }),
            }
          : inst
      )
    );
  };

  // Save all instances
  const handleSave = async () => {
    onSave?.(instances);
    // TODO: API call to save instances
    console.log('Saving instances:', instances);
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'layout', label: 'Layout' },
    { value: 'media', label: 'Media' },
    { value: 'content', label: 'Content' },
    { value: 'general', label: 'General' },
  ];

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading components...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Main Canvas */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Page Components</h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                {instances.length} {instances.length === 1 ? 'component' : 'components'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                {showPalette ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPalette ? 'Hide' : 'Show'} Palette
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="p-6">
            {instances.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No components yet</h4>
                <p className="text-gray-600 mb-6">
                  Add components from the palette to start building your page
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {instances.map((instance, index) => {
                  const blueprint = instance.blueprint || blueprints.find((b) => b.id === instance.blueprintId);
                  const isEditing = editingInstanceId === instance.id;

                  if (!blueprint) return null;

                  const CategoryIcon = CATEGORY_ICONS[blueprint.category] || ComponentIcon;

                  return (
                    <div
                      key={instance.id}
                      className={`border rounded-lg transition-all ${
                        isEditing
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Instance Header */}
                      <div className="p-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{blueprint.displayName}</div>
                            <div className="text-xs text-gray-500">
                              {blueprint.category} • {blueprint.fields.length} fields
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveInstance(index, 'up')}
                            disabled={index === 0}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded hover:bg-white"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveInstance(index, 'down')}
                            disabled={index === instances.length - 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded hover:bg-white"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setEditingInstanceId(isEditing ? null : instance.id)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicateInstance(instance)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeInstance(instance.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Instance Editor */}
                      {isEditing && (
                        <div className="p-6 bg-white border-t border-gray-200">
                          <DynamicFormRenderer
                            fields={blueprint.fields}
                            initialData={locale === 'EN' ? instance.dataEn : instance.dataAr}
                            locale={locale}
                            onChange={(data) => updateInstanceData(instance.id, data)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blueprint Palette Sidebar */}
      {showPalette && (
        <div className="w-80 bg-white rounded-lg border border-gray-200 sticky top-6 h-fit max-h-[calc(100vh-120px)] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Components</h3>
              <button
                onClick={() => setShowPalette(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blueprint List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredBlueprints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ComponentIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No components in this category</p>
              </div>
            ) : (
              filteredBlueprints.map((blueprint) => {
                const CategoryIcon = CATEGORY_ICONS[blueprint.category] || ComponentIcon;

                return (
                  <button
                    key={blueprint.id}
                    onClick={() => addInstance(blueprint)}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 mb-1">
                          {blueprint.displayName}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {blueprint.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {blueprint.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {blueprint.fields.length} fields
                          </span>
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
