import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Plus, Edit2, Trash2, X, Check, Tag, Ticket, Percent, DollarSign, Calendar } from 'lucide-react';

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
      description: promocode.description || '',
      discount_type: promocode.discount_type,
      discount_value: promocode.discount_value,
      minimum_order_value: promocode.minimum_order_value,
      maximum_discount: promocode.maximum_discount,
      usage_limit: promocode.usage_limit,
      is_active: Boolean(promocode.is_active),
      start_date: promocode.start_date ? promocode.start_date.substring(0, 16) : '',
      end_date: promocode.end_date ? promocode.end_date.substring(0, 16) : '',
      applicable_categories: promocode.applicable_categories || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotional coupon code?')) {
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
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading coupons & promocodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-gray-700" />
            Promo Codes & Discounts
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure coupons, percentage discounts, minimum thresholds, and usage caps ({promocodes.length} coupons)
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Promo Code
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {editingPromocode ? `Edit Promo Code: ${editingPromocode.code}` : 'Create New Promotional Code'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Shoppers apply this code during checkout for instant discounts
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
                  Coupon Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    placeholder="e.g. EID2026, SUMMER10"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm font-mono font-bold tracking-wider uppercase transition"
                    required
                  />
                  <Tag className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Discount Type *
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                >
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="fixed">Fixed Amount Off (৳ BDT)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Discount Value ({formData.discount_type === 'percentage' ? '%' : '৳'}) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                  placeholder="10"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Min. Order Value (৳)
                </label>
                <input
                  type="number"
                  value={formData.minimum_order_value}
                  onChange={(e) => setFormData({ ...formData, minimum_order_value: parseFloat(e.target.value) || 0 })}
                  placeholder="0 (no minimum)"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Max. Discount Cap (৳)
                </label>
                <input
                  type="number"
                  value={formData.maximum_discount || ''}
                  onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usage_limit || ''}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Empty = Unlimited"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Description / Internal Note
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. 10% Eid festival discount for all orders above 1500৳..."
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="promocode_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label htmlFor="promocode_active" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                Promo Code is Active & Redeemable
              </label>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm"
              >
                <Check className="w-4 h-4" />
                {editingPromocode ? 'Update Promo Code' : 'Save Promo Code'}
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

      {/* Promocodes Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100 tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Coupon Code</th>
                <th className="py-3.5 px-5">Discount</th>
                <th className="py-3.5 px-5">Min. Order</th>
                <th className="py-3.5 px-5">Max Cap</th>
                <th className="py-3.5 px-5">Redemptions</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promocodes.map((promocode) => (
                <tr key={promocode.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-gray-900 text-white px-2.5 py-1 rounded-md tracking-wider">
                        {promocode.code}
                      </span>
                    </div>
                    {promocode.description && (
                      <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">{promocode.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-gray-900">
                    <span className="inline-flex items-center gap-1">
                      {promocode.discount_type === 'percentage' ? (
                        <>
                          <Percent className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{promocode.discount_value}% OFF</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>৳{Number(promocode.discount_value).toLocaleString()} OFF</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-gray-700">
                    {promocode.minimum_order_value > 0 ? `৳${Number(promocode.minimum_order_value).toLocaleString()}` : 'None'}
                  </td>
                  <td className="py-3.5 px-5 text-gray-700">
                    {promocode.maximum_discount ? `৳${Number(promocode.maximum_discount).toLocaleString()}` : 'No Limit'}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {promocode.usage_limit ? `${promocode.used_count || 0} / ${promocode.usage_limit}` : `${promocode.used_count || 0} (Unlimited)`}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      promocode.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${promocode.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {promocode.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(promocode)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        title="Edit Promo Code"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promocode.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Promo Code"
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
        {promocodes.length === 0 && (
          <div className="text-center py-14 px-4 text-gray-500">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No Promo Codes Active</p>
            <p className="text-xs text-gray-400 mt-1">Create promo codes to run promotional discounts and boost sales.</p>
          </div>
        )}
      </div>
    </div>
  );
};