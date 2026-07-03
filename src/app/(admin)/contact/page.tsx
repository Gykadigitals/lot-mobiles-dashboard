import React from "react";
import type { Metadata } from "next";
import SubmissionsTable from "./SubmissionsTable";
import ContactSettingsForm from "./ContactSettingsForm";

export const metadata: Metadata = {
  title: "Contact Management | LOT Mobiles Admin Dashboard",
  description: "Manage contact form submissions and contact page settings.",
};

export default function ContactManagementPage() {
  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View customer inquiries and update contact page settings.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top: Settings Form */}
        <div className="w-full">
          <ContactSettingsForm />
        </div>

        {/* Bottom: Submissions Table */}
        <div className="w-full">
          <SubmissionsTable />
        </div>
      </div>
    </div>
  );
}
