import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const PaymentMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-900/20">
          <BoxIconLine className="text-brand-500 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              $124,563.00
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            14.5%
          </Badge>
        </div>
      </div>

      {/* Successful Payments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-success-50 rounded-xl dark:bg-success-900/20">
          <GroupIcon className="text-success-500 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Successful</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              1,245
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            8.2%
          </Badge>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-warning-50 rounded-xl dark:bg-warning-900/20">
          <BoxIconLine className="text-warning-500 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              34
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            2.1%
          </Badge>
        </div>
      </div>

      {/* Failed Payments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-error-50 rounded-xl dark:bg-error-900/20">
          <GroupIcon className="text-error-500 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Failed/Refunded</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              12
            </h4>
          </div>
          <Badge color="success">
            <ArrowDownIcon className="text-success-500" />
            0.5%
          </Badge>
        </div>
      </div>
    </div>
  );
};
