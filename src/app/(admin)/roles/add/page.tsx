"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { navItems, othersItems } from '@/layout/AppSidebar';
import { RouteCheckboxTree } from '@/components/roles/RouteCheckboxTree';
import { RoleService } from '@/services/role.service';

export default function AddRolePage() {
  const router = useRouter();
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleRoutes, setNewRoleRoutes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRouteToggle = (route: string) => {
    setNewRoleRoutes(prev => 
      prev.includes(route) 
        ? prev.filter(r => r !== route)
        : [...prev, route]
    );
  };

  const handleAddRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    
    setIsSubmitting(true);
    try {
      // Calling our API service
      await RoleService.createRole({ name: newRoleName, permissions: newRoleRoutes });
      router.push('/roles');
    } catch (error) {
      console.error("Failed to create role:", error);
      alert("Failed to save role in backend. Going back to list.");
      router.push('/roles');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Create New Role
        </h2>
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
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500" href="/roles">
                Role Management
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              Create New Role
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleAddRoleSubmit} className="flex flex-col gap-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role Name</label>
            <input
              type="text"
              required
              placeholder="e.g. MARKETING MANAGER"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Spaces will be automatically converted to underscores. Must be unique.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accessible Pages</label>
            <div className="overflow-y-auto pr-2 custom-scrollbar border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-[#111827]/50 max-w-2xl">
              <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</div>
              <RouteCheckboxTree items={navItems} selectedRoutes={newRoleRoutes} onToggle={handleRouteToggle} />
              
              <div className="mt-6 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings & Others</div>
              <RouteCheckboxTree items={othersItems} selectedRoutes={newRoleRoutes} onToggle={handleRouteToggle} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Select the pages this role should have access to in the sidebar.</p>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/roles"
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
