"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Shield } from 'lucide-react';
import { navItems, othersItems } from '@/layout/AppSidebar';
import { RouteCheckboxTree } from '@/components/roles/RouteCheckboxTree';

export default function ViewRolePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  // Mock data fetching. In real app, fetch from API.
  const [roleData, setRoleData] = useState<{name: string, routes: string[]} | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const mockRoleName = id === '1' ? 'ADMINISTRATOR' 
                       : id === '2' ? 'PRODUCT_MANAGER' 
                       : `ROLE_${id}`;
    
    // Just some random routes for demo
    const mockRoutes = ['/', '/sales-analytics', '/users'];
    
    setRoleData({
      name: mockRoleName,
      routes: mockRoutes
    });
  }, [id]);

  if (!roleData) return <div className="p-8 text-gray-500">Loading role details...</div>;

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          View Role
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
              <li>
                <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500" href="/roles">
                  Role Management
                  <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </Link>
              </li>
              <li className="text-sm text-gray-800 dark:text-white/90">
                View Role
              </li>
            </ol>
          </nav>
          
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
          
          <Link
            href={`/roles/${id}/edit`}
            className="flex items-center gap-2 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
          >
            <Edit size={16} /> Edit Role
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role Name</label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl">
              <Shield size={20} className="text-brand-500" />
              <span className="font-bold text-gray-900 dark:text-white tracking-wide">
                {roleData.name.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accessible Pages</label>
            <div className="overflow-y-auto pr-2 custom-scrollbar border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-[#111827]/50 max-w-2xl opacity-90">
              <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</div>
              <RouteCheckboxTree items={navItems} selectedRoutes={roleData.routes} readonly={true} />
              
              <div className="mt-6 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings & Others</div>
              <RouteCheckboxTree items={othersItems} selectedRoutes={roleData.routes} readonly={true} />
            </div>
            <p className="text-xs text-gray-500 mt-2">These are the pages this role has access to. Go to edit mode to change them.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
