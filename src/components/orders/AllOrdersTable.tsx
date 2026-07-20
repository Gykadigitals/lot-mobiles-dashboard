"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { OrderRecord } from "@/data/mockOrders";
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp, Search, Filter, LayoutGrid, List as ListIcon } from "lucide-react";

interface AllOrdersTableProps {
  orders: OrderRecord[];
  onUpdateStatus?: (id: string, status: OrderRecord["status"]) => void;
}

export const AllOrdersTable: React.FC<AllOrdersTableProps> = ({ orders, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [deliveryFilter, setDeliveryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  type SortField = "date" | "amount" | "status";
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter and Sort Logic
  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;
        const matchesDelivery = deliveryFilter === "All" || order.deliveryType === deliveryFilter;

        return matchesSearch && matchesStatus && matchesPayment && matchesDelivery;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === "date") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortField === "amount") {
          comparison = a.amount - b.amount;
        } else if (sortField === "status") {
          comparison = a.status.localeCompare(b.status);
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [orders, searchTerm, statusFilter, paymentFilter, deliveryFilter, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to desc on new field
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp size={14} className="ml-1 inline" /> : <ArrowDown size={14} className="ml-1 inline" />;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Table Controls (Search & Filters) */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Order ID, Name, Phone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-theme-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-gray-500" />
            <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-theme-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-theme-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={deliveryFilter}
            onChange={(e) => { setDeliveryFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-theme-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="All">All Deliveries</option>
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
            <option value="Store Pickup">Store Pickup</option>
          </select>
          {/* View Mode Toggle */}
          <div className="flex items-center justify-center sm:justify-start rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-white/[0.03] w-full sm:w-auto mt-1 sm:mt-0 ml-0">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center rounded-md px-2.5 py-1.5 transition-colors ${viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <ListIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center rounded-md px-2.5 py-1.5 transition-colors ${viewMode === "grid"
                ? "bg-white text-gray-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

      </div>


      {viewMode === "list" ? (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Order ID</TableCell>
                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Customer</TableCell>
                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Contact</TableCell>

                <TableCell
                  isHeader
                  className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => handleSort("date")}
                >
                  Date & Time {renderSortIcon("date")}
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => handleSort("status")}
                >
                  Status {renderSortIcon("status")}
                </TableCell>

                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Payment</TableCell>

                <TableCell
                  isHeader
                  className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => handleSort("amount")}
                >
                  Amount {renderSortIcon("amount")}
                </TableCell>

                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Delivery Type</TableCell>
                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Staff</TableCell>
                <TableCell isHeader className="py-3 whitespace-nowrap font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400 sticky right-0 z-10 bg-white dark:bg-gray-900/95 backdrop-blur-sm shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.2)]">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="py-3 whitespace-nowrap text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.phoneNumber}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    {new Date(order.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Delivered" ? "success"
                          : order.status === "Pending" ? "warning"
                            : order.status === "Cancelled" ? "error"
                              : "light"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.paymentStatus === "Paid" ? "success"
                          : order.paymentStatus === "Pending" ? "warning"
                            : "error"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                    ${order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.deliveryType}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.assignedStaff || "-"}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap text-end sticky right-0 z-10 bg-white dark:bg-gray-900/95 backdrop-blur-sm shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/allorders/${order.id}`} className="text-brand-500 hover:text-brand-600 text-theme-xs font-medium">
                        View
                      </Link>
                      <Link href={`/allorders/${order.id}/edit`} className="text-brand-500 hover:text-brand-600 text-theme-xs font-medium">
                        Edit
                      </Link>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus?.(order.id, e.target.value as OrderRecord["status"])}
                        className="rounded-md border border-gray-300 bg-transparent px-2 py-1 text-[11px] text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400" colSpan={10}>
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white/90">{order.id}</h4>
                  <p className="text-theme-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(order.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
                <Badge
                  size="sm"
                  color={
                    order.status === "Delivered" ? "success"
                      : order.status === "Pending" ? "warning"
                        : order.status === "Cancelled" ? "error"
                          : "light"
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-theme-sm">
                  <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-theme-sm">
                  <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{order.phoneNumber}</span>
                </div>
                <div className="flex justify-between text-theme-sm">
                  <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                  <Badge
                    size="sm"
                    color={
                      order.paymentStatus === "Paid" ? "success"
                        : order.paymentStatus === "Pending" ? "warning"
                          : "error"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between text-theme-sm">
                  <span className="text-gray-500 dark:text-gray-400">Delivery:</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{order.deliveryType}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="font-bold text-gray-800 dark:text-white/90 text-lg">${order.amount.toFixed(2)}</span>

                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus?.(order.id, e.target.value as OrderRecord["status"])}
                    className="rounded-md border border-gray-300 bg-transparent px-2 py-1 text-[11px] text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Link href={`/allorders/${order.id}`} className="text-brand-500 hover:text-brand-600 text-theme-sm font-medium">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {paginatedOrders.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No orders found.
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 dark:border-gray-800">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-800 dark:text-white/90">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-800 dark:text-white/90">{Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)}</span> of <span className="font-medium text-gray-800 dark:text-white/90">{filteredAndSortedOrders.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] dark:hover:text-gray-300"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-theme-sm font-medium ${currentPage === page
                    ? "bg-brand-500 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-gray-300"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] dark:hover:text-gray-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
