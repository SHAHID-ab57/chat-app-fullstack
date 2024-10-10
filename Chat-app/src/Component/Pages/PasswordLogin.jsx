import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PasswordAuth } from "../../Redux/Slice/AuthSlice";
import { toast } from "react-toastify";
import Avatar from "../Avatar/Avatar";

const PasswordLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { emailInfo } = useSelector((state) => state.AuthStore);
  console.log("EmailInfo", emailInfo);

  const [passdata, setpassdata] = useState({
    password: "",
    userId: emailInfo?._id,
  });

  const handleRegistrationValue = (event) => {
    setpassdata({ ...passdata, password: event.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Password Data", passdata);

    await dispatch(PasswordAuth(passdata))
      ?.then((res) => {
        // console.log("Response in payload", res.payload.token);
        window.localStorage.setItem("token", res.payload.token);

        if (res.payload.success) {
          toast.success(res.payload.message);
          setpassdata({
            password: "",
          });

          setTimeout(() => {
            navigate("/");
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
          <Avatar
            width={100}
            height={100}
            name={emailInfo?.name}
            imageUrl={emailInfo?.profile_picture}
          />
        </div>
        <h3 className="text-2xl font-semibold text-center text-cyan-600 mb-4">
          Welcome, {emailInfo?.name}!
        </h3>
        <hr className="mb-5" />
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={passdata.password}
              onChange={handleRegistrationValue}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 text-white text-lg py-2 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          <Link to="/forgotpassword" className="text-cyan-500 hover:underline">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PasswordLogin;
