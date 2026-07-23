"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, User, Shield, Mail, Phone, LayoutGrid, LayoutList, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { Role, RouteAccess } from '@/lib/auth/roles';
import { navItems } from '@/layout/AppSidebar';

// Helper to flatten nav items into just the paths and names
const extractRoutes = (items: any[]): { name: string, path: string }[] => {
  let routes: { name: string, path: string }[] = [];
  items.forEach(item => {
    if (item.path) {
      routes.push({ name: item.name, path: item.path });
    }
    if (item.subItems) {
      routes = [...routes, ...extractRoutes(item.subItems)];
    }
  });
  return routes;
};

const allSidebarRoutes = extractRoutes(navItems);

// Mock data for users
const initialUsers = [
  {
    id: 'USR-001',
    name: 'Admin User',
    email: 'admin@lotmobiles.com',
    phone: '+91 9876543210',
    role: 'ADMINISTRATOR' as Role,
    status: 'Active',
    avatar: '',
  },
  {
    id: 'USR-002',
    name: 'Sales Manager',
    email: 'sales@lotmobiles.com',
    phone: '+91 9876543211',
    role: 'SALES_MANAGER' as Role,
    status: 'Active',
    avatar: '',
  },
  {
    id: 'USR-003',
    name: 'HR Manager',
    email: 'hr@lotmobiles.com',
    phone: '+91 9876543212',
    role: 'HR' as Role,
    status: 'Inactive',
    avatar: '',
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'PRODUCT_MANAGER' as Role,
  });

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    "ADMINISTRATOR",
    "PRODUCT_MANAGER",
    "SALES_MANAGER",
    "MIS",
    "ORDER_MANAGEMENT",
    "HR"
  ]);
  const [newRoleRoutes, setNewRoleRoutes] = useState<string[]>([]);

  // To simulate logged in user's role (For requirement: Only Admin can create Admin)
  const loggedInUserRole: Role = 'ADMINISTRATOR';

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMINISTRATOR': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'PRODUCT_MANAGER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'SALES_MANAGER': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'HR': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `USR-00${users.length + 1}`,
      name: newUserFormData.name || 'New User',
      email: newUserFormData.email || 'newuser@lotmobiles.com',
      phone: newUserFormData.phone,
      role: newUserFormData.role as Role,
      status: 'Active',
      avatar: '',
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setNewUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'PRODUCT_MANAGER' as Role,
    });
  };

  const handleAddRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoleName && !availableRoles.includes(newRoleName)) {
      setAvailableRoles([...availableRoles, newRoleName]);
      // If this was hooked to a backend, we would also save the newRoleRoutes here.
    }
    setShowAddRoleModal(false);
    setNewRoleName('');
    setNewRoleRoutes([]);
  };

  const handleRouteToggle = (route: string) => {
    setNewRoleRoutes(prev => 
      prev.includes(route) 
        ? prev.filter(r => r !== route)
        : [...prev, route]
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Role Based Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system administrators and staff access.</p>
        </div>
        <div className="flex items-center gap-3">
          {loggedInUserRole === 'ADMINISTRATOR' && (
            <>
              <button
                onClick={() => setShowAddRoleModal(true)}
                className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add New Role
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add New User
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
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

      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <Mail size={14} className="text-gray-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <Phone size={14} className="text-gray-400" /> {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/users/${user.id}`}
                        className="px-3 py-1.5 text-brand-500 hover:text-brand-600 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 rounded-lg text-xs font-medium transition-colors"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <div key={user.id} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete User"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Shield size={16} className="text-gray-400 shrink-0" />
                  <span>ID: {user.id}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 text-xs font-semibold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {user.status}
                </span>
                <Link
                  href={`/users/${user.id}`}
                  className="px-4 py-2 text-brand-500 hover:text-white font-medium text-sm bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-500 rounded-lg transition-colors"
                >
                  Manage User
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-gray-500 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800">No users found.</div>
          )}
        </div>
      )}

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New User</h2>

            <form onSubmit={handleAddUserSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={newUserFormData.name}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9000000000"
                  value={newUserFormData.phone}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type of Role</label>
                <select
                  value={newUserFormData.role}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, role: e.target.value as Role })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm appearance-none"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>
                      {role.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowAddRoleModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Role</h2>

            <form onSubmit={handleAddRoleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MARKETING MANAGER"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">Spaces will be automatically converted to underscores.</p>
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accessible Pages</label>
                <div className="max-h-52 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar border border-gray-200 dark:border-gray-800 rounded-xl p-3 bg-gray-50/50 dark:bg-[#111827]/50">
                  {allSidebarRoutes.map((routeObj, idx) => (
                    <label key={`${routeObj.path}-${idx}`} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all">
                      <input 
                        type="checkbox" 
                        checked={newRoleRoutes.includes(routeObj.path)}
                        onChange={() => handleRouteToggle(routeObj.path)}
                        className="w-4 h-4 text-brand-500 rounded border-gray-300 dark:border-gray-600 focus:ring-brand-500 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{routeObj.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
