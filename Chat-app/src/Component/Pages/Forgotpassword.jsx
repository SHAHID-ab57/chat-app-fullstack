import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ForgotEmailAuth, ResetPasswordAuth } from "../../Redux/Slice/AuthSlice";


const ForgotPassword = () => {
  const dispatch = useDispatch();
  const {emailInfo} = useSelector((state)=> state.AuthStore)
  console.log("Forgot Password page", emailInfo)

  // Step 1: Enter email
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // Tracks step (1 = email verification, 2 = password reset)
  const [error, setError] = useState("");

  // Step 2: New password data
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Email submission (Step 1)
  const submitEmailHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(""); // Clear previous error if input is valid

    await dispatch(ForgotEmailAuth({ email }))
      .then((res) => {
        if (res.payload.success) {
          toast.success("Email verified. You can now reset your password.");
          setStep(2); // Move to the next step (password reset)
        } else {
          toast.error(res.payload.message || "Invalid email address.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred. Please try again later.");
      });
  };

  // Password submission (Step 2)
  const submitPasswordHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!passwordData.password || !passwordData.confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    await dispatch(ResetPasswordAuth({ userId:emailInfo._id, password: passwordData.password, confirmPassword: passwordData.confirmPassword}))
      .then((res) => {
        if (res.payload.success) {
          toast.success("Password has been reset successfully.");
          setPasswordData({
            password: "",
            confirmPassword: "",
          });
        } else {
          toast.error(res.payload.message || "Failed to reset password.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-center text-cyan-600 mb-6">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Enter your email address to verify your identity.
            </p>
            <form onSubmit={submitEmailHandler} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  className={`bg-gray-100 px-4 py-2 rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  value={email}
                  onChange={handleEmailChange}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 text-white text-lg py-2 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300"
              >
                Verify Email
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold text-center text-cyan-600 mb-6">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Enter your new password below.
            </p>
            <form onSubmit={submitPasswordHandler} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  className={`bg-gray-100 px-4 py-2 rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className={`bg-gray-100 px-4 py-2 rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 text-white text-lg py-2 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300"
              >
                Reset Password
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-center text-gray-600">
          <Link to="/login" className="text-cyan-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
