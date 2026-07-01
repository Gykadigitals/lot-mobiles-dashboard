"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export default function FooterPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load footer data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Footer saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading footer data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Footer Management</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 disabled:opacity-50 transition-colors"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-800 pb-2">Contact Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Address</label>
            <input
              type="text"
              value={data?.contact?.address || ''}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Phone</label>
            <input
              type="text"
              value={data?.contact?.phone || ''}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <input
              type="text"
              value={data?.contact?.email || ''}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
          <h2 className="font-semibold text-lg">Footer Columns</h2>
          <button
            onClick={() => {
              // LIFO: add to the beginning
              const newCols = [{ title: 'New Column', links: [] }, ...(data?.columns || [])];
              setData({ ...data, columns: newCols });
            }}
            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium bg-brand-50/50 hover:bg-brand-50 px-3 py-1.5 rounded transition-colors"
          >
            <Plus size={16} /> Add New Column
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data?.columns?.map((col: any, colIdx: number) => (
            <ColumnEditor
              key={colIdx}
              column={col}
              onChange={(newCol: any) => {
                const newCols = [...data.columns];
                newCols[colIdx] = newCol;
                setData({ ...data, columns: newCols });
              }}
              onDelete={() => {
                const newCols = data.columns.filter((_: any, idx: number) => idx !== colIdx);
                setData({ ...data, columns: newCols });
              }}
            />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-800 pb-2">Copyright</h2>
        <div>
          <input
            type="text"
            value={data?.copyright || ''}
            onChange={(e) => setData({ ...data, copyright: e.target.value })}
            className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-3 py-2 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

    </div>
  );
}

function ColumnEditor({ column, onChange, onDelete }: { column: any, onChange: (c: any) => void, onDelete: () => void }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-white/[0.02] relative">
      <button onClick={onDelete} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>
      
      <div className="mb-4 pr-6">
        <label className="text-xs text-gray-500 block mb-1">Column Title</label>
        <input
          type="text"
          value={column.title}
          onChange={(e) => onChange({ ...column, title: e.target.value })}
          className="w-full text-sm font-bold bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
          placeholder="Column Title"
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase">Links</h4>
        {column.links?.map((link: any, linkIdx: number) => (
          <div key={linkIdx} className="flex flex-col gap-1 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 relative group shadow-sm">
            <input
              type="text"
              value={link.label}
              onChange={(e) => {
                const newLinks = [...column.links];
                newLinks[linkIdx] = { ...link, label: e.target.value };
                onChange({ ...column, links: newLinks });
              }}
              className="text-xs bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:outline-none focus:border-brand-500 pb-1 font-medium"
              placeholder="Link Label"
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => {
                const newLinks = [...column.links];
                newLinks[linkIdx] = { ...link, href: e.target.value };
                onChange({ ...column, links: newLinks });
              }}
              className="text-[11px] bg-transparent border-none p-0 focus:ring-0 text-gray-500 pt-1"
              placeholder="URL (e.g. /about)"
            />
            <button
              onClick={() => {
                const newLinks = column.links.filter((_: any, idx: number) => idx !== linkIdx);
                onChange({ ...column, links: newLinks });
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        
        <button
          onClick={() => {
            // LIFO: add to the beginning
            const newLinks = [{ label: 'New Link', href: '#' }, ...(column.links || [])];
            onChange({ ...column, links: newLinks });
          }}
          className="text-sm flex items-center justify-center gap-2 text-gray-500 hover:text-brand-500 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 w-full py-2 rounded transition-all mt-2"
        >
          <Plus size={16} /> Add Link
        </button>
      </div>
    </div>
  );
}
