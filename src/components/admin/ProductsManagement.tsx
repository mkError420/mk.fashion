import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Edit2, Trash2, RefreshCw, X, Package,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Star, AlertTriangle
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

interface Product {
  id: number;
  name: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  category_name?: string;
  category_id?: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  sku?: string;
  description?: string;
  created_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  compare_price: number | string;
  sku: string;
  stock_quantity: number | string;
  category_id: number | string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: '', description: '', price: '', compare_price: '',
  sku: '', stock_quantity: '', category_id: '',
  image_url: '', is_active: true, is_featured: false,
};

export const ProductsManagement: React.FC = () => {
  const { categories, loadCategories } = useAdminData();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const LIMIT = 20;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=products&limit=${LIMIT}&offset=${page * LIMIT}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { loadProducts(); loadCategories(); }, [loadProducts]);

  const openCreate = () => { setEditingProduct(null); setFormData(EMPTY_FORM); setIsFormOpen(true); setSaveMessage(''); };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, description: p.description || '', price: p.price,
      compare_price: p.compare_price || '', sku: p.sku || '',
      stock_quantity: p.stock_quantity, category_id: p.category_id || '',
      image_url: p.image_url || '', is_active: p.is_active, is_featured: p.is_featured,
    });
    setIsFormOpen(true);
    setSaveMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      const payload = { ...formData, price: Number(formData.price), compare_price: formData.compare_price ? Number(formData.compare_price) : null, stock_quantity: Number(formData.stock_quantity), category_id: formData.category_id ? Number(formData.category_id) : null };
      const url = `${API_BASE_URL}/admin_dashboard.php?action=product`;
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct ? { ...payload, id: editingProduct.id } : payload),
      });
      if (res.ok) {
        setSaveMessage('Product saved successfully!');
        setTimeout(() => { setIsFormOpen(false); setSaveMessage(''); setFormData(EMPTY_FORM); setEditingProduct(null); }, 1000);
        await loadProducts();
      } else {
        const err = await res.json();
        setSaveMessage(err.message || 'Failed to save');
      }
    } catch { setSaveMessage('Network error'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product&id=${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { setProducts(prev => prev.filter(p => p.id !== id)); }
    } catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  const handleToggle = async (product: Product, field: 'is_active' | 'is_featured') => {
    const updated = { ...product, [field]: !product[field] };
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    try {
      await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, name: product.name, price: product.price, stock_quantity: product.stock_quantity, is_active: updated.is_active, is_featured: updated.is_featured }),
      });
    } catch { setProducts(prev => prev.map(p => p.id === product.id ? product : p)); }
  };

  const filtered = products.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.category_name || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product Management</h3>
          <p className="text-sm text-gray-500">{products.length} products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadProducts} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-200 transition text-sm font-medium">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search products, SKU, category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'SKU', 'Price', 'Stock', 'Category', 'Active', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No products found</p>
                </td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{product.sku || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">৳{(product.price || 0).toLocaleString()}</div>
                    {product.compare_price && <div className="text-xs text-gray-400 line-through">৳{product.compare_price.toLocaleString()}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${product.stock_quantity <= 5 ? 'bg-red-100 text-red-700' : product.stock_quantity <= 15 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock_quantity <= 5 && <AlertTriangle className="w-3 h-3" />}
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{product.category_name || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(product, 'is_active')} className={`transition ${product.is_active ? 'text-emerald-500' : 'text-gray-300'}`}>
                      {product.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(product, 'is_featured')} className={`transition ${product.is_featured ? 'text-amber-400' : 'text-gray-300'}`}>
                      <Star className="w-5 h-5" fill={product.is_featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)} disabled={deletingId === product.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Page {page + 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => p + 1)} disabled={filtered.length < LIMIT} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsFormOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h4 className="text-lg font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" placeholder="e.g. Classic Panjabi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" placeholder="1200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (৳)</label>
                  <input type="number" min="0" step="0.01" value={formData.compare_price} onChange={e => setFormData({ ...formData, compare_price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" placeholder="1500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" placeholder="PANJABI-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" placeholder="50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm bg-white">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.parent_name ? `${c.parent_name} > ` : ''}{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm resize-none" placeholder="Product description..." />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
              {saveMessage && (
                <div className={`p-3 rounded-xl text-sm font-medium ${saveMessage.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {saveMessage}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition text-sm font-medium disabled:opacity-60">
                  {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
