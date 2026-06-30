"use client";
import React from "react";
import { useRBAC } from "@/hooks/useRBAC";
import { Role, Permission } from "@/lib/auth/roles";

interface ProtectProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requiredPermission?: Permission;
  fallback?: React.ReactNode;
}

export default function Protect({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}: ProtectProps) {
  const { hasRole, hasPermission, isLoading } = useRBAC();

  if (isLoading) {
    return null; // or a tiny spinner if preferred
  }

  let isAllowed = true;

  if (allowedRoles && allowedRoles.length > 0) {
    isAllowed = hasRole(allowedRoles);
  }

  if (isAllowed && requiredPermission) {
    isAllowed = hasPermission(requiredPermission);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
