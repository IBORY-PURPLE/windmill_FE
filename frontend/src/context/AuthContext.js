import { createContext, useContext, useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());

  // 🔁 localStorage의 토큰 변화를 감지
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = getAuthToken();
      if (storedToken !== token) {
        setToken(storedToken); // 자동 갱신
      }
    }, 500); // 0.5초마다 체크 (또는 requestIdleCallback 활용 가능)

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
