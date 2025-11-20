import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const ProtectedRoute = ({ children }) => {
  const [isUser, setIsUser] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("👉 ProtectedRoute: sending /auth/check request...");

        const res = await axios.get(`${import.meta.env.VITE_backend_url}/auth/check`, {
          withCredentials: true,
        });
        console.log("Auth check response:", res.data);
        setIsUser(res.data.authenticated);
      } catch (err) {
        setIsUser(false);
      }
    };

    checkAuth();
  }, []);

  // 🔵 Show loader while checking
  if (isUser === null) {
    return <div>Loading...</div>;
  }

  // 🔴 Not authenticated → redirect
  if (!isUser) {
    return <Navigate to="/login" />;
  }

  // 🟢 Authenticated → allow access
  return children;
};
