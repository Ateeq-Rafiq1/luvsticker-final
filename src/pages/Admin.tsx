
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to administrator dashboard
    navigate("/administrator/dashboard");
  }, [navigate]);
  
  return null; // This component will redirect, so no need to render anything
};

export default Admin;
