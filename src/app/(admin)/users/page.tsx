"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Camera, User, Phone, MapPin, Mail, Briefcase, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(d => {
        setData(d || []);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load users data');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Users saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
    setSaving(false);
  };

  const handleAddUser = () => {
    const newId = `user-${Date.now()}`;
    const newUser = {
      id: newId,
      name: 'New User',
      email: 'user@example.com',
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
    // LIFO: Add to the beginning of the array
    setData([newUser, ...data]);
    // Reset to first page so they see the newly added user
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
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-6">Loading users data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer profiles and account details.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Plus size={18} /> Add New User
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

      <div className="space-y-6">
        {data.length === 0 && (
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 text-center text-gray-500 border border-gray-200 dark:border-gray-800">
            No users found. Add a new user to get started.
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {currentData.map((user, i) => {
            const actualIndex = startIndex + i;
            return (
              <div key={actualIndex} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-6">
                
                {/* Delete Button */}
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this user?')) {
                      const newData = data.filter((_, idx) => idx !== actualIndex);
                      setData(newData);
                      if (newData.length > 0 && Math.ceil(newData.length / itemsPerPage) < currentPage) {
                        setCurrentPage(Math.max(currentPage - 1, 1));
                      }
                    }
                  }} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2"
                  title="Delete User"
                >
                  <Trash2 size={18} />
                </button>

                {/* Profile Header section */}
                <div className="flex items-center gap-5 pr-10">
                  <div className="w-20 h-20 rounded-full border-4 border-gray-50 dark:border-gray-800 overflow-hidden relative group shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
                      value={user.name}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, name: e.target.value };
                        setData(newData);
                      }}
                      className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none w-full truncate pb-1 transition-colors"
                      placeholder="User Name"
                    />
                    <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                      <Mail size={14} />
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[actualIndex] = { ...user, email: e.target.value };
                          setData(newData);
                        }}
                        className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none w-full truncate pb-1 transition-colors"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                  
                  {/* Phone */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><Phone size={12} /> Mobile</p>
                    <input
                      type="text"
                      value={user.mobile}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, mobile: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><MapPin size={12} /> Location</p>
                    <input
                      type="text"
                      value={user.location}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, location: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><Briefcase size={12} /> Account Type</p>
                    <select
                      value={user.accountType}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, accountType: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    >
                      <option className="dark:bg-gray-800" value="Customer">Customer</option>
                      <option className="dark:bg-gray-800" value="Admin">Admin</option>
                      <option className="dark:bg-gray-800" value="Staff">Staff</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                    <select
                      value={user.status}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, status: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    >
                      <option className="dark:bg-gray-800" value="Active">Active</option>
                      <option className="dark:bg-gray-800" value="Inactive">Inactive</option>
                      <option className="dark:bg-gray-800" value="Suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Department</p>
                    <input
                      type="text"
                      value={user.department}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, department: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    />
                  </div>

                  {/* Member Since */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1"><Calendar size={12} /> Member Since</p>
                    <input
                      type="text"
                      value={user.memberSince}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, memberSince: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    />
                  </div>
                  
                  {/* Sex */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Sex</p>
                    <select
                      value={user.sex}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, sex: e.target.value };
                        setData(newData);
                      }}
                      className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:outline-none pb-1"
                    >
                      <option className="dark:bg-gray-800" value="Male">Male</option>
                      <option className="dark:bg-gray-800" value="Female">Female</option>
                      <option className="dark:bg-gray-800" value="Other">Other</option>
                    </select>
                  </div>

                  {/* Email Verification Toggle */}
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">Verification</p>
                    <button
                      onClick={() => {
                        const newData = [...data];
                        newData[actualIndex] = { ...user, emailVerified: !user.emailVerified };
                        setData(newData);
                      }}
                      className={`flex items-center gap-1.5 text-sm font-bold pb-1 transition-colors ${user.emailVerified ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                    >
                      <CheckCircle size={16} />
                      {user.emailVerified ? 'Email Verified' : 'Unverified'}
                    </button>
                  </div>
                  
                </div>

              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-gray-800 mt-6">
            <span className="text-sm text-gray-500">
              Showing {data.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} users
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
