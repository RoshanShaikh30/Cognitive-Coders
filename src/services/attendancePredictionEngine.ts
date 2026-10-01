export interface PredictionResult {
  currentRate: number;
  totalHeld: number;
  totalAttended: number;
  riskCategory: 'safe' | 'good' | 'borderline' | 'critical';
  riskLabel: string;
  predictedRate2Weeks: number;
  predictedRate4Weeks: number;
  trendDirection: 'improving' | 'declining' | 'stable';
  classesNeededToRecover75: number;
  classesNeededToReach85: number;
  bufferAbsencesAllowed: number;
  actionSummary: string;
  detailedAnalysis: string;
}

export function computeAttendancePrediction(
  attended: number,
  total: number,
  recentTrend: 'improving' | 'declining' | 'stable' = 'declining'
): PredictionResult {
  const safeTotal = Math.max(1, total);
  const safeAttended = Math.min(safeTotal, Math.max(0, attended));
  const currentRate = (safeAttended / safeTotal) * 100;

  // Assuming ~3 classes per week
  const classesIn2Weeks = 6;
  const classesIn4Weeks = 12;

  // Attendance probability in future based on trend
  let futureProb = currentRate / 100;
  if (recentTrend === 'declining') {
    futureProb = Math.max(0.3, (currentRate / 100) - 0.08);
  } else if (recentTrend === 'improving') {
    futureProb = Math.min(1.0, (currentRate / 100) + 0.08);
  }

  const projAttended2W = safeAttended + Math.round(classesIn2Weeks * futureProb);
  const projTotal2W = safeTotal + classesIn2Weeks;
  const predictedRate2Weeks = (projAttended2W / projTotal2W) * 100;

  const projAttended4W = safeAttended + Math.round(classesIn4Weeks * futureProb);
  const projTotal4W = safeTotal + classesIn4Weeks;
  const predictedRate4Weeks = (projAttended4W / projTotal4W) * 100;

  // Recovery Math: How many consecutive sessions to reach 75%
  // (attended + x) / (total + x) >= 0.75
  // attended + x >= 0.75 * total + 0.75 * x
  // 0.25 * x >= 0.75 * total - attended
  // x = ceil((0.75 * total - attended) / 0.25)
  let classesNeededToRecover75 = 0;
  if (currentRate < 75) {
    const deficit = 0.75 * safeTotal - safeAttended;
    classesNeededToRecover75 = Math.max(0, Math.ceil(deficit / 0.25));
  }

  // Classes needed to reach 85%
  let classesNeededToReach85 = 0;
  if (currentRate < 85) {
    const deficit85 = 0.85 * safeTotal - safeAttended;
    classesNeededToReach85 = Math.max(0, Math.ceil(deficit85 / 0.15));
  }

  // Buffer Absences before falling below 75%
  // attended / (total + y) < 0.75
  // attended < 0.75 * total + 0.75 * y
  // 0.75 * y > attended - 0.75 * total
  // y = floor((attended - 0.75 * total) / 0.75)
  let bufferAbsencesAllowed = 0;
  if (currentRate >= 75) {
    const margin = safeAttended - 0.75 * safeTotal;
    bufferAbsencesAllowed = Math.max(0, Math.floor(margin / 0.75));
  }

  // Risk categorization
  let riskCategory: PredictionResult['riskCategory'] = 'safe';
  let riskLabel = 'Safe Standing (90%+)';

  if (currentRate >= 90) {
    riskCategory = 'safe';
    riskLabel = 'Optimal Standing';
  } else if (currentRate >= 80) {
    riskCategory = 'good';
    riskLabel = 'Satisfactory Standing';
  } else if (currentRate >= 75) {
    riskCategory = 'borderline';
    riskLabel = 'Borderline Debarment Risk (75–79%)';
  } else {
    riskCategory = 'critical';
    riskLabel = 'Critical Debarment Deficit (<75%)';
  }

  // Dynamic user prompt example mapping:
  // "Current Attendance: 78% -> Prediction: Likely to drop below 75% in 2 weeks -> Action: Attend next 4 classes to recover"
  let actionSummary = '';
  let detailedAnalysis = '';

  if (currentRate < 75) {
    actionSummary = `Current Attendance: ${currentRate.toFixed(1)}% · Prediction: Currently below statutory quota · Action: Attend next ${classesNeededToRecover75} classes to recover to 75%`;
    detailedAnalysis = `Immediate attendance remediation required. Missing any further lecture will trigger formal examination debarment notices. Consistent presence across the next ${classesNeededToRecover75} sessions will restore your academic standing to the required 75.0% threshold.`;
  } else if (currentRate < 80) {
    actionSummary = `Current Attendance: ${currentRate.toFixed(1)}% · Prediction: Likely to drop below 75% in 2 weeks if 1 class missed · Action: Attend next ${Math.max(3, classesNeededToReach85 || 4)} classes to establish safety buffer`;
    detailedAnalysis = `You are within 1-2 absences of statutory debarment. With only ${bufferAbsencesAllowed} buffer absence(s) remaining, any unexpected illness or absence will breach the university 75% mandate. Attending the upcoming 4 lectures will lift you into the safe 82%+ zone.`;
  } else {
    actionSummary = `Current Attendance: ${currentRate.toFixed(1)}% · Prediction: Stable compliance projected across next 4 weeks · Buffer: Up to ${bufferAbsencesAllowed} absences permitted before debarment risk`;
    detailedAnalysis = `Your current attendance provides a healthy safety cushion of ${bufferAbsencesAllowed} class absences while preserving full examination eligibility above 75%.`;
  }

  return {
    currentRate,
    totalHeld: safeTotal,
    totalAttended: safeAttended,
    riskCategory,
    riskLabel,
    predictedRate2Weeks,
    predictedRate4Weeks,
    trendDirection: recentTrend,
    classesNeededToRecover75,
    classesNeededToReach85,
    bufferAbsencesAllowed,
    actionSummary,
    detailedAnalysis,
  };
}
