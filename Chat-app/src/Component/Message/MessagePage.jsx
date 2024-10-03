import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaVideo } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { uploadFile } from "../../Helper/uploadFile";
import { IoClose, IoSend } from "react-icons/io5";
import Loading from "../LoadingCircle/Loading";
import BackgroundWallpaper from "/asset/0bf280388937448d38392b76c15bd441.jpg";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  
  const { socketConnection, userDetails } = useSelector((state) => state.AuthStore);
  const [dataUser, setDataUser] = useState({
    name: "",
    profile_picture: "",
    email: "",
    online: false,
    userId: "",
  });

  const [openImageVideoUpload, setopenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [loading, setloading] = useState(false);
  const [allMessage, setallMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage) {
      currentMessage?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessage]);

  const handleUploadImageChange = async (e) => {
    const file = e.target.files[0];
    setloading(true);
    const uploadPhoto = await uploadFile(file);
    setloading(false);
    setopenImageVideoUpload(false);
    setMessage({ ...message, imageUrl: uploadPhoto?.url });
  };

  const handleUploadVideoChange = async (e) => {
    const file = e.target.files[0];
    setloading(true);
    const uploadPhoto = await uploadFile(file);
    setloading(false);
    setopenImageVideoUpload(false);
    setMessage({ ...message, videoUrl: uploadPhoto?.url });
  };

  const clearImageHandler = () => setMessage({ ...message, imageUrl: "" });
  const clearVideoHandler = () => setMessage({ ...message, videoUrl: "" });

  useEffect(() => {
    if (socketConnection?.connected) {
      socketConnection.emit("new-Message", params?.userId);
      socketConnection.emit("seen", params?.userId);
      socketConnection.on("message-user", (data) => setDataUser(data));
      socketConnection.on("message", (data) => setallMessage(data));
    }
  }, [socketConnection, params?.userId, userDetails]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      socketConnection?.emit("send-message", {
        sender: userDetails?._id,
        receiver: params?.userId,
        text: message?.text,
        imageUrl: message?.imageUrl,
        videoUrl: message?.videoUrl,
        msgbyID: userDetails?._id,
      });
      setMessage({ text: "", imageUrl: "", videoUrl: "" });
    }
  };

  return (
    <div
      style={{ background: `url(${BackgroundWallpaper})`, backgroundSize: 'cover' }}
      className="bg-no-repeat min-h-screen"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center shadow-md px-4 z-10">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <Avatar height={50} width={50} name={dataUser?.name} imageUrl={dataUser?.profile_picture} UserId={dataUser?.userId} />
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name.charAt(0).toUpperCase() + dataUser?.name.slice(1)}
            </h3>
            <p className="text-sm">
              {dataUser?.online ? (
                <span className="text-green-500">Online</span>
              ) : (
                <span className="text-slate-400">Offline</span>
              )}
            </p>
          </div>
        </div>
        <button className="hover:text-cyan-400">
          <HiOutlineDotsVertical size={20} />
        </button>
      </header>

      {/* Messages Section */}
      <section className="h-[calc(100vh-128px)] overflow-y-scroll bg-gray-100 relative z-0">
        <div className="flex flex-col gap-2 m-4" ref={currentMessage}>
          {allMessage?.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg w-fit max-w-[80%] ${userDetails._id === msg.msgbyID ? "ml-auto bg-teal-200" : "bg-white"}`}
            >
              {msg?.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="w-full h-48 object-contain" />}
              {msg?.videoUrl && (
                <video src={msg.videoUrl} controls className="w-full h-48 object-contain"></video>
              )}
              {msg.text && <p className="mt-2">{msg.text}</p>}
              <p className="text-xs text-gray-500 mt-1 text-right">{moment(msg.createdAt).format("hh:mm A")}</p>
            </div>
          ))}
        </div>

        {/* Displaying Image Preview */}
        {message.imageUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="relative bg-white p-4 rounded-lg">
              <IoClose className="absolute top-2 right-2 cursor-pointer" size={25} onClick={clearImageHandler} />
              <img src={message.imageUrl} alt="Preview" className="max-w-xs max-h-64" />
            </div>
          </div>
        )}

        {/* Displaying Video Preview */}
        {message.videoUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="relative bg-white p-4 rounded-lg">
              <IoClose className="absolute top-2 right-2 cursor-pointer" size={25} onClick={clearVideoHandler} />
              <video src={message.videoUrl} controls className="max-w-xs max-h-64"></video>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <Loading />
          </div>
        )}
      </section>

      {/* Message Input Section */}
      <section className="h-16 bg-white flex items-center justify-between px-4 border-t border-gray-300 z-10 relative">
        <button onClick={() => setopenImageVideoUpload(!openImageVideoUpload)} className="hover:bg-gray-200 p-2 rounded-full">
          <GoPlus size={25} />
        </button>

        {openImageVideoUpload && (
          <div className="absolute bottom-20 left-5 w-36 bg-white shadow-lg rounded-lg p-2 z-20">
            <form>
              <label htmlFor="uploadImage" className="flex items-center p-2 gap-3 hover:bg-gray-100 rounded cursor-pointer">
                <FaImage className="text-cyan-400" size={18} />
                <span>Image</span>
              </label>
              <label htmlFor="uploadVideo" className="flex items-center p-2 gap-3 hover:bg-gray-100 rounded cursor-pointer">
                <FaVideo className="text-purple-500" size={18} />
                <span>Video</span>
              </label>
            </form>
            <input type="file" id="uploadImage" onChange={handleUploadImageChange} className="hidden" />
            <input type="file" id="uploadVideo" onChange={handleUploadVideoChange} className="hidden" />
          </div>
        )}

        <form className="flex w-full items-center gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Enter your message..."
            value={message.text}
            onChange={(e) => setMessage({ ...message, text: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          />
          <button type="submit" className="text-cyan-400 hover:text-cyan-700">
            <IoSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
