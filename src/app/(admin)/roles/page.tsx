"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Shield, Edit, Trash2, Eye } from 'lucide-react';
import { RoleService } from '@/services/role.service';

// Mock data for roles until backend is wired up
const initialRoles = [
  { id: '1', name: 'ADMINISTRATOR', userCount: 3, status: 'Active' },
  { id: '2', name: 'PRODUCT_MANAGER', userCount: 5, status: 'Active' },
  { id: '3', name: 'SALES_MANAGER', userCount: 12, status: 'Active' },
  { id: '4', name: 'MIS', userCount: 2, status: 'Active' },
  { id: '5', name: 'ORDER_MANAGEMENT', userCount: 8, status: 'Active' },
  { id: '6', name: 'HR', userCount: 4, status: 'Active' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'ADMINISTRATOR': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'PRODUCT_MANAGER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'SALES_MANAGER': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'HR': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Role Management
        </h2>
        
        <div className="flex items-center gap-4">
          <nav>
            <ol className="flex items-center gap-1.5">
              <li>
                <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500" href="/">
                  Home
                  <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </Link>
              </li>
              <li className="text-sm text-gray-800 dark:text-white/90">
                Role Management
              </li>
            </ol>
          </nav>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

          <Link
            href="/roles/add"
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add New Role
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-max">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Role Name</th>
              <th className="px-6 py-4">Users Assigned</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? filteredRoles.map((role) => (
              <tr key={role.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getRoleBadgeColor(role.name).split(' ')[0]} bg-opacity-20`}>
                      <Shield size={18} className={getRoleBadgeColor(role.name).split(' ')[1]} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleBadgeColor(role.name)}`}>
                      {role.name.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{role.userCount}</span> users
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${role.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${role.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {role.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/roles/${role.id}`}
                      className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                      title="View Role"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/roles/${role.id}/edit`}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Edit Role"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Role"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No roles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
