import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../../Helper/uploadFile";
import { useDispatch, useSelector } from "react-redux";
import { RegisterAuth } from "../../Redux/Slice/AuthSlice";
import { toast } from 'react-toastify';
import LoadingBar from "../LoadingCircle/Loading";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, user } = useSelector((state) => state.AuthStore);

  const [loading, setLoading] = useState(false);
  const [regdata, setRegdata] = useState({
    name: "",
    email: "",
    password: "",
    profile_picture: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");

  let handleRegistrationValue = (event) => {
    setRegdata({ ...regdata, [event.target.name]: event.target.value });
  };

  const imageUplodeHandler = async (e) => {
    setUploadPhoto(e.target.files[0]);
    setLoading(true);
    const uploadPhoto = await uploadFile(e.target.files[0]);
    setLoading(false);
    setRegdata({ ...regdata, profile_picture: uploadPhoto?.url });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(RegisterAuth(regdata))
      ?.then((res) => {
        if (res.payload.success) {
          toast.success(res.payload.message);
          setRegdata({
            name: "",
            email: "",
            password: "",
            profile_picture: "",
          });
          setTimeout(() => {
            navigate("/emailcheck");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center text-cyan-600 mb-4">
          Welcome to Conversify
        </h3>
        <hr className="mb-5" />
        <form onSubmit={submitHandler}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
                className="bg-gray-100 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={regdata.name}
                onChange={handleRegistrationValue}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                className="bg-gray-100 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={regdata.email}
                onChange={handleRegistrationValue}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className="bg-gray-100 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={regdata.password}
                onChange={handleRegistrationValue}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="uploadPhoto" className="font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="h-14 bg-gray-100 flex justify-between items-center px-3 py-2 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:border-cyan-500 relative">
                <p className="text-sm truncate">
                  {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                   className="absolute right-2 top-2 text-lg text-red-600 hover:text-red-800 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setUploadPhoto(null);
                    }}
                  >
                    <IoClose />
                  </button>
                )}
                <input
                  type="file"
                  id="uploadPhoto"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={imageUplodeHandler}
                />
              </div>
            </div>

            <button
              className="bg-cyan-500 text-white text-lg px-5 py-2 mt-4 rounded-lg font-semibold hover:bg-cyan-700 transition duration-300"
              disabled={loading}
            >
              {loading ? <LoadingBar /> : "Register"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/emailcheck" className="text-cyan-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
