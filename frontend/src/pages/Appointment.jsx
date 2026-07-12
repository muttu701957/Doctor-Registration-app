import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { useAuthStore } from '../store/authStore.js';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  BadgeCheck, Clock, Calendar, ChevronRight, Loader2,
  GraduationCap, IndianRupee,
} from 'lucide-react';

const DAY_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Appointment = () => {
  const { docId }   = useParams();
  const navigate    = useNavigate();
  const { doctors, currencySymbol, backendUrl, getDoctorsData } = useContext(AppContext);
  const { isAuthenticated, user, isLoading } = useAuthStore();

  const [docInfo,   setDocInfo]   = useState(null);
  const [docSlots,  setDocSlots]  = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime,  setSlotTime]  = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const found = doctors.find((d) => d._id === docId);
    if (found) setDocInfo(found);
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) buildSlots();
  }, [docInfo]);

  const buildSlots = () => {
    setDocSlots([]);
    const today = new Date();
    const slots = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(today);
      cur.setDate(today.getDate() + i);
      const end = new Date(cur); end.setHours(21, 0, 0, 0);
      if (i === 0) {
        cur.setHours(cur.getHours() > 10 ? cur.getHours() + 1 : 10);
        cur.setMinutes(cur.getMinutes() > 30 ? 30 : 0);
      } else {
        cur.setHours(10, 0, 0, 0);
      }
      const times = [];
      while (cur < end) {
        times.push({ datetime: new Date(cur), time: cur.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        cur.setMinutes(cur.getMinutes() + 30);
      }
      slots.push(times);
    }
    setDocSlots(slots);
  };

  const normalizeTime = (t) =>
    new Date(`1970-01-01 ${t}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getSlotStatus = (slotDate, time, datetime) => {
    const booked = (docInfo.slots_booked[slotDate] || []).map(normalizeTime);
    if (booked.includes(normalizeTime(time))) return 'booked';
    if (datetime < new Date(Date.now() - 3_600_000)) return 'past';
    const total = docSlots[slotIndex]?.length || 20;
    if ((docInfo.slots_booked[slotDate] || []).length / total > 0.5) return 'fast';
    return 'available';
  };

  const handleBooking = async () => {
    if (!isAuthenticated) { toast.error('Please login to book'); navigate('/login'); return; }
    if (!slotTime) { toast.error('Please select a time slot'); return; }
    setIsBooking(true);
    try {
      const date      = docSlots[slotIndex][0].datetime;
      const slotDate  = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const { data }  = await axios.post(backendUrl + '/api/auth/book-appointment', { docId, slotDate, slotTime });
      if (data.success) { toast.success(data.message); getDoctorsData(); navigate('/my-appointments'); }
      else toast.error(data.message);
    } catch { toast.error('Error booking appointment. Please try again.'); }
    finally { setIsBooking(false); }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated || !user) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Please log in to book an appointment.</p>
      <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90">
        Login
      </button>
    </div>
  );
  if (!docInfo) return <LoadingSpinner />;

  const selectedDaySlots = docSlots[slotIndex] || [];
  const selectedDay      = docSlots[slotIndex]?.[0]?.datetime;

  return (
    <div className="pb-16">
      {/* Doctor profile card — light theme */}
      <div className="flex flex-col sm:flex-row gap-5 mb-8">
        {/* Photo */}
        <div className="shrink-0">
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-full sm:max-w-72 rounded-xl bg-purple-50 object-cover object-top"
          />
        </div>

        {/* Info card */}
        <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white mt-0 sm:mt-0">
          {/* Name + verified */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">{docInfo.name}</h1>
            <img src={assets.verified_icon} alt="verified" className="w-5 h-5" />
          </div>

          {/* Degree · Speciality · Experience */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
              {docInfo.degree}
            </span>
            <span className="text-gray-300">|</span>
            <span>{docInfo.speciality}</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              {docInfo.experience} Experience
            </span>
            <span className="border border-gray-300 text-xs text-gray-600 px-2 py-0.5 rounded-full ml-1">
              {docInfo.experience}
            </span>
          </div>

          {/* About */}
          <div className="mb-5">
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800 mb-1">
              About <img src={assets.info_icon} alt="" className="w-4 h-4" />
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{docInfo.about}</p>
          </div>

          {/* Fee */}
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <IndianRupee className="w-4 h-4 text-gray-400 shrink-0" />
            Appointment fee:
            <span className="font-semibold text-gray-900 ml-1">{currencySymbol}{docInfo.fees}</span>
          </div>
        </div>
      </div>

      {/* Booking slot section */}
      <div className="sm:ml-72 sm:pl-4">
        <p className="font-medium text-gray-700 mb-4">Booking Slots</p>

        {/* Day picker */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {docSlots.map((daySlots, idx) => {
            const d = daySlots[0]?.datetime;
            if (!d) return null;
            return (
              <button
                key={idx}
                onClick={() => { setSlotIndex(idx); setSlotTime(''); }}
                className={`shrink-0 flex flex-col items-center px-4 py-3 rounded-full border-2 min-w-[60px] transition-all ${
                  slotIndex === idx
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <span className="text-xs font-semibold">{DAY_NAMES[d.getDay()]}</span>
                <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedDaySlots.map((slot, idx) => {
            const d        = slot.datetime;
            const slotDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            const status   = getSlotStatus(slotDate, slot.time, d);
            const selected = slot.time === slotTime;

            let cls = '';
            if (selected)           cls = 'bg-purple-500 text-white border-purple-500 cursor-pointer';
            else if (status === 'booked') cls = 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed line-through';
            else if (status === 'past')   cls = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
            else if (status === 'fast')   cls = 'bg-amber-50 text-amber-700 border-amber-300 cursor-pointer hover:bg-amber-100';
            else                          cls = 'bg-white text-gray-700 border-gray-300 cursor-pointer hover:border-purple-400 hover:bg-purple-50';

            return (
              <button
                key={idx}
                disabled={status === 'booked' || status === 'past'}
                onClick={() => (status === 'available' || status === 'fast') && setSlotTime(slot.time)}
                className={`text-sm px-4 py-2 rounded-full border-2 shrink-0 font-medium transition-all ${cls}`}
              >
                {slot.time.toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Selected slot summary */}
        {slotTime && selectedDay && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-gray-800">
                {DAY_NAMES[selectedDay.getDay()]}, {selectedDay.getDate()} {MONTH_SHORT[selectedDay.getMonth()]}
              </span>
              <span className="text-gray-500"> at </span>
              <span className="font-semibold text-gray-800">{slotTime}</span>
              <span className="text-gray-400 ml-2">· {currencySymbol}{docInfo.fees}</span>
            </div>
          </div>
        )}

        {/* Book button */}
        <button
          onClick={handleBooking}
          disabled={isBooking || !slotTime}
          className="bg-primary text-white text-sm font-medium px-14 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {isBooking ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
          ) : (
            <>{slotTime ? 'Book an Appointment' : 'Select a slot first'} {slotTime && <ChevronRight className="w-4 h-4" />}</>
          )}
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
