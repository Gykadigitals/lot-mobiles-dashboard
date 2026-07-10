"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, LayoutGrid, LayoutList, Edit, ChevronLeft, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { Product } from '@/types/product';

const COLUMNS = [
  { label: 'Product ID', key: 'id' },
  { label: 'Product Thumbnail', key: 'thumbnail' },
  { label: 'Product Name', key: 'name' },
  { label: 'Product Type', key: 'productType' },
  { label: 'Attribute Set', key: 'attributeSet' },
  { label: 'SKU', key: 'sku' },
  { label: 'Price', key: 'price' },
  { label: 'Categories', key: 'categories' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Salable Quantity', key: 'salableQuantity' },
  { label: 'Visibility', key: 'visibility' },
  { label: 'Status', key: 'status' },
  { label: 'Pre-Order Product', key: 'preOrderProduct' },
  { label: 'Product Types', key: 'productTypes' },
  { label: 'RAM', key: 'ram' },
  { label: 'Internal Storage', key: 'internalStorage' },
  { label: 'Bluetooth', key: 'bluetooth' },
  { label: 'Display Resolution', key: 'displayResolution' },
  { label: 'Display Size', key: 'displaySize' },
  { label: 'Display Type', key: 'displayType' },
  { label: 'Expandable Storage', key: 'expandableStorage' },
  { label: 'Network Type', key: 'networkType' },
  { label: 'Operating System', key: 'operatingSystem' },
  { label: 'Primary Camera', key: 'primaryCamera' },
  { label: 'Processor', key: 'processor' },
  { label: 'Sensors', key: 'sensors' },
  { label: 'Express Delivery', key: 'expressDelivery' },
  { label: 'Technology', key: 'technology' },
  { label: 'Dimensions', key: 'dimensions' },
  { label: 'Item Weight', key: 'itemWeight' },
  { label: 'SIM', key: 'sim' },
  { label: 'Model Name', key: 'modelName' },
  { label: 'Manufacturer\'s Details', key: 'manufacturersDetails' },
  { label: 'Packer\'s Details', key: 'packersDetails' },
  { label: 'Email Us', key: 'emailUs' },
  { label: 'Contact Us', key: 'contactUs' },
  { label: 'Importer\'s Details', key: 'importersDetails' },
  { label: 'Processor Family', key: 'processorFamily' },
  { label: 'Mobile Security', key: 'mobileSecurity' },
  { label: 'BodyGuard Professional', key: 'bodyGuardProfessional' },
  { label: 'BodyGuard Type', key: 'bodyGuardType' },
  { label: 'Date First Available', key: 'dateFirstAvailable' },
  { label: 'Screen Resolution', key: 'screenResolution' },
  { label: 'Refresh Rate', key: 'refreshRate' },
  { label: 'W × H × D', key: 'whd' },
  { label: 'Charging Type', key: 'chargingType' },
  { label: 'Primary Camera Features', key: 'primaryCameraFeatures' },
  { label: 'Secondary Camera Features', key: 'secondaryCameraFeatures' },
  { label: 'Connectivity', key: 'connectivity' },
  { label: 'Audio Formats', key: 'audioFormats' },
  { label: 'Video Formats', key: 'videoFormats' },
  { label: 'Special Features', key: 'specialFeatures' },
  { label: 'Audio Jack', key: 'audioJack' },
  { label: 'In the Box', key: 'inTheBox' },
  { label: 'Warranty Summary', key: 'warrantySummary' },
  { label: 'Generic Name', key: 'genericName' },
  { label: 'Not Covered in Warranty', key: 'notCoveredInWarranty' },
  { label: 'Gift', key: 'gift' },
  { label: 'Brand', key: 'brand' },
  { label: 'Websites', key: 'websites' },
  { label: 'Last Updated At', key: 'lastUpdatedAt' },
];

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');

  // LIFO sort
  const sortedProducts = useMemo(() => {
    return [...mockProducts].sort((a, b) => {
      // Assuming higher ID numbers or newer lastUpdatedAt means it was added later
      return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.id.toLowerCase().includes(searchQuery.toLowerCase());
                            
      const matchesCategory = selectedCategory === 'All' || product.categories.includes(selectedCategory);
      const matchesSubCategory = selectedSubCategory === 'All' || product.categories.includes(selectedSubCategory);
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      // Add model filtering if needed based on product.modelName
      
      return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand;
    });
  }, [sortedProducts, searchQuery, selectedCategory, selectedSubCategory, selectedBrand]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadgeColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  const renderCellContent = (product: any, key: string) => {
    if (key === 'thumbnail') {
      return (
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img src={product[key]} alt="thumbnail" className="w-full h-full object-cover" />
        </div>
      );
    }
    if (key === 'status') {
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(product[key])}`}>
          {product[key]}
        </span>
      );
    }
    if (key === 'categories') {
      return product[key]?.join(', ') || '-';
    }
    if (key === 'price') {
      return `$${product[key]?.toFixed(2) || '0.00'}`;
    }
    if (typeof product[key] === 'boolean') {
      return product[key] ? 'Yes' : 'No';
    }
    if (key === 'lastUpdatedAt') {
      return new Date(product[key]).toLocaleString();
    }
    return product[key] || '-';
  };

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all products across different categories.</p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <Link
            href="/products/add"
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters & Search Area */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, SKU or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filters:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('All');
                setSelectedBrand('All');
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="Accessories">Accessories</option>
              <option value="Appliances">Appliances</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Tablet">Tablet</option>
              <option value="Laptops">Laptops</option>
              <option value="Smart Watch">Smart Watch</option>
              <option value="Smart TV">Smart TV</option>
            </select>

            {selectedCategory === 'Mobiles' && (
              <select
                value={selectedSubCategory}
                onChange={(e) => {
                  setSelectedSubCategory(e.target.value);
                  setSelectedBrand('All');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="iPhones">iPhones</option>
                <option value="Android Phones">Android Phones</option>
                <option value="Feature Phones">Feature Phones</option>
              </select>
            )}

            {/* View toggles */}
            <div className="flex items-center ml-auto xl:ml-0 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="List View"
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col w-full relative">
          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="px-6 py-4 font-semibold">{col.label}</th>
                  ))}
                  <th className="px-6 py-4 font-semibold sticky right-0 bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-gray-100 dark:border-gray-800 z-10">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors whitespace-nowrap group">
                      {COLUMNS.map((col) => (
                        <td key={col.key} className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {renderCellContent(product, col.key)}
                        </td>
                      ))}
                      <td className="px-6 py-4 sticky right-0 bg-white dark:bg-[#111827] group-hover:bg-gray-50/50 dark:group-hover:bg-gray-800/30 transition-colors shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-gray-100 dark:border-gray-800 z-10 text-center">
                        <Link 
                          href={`/products/${product.id}`}
                          className="inline-flex items-center justify-center p-2 text-brand-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} className="px-6 py-10 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map(product => (
            <div key={product.id} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              <div className="w-full h-40 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <img src={product.thumbnail} alt={product.name} className="h-full object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate mb-1" title={product.name}>{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{product.sku}</p>
                <div className="text-brand-500 font-bold text-lg mb-4">${product.price.toFixed(2)}</div>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Category</div>
                  <div className="text-gray-900 dark:text-gray-300 font-medium text-right truncate" title={product.categories.join(', ')}>{product.categories[product.categories.length - 1]}</div>
                  <div className="text-gray-500 dark:text-gray-400">Stock</div>
                  <div className="text-gray-900 dark:text-gray-300 font-medium text-right">{product.quantity}</div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  Updated: {new Date(product.lastUpdatedAt).toLocaleDateString()}
                </div>
                <Link 
                  href={`/products/${product.id}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Edit size={16} /> Edit
                </Link>
              </div>
            </div>
          ))}
          {currentProducts.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800">
              No products found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <div className="hidden sm:flex flex-1 items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium text-gray-900 dark:text-white">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${
                      currentPage === idx + 1 
                        ? 'z-10 bg-brand-500 text-white focus-visible:outline-brand-600' 
                        : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
          
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
}
