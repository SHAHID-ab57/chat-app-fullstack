import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Router from './Routes/Router'
// import toast, { Toaster } from 'react-hot-toast';
import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <ToastContainer />
      <Router/>
      
    </>
  )
}

export default App
