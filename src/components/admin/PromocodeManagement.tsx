import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';

export const PromocodeManagement: React.FC = () => {
  const { promocodes, loadPromocodes, createPromocode, updatePromocode, deletePromocode, isLoading } = useAdminData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPromocode, setEditingPromocode] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    minimum_order_value: 0,
    maximum_discount: null as number | null,
    usage_limit: null as number | null,
    is_active: true,
    start_date: '',
    end_date: '',
    applicable_categories: '' as string,
  });

  useEffect(() => {
    loadPromocodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = editingPromocode 
      ? await updatePromocode(editingPromocode.id, formData)
      : await createPromocode(formData);
    
    if (success) {
      setIsEditing(false);
      setEditingPromocode(null);
      setFormData({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        minimum_order_value: 0,
        maximum_discount: null,
        usage_limit: null,
        is_active: true,
        start_date: '',
        end_date: '',
        applicable_categories: '',
      });
    }
  };

  const handleEdit = (promocode: any) => {
    setEditingPromocode(promocode);
    setFormData({
      code: promocode.code,
      description: promocode.description,
      discount_type: promocode.discount_type,
      discount_value: promocode.discount_value,
      minimum_order_value: promocode.minimum_order_value,
      maximum_discount: promocode.maximum_discount,
      usage_limit: promocode.usage_limit,
      is_active: promocode.is_active,
      start_date: promocode.start_date,
      end_date: promocode.end_date,
      applicable_categories: promocode.applicable_categories,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this promocode?')) {
      await deletePromocode(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPromocode(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      minimum_order_value: 0,
      maximum_discount: null,
      usage_limit: null,
      is_active: true,
      start_date: '',
      end_date: '',
      applicable_categories: '',
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading promocodes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Promocode Management</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Add Promocode
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            {editingPromocode ? 'Edit Promocode' : 'Add New Promocode'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value ({formData.discount_type === 'percentage' ? '%' : '৳'})
                </label>
                <input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (৳)</label>
                <input
                  type="number"
                  value={formData.minimum_order_value}
                  onChange={(e) => setFormData({ ...formData, minimum_order_value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount (৳)</label>
                <input
                  type="number"
                  value={formData.maximum_discount || ''}
                  onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usage_limit || ''}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={2}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                {editingPromocode ? 'Update Promocode' : 'Create Promocode'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Code</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Discount</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Min Order</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Usage</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promocodes.map((promocode) => (
              <tr key={promocode.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono font-bold">{promocode.code}</td>
                <td className="py-3 px-4">
                  {promocode.discount_type === 'percentage' 
                    ? `${promocode.discount_value}%` 
                    : `৳${promocode.discount_value}`}
                </td>
                <td className="py-3 px-4">৳{promocode.minimum_order_value}</td>
                <td className="py-3 px-4">
                  {promocode.usage_limit ? `${promocode.used_count}/${promocode.usage_limit}` : 'Unlimited'}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    promocode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {promocode.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEdit(promocode)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promocode.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promocodes.length === 0 && (
          <div className="text-center py-8 text-gray-500">No promocodes found</div>
        )}
      </div>
    </div>
  );
};