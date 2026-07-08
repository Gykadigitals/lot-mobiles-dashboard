"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, User, Package, Heart, Truck, ShoppingCart, Mail, Phone, MapPin, Briefcase, Calendar, CheckCircle, Search, LayoutList, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

type TabType = 'Profile' | 'Orders' | 'Wishlist' | 'Order Tracking' | 'Cart';

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('Profile');

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        const foundCustomer = data.find((u: any) => u.id === id);
        if (foundCustomer) {
          setCustomer(foundCustomer);
        } else {
          setError('Customer not found');
        }
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load customer details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Loading customer details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!customer) return <div className="p-6 text-gray-500">Customer not found.</div>;

  const tabs: { name: TabType; icon: any }[] = [
    { name: 'Profile', icon: User },
    { name: 'Wishlist', icon: Heart },
    { name: 'Cart', icon: ShoppingCart },
    { name: 'Orders', icon: Package },
    { name: 'Order Tracking', icon: Truck },
  ];

  return (
    <div className="p-6 w-full mx-auto text-gray-900 dark:text-gray-100 flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/customers')}
            className="p-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-semibold text-brand-500 text-2xl">Customer Details</h1>
            <p className="text-sm text-gray-500">{customer.name}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              // Handle login as customer logic here
              console.log('Login as customer', customer.id);
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#f6a525] text-white dark:text-[#f6a525] dark:bg-[#111827] border border-transparent dark:border-[#f6a525]/30 rounded-lg text-sm font-medium hover:bg-[#d98b1a] hover:text-white dark:hover:bg-[#f6a525]/10 transition-colors flex items-center justify-center gap-2"
          >
            <User size={16} />
            <span className="whitespace-nowrap">Login as Customer</span>
          </button>
          <button
            onClick={() => {
              // Handle order for customer logic here
              console.log('Order for customer', customer.id);
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Package size={16} />
            <span className="whitespace-nowrap">Order for Customer</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-2 border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
        <nav className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 border border-brand-100 dark:border-brand-500/20'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                  }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col gap-6 min-h-[400px]">
        {activeTab === 'Profile' && <ProfileTab customer={customer} />}
        {activeTab === 'Orders' && <OrdersTab />}
        {activeTab === 'Wishlist' && <WishlistTab />}
        {activeTab === 'Order Tracking' && <TrackingTab />}
        {activeTab === 'Cart' && <CartTab />}
      </div>

    </div>
  );
}

function ProfileTab({ customer }: { customer: any }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-800 overflow-hidden shrink-0">
          {customer.avatar ? (
            <img src={customer.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
              <User size={40} />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <Mail size={16} /> {customer.email}
          </p>
          <div className="mt-3 flex gap-2">
            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-500/10 text-brand-600 rounded-full text-xs font-semibold">
              {customer.accountType || 'Customer'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
              }`}>
              {customer.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Phone size={16} /> Mobile</p>
          <p className="font-semibold text-gray-900 dark:text-white">{customer.mobile || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><MapPin size={16} /> Location</p>
          <p className="font-semibold text-gray-900 dark:text-white">{customer.location || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Calendar size={16} /> Member Since</p>
          <p className="font-semibold text-gray-900 dark:text-white">{customer.memberSince || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Briefcase size={16} /> Department</p>
          <p className="font-semibold text-gray-900 dark:text-white">{customer.department || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">Sex</p>
          <p className="font-semibold text-gray-900 dark:text-white">{customer.sex || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">Verification</p>
          <p className={`font-semibold flex items-center gap-1 ${customer.emailVerified ? 'text-green-500' : 'text-red-500'}`}>
            <CheckCircle size={16} />
            {customer.emailVerified ? 'Email Verified' : 'Unverified'}
          </p>
        </div>
      </div>

      {customer.lastLogin && (
        <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-brand-500" />
            Recent Login Activity
          </h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-1">
                <MapPin size={14} className="text-gray-400" />
                {customer.lastLogin.location}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-1">
                {new Date(customer.lastLogin.timestamp).toLocaleString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistTab() {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const allItems = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      qty: 1,
      addedDate: '15 Sep 2024',
      daysInWishlist: 28
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      qty: 1,
      addedDate: '20 Sep 2024',
      daysInWishlist: 23
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      qty: 2,
      addedDate: '01 Oct 2024',
      daysInWishlist: 12
    },
  ];

  const filtered = allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Wishlist Items</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="flex-1 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden overflow-x-auto flex flex-col">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Added Date</th>
                <th className="px-6 py-4">Days in Wishlist</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(item => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        <Heart size={16} className="text-red-500" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.qty}</td>
                  <td className="px-6 py-4">{item.addedDate}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 dark:bg-orange-900/20">
                      {item.daysInWishlist} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => console.log('Add to cart from wishlist', item.id)}
                        className="text-brand-500 hover:text-brand-600 font-medium text-sm transition-colors px-3 py-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 rounded-lg flex items-center gap-1"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => console.log('Remove from wishlist', item.id)}
                        className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No items found matching "{query}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map(item => (
            <div key={item.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white dark:bg-[#111827]">
              <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-2">
                <Heart size={32} className="text-red-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="font-medium">Qty: {item.qty}</span>
                  <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-lg text-xs font-medium">
                    {item.daysInWishlist} days
                  </span>
                </div>
                <p className="text-xs text-gray-400">Added: {item.addedDate}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 gap-3">
                <button
                  onClick={() => console.log('Remove from wishlist', item.id)}
                  className="flex-1 text-red-500 hover:text-red-600 font-medium text-sm transition-colors py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-center"
                >
                  Remove
                </button>
                <button
                  onClick={() => console.log('Add to cart from wishlist', item.id)}
                  className="flex-1 text-white font-medium text-sm transition-colors py-2 bg-brand-500 hover:bg-brand-600 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingCart size={14} />
                  Add
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-gray-500">No items found matching "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}

function CartTab() {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const allItems = [
    {
      id: 1,
      productId: 'PROD-001',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SM-S928B',
      qty: 1,
      price: '₹1,29,999',
      rawPrice: 129999,
      totalPrice: '₹1,29,999'
    },
    {
      id: 2,
      productId: 'PROD-002',
      name: 'Apple 20W USB-C Power Adapter',
      sku: 'MHJA3HN/A',
      qty: 2,
      price: '₹1,900',
      rawPrice: 3800,
      totalPrice: '₹3,800'
    },
  ];

  const filtered = allItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.productId.toLowerCase().includes(query.toLowerCase()) ||
    item.sku.toLowerCase().includes(query.toLowerCase())
  );

  const totalValue = filtered.reduce((acc, item) => acc + item.rawPrice, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Cart</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search cart..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="flex-1 flex flex-col border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-max">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.productId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 shrink-0">
                          <Package size={16} />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.sku}</td>
                    <td className="px-6 py-4">{item.qty}</td>
                    <td className="px-6 py-4">{item.price}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.totalPrice}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => console.log('Remove from cart', item.id)}
                        className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No items found matching "{query}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between sm:justify-end gap-4 mt-auto border-t border-gray-100 dark:border-gray-800">
              <p className="font-medium text-gray-900 dark:text-white">Total Estimated Value:</p>
              <p className="font-bold text-brand-500 text-lg">₹{totalValue.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? filtered.map(item => (
              <div key={item.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white dark:bg-[#111827]">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {item.productId} • SKU: {item.sku}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-medium text-gray-900 dark:text-white">{item.price}</p>
                  </div>
                  <div className="text-center px-4 border-x border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500">Qty</p>
                    <p className="font-medium text-gray-900 dark:text-white">{item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-brand-500">{item.totalPrice}</p>
                  </div>
                </div>

                <button
                  onClick={() => console.log('Remove from cart', item.id)}
                  className="w-full text-red-500 hover:text-red-600 font-medium text-sm transition-colors py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg mt-auto"
                >
                  Remove Item
                </button>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-gray-500">No items found matching "{query}"</div>
            )}
          </div>
          {filtered.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 rounded-xl border border-gray-100 dark:border-gray-800 mt-auto">
              <p className="font-medium text-gray-900 dark:text-white">Total Estimated Value:</p>
              <p className="font-bold text-brand-500 text-xl">₹{totalValue.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const allOrders = [
    {
      id: '#ORD-00123',
      billName: 'John Doe',
      shipToName: 'John Doe',
      date: '12 Oct 2024',
      amount: '₹45,999',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    },
    {
      id: '#ORD-00115',
      billName: 'Jane Smith',
      shipToName: 'Mark Smith',
      date: '05 Sep 2024',
      amount: '₹1,299',
      status: 'Shipped',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    },
  ];

  const filtered = allOrders.filter(order =>
    order.id.toLowerCase().includes(query.toLowerCase()) ||
    order.billName.toLowerCase().includes(query.toLowerCase()) ||
    order.shipToName.toLowerCase().includes(query.toLowerCase()) ||
    order.status.toLowerCase().includes(query.toLowerCase()) ||
    order.amount.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="flex-1 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden overflow-x-auto flex flex-col">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Bill Name</th>
                <th className="px-6 py-4">Ship to name</th>
                <th className="px-6 py-4">Purchased Date</th>
                <th className="px-6 py-4">Order Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(order => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4">{order.billName}</td>
                  <td className="px-6 py-4">{order.shipToName}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.amount}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => console.log('Action for order', order.id)}
                      className="text-brand-500 hover:text-brand-600 font-medium text-sm transition-colors px-3 py-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 rounded-lg"
                    >
                      View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found matching "{query}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map(order => (
            <div key={order.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white dark:bg-[#111827]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.id}</h3>
                  <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 text-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bill to:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.billName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ship to:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.shipToName}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-brand-500 text-lg">{order.amount}</p>
                </div>
                <button
                  onClick={() => console.log('Action for order', order.id)}
                  className="text-brand-500 hover:text-brand-600 font-medium text-sm transition-colors px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 rounded-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-gray-500">No orders found matching "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}

function TrackingTab() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Active Order Tracking</h2>
      <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-6">
        <p className="font-medium text-gray-900 dark:text-white mb-2">Order #ORD-00115</p>
        <p className="text-sm text-gray-500 mb-8">Expected delivery: 15 Oct 2024</p>

        <div className="relative pl-6 space-y-8 border-l-2 border-gray-100 dark:border-gray-800 ml-3">
          <div className="relative">
            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-[#111827]"></div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Order Placed</p>
            <p className="text-xs text-gray-500">05 Sep 2024, 10:30 AM</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-[#111827]"></div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Processing</p>
            <p className="text-xs text-gray-500">06 Sep 2024, 02:15 PM</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-[#111827]"></div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Shipped</p>
            <p className="text-xs text-gray-500">07 Sep 2024, 09:00 AM</p>
          </div>
          <div className="relative opacity-50">
            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-[#111827]"></div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Out for Delivery</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}


