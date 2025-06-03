import React from 'react';
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Services from './pages/Services'
import Articles from './pages/Articles'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import AdminDashboardSummary from './pages/AdminDashboardSummary'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CustStaffDashboard from './pages/CustStaffDashboard'
import OTPVerification from './pages/OTPVerification'
import TicketAppScreen from './pages/TicketAppScreen';

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(localStorage.getItem("user"));
  const ownerId = user?.id || null;
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about_us' element={<AboutUs />} />
      <Route path='/services' element={<Services />} />
      <Route path='/articles' element={<Articles />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/tickets' element={<CustStaffDashboard />} />
      <Route path='/createticket' element={<TicketAppScreen ownerId={ownerId} />} />
      <Route path='/admin/:status?' element={<AdminDashboard />} />
      <Route path='/admin/summary' element={<AdminDashboardSummary />} />
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/verify-email' element={<OTPVerification/>}/>
    </Routes>
  )
}
export default App
