import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  const handleDelete = (docId) => setConfirmId(docId);

  const confirmDelete = async () => {
    await deleteDoctor(confirmId);
    setConfirmId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">{doctors.length} registered doctors</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image with overlay */}
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  src={item.image || 'https://via.placeholder.com/300x200?text=No+Photo'}
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Availability badge */}
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3 flex-grow">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 truncate">{item.name}</h2>
                  <p className="text-xs text-indigo-500 font-medium mt-0.5">{item.speciality}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.degree} · {item.experience} yrs exp</p>
                </div>

                {/* Availability toggle */}
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.available}
                      onChange={() => changeAvailability(item._id)}
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-indigo-500 transition-colors duration-200" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform duration-200" />
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </label>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-100 bg-red-50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3h6l1 1h4v2H4V4h4l1-1zm-2 4h10l-1 14H8L7 7zm4 2v10m2-10v10" stroke="currentColor" strokeWidth="0" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 7h12l-1.2 13.2A2 2 0 0114.8 22H9.2a2 2 0 01-1.994-1.8L6 7zm5 3a1 1 0 012 0v7a1 1 0 01-2 0v-7zM9 10a1 1 0 012 0v7a1 1 0 01-2 0v-7zM3 4a1 1 0 011-1h4.586l.707-.707A1 1 0 019.707 2h4.586a1 1 0 01.707.293L15.707 3H20a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  </svg>
                  Remove Doctor
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-gray-300">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <p className="text-sm font-medium">No doctors registered yet</p>
            <p className="text-xs mt-1">Add a doctor to get started</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-7 w-80 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove Doctor?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove the doctor and cancel all their pending appointments.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
