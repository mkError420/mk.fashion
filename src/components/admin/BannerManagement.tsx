import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, ExternalLink, Calendar } from 'lucide-react';

export const BannerManagement: React.FC = () => {
  const { banners, loadBanners, createBanner, updateBanner, deleteBanner, isLoading } = useAdminData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: 0,
    is_active: true,
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = editingBanner 
      ? await updateBanner(editingBanner.id, formData)
      : await createBanner(formData);
    
    if (success) {
      setIsEditing(false);
      setEditingBanner(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        position: 0,
        is_active: true,
        start_date: '',
        end_date: '',
      });
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData(banner);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      await deleteBanner(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      position: 0,
      is_active: true,
      start_date: '',
      end_date: '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gray-700" />
            Banners & Hero Sliders
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage homepage heroes, seasonal sales announcements, and promo banners ({banners.length} total)
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Banner
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Create New Promotional Banner'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Set banner images, destination links, schedule, and display order
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
                  Banner Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Eid Mega Collection 2026"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sort Order / Position
                </label>
                <input
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Description / Subtitle
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional promotional tagline shown on the banner..."
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Redirect Link URL
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="/shop/summer or https://..."
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
            </div>

            {formData.image_url && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60">
                <span className="text-xs font-medium text-gray-500 block mb-2">Live Image Preview:</span>
                <div className="h-36 w-full rounded-lg overflow-hidden bg-gray-200 relative">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="banner_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label htmlFor="banner_active" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                Active on Storefront
              </label>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
              >
                <Check className="w-4 h-4" />
                {editingBanner ? 'Save Changes' : 'Create Banner'}
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

      {/* Banner Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100 tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Preview</th>
                <th className="py-3.5 px-5">Title & Subtitle</th>
                <th className="py-3.5 px-5">Position</th>
                <th className="py-3.5 px-5">Link</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img 
                        src={banner.image_url} 
                        alt={banner.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x80?text=No+Image';
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-5 max-w-xs">
                    <p className="font-semibold text-gray-900 truncate">{banner.title}</p>
                    {banner.description && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{banner.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                      #{banner.position}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 max-w-[180px] truncate text-xs text-gray-500">
                    {banner.link_url ? (
                      <span className="inline-flex items-center gap-1 hover:text-gray-900">
                        <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{banner.link_url}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      banner.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${banner.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Banner"
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
        {banners.length === 0 && (
          <div className="text-center py-14 px-4 text-gray-500">
            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No Banners Configured</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add New Banner" above to publish your first banner.</p>
          </div>
        )}
      </div>
    </div>
  );
};