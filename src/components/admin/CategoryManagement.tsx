import React, { useState, useEffect, useMemo } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useFrontendData } from '../../context/FrontendDataContext';
import { MediaUpload } from './MediaUpload';
import { 
  Plus, Edit2, Trash2, X, Check, FolderTree, Folder, CornerDownRight, 
  RefreshCw, Search, Sparkles, Filter, AlertCircle, CheckCircle2, ChevronRight, Layers,
  Eye, EyeOff, Navigation, Radio, Image as ImageIcon, Tag
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const CategoryManagement: React.FC = () => {
  const { 
    categories, 
    loadCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    toggleCategoryNavbar,
    toggleCategoryTicker,
    isLoading 
  } = useAdminData();
  const { loadCategories: reloadFrontendCategories } = useFrontendData();

  const [togglingNavbar, setTogglingNavbar] = useState<number | null>(null);
  const [togglingTicker, setTogglingTicker] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedParentFilter, setSelectedParentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    bengali_name: '',
    image_url: '',
    badge: '',
    description: '',
    parent_id: null as number | null,
    show_in_navbar: 1,
    show_in_ticker: 1,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const parentCategories = useMemo(() => {
    return categories.filter((cat) => cat.parent_id === null);
  }, [categories]);

  // Group categories by parent ID
  const groupedCategories = useMemo(() => {
    const map = new Map<number | null, any[]>();
    categories.forEach(cat => {
      const pid = cat.parent_id;
      if (!map.has(pid)) {
        map.set(pid, []);
      }
      map.get(pid)!.push(cat);
    });
    return map;
  }, [categories]);

  // Filter categories according to search and parent selection
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((cat as any).bengali_name && (cat as any).bengali_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cat.parent_name && cat.parent_name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedParentFilter === 'all') return true;
      if (selectedParentFilter === 'parents_only') return cat.parent_id === null;
      if (selectedParentFilter === 'subcategories_only') return cat.parent_id !== null;
      if (selectedParentFilter === 'ticker_only') return (cat as any).show_in_ticker !== 0 && (cat as any).show_in_ticker !== false;
      
      // Filter by specific parent id
      const parentIdNum = parseInt(selectedParentFilter, 10);
      if (!isNaN(parentIdNum)) {
        return cat.parent_id === parentIdNum || cat.id === parentIdNum;
      }

      return true;
    });
  }, [categories, searchQuery, selectedParentFilter]);

  const handleSyncFrontendCategories = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=sync_categories`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadCategories();
        reloadFrontendCategories();
        setSyncStatus({
          type: 'success',
          message: data.message || `Successfully synced ${data.added || 0} categories & subcategories from storefront!`
        });
      } else {
        setSyncStatus({
          type: 'error',
          message: data.message || 'Failed to sync categories with server.'
        });
      }
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        message: err.message || 'Network error while synchronizing categories.'
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }
  };

  const handleOpenCreateForm = (preselectedParentId: number | null = null) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      bengali_name: '',
      image_url: '',
      badge: '',
      description: '',
      parent_id: preselectedParentId,
      show_in_navbar: 1,
      show_in_ticker: 1,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = editingCategory 
      ? await updateCategory(editingCategory.id, formData)
      : await createCategory(formData);
    
    if (success) {
      setIsEditing(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        bengali_name: '',
        image_url: '',
        badge: '',
        description: '',
        parent_id: null,
        show_in_navbar: 1,
        show_in_ticker: 1,
      });
      await loadCategories();
      reloadFrontendCategories();
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      bengali_name: category.bengali_name || '',
      image_url: category.image_url || '',
      badge: category.badge || '',
      description: category.description || '',
      parent_id: category.parent_id,
      show_in_navbar: category.show_in_navbar === 0 || category.show_in_navbar === false ? 0 : 1,
      show_in_ticker: category.show_in_ticker === 0 || category.show_in_ticker === false ? 0 : 1,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will become unassigned.')) {
      await deleteCategory(id);
      await loadCategories();
      reloadFrontendCategories();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      bengali_name: '',
      image_url: '',
      badge: '',
      description: '',
      parent_id: null,
      show_in_navbar: 1,
      show_in_ticker: 1,
    });
  };

  const handleToggleNavbar = async (id: number, currentVal?: boolean | number) => {
    setTogglingNavbar(id);
    const newVal = currentVal === 0 || currentVal === false ? true : false;
    await toggleCategoryNavbar(id, newVal);
    setTogglingNavbar(null);
    reloadFrontendCategories();
  };

  const handleToggleTicker = async (id: number, currentVal?: boolean | number) => {
    setTogglingTicker(id);
    const newVal = currentVal === 0 || currentVal === false ? true : false;
    await toggleCategoryTicker(id, newVal);
    setTogglingTicker(null);
    reloadFrontendCategories();
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 min-h-[300px]">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-3" />
        <p className="text-gray-500 font-medium">Loading catalog categories...</p>
      </div>
    );
  }

  const totalSubcategories = categories.filter(c => c.parent_id !== null).length;
  const navbarVisibleCount = categories.filter(c => c.parent_id === null && c.show_in_navbar !== 0 && c.show_in_navbar !== false).length;
  const tickerVisibleCount = categories.filter(c => (c as any).show_in_ticker !== 0 && (c as any).show_in_ticker !== false).length;

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Categories & Subcategories
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your store collections, home page ticker stories, and subcategories ({categories.length} total)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncFrontendCategories}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200/60 transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Import or update default categories, subcategories, Bengali names and photos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Auto-Sync Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateForm(null)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 transition animate-fadeIn ${
          syncStatus.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {syncStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{syncStatus.type === 'success' ? 'Sync Completed' : 'Sync Error'}</p>
            <p className="text-xs mt-0.5">{syncStatus.message}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setSyncStatus(null)}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Categories</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Sub-Categories</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{totalSubcategories}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex items-start gap-3">
          <div className="mt-0.5">
            <p className="text-xs text-gray-500 font-medium">Shown in Navbar</p>
            <p className="text-xl font-bold text-teal-600 mt-1">{navbarVisibleCount} / {parentCategories.length}</p>
          </div>
          <Navigation className="w-5 h-5 text-teal-500 ml-auto mt-0.5 shrink-0" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex items-start gap-3">
          <div className="mt-0.5">
            <p className="text-xs text-gray-500 font-medium">Home Page Ticker</p>
            <p className="text-xl font-bold text-purple-600 mt-1">{tickerVisibleCount}</p>
          </div>
          <Radio className="w-5 h-5 text-purple-500 ml-auto mt-0.5 shrink-0" />
        </div>
      </div>

      {/* Editing / Creating Form Modal/Card */}
      {isEditing && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category or Subcategory'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Categories appear in home page video ticker, website navbar, and shop filters
              </p>
            </div>
            <button 
              type="button"
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Essential Panjabi, Summer Polos..."
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bengali Name (বাংলা নাম)
                </label>
                <input
                  type="text"
                  value={formData.bengali_name}
                  onChange={(e) => setFormData({ ...formData, bengali_name: e.target.value })}
                  placeholder="e.g. পাঞ্জাবি, বেলওয়ারী শাড়ি, পোলো শার্ট..."
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition font-bengali"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Parent Category / Department
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value, 10) : null })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                >
                  <option value="">None (Top-Level Main Collection)</option>
                  {parentCategories
                    .filter((cat) => !editingCategory || cat.id !== editingCategory.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (Main Collection)
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Select a parent to make this a subcategory (e.g. "MEN", "WOMEN", "SUMMER")
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Badge Tag (Optional)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Trending, New, Handloom, Luxury..."
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Small pill tag shown on the circular ticker story
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition font-mono"
                />
              </div>
            </div>

            {/* Category Photo / Ticker Thumbnail */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Category / Ticker Photo (ছবি)
              </label>
              <MediaUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                accept="image"
                placeholder="https://images.unsplash.com/... or upload photo from device"
              />
              <p className="text-[11px] text-gray-400 mt-2">
                This image will appear inside the circular ticker on the homepage under the hero video. If blank, it will automatically use the latest product photo from this category.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this collection or department..."
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                rows={2}
              />
            </div>

            {/* Visibility checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={formData.show_in_ticker === 1}
                  onChange={(e) => setFormData({ ...formData, show_in_ticker: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-purple-600" />
                  Show in Home Page Ticker (ভিডিওর নিচে ক্যাটাগরি টিকারে দেখাবে)
                </span>
              </label>

              {formData.parent_id === null && (
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={formData.show_in_navbar === 1}
                    onChange={(e) => setFormData({ ...formData, show_in_navbar: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-teal-600" />
                    Show in Navbar Menu (ওয়েবসাইট মেনুতে দেখাবে)
                  </span>
                </label>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category, বাংলা নাম, or slug..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50/60 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-gray-400 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              selectedParentFilter === 'all'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('ticker_only')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
              selectedParentFilter === 'ticker_only'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Radio className="w-3 h-3" />
            Ticker ({tickerVisibleCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('parents_only')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              selectedParentFilter === 'parents_only'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Main ({parentCategories.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('subcategories_only')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              selectedParentFilter === 'subcategories_only'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Subcategories ({totalSubcategories})
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100 tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Category / Subcategory</th>
                <th className="py-3.5 px-5">Type / Hierarchy</th>
                <th className="py-3.5 px-5">Badge</th>
                <th className="py-3.5 px-5">Products</th>
                <th className="py-3.5 px-5 text-center">
                  <span className="inline-flex items-center gap-1" title="Show in homepage video ticker">
                    <Radio className="w-3.5 h-3.5 text-purple-600" /> Ticker
                  </span>
                </th>
                <th className="py-3.5 px-5 text-center">
                  <span className="inline-flex items-center gap-1" title="Show in top navbar">
                    <Navigation className="w-3.5 h-3.5 text-teal-600" /> Navbar
                  </span>
                </th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((category: any) => {
                const isParent = category.parent_id === null;
                const childCount = groupedCategories.get(category.id)?.length || 0;
                const isTickerOn = category.show_in_ticker !== 0 && category.show_in_ticker !== false;
                const isNavbarOn = category.show_in_navbar !== 0 && category.show_in_navbar !== false;
                const displayImg = category.image_url || category.product_fallback_image;

                return (
                  <tr key={category.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {!isParent && (
                          <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        )}
                        
                        {/* Circular Image Thumbnail */}
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                          {displayImg ? (
                            <img src={displayImg} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <Folder className={`w-4 h-4 ${isParent ? 'text-indigo-600' : 'text-amber-500'}`} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isParent ? 'text-gray-900 text-sm' : 'text-gray-800 text-xs'}`}>
                              {category.name}
                            </span>
                            {category.bengali_name && (
                              <span className="text-[11px] text-gray-500 font-bengali bg-gray-100 px-1.5 py-0.5 rounded">
                                {category.bengali_name}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono truncate max-w-xs mt-0.5">
                            /{category.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Hierarchy / Parent */}
                    <td className="py-3.5 px-5">
                      {isParent ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-[11px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                            Main Collection
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            ({childCount} subs)
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <span className="text-gray-400">Inside:</span>
                          <span className="font-semibold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                            {category.parent_name || 'Department'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Badge */}
                    <td className="py-3.5 px-5">
                      {category.badge ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-black text-white">
                          {category.badge}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Products Count */}
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        category.product_count > 0 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.product_count || 0}
                      </span>
                    </td>

                    {/* Home Page Ticker Toggle */}
                    <td className="py-3.5 px-5 text-center">
                      <button
                        type="button"
                        disabled={togglingTicker === category.id}
                        onClick={() => handleToggleTicker(category.id, category.show_in_ticker)}
                        title={isTickerOn ? 'Visible in Home Page Ticker — click to hide' : 'Hidden from Ticker — click to show'}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                          togglingTicker === category.id
                            ? 'opacity-50 cursor-not-allowed bg-gray-300'
                            : isTickerOn
                              ? 'bg-purple-600 hover:bg-purple-700'
                              : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                          isTickerOn ? 'translate-x-[18px]' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>

                    {/* Navbar Visibility Toggle */}
                    <td className="py-3.5 px-5 text-center">
                      {isParent ? (
                        <button
                          type="button"
                          disabled={togglingNavbar === category.id}
                          onClick={() => handleToggleNavbar(category.id, category.show_in_navbar)}
                          title={isNavbarOn ? 'Visible in Navbar — click to hide' : 'Hidden from Navbar — click to show'}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                            togglingNavbar === category.id
                              ? 'opacity-50 cursor-not-allowed bg-gray-300'
                              : isNavbarOn
                                ? 'bg-teal-500 hover:bg-teal-600'
                                : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            isNavbarOn ? 'translate-x-[18px]' : 'translate-x-0.5'
                          }`} />
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        {isParent && (
                          <button
                            type="button"
                            onClick={() => handleOpenCreateForm(category.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-lg transition mr-1 cursor-pointer"
                            title={`Add a subcategory inside ${category.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Sub</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                          title="Edit Category Details, Photo, or Bengali Name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};