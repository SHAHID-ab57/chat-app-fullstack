import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../Avatar/Avatar";
import { uploadFile } from "../../Helper/uploadFile";
import Divider from "../Divider/Divider";
import { FetchUserDetails, UpdateUserDetails } from "../../Redux/Slice/AuthSlice";
import toast from "react-hot-toast";



const Editdetails = ({ onClose }) => {
  const { userDetails } = useSelector((state) => state.AuthStore);
  const dispatch = useDispatch()
  let [collectData, setCollectData] = useState({
    name: userDetails?.name,
    profile_picture: userDetails?.profile_picture,
  });

  const uploadPhotoRef = useRef()

  useEffect(()=>{
    dispatch(FetchUserDetails())
     },[dispatch])

     

  const handleOnchange = (e) => {
    setCollectData({ ...collectData, [e.target.name]: e.target.value });
  };

  // console.log("onChange",collectData);

  const handleUploadPhoto = async(e) => {
    let photo = (e.target.files[0]);
    const uploadPhoto = await uploadFile(photo)

    // console.log("UploadPhoto", uploadPhoto);
    setCollectData({...collectData, profile_picture:uploadPhoto?.url})

  }
  const handleOpenChangePhoto =()=>{
    uploadPhotoRef.current.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(collectData);
    dispatch(UpdateUserDetails(collectData)).then(res=>{
    // console.log(res);
    if(res.payload.success){
      onClose()
      toast.success(res.payload.message);
    }
    }).catch(err=>{
      console.log(err);
      
    })

    
  }
  

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-5 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user Details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Name : </label>
            <input
              type="text"
              id="name"
              name="name"
              value={collectData?.name}
              onChange={handleOnchange}
              className="w-full py-1 px-2 focus:outline-cyan-400 border"
            />
          </div>
          <div>
            <div>Photo :</div>
            <div className="my-1 grid grid-cols[40px,1fr] gap-3">
                <Avatar
                width={70}
                height={70}
                imageUrl={collectData.profile_picture}
                name={collectData.name}
                userId={collectData._id}
                />
            <label htmlFor="Profile Picture" className="text-center"> 
                <button type="button" className="font-semibold " onClick={handleOpenChangePhoto} >Change Photo</button>
                <input type="file"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
                />
                </label>
            </div>
          </div>
          <Divider/>
          <div className="flex gap-2 w-fit ml-auto mt-3">
            <button onClick={onClose} className="border-cyan-300 text-cyan-400 border px-4 py-1 rounded hover:bg-cyan-300 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="border-cyan-300 bg-cyan-300 text-white border px-4 py-1 rounded hover:bg-cyan-500">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editdetails;
