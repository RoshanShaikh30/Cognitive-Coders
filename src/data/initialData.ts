import { HeatmapCell } from '../types';

// Generate 90 days of calendar dates for the Attendance Heatmap visualizer
export function generateInitialHeatmapData(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const now = new Date();

  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let rate = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (!isWeekend) {
      const base = dayOfWeek === 5 ? 78 : 88;
      const noise = Math.sin(i * 0.4) * 8 + ((i % 7) * 1.5);
      rate = Math.min(100, Math.max(62, Math.round(base + noise)));

      if (rate >= 95) level = 4; // Gold
      else if (rate >= 85) level = 3; // Crimson
      else if (rate >= 75) level = 2; // Amber
      else level = 1; // Charcoal
    }

    cells.push({
      date: d.toISOString().split('T')[0],
      dayOfWeek,
      attendanceRate: rate,
      totalLectures: isWeekend ? 0 : 4,
      level,
    });
  }

  return cells;
}
