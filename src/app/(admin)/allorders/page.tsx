import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AllOrdersClient } from "./AllOrdersClient";

export const metadata: Metadata = {
  title: "All Orders | LOT Mobiles Admin Dashboard",
  description: "View and manage all orders across LOT Mobiles.",
};

export default function AllOrdersPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="All Orders" />
      <AllOrdersClient />
    </>
  );
}
