import { createContext, useContext, useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";

/*
1. 인증 토큰 전역으로 관리하기
*/

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = getAuthToken();
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
