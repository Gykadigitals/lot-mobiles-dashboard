import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PaymentMetrics } from "@/components/payments/PaymentMetrics";
import { PaymentAnalytics } from "@/components/payments/PaymentAnalytics";
import { PaymentTable } from "@/components/payments/PaymentTable";

export const metadata: Metadata = {
  title: "Payment Management | LOT Mobiles Admin Dashboard",
  description: "Manage and track all payments, transactions, and revenue for LOT Mobiles.",
};

export default function PaymentsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Payments" />
      
      <div className="space-y-6">
        <PaymentMetrics />
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <PaymentAnalytics />
        </div>
        <PaymentTable />
      </div>
    </>
  );
}
