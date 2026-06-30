import { useAuthContext } from "@/context/AuthProvider";
import { Role, Permission, hasPermission as checkPermission } from "@/lib/auth/roles";

export function useRBAC() {
  const { userRole, isAuthenticated, isLoading } = useAuthContext();
  
  const hasRole = (roles: Role[]) => {
    if (!userRole) return false;
    if (userRole === "ADMINISTRATOR") return true; // Admins override
    return roles.includes(userRole);
  };

  const hasPermission = (permission: Permission) => {
    if (!userRole) return false;
    return checkPermission(userRole, permission);
  };

  return {
    userRole,
    hasRole,
    hasPermission,
    isAuthenticated,
    isLoading,
  };
}
