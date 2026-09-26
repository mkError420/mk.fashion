import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Edit2, Trash2, RefreshCw, X, Package,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Star, AlertTriangle, ChevronDown,
  Image as ImageIcon, Layers, Check, Palette, Sparkles, UploadCloud
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { MediaUpload } from './MediaUpload';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  category_name?: string;
  category_id?: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  sku?: string;
  created_at: string;
  image_count?: number;
  variant_count?: number;
}

interface ProductImageItem {
  id?: number;
  product_id?: number;
  image_url: string;
  alt_text?: string | null;
  is_primary?: boolean;
  sort_order?: number;
}

interface ProductVariantItem {
  id?: number;
  product_id?: number;
  size: string;
  color: string;
  color_hex: string;
  stock_quantity: number | string;
  price_override?: number | string;
  sku: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  compare_price: number | string;
  sku: string;
  stock_quantity: number | string;
  parent_category_id: number | string;   // UI-only: which parent is selected
  category_id: number | string;          // final value sent to API (could be parent or subcategory)
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: '', description: '', price: '', compare_price: '',
  sku: '', stock_quantity: '',
  parent_category_id: '', category_id: '',
  image_url: '', is_active: true, is_featured: false,
};

/* ─────────────────────────────────────────────────────────────── */
/*  Helper: resolve parent_category_id from a category_id         */
function resolveParentId(categoryId: number | string, categories: { id: number; parent_id: number | null }[]) {
  if (!categoryId) return '';
  const cat = categories.find(c => c.id === Number(categoryId));
  if (!cat) return '';
  if (cat.parent_id === null) return cat.id;   // it IS a parent cat
  return cat.parent_id;                         // it's a subcategory → return its parent
}

export const ProductsManagement: React.FC = () => {
  const { categories, loadCategories } = useAdminData();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal & Tabs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'gallery' | 'variants'>('basic');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const LIMIT = 20;

  // Gallery and Variants State
  const [productImages, setProductImages] = useState<ProductImageItem[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariantItem[]>([]);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);

  // New Image Adder State
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [newGalleryAlt, setNewGalleryAlt] = useState('');
  const [newGalleryIsPrimary, setNewGalleryIsPrimary] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);

  // New Variant Adder State
  const [newVarSize, setNewVarSize] = useState('');
  const [newVarColor, setNewVarColor] = useState('');
  const [newVarColorHex, setNewVarColorHex] = useState('#000000');
  const [newVarStock, setNewVarStock] = useState('10');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarSku, setNewVarSku] = useState('');
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  /* ── derived category lists ──────────────────────────────────── */
  const parentCategories = categories.filter(c => c.parent_id === null);
  const subCategories = categories.filter(
    c => c.parent_id !== null && Number(c.parent_id) === Number(formData.parent_category_id)
  );

  /* ── data loading ────────────────────────────────────────────── */
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin_dashboard.php?action=products&limit=${LIMIT}&offset=${page * LIMIT}`,
        { credentials: 'include' }
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { loadProducts(); loadCategories(); }, [loadProducts]);

  /* ── fetch extra details (images and variants) ────────────────── */
  const loadProductExtras = async (productId: number) => {
    setIsLoadingExtras(true);
    try {
      const [imgRes, varRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_images&product_id=${productId}`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_variants&product_id=${productId}`, { credentials: 'include' }),
      ]);
      if (imgRes.ok) {
        const imgs = await imgRes.json();
        setProductImages(Array.isArray(imgs) ? imgs : []);
      }
      if (varRes.ok) {
        const vars = await varRes.json();
        setProductVariants(Array.isArray(vars) ? vars : []);
      }
    } catch (err) {
      console.error('Error fetching product extras:', err);
    } finally {
      setIsLoadingExtras(false);
    }
  };

  /* ── form helpers ────────────────────────────────────────────── */
  const openCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setProductImages([]);
    setProductVariants([]);
    setActiveTab('basic');
    setIsFormOpen(true);
    setSaveMessage('');
  };

  const openEdit = (p: Product, tab: 'basic' | 'gallery' | 'variants' = 'basic') => {
    const parentId = resolveParentId(p.category_id ?? '', categories);
    const cat = categories.find(c => c.id === Number(p.category_id));
    const isSubcat = cat && cat.parent_id !== null;

    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price,
      compare_price: p.compare_price || '',
      sku: p.sku || '',
      stock_quantity: p.stock_quantity,
      parent_category_id: parentId,
      category_id: isSubcat ? (p.category_id ?? '') : (parentId ?? ''),
      image_url: p.image_url || '',
      is_active: p.is_active,
      is_featured: p.is_featured,
    });
    setActiveTab(tab);
    setIsFormOpen(true);
    setSaveMessage('');
    loadProductExtras(p.id);
  };

  const openGallery = (p: Product) => openEdit(p, 'gallery');
  const openVariants = (p: Product) => openEdit(p, 'variants');

  /* When parent category changes → reset subcategory */
  const handleParentChange = (parentId: string) => {
    setFormData(prev => ({
      ...prev,
      parent_category_id: parentId,
      category_id: parentId,
    }));
  };

  /* When subcategory changes → set category_id to subcategory */
  const handleSubcategoryChange = (subId: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: subId || prev.parent_category_id,
    }));
  };

  /* ── Gallery actions ─────────────────────────────────────────── */
  const handleAddGalleryImage = async () => {
    if (!newGalleryImageUrl || !newGalleryImageUrl.trim()) {
      alert('Please enter or upload an image first');
      return;
    }
    const trimmedUrl = newGalleryImageUrl.trim();
    setIsAddingImage(true);

    if (editingProduct) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_image`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: editingProduct.id,
            image_url: trimmedUrl,
            alt_text: newGalleryAlt.trim() || null,
            is_primary: newGalleryIsPrimary,
            sort_order: productImages.length,
          }),
        });
        if (res.ok) {
          if (newGalleryIsPrimary || !formData.image_url) {
            setFormData(prev => ({ ...prev, image_url: trimmedUrl }));
          }
          setNewGalleryImageUrl('');
          setNewGalleryAlt('');
          setNewGalleryIsPrimary(false);
          await loadProductExtras(editingProduct.id);
          await loadProducts();
        } else {
          const err = await res.json();
          alert(err.message || 'Failed to add image');
        }
      } catch (err) {
        alert('Network error adding image');
      } finally {
        setIsAddingImage(false);
      }
    } else {
      // Local queue for new product
      const isPrimary = newGalleryIsPrimary || productImages.length === 0;
      setProductImages(prev => [
        ...prev,
        {
          image_url: trimmedUrl,
          alt_text: newGalleryAlt.trim() || null,
          is_primary: isPrimary,
          sort_order: prev.length,
        }
      ]);
      if (isPrimary) {
        setFormData(prev => ({ ...prev, image_url: trimmedUrl }));
      }
      setNewGalleryImageUrl('');
      setNewGalleryAlt('');
      setNewGalleryIsPrimary(false);
      setIsAddingImage(false);
    }
  };

  const handleDeleteGalleryImage = async (img: ProductImageItem, index: number) => {
    if (!window.confirm('Delete this image?')) return;
    if (img.id && editingProduct) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_image&id=${img.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          await loadProductExtras(editingProduct.id);
          await loadProducts();
        }
      } catch {
        alert('Failed to delete image');
      }
    } else {
      setProductImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSetPrimaryImage = async (img: ProductImageItem, index: number) => {
    if (img.id && editingProduct) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_image`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: img.id, is_primary: true }),
        });
        if (res.ok) {
          setFormData(prev => ({ ...prev, image_url: img.image_url }));
          await loadProductExtras(editingProduct.id);
          await loadProducts();
        }
      } catch {
        alert('Failed to set primary image');
      }
    } else {
      setProductImages(prev =>
        prev.map((item, i) => ({ ...item, is_primary: i === index }))
      );
      setFormData(prev => ({ ...prev, image_url: img.image_url }));
    }
  };

  /* ── Variant actions ─────────────────────────────────────────── */
  const handleAddVariant = async () => {
    if (!newVarSize && !newVarColor) {
      alert('Please specify at least a size or a color for the variant.');
      return;
    }
    setIsAddingVariant(true);

    const payload = {
      size: newVarSize.trim() || null,
      color: newVarColor.trim() || null,
      color_hex: newVarColorHex || null,
      stock_quantity: Number(newVarStock) || 0,
      price_override: newVarPrice !== '' ? Number(newVarPrice) : null,
      sku: newVarSku.trim() || null,
    };

    if (editingProduct) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_variant`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, product_id: editingProduct.id }),
        });
        if (res.ok) {
          setNewVarSize('');
          setNewVarColor('');
          setNewVarPrice('');
          setNewVarSku('');
          await loadProductExtras(editingProduct.id);
          await loadProducts();
        } else {
          const err = await res.json();
          alert(err.message || 'Failed to add variant');
        }
      } catch {
        alert('Network error adding variant');
      } finally {
        setIsAddingVariant(false);
      }
    } else {
      // Local queue for new product
      setProductVariants(prev => [
        ...prev,
        {
          size: newVarSize.trim(),
          color: newVarColor.trim(),
          color_hex: newVarColorHex,
          stock_quantity: Number(newVarStock) || 0,
          price_override: newVarPrice !== '' ? Number(newVarPrice) : undefined,
          sku: newVarSku.trim(),
        }
      ]);
      setNewVarSize('');
      setNewVarColor('');
      setNewVarPrice('');
      setNewVarSku('');
      setIsAddingVariant(false);
    }
  };

  const handleDeleteVariant = async (v: ProductVariantItem, index: number) => {
    if (!window.confirm('Delete this variant?')) return;
    if (v.id && editingProduct) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product_variant&id=${v.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          await loadProductExtras(editingProduct.id);
          await loadProducts();
        }
      } catch {
        alert('Failed to delete variant');
      }
    } else {
      setProductVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Quick preset generators for variants
  const handleApplyPresetSizes = (sizesList: string[]) => {
    sizesList.forEach(sz => {
      setProductVariants(prev => {
        if (prev.some(item => item.size === sz && item.color === (newVarColor || 'Standard'))) return prev;
        return [
          ...prev,
          {
            size: sz,
            color: newVarColor || 'Standard',
            color_hex: newVarColorHex || '#000000',
            stock_quantity: Number(newVarStock) || 10,
            price_override: newVarPrice !== '' ? Number(newVarPrice) : undefined,
            sku: formData.sku ? `${formData.sku}-${sz}` : '',
          }
        ];
      });
    });
  };

  /* ── save entire product ─────────────────────────────────────── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        compare_price: formData.compare_price !== '' ? Number(formData.compare_price) : null,
        sku: formData.sku || null,
        stock_quantity: Number(formData.stock_quantity),
        category_id: formData.category_id !== '' ? Number(formData.category_id) : null,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        images: productImages,
        variants: productVariants,
      };

      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product`, {
        method: editingProduct ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct ? { ...payload, id: editingProduct.id } : payload),
      });

      if (res.ok) {
        setSaveMessage('Product saved successfully with all variants & images!');
        setTimeout(() => {
          setIsFormOpen(false);
          setSaveMessage('');
          setFormData(EMPTY_FORM);
          setEditingProduct(null);
          setProductImages([]);
          setProductVariants([]);
        }, 900);
        await loadProducts();
      } else {
        const err = await res.json();
        setSaveMessage(err.message || 'Failed to save');
      }
    } catch { setSaveMessage('Network error'); }
    finally { setIsSaving(false); }
  };

  /* ── delete product ──────────────────────────────────────────── */
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}"? All associated gallery images and variants will also be removed.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product&id=${id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) { setProducts(prev => prev.filter(p => p.id !== id)); }
    } catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  /* ── quick toggle (active / featured) ───────────────────────── */
  const handleToggle = async (product: Product, field: 'is_active' | 'is_featured') => {
    const updated = { ...product, [field]: !product[field] };
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    try {
      await fetch(`${API_BASE_URL}/admin_dashboard.php?action=product`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          description: product.description || null,
          price: product.price,
          compare_price: product.compare_price || null,
          sku: product.sku || null,
          stock_quantity: product.stock_quantity,
          category_id: product.category_id || null,
          image_url: product.image_url || null,
          is_active: updated.is_active,
          is_featured: updated.is_featured,
        }),
      });
    } catch { setProducts(prev => prev.map(p => p.id === product.id ? product : p)); }
  };

  const filtered = products.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── shared input class ──────────────────────────────────────── */
  const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm';
  const selectCls = inputCls + ' bg-white appearance-none';

  /* ════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product Management</h3>
          <p className="text-sm text-gray-500">{products.length} products • Variants & Multi-Image Gallery Supported</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadProducts}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-200 transition text-sm font-medium cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition text-sm font-medium cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search products, SKU, category…" value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'SKU', 'Price', 'Stock', 'Gallery Images', 'Variants', 'Category', 'Active', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 10 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No products found</p>
                </td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  {/* Product Thumbnail & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0 border border-gray-200" />
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

                  {/* SKU */}
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{product.sku || '—'}</td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">৳{(product.price || 0).toLocaleString()}</div>
                    {product.compare_price && <div className="text-xs text-gray-400 line-through">৳{product.compare_price.toLocaleString()}</div>}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                      ${product.stock_quantity <= 5 ? 'bg-red-100 text-red-700' : product.stock_quantity <= 15 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock_quantity <= 5 && <AlertTriangle className="w-3 h-3" />}
                      {product.stock_quantity}
                    </span>
                  </td>

                  {/* Image Gallery Badge / Trigger */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openGallery(product)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer border border-purple-200"
                      title="Manage Product Images"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                      <span>{product.image_count ?? (product.image_url ? 1 : 0)} Images</span>
                    </button>
                  </td>

                  {/* Variants Badge / Trigger */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openVariants(product)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer border border-indigo-200"
                      title="Manage Product Variants (Size, Color, Stock)"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{product.variant_count ?? 0} Variants</span>
                    </button>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-600 text-xs">{product.category_name || '—'}</td>

                  {/* Active Toggle */}
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(product, 'is_active')}
                      className={`transition cursor-pointer ${product.is_active ? 'text-emerald-500' : 'text-gray-300'}`}>
                      {product.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(product, 'is_featured')}
                      className={`transition cursor-pointer ${product.is_featured ? 'text-amber-400' : 'text-gray-300'}`}>
                      <Star className="w-5 h-5" fill={product.is_featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(product, 'basic')}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Edit Product">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40 cursor-pointer"
                        title="Delete Product">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Page {page + 1}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={filtered.length < LIMIT}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Product Management Modal (Tabs: Basic | Gallery | Variants) ────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsFormOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Modal header with Tabs */}
            <div className="p-5 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                  </h4>
                  <p className="text-xs text-gray-500">Manage basic details, image gallery, and inventory variants</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className="flex items-center space-x-2 border-b border-gray-200 -mb-5 pb-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === 'basic'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Basic Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Image Gallery</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {productImages.length || (formData.image_url ? 1 : 0)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('variants')}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === 'variants'
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Variants & Stock</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {productVariants.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* ─────────────────────────────────────────────────────────────
                  TAB 1: BASIC INFORMATION
                 ───────────────────────────────────────────────────────────── */}
              {activeTab === 'basic' && (
                <form id="productBasicForm" onSubmit={handleSave} className="space-y-5">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                    <input required type="text" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={inputCls} placeholder="e.g. Royal Bengal Cotton Panjabi" />
                  </div>

                  {/* Price + Compare Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Price (৳) *</label>
                      <input required type="number" min="0" step="0.01" value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className={inputCls} placeholder="1200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Compare Price (৳)</label>
                      <input type="number" min="0" step="0.01" value={formData.compare_price}
                        onChange={e => setFormData({ ...formData, compare_price: e.target.value })}
                        className={inputCls} placeholder="1500 (strikethrough price)" />
                    </div>
                  </div>

                  {/* SKU + Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Base SKU</label>
                      <input type="text" value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        className={inputCls} placeholder="PANJABI-001" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Total Stock Quantity</label>
                      <input type="number" min="0" value={formData.stock_quantity}
                        onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                        className={inputCls} placeholder="50" />
                    </div>
                  </div>

                  {/* Category & Subcategory cascade */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category & Subcategory</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={formData.parent_category_id}
                          onChange={e => handleParentChange(e.target.value)}
                          className={selectCls}
                        >
                          <option value="">— Select Category —</option>
                          {parentCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <select
                          value={
                            subCategories.find(sc => sc.id === Number(formData.category_id))
                              ? formData.category_id
                              : ''
                          }
                          onChange={e => handleSubcategoryChange(e.target.value)}
                          disabled={!formData.parent_category_id || subCategories.length === 0}
                          className={selectCls + ((!formData.parent_category_id || subCategories.length === 0) ? ' opacity-50 cursor-not-allowed' : '')}
                        >
                          <option value="">
                            {!formData.parent_category_id
                              ? '— Select Category first —'
                              : subCategories.length === 0
                                ? '— No subcategories —'
                                : '— All (no subcategory) —'}
                          </option>
                          {subCategories.map(sc => (
                            <option key={sc.id} value={sc.id}>{sc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Primary Product Image */}
                  <div>
                    <MediaUpload
                      label="Main Primary Product Image"
                      accept="image"
                      value={formData.image_url}
                      onChange={url => setFormData({ ...formData, image_url: url })}
                      placeholder="https://…/product.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Tip: You can upload more gallery images under the <strong>Image Gallery</strong> tab above.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className={inputCls + ' resize-none'} placeholder="Detailed description of fabric, cut, style..." />
                  </div>

                  {/* Active + Featured */}
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_active}
                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded accent-gray-900" />
                      <span className="text-sm font-medium text-gray-700">Active on Store</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_featured}
                        onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-500" />
                      <span className="text-sm font-medium text-gray-700">Featured (Bestseller)</span>
                    </label>
                  </div>
                </form>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 2: IMAGE GALLERY (MULTIPLE IMAGES)
                 ───────────────────────────────────────────────────────────── */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Upload New Image Box */}
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-purple-900 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-purple-600" /> Upload More Product Images
                      </h5>
                      <span className="text-xs text-purple-600">Drag & drop from device or enter URL</span>
                    </div>

                    <MediaUpload
                      label="Select or Upload Image"
                      accept="image"
                      value={newGalleryImageUrl}
                      onChange={url => setNewGalleryImageUrl(url)}
                      placeholder="Upload file from device or paste image URL"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                      <input
                        type="text"
                        value={newGalleryAlt}
                        onChange={e => setNewGalleryAlt(e.target.value)}
                        placeholder="Image Alt text / Label (optional)"
                        className={inputCls}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={newGalleryIsPrimary}
                            onChange={e => setNewGalleryIsPrimary(e.target.checked)}
                            className="w-4 h-4 rounded accent-purple-600"
                          />
                          Set as Primary Image
                        </label>
                        <button
                          type="button"
                          onClick={handleAddGalleryImage}
                          disabled={!newGalleryImageUrl || isAddingImage}
                          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          {isAddingImage ? 'Adding…' : '+ Add to Gallery'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Images List */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                      <span>Product Gallery Photos ({productImages.length})</span>
                      <span className="text-xs text-gray-400 font-normal">Displayed in thumbnails and zoom view</span>
                    </h5>

                    {isLoadingExtras ? (
                      <div className="py-8 text-center text-gray-400 text-xs">Loading images…</div>
                    ) : productImages.length === 0 && !formData.image_url ? (
                      <div className="border border-dashed border-gray-200 rounded-2xl py-10 text-center text-gray-400 text-xs">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No gallery images uploaded yet. Use the uploader above to add photos.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {/* Include formData.image_url if not in productImages */}
                        {formData.image_url && !productImages.some(img => img.image_url === formData.image_url) && (
                          <div className="group relative rounded-xl border-2 border-black overflow-hidden bg-gray-50 flex flex-col aspect-3/4">
                            <img src={formData.image_url} alt="Main" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              Primary
                            </div>
                          </div>
                        )}

                        {productImages.map((img, idx) => (
                          <div
                            key={img.id || idx}
                            className={`group relative rounded-xl border overflow-hidden bg-gray-50 flex flex-col aspect-3/4 transition ${
                              img.is_primary ? 'border-2 border-black shadow-md' : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img src={img.image_url} alt={img.alt_text || 'Product image'} className="w-full h-full object-cover" />

                            {/* Badge */}
                            {img.is_primary && (
                              <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                                <Star className="w-3 h-3 fill-white" /> Primary
                              </div>
                            )}

                            {/* Hover Actions Bar */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 flex items-center justify-between opacity-90 group-hover:opacity-100 transition">
                              {!img.is_primary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(img, idx)}
                                  className="text-[11px] bg-white/90 hover:bg-white text-gray-900 font-semibold px-2 py-1 rounded transition cursor-pointer"
                                >
                                  Make Primary
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(img, idx)}
                                className="p-1 bg-red-600/90 hover:bg-red-600 text-white rounded transition cursor-pointer ml-auto"
                                title="Delete Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 3: VARIANTS & INVENTORY
                 ───────────────────────────────────────────────────────────── */}
              {activeTab === 'variants' && (
                <div className="space-y-6">
                  {/* Preset Buttons for Quick Sizes */}
                  <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Quick Size & Color Presets
                      </span>
                      <span className="text-[11px] text-indigo-600">Click to autofill common sizes</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPresetSizes(['38', '40', '42', '44', '46'])}
                        className="px-3 py-1.5 bg-white text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition cursor-pointer"
                      >
                        + Panjabi Sizes (38, 40, 42, 44, 46)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPresetSizes(['S', 'M', 'L', 'XL', 'XXL'])}
                        className="px-3 py-1.5 bg-white text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition cursor-pointer"
                      >
                        + Standard Sizes (S, M, L, XL, XXL)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPresetSizes(['30', '32', '34', '36', '38'])}
                        className="px-3 py-1.5 bg-white text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition cursor-pointer"
                      >
                        + Waist/Pants (30, 32, 34, 36, 38)
                      </button>
                    </div>

                    {/* Quick Color chips */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Color:</span>
                      {[
                        { name: 'Jet Black', hex: '#000000' },
                        { name: 'Pure White', hex: '#FFFFFF' },
                        { name: 'Navy Blue', hex: '#1E3A8A' },
                        { name: 'Maroon', hex: '#800020' },
                        { name: 'Olive Green', hex: '#556B2F' },
                        { name: 'Beige', hex: '#F5F5DC' },
                      ].map(col => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => { setNewVarColor(col.name); setNewVarColorHex(col.hex); }}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-gray-400 transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: col.hex }} />
                          <span>{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Single Variant Form */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-gray-700">Add New Variant</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Size</label>
                        <input
                          type="text"
                          value={newVarSize}
                          onChange={e => setNewVarSize(e.target.value)}
                          placeholder="e.g. 42 or XL"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Color Name</label>
                        <input
                          type="text"
                          value={newVarColor}
                          onChange={e => setNewVarColor(e.target.value)}
                          placeholder="e.g. Navy"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Color Swatch</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={newVarColorHex}
                            onChange={e => setNewVarColorHex(e.target.value)}
                            className="w-9 h-9 p-0.5 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <span className="text-[11px] font-mono text-gray-500">{newVarColorHex}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={newVarStock}
                          onChange={e => setNewVarStock(e.target.value)}
                          placeholder="10"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Price Override (৳)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newVarPrice}
                          onChange={e => setNewVarPrice(e.target.value)}
                          placeholder="Optional"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddVariant}
                          disabled={isAddingVariant}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-60"
                        >
                          {isAddingVariant ? 'Adding…' : '+ Add Variant'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Variants Table */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                      <span>Configured Variants ({productVariants.length})</span>
                      <span className="text-xs text-gray-400 font-normal">Shown as selectable size & color swatches in frontend</span>
                    </h5>

                    {isLoadingExtras ? (
                      <div className="py-8 text-center text-gray-400 text-xs">Loading variants…</div>
                    ) : productVariants.length === 0 ? (
                      <div className="border border-dashed border-gray-200 rounded-2xl py-10 text-center text-gray-400 text-xs">
                        <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No variants added yet. Use the adder or quick presets above.
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
                            <tr>
                              <th className="px-3 py-2.5">Size</th>
                              <th className="px-3 py-2.5">Color</th>
                              <th className="px-3 py-2.5">Swatch</th>
                              <th className="px-3 py-2.5">Stock</th>
                              <th className="px-3 py-2.5">Price (৳)</th>
                              <th className="px-3 py-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {productVariants.map((v, idx) => (
                              <tr key={v.id || idx} className="hover:bg-gray-50 transition">
                                <td className="px-3 py-2.5 font-bold text-gray-900">{v.size || '—'}</td>
                                <td className="px-3 py-2.5 text-gray-700">{v.color || '—'}</td>
                                <td className="px-3 py-2.5">
                                  {v.color_hex ? (
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs inline-block"
                                        style={{ backgroundColor: v.color_hex }}
                                      />
                                      <span className="font-mono text-gray-400 text-[10px]">{v.color_hex}</span>
                                    </div>
                                  ) : '—'}
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    Number(v.stock_quantity) <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {v.stock_quantity}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 font-semibold text-gray-900">
                                  {v.price_override ? `৳${Number(v.price_override).toLocaleString()}` : <span className="text-gray-400 font-normal">Base (৳{formData.price || '0'})</span>}
                                </td>
                                <td className="px-3 py-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVariant(v, idx)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                                    title="Delete Variant"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              {saveMessage && (
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  saveMessage.includes('success') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {saveMessage}
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-6 py-2 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving Everything…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
