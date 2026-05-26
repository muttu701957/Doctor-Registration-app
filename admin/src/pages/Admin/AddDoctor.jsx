import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import assets from '../../assets/assets';
import { UserCircle, Stethoscope, MapPin, Camera, Loader2, ChevronDown, CheckCircle2 } from 'lucide-react';

const specialties = [
  'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians',
  'Neurologist', 'Gastroenterologist', 'Cardiologist', 'Orthopedic Surgeon',
  'Psychiatrist', 'Oncologist', 'Ophthalmologist', 'Urologist',
  'Radiologist', 'Endocrinologist', 'Rheumatologist', 'Plastic Surgeon', 'Other',
];

const inputCls = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, type = 'text', placeholder, required = true }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={inputCls} />
);

function isComplete(id, s) {
  if (id === 0) return !!(s.docImg && s.name && s.email && s.password);
  if (id === 1) return !!(s.degree && s.fees && (!s.isOther || s.customSpec));
  if (id === 2) return !!(s.address1 && s.about);
  return false;
}

const STEPS = [
  { num: 1, icon: UserCircle,  title: 'Identity & Login',      sub: 'Photo, name, email, password',        accent: '#7c3aed', light: '#f5f3ff', border: '#c4b5fd' },
  { num: 2, icon: Stethoscope, title: 'Professional Details',  sub: 'Speciality, degree, experience, fees', accent: '#2563eb', light: '#eff6ff', border: '#93c5fd' },
  { num: 3, icon: MapPin,      title: 'Location & About',      sub: 'Clinic address and bio',               accent: '#16a34a', light: '#f0fdf4', border: '#86efac' },
];

const AddDoctor = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [open,         setOpen]         = useState([true, false, false]);
  const [name,         setName]         = useState('');
  const [docImg,       setDocImg]       = useState(null);
  const [speciality,   setSpeciality]   = useState('General physician');
  const [isOther,      setIsOther]      = useState(false);
  const [customSpec,   setCustomSpec]   = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [experience,   setExperience]   = useState('1');
  const [fees,         setFees]         = useState('');
  const [degree,       setDegree]       = useState('');
  const [address1,     setAddress1]     = useState('');
  const [address2,     setAddress2]     = useState('');
  const [about,        setAbout]        = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fs = { name, email, password, docImg, degree, fees, speciality, isOther, customSpec, address1, about };
  const completedCount = [0, 1, 2].filter((i) => isComplete(i, fs)).length;

  const toggle = (i) => setOpen((prev) => prev.map((v, idx) => idx === i ? !v : v));

  const handleSpeciality = (e) => {
    const val = e.target.value;
    setSpeciality(val);
    setIsOther(val === 'Other');
    if (val !== 'Other') setCustomSpec('');
  };

  const resetForm = () => {
    setDocImg(null); setName(''); setEmail(''); setPassword('');
    setExperience('1'); setFees(''); setDegree('');
    setAddress1(''); setAddress2(''); setAbout('');
    setSpeciality('General physician'); setIsOther(false); setCustomSpec('');
    setOpen([true, false, false]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!docImg) return toast.error('Please upload a doctor photo');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image',      docImg);
      formData.append('name',       name);
      formData.append('email',      email);
      formData.append('password',   password);
      formData.append('experience', experience);
      formData.append('fees',       Number(fees));
      formData.append('about',      about);
      formData.append('speciality', isOther ? customSpec : speciality);
      formData.append('degree',     degree);
      formData.append('address',    JSON.stringify({ line: address1, line2: address2 }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctors`, formData, { headers: { aToken } });

      if (data.success) { toast.success(data.message); resetForm(); }
      else toast.error(data.message);
    } catch {
      toast.error('Failed to add doctor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-5 pb-10">

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-gray-800">Add New Doctor</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete all three sections then click Add Doctor</p>
      </div>

      <form onSubmit={onSubmit}>

        {/* ── Vertical stepper ──────────────────────────────────────── */}
        <div className="flex flex-col">
          {STEPS.map((step, i) => {
            const done    = isComplete(i, fs);
            const isOpen  = open[i];
            const isLast  = i === STEPS.length - 1;

            return (
              <div key={step.num} className="flex gap-4">

                {/* Left — step indicator + vertical line */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-sm transition-all z-10"
                    style={done
                      ? { background: step.accent, borderColor: step.accent, color: '#fff' }
                      : isOpen
                        ? { background: step.light, borderColor: step.accent, color: step.accent }
                        : { background: '#f9fafb', borderColor: '#d1d5db', color: '#9ca3af' }
                    }
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </button>

                  {/* Vertical connecting line */}
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 my-1 rounded-full transition-all duration-500"
                      style={{ background: done ? step.accent : '#e5e7eb', minHeight: '16px' }}
                    />
                  )}
                </div>

                {/* Right — section card */}
                <div className="flex-1 mb-3">
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:shadow-sm"
                    style={{
                      background:   isOpen ? step.light : '#ffffff',
                      borderColor:  isOpen ? step.border : '#e5e7eb',
                    }}
                  >
                    <step.icon
                      className="w-4 h-4 shrink-0 transition-colors"
                      style={{ color: isOpen ? step.accent : '#9ca3af' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                      <p className="text-xs text-gray-400">{step.sub}</p>
                    </div>
                    <ChevronDown
                      className="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {/* Sliding content */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? '900px' : '0px', opacity: isOpen ? 1 : 0 }}
                  >
                    <div
                      className="border border-t-0 rounded-b-xl px-5 py-5"
                      style={{ borderColor: step.border }}
                    >
                      {/* Section 1 content */}
                      {i === 0 && (
                        <>
                          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                            <label htmlFor="doc-img" className="cursor-pointer group relative shrink-0">
                              <img
                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                                alt="Doctor"
                                className="w-20 h-20 rounded-2xl object-cover object-top bg-purple-50 border-2 border-dashed border-purple-200 group-hover:border-purple-400 transition"
                              />
                              <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                                <Camera className="w-5 h-5 text-white" />
                              </div>
                            </label>
                            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" accept="image/*" hidden />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Doctor Photo</p>
                              <p className="text-xs text-gray-400 mt-0.5">Click to upload · JPG or PNG</p>
                              {docImg && <p className="text-xs font-medium mt-1" style={{ color: STEPS[0].accent }}>{docImg.name}</p>}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name">
                              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. John Smith" />
                            </Field>
                            <Field label="Email Address">
                              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@email.com" />
                            </Field>
                            <Field label="Password">
                              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set login password" />
                            </Field>
                          </div>
                        </>
                      )}

                      {/* Section 2 content */}
                      {i === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Speciality">
                            <select value={speciality} onChange={handleSpeciality} className={inputCls}>
                              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </Field>
                          {isOther && (
                            <Field label="Custom Speciality">
                              <Input value={customSpec} onChange={(e) => setCustomSpec(e.target.value)} placeholder="e.g. Sports Medicine" />
                            </Field>
                          )}
                          <Field label="Education / Degree">
                            <Input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. MBBS, MD" />
                          </Field>
                          <Field label="Experience">
                            <select value={experience} onChange={(e) => setExperience(e.target.value)} className={inputCls}>
                              {[...Array(25).keys()].map((n) => (
                                <option key={n + 1} value={n + 1}>{n + 1} Year{n !== 0 ? 's' : ''}</option>
                              ))}
                              <option value="25+">25+ Years</option>
                            </select>
                          </Field>
                          <Field label="Consultation Fees (₹)">
                            <Input type="number" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="e.g. 500" />
                          </Field>
                        </div>
                      )}

                      {/* Section 3 content */}
                      {i === 2 && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <Field label="Address Line 1">
                              <Input value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Clinic / Hospital name" />
                            </Field>
                            <Field label="Address Line 2">
                              <Input value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="City, State" required={false} />
                            </Field>
                          </div>
                          <Field label="About Doctor">
                            <textarea
                              value={about}
                              onChange={(e) => setAbout(e.target.value)}
                              placeholder="Brief bio — specialisation, approach, achievements..."
                              rows={4}
                              required
                              className={`${inputCls} resize-none`}
                            />
                          </Field>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Add Doctor button — always visible below the stepper ─── */}
        <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ background: isComplete(i, fs) ? '#7c3aed' : '#e5e7eb' }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">{completedCount} of 3 sections complete</p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: '#5f6FFF' }}
          >
            {isSubmitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding Doctor...</>
              : 'Add Doctor'
            }
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddDoctor;
