import React, { useState, useEffect, useCallback } from 'react';
import {
  PenLine, Plus, Trash2, Eye, EyeOff, Save, X, RefreshCw,
  Calendar, User, Tag, Image as ImageIcon, BookOpen, CheckCircle2, AlertCircle
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  category: string;
  tags: string;
  is_published: number;
  views: number;
  published_at: string | null;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

const EMPTY_POST: Omit<BlogPost, 'id' | 'slug' | 'views' | 'published_at' | 'created_at'> = {
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author: 'Admin',
  category: '',
  tags: '',
  is_published: 0,
};

export const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=blogs`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setPosts(data.posts || []);
      else setError(data.message || 'Failed to load posts');
    } catch {
      setError('Network error loading blog posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleNew = () => {
    setEditingPost({ ...EMPTY_POST });
    setIsNew(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNew(false);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingPost(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingPost?.title?.trim()) { setError('Title is required'); return; }
    setIsSaving(true);
    setError('');
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=blog`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(isNew ? 'Post created!' : 'Post updated!');
        setEditingPost(null);
        setIsNew(false);
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Save failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=blog`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, is_published: post.is_published ? 0 : 1 }),
      });
      const data = await res.json();
      if (data.success) fetchPosts();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=blog&id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        fetchPosts();
        setSuccess('Post deleted');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch { /* ignore */ }
  };

  const fmtDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // ── EDITOR PANEL ──────────────────────────────────────────────────────────────
  if (editingPost !== null) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PenLine className="w-5 h-5 text-indigo-600" />
            {isNew ? 'New Blog Post' : 'Edit Blog Post'}
          </h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Post Title *
            </label>
            <input
              type="text"
              value={editingPost.title || ''}
              onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
              placeholder="Enter blog post title..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Cover Image + Author + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Cover Image URL
              </label>
              <input
                type="text"
                value={editingPost.cover_image || ''}
                onChange={e => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
              {editingPost.cover_image && (
                <img src={editingPost.cover_image} alt="Cover preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200" />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Author
                </label>
                <input
                  type="text"
                  value={editingPost.author || ''}
                  onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Category</label>
                <input
                  type="text"
                  value={editingPost.category || ''}
                  onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                  placeholder="Style, Fashion..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags (comma-separated)
            </label>
            <input
              type="text"
              value={editingPost.tags || ''}
              onChange={e => setEditingPost({ ...editingPost, tags: e.target.value })}
              placeholder="fashion, style, panjabi, eid"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Short Excerpt</label>
            <textarea
              rows={2}
              value={editingPost.excerpt || ''}
              onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
              placeholder="Brief summary shown in the blog list..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Content (HTML supported)
            </label>
            <textarea
              rows={14}
              value={editingPost.content || ''}
              onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
              placeholder="Write your full blog post content here. You can use HTML tags like <h2>, <p>, <strong>, <ul>, <li>, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
            />
            <p className="text-[11px] text-gray-400 mt-1">Tip: HTML is supported — use &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;img&gt;, &lt;ul&gt; etc.</p>
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-800">Publish Status</p>
              <p className="text-xs text-gray-500">{editingPost.is_published ? 'Live on website' : 'Draft — not visible to visitors'}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingPost({ ...editingPost, is_published: editingPost.is_published ? 0 : 1 })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editingPost.is_published ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editingPost.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
          <button onClick={handleCancel} className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── POST LIST ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Blog Manager
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Create and manage blog posts that appear on your website</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPosts} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No blog posts yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Click "New Post" to create your first article</p>
          <button onClick={handleNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
              {/* Cover thumbnail */}
              {post.cover_image ? (
                <img src={post.cover_image} alt={post.title} className="w-20 h-16 object-cover rounded-lg border border-gray-100 shrink-0" />
              ) : (
                <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{post.title}</h3>
                    {post.excerpt && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.excerpt}</p>}
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                  {post.category && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{post.category}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(post.published_at || post.created_at)}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views} views</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleTogglePublish(post)}
                  title={post.is_published ? 'Unpublish' : 'Publish'}
                  className={`p-2 rounded-lg border transition-colors ${post.is_published ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                >
                  {post.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <PenLine className="w-3.5 h-3.5" />
                </button>
                {deleteConfirm === post.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(post.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
