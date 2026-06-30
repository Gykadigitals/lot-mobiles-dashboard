"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { mockPayments, PaymentRecord } from "@/data/mockPayments";

export const PaymentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = mockPayments.filter(
    (payment) =>
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Payments
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by Order ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-theme-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
          />
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Export CSV
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Payment ID</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Order ID</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Customer</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Method</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Amount</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Gateway</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredPayments.map((payment: PaymentRecord) => (
              <TableRow key={payment.id}>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                  {payment.id}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.orderId}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-theme-sm dark:text-white/90 font-medium">{payment.customerName}</span>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">{payment.customerEmail}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.paymentMethod}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 font-medium">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
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
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.gateway}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(payment.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-3 text-end">
                  <Link 
                    href={`/payments/${payment.id}`}
                    className="text-brand-500 hover:text-brand-600 text-theme-sm font-medium"
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredPayments.length === 0 && (
               <TableRow>
                 <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400" colSpan={9}>
                   No payments found.
                 </TableCell>
               </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
