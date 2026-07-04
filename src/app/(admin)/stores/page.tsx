"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Upload, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export default function StoresPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(d => {
        setData(d || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load stores data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Stores saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddStore = () => {
    const newId = `store-${Date.now()}`;
    // LIFO: Add to the beginning of the array
    setData([{ 
      id: newId, 
      name: 'New Store', 
      address: '', 
      phone: '', 
      email: '', 
      lat: 0, 
      lng: 0, 
      city: '', 
      rating: 5, 
      image: '' 
    }, ...data]);
    // Reset to first page so they see the newly added store
    setCurrentPage(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = [...data];
        newData[index] = { ...newData[index], image: reader.result as string };
        setData(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-6">Loading stores data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl flex items-center gap-2">
          <MapPin className="text-brand-500" /> Store Locator Management
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddStore}
            className="flex items-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Plus size={18} /> Add New Store
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
        {data.length === 0 && <p className="text-gray-500">No stores found.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentData.map((store, i) => {
            const actualIndex = startIndex + i;
            return (
            <div key={actualIndex} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-white/[0.02] flex flex-col">
              {/* Image Preview */}
              <div className="h-40 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center group p-4 shrink-0">
                {store.image ? (
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs">No Store Image</span>
                  </div>
                )}
                
                {/* Image Upload Overlay (Hover) */}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-medium">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, actualIndex)} />
                </label>

                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this store?')) {
                        const newData = data.filter((_, idx) => idx !== actualIndex);
                        setData(newData);
                        if (newData.length > 0 && Math.ceil(newData.length / itemsPerPage) < currentPage) {
                        setCurrentPage(Math.max(currentPage - 1, 1));
                        }
                    }
                  }} 
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full text-red-500 hover:text-red-700 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Store"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* Form Controls */}
              <div className="p-4 space-y-4 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Store Name</label>
                    <input
                        type="text"
                        value={store.name}
                        onChange={(e) => updateField(actualIndex, 'name', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="e.g. LOT Mobiles (Madhapur)"
                    />
                    </div>

                    <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Address</label>
                    <textarea
                        value={store.address}
                        onChange={(e) => updateField(actualIndex, 'address', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors min-h-[60px]"
                        placeholder="Full Address"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Phone</label>
                    <input
                        type="text"
                        value={store.phone}
                        onChange={(e) => updateField(actualIndex, 'phone', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="Phone Number"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Email</label>
                    <input
                        type="email"
                        value={store.email}
                        onChange={(e) => updateField(actualIndex, 'email', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="Email Address"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">City</label>
                    <input
                        type="text"
                        value={store.city}
                        onChange={(e) => updateField(actualIndex, 'city', e.target.value)}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="City"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Rating</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={store.rating || ''}
                        onChange={(e) => updateField(actualIndex, 'rating', parseFloat(e.target.value))}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="e.g. 4.5"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Latitude</label>
                    <input
                        type="number"
                        step="any"
                        value={store.lat || ''}
                        onChange={(e) => updateField(actualIndex, 'lat', parseFloat(e.target.value))}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="Latitude"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Longitude</label>
                    <input
                        type="number"
                        step="any"
                        value={store.lng || ''}
                        onChange={(e) => updateField(actualIndex, 'lng', parseFloat(e.target.value))}
                        className="w-full text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                        placeholder="Longitude"
                    />
                    </div>
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
              Showing {data.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} stores
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm font-medium px-2">
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
