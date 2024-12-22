import React from 'react'
import { Route , Routes } from 'react-router-dom'

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from './components/common/Sidebar';


 const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto '>
      <Sidebar/>
     <Routes>
      <Route path="/" element={<HomePage/>}></Route>
      <Route path="/login" element={<LoginPage/>}></Route>
      <Route path="/signup" element={<SignUpPage/>}></Route>
     </Routes>

    </div>
  )
}

export default App
