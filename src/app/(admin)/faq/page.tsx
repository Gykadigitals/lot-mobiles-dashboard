"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state for items
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('FAQ saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddItem = () => {
    const newId = Date.now();
    const newItem = { id: newId, category: 'New Category', question: 'New Question', answer: 'New Answer' };
    setData({
      ...data,
      items: [newItem, ...data.items] // LIFO (latest added first)
    });
    setCurrentPage(1);
  };

  const updateItemField = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  const deleteItem = (index: number) => {
    if(confirm('Are you sure you want to delete this FAQ?')) {
      const newItems = data.items.filter((_: any, idx: number) => idx !== index);
      setData({ ...data, items: newItems });
      if (newItems.length > 0 && Math.ceil(newItems.length / itemsPerPage) < currentPage) {
         setCurrentPage(Math.max(currentPage - 1, 1));
      }
    }
  };

  if (loading) return <div className="p-6">Loading FAQ data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">No data found.</div>;

  const totalPages = Math.ceil(data.items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl flex items-center gap-2">
          <HelpCircle className="text-brand-500" /> FAQ Management
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Plus size={18} /> Add New FAQ
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Questions & Answers</h2>
          <span className="text-sm text-gray-500">{data.items.length} total FAQs</span>
        </div>
        
        {data.items.length === 0 && <p className="text-gray-500">No FAQs found.</p>}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentItems.map((item: any, i: number) => {
            const actualIndex = startIndex + i;

            return (
              <div key={item.id || actualIndex} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-white/[0.02] flex flex-col relative group">
                
                <button 
                  onClick={() => deleteItem(actualIndex)} 
                  className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-1.5 rounded-md text-red-500 hover:text-red-700 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-gray-700"
                  title="Delete FAQ"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="p-5 space-y-4 flex-1 flex flex-col pt-8">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Category</label>
                    <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateItemField(actualIndex, 'category', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="e.g. Orders & Payments"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Question</label>
                    <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateItemField(actualIndex, 'question', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="e.g. How do I place an order?"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Answer</label>
                    <textarea
                        value={item.answer}
                        onChange={(e) => updateItemField(actualIndex, 'answer', e.target.value)}
                        className="w-full flex-1 text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors min-h-[100px]"
                        placeholder="Detailed answer..."
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <span className="text-sm text-gray-500">
              Showing {data.items.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.items.length)} of {data.items.length} FAQs
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm font-medium px-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
