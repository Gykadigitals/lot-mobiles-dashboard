"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export default function NavigationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load navigation data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading navigation data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">MegaMenu Navigation Management</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 disabled:opacity-50"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        {data?.items?.map((item: any, i: number) => (
          <CategoryEditor
            key={i}
            item={item}
            onChange={(newItem) => {
              const newItems = [...data.items];
              newItems[i] = newItem;
              setData({ ...data, items: newItems });
            }}
            onDelete={() => {
              const newItems = data.items.filter((_: any, idx: number) => idx !== i);
              setData({ ...data, items: newItems });
            }}
          />
        ))}
        <button
          onClick={() => {
            setData({
              ...data,
              items: [...(data?.items || []), { id: 'new', title: 'New Category', href: '#', columns: [] }]
            });
          }}
          className="mt-6 flex items-center gap-2 text-brand-500 hover:text-brand-600 font-medium"
        >
          <Plus size={18} /> Add New Category
        </button>
      </div>
    </div>
  );
}

function CategoryEditor({ item, onChange, onDelete }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
      <div className="bg-gray-50 dark:bg-white/[0.02] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-gray-200 group:hover-text-black dark:hover:bg-gray-700 rounded">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} className='text-brand-500 hover:text-black' />}
          </button>
          <input
            type="text"
            value={item.title}
            onChange={(e) => onChange({ ...item, title: e.target.value })}
            className="font-medium bg-transparent border-none focus:ring-0 p-0 text-md text-brand-500 w-full max-w-[200px]"
            placeholder="Category Title"
          />
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={item.id}
            onChange={(e) => onChange({ ...item, id: e.target.value })}
            className="text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1 w-24"
            placeholder="ID"
          />
          <input
            type="text"
            value={item.href}
            onChange={(e) => onChange({ ...item, href: e.target.value })}
            className="text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1 w-32"
            placeholder="Link (Href)"
          />
          <button onClick={onDelete} className="text-red-500 hover:text-red-700 p-1">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] flex gap-6 overflow-x-auto">
          {item.columns?.map((col: any, colIdx: number) => (
            <ColumnEditor
              key={colIdx}
              column={col}
              onChange={(newCol) => {
                const newCols = [...(item.columns || [])];
                newCols[colIdx] = newCol;
                onChange({ ...item, columns: newCols });
              }}
              onDelete={() => {
                const newCols = item.columns.filter((_: any, idx: number) => idx !== colIdx);
                onChange({ ...item, columns: newCols });
              }}
            />
          ))}
          <button
            onClick={() => {
              const newCols = [...(item.columns || []), { sections: [] }];
              onChange({ ...item, columns: newCols });
            }}
            className="shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/[0.08] rounded-md w-48 h-full min-h-[200px] text-gray-500 hover:border-brand-500 hover:text-brand-500 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

function ColumnEditor({ column, onChange, onDelete }: any) {
  return (
    <div className="shrink-0 w-72 border border-gray-200 dark:border-gray-800 rounded-md p-3 bg-gray-50 dark:bg-white/[0.02] relative">
      <button onClick={onDelete} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
        <Trash2 size={14} />
      </button>
      <div className="text-xs font-bold uppercase text-gray-500 mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">Column</div>

      <div className="space-y-4">
        {column.sections?.map((sec: any, secIdx: number) => (
          <SectionEditor
            key={secIdx}
            section={sec}
            onChange={(newSec) => {
              const newSecs = [...(column.sections || [])];
              newSecs[secIdx] = newSec;
              onChange({ ...column, sections: newSecs });
            }}
            onDelete={() => {
              const newSecs = column.sections.filter((_: any, idx: number) => idx !== secIdx);
              onChange({ ...column, sections: newSecs });
            }}
          />
        ))}
        <button
          onClick={() => {
            const newSecs = [...(column.sections || []), { title: 'New Section', items: [] }];
            onChange({ ...column, sections: newSecs });
          }}
          className="text-xs flex items-center gap-1 text-brand-500 hover:underline w-full justify-center py-2"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>
    </div>
  );
}

function SectionEditor({ section, onChange, onDelete }: any) {
  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded p-2">
      <div className="flex items-center justify-between mb-2 gap-2">
        <input
          type="text"
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className="font-bold text-sm bg-transparent border-b border-dashed border-gray-300 dark:border-white/[0.08] focus:outline-none focus:border-brand-500 w-full"
          placeholder="Section Title"
        />
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500 shrink-0">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-1 mt-3">
        {section.items?.map((link: any, linkIdx: number) => (
          <div key={linkIdx} className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-white/[0.02] rounded border border-gray-100 dark:border-gray-800 relative group">
            <input
              type="text"
              value={link.label}
              onChange={(e) => {
                const newLinks = [...section.items];
                newLinks[linkIdx] = { ...link, label: e.target.value };
                onChange({ ...section, items: newLinks });
              }}
              className="text-xs bg-transparent border-none p-0 focus:ring-0 font-medium"
              placeholder="Link Label"
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => {
                const newLinks = [...section.items];
                newLinks[linkIdx] = { ...link, href: e.target.value };
                onChange({ ...section, items: newLinks });
              }}
              className="text-[10px] bg-transparent border-none p-0 focus:ring-0 text-gray-500"
              placeholder="URL Path"
            />
            <button
              onClick={() => {
                const newLinks = section.items.filter((_: any, idx: number) => idx !== linkIdx);
                onChange({ ...section, items: newLinks });
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newLinks = [...(section.items || []), { label: 'New Link', href: '/' }];
            onChange({ ...section, items: newLinks });
          }}
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-brand-500 mt-2"
        >
          <Plus size={12} /> Add Link
        </button>
      </div>
    </div>
  );
}
