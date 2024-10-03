import React from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ UserId, name, imageUrl, width = 50, height = 50 }) => {
  const { onlineUser } = useSelector((state) => state.AuthStore);
  
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-amber-200",
    "bg-fuchsia-200",
    "bg-lime-200",
    "bg-emerald-200",
    "bg-sky-200",
    "bg-grape-200",
    "bg-violet-200",
    "bg-indigo-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-orange-200",
    "bg-red-200",
    "bg-pink-200",
  ];

  const randomColor = bgColor[Math.floor(Math.random() * bgColor.length)];
  const isOnline = onlineUser.includes(UserId);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${randomColor} overflow-hidden`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Image Avatar */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "User avatar"}
          className="object-cover w-full h-full"
        />
      ) : name ? (
        // Initials Avatar
        <div className="flex items-center justify-center w-full h-full bg-slate-500 text-white font-semibold text-xl">
          {name.charAt(0).toUpperCase()}
        </div>
      ) : (
        // Default Icon Avatar
        <PiUserCircleFill className="text-slate-400" size={Math.min(width, height)} />
      )}

      {/* Online Status Indicator */}
      {isOnline && (
        <div
          className="bg-green-500 border-2 border-white absolute bottom-1 right-1 rounded-full"
          style={{ width: `${width / 5}px`, height: `${height / 5}px` }}
        ></div>
      )}
    </div>
  );
};

export default Avatar;
