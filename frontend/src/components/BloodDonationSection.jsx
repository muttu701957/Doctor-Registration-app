import { useNavigate } from 'react-router-dom';
import { Droplets, ArrowRight, Heart, Users, Bell } from 'lucide-react';

const POINTS = [
  { Icon: Users, text: 'Register as a donor — it takes 2 minutes' },
  { Icon: Bell,  text: 'Get notified when someone near you needs blood' },
  { Icon: Heart, text: 'Respond and connect with the patient directly' },
];

export default function BloodDonationSection() {
  const navigate = useNavigate();

  return (
    <section className="mb-16 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-500 shadow-lg">
      <div className="px-8 sm:px-14 py-12 flex flex-col lg:flex-row items-center gap-10">

        {/* Left — text */}
        <div className="flex-1 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-red-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-200">Blood Donation Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
            Save Lives.<br />Donate Blood.
          </h2>
          <p className="text-red-100 text-base leading-relaxed mb-6 max-w-md">
            Join Medislot's blood donor network and help patients in urgent need. One donation can save up to 3 lives.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/blood-donation')}
              className="bg-white text-red-600 font-bold px-7 py-3 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              Join the Network
            </button>
            <button
              onClick={() => navigate('/blood-donation/requests')}
              className="flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-all text-sm"
            >
              View Blood Requests <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right — how it works (no fake stats) */}
        <div className="flex flex-col gap-4 lg:w-72 shrink-0 w-full">
          {POINTS.map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium leading-snug">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
