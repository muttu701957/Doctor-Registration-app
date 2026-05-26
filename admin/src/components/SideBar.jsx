import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import assets from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContest'
import {
  LayoutDashboard, CalendarCheck, UserPlus, Users,
  UserCircle, MessageSquare,
  Droplets, Heart, AlertCircle, BarChart3, Search,
} from 'lucide-react'

const navClass = ({ isActive }) =>
  `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : 'hover:bg-gray-50'}`

const bloodNavClass = ({ isActive }) =>
  `flex items-center gap-3 py-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-red-50 border-r-4 border-red-500 text-red-700' : 'hover:bg-red-50/50 text-[#515151]'}`

const SideBar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken }  = useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {/* ── ADMIN SIDEBAR ─────────────────────────────── */}
      {aToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink className={navClass} to='/admin-dashboard'>
            <LayoutDashboard className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={navClass} to='/all-appointments'>
            <CalendarCheck className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink className={navClass} to='/add-doctor'>
            <UserPlus className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Add Doctors</p>
          </NavLink>

          <NavLink className={navClass} to='/doctor-list'>
            <Users className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>

          {/* Blood Donation Section */}
          <div className='hidden md:block px-9 pt-5 pb-1'>
            <p className='text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5'>
              <Droplets className='w-3.5 h-3.5' /> Blood Donation
            </p>
          </div>

          <NavLink className={bloodNavClass} to='/blood-donors'>
            <Heart className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Donors</p>
          </NavLink>

          <NavLink className={bloodNavClass} to='/blood-requests'>
            <AlertCircle className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Blood Requests</p>
          </NavLink>

          <NavLink className={bloodNavClass} to='/blood-analytics'>
            <BarChart3 className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Analytics</p>
          </NavLink>
        </ul>
      )}

      {/* ── DOCTOR SIDEBAR ─────────────────────────────── */}
      {dToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink className={navClass} to='/doctor-dashboard'>
            <LayoutDashboard className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={navClass} to='/doctor-appointments'>
            <CalendarCheck className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink className={navClass} to='/doctor-profile'>
            <UserCircle className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Profile</p>
          </NavLink>

          <NavLink className={navClass} to='/doctor-chat'>
            <MessageSquare className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Chats</p>
          </NavLink>

          {/* Blood Donation Section */}
          <div className='hidden md:block px-9 pt-5 pb-1'>
            <p className='text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5'>
              <Droplets className='w-3.5 h-3.5' /> Blood Donation
            </p>
          </div>

          <NavLink className={bloodNavClass} to='/doctor-blood-donor'>
            <Heart className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>My Donor Profile</p>
          </NavLink>

          <NavLink className={bloodNavClass} to='/doctor-blood-search'>
            <Search className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Search Donors</p>
          </NavLink>

          <NavLink className={bloodNavClass} to='/doctor-blood-requests'>
            <AlertCircle className='w-5 h-5 shrink-0' />
            <p className='hidden md:block'>Blood Requests</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default SideBar
