"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function StoreFeaturesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/store-features')
      .then(res => res.json())
      .then(d => {
        setData(d || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load store features data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/store-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Store features saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddFeature = () => {
    const maxId = data.reduce((max, f) => Math.max(max, f.id || 0), 0);
    setData([{ id: maxId + 1, iconName: 'HelpCircle', title: 'New Feature', subtitle: 'Feature description' }, ...data]);
  };

  if (loading) return <div className="p-6">Loading store features data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Store Features Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddFeature}
            className="flex items-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Plus size={18} /> Add Feature
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        {data.length === 0 && <p className="text-gray-500">No store features found.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((feature, i) => {
            const IconComponent = (LucideIcons as any)[feature.iconName] || LucideIcons.HelpCircle;

            return (
              <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-white/[0.02]">
                {/* Icon Preview */}
                <div className="h-32 bg-gray-100 dark:bg-gray-800/50 relative flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-sm text-brand-500 dark:text-white">
                    <IconComponent size={40} strokeWidth={1.5} />
                  </div>
                  <button 
                    onClick={() => {
                      const newData = data.filter((_, idx) => idx !== i);
                      setData(newData);
                    }} 
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full text-red-500 hover:text-red-700 shadow-sm transition-colors"
                    title="Delete Feature"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Form Controls */}
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">ID (Sorting)</label>
                    <input
                      type="number"
                      value={feature.id}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[i] = { ...feature, id: Number(e.target.value) };
                        setData(newData);
                      }}
                      className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Icon Name (Lucide React)</label>
                    <input
                      type="text"
                      value={feature.iconName}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[i] = { ...feature, iconName: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
                      placeholder="e.g. Truck, ShieldCheck"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Visit <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">lucide.dev/icons</a> for icon names.</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[i] = { ...feature, title: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
                      placeholder="Free Delivery"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={feature.subtitle}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[i] = { ...feature, subtitle: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
                      placeholder="For orders over $50"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
