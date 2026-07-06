"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useRouter, usePathname } from "next/navigation";
import { useRBAC } from "@/hooks/useRBAC";
import { RouteAccess } from "@/lib/auth/roles";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, isLoading, hasRole } = useRBAC();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/signin");
      } else {
        // Route-based protection
        const allowedRoles = RouteAccess[pathname];
        if (allowedRoles) {
          if (!hasRole(allowedRoles)) {
            router.push("/");
          }
        } else if (pathname !== "/") {
          // If the route is not defined in RouteAccess, restrict it to Admin only by default.
          if (!hasRole(["ADMINISTRATOR"])) {
            router.push("/");
          }
        }
      }
    }
  }, [isLoading, isAuthenticated, router, pathname, hasRole]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
