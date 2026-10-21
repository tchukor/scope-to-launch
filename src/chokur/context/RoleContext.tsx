import React, { createContext, useContext, useState } from "react";
import type { Role } from "../utils/roles";
import { canSee, homeFor, loadRole, saveRole } from "../utils/roles";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const ctxStore = globalThis as unknown as {
  __chokurRoleContext?: React.Context<RoleContextType | undefined>;
};
const RoleContext =
  ctxStore.__chokurRoleContext ??
  (ctxStore.__chokurRoleContext = createContext<RoleContextType | undefined>(undefined));

export const RoleProvider: React.FC<{ children: React.ReactNode; activeView?: string }> = ({
  children,
  activeView = "overview"
}) => {
  const [role, setRoleInternal] = useState<Role>(() => loadRole());

  const setRole = (newRole: Role) => {
    setRoleInternal(newRole);
    saveRole(newRole);
    if (!canSee(newRole, activeView)) {
      const destination = homeFor(newRole);
      // The activeView will be updated by NavigationContext when it receives the new role
      // We just need to store the new role
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};