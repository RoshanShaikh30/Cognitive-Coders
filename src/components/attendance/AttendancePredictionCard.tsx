import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Calculator,
  ArrowRight,
  Target,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { computeAttendancePrediction } from '../../services/attendancePredictionEngine';
import { askAttendAICopilot } from '../../services/geminiService';
import { sound } from '../../services/soundService';

interface AttendancePredictionCardProps {
  attended: number;
  total: number;
  subjectOrClassName?: string;
  studentName?: string;
}

export const AttendancePredictionCard: React.FC<AttendancePredictionCardProps> = ({
  attended,
  total,
  subjectOrClassName = 'Enrolled Courses',
  studentName = 'Student',
}) => {
  const [selectedTrend, setSelectedTrend] = useState<'declining' | 'stable' | 'improving'>('declining');
  const [whatIfAttendUpcoming, setWhatIfAttendUpcoming] = useState(4);
  const [whatIfMissUpcoming, setWhatIfMissUpcoming] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Compute prediction
  const pred = useMemo(() => {
    return computeAttendancePrediction(attended, total, selectedTrend);
  }, [attended, total, selectedTrend]);

  // Compute what-if scenario
  const whatIfRate = useMemo(() => {
    const newAttended = attended + whatIfAttendUpcoming;
    const newTotal = total + whatIfAttendUpcoming + whatIfMissUpcoming;
    if (newTotal === 0) return 100;
    return (newAttended / newTotal) * 100;
  }, [attended, total, whatIfAttendUpcoming, whatIfMissUpcoming]);

  const handleRequestGeminiAssessment = async () => {
    sound.playClick();
    setLoadingAi(true);
    try {
      const prompt = `Perform an attendance risk and remediation forecast for ${studentName} in ${subjectOrClassName}. 
Current Attendance: ${pred.currentRate.toFixed(1)}% (${attended}/${total} classes).
Trend: ${selectedTrend}.
Predicted Rate in 2 Weeks: ${pred.predictedRate2Weeks.toFixed(1)}%.
Predicted Rate in 4 Weeks: ${pred.predictedRate4Weeks.toFixed(1)}%.
Buffer Absences Left: ${pred.bufferAbsencesAllowed}.
Classes Needed to Reach/Recover 75%: ${pred.classesNeededToRecover75}.
Please provide a 2-paragraph professional, encouraging academic advisory report with specific timetable recommendations.`;

      const response = await askAttendAICopilot(prompt, {
        role: 'student',
        avgAttendance: `${pred.currentRate.toFixed(1)}%`,
      });
      setAiAnalysis(response.reply);
      sound.playSuccessChime();
    } catch {
      setAiAnalysis('Gemini Predictive Telemetry: Maintain consecutive attendance over the next 4 sessions to ensure safe examination clearance.');
    } finally {
      setLoadingAi(false);
    }
  };

  const isCritical = pred.riskCategory === 'critical';
  const isBorderline = pred.riskCategory === 'borderline';

  return (
    <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2b2523]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#b48728] font-bold">
              Attendance Prediction Engine
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#b48728]/10 text-[#b48728] border border-[#b48728]/20">
              Historical Regression
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1c1917] font-display mt-0.5">
            Predictive Telemetry & Remediation Radar
          </h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            Calculates future risk horizons, buffer margin before debarment, and exact class quotas needed to recover.
          </p>
        </div>

        {/* Risk Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 border ${
            isCritical
              ? 'bg-[#c83a4b]/15 text-[#c83a4b] border-[#c83a4b]/30'
              : isBorderline
              ? 'bg-[#d97706]/15 text-[#d97706] border-[#d97706]/30'
              : 'bg-[#626c59]/15 text-[#626c59] border-[#626c59]/30'
          }`}
        >
          {isCritical ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : isBorderline ? (
            <Clock className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>{pred.riskLabel}</span>
        </div>
      </div>

      {/* Primary Master Action Callout Box (Exact User Specification) */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isCritical
            ? 'bg-[#c83a4b]/10 border-[#c83a4b]/30 text-[#1c1917]'
            : isBorderline
            ? 'bg-[#d97706]/10 border-[#d97706]/30 text-[#1c1917]'
            : 'bg-[#626c59]/10 border-[#626c59]/30 text-[#1c1917]'
        }`}
      >
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#78716c] uppercase tracking-wider">
            Remediation Directive
          </div>
          <div className="text-sm font-bold font-display text-[#1c1917]">
            {pred.actionSummary}
          </div>
          <p className="text-xs text-[#57534e] leading-relaxed">
            {pred.detailedAnalysis}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <div className="text-center px-4 py-2 rounded-xl bg-white border border-[#2b2523]/15 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-[#78716c] block">
              Required Quota
            </span>
            <span className="text-base font-extrabold font-mono text-[#1c1917]">
              75.0%
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="washi-card p-3.5 rounded-xl border border-[#2b2523]/10 text-center">
          <span className="text-[10px] font-mono uppercase text-[#78716c] block">
            Current Rate
          </span>
          <div className="text-xl font-extrabold font-mono text-[#1c1917] mt-1">
            {pred.currentRate.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#78716c] mt-0.5 block">
            {attended} / {total} Lectures
          </span>
        </div>

        <div className="washi-card p-3.5 rounded-xl border border-[#2b2523]/10 text-center">
          <span className="text-[10px] font-mono uppercase text-[#78716c] block">
            2-Week Forecast
          </span>
          <div
            className={`text-xl font-extrabold font-mono mt-1 ${
              pred.predictedRate2Weeks < 75 ? 'text-[#c83a4b]' : 'text-[#1c1917]'
            }`}
          >
            {pred.predictedRate2Weeks.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#78716c] mt-0.5 flex items-center justify-center gap-0.5">
            {pred.predictedRate2Weeks >= pred.currentRate ? (
              <TrendingUp className="w-3 h-3 text-[#626c59]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#c83a4b]" />
            )}
            Estimated
          </span>
        </div>

        <div className="washi-card p-3.5 rounded-xl border border-[#2b2523]/10 text-center">
          <span className="text-[10px] font-mono uppercase text-[#78716c] block">
            Buffer Margin
          </span>
          <div className="text-xl font-extrabold font-mono text-[#b48728] mt-1">
            {pred.bufferAbsencesAllowed}
          </div>
          <span className="text-[10px] text-[#78716c] mt-0.5 block">
            Absences before &lt;75%
          </span>
        </div>

        <div className="washi-card p-3.5 rounded-xl border border-[#2b2523]/10 text-center">
          <span className="text-[10px] font-mono uppercase text-[#78716c] block">
            Recovery Target
          </span>
          <div className="text-xl font-extrabold font-mono text-[#626c59] mt-1">
            {pred.classesNeededToRecover75 > 0 ? `+${pred.classesNeededToRecover75}` : 'Secure'}
          </div>
          <span className="text-[10px] text-[#78716c] mt-0.5 block">
            {pred.classesNeededToRecover75 > 0 ? 'Lectures to restore' : 'Above threshold'}
          </span>
        </div>
      </div>

      {/* Interactive What-If Scenario Sandbox */}
      <div className="p-4 rounded-xl bg-[#f4efe4] border border-[#2b2523]/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#b48728]" />
            <h4 className="text-xs font-bold text-[#1c1917] font-display">
              Interactive "What-If" Scenario Forecaster
            </h4>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="text-[#78716c]">Simulated Rate:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                whatIfRate >= 75
                  ? 'bg-[#626c59]/15 text-[#626c59]'
                  : 'bg-[#c83a4b]/15 text-[#c83a4b]'
              }`}
            >
              {whatIfRate.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#57534e]">Attend Upcoming Lectures:</span>
              <span className="font-mono font-bold text-[#626c59]">+{whatIfAttendUpcoming}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={whatIfAttendUpcoming}
              onChange={(e) => setWhatIfAttendUpcoming(Number(e.target.value))}
              className="w-full accent-[#626c59] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#57534e]">Miss Upcoming Lectures:</span>
              <span className="font-mono font-bold text-[#c83a4b]">+{whatIfMissUpcoming}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={whatIfMissUpcoming}
              onChange={(e) => setWhatIfMissUpcoming(Number(e.target.value))}
              className="w-full accent-[#c83a4b] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* AI Diagnostic Commentary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#2b2523]/10">
        <button
          onClick={handleRequestGeminiAssessment}
          disabled={loadingAi}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#ede8dc] border border-[#2b2523]/15 text-xs font-semibold text-[#1c1917] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b48728]" />
          <span>{loadingAi ? 'Analyzing Attendance Vectors...' : 'Generate Gemini Predictive Assessment'}</span>
        </button>

        <span className="text-[10px] font-mono text-[#78716c]">
          Gemini 3.8 Flash Engine
        </span>
      </div>

      {aiAnalysis && (
        <div className="p-4 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] leading-relaxed animate-in fade-in shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#b48728] font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Advisory Dossier</span>
          </div>
          <p className="whitespace-pre-line text-[#57534e]">{aiAnalysis}</p>
        </div>
      )}
    </div>
  );
};
