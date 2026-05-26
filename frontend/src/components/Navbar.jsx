import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import { NavLink, useNavigate } from 'react-router-dom';
import { Droplets, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBloodStore } from '../store/bloodStore';
import { socket as appSocket } from '../socket';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { unreadCount, getUnreadCount, pushIncomingNotification } = useBloodStore();
  const navigate  = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Poll unread blood notification count + subscribe to socket alerts
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    getUnreadCount();

    if (appSocket && user?._id) {
      appSocket.emit('join_blood_room', user._id);
      appSocket.on('blood_notification', (data) => {
        pushIncomingNotification({ ...data, createdAt: new Date().toISOString(), isRead: false });
      });
    }

    return () => {
      appSocket?.off('blood_notification');
    };
  }, [isAuthenticated, user, getUnreadCount, pushIncomingNotification]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400 px-4 md:px-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          className="w-16 cursor-pointer"
          src={assets.logo}
          alt="logo"
          onClick={() => navigate('/')}
        />
        <p className="text-xl font-bold">MediSlot</p>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-5 font-medium">
        <NavLink to="/"><li className="py-1">Home</li></NavLink>
        <NavLink to="/doctors"><li className="py-1">All Doctors</li></NavLink>
        <NavLink to="/about"><li className="py-1">About</li></NavLink>
        <NavLink to="/contact"><li className="py-1">Contact</li></NavLink>
        {/* Blood Donation Link */}
        <NavLink to="/blood-donation">
          <li className="py-1 flex items-center gap-1.5 text-red-600 font-semibold hover:text-red-700">
            <Droplets className="w-4 h-4" /> Blood Donation
          </li>
        </NavLink>
      </ul>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Blood Notification Bell */}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/blood-donation/notifications')}
            className="relative p-1.5 rounded-full hover:bg-red-50 transition-colors"
            title="Blood Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              onClick={() => navigate('/')}
              className="w-8 rounded-full"
              src={user?.image || assets.profile_pic || 'https://via.placeholder.com/150'}
              alt="profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                <p onClick={() => navigate('/blood-donation')} className="hover:text-black cursor-pointer flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-red-600" /> Blood Donation
                </p>
                <p onClick={() => navigate('/blood-donation/notifications')} className="hover:text-black cursor-pointer flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" /> Blood Alerts
                  {unreadCount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">{unreadCount}</span>
                  )}
                </p>
                <p onClick={handleLogout} className="hover:text-black cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-5 py-2 rounded-full font-light hidden md:block"
            >
              Login
            </button>
            <a
              href="http://localhost:5174/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-5 py-2 rounded-full font-light hidden md:block"
            >
              Admin Panel
            </a>
          </>
        )}

        {/* Hamburger */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed md:hidden top-0 right-0 z-50 bg-white h-screen w-[70%] transition-transform ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-200">
          <img
            className="w-7 cursor-pointer"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <ul className="flex flex-col items-start gap-4 mt-5 px-6 text-base font-medium">
          <NavLink to="/" onClick={() => setShowMenu(false)}>Home</NavLink>
          <NavLink to="/doctors" onClick={() => setShowMenu(false)}>All Doctors</NavLink>
          <NavLink to="/about" onClick={() => setShowMenu(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setShowMenu(false)}>Contact</NavLink>
          <NavLink to="/blood-donation" onClick={() => setShowMenu(false)} className="flex items-center gap-1.5 text-red-600 font-semibold">
            <Droplets className="w-4 h-4" /> Blood Donation
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={() => setShowMenu(false)} className="text-blue-600 mt-4">Login</NavLink>
              <a
                href="https://doctor-booking-appointment-application-6gu7.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600"
              >
                Admin Panel
              </a>
            </>
          ) : (
            <>
              <NavLink to="/my-profile" onClick={() => setShowMenu(false)}>My Profile</NavLink>
              <NavLink to="/my-appointments" onClick={() => setShowMenu(false)}>My Appointments</NavLink>
              <NavLink to="/blood-donation/notifications" onClick={() => setShowMenu(false)} className="flex items-center gap-1.5 text-red-600">
                <Bell className="w-4 h-4" /> Blood Alerts
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </NavLink>
              <p onClick={() => { setShowMenu(false); handleLogout(); }} className="cursor-pointer text-red-500">Logout</p>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
