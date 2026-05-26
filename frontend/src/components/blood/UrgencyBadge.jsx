import { AlertCircle, AlertTriangle, Droplets } from 'lucide-react';

// Severity color system:
//   emergency → red
//   urgent    → orange
//   normal    → green
const URGENCY_CONFIG = {
  emergency: {
    label: 'EMERGENCY',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-400',
    dot: 'bg-red-500',
    icon: AlertCircle,
    ringColor: 'ring-red-500',
    solidBg: 'bg-red-600',
  },
  urgent: {
    label: 'URGENT',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-400',
    dot: 'bg-orange-500',
    icon: AlertTriangle,
    ringColor: 'ring-orange-500',
    solidBg: 'bg-orange-500',
  },
  normal: {
    label: 'Normal',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-400',
    dot: 'bg-green-500',
    icon: Droplets,
    ringColor: 'ring-green-500',
    solidBg: 'bg-green-600',
  },
};

export const getUrgencyConfig = (urgency) =>
  URGENCY_CONFIG[urgency] || URGENCY_CONFIG.normal;

export default function UrgencyBadge({ urgency, size = 'sm', showIcon = true }) {
  const cfg = getUrgencyConfig(urgency);

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1 font-semibold',
    md: 'text-sm px-3 py-1 font-semibold',
    lg: 'text-base px-4 py-1.5 font-bold',
  }[size] || 'text-xs px-2.5 py-1 font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses} uppercase tracking-wide`}
    >
      {showIcon && <cfg.icon className="w-3.5 h-3.5 shrink-0" />}
      {cfg.label}
    </span>
  );
}
