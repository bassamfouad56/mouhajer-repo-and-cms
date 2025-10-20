'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';
import RichTextEditor from '@/components/RichTextEditor';

interface BlogPost {
  id: string;
  title: { en: string; ar: string };
  slug: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Rich text editor state
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Check for action=new query param to open modal
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleNewPost();
    }
  }, [searchParams]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFeaturedImage(post.featuredImage || '');
    setContentEn(post.content.en || '');
    setContentAr(post.content.ar || '');
    setIsModalOpen(true);
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setFeaturedImage('');
    setContentEn('');
    setContentAr('');
    setIsModalOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setBlogPosts(blogPosts.filter(p => p.id !== id));
        } else {
          alert('Failed to delete blog post');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Error deleting blog post');
      }
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmitPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    const titleEn = formData.get('title_en') as string;
    const titleAr = formData.get('title_ar') as string;

    const postData = {
      title: {
        en: titleEn,
        ar: titleAr,
      },
      slug: {
        en: formData.get('slug_en') as string || generateSlug(titleEn),
        ar: formData.get('slug_ar') as string || generateSlug(titleAr),
      },
      excerpt: {
        en: formData.get('excerpt_en') as string,
        ar: formData.get('excerpt_ar') as string,
      },
      content: {
        en: contentEn,
        ar: contentAr,
      },
      category: formData.get('category') as string,
      author: formData.get('author') as string,
      status: formData.get('status') as 'draft' | 'published',
      featured: formData.get('featured') === 'on',
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag),
      featuredImage: featuredImage,
    };

    try {
      if (selectedPost) {
        // Update existing post
        const response = await fetch(`/api/blog/${selectedPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          const updatedPost = await response.json();
          setBlogPosts(blogPosts.map(p => p.id === selectedPost.id ? updatedPost : p));
          setIsModalOpen(false);
        } else {
          alert('Failed to update blog post');
        }
      } else {
        // Create new post
        const response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          const newPost = await response.json();
          setBlogPosts([newPost, ...blogPosts]);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to create blog post');
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter and search blog posts
  const filteredPosts = useMemo(() => {
    let filtered = [...blogPosts];

    // Status filter (existing filter)
    if (filter === 'published') {
      filtered = filtered.filter(post => post.status === 'published');
    } else if (filter === 'draft') {
      filtered = filtered.filter(post => post.status === 'draft');
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title.ar.includes(searchQuery) ||
        post.excerpt.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.en.localeCompare(b.title.en));
    }

    return filtered;
  }, [blogPosts, filter, searchQuery, sortBy]);

  const statusOptions: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' }
  ];

  const sortOptions: FilterOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Title (A-Z)', value: 'title' }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Published</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your blog content and articles.
                </p>
              </div>
              <button
                onClick={handleNewPost}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Blog Post
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by title, category, or tags..."
                  />
                </div>
                <div className="flex gap-3">
                  <FilterDropdown
                    label="Status"
                    options={statusOptions}
                    value={filter}
                    onChange={(value) => setFilter(value as 'all' | 'published' | 'draft')}
                  />
                  <FilterDropdown
                    label="Sort"
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                  />
                </div>
              </div>
              {(searchQuery || filter !== 'all') && (
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span>Showing {filteredPosts.length} of {blogPosts.length} posts</span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                      setSortBy('newest');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Blog Posts Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {filter === 'all' ? 'All Posts' : filter === 'published' ? 'Published Posts' : 'Draft Posts'} ({filteredPosts.length})
                </h3>
              </div>

              {isLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading blog posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleNewPost}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      New Blog Post
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Desktop/Tablet Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {post.title.en}
                            </h4>
                            {getStatusBadge(post.status)}
                            {post.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 truncate">{post.excerpt.en}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>Category: {post.category}</span>
                            <span>Author: {post.author}</span>
                            {post.status === 'published' && (
                              <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                            )}
                            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
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
                              {post.title.en}
                            </h4>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              {getStatusBadge(post.status)}
                              {post.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt.en}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-700">Category:</span> {post.category}
                          </div>
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-700">Author:</span> {post.author}
                          </div>
                          {post.status === 'published' && (
                            <div className="col-span-2 text-gray-500">
                              <span className="font-medium text-gray-700">Published:</span> {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                          )}
                          <div className="col-span-2 text-gray-500">
                            <span className="font-medium text-gray-700">Created:</span> {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="flex-1 text-blue-600 hover:bg-blue-50 border border-blue-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
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

        {/* Modal for Create/Edit Blog Post */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedPost ? 'Edit Blog Post' : 'New Blog Post'}
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

                <form onSubmit={handleSubmitPost} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                      <input
                        name="title_en"
                        type="text"
                        defaultValue={selectedPost?.title.en}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Blog post title in English"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title (Arabic)</label>
                      <input
                        name="title_ar"
                        type="text"
                        defaultValue={selectedPost?.title.ar}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="عنوان المقال بالعربية"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug (English)</label>
                      <input
                        name="slug_en"
                        type="text"
                        defaultValue={selectedPost?.slug.en}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="blog-post-url-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug (Arabic)</label>
                      <input
                        name="slug_ar"
                        type="text"
                        defaultValue={selectedPost?.slug.ar}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="رابط-المقال-بالعربية"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Excerpt (English)</label>
                      <textarea
                        name="excerpt_en"
                        rows={3}
                        defaultValue={selectedPost?.excerpt.en}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the blog post"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Excerpt (Arabic)</label>
                      <textarea
                        name="excerpt_ar"
                        rows={3}
                        defaultValue={selectedPost?.excerpt.ar}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="وصف مختصر للمقال"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content (English)</label>
                      <RichTextEditor
                        content={contentEn}
                        onChange={setContentEn}
                        placeholder="Start writing your blog post in English..."
                        dir="ltr"
                        onImageUpload={() => setShowMediaPicker(true)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content (Arabic)</label>
                      <RichTextEditor
                        content={contentAr}
                        onChange={setContentAr}
                        placeholder="ابدأ كتابة مقالتك بالعربية..."
                        dir="rtl"
                        onImageUpload={() => setShowMediaPicker(true)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <input
                        name="category"
                        type="text"
                        defaultValue={selectedPost?.category}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Design Trends"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Author</label>
                      <input
                        name="author"
                        type="text"
                        defaultValue={selectedPost?.author}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Author name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        defaultValue={selectedPost?.status}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center pt-6">
                        <input
                          name="featured"
                          type="checkbox"
                          defaultChecked={selectedPost?.featured}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured Post</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <input
                      name="tags"
                      type="text"
                      defaultValue={selectedPost?.tags.join(', ')}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="interior design, trends, 2024 (comma separated)"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>

                    {/* Selected Image Display */}
                    {featuredImage && (
                      <div className="relative mb-3 max-w-md">
                        <img
                          src={featuredImage}
                          alt="Featured"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFeaturedImage('')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Select Image Button */}
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {featuredImage ? 'Change Featured Image' : 'Select Featured Image from Media Library'}
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
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center"
                    >
                      {isSaving && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      )}
                      {isSaving ? 'Saving...' : (selectedPost ? 'Update Post' : 'Create Post')}
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
          const selectedFile = Array.isArray(files) ? files[0] : files;
          setFeaturedImage(selectedFile.url);
          setShowMediaPicker(false);
        }}
        onClose={() => setShowMediaPicker(false)}
        multiple={false}
        fileType="image"
      />
    )}
    </div>
  );
}