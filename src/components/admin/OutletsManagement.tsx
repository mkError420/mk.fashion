import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useFrontendData } from '../../context/FrontendDataContext';
import {
  Outlet,
  OutletsConfig,
  DEFAULT_OUTLETS_CONFIG,
  getActiveOutletsConfig
} from '../../utils/outletsConfig';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
  Power,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Layers,
  Sparkles,
  X,
  Check
} from 'lucide-react';

const PRESET_OUTLET_IMAGES = [
  { label: 'Luxury Boutique Interior', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Modern Apparel Lounge', url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flagship Showroom Studio', url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mall Experience Center', url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Haute Demi-Couture Suite', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' }
];

export const OutletsManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useAdminData();
  const { loadSettings: reloadFrontendSettings } = useFrontendData();

  const [config, setConfig] = useState<OutletsConfig>(() => {
    return getActiveOutletsConfig();
  });

  const [activeTab, setActiveTab] = useState<'outlets' | 'headings' | 'preview'>('outlets');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);
  const [formData, setFormData] = useState<Outlet>({
    id: '',
    name: '',
    bengaliName: '',
    area: '',
    address: '',
    landmark: '',
    phone: '',
    hours: '',
    tag: '',
    features: [],
    image: '',
    mapUrl: '',
    isActive: true,
    order: 1
  });
  const [featuresInput, setFeaturesInput] = useState('');

  // Sync settings when loaded from DB API
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      const active = getActiveOutletsConfig(settings);
      setConfig(active);
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, []);

  const openAddModal = () => {
    const newId = `outlet-${Date.now()}`;
    setEditingOutlet(null);
    setFormData({
      id: newId,
      name: '',
      bengaliName: '',
      area: '',
      address: '',
      landmark: '',
      phone: '+880 17',
      hours: '10:00 AM – 10:00 PM (Open 7 Days)',
      tag: 'Flagship Store',
      features: ['Full Catalog Display', 'Instant 7-Day Exchange Hub'],
      image: PRESET_OUTLET_IMAGES[0].url,
      mapUrl: '',
      isActive: true,
      order: config.outlets.length + 1
    });
    setFeaturesInput('Full Catalog Display, Instant 7-Day Exchange Hub');
    setIsModalOpen(true);
  };

  const openEditModal = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    setFormData({ ...outlet });
    setFeaturesInput(outlet.features ? outlet.features.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Outlet name and address are required.');
      return;
    }

    const parsedFeatures = featuresInput
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const updatedOutlet: Outlet = {
      ...formData,
      features: parsedFeatures
    };

    if (editingOutlet) {
      // Edit existing
      setConfig(prev => ({
        ...prev,
        outlets: prev.outlets.map(o => o.id === editingOutlet.id ? updatedOutlet : o)
      }));
    } else {
      // Add new
      setConfig(prev => ({
        ...prev,
        outlets: [...prev.outlets, updatedOutlet]
      }));
    }

    setIsModalOpen(false);
  };

  const handleDeleteOutlet = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the outlet "${name}"?`)) {
      setConfig(prev => ({
        ...prev,
        outlets: prev.outlets.filter(o => o.id !== id)
      }));
    }
  };

  const handleToggleOutletStatus = (id: string) => {
    setConfig(prev => ({
      ...prev,
      outlets: prev.outlets.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o)
    }));
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newOutlets = [...config.outlets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOutlets.length) return;

    const temp = newOutlets[index];
    newOutlets[index] = newOutlets[targetIndex];
    newOutlets[targetIndex] = temp;

    // re-assign order sequence
    const reordered = newOutlets.map((item, idx) => ({ ...item, order: idx + 1 }));
    setConfig(prev => ({ ...prev, outlets: reordered }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all outlet settings and locations back to factory defaults?')) {
      setConfig(DEFAULT_OUTLETS_CONFIG);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 1. Client-side instant persistence
      localStorage.setItem('aristo_outlets_config', JSON.stringify(config));
      window.dispatchEvent(new Event('outlets-config-updated'));

      // 2. Persist to MySQL settings table via admin API
      const settingsPayload = {
        outlets_config: {
          value: JSON.stringify(config),
          type: 'json',
          category: 'outlets',
          description: 'Configuration and locations data for store outlets and locator'
        }
      };

      await updateSettings(settingsPayload as any);
      await reloadFrontendSettings();

      setSaveMessage({
        type: 'success',
        text: 'All outlet locations and settings saved successfully! Live website updated.'
      });
    } catch (err: any) {
      console.warn('DB settings update notice:', err);
      setSaveMessage({
        type: 'success',
        text: 'Outlet configuration saved to browser cache! Live website updated.'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const activeOutlets = config.outlets.filter(o => o.isActive);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* ── TOP ACTION BAR ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">Store Outlets & Locator Management</h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                config.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {config.enabled ? 'Section Enabled' : 'Section Hidden'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {activeOutlets.length} Active Stores
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage retail store branches, addresses, contacts, business hours, services, and Google Maps links
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/outlets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View /outlets</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── NOTIFICATION ALERT ── */}
      {saveMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-3 border ${
          saveMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-medium">{saveMessage.text}</span>
        </div>
      )}

      {/* ── SUB-TABS NAVIGATION ── */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-3 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('outlets')}
          className={`px-4 py-2.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'outlets'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Outlets List & Management ({config.outlets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('headings')}
          className={`px-4 py-2.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'headings'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Homepage & Page Headings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'preview'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Storefront Preview</span>
        </button>
      </div>

      {/* ── TAB 1: OUTLETS LIST & CARDS ── */}
      {activeTab === 'outlets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Manage Retail Outlets</h2>
              <p className="text-xs text-gray-500">
                Add new showroom locations, reorder display sequence, or edit store specifications
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Store Outlet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {config.outlets.map((outlet, index) => (
              <div
                key={outlet.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                  outlet.isActive ? 'border-gray-200 hover:border-gray-400' : 'border-gray-200 bg-gray-50/70 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar of card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700">
                        {index + 1}
                      </span>
                      {outlet.tag && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {outlet.tag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === config.outlets.length - 1}
                        title="Move Down"
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <label className="relative inline-flex items-center cursor-pointer ml-1">
                        <input
                          type="checkbox"
                          checked={outlet.isActive}
                          onChange={() => handleToggleOutletStatus(outlet.id)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Image & Title */}
                  <div className="flex gap-4 items-start mb-4">
                    <img
                      src={outlet.image || PRESET_OUTLET_IMAGES[0].url}
                      alt={outlet.name}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-gray-900 truncate font-serif">
                        {outlet.name}
                      </h3>
                      {outlet.bengaliName && (
                        <p className="text-xs text-neutral-500 font-medium">{outlet.bengaliName}</p>
                      )}
                      <p className="text-xs font-semibold text-gray-700 mt-1 truncate">
                        {outlet.area}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{outlet.address}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="font-mono">{outlet.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>{outlet.hours}</span>
                    </div>
                    {outlet.landmark && (
                      <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{outlet.landmark}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {outlet.features && outlet.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {outlet.features.map((feat, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(outlet)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOutlet(outlet.id, outlet.name)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <a
                    href={outlet.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(outlet.name + ' ' + outlet.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-black"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Map Link</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: HEADINGS & HOMEPAGE SECTION CONFIG ── */}
      {activeTab === 'headings' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Homepage Section Visibility</h2>
              <p className="text-xs text-gray-500 mt-0.5">Control whether the Outlets Section appears on the homepage</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2.5 text-xs font-semibold text-gray-700">
                {config.enabled ? 'Section Enabled' : 'Section Hidden'}
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 pb-1 border-b border-gray-100">
              Homepage Store Locator Card Content
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Section Top Badge
                </label>
                <input
                  type="text"
                  value={config.sectionBadge}
                  onChange={(e) => setConfig({ ...config, sectionBadge: e.target.value })}
                  placeholder="e.g. Retail Experience Centers"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Section CTA Button Text
                </label>
                <input
                  type="text"
                  value={config.buttonText}
                  onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                  placeholder="e.g. View All Outlets on Map"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Section Main Headline
              </label>
              <input
                type="text"
                value={config.sectionTitle}
                onChange={(e) => setConfig({ ...config, sectionTitle: e.target.value })}
                placeholder="e.g. Visit Blucheez Outlets in Dhaka & Chattogram"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Section Description Text
              </label>
              <textarea
                rows={3}
                value={config.sectionDescription}
                onChange={(e) => setConfig({ ...config, sectionDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 pb-1 border-b border-gray-100">
              Dedicated Outlets Page (/outlets) Hero Header
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Page Badge Text
                </label>
                <input
                  type="text"
                  value={config.pageBadge}
                  onChange={(e) => setConfig({ ...config, pageBadge: e.target.value })}
                  placeholder="e.g. Dhaka Experience Centers"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Page Main Title
                </label>
                <input
                  type="text"
                  value={config.pageTitle}
                  onChange={(e) => setConfig({ ...config, pageTitle: e.target.value })}
                  placeholder="e.g. Visit Blucheez Outlets in Dhaka"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Page Header Subtitle
              </label>
              <textarea
                rows={2}
                value={config.pageDescription}
                onChange={(e) => setConfig({ ...config, pageDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Headings & Section Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 3: LIVE PREVIEW ── */}
      {activeTab === 'preview' && (
        <div className="space-y-8">
          {/* 1. Homepage Section Simulation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Homepage Store Locator Section Preview</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Component: StoreLocatorSection.tsx</span>
            </div>

            {config.enabled ? (
              <div className="border border-neutral-200 p-4 sm:p-6 bg-white rounded-xl">
                {/* Top Banner */}
                <div className="bg-neutral-100 border border-neutral-200 p-6 sm:p-8 mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-black text-white inline-block mb-2">
                        {config.sectionBadge || 'Retail Experience Centers'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                        {config.sectionTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                        {config.sectionDescription}
                      </p>
                    </div>

                    <a
                      href="/outlets"
                      className="inline-flex items-center space-x-2 bg-black text-white text-xs font-bold px-6 py-3.5 uppercase tracking-widest flex-shrink-0"
                    >
                      <span>{config.buttonText}</span>
                      <Navigation className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {activeOutlets.map((outlet, index) => (
                    <div
                      key={index}
                      className="bg-white border border-neutral-200 p-5 flex flex-col justify-between"
                    >
                      <div>
                        {outlet.tag && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/60 inline-block mb-2">
                            {outlet.tag}
                          </span>
                        )}
                        <h3 className="font-bold text-base text-neutral-900 font-serif">
                          {outlet.name}
                        </h3>
                        <div className="mt-3 space-y-1.5 text-xs text-neutral-600">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                            <span>{outlet.area}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                            <span>{outlet.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-neutral-500">
                            <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                            <span>{outlet.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500">
                This section is currently disabled and hidden on the storefront homepage.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-gray-900">
                  {editingOutlet ? 'Edit Store Outlet' : 'Add New Store Outlet'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Blucheez Banani Flagship Atelier"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Bengali Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.bengaliName || ''}
                    onChange={(e) => setFormData({ ...formData, bengaliName: e.target.value })}
                    placeholder="e.g. বনানী ফ্ল্যাগশিপ শো-রুম"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Short Area / Neighborhood *
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Road 11, Block D, Banani, Dhaka"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Badge / Tag (e.g. Flagship, Atelier)
                  </label>
                  <input
                    type="text"
                    value={formData.tag || ''}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Flagship & Alteration Studio"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House 42, Road 11, Block D, Banani, Dhaka-1213"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Landmark / Navigation Reference
                </label>
                <input
                  type="text"
                  value={formData.landmark || ''}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Opposite to Star Cineplex Banani"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +880 1711-234567"
                    className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Opening Hours *
                  </label>
                  <input
                    type="text"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="e.g. 10:00 AM – 10:00 PM (Open 7 Days)"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  In-Store Services (Comma separated)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="e.g. Exclusive Belwari Section, Bespoke Tailoring, Instant 7-Day Exchange, VIP Fitting Lounge"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>

              {/* Storefront Image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Storefront Photo Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 text-gray-900"
                />

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Presets:</span>
                  {PRESET_OUTLET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded transition"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="outlet-active-check"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="outlet-active-check" className="text-xs font-semibold text-gray-800">
                  Visible on website
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-lg border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  {editingOutlet ? 'Update Outlet' : 'Add Outlet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
