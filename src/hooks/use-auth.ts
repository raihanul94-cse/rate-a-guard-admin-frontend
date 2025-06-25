import { useState, useEffect } from "react";
import { getAccessToken } from "../auth/auth-token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAccessToken());
  }, []);

  return {
    isAuthenticated: !!token,
    token,
  };
}
