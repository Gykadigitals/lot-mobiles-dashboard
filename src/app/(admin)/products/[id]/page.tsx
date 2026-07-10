import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="mb-6">
        <Link 
          href="/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Products
        </Link>
      </div>
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-4">Edit Product: {params.id}</h1>
        <p className="text-gray-500">Edit form for {params.id} will go here.</p>
      </div>
    </div>
  );
}
