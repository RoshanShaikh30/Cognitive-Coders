import React, { useMemo } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { BOTANICAL_ASSETS } from '../../assets/images';

interface AttendanceTreeVisualProps {
  percentage: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const AttendanceTreeVisual: React.FC<AttendanceTreeVisualProps> = ({
  percentage,
  label = 'Academic Vitality Specimen',
  size = 'md',
  showDetails = true,
}) => {
  // Determine Vitality Tier based on institutional attendance quotas
  const tier = useMemo(() => {
    if (percentage >= 95) {
      return {
        level: 'Optimal Standing',
        sub: 'Full Presence Quota',
        description: 'Exemplary attendance record. Student is well above institutional examination requirements with a strong safety cushion.',
        icon: Sparkles,
        badgeBg: 'bg-[#626c59]/15 border-[#626c59]/30 text-[#626c59]',
        badgeText: 'Optimal (95%+)',
        filterStyle: 'contrast-[1.05] brightness-[1.0] saturate-[1.05]',
        statusRing: '#626c59',
        bloomPercent: 100,
      };
    } else if (percentage >= 85) {
      return {
        level: 'Consistent Standing',
        sub: 'Healthy Presence',
        description: 'Consistent attendance record meeting statutory university quotas with permissible absence allowances.',
        icon: ShieldCheck,
        badgeBg: 'bg-[#b48728]/15 border-[#b48728]/30 text-[#b48728]',
        badgeText: 'Healthy (85–94%)',
        filterStyle: 'contrast-[1.02] brightness-[0.98] saturate-[0.95]',
        statusRing: '#b48728',
        bloomPercent: 85,
      };
    } else if (percentage >= 75) {
      return {
        level: 'Borderline Standing',
        sub: 'Statutory Quota Threshold',
        description: 'Student is approaching the minimum 75% attendance threshold. Immediate vigilance advised against further absences.',
        icon: CheckCircle2,
        badgeBg: 'bg-[#b48728]/15 border-[#b48728]/30 text-[#b48728]',
        badgeText: 'Borderline (75–84%)',
        filterStyle: 'contrast-[1.0] brightness-[0.94] saturate-[0.85] sepia-[0.1]',
        statusRing: '#d97706',
        bloomPercent: 75,
      };
    } else {
      return {
        level: 'Critical Standing',
        sub: 'Debarment Warning',
        description: 'Below the mandatory 75% threshold. Mandatory remediation required to avoid academic examination debarment.',
        icon: AlertTriangle,
        badgeBg: 'bg-[#c83a4b]/15 border-[#c83a4b]/30 text-[#c83a4b]',
        badgeText: 'Critical (<75%)',
        filterStyle: 'contrast-[1.1] brightness-[0.88] saturate-[0.5] sepia-[0.25]',
        statusRing: '#c83a4b',
        bloomPercent: Math.max(10, Math.round(percentage)),
      };
    }
  }, [percentage]);

  const Icon = tier.icon;
  const heightClass = size === 'sm' ? 'h-48' : size === 'lg' ? 'h-72' : 'h-60';

  return (
    <div className="relative washi-card-elevated rounded-2xl p-5 border border-[#2b2523]/10 flex flex-col justify-between overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between z-10 pb-3 border-b border-[#2b2523]/10">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#78716c] font-bold font-mono">
            {label}
          </span>
          <h4 className="text-base font-bold text-[#1c1917] flex items-center gap-2 mt-0.5 font-display">
            {tier.level}
            <span className="text-xs font-normal text-[#c83a4b] font-mono">
              ({percentage.toFixed(1)}%)
            </span>
          </h4>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${tier.badgeBg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{tier.badgeText}</span>
        </div>
      </div>

      {/* Realistic Botanical Specimen Photography Display */}
      <div className={`relative w-full ${heightClass} flex items-center justify-center my-3 overflow-hidden rounded-xl bg-[#f4efe4]/60 border border-[#2b2523]/5 p-2`}>
        {/* Subtle grid lines like a botanical archival catalog */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1c1917 1px, transparent 1px), linear-gradient(to bottom, #1c1917 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Botanical Cherry Blossom Photo Plate */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={BOTANICAL_ASSETS.cherryBranch}
            alt="Botanical Cherry Blossom Specimen"
            className={`max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-700 ${tier.filterStyle}`}
          />

          {/* Archival Inscription Label */}
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-white/80 border border-[#2b2523]/10 backdrop-blur-xs text-[10px] font-mono text-[#57534e]">
            <span>Specimen: </span>
            <span className="font-semibold text-[#1c1917]">Academic Vitality Standing</span>
          </div>

          {/* Living Vitality Metric Overlay */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-white/90 border border-[#2b2523]/10 backdrop-blur-xs flex items-center gap-2 text-[11px] font-mono shadow-xs">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: tier.statusRing }}
            />
            <span className="text-[#1c1917] font-semibold">{percentage.toFixed(1)}% Vitality</span>
          </div>
        </div>
      </div>

      {/* Specimen Description & Progress Meter */}
      {showDetails && (
        <div className="space-y-2.5 z-10 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#78716c] font-mono">
            <span>Minimum Quota Required: 75.0%</span>
            <span className={percentage >= 75 ? 'text-[#626c59] font-bold' : 'text-[#c83a4b] font-bold'}>
              {percentage >= 75 ? `+${(percentage - 75).toFixed(1)}% Safe Buffer` : `${(75 - percentage).toFixed(1)}% Deficit`}
            </span>
          </div>

          <div className="w-full bg-[#e8e2d4] h-2 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                percentage >= 95
                  ? 'bg-[#626c59]'
                  : percentage >= 85
                  ? 'bg-[#b48728]'
                  : percentage >= 75
                  ? 'bg-[#d97706]'
                  : 'bg-[#c83a4b]'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
            />
          </div>

          <p className="text-[11px] text-[#57534e] leading-relaxed">
            {tier.description}
          </p>
        </div>
      )}
    </div>
  );
};
