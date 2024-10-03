import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import LoadingBar from "../LoadingCircle/Loading";
import UserSearchCard from "../UserSearchCard/UserSearchCard";
import { useDispatch } from "react-redux";
import { SearchApi } from "../../Redux/Slice/SearchSlice";
import { IoClose } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  let dispatch = useDispatch();
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearchTerm] = useState("");

  const searchUserHandler = () => {
    setLoading(true);

    dispatch(SearchApi(search))
      .then((res) => {
        setSearchUser(res.payload.data);
        console.log("Search Res", res.payload.data);
      })
      .catch((err) => {
        throw err;
      });

    setLoading(false);
  };

  useEffect(() => {
    searchUserHandler();
  }, [search]);

  console.log("Search Array", searchUser);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-2">
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1 text-gray-600 hover:text-gray-800 transition-all"
        >
          <IoClose size={25} />
        </button>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <input
            type="text"
            placeholder="Search users by username or email..."
            className="flex-1 p-4 text-gray-700 focus:outline-none bg-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="p-3 bg-blue-500 text-white">
            <IoIosSearch size={25} />
          </div>
        </div>

        {/* Results Container */}
        <div className="bg-gray-50 mt-4 rounded-lg p-4 h-80 overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <LoadingBar />
            </div>
          )}

          {/* No users found */}
          {!loading && searchUser.length === 0 && (
            <p className="text-center text-gray-500">No users found</p>
          )}

          {/* Search Results */}
          {!loading &&
            searchUser.length > 0 &&
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
