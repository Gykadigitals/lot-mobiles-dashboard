"use client";
import React, { createContext, useContext, useState } from "react";
import { Role } from "@/lib/auth/roles";

// Pure frontend mock for RBAC context
interface AuthContextType {
  userRole: Role | undefined;
  setUserRole: (role: Role | undefined) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userRole: undefined,
  setUserRole: () => {},
  isAuthenticated: false,
  isLoading: false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRoleState] = useState<Role | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    const savedRole = localStorage.getItem("mockUserRole") as Role;
    if (savedRole) {
      setUserRoleState(savedRole);
    }
    setIsInitialized(true);
  }, []);

  const setUserRole = (role: Role | undefined) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem("mockUserRole", role);
    } else {
      localStorage.removeItem("mockUserRole");
    }
  };
  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated: !!userRole,
        isLoading: !isInitialized, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
