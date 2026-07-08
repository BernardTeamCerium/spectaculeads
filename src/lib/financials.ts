/**
 * Financial goal tracking math for the Tracking tab.
 *
 * Given an annual income goal and the commissions booked so far this year, we
 * work out whether the advisor is trending ahead of or behind the pace needed
 * to hit the goal — and project where they'll land at year end.
 */

export interface GoalTrend {
  /** What should have been earned by now to be exactly on pace. */
  expectedByNow: number;
  /** Where the current run-rate lands at year end (booked ÷ months × 12). */
  projectedAnnual: number;
  /** Booked ÷ expected. 1.0 = exactly on pace, > 1 = ahead. */
  pacePct: number;
  /** projectedAnnual − annualGoal (positive = projected to beat the goal). */
  delta: number;
  /** True when booked-to-date meets or beats the expected pace. */
  onTrack: boolean;
}

export function computeGoalTrend(
  annualGoal: number,
  ytdClosed: number,
  monthsElapsed: number
): GoalTrend {
  const goal = Math.max(0, annualGoal);
  const months = Math.max(0, Math.min(12, monthsElapsed));
  const expectedByNow = (goal * months) / 12;
  const projectedAnnual = months > 0 ? (ytdClosed / months) * 12 : 0;
  const pacePct = expectedByNow > 0 ? ytdClosed / expectedByNow : 0;
  return {
    expectedByNow,
    projectedAnnual,
    pacePct,
    delta: projectedAnnual - goal,
    onTrack: ytdClosed >= expectedByNow,
  };
}

/** Net worth across connected accounts (assets minus liabilities). */
export function netWorth(accounts: { balance: number; connected: boolean }[]): number {
  return accounts.filter((a) => a.connected).reduce((sum, a) => sum + a.balance, 0);
}
