import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  /*
    Restore logged-in user when
    application starts.
  */
  useEffect(() => {
    const restoreUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

       console.log("RESTORED USER:", response.data.user);
console.log("SAVED TOKEN EXISTS:", !!savedToken);

setUser(response.data.user);
setToken(savedToken);
      } catch (error) {
        console.log("Session expired or invalid.");

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  /*
    Login
  */
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);

    return response.data;
  };

  /*
    Register
  */
  const register = async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  };

  /*
    Logout
  */
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};