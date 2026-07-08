"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Camera, User, Phone, MapPin, Mail, Briefcase, Calendar, CheckCircle, ChevronLeft, ChevronRight, Eye, Search, LayoutList, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(d => {
        setData(d || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load customers data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Customers saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddCustomer = () => {
    const newId = `customer-${Date.now()}`;
    const newCustomer = {
      id: newId,
      name: 'New Customer',
      email: 'customer@example.com',
      avatar: '',
      sex: 'Male',
      mobile: '0000000000',
      location: 'City, Country',
      accountType: 'Customer',
      status: 'Active',
      department: 'General',
      memberSince: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      emailVerified: false
    };
    setData([newCustomer, ...data]);
    setCurrentPage(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = [...data];
        newData[index] = { ...newData[index], avatar: reader.result as string };
        setData(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pagination logic
  const filteredData = data.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-6">Loading customers data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Customers Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer profiles and account details.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleAddCustomer}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors whitespace-nowrap"
          >
            <Plus size={18} /> Add New Customer
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
        <div className="flex items-center p-1 bg-gray-100 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            title="List View"
          >
            <LayoutList size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredData.length === 0 && (
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 text-center text-gray-500 border border-gray-200 dark:border-gray-800">
            No customers found.
          </div>
        )}
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currentData.map((customer, i) => {
              const actualIndex = data.findIndex(c => c.id === customer.id);
              return (
                <div key={customer.id} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-6">
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <Link 
                      href={`/customers/${customer.id}`}
                      className="text-gray-400 hover:text-brand-500 transition-colors p-2"
                      title="View Customer Details"
                    >
                      <Eye size={18} />
                    </Link>
                    <button 
                      onClick={() => {
                        if(confirm('Are you sure you want to delete this customer?')) {
                          const newData = data.filter((_, idx) => idx !== actualIndex);
                          setData(newData);
                        }
                      }} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Delete Customer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-5 pr-10">
                    <div className="w-20 h-20 rounded-full border-4 border-gray-50 dark:border-gray-800 overflow-hidden relative group shrink-0">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                          <User size={32} />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                        <Camera size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, actualIndex)} />
                      </label>
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, name: e.target.value };
                          setData(newData);
                        }}
                        className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none w-full truncate pb-1 transition-colors"
                        placeholder="Customer Name"
                      />
                      <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                        <Mail size={14} />
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[actualIndex] = { ...customer, email: e.target.value };
                            setData(newData);
                          }}
                          className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none w-full truncate pb-1 transition-colors"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <div>
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><Phone size={12} /> Mobile</p>
                      <input
                        type="text"
                        value={customer.mobile}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, mobile: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><MapPin size={12} /> Location</p>
                      <input
                        type="text"
                        value={customer.location}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, location: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><Briefcase size={12} /> Account Type</p>
                      <select
                        value={customer.accountType}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, accountType: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      >
                        <option className="dark:bg-gray-800" value="Customer">Customer</option>
                        <option className="dark:bg-gray-800" value="Admin">Admin</option>
                        <option className="dark:bg-gray-800" value="Staff">Staff</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                      <select
                        value={customer.status}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, status: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      >
                        <option className="dark:bg-gray-800" value="Active">Active</option>
                        <option className="dark:bg-gray-800" value="Inactive">Inactive</option>
                        <option className="dark:bg-gray-800" value="Suspended">Suspended</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Department</p>
                      <input
                        type="text"
                        value={customer.department}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, department: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><Calendar size={12} /> Member Since</p>
                      <input
                        type="text"
                        value={customer.memberSince}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, memberSince: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      />
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Sex</p>
                      <select
                        value={customer.sex}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, sex: e.target.value };
                          setData(newData);
                        }}
                        className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                      >
                        <option className="dark:bg-gray-800" value="Male">Male</option>
                        <option className="dark:bg-gray-800" value="Female">Female</option>
                        <option className="dark:bg-gray-800" value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">Verification</p>
                      <button
                        onClick={() => {
                          const newData = [...data];
                          newData[actualIndex] = { ...customer, emailVerified: !customer.emailVerified };
                          setData(newData);
                        }}
                        className={`flex items-center gap-1.5 text-sm font-bold pb-1 transition-colors ${customer.emailVerified ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                      >
                        <CheckCircle size={16} />
                        {customer.emailVerified ? 'Email Verified' : 'Unverified'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-max">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status / Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((customer, i) => {
                  const actualIndex = data.findIndex(c => c.id === customer.id);
                  return (
                    <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 relative group border-2 border-white dark:border-gray-700 shadow-sm">
                            {customer.avatar ? (
                              <img src={customer.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={20} />
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                              <Camera size={12} />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, actualIndex)} />
                            </label>
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <input
                              type="text"
                              value={customer.name}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[actualIndex] = { ...customer, name: e.target.value };
                                setData(newData);
                              }}
                              className="font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none transition-colors w-full sm:w-48 truncate"
                              placeholder="Customer Name"
                            />
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail size={12} />
                              <input
                                type="email"
                                value={customer.email}
                                onChange={(e) => {
                                  const newData = [...data];
                                  newData[actualIndex] = { ...customer, email: e.target.value };
                                  setData(newData);
                                }}
                                className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none transition-colors w-full sm:w-44 truncate"
                                placeholder="Email Address"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400 shrink-0" />
                            <input
                              type="text"
                              value={customer.mobile}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[actualIndex] = { ...customer, mobile: e.target.value };
                                setData(newData);
                              }}
                              className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none transition-colors w-32"
                              placeholder="Phone Number"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            <input
                              type="text"
                              value={customer.location}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[actualIndex] = { ...customer, location: e.target.value };
                                setData(newData);
                              }}
                              className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none transition-colors w-32"
                              placeholder="Location"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <select
                            value={customer.status}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[actualIndex] = { ...customer, status: e.target.value };
                              setData(newData);
                            }}
                            className={`text-xs font-semibold rounded-md focus:outline-none px-2 py-1 w-28 appearance-none cursor-pointer border ${
                              customer.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800/30' :
                              customer.status === 'Inactive' ? 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700' :
                              'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <Briefcase size={12} className="shrink-0" />
                            <select
                              value={customer.accountType}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[actualIndex] = { ...customer, accountType: e.target.value };
                                setData(newData);
                              }}
                              className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none transition-colors cursor-pointer"
                            >
                              <option className="dark:bg-gray-800" value="Customer">Customer</option>
                              <option className="dark:bg-gray-800" value="Admin">Admin</option>
                              <option className="dark:bg-gray-800" value="Staff">Staff</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/customers/${customer.id}`}
                            className="p-2 text-gray-400 hover:text-brand-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                            title="View Customer Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this customer?')) {
                                const newData = data.filter((_, idx) => idx !== actualIndex);
                                setData(newData);
                              }
                            }} 
                            className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-gray-800 mt-6">
            <span className="text-sm text-gray-500">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} customers
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
