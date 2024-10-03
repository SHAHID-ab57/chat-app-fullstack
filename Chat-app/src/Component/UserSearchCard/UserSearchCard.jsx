import React from 'react'
import Avatar from '../Avatar/Avatar'
import { Link } from 'react-router-dom'




const UserSearchCard = ({user,onClose}) => {
    
  return (
    <Link to={"/"+user._id} onClick={onClose} className='flex justify-start items-center gap-3 mt-3 lg:p-4 border border-transparent border-t-slate-200 hover:border-cyan-400 rounded cursor-pointer'>
      <div >
        <Avatar
         width={50}
         height={50}
         name={user.name}
         imageUrl={user.profile_picture}
         UserId={user?._id}
        />
      </div>
      <div>
        <div className='font-semibold text-ellipsis line-clamp-1'>
        {user?.name}

        </div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard
