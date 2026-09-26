import React, { useState, useEffect, useMemo } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { 
  Plus, Edit2, Trash2, X, Check, FolderTree, Folder, CornerDownRight, 
  RefreshCw, Search, Sparkles, Filter, AlertCircle, CheckCircle2, ChevronRight, Layers,
  Eye, EyeOff, Navigation
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const CategoryManagement: React.FC = () => {
  const { categories, loadCategories, createCategory, updateCategory, deleteCategory, toggleCategoryNavbar, isLoading } = useAdminData();
  const [togglingNavbar, setTogglingNavbar] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedParentFilter, setSelectedParentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: null as number | null,
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
        (cat.parent_name && cat.parent_name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedParentFilter === 'all') return true;
      if (selectedParentFilter === 'parents_only') return cat.parent_id === null;
      if (selectedParentFilter === 'subcategories_only') return cat.parent_id !== null;
      
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
      description: '',
      parent_id: preselectedParentId,
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
        description: '',
        parent_id: null,
      });
      await loadCategories();
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      parent_id: category.parent_id,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will become unassigned.')) {
      await deleteCategory(id);
      await loadCategories();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
    });
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading catalog categories...</p>
      </div>
    );
  }

  const totalSubcategories = categories.filter(c => c.parent_id !== null).length;
  const navbarVisibleCount = categories.filter(c => c.parent_id === null && c.show_in_navbar !== 0 && c.show_in_navbar !== false).length;

  const handleToggleNavbar = async (catId: number, currentValue: boolean | number | undefined) => {
    // Flip the current value
    const newShow = currentValue === 0 || currentValue === false ? true : false;
    setTogglingNavbar(catId);
    await toggleCategoryNavbar(catId, newShow);
    await loadCategories();
    setTogglingNavbar(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-gray-800" />
            Categories & Subcategories
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your store departments, menu collections, and subcategories ({categories.length} total)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncFrontendCategories}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-4 py-2.5 rounded-xl hover:from-purple-800 hover:to-indigo-800 transition shadow-sm font-medium text-sm disabled:opacity-50"
            title="Import all 7 main departments and 50+ subcategories from website navigation"
          >
            <Sparkles className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Auto-Sync Frontend Menu'}
          </button>

          {!isEditing && (
            <button
              type="button"
              onClick={() => handleOpenCreateForm(null)}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-fadeIn ${
          syncStatus.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {syncStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{syncStatus.message}</span>
        </div>
      )}

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Categories</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Main Collections</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{parentCategories.length}</p>
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
                Categories define customer navigation, filter menus, and catalog structure
              </p>
            </div>
            <button 
              type="button"
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category Name *
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
                  Select a parent to make this a subcategory (e.g. choose "MEN" to place inside Men's collection)
                </p>
              </div>
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
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category or subcategory name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Info */}
          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredCategories.length}</strong> of {categories.length} categories
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-gray-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              selectedParentFilter === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('parents_only')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              selectedParentFilter === 'parents_only'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Main Departments ({parentCategories.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedParentFilter('subcategories_only')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              selectedParentFilter === 'subcategories_only'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Subcategories ({totalSubcategories})
          </button>

          {/* Individual Parent Departments */}
          {parentCategories.map(p => {
            const childCount = groupedCategories.get(p.id)?.length || 0;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedParentFilter(p.id.toString())}
                className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1 ${
                  selectedParentFilter === p.id.toString()
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({childCount})</span>
              </button>
            );
          })}
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
                <th className="py-3.5 px-5">Slug</th>
                <th className="py-3.5 px-5">Products</th>
                <th className="py-3.5 px-5 text-center">
                  <span className="inline-flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" /> Navbar
                  </span>
                </th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((category) => {
                const isParent = category.parent_id === null;
                const childCount = groupedCategories.get(category.id)?.length || 0;

                return (
                  <tr key={category.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        {!isParent ? (
                          <>
                            <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 ml-4" />
                            <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                              <span className="font-semibold text-gray-800">{category.name}</span>
                              {category.description && (
                                <p className="text-xs text-gray-400 max-w-xs truncate mt-0.5">{category.description}</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <Folder className="w-4 h-4 text-indigo-600 shrink-0" />
                            <div>
                              <span className="font-bold text-gray-900">{category.name}</span>
                              {category.description && (
                                <p className="text-xs text-gray-400 max-w-xs truncate mt-0.5">{category.description}</p>
                              )}
                            </div>
                          </>
                        )}
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
                            ({childCount} subcategories)
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

                    {/* Slug */}
                    <td className="py-3.5 px-5 font-mono text-xs text-gray-500">
                      /{category.slug}
                    </td>

                    {/* Products Count */}
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        category.product_count > 0 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.product_count || 0} products
                      </span>
                    </td>

                    {/* Navbar Visibility Toggle — only for parent (main) categories */}
                    <td className="py-3.5 px-5 text-center">
                      {isParent ? (
                        <button
                          type="button"
                          disabled={togglingNavbar === category.id}
                          onClick={() => handleToggleNavbar(category.id, category.show_in_navbar)}
                          title={category.show_in_navbar === 0 || category.show_in_navbar === false ? 'Hidden from Navbar — click to show' : 'Visible in Navbar — click to hide'}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                            togglingNavbar === category.id
                              ? 'opacity-50 cursor-not-allowed bg-gray-300'
                              : category.show_in_navbar === 0 || category.show_in_navbar === false
                                ? 'bg-gray-300 hover:bg-gray-400'
                                : 'bg-teal-500 hover:bg-teal-600'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            category.show_in_navbar === 0 || category.show_in_navbar === false ? 'translate-x-0.5' : 'translate-x-[18px]'
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
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-lg transition mr-1"
                            title={`Add a subcategory inside ${category.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Sub</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
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

        {filteredCategories.length === 0 && (
          <div className="text-center py-16 px-4 text-gray-500">
            <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 text-base">No Categories Found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {searchQuery 
                ? `No categories match "${searchQuery}". Try a different keyword.`
                : 'Your database currently has no categories. Click "Auto-Sync Frontend Menu" above to automatically import all 50+ categories and subcategories.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleSyncFrontendCategories}
                disabled={isSyncing}
                className="mt-4 inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Import All Frontend Categories Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};