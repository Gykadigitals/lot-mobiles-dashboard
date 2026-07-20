import React from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { OrderRecord } from '@/data/mockOrders';

interface OrderSummaryCardsProps {
  orders: OrderRecord[];
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.amount, 0);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingBag className="w-6 h-6 text-brand-500" />,
      bgColor: 'bg-brand-50 dark:bg-brand-500/10',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      title: 'Cancelled Orders',
      value: cancelledOrders,
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      bgColor: 'bg-red-50 dark:bg-red-500/10',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
