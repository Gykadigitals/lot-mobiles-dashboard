import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { PaymentMetrics } from "@/components/payments/PaymentMetrics";
import { PaymentAnalytics } from "@/components/payments/PaymentAnalytics";

export const metadata: Metadata = {
  title: "Main Dashboard | LOT Mobiles Admin Dashboard",
  description: "Comprehensive Overview Dashboard for LOT Mobiles Admin",
};

export default function MainDashboard() {
  return (
    <div className="space-y-10">
      {/* Overview Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white/90">
          General Overview
        </h2>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-12">
             <EcommerceMetrics />
          </div>
          <div className="col-span-12 xl:col-span-12 mt-6">
             <PaymentMetrics />
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-800" />

      {/* Analytics Highlights */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white/90">
          Analytics Highlights
        </h2>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-6">
            <MonthlySalesChart />
          </div>
          <div className="col-span-12 space-y-6 xl:col-span-6">
            <PaymentAnalytics />
          </div>
        </div>
      </div>
    </div>
  );
}
