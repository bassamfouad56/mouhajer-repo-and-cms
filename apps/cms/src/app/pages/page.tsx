/**
 * Pages Management Interface
 * Manage all CMS pages and their content blocks
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Page } from '@/lib/db';
import PageBuilder from '@/components/PageBuilder';

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
  };

  const handlePageUpdate = async (pageId: string, updates: Partial<Page>) => {
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedPage = await response.json();
        setPages(pages.map(p => p.id === pageId ? updatedPage : p));
        setSelectedPage(updatedPage);
      }
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const handleStatusToggle = async (page: Page) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    await handlePageUpdate(page.id, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pages Management</h1>
                <p className="text-sm text-gray-500">Manage your website pages and content</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              New Page
            </button>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Pages List Sidebar */}
        <aside className="w-80 bg-white shadow-sm min-h-screen border-r">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pages ({pages.length})
            </h2>
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPage?.id === page.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageSelect(page)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {page.title.en}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {page.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {page.description.en}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{page.blocks.length} blocks</span>
                    <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Page Editor */}
        <main className="flex-1 p-6">
          {selectedPage ? (
            <PageBuilder
              page={selectedPage}
              onUpdate={handlePageUpdate}
              onStatusToggle={handleStatusToggle}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a page to edit
              </h3>
              <p className="text-gray-600">
                Choose a page from the sidebar to view and edit its content blocks.
              </p>
            </div>
          )}
        </main>
          </div>
  </div>
  );
}
