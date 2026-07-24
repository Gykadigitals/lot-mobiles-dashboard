"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { navItems, othersItems } from '@/layout/AppSidebar';
import { RouteCheckboxTree } from '@/components/roles/RouteCheckboxTree';

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [roleName, setRoleName] = useState('');
  const [roleRoutes, setRoleRoutes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const mockRoleName = id === '1' ? 'ADMINISTRATOR' 
                       : id === '2' ? 'PRODUCT_MANAGER' 
                       : `ROLE_${id}`;
    
    const mockRoutes = ['/', '/sales-analytics', '/users'];
    
    setRoleName(mockRoleName);
    setRoleRoutes(mockRoutes);
    setIsLoading(false);
  }, [id]);

  const handleRouteToggle = (route: string) => {
    setRoleRoutes(prev => 
      prev.includes(route) 
        ? prev.filter(r => r !== route)
        : [...prev, route]
    );
  };

  const handleEditRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API update call
      await new Promise(resolve => setTimeout(resolve, 600));
      router.push('/roles');
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role. Going back to list.");
      router.push('/roles');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-gray-500">Loading role details...</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Edit Role
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
              Edit Role
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleEditRoleSubmit} className="flex flex-col gap-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role Name</label>
            <input
              type="text"
              required
              placeholder="e.g. MARKETING MANAGER"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Spaces will be automatically converted to underscores.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accessible Pages</label>
            <div className="overflow-y-auto pr-2 custom-scrollbar border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-[#111827]/50 max-w-2xl">
              <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</div>
              <RouteCheckboxTree items={navItems} selectedRoutes={roleRoutes} onToggle={handleRouteToggle} />
              
              <div className="mt-6 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings & Others</div>
              <RouteCheckboxTree items={othersItems} selectedRoutes={roleRoutes} onToggle={handleRouteToggle} />
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
