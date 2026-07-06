"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function CancellationPolicyPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state for sections
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('/api/cancellation-policy')
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
    // Update lastUpdated date to current before saving
    const updatedData = { ...data, lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) };
    try {
      const res = await fetch('/api/cancellation-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Save failed');
      setData(updatedData); // update local state with new date
      alert('Cancellation Policy saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddSection = () => {
    const newId = `section-${Date.now()}`;
    const newSection = { id: newId, heading: 'New Section', content: [''] };
    setData({
      ...data,
      sections: [newSection, ...data.sections] // LIFO
    });
    setCurrentPage(1);
  };

  const updateGlobalField = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const updateSectionField = (index: number, field: string, value: any) => {
    const newSections = [...data.sections];
    if (field === 'content') {
       // value should be string representing multiple lines. we split by newline
       const contentArray = value.split('\n').filter((p: string) => p.trim() !== '');
       newSections[index] = { ...newSections[index], content: contentArray };
    } else {
       newSections[index] = { ...newSections[index], [field]: value };
    }
    setData({ ...data, sections: newSections });
  };

  if (loading) return <div className="p-6">Loading cancellation policy data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">No data found.</div>;

  const totalPages = Math.ceil(data.sections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSections = data.sections.slice(startIndex, startIndex + itemsPerPage);

  // We need to parse content correctly on render because it might be empty on new sections
  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl flex items-center gap-2">
          <FileText className="text-brand-500" /> Cancellation Policy Management
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSection}
            className="flex items-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Plus size={18} /> Add New Section
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

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Global Page Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Page Title</label>
            <input
              type="text"
              value={data.pageTitle}
              onChange={(e) => updateGlobalField('pageTitle', e.target.value)}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Page Subtitle</label>
            <input
              type="text"
              value={data.pageSubtitle}
              onChange={(e) => updateGlobalField('pageSubtitle', e.target.value)}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">SEO Title</label>
            <input
              type="text"
              value={data.seoTitle}
              onChange={(e) => updateGlobalField('seoTitle', e.target.value)}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Last Updated</label>
            <input
              type="text"
              value={data.lastUpdated}
              readOnly
              className="w-full text-sm bg-gray-100 dark:bg-white/[0.01] text-gray-500 border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 cursor-not-allowed"
              title="This will update automatically when you save changes"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">SEO Description</label>
            <textarea
              value={data.seoDescription}
              onChange={(e) => updateGlobalField('seoDescription', e.target.value)}
              className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors min-h-[60px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Policy Sections</h2>
          <span className="text-sm text-gray-500">{data.sections.length} total sections</span>
        </div>
        
        {data.sections.length === 0 && <p className="text-gray-500">No sections found.</p>}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentSections.map((section: any, i: number) => {
            const actualIndex = startIndex + i;
            // The content array is joined with newlines for the textarea
            const contentText = section.content ? section.content.join('\n') : '';

            return (
              <div key={section.id || actualIndex} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-white/[0.02] flex flex-col relative group">
                
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this section?')) {
                        const newSections = data.sections.filter((_: any, idx: number) => idx !== actualIndex);
                        setData({ ...data, sections: newSections });
                        if (newSections.length > 0 && Math.ceil(newSections.length / itemsPerPage) < currentPage) {
                           setCurrentPage(Math.max(currentPage - 1, 1));
                        }
                    }
                  }} 
                  className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-1.5 rounded-md text-red-500 hover:text-red-700 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-gray-700"
                  title="Delete Section"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="p-5 space-y-4 flex-1 flex flex-col pt-8">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Heading (Optional)</label>
                    <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateSectionField(actualIndex, 'heading', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="e.g. OVERVIEW"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1 flex items-center justify-between">
                       <span>Content (Paragraphs)</span>
                       <span className="text-[10px] text-gray-400 font-normal">Separate paragraphs by new line</span>
                    </label>
                    <textarea
                        value={contentText}
                        onChange={(e) => updateSectionField(actualIndex, 'content', e.target.value)}
                        className="w-full flex-1 text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors min-h-[120px]"
                        placeholder="Enter policy details here..."
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
              Showing {data.sections.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.sections.length)} of {data.sections.length} sections
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
