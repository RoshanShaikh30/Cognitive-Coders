import React, { useState } from 'react';
import { HeatmapCell } from '../../types';
import { sound } from '../../services/soundService';

interface AttendanceHeatmapProps {
  data: HeatmapCell[];
  title?: string;
  subtitle?: string;
}

export const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({
  data,
  title = 'Institutional Attendance Matrix',
  subtitle = 'Continuous 90-Day Telemetry',
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const weeks: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];

  data.forEach((cell, idx) => {
    currentWeek.push(cell);
    if (currentWeek.length === 7 || idx === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColorForLevel = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#b48728] shadow-sm'; // 95-100%: Gold
      case 3:
        return 'bg-[#c83a4b] shadow-sm'; // 85-95%: Crimson
      case 2:
        return 'bg-[#d99b38]'; // 75-85%: Amber
      case 1:
        return 'bg-[#352f2d]'; // Below 75%: Sumi Charcoal
      default:
        return 'bg-[#ede8dc]'; // Recess / Weekend
    }
  };

  return (
    <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 relative shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#2b2523]/10">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#78716c] font-bold font-mono">
            {subtitle}
          </span>
          <h3 className="text-lg font-bold text-[#1c1917] mt-0.5 font-display">
            {title}
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-[#78716c]">
          <span className="text-[11px] font-medium">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#352f2d]" />
            <span className="text-[10px] text-[#57534e]">&lt;75%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#d99b38]" />
            <span className="text-[10px] text-[#57534e]">75–85%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#c83a4b]" />
            <span className="text-[10px] text-[#57534e]">85–95%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#b48728]" />
            <span className="text-[10px] text-[#b48728] font-bold">95–100%</span>
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[680px] flex gap-2">
          <div className="flex flex-col justify-between text-[10px] text-[#78716c] pr-1 py-1 font-mono">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="flex gap-1.5">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => {
                      setHoveredCell(day);
                      sound.playHover();
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`w-3.5 h-3.5 rounded-[3px] cursor-pointer transition-all ${getColorForLevel(
                      day.level
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip bar */}
      <div className="mt-4 pt-3 border-t border-[#2b2523]/10 flex items-center justify-between text-xs text-[#57534e]">
        {hoveredCell ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#c83a4b] font-bold">{hoveredCell.date}:</span>
            {hoveredCell.totalLectures > 0 ? (
              <span>
                <strong className="text-[#1c1917]">{hoveredCell.attendanceRate}%</strong> turnout (
                {hoveredCell.totalLectures} sessions)
              </span>
            ) : (
              <span className="text-[#78716c]">Academic Recess</span>
            )}
          </div>
        ) : (
          <span className="text-[#78716c] italic">Hover over matrix coordinates to inspect telemetry.</span>
        )}

        <div className="text-[11px] text-[#78716c] font-mono">
          Target Quota: 75.0%
        </div>
      </div>
    </div>
  );
};
