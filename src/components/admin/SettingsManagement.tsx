import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Sliders, Save, CheckCircle2, AlertCircle, Truck, Phone, Store, DollarSign, Bell } from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings, isLoading } = useAdminData();
  const [localSettings, setLocalSettings] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings({
      ...localSettings,
      [key]: {
        ...localSettings[key],
        value
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    const success = await updateSettings(localSettings);
    if (success) {
      setSaveMessage({ type: 'success', text: 'All system settings saved and synced successfully!' });
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please verify backend connection.' });
    }
    setIsSaving(false);
  };

  const groupedSettings = Object.entries(localSettings).reduce((acc, [key, value]: [string, any]) => {
    const category = value?.category || 'general';
    if (!acc[category]) acc[category] = {};
    acc[category][key] = value;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'contact':
        return <Phone className="w-5 h-5 text-emerald-600" />;
      case 'general':
        return <Store className="w-5 h-5 text-indigo-600" />;
      case 'announcements':
      case 'marketing':
        return <Bell className="w-5 h-5 text-amber-500" />;
      default:
        return <Sliders className="w-5 h-5 text-gray-700" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gray-700" />
            Store Configuration & Settings
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage delivery charges, free delivery thresholds, contact info, and top banner announcements
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Settings
            </>
          )}
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-fadeIn ${
          saveMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2.5">
              {getCategoryIcon(category)}
              <h4 className="text-base font-bold text-gray-900 capitalize tracking-wide">
                {category} Settings
              </h4>
            </div>

            <div className="p-6 space-y-5">
              {Object.entries(categorySettings).map(([key, setting]: [string, any]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="sm:w-1/2">
                    <label className="block text-sm font-semibold text-gray-900 mb-0.5">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    {setting.description && (
                      <p className="text-xs text-gray-500 leading-relaxed">{setting.description}</p>
                    )}
                  </div>
                  
                  <div className="sm:w-1/2 flex items-center">
                    {setting.type === 'boolean' ? (
                      <select
                        value={setting.value}
                        onChange={(e) => handleSettingChange(key, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                      >
                        <option value="1">Enabled</option>
                        <option value="0">Disabled</option>
                      </select>
                    ) : setting.type === 'number' ? (
                      <div className="relative w-full">
                        <input
                          type="number"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(key, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm font-mono transition"
                        />
                      </div>
                    ) : key.includes('description') || key.includes('announcement') ? (
                      <textarea
                        value={setting.value}
                        onChange={(e) => handleSettingChange(key, e.target.value)}
                        rows={2}
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                      />
                    ) : (
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(key, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedSettings).length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-12 text-center text-gray-500">
          <Sliders className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-gray-700">No Settings Found</p>
          <p className="text-xs text-gray-400 mt-1">Please ensure your database migration has been executed.</p>
        </div>
      )}
    </div>
  );
};