import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FetchUserDetails, onlineUserArray, SetsocketConnection } from '../../Redux/Slice/AuthSlice'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import io from "socket.io-client"
import MessagePage from '../Message/MessagePage'

const Home = () => {
  const dispatch = useDispatch()
  const {userDetails,passwordInfo,onlineUser}=useSelector(state=>state.AuthStore)
  const location = useLocation()
  
  // console.log("Location", location);
 
 
  // console.log("User Details", userDetails);
  // console.log("Password  Details", passwordInfo);
  // console.log("onlineUser", onlineUser);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // This will clear the localStorage before the tab is closed or refreshed
      localStorage.clear();
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(()=>{
dispatch(FetchUserDetails())
  },[dispatch])

  let pathname = location.pathname==="/"

  // socket connection  server to frontend


  useEffect(()=>{
const socketConnection = io("https://chat-app-server-7uix.onrender.com",{
  auth:{
    token:window.localStorage.getItem("token"),
  }
})

socketConnection.on("onlineUser",(data)=>{
  dispatch(onlineUserArray(data))
console.log("onlineUserData",data)
})

dispatch(SetsocketConnection(socketConnection))

return ()=>{
  socketConnection.disconnect()
}
  },[])


  
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!pathname && "hidden"} lg:block` }>
       <Sidebar/>
      </section>
      <section className={`${pathname && "hidden"}`}>
        <Outlet/>
      </section>



      <div className={`${!pathname && "hidden" ||"lg:flex justify-center items-center flex-col gap-2 hidden"}`}>
        <div>
        <img
         src="./asset/Designer2.png" 
         alt=""
         width={250}
         />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
