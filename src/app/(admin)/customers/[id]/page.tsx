"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, User, Package, Heart, Truck, ShoppingCart, Mail, Phone, MapPin, Briefcase, Calendar, CheckCircle } from 'lucide-react';
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
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Wishlist Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-300">
              <Heart size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">iPhone 15 Pro Max</p>
              <p className="text-sm text-gray-500">₹1,59,900</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartTab() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Cart</h2>
      <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
        {[1, 2].map(i => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-300">
                <Package size={24} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Samsung Galaxy S24 Ultra</p>
                <p className="text-xs text-gray-500 mt-1">Qty: 1</p>
              </div>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">₹1,29,999</p>
          </div>
        ))}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <p className="font-medium text-gray-900 dark:text-white">Total Estimated Value</p>
          <p className="font-bold text-brand-500 text-lg">₹2,59,998</p>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
      <div className="flex-1 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#ORD-00123</td>
              <td className="px-6 py-4">12 Oct 2024</td>
              <td className="px-6 py-4">₹45,999</td>
              <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Delivered</span></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#ORD-00115</td>
              <td className="px-6 py-4">05 Sep 2024</td>
              <td className="px-6 py-4">₹1,299</td>
              <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Shipped</span></td>
            </tr>
          </tbody>
        </table>
      </div>
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


