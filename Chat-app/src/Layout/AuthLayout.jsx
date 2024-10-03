import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <>
    <header className='flex justify-center items-center py-1 shadow-md bg-white'>
      <img 
      src="asset/Designer2.png" 
      alt="logo" 
      width={120}
      height={60}
      />
    </header>
    {children}
    </>
  )
}

export default AuthLayout
