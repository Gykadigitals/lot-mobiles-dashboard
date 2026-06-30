import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PaymentDetails } from "@/components/payments/PaymentDetails";
import { mockPayments } from "@/data/mockPayments";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Payment ${params.id} | LOT Mobiles Admin`,
    description: "View payment details.",
  };
}

export default function PaymentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const payment = mockPayments.find((p) => p.id === params.id);

  if (!payment) {
    notFound();
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Payment Details: ${payment.id}`} />
      
      <div className="space-y-6">
        <PaymentDetails payment={payment} />
      </div>
    </>
  );
}
