import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import Avatar from "../Avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Editdetails from "../EditUserDetails/Editdetails";
import Divider from "../Divider/Divider";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "../SearchUser/SearchUser";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FetchUserDetails, LogoutAuth } from "../../Redux/Slice/AuthSlice";

const Sidebar = () => {
  const { userDetails, socketConnection } = useSelector(
    (state) => state.AuthStore
  );
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let [avatarState, setAvatarState] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openSearchUsers, setOpenSearchUsers] = useState(false);

  useEffect(()=>{
 dispatch(FetchUserDetails())
  },[dispatch])
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", userDetails?._id);

      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((user) => {
          if (user?.sender?._id === user?.receiver?._id) {
            return { ...user, otherUser: user?.sender };
          } else if (user?.receiver?._id !== userDetails?._id) {
            return { ...user, otherUser: user?.receiver };
          } else {
            return { ...user, otherUser: user?.sender };
          }
        });
        setAllUsers(conversationUserData);
      });
    }
  }, [socketConnection, userDetails]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch(LogoutAuth())
      .then(() => {
        navigate("/emailcheck");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="w-full h-full grid grid-cols-[70px,1fr] bg-gray-50">
      {/* Left Sidebar Section */}
      <div className="bg-gray-100 w-full h-full py-4 flex flex-col justify-between items-center">
        {/* Top Section */}
        <div className="space-y-6">
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded-full transition-transform transform hover:scale-105"
            title="Messages"
          >
            <IoChatbubbleEllipsesSharp size={28} className="text-gray-600" />
          </div>
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded-full transition-transform transform hover:scale-105"
            title="Add Friends"
            onClick={() => setOpenSearchUsers(true)}
          >
            <IoIosPersonAdd size={28} className="text-gray-600" />
          </div>
        </div>

        {/* Avatar and Logout */}
        <div className="flex flex-col items-center gap-4">
          <button
            title={userDetails?.name}
            className="mx-auto cursor-pointer"
            onClick={() => setAvatarState(true)}
          >
            <Avatar
              name={userDetails?.name}
              imageUrl={userDetails?.profile_picture}
              height={48}
              width={48}
              UserId={userDetails?._id}
            />
          </button>
          <button
            title="Logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-300 rounded-full transition-transform transform hover:scale-105"
            onClick={logoutHandler}
          >
            <IoLogOut size={28} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Right Sidebar Content */}
      <div className="w-full h-full p-4 bg-white shadow-lg">
        <div className="h-16 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="border-b border-gray-200 mb-4"></div>
        <div className="h-[calc(100vh-110px)] overflow-y-auto custom-scrollbar">
          {allUsers.length === 0 && (
            <div className="mt-12 text-center">
              <div className="flex justify-center items-center my-7 text-gray-400">
                <GoArrowUpLeft size={40} />
              </div>
              <p className="text-lg text-gray-400">
                Explore users to start a conversation
              </p>
            </div>
          )}

          {/* List of Conversations */}
          {allUsers.map((user) => (
            <NavLink
              to={`/${user?.otherUser?._id}`}
              key={user?._id}
              className="flex items-center gap-4 p-3 border border-transparent hover:bg-gray-50 rounded transition-transform transform hover:scale-105"
            >
              <Avatar
                imageUrl={user?.otherUser?.profile_picture}
                name={user?.otherUser?.name}
                width={50}
                height={50}
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg text-gray-700">
                  {user?.otherUser?.name}
                </h3>
                <div className="text-gray-500 text-sm flex items-center gap-2">
                  {user?.lastMsg?.imageUrl && (
                    <div className="flex items-center gap-1">
                      <FaImage size={16} className="text-gray-400" />
                      <span>Image</span>
                    </div>
                  )}
                  {user?.lastMsg?.videoUrl && (
                    <div className="flex items-center gap-1">
                      <FaVideo size={16} className="text-gray-400" />
                      <span>Video</span>
                    </div>
                  )}
                  <p className="line-clamp-1">{user?.lastMsg?.text}</p>
                </div>
              </div>
              {Boolean(user?.unseenMsg) && (
                <div className="ml-auto flex justify-center items-center bg-cyan-500 text-white text-xs font-bold rounded-full w-6 h-6">
                  {user?.unseenMsg}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {avatarState && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setAvatarState(false)}
            >
              ✖
            </button>
            <Editdetails onClose={() => setAvatarState(false)} />
          </div>
        </div>
      )}

      {openSearchUsers && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setOpenSearchUsers(false)}
            >
              ✖
            </button>
            <SearchUser onClose={() => setOpenSearchUsers(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
