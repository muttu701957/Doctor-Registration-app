import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Search, SlidersHorizontal, Clock, ChevronRight,
  Stethoscope, Brain, Baby, Microscope, Activity, Heart,
  FlaskConical, Users, X,
} from 'lucide-react';

const SPECIALITY_ICON = {
  'General physician':  Stethoscope,
  'Gynecologist':       Heart,
  'Dermatologist':      Microscope,
  'Pediatricians':      Baby,
  'Neurologist':        Brain,
  'Gastroenterologist': FlaskConical,
};

const Doctors = () => {
  const { speciality } = useParams();
  const navigate        = useNavigate();
  const { doctors }     = useContext(AppContext);

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter]           = useState(false);
  const [specialities, setSpecialities]       = useState([]);
  const [search, setSearch]                   = useState('');
  const [availableOnly, setAvailableOnly]     = useState(false);

  useEffect(() => {
    setSpecialities([...new Set(doctors.map((d) => d.speciality))]);
  }, [doctors]);

  useEffect(() => {
    let result = speciality ? doctors.filter((d) => d.speciality === speciality) : doctors;
    if (availableOnly) result = result.filter((d) => d.available);
    if (search.trim())
      result = result.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredDoctors(result);
  }, [doctors, speciality, search, availableOnly]);


  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Browse Doctors</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          {speciality ? ` — ${speciality}` : ''}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctor or speciality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Filter Sidebar */}
        <div className="shrink-0 sm:w-52">
          {/* Mobile toggle */}
          <button
            className="flex items-center gap-2 sm:hidden mb-3 text-sm font-medium text-purple-600 border border-purple-300 px-4 py-2 rounded-xl w-full justify-center"
            onClick={() => setShowFilter((p) => !p)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilter ? 'Hide Filters' : 'Filters'}
          </button>

          <div className={`${showFilter ? 'flex flex-wrap gap-2' : 'hidden'} sm:flex sm:flex-col sm:gap-1.5`}>
            <p className="w-full text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 hidden sm:block">
              Speciality
            </p>

            {/* Available only */}
            <button
              onClick={() => setAvailableOnly((p) => !p)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                availableOnly
                  ? 'bg-green-50 text-green-700 border-green-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${availableOnly ? 'bg-green-500' : 'bg-gray-300'}`} />
              Available Only
            </button>

            {/* All */}
            <button
              onClick={() => navigate('/doctors')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                !speciality
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              All Specialities
            </button>

            {specialities.map((spec) => {
              const Icon    = SPECIALITY_ICON[spec] || Activity;
              const active  = speciality === spec;
              return (
                <button
                  key={spec}
                  onClick={() => navigate(active ? '/doctors' : `/doctors/${spec}`)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="leading-tight">{spec}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor grid */}
        <div className="flex-1">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No doctors found</p>
              <button
                onClick={() => { setSearch(''); setAvailableOnly(false); navigate('/doctors'); }}
                className="mt-3 text-sm text-purple-600 underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor, index) => {
                const SpecIcon = SPECIALITY_ICON[doctor.speciality] || Activity;
                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/appointment/${doctor._id}`)}
                    className="bg-white border border-purple-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative bg-purple-50 h-52 overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Availability badge */}
                      <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        doctor.available
                          ? 'bg-green-50 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-500 border border-gray-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="font-semibold text-gray-900 text-base">{doctor.name}</p>
                      <div className="flex items-center gap-1.5 text-sm text-purple-600 font-medium mt-0.5 mb-3">
                        <SpecIcon className="w-3.5 h-3.5 shrink-0" />
                        {doctor.speciality}
                      </div>

                      {doctor.experience && (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full font-medium">
                          <Clock className="w-3 h-3 shrink-0" />
                          {doctor.experience} Experience
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400">Fee</p>
                          <p className="text-base font-bold text-gray-900">₹{doctor.fees}</p>
                        </div>
                        <button className="flex items-center gap-1 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90">
                          Book <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
