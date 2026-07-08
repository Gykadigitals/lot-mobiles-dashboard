"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, User, Mail, Phone, Shield, Camera, Lock, KeyRound, CheckCircle, Trash2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { Role } from '@/lib/auth/roles';

export default function UserDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  // Mock logged in user context (For requirement: Only Admin can create/manage Admin, role based users can't manage others)
  const loggedInUserRole: Role = 'ADMINISTRATOR';

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for updating password modal/form (simplified for demo)
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // State for toggling password visibility in profile info
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Mock fetching user
    setTimeout(() => {
      setUser({
        id: id,
        name: 'Sales Manager',
        email: 'sales@lotmobiles.com',
        phone: '+91 9876543211',
        password: 'Password123!',
        role: 'SALES_MANAGER',
        status: 'Active',
        avatar: '',
        createdAt: '2024-01-15'
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="p-6">Loading user details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!user) return <div className="p-6 text-gray-500">User not found.</div>;

  const canManage = loggedInUserRole === 'ADMINISTRATOR';

  const handleStatusToggle = () => {
    if (!canManage) return;
    setUser({ ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' });
  };

  const handleDelete = () => {
    if (!canManage) return;
    if (confirm('Are you sure you want to delete this user?')) {
      alert('User deleted successfully');
      router.push('/users');
    }
  };

  const handleForgotPassword = () => {
    if (loggedInUserRole !== 'ADMINISTRATOR') {
      alert('Only Administrators can use the Forgot Password functionality.');
      return;
    }
    alert(`Password reset link sent to ${user.email}`);
  };

  const handleUpdatePassword = () => {
    if (!newPassword) return;
    alert('Password updated successfully');
    setShowPasswordUpdate(false);
    setNewPassword('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canManage) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100 flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              User Details
            </h1>
            <p className="text-sm text-gray-500">Manage role-based user access</p>
          </div>
        </div>
      </div>

      {!canManage && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-100 dark:border-red-800/30">
          <ShieldAlert size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">You do not have permission to manage this user. Only Administrators can manage role based users.</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Avatar & Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-gray-50 dark:border-gray-800 overflow-hidden relative group mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
              {canManage && (
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Camera size={24} />
                  <span className="text-xs mt-1 font-medium">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">{user.email}</p>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
              {user.status}
            </span>
          </div>

          {canManage && (
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Actions</h3>

              <button
                onClick={handleStatusToggle}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border ${user.status === 'Active'
                  ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20'
                  : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:text-green-400 dark:hover:bg-green-900/20'
                  }`}
              >
                <CheckCircle size={16} />
                {user.status === 'Active' ? 'Mark as Inactive' : 'Mark as Active'}
              </button>

              <button
                onClick={handleForgotPassword}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Mail size={16} />
                Send Password Reset
              </button>

              <button
                onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/20"
              >
                <KeyRound size={16} />
                Update Password
              </button>

              <button
                onClick={handleDelete}
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                <Trash2 size={16} />
                Delete User
              </button>
            </div>
          )}
        </div>

        {/* Right Column: User Details Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => canManage && setUser({ ...user, name: e.target.value })}
                    disabled={!canManage}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => canManage && setUser({ ...user, email: e.target.value })}
                    disabled={!canManage}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={user.password || ''}
                    readOnly
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    value={user.phone}
                    onChange={(e) => canManage && setUser({ ...user, phone: e.target.value })}
                    disabled={!canManage}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Shield size={18} />
                  </div>
                  <select
                    value={user.role}
                    onChange={(e) => canManage && setUser({ ...user, role: e.target.value as Role })}
                    disabled={!canManage}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="PRODUCT_MANAGER">Product Manager</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                    <option value="MIS">MIS</option>
                    <option value="ORDER_MANAGEMENT">Order Management</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {user.role === 'ADMINISTRATOR' && "Full access to all system features including user management."}
                  {user.role === 'PRODUCT_MANAGER' && "Can view and manage product catalogs."}
                  {user.role === 'SALES_MANAGER' && "Can view reports, sales data, and manage orders."}
                  {user.role === 'MIS' && "Can view reports, products, and orders."}
                  {user.role === 'ORDER_MANAGEMENT' && "Can manage and view all orders."}
                  {user.role === 'HR' && "Can manage users and system policies."}
                </p>
              </div>
            </div>

            {canManage && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Password Update Form (Conditionally rendered) */}
          {showPasswordUpdate && canManage && (
            <div className="bg-white dark:bg-[#111827] border border-brand-200 dark:border-brand-900/30 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <KeyRound size={20} className="text-brand-500" /> Update Password
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={!newPassword}
                    className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordUpdate(false);
                      setNewPassword('');
                    }}
                    className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
