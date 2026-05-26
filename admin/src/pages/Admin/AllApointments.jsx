import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import {
  Search, X, CheckCircle2, XCircle, Clock,
  CreditCard, CalendarDays, User, Stethoscope, IndianRupee,
} from 'lucide-react';

const STATUS = {
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200',      dot: 'bg-red-500'    },
  completed: { label: 'Completed', cls: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500'  },
  paid:      { label: 'Paid',      cls: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-500'   },
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400'  },
};

function getStatus(item) {
  if (item.cancelled)   return 'cancelled';
  if (item.isCompleted) return 'completed';
  if (item.payment)     return 'paid';
  return 'pending';
}

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [search, setSearch] = useState('');

  useEffect(() => { if (aToken) getAllAppointments(); }, [aToken]);

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.userData?.name?.toLowerCase().includes(q) ||
      a.docData?.name?.toLowerCase().includes(q) ||
      a.docData?.speciality?.toLowerCase().includes(q)
    );
  });

  const counts = {
    total:     appointments.length,
    completed: appointments.filter((a) => a.isCompleted).length,
    cancelled: appointments.filter((a) => a.cancelled).length,
    pending:   appointments.filter((a) => !a.cancelled && !a.isCompleted && !a.payment).length,
    paid:      appointments.filter((a) => !a.cancelled && !a.isCompleted && a.payment).length,
  };

  return (
    <div className="w-full max-w-6xl mx-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">All Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{appointments.length} total appointments</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total',     value: counts.total,     Icon: CalendarDays,  cls: 'border-purple-200 bg-purple-50',  val: 'text-primary'       },
          { label: 'Completed', value: counts.completed, Icon: CheckCircle2,  cls: 'border-green-200  bg-green-50',   val: 'text-green-600'     },
          { label: 'Cancelled', value: counts.cancelled, Icon: XCircle,       cls: 'border-red-200    bg-red-50',     val: 'text-red-500'       },
          { label: 'Pending',   value: counts.pending,   Icon: Clock,         cls: 'border-amber-200  bg-amber-50',   val: 'text-amber-600'     },
        ].map(({ label, value, Icon, cls, val }) => (
          <div key={label} className={`border rounded-xl p-4 flex items-center gap-3 ${cls}`}>
            <Icon className={`w-5 h-5 shrink-0 ${val}`} />
            <div>
              <p className={`text-2xl font-bold leading-none ${val}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-[0.4fr_2fr_1.8fr_2fr_1fr_1.2fr_1fr] gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span>#</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> Patient</span>
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Date & Time</span>
          <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" /> Doctor</span>
          <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Fees</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100 max-h-[62vh] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No appointments found</p>
            </div>
          )}
          {filtered.map((item, index) => {
            const status = getStatus(item);
            const s      = STATUS[status];
            return (
              <div
                key={index}
                className="grid grid-cols-[0.4fr_2fr_1.8fr_2fr_1fr_1.2fr_1fr] gap-2 items-center px-5 py-3.5 hover:bg-gray-50/60 transition-colors text-sm max-sm:flex max-sm:flex-wrap max-sm:gap-3"
              >
                {/* # */}
                <span className="text-gray-400 font-medium max-sm:hidden">{index + 1}</span>

                {/* Patient */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.userData?.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover object-top bg-purple-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.userData?.name}</p>
                    <p className="text-xs text-gray-400">{calculateAge(item.userData?.dob)} yrs</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-gray-700">{slotDateFormat(item.slotDate)}</p>
                  <p className="text-xs text-gray-400">{item.slotTime}</p>
                </div>

                {/* Doctor */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.docData?.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover object-top bg-purple-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.docData?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{item.docData?.speciality}</p>
                  </div>
                </div>

                {/* Fees */}
                <p className="font-semibold text-gray-700">{currency}{item.docData?.fees}</p>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${s.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>

                {/* Action */}
                <div>
                  {!item.cancelled && !item.isCompleted ? (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      title="Cancel appointment"
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
