import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';

export const SettingsManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings, isLoading } = useAdminData();
  const [localSettings, setLocalSettings] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
    setSaveMessage('');
    const success = await updateSettings(localSettings);
    if (success) {
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessage('Failed to save settings');
    }
    setIsSaving(false);
  };

  const groupedSettings = Object.entries(localSettings).reduce((acc, [key, value]: [string, any]) => {
    const category = value?.category || 'general';
    if (!acc[category]) acc[category] = {};
    acc[category][key] = value;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Settings Management</h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg ${saveMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveMessage}
        </div>
      )}

      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <div key={category} className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4 capitalize">{category}</h4>
          <div className="space-y-4">
            {Object.entries(categorySettings).map(([key, setting]: [string, any]) => (
              <div key={key} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {setting.description && (
                    <span className="text-gray-400 font-normal ml-2">- {setting.description}</span>
                  )}
                </label>
                {setting.type === 'boolean' ? (
                  <select
                    value={setting.value}
                    onChange={(e) => handleSettingChange(key, e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="1">Enabled</option>
                    <option value="0">Disabled</option>
                  </select>
                ) : setting.type === 'number' ? (
                  <input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(key, e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                ) : (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(key, e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedSettings).length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
          No settings found. Add settings through the database or API.
        </div>
      )}
    </div>
  );
};