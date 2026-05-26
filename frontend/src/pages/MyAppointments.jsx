import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar, Clock, MapPin, CreditCard, MessageCircle,
  XCircle, CheckCircle2, AlertCircle, Ban,
} from 'lucide-react';

const MyAppointments = () => {
  const { backendUrl, getDoctorsData }         = useContext(AppContext);
  const { user, isAuthenticated, isLoading }   = useAuthStore();
  const [appointments, setAppointments]         = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [appointmentsFetched, setFetched]       = useState(false);
  const navigate = useNavigate();

  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = (d) => { const [y, m, day] = d.split('-'); return `${day} ${months[+m]} ${y}`; };

  useEffect(() => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/login'); }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && !appointmentsFetched) { fetchAppointments(); setFetched(true); }
    else if (!user) { setFetched(false); setAppointments([]); }
  }, [user, appointmentsFetched]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/appointments`);
      if (data.success) setAppointments(data.appointments.reverse());
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  // Chat allowed from booking; after completion only within 72 hours
  const getChatState = (item) => {
    if (item.cancelled) return 'none';
    if (!item.isCompleted) return 'active';
    const diffHours = (Date.now() - new Date(item.completedAt || item.date).getTime()) / 3_600_000;
    return diffHours <= 72 ? 'active' : 'expired';
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/cancel-appointment`, { appointmentId: id });
      if (data.success) { toast.success(data.message); fetchAppointments(); getDoctorsData(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount, currency: order.currency,
      name: 'Appointment Payment', description: 'Appointment Payment',
      order_id: order.id, receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/auth/verifyRazorpay`, response);
          if (data.success) { toast.success(data.message); fetchAppointments(); }
          else toast.error(data.message);
        } catch (e) { toast.error(e.response?.data?.message || e.message); }
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: '#5f6FFF' },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
    rzp.open();
  };

  const payOnline = async (id, fees) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/payment-razorpay`, { appointmentId: id, amount: fees });
      if (data.success) initPay(data.order);
      else toast.error(data.message || 'Failed to initiate payment.');
    } catch (e) { toast.error(e.response?.data?.message || 'Error initiating payment.'); }
  };

  const parseAddress = (addr) => {
    try {
      if (typeof addr === 'string') return JSON.parse(addr.replace(/'/g, '"').replace(/(\w+):/g, '"$1":'));
      return addr;
    } catch { return { line1: '', line2: '' }; }
  };

  if (isLoading || loading) return <LoadingSpinner />;

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>

      {appointments.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 mt-6">
          <Calendar className="w-12 h-12 text-purple-200 mx-auto mb-3" />
          <p className="text-gray-500">No appointments yet</p>
          <button
            onClick={() => navigate('/doctors')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90"
          >
            Find a Doctor
          </button>
        </div>
      )}

      <div>
        {appointments.slice(0, 10).map((item, index) => {
          const addr       = parseAddress(item.docData?.address);
          const chatState  = getChatState(item);

          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
            >
              {/* Doctor photo */}
              <div>
                <img
                  className="w-32 rounded-lg bg-indigo-50 object-cover object-top"
                  src={item.docData?.image || '/placeholder.png'}
                  alt={item.docData?.name || 'Doctor'}
                />
              </div>

              {/* Details */}
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold text-base">{item.docData?.name || 'Doctor'}</p>
                <p className="text-purple-600 text-sm font-medium">{item.docData?.speciality || 'Specialist'}</p>

                {(addr.line1 || addr.line2) && (
                  <p className="flex items-start gap-1 mt-1 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    {[addr.line1, addr.line2].filter(Boolean).join(', ')}
                  </p>
                )}

                <p className="flex items-center gap-1 mt-1.5 text-zinc-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {fmtDate(item.slotDate)}
                  <span className="mx-1 text-gray-300">|</span>
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {item.slotTime || 'N/A'}
                </p>

                {/* 72-hour countdown when completed */}
                {item.isCompleted && chatState === 'active' && (() => {
                  const hoursLeft = Math.ceil(72 - (Date.now() - new Date(item.completedAt || item.date).getTime()) / 3_600_000);
                  return (
                    <p className="text-xs text-green-600 mt-1.5">
                      Chat open for {hoursLeft} more hour{hoursLeft !== 1 ? 's' : ''}
                    </p>
                  );
                })()}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-end">
                {/* Status badges */}
                {item.cancelled && (
                  <button className="flex items-center justify-center gap-1.5 sm:min-w-48 py-2 border border-red-400 rounded text-red-500 text-sm cursor-default">
                    <Ban className="w-3.5 h-3.5" /> Cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className="flex items-center justify-center gap-1.5 sm:min-w-48 py-2 border border-green-400 rounded text-green-600 text-sm cursor-default">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </button>
                )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="flex items-center justify-center gap-1.5 sm:min-w-48 py-2 border border-primary rounded text-primary text-sm cursor-default">
                    <CreditCard className="w-3.5 h-3.5" /> Paid
                  </button>
                )}

                {/* Pay Online */}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => payOnline(item._id, item.docData?.fees)}
                    className="flex items-center justify-center gap-1.5 text-sm text-stone-500 text-center sm:min-w-48 py-2.5 border hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pay Online
                  </button>
                )}

                {/* Cancel */}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="flex items-center justify-center gap-1.5 text-sm text-stone-500 text-center sm:min-w-48 py-2.5 border hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel Appointment
                  </button>
                )}

                {/* Chat — available from booking, 72h post completion */}
                {chatState === 'active' && (
                  <button
                    onClick={() => navigate('/doctor/chat', { state: item })}
                    className="flex items-center justify-center gap-1.5 text-sm text-white bg-primary text-center sm:min-w-48 py-2.5 border border-primary hover:opacity-90 transition-all duration-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat with Doctor
                  </button>
                )}

                {/* Chat expired */}
                {chatState === 'expired' && (
                  <button className="flex items-center justify-center gap-1.5 text-sm text-gray-400 border sm:min-w-48 py-2.5 cursor-not-allowed">
                    <MessageCircle className="w-3.5 h-3.5" /> Chat Expired
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
