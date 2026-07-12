import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Syringe, AlertCircle, AlertTriangle, Bell, Droplets, PenLine, CheckCircle2, Heart, ArrowRight, Clock, UserCheck, FileText, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBloodStore } from '../../store/bloodStore';
import BloodGroupBadge from '../../components/blood/BloodGroupBadge';

const ALL_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const URGENCY_CONFIG = {
  emergency: { label: 'Emergency', cls: 'bg-red-100 text-red-700 border border-red-300',         dot: 'bg-red-500'    },
  urgent:    { label: 'Urgent',    cls: 'bg-orange-100 text-orange-700 border border-orange-300', dot: 'bg-orange-500' },
  normal:    { label: 'Normal',    cls: 'bg-green-100 text-green-700 border border-green-300',    dot: 'bg-green-500'  },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function BloodDonationHome() {
  const navigate  = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { donorProfile, getMyDonorProfile, getMyNotifications, getMyBloodRequests } = useBloodStore();
  const [donorResponses, setDonorResponses] = useState([]);
  const [myRequests,     setMyRequests]     = useState([]);

  useEffect(() => {
    if (isAuthenticated) getMyDonorProfile().catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyNotifications(1)
      .then((data) => {
        if (data.success) {
          const accepted = (data.notifications || []).filter((n) => n.type === 'donor_accepted');
          setDonorResponses(accepted.slice(0, 5));
        }
      })
      .catch(() => {});
    getMyBloodRequests(1)
      .then((data) => { if (data.requests) setMyRequests(data.requests.slice(0, 4)); })
      .catch(() => {});
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-400 rounded-2xl mb-10 px-6 py-14 text-center text-white shadow-xl">
        <div className="relative z-10">
          <Droplets className="w-16 h-16 text-white mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-extrabold mb-3">Blood Donation Network</h1>
          <p className="text-red-100 text-lg max-w-xl mx-auto mb-8">
            One donation can save up to 3 lives. Join Medislot's blood donor network and be someone's hero today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-red-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Login to Participate
              </button>
            ) : donorProfile ? (
              <button
                onClick={() => navigate('/blood-donation/profile')}
                className="bg-white text-red-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                My Donor Profile →
              </button>
            ) : (
              <button
                onClick={() => navigate('/blood-donation/register')}
                className="bg-white text-red-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Register as Donor
              </button>
            )}
            <button
              onClick={() => isAuthenticated ? navigate('/blood-donation/request') : navigate('/login')}
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-8 py-3 rounded-full border-2 border-white/30 transition-all hover:-translate-y-0.5"
            >
              Request Blood
            </button>
          </div>
        </div>
      </section>

      {/* Donor status banner if registered */}
      {isAuthenticated && donorProfile && (
        <div className={`mb-8 rounded-xl border-2 p-4 flex items-center justify-between gap-4 flex-wrap ${donorProfile.availabilityStatus ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${donorProfile.availabilityStatus ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <p className="font-semibold text-gray-800">
                {donorProfile.availabilityStatus ? 'You are available to donate' : 'You are marked unavailable'}
              </p>
              <p className="text-sm text-gray-500">Blood Group: <strong>{donorProfile.bloodGroup}</strong></p>
            </div>
          </div>
          <button
            onClick={() => navigate('/blood-donation/profile')}
            className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Manage Profile
          </button>
        </div>
      )}

      {/* Donor Responses + My Requests — side by side */}
      {isAuthenticated && (
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT — Donors Responded */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                Donor Responses
              </h2>
              <button
                onClick={() => navigate('/blood-donation/notifications')}
                className="text-xs text-red-600 font-semibold hover:text-red-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {donorResponses.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No donor responses yet</p>
                <p className="text-xs text-gray-400 mt-1">When donors accept your request, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {donorResponses.map((notif) => (
                  <div
                    key={notif._id}
                    className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 border border-green-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — My Blood Requests */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                My Blood Requests
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/blood-donation/request')}
                  className="text-xs text-white bg-red-500 hover:bg-red-600 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
                <button
                  onClick={() => navigate('/blood-donation/my-requests')}
                  className="text-xs text-red-600 font-semibold hover:text-red-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <Droplets className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No blood requests yet</p>
                <button
                  onClick={() => navigate('/blood-donation/request')}
                  className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Create Your First Request
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {myRequests.map((req) => {
                  const urgency  = URGENCY_CONFIG[req.urgencyType] || URGENCY_CONFIG.normal;
                  const statusCls = {
                    active:    'bg-blue-100 text-blue-700',
                    fulfilled: 'bg-green-100 text-green-700',
                    cancelled: 'bg-gray-100 text-gray-500',
                    closed:    'bg-gray-100 text-gray-500',
                  }[req.status] || 'bg-gray-100 text-gray-500';

                  return (
                    <div
                      key={req._id}
                      onClick={() => req.status === 'active' && navigate(`/blood-donation/requests/${req._id}/donors`)}
                      className={`border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-3 ${req.status === 'active' ? 'cursor-pointer hover:border-red-300 hover:bg-red-50/40' : ''} transition-colors`}
                    >
                      <div className="shrink-0">
                        <span className={`text-xs font-extrabold px-2 py-1 rounded-lg border ${
                          req.requiredBloodGroup?.includes('+') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {req.requiredBloodGroup}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{req.patientName}</p>
                        <p className="text-xs text-gray-400">{timeAgo(req.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCls}`}>
                          {req.status}
                        </span>
                        {req.notifiedCount > 0 && (
                          <span className="text-xs text-gray-400">{req.notifiedCount} notified</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </section>
      )}

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {[
          {
            Icon: Syringe, title: 'Donate Blood',
            desc: 'Register and make yourself available to help patients in need.',
            color: 'from-red-500 to-rose-500',
            action: () => navigate(isAuthenticated ? (donorProfile ? '/blood-donation/profile' : '/blood-donation/register') : '/login'),
            label: donorProfile ? 'View Profile' : 'Register Now',
          },
          {
            Icon: AlertCircle, title: 'Request Blood',
            desc: 'Create a blood request and notify compatible donors instantly.',
            color: 'from-orange-500 to-amber-500',
            action: () => navigate(isAuthenticated ? '/blood-donation/request' : '/login'),
            label: 'Request Now',
          },
          {
            Icon: FileText, title: 'My Requests',
            desc: 'Track your blood requests and see who accepted to donate.',
            color: 'from-blue-500 to-indigo-500',
            action: () => navigate(isAuthenticated ? '/blood-donation/my-requests' : '/login'),
            label: 'View Requests',
          },
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{card.desc}</p>
            <button onClick={card.action} className="text-sm font-semibold text-red-600 hover:text-red-700">
              {card.label} →
            </button>
          </div>
        ))}
      </section>

      {/* Blood Groups */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Blood Groups We Support</h2>
        <div className="flex flex-wrap gap-3">
          {ALL_GROUPS.map((g) => (
            <BloodGroupBadge key={g} group={g} size="md" />
          ))}
        </div>
      </section>

      {/* Urgency Guide */}
      <section className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Request Urgency Levels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { urgency: 'normal',    color: 'border-green-400 bg-green-50',   Icon: Droplets,      title: 'Normal',    iconClass: 'text-green-600',  desc: 'Planned requirement, 10km radius, 24–48hr window', badge: 'bg-green-100 text-green-800' },
            { urgency: 'urgent',    color: 'border-orange-400 bg-orange-50', Icon: AlertTriangle, title: 'Urgent',    iconClass: 'text-orange-600', desc: 'Needed soon, 20km radius, donors alerted immediately', badge: 'bg-orange-100 text-orange-800' },
            { urgency: 'emergency', color: 'border-red-500 bg-red-50',       Icon: AlertCircle,   title: 'Emergency', iconClass: 'text-red-600',    desc: 'Critical need, 50km radius, all compatible donors notified', badge: 'bg-red-100 text-red-800' },
          ].map((item) => (
            <div key={item.urgency} className={`border-2 rounded-xl p-4 ${item.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <item.Icon className={`w-5 h-5 shrink-0 ${item.iconClass}`} />
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${item.badge} uppercase`}>{item.title}</span>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-5">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', Icon: PenLine,      title: 'Register',    desc: 'Sign up as a blood donor with your blood group and location' },
            { step: '2', Icon: Bell,         title: 'Get Alerted', desc: 'Receive instant notifications when someone needs your blood type' },
            { step: '3', Icon: CheckCircle2, title: 'Accept',      desc: 'Accept the request and connect with the patient or family' },
            { step: '4', Icon: Heart,        title: 'Save a Life', desc: 'Donate blood and make a life-saving difference' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center mx-auto mb-2">
                <s.Icon className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xs text-red-500 font-bold uppercase mb-1">Step {s.step}</p>
              <p className="font-semibold text-gray-800 text-sm mb-1">{s.title}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
