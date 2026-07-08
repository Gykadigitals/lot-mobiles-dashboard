import { Metadata } from "next";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Reset Password - LOT Mobiles Admin",
  description: "Reset your LOT Mobiles Admin Dashboard password",
};

export default function ResetPassword() {
  return (
    <div className="flex items-center justify-center h-screen lg:w-1/2 w-full text-gray-500 p-6 text-center">
      Only Administrators can access this page to create new users.
    </div>
  );
}
