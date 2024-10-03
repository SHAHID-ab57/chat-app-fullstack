import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const PrivateRouting = () => {
  const isTokenPresent= localStorage.getItem("token");
  

  console.log("isTokenPresent", isTokenPresent);


  return isTokenPresent ? <Outlet /> : <Navigate to="/emailcheck" />;
};

export default PrivateRouting;