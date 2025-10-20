'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';

interface NavItem {
  id: string;
  labelEn: string;
  labelAr: string;
  url: string | null;
  type: 'link' | 'dropdown' | 'mega_menu';
  icon: string | null;
  target: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  cssClass: string | null;
  badge: string | null;
  badgeColor: string | null;
  description: string | null;
  megaMenuColumns: number | null;
  megaMenuImage: string | null;
  requiresAuth: boolean;
  requiredRoles: string[];
  children?: NavItem[];
}

export default function NavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    labelEn: '',
    labelAr: '',
    url: '',
    type: 'link' as 'link' | 'dropdown' | 'mega_menu',
    icon: '',
    target: '_self',
    parentId: '',
    order: 0,
    isActive: true,
    openInNewTab: false,
    cssClass: '',
    badge: '',
    badgeColor: '',
    description: '',
    megaMenuColumns: '',
    megaMenuImage: '',
    requiresAuth: false,
    requiredRoles: [] as string[]
  });

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/navigation');
      if (!response.ok) throw new Error('Failed to fetch navigation items');
      const data = await response.json();
      setNavItems(data);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      setError('Failed to load navigation items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      labelEn: '',
      labelAr: '',
      url: '',
      type: 'link',
      icon: '',
      target: '_self',
      parentId: '',
      order: navItems.length,
      isActive: true,
      openInNewTab: false,
      cssClass: '',
      badge: '',
      badgeColor: '',
      description: '',
      megaMenuColumns: '',
      megaMenuImage: '',
      requiresAuth: false,
      requiredRoles: []
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    setFormData({
      labelEn: item.labelEn,
      labelAr: item.labelAr,
      url: item.url || '',
      type: item.type,
      icon: item.icon || '',
      target: item.target,
      parentId: item.parentId || '',
      order: item.order,
      isActive: item.isActive,
      openInNewTab: item.openInNewTab,
      cssClass: item.cssClass || '',
      badge: item.badge || '',
      badgeColor: item.badgeColor || '',
      description: item.description || '',
      megaMenuColumns: item.megaMenuColumns?.toString() || '',
      megaMenuImage: item.megaMenuImage || '',
      requiresAuth: item.requiresAuth,
      requiredRoles: item.requiredRoles
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');

      // Validate
      if (!formData.labelEn || !formData.labelAr) {
        setError('English and Arabic labels are required');
        return;
      }

      if (formData.type === 'link' && !formData.url) {
        setError('URL is required for link type');
        return;
      }

      const payload = {
        labelEn: formData.labelEn,
        labelAr: formData.labelAr,
        url: formData.url || null,
        type: formData.type,
        icon: formData.icon || null,
        target: formData.target,
        parentId: formData.parentId || null,
        order: formData.order,
        isActive: formData.isActive,
        openInNewTab: formData.openInNewTab,
        cssClass: formData.cssClass || null,
        badge: formData.badge || null,
        badgeColor: formData.badgeColor || null,
        description: formData.description || null,
        megaMenuColumns: formData.megaMenuColumns ? parseInt(formData.megaMenuColumns) : null,
        megaMenuImage: formData.megaMenuImage || null,
        requiresAuth: formData.requiresAuth,
        requiredRoles: formData.requiredRoles
      };

      if (editingItem) {
        // Update existing
        const response = await fetch(`/api/navigation/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update navigation item');
      } else {
        // Create new
        const response = await fetch('/api/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to create navigation item');
      }

      setIsModalOpen(false);
      fetchNavItems();
    } catch (error) {
      console.error('Error saving navigation item:', error);
      setError('Failed to save navigation item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item? All child items will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/navigation/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete navigation item');
      fetchNavItems();
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      setError('Failed to delete navigation item');
    }
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const indent = level * 32;

    return (
      <div key={item.id}>
        <div
          className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
          style={{ paddingLeft: `${indent + 16}px` }}
        >
          <div className="flex items-center space-x-4 flex-1">
            {level > 0 && (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{item.labelEn}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{item.labelAr}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded ${item.badgeColor || 'bg-blue-100 text-blue-800'}`}>
                    {item.badge}
                  </span>
                )}
                {!item.isActive && (
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Type: {item.type} {item.url && `• URL: ${item.url}`}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {item.children && item.children.length > 0 && (
          <div>
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Navigation Menu</h1>
          <p className="text-gray-600 mt-1">Manage your website navigation structure</p>
        </div>
        <Button onClick={handleCreate}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Navigation Item
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : navItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No navigation items</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new navigation item.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {navItems.map(item => renderNavItem(item))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Navigation Item' : 'Create Navigation Item'}
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Label (English)"
              name="labelEn"
              value={formData.labelEn}
              onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
              required
            />
            <FormInput
              label="Label (Arabic)"
              name="labelAr"
              value={formData.labelAr}
              onChange={(e) => setFormData({ ...formData, labelAr: e.target.value })}
              required
            />
          </div>

          <FormInput
            type="select"
            label="Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'link' | 'dropdown' | 'mega_menu' })}
            required
          >
            <option value="link">Link</option>
            <option value="dropdown">Dropdown</option>
            <option value="mega_menu">Mega Menu</option>
          </FormInput>

          {formData.type === 'link' && (
            <FormInput
              label="URL"
              name="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required={formData.type === 'link'}
              helperText="Full URL or relative path (e.g., /about or https://example.com)"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Icon"
              name="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              helperText="Icon name or URL"
            />
            <FormInput
              type="select"
              label="Target"
              name="target"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            >
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </FormInput>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Badge Text"
              name="badge"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              helperText="e.g., 'New', 'Hot'"
            />
            <FormInput
              label="Badge Color"
              name="badgeColor"
              value={formData.badgeColor}
              onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
              helperText="CSS class for badge color"
            />
          </div>

          <FormInput
            label="Order"
            type="text"
            name="order"
            value={formData.order.toString()}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            helperText="Lower numbers appear first"
          />

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.requiresAuth}
                onChange={(e) => setFormData({ ...formData, requiresAuth: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Requires Authentication</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
