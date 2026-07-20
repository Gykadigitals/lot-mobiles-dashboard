"use client";
import React, { useState } from "react";
import { OrderSummaryCards } from "@/components/orders/OrderSummaryCards";
import { AllOrdersTable } from "@/components/orders/AllOrdersTable";
import { mockOrders, OrderRecord } from "@/data/mockOrders";

export const AllOrdersClient = () => {
  const [orders, setOrders] = useState<OrderRecord[]>(mockOrders);

  const handleUpdateStatus = (orderId: string, newStatus: OrderRecord["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <OrderSummaryCards orders={orders} />
      <AllOrdersTable orders={orders} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
};
