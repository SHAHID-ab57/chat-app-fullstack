import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmailAuth } from "../../Redux/Slice/AuthSlice";
import { toast } from "react-toastify";
import Avatar from "../Avatar/Avatar";

const EmailLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, user } = useSelector((state) => state.AuthStore);

  const [logdata, setlogdata] = useState({
    email: "",
  });

  let handleRegistrationValue = (event) => {
    setlogdata({ ...logdata, email: event.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await dispatch(EmailAuth(logdata))
      ?.then((res) => {
        if (res.payload.success) {
          toast.success(res.payload.message);
          setlogdata({ email: "" });
          setTimeout(() => {
            navigate("/passwordcheck");
          }, 1000);
        } else {
          toast.error(res.payload.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-5">
          <Avatar width={100} height={100} />
        </div>
        <h3 className="text-2xl font-semibold text-center text-cyan-600 mb-4">
          Welcome to Conversify
        </h3>
        <hr className="mb-5" />
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={logdata.email}
              onChange={handleRegistrationValue}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 text-white text-lg py-2 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300"
          >
            Verify Email
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/registration" className="text-cyan-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmailLoginPage;
