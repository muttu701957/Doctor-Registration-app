const GROUP_COLORS = {
  'O+':  'bg-red-50 text-red-700 border-red-300',
  'O-':  'bg-red-100 text-red-800 border-red-400',
  'A+':  'bg-blue-50 text-blue-700 border-blue-300',
  'A-':  'bg-blue-100 text-blue-800 border-blue-400',
  'B+':  'bg-purple-50 text-purple-700 border-purple-300',
  'B-':  'bg-purple-100 text-purple-800 border-purple-400',
  'AB+': 'bg-pink-50 text-pink-700 border-pink-300',
  'AB-': 'bg-pink-100 text-pink-800 border-pink-400',
};

export default function BloodGroupBadge({ group, size = 'md' }) {
  const colorClass = GROUP_COLORS[group] || 'bg-gray-100 text-gray-700 border-gray-300';

  const sizeClasses = {
    sm:  'text-sm px-2 py-0.5 font-bold',
    md:  'text-base px-3 py-1 font-bold',
    lg:  'text-xl px-4 py-1.5 font-extrabold',
    xl:  'text-2xl px-5 py-2 font-extrabold',
  }[size] || 'text-base px-3 py-1 font-bold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${colorClass} ${sizeClasses}`}>
      🩸 {group}
    </span>
  );
}
