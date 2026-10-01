import React, { useState } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Award, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { AIInsight } from '../../types';
import { fetchAIInsights } from '../../services/geminiService';
import { sound } from '../../services/soundService';

interface AIInsightsDrawerProps {
  insights?: AIInsight[];
  onRefresh?: () => void;
  onApplyRecommendation?: (insight: AIInsight) => void;
}

export const AIInsightsDrawer: React.FC<AIInsightsDrawerProps> = ({
  insights: initialInsights = [],
  onApplyRecommendation,
}) => {
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    sound.playHover();
    try {
      const fresh = await fetchAIInsights({
        avg: 88.5,
        totalStudents: 35,
        lowAttendanceCount: 1,
      });
      setInsights(fresh);
      sound.playSuccessChime();
    } catch {
      // Handled in service
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCardStyle = (type: AIInsight['type']) => {
    switch (type) {
      case 'risk':
        return {
          border: 'border-[#c83a4b]/30',
          bg: 'bg-white',
          icon: AlertTriangle,
          iconColor: 'text-[#c83a4b]',
          badge: 'bg-[#c83a4b]/10 text-[#c83a4b] border-[#c83a4b]/20',
        };
      case 'trend':
        return {
          border: 'border-[#b48728]/30',
          bg: 'bg-white',
          icon: TrendingUp,
          iconColor: 'text-[#b48728]',
          badge: 'bg-[#b48728]/10 text-[#b48728] border-[#b48728]/20',
        };
      case 'achievement':
        return {
          border: 'border-[#626c59]/30',
          bg: 'bg-white',
          icon: Award,
          iconColor: 'text-[#626c59]',
          badge: 'bg-[#626c59]/10 text-[#626c59] border-[#626c59]/20',
        };
      case 'pattern':
      default:
        return {
          border: 'border-[#2b2523]/15',
          bg: 'bg-white',
          icon: Clock,
          iconColor: 'text-[#57534e]',
          badge: 'bg-[#ede8dc] text-[#57534e] border-[#2b2523]/10',
        };
    }
  };

  return (
    <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 relative shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2b2523]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c83a4b]/10 border border-[#c83a4b]/20 flex items-center justify-center text-[#c83a4b]">
            <Sparkles className="w-4 h-4 text-[#b48728]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1c1917] font-display">
              Proactive AI Insights
            </h3>
            <span className="text-xs text-[#78716c]">
              Real-time anomaly detection & predictive behavioral heuristics
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-semibold border border-[#2b2523]/15 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#c83a4b]' : ''}`} />
          <span>Synthesize Telemetry</span>
        </button>
      </div>

      {/* Insight Cards Grid */}
      {insights.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#78716c]">
          Click "Synthesize Telemetry" above to analyze cohort attendance patterns with Google Gemini 3.8.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((item) => {
            const style = getCardStyle(item.type);
            const Icon = style.icon;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${style.border} ${style.bg} flex flex-col justify-between shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border font-bold ${style.badge}`}
                    >
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#78716c]">
                      <Icon className={`w-3.5 h-3.5 ${style.iconColor}`} />
                      <span>{Math.round(item.confidence * 100)}%</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#1c1917] mb-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed mb-3">
                    {item.summary}
                  </p>

                  <div className="text-[11px] text-[#78716c] border-t border-[#2b2523]/5 pt-2 mb-3">
                    <strong className="text-[#1c1917]">Impact:</strong> {item.impact}
                  </div>
                </div>

                {item.recommendation && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      if (onApplyRecommendation) onApplyRecommendation(item);
                    }}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#f7f5ef] hover:bg-[#ede8dc] border border-[#2b2523]/10 text-[11px] text-[#1c1917] font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="truncate pr-1">Action: {item.recommendation}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#c83a4b]" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
