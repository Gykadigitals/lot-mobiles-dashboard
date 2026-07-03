"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function AboutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Pagination state for timeline events
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(d => {
        setData(d || {});
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load about page data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('About page data saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddTimelineEvent = () => {
    if (!data.timeline?.events) return;
    const newEvent = {
      year: new Date().getFullYear().toString(),
      title: 'New Event',
      description: 'Event description',
      image: ''
    };

    // LIFO: Add to the beginning of the events array
    setData({
      ...data,
      timeline: {
        ...data.timeline,
        events: [newEvent, ...data.timeline.events]
      }
    });
    // Reset to first page
    setCurrentPage(1);
  };

  const handleTimelineImageUpload = (e: React.ChangeEvent<HTMLInputElement>, actualIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEvents = [...data.timeline.events];
        newEvents[actualIndex] = { ...newEvents[actualIndex], image: reader.result as string };
        setData({
          ...data,
          timeline: {
            ...data.timeline,
            events: newEvents
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, hero: { ...data.hero, image: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, features: { ...data.features, image: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading) return <div className="p-6">Loading about page data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  const events = data.timeline?.events || [];
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <PageBreadcrumb pageTitle="About Page" />
      <div className="sm:p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">About Page Content</h1>
            <p className="text-sm text-gray-500 mt-1">Manage the text and timeline events for the About Us page.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-500 text-white px-6 py-2 rounded-md hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-8">

          {/* Global Text Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold border-b border-gray-100 dark:border-gray-800 pb-2">Hero Section</h2>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={data.hero?.title || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Description</label>
                <textarea
                  value={data.hero?.description || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:border-brand-500 focus:outline-none min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Hero Image</label>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center group rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                  {data.hero?.image ? (
                    <img src={data.hero.image} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}

                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                    <Upload size={20} className="mb-1" />
                    <span className="text-xs font-medium">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold border-b border-gray-100 dark:border-gray-800 pb-2">Banner Section</h2>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={data.banner?.title || ''}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, title: e.target.value } })}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Description</label>
                <textarea
                  value={data.banner?.description || ''}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, description: e.target.value } })}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:border-brand-500 focus:outline-none min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b border-gray-100 dark:border-gray-800 pb-2">Features Section (How Xignaturme helps)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={data.features?.title || ''}
                    onChange={(e) => setData({ ...data, features: { ...data.features, title: e.target.value } })}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Paragraphs</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newParagraphs = [...(data.features?.paragraphs || [])];
                      newParagraphs.push('');
                      setData({ ...data, features: { ...data.features, paragraphs: newParagraphs } });
                    }}
                    className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600"
                  >
                    <Plus size={14} /> Add Paragraph
                  </button>
                </div>

                {(data.features?.paragraphs || []).map((paragraph: string, idx: number) => (
                  <div key={idx} className="relative group mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Paragraph {idx + 1}</label>
                    <textarea
                      value={paragraph}
                      onChange={(e) => {
                        const newParagraphs = [...data.features.paragraphs];
                        newParagraphs[idx] = e.target.value;
                        setData({ ...data, features: { ...data.features, paragraphs: newParagraphs } });
                      }}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:border-brand-500 focus:outline-none min-h-[80px] pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newParagraphs = data.features.paragraphs.filter((_: any, i: number) => i !== idx);
                        setData({ ...data, features: { ...data.features, paragraphs: newParagraphs } });
                      }}
                      className="absolute top-6 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Paragraph"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Feature Image</label>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center group rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                  {data.features?.image ? (
                    <img src={data.features.image} alt="Feature" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-sm">No Image</span>
                    </div>
                  )}

                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-medium">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFeatureImageUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Events Section */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-semibold">Timeline Events</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                  <input
                    type="text"
                    value={data.timeline?.title || ''}
                    onChange={(e) => setData({ ...data, timeline: { ...data.timeline, title: e.target.value } })}
                    placeholder="Timeline Title"
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 text-sm focus:border-brand-500 focus:outline-none pb-1 w-full sm:w-auto"
                  />
                  <input
                    type="text"
                    value={data.timeline?.subtitle || ''}
                    onChange={(e) => setData({ ...data, timeline: { ...data.timeline, subtitle: e.target.value } })}
                    placeholder="Timeline Subtitle"
                    className="bg-transparent border-b border-gray-300 dark:border-gray-700 text-sm focus:border-brand-500 focus:outline-none pb-1 w-full sm:flex-1"
                  />
                </div>
              </div>
              <button
                onClick={handleAddTimelineEvent}
                className="flex items-center gap-2 bg-gray-100 dark:bg-white/[0.05] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors shrink-0"
              >
                <Plus size={18} /> Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event: any, i: number) => {
                const actualIndex = startIndex + i;
                return (
                  <div key={actualIndex} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-white/[0.02]">
                    {/* Image Preview */}
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center group">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-xs">No Image</span>
                        </div>
                      )}

                      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm font-medium">Upload Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleTimelineImageUpload(e, actualIndex)} />
                      </label>

                      <button
                        onClick={() => {
                          const newEvents = events.filter((_: any, idx: number) => idx !== actualIndex);
                          setData({ ...data, timeline: { ...data.timeline, events: newEvents } });
                          if (newEvents.length > 0 && Math.ceil(newEvents.length / itemsPerPage) < currentPage) {
                            setCurrentPage(Math.max(currentPage - 1, 1));
                          }
                        }}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full text-red-500 hover:text-red-700 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Form Controls */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="text-xs text-gray-500 block mb-1">Year</label>
                          <input
                            type="text"
                            value={event.year}
                            onChange={(e) => {
                              const newEvents = [...events];
                              newEvents[actualIndex] = { ...event, year: e.target.value };
                              setData({ ...data, timeline: { ...data.timeline, events: newEvents } });
                            }}
                            className="w-full text-sm font-bold bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-gray-500 block mb-1">Title</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => {
                              const newEvents = [...events];
                              newEvents[actualIndex] = { ...event, title: e.target.value };
                              setData({ ...data, timeline: { ...data.timeline, events: newEvents } });
                            }}
                            className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Description</label>
                        <textarea
                          value={event.description}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[actualIndex] = { ...event, description: e.target.value };
                            setData({ ...data, timeline: { ...data.timeline, events: newEvents } });
                          }}
                          className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded px-2 py-1.5 focus:outline-none focus:border-brand-500 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 gap-4 border-t border-gray-200 dark:border-gray-800">
              <span className="text-sm text-gray-500 text-center sm:text-left">
                Showing {events.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, events.length)} of {events.length} events
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 sm:p-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-sm font-medium px-2 text-center">
                  Page {currentPage} of {Math.max(1, totalPages)}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.max(1, totalPages)))}
                  disabled={currentPage >= totalPages}
                  className="p-2 sm:p-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
