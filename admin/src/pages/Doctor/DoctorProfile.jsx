import React, { useContext, useEffect, useRef, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContest';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  const updateProfile = async () => {
    try {
      const updateData = {
        docId: profileData._id,
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        about: profileData.about,
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, { headers: { dToken } });
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to backend
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('docId', profileData._id);

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-photo`, formData, {
        headers: { dToken, 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Profile photo updated!');
        setProfileData(prev => ({ ...prev, image: data.imageUrl }));
        setPhotoPreview(null);
      } else {
        toast.error(data.message);
        setPhotoPreview(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!profileData) return null;

  const displayImage = photoPreview || profileData.image || '/default-profile.png';

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 max-h-[90vh] overflow-y-auto">
      <div className="max-w-4xl mx-auto">

        {/* Hero Card */}
        <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
          {/* Top gradient band */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400" />

          {/* Avatar + name row */}
          <div className="px-8 pb-6">
            <div className="flex items-end gap-6 -mt-16">
              {/* Photo with edit overlay */}
              <div className="relative group flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  {uploadingPhoto ? (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                      <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px'}} />
                    </div>
                  ) : (
                    <img src={displayImage} alt="Doctor" className="w-full h-full object-cover" />
                  )}
                </div>
                {/* Edit photo button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 w-28 h-28 rounded-2xl bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="Change photo"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span className="text-white text-xs font-semibold mt-1">Change</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Name / title */}
              <div className="pb-1 flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{profileData.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-sm text-gray-500">{profileData.degree}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-sm font-medium text-indigo-600">{profileData.speciality}</span>
                  <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-semibold border border-indigo-100">
                    {profileData.experience} yrs exp
                  </span>
                </div>
              </div>

              {/* Edit / Save button */}
              <div className="pb-1 flex-shrink-0">
                {isEdit ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setIsEdit(false); getProfileData(); }}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateProfile}
                      className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* About */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">About</h2>
            </div>
            {isEdit ? (
              <textarea
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={profileData.about}
                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{profileData.about || 'No description added.'}</p>
            )}
          </div>

          {/* Fees */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Appointment Fee</h2>
            </div>
            {isEdit ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-400">{currency}</span>
                <input
                  type="number"
                  className="border border-gray-200 rounded-xl p-2.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-semibold text-gray-800"
                  value={profileData.fees}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: parseFloat(e.target.value) || '' }))}
                />
              </div>
            ) : (
              <p className="text-2xl font-bold text-green-600">{currency} {profileData.fees}</p>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Availability</h2>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData.available}
                  onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                  disabled={!isEdit}
                />
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${profileData.available ? 'bg-indigo-500' : 'bg-gray-200'} ${!isEdit ? 'opacity-60' : ''}`} />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${profileData.available ? 'translate-x-6' : ''}`} />
              </div>
              <span className={`text-sm font-semibold ${profileData.available ? 'text-indigo-600' : 'text-gray-400'}`}>
                {profileData.available ? 'Accepting Appointments' : 'Not Available'}
              </span>
            </label>
            {!isEdit && (
              <p className="text-xs text-gray-400 mt-2">Enable edit mode to change availability</p>
            )}
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Clinic Address</h2>
            </div>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Address line 1"
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={profileData.address?.line || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line: e.target.value } }))}
                />
                <input
                  type="text"
                  placeholder="Address line 2 (city, state)"
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={profileData.address?.line2 || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                />
              </div>
            ) : (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p>{profileData.address?.line || '—'}</p>
                {profileData.address?.line2 && <p>{profileData.address.line2}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Photo hint */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Hover over your photo to update it · Changes are saved instantly
        </p>
      </div>
    </div>
  );
};

export default DoctorProfile;
