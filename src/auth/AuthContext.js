import React, { createContext, useContext, useEffect, useState } from "react";

export const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:4000";
// go
const AuthCtx = createContext(null);
//lisence
/** Exposes { user, loading, setUser } to the app */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // {id,name,role,tenant,features:[]}
  const [loading, setLoading] = useState(true);
//becuase
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.includes("application/json")) {
          const me = await res.json();
          setUser(me);
          // minimal tenant scoping cache for client calls
          if (me?.tenant) {
            localStorage.setItem("currentTenantId", me.tenant.id);
            localStorage.setItem("currentTenantName", me.tenant.name);
          }
        } else {
          // not logged in or backend not reachable; ignore
        }
      } catch {
        // network error; ignore for now (user stays unauthenticated)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
