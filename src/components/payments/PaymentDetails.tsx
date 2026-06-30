import React from "react";
import { PaymentRecord } from "@/data/mockPayments";
import Badge from "../ui/badge/Badge";

interface PaymentDetailsProps {
  payment: PaymentRecord;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Details */}
      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
              <p className="font-medium text-gray-800 dark:text-white/90">{payment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
              <p className="font-medium text-brand-500 hover:underline cursor-pointer">{payment.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
              <p className="font-medium text-gray-800 dark:text-white/90">${payment.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <div className="mt-1">
                <Badge
                  size="sm"
                  color={
                    payment.status === "Successful"
                      ? "success"
                      : payment.status === "Pending"
                      ? "warning"
                      : payment.status === "Refunded"
                      ? "light"
                      : "error"
                  }
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
              <p className="font-medium text-gray-800 dark:text-white/90">{new Date(payment.date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
              <p className="font-medium text-gray-800 dark:text-white/90">{payment.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Gateway Response & Timeline
          </h3>
          <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 space-y-6">
            <div className="pl-6 relative">
              <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[6.5px] top-1"></div>
              <p className="font-medium text-gray-800 dark:text-white/90">Payment Initiated</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(payment.date).toLocaleString()}</p>
            </div>
            <div className="pl-6 relative">
              <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1 ${payment.status === 'Successful' ? 'bg-success-500' : payment.status === 'Failed' ? 'bg-error-500' : 'bg-warning-500'}`}></div>
              <p className="font-medium text-gray-800 dark:text-white/90">Gateway: {payment.gateway}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID: {payment.transactionId}</p>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300">
                {`{
  "status": "${payment.status.toLowerCase()}",
  "id": "${payment.transactionId}",
  "object": "charge",
  "amount": ${payment.amount * 100},
  "currency": "usd"
}`}
              </div>
            </div>
            {payment.status === "Successful" && (
              <div className="pl-6 relative">
                <div className="absolute w-3 h-3 bg-success-500 rounded-full -left-[6.5px] top-1"></div>
                <p className="font-medium text-gray-800 dark:text-white/90">Payment Completed</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Funds have been captured.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Details */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Customer Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-800 dark:text-white/90">{payment.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-800 dark:text-white/90">{payment.customerEmail}</p>
            </div>
            <div>
              <button className="w-full mt-2 inline-flex justify-center items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                View Customer Profile
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-brand-500 px-4 py-2 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
              Download Receipt
            </button>
            {payment.status === "Successful" && (
              <button className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-error-500 bg-transparent px-4 py-2 text-theme-sm font-medium text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10">
                Issue Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
