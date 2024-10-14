"use client";

import React, {createContext, useContext, ReactNode} from "react";

const UserContext = createContext<any | null | undefined>(undefined);

export function UserProvider({children, initialUser}: {children: ReactNode; initialUser: any | null}) {
  return <UserContext.Provider value={initialUser}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
