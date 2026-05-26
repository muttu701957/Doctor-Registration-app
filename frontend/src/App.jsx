import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import LoadingSpinner from './components/LoadingSpinner'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SignUp from './pages/SignUp'
import LoginComponent from './pages/LoginComponent'
import ChatPage from './pages/Chat'
import EmailVerification from './pages/EmailVerification'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore';
import ResetPasswordPage from './pages/ResetPasswordPage'
import BloodDonationHome from './pages/BloodDonation/BloodDonationHome'
import DonorRegistration from './pages/BloodDonation/DonorRegistration'
import DonorProfile from './pages/BloodDonation/DonorProfile'
import BloodRequestForm from './pages/BloodDonation/BloodRequestForm'
import MyBloodRequests from './pages/BloodDonation/MyBloodRequests'
import BloodNotifications from './pages/BloodDonation/BloodNotifications'
import BloodDonorResults from './pages/BloodDonation/BloodDonorResults'
import ActiveBloodRequests from './pages/BloodDonation/ActiveBloodRequests'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return children;
}

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />
  }
  return children;
}

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />;

  const location = useLocation();
  const hideHeaderFooterRoutes = ['/verify-email', '/forgot-password', '/reset-password/:token', '/login', '/signUp', '/doctor/chat' ];
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route => location.pathname.startsWith(route.replace('/:token', '')));

  return (
    <div className='mx-4 sm:mx-[10%] relative'>
      {!shouldHideHeaderFooter && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={
          <RedirectAuthenticatedUser>
            <LoginComponent />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/Signup' element={
          <RedirectAuthenticatedUser>
            <SignUp />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/verify-email' element={<EmailVerification />} />
        <Route path='/forgot-password' element={
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/reset-password/:token' element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } />

      <Route path='/doctor/chat' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Blood Donation Routes */}
        <Route path='/blood-donation' element={<BloodDonationHome />} />
        <Route path='/blood-donation/register' element={<ProtectedRoute><DonorRegistration /></ProtectedRoute>} />
        <Route path='/blood-donation/profile' element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
        <Route path='/blood-donation/request' element={<ProtectedRoute><BloodRequestForm /></ProtectedRoute>} />
        <Route path='/blood-donation/my-requests' element={<ProtectedRoute><MyBloodRequests /></ProtectedRoute>} />
        <Route path='/blood-donation/notifications' element={<ProtectedRoute><BloodNotifications /></ProtectedRoute>} />
        <Route path='/blood-donation/requests' element={<ActiveBloodRequests />} />
        <Route path='/blood-donation/requests/:requestId/donors' element={<ProtectedRoute><BloodDonorResults /></ProtectedRoute>} />
      </Routes>
      <Toaster />
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  )
}

export default App
