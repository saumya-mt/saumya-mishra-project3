import React, { createContext, useContext, useEffect, useState } from "react";
import { getJson, postJson } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const nextUser = await getJson("/api/user/isLoggedIn");
        if (!ignore) {
          setUser(nextUser);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsCheckingAuth(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const value = {
    user,
    isCheckingAuth,
    isLoggedIn: Boolean(user),
    async login(formValues) {
      const nextUser = await postJson("/api/user/login", formValues);
      setUser(nextUser);
      return nextUser;
    },
    async register(formValues) {
      const nextUser = await postJson("/api/user/register", formValues);
      setUser(nextUser);
      return nextUser;
    },
    async logout() {
      await postJson("/api/logout", {});
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
