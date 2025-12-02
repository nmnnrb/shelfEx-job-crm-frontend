import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LoadingSkel from "../components/LoadingSkel";

export const ProtectedRoute = ({ children }) => {
  const [isUser, setIsUser] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("👉 ProtectedRoute: sending /auth/check request...");

        const res = await axios.get(`http://localhost:8080/api/auth/check`, {
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
    return <div>
      <LoadingSkel />
    </div>;
  }

  // 🔴 Not authenticated → redirect
  if (!isUser) {
    return <Navigate to="/login" />;
  }

  // 🟢 Authenticated → allow access
  return children;
};
