export type Role =
  | "ADMINISTRATOR"
  | "PRODUCT_MANAGER"
  | "SALES_MANAGER"
  | "MIS"
  | "ORDER_MANAGEMENT"
  | "HR";

export type Permission =
  | "manage:all"
  | "manage:products"
  | "view:products"
  | "manage:sales"
  | "view:reports"
  | "manage:orders"
  | "view:orders"
  | "manage:users"
  | "view:users"
  | "manage:policies"
  | "view:policies";

// Map roles to specific permissions
export const RolePermissions: Record<Role, Permission[]> = {
  ADMINISTRATOR: ["manage:all"],
  PRODUCT_MANAGER: ["manage:products", "view:products"],
  SALES_MANAGER: ["manage:sales", "view:reports", "view:orders"],
  MIS: ["view:reports", "view:products", "view:orders"],
  ORDER_MANAGEMENT: ["manage:orders", "view:orders", "view:products"],
  HR: ["manage:users", "view:users", "manage:policies", "view:policies"],
};

// Route protection configuration
// Maps a base route to the roles allowed to access it.
export const RouteAccess: Record<string, Role[]> = {
  "/products": ["ADMINISTRATOR", "PRODUCT_MANAGER"],
  "/revenue": ["ADMINISTRATOR", "SALES_MANAGER"],
  "/customers": ["ADMINISTRATOR", "SALES_MANAGER", "MIS"],
  "/users": ["ADMINISTRATOR", "HR"],
  "/sales-analytics": ["ADMINISTRATOR", "SALES_MANAGER"],
  "/reports": ["ADMINISTRATOR", "SALES_MANAGER", "MIS"],
  "/orders": ["ADMINISTRATOR", "ORDER_MANAGEMENT", "SALES_MANAGER"],
  "/payments": ["ADMINISTRATOR", "SALES_MANAGER"],
  "/settings": ["ADMINISTRATOR"],
  "/cancellation-policy": ["ADMINISTRATOR", "HR"],
  "/return-policy": ["ADMINISTRATOR", "HR"],
  "/disclaimer-policy": ["ADMINISTRATOR", "HR"],
  "/privacy-policy": ["ADMINISTRATOR", "HR"],
  "/terms-and-conditions": ["ADMINISTRATOR", "HR"],
  "/shipping-policy": ["ADMINISTRATOR", "HR"],
  "/replacement-policy": ["ADMINISTRATOR", "HR"],
  "/faq": ["ADMINISTRATOR", "HR"],
  // Add more specific routes as needed
};

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === "ADMINISTRATOR") return true; // Admin has all permissions implicitly
  return RolePermissions[role]?.includes(permission) || false;
}
