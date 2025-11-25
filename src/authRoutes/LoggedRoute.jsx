import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import LoadingSkel from "../components/LoadingSkel";

export const LoggedRoute = ({ children }) => {
  const [isUser, setIsUser] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {


        const res = await axios.get(`/api/auth/check`, {
          withCredentials: true,
        });
        console.log("Auth check response:", res.data);
        setIsUser(res.data);
      } catch (err) {
        setIsUser(false);
      }
    };

    checkAuth();
  }, []);


  
  if (isUser === null) {
    return <div>
      <LoadingSkel />
    </div>;
  }



  
  if (isUser.authenticated) {
    
    //casing
    if(isUser.user.role === "admin"){
      return <Navigate to="/admin/dashboard" />;
    }else{
      return <Navigate to="/dashboard" />;
    }

  }


  return children;
};
