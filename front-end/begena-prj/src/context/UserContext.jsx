import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("userRole") === "ADMIN",
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    setIsLoggedIn(true);
    setIsAdmin(role === "ADMIN");
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserRole(null);
  };

  // Sync with other tabs
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
      const role = localStorage.getItem("userRole");
      setIsAdmin(role === "ADMIN");
      setUserRole(role);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, isAdmin, userRole, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
