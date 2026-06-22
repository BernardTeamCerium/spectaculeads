import type { CreditPackage, PlanInputs, PlanResults } from '../types';

/**
 * Income by Design — funnel math (build brief §7.4).
 *
 * ONE consistent formula, working backwards from the advisor's desired NET
 * yearly income through a simple sales funnel:
 *
 *        leads ──(show rate)──▶ appointments ──(close rate)──▶ deals ──▶ income
 *
 *   deals        = ceil( netIncomeGoal ÷ avgCommission )
 *   appointments = ceil( deals        ÷ closeRate )      // close rate = 33%
 *   leads        = ceil( appointments ÷ showRate  )      // show rate  = 33%
 *
 *   projectedIncome = deals × avgCommission   (≥ goal, since deals is rounded up)
 *   salesVolume     = deals × avgSale         (context only; not part of the funnel)
 *
 * Both the show rate and close rate are 33% — i.e. one in three. We model that
 * as exactly 1/3 so the funnel produces clean, consistent numbers.
 *
 * Worked example for the defaults ($250k / $25k / $5k):
 *   deals        = ceil(250,000 ÷ 5,000)   = 50
 *   appointments = ceil(50 ÷ (1/3))        = 150
 *   leads        = ceil(150 ÷ (1/3))       = 450
 *   projectedIncome = 50 × 5,000           = $250,000
 *   salesVolume     = 50 × 25,000          = $1,250,000
 */

/** Fraction of leads that turn into a held appointment. 33% = one in three. */
export const SHOW_RATE = 1 / 3;

/** Fraction of appointments that close into a deal. 33% = one in three. */
export const CLOSE_RATE = 1 / 3;

/** Default slider values for the three steps. */
export const DEFAULT_PLAN_INPUTS: PlanInputs = {
  netIncomeGoal: 250_000,
  avgSale: 25_000,
  avgCommission: 5_000,
};

export function computePlan(inputs: PlanInputs): PlanResults {
  const avgCommission = Math.max(1, inputs.avgCommission);

  const dealsNeeded = Math.ceil(inputs.netIncomeGoal / avgCommission);
  const appointmentsNeeded = Math.ceil(dealsNeeded / CLOSE_RATE);
  const leadsNeeded = Math.ceil(appointmentsNeeded / SHOW_RATE);

  const projectedIncome = dealsNeeded * avgCommission;
  const salesVolume = dealsNeeded * Math.max(0, inputs.avgSale);

  return { projectedIncome, dealsNeeded, appointmentsNeeded, leadsNeeded, salesVolume };
}

/**
 * Recommend a credit package based on the advisor's monthly lead target.
 * Leads are bought in small recurring batches, so we size against the
 * per-month need: pick the smallest package whose credits cover it, else Pro.
 */
export function leadsPerMonth(leadsNeeded: number): number {
  return Math.ceil(leadsNeeded / 12);
}

export function recommendPackage(
  leadsNeeded: number,
  packages: CreditPackage[]
): CreditPackage {
  if (packages.length === 0) {
    throw new Error('recommendPackage requires at least one package');
  }
  const monthly = leadsPerMonth(leadsNeeded);
  const bySize = [...packages].sort((a, b) => a.credits - b.credits);
  const fit = bySize.find((p) => p.credits >= monthly);
  return fit ?? bySize[bySize.length - 1];
}
