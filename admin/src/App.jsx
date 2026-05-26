import { useContext, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import BloodDonors from './pages/Admin/BloodDonors';
import BloodRequests from './pages/Admin/BloodRequests';
import BloodAnalytics from './pages/Admin/BloodAnalytics';
import {Routes, Route} from 'react-router-dom'
import { DoctorContext } from './context/DoctorContest';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorChatPage from './pages/Doctor/DoctorChatPages';
import DoctorBloodDonor from './pages/Doctor/DoctorBloodDonor';
import DoctorBloodSearch from './pages/Doctor/DoctorBloodSearch';
import DoctorBloodRequests from './pages/Doctor/DoctorBloodRequests';

function App() {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          {/* Admin routes */}
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard />}/>
          <Route path='/all-appointments' element={<AllApointments />}/>
          <Route path='/add-doctor' element={<AddDoctor />}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
          {/* Admin blood routes */}
          <Route path='/blood-donors' element={<BloodDonors />}/>
          <Route path='/blood-requests' element={<BloodRequests />}/>
          <Route path='/blood-analytics' element={<BloodAnalytics />}/>
          {/* Doctor routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>
          <Route path='/doctor-chat' element={<DoctorChatPage/>}/>
          {/* Doctor blood routes */}
          <Route path='/doctor-blood-donor' element={<DoctorBloodDonor/>}/>
          <Route path='/doctor-blood-search' element={<DoctorBloodSearch/>}/>
          <Route path='/doctor-blood-requests' element={<DoctorBloodRequests/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
     <Login />
     <ToastContainer/>
    </>
  )
}

export default App
