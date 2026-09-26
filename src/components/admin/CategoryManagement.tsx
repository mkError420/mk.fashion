import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Plus, Edit2, Trash2, X, Check, FolderTree, Folder, CornerDownRight } from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const { categories, loadCategories, createCategory, updateCategory, deleteCategory, isLoading } = useAdminData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: null as number | null,
  });

  useEffect(() => {
    loadCategories();
  }, []);

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
        description: '',
        parent_id: null,
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will become unassigned.')) {
      await deleteCategory(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parent_id: null,
    });
  };

  const parentCategories = categories.filter((cat) => cat.parent_id === null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-gray-700" />
            Category & Collection Management
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Organize catalog into parent departments and sub-categories ({categories.length} categories)
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Categories define storefront navigation and filter trees
              </p>
            </div>
            <button 
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
                  placeholder="e.g. Men's Panjabi, Summer Knitwear..."
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Parent Category
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                >
                  <option value="">None (Top-Level Category)</option>
                  {parentCategories
                    .filter((cat) => !editingCategory || cat.id !== editingCategory.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
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
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
              >
                <Check className="w-4 h-4" />
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100 tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Category Name</th>
                <th className="py-3.5 px-5">Slug</th>
                <th className="py-3.5 px-5">Parent Collection</th>
                <th className="py-3.5 px-5">Active Products</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      {category.parent_id ? (
                        <>
                          <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 ml-3" />
                          <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-semibold text-gray-800">{category.name}</span>
                        </>
                      ) : (
                        <>
                          <Folder className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-bold text-gray-900">{category.name}</span>
                          <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                            Main
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-gray-500">
                    /{category.slug}
                  </td>
                  <td className="py-3.5 px-5">
                    {category.parent_name ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        {category.parent_name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">— (Root)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {category.product_count} items
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="text-center py-14 px-4 text-gray-500">
            <FolderTree className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No Categories Found</p>
            <p className="text-xs text-gray-400 mt-1">Create categories to organize your clothing & accessories.</p>
          </div>
        )}
      </div>
    </div>
  );
};