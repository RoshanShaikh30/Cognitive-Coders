import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, TrendingUp, TrendingDown, Target, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../../services/soundService';

interface AttendanceSimulatorProps {
  initialAttended?: number;
  initialTotal?: number;
  subjectName?: string;
}

export const AttendanceSimulator: React.FC<AttendanceSimulatorProps> = ({
  initialAttended = 0,
  initialTotal = 0,
  subjectName = 'Academic Course Cohort',
}) => {
  const [attended] = useState<number>(initialAttended);
  const [total] = useState<number>(initialTotal);
  const [attendNext, setAttendNext] = useState<number>(6);
  const [missNext, setMissNext] = useState<number>(0);

  // Current Percentage
  const currentPercentage = useMemo(() => {
    return total > 0 ? (attended / total) * 100 : 100;
  }, [attended, total]);

  // Projected Percentage
  const projected = useMemo(() => {
    const newAttended = attended + attendNext;
    const newTotal = total + attendNext + missNext;
    const rate = newTotal > 0 ? (newAttended / newTotal) * 100 : 100;
    const delta = rate - currentPercentage;
    return {
      rate,
      delta,
      newAttended,
      newTotal,
      isAboveTarget: rate >= 75,
    };
  }, [attended, total, attendNext, missNext, currentPercentage]);

  // Calculate minimum lectures needed consecutively to hit 75%
  const lecturesNeededFor75 = useMemo(() => {
    if (total === 0 || currentPercentage >= 75) return 0;
    const req = Math.ceil((0.75 * total - attended) / 0.25);
    return Math.max(0, req);
  }, [attended, total, currentPercentage]);

  return (
    <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 relative shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2b2523]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#c83a4b]/10 border border-[#c83a4b]/20 flex items-center justify-center text-[#c83a4b]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1c1917] font-display">
              Attendance Projection Simulator
            </h3>
            <span className="text-xs text-[#78716c]">
              Target calculation for {subjectName}
            </span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#f7f5ef] border border-[#2b2523]/10 text-xs font-mono font-semibold text-[#1c1917]">
          Current: {total > 0 ? `${currentPercentage.toFixed(1)}% (${attended}/${total})` : '100% (New)'}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Attend Future Lectures Slider */}
        <div className="p-4 rounded-xl bg-[#f7f5ef] border border-[#2b2523]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#1c1917] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#626c59]" />
              Attend Future Lectures
            </span>
            <span className="text-sm font-bold font-mono text-[#626c59]">
              +{attendNext} sessions
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={attendNext}
            onChange={(e) => {
              setAttendNext(Number(e.target.value));
              sound.playHover();
            }}
            className="w-full accent-[#626c59] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#78716c] mt-1 font-mono">
            <span>0</span>
            <span>12</span>
            <span>25</span>
          </div>
        </div>

        {/* Miss Future Lectures Slider */}
        <div className="p-4 rounded-xl bg-[#f7f5ef] border border-[#2b2523]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#1c1917] flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-[#c83a4b]" />
              Miss Future Lectures
            </span>
            <span className="text-sm font-bold font-mono text-[#c83a4b]">
              -{missNext} sessions
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={missNext}
            onChange={(e) => {
              setMissNext(Number(e.target.value));
              sound.playHover();
            }}
            className="w-full accent-[#c83a4b] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#78716c] mt-1 font-mono">
            <span>0</span>
            <span>7</span>
            <span>15</span>
          </div>
        </div>
      </div>

      {/* Projection Outcome Display Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4 transition-all duration-300 ${
          projected.rate >= 75
            ? 'bg-[#626c59]/10 border-[#626c59]/30'
            : 'bg-[#c83a4b]/10 border-[#c83a4b]/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-mono ${
              projected.rate >= 75 ? 'bg-[#626c59]/20 text-[#626c59]' : 'bg-[#c83a4b]/20 text-[#c83a4b]'
            }`}
          >
            {projected.rate.toFixed(1)}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1c1917]">
                {projected.rate >= 75 ? 'Safe Standing Achieved' : 'Debarment Risk Active'}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  projected.delta >= 0 ? 'text-[#626c59] bg-[#626c59]/15' : 'text-[#c83a4b] bg-[#c83a4b]/15'
                }`}
              >
                {projected.delta >= 0 ? `+${projected.delta.toFixed(1)}%` : `${projected.delta.toFixed(1)}%`}
              </span>
            </div>
            <p className="text-xs text-[#57534e] mt-0.5">
              Projected: {projected.newAttended} attended out of {projected.newTotal} total lectures.
            </p>
          </div>
        </div>

        {/* Quick Prescription Action */}
        <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2b2523]/10">
          <span className="text-[11px] uppercase tracking-wider text-[#78716c] font-bold">Prescription</span>
          <div className="text-xs text-[#1c1917] font-semibold mt-0.5">
            {lecturesNeededFor75 > 0 ? (
              <span className="text-[#c83a4b] flex items-center gap-1 sm:justify-end">
                <Target className="w-3.5 h-3.5" /> Attend next {lecturesNeededFor75} lectures continuously
              </span>
            ) : (
              <span className="text-[#626c59] flex items-center gap-1 sm:justify-end">
                <Sparkles className="w-3.5 h-3.5" /> Compliant with mandatory degree quotas
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
