import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../Component/Pages/Home";
import RegistrationPage from "../Component/Pages/RegistrationPage";
import EmailLoginPage from "../Component/Pages/EmailLoginPage";
import PasswordLogin from "../Component/Pages/PasswordLogin";
import AuthLayout from "../Layout/AuthLayout";
import ForgotPassword from "../Component/Pages/Forgotpassword";
import MessagePage from "../Component/Message/MessagePage";
import PrivateRouting from "./PrivateRouting";  

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<PrivateRouting />}>
    <Route path="/" element={<Home />}>
      <Route path=":userId" element={<MessagePage />} />
    </Route>
  </Route>

        {/* Public routes */}
        <Route
          path="registration"
          element={
            <AuthLayout>
              <RegistrationPage />
            </AuthLayout>
          }
        />
        <Route
          path="emailcheck"
          element={
            <AuthLayout>
              <EmailLoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="passwordcheck"
          element={
            <AuthLayout>
              <PasswordLogin />
            </AuthLayout>
          }
        />
        <Route
          path="forgotpassword"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
