export type Role =
  | "ADMINISTRATOR"
  | "PRODUCT_MANAGER"
  | "SALES_MANAGER"
  | "MIS"
  | "ORDER_MANAGEMENT";

export type Permission =
  | "manage:all"
  | "manage:products"
  | "view:products"
  | "manage:sales"
  | "view:reports"
  | "manage:orders"
  | "view:orders";

// Map roles to specific permissions
export const RolePermissions: Record<Role, Permission[]> = {
  ADMINISTRATOR: ["manage:all"],
  PRODUCT_MANAGER: ["manage:products", "view:products"],
  SALES_MANAGER: ["manage:sales", "view:reports", "view:orders"],
  MIS: ["view:reports", "view:products", "view:orders"],
  ORDER_MANAGEMENT: ["manage:orders", "view:orders", "view:products"],
};

// Route protection configuration
// Maps a base route to the roles allowed to access it.
export const RouteAccess: Record<string, Role[]> = {
  "/products": ["ADMINISTRATOR", "PRODUCT_MANAGER"],
  "/revenue": ["ADMINISTRATOR", "SALES_MANAGER"],
  "/customers": ["ADMINISTRATOR", "SALES_MANAGER", "MIS"],
  "/sales-analytics": ["ADMINISTRATOR", "SALES_MANAGER"],
  "/reports": ["ADMINISTRATOR", "SALES_MANAGER", "MIS"],
  "/orders": ["ADMINISTRATOR", "ORDER_MANAGEMENT", "SALES_MANAGER"],
  "/payments": ["ADMINISTRATOR", "SALES_MANAGER"],
  "/settings": ["ADMINISTRATOR"],
  // Add more specific routes as needed
};

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === "ADMINISTRATOR") return true; // Admin has all permissions implicitly
  return RolePermissions[role]?.includes(permission) || false;
}
