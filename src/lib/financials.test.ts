import assert from 'node:assert/strict';
import test from 'node:test';
import { computeGoalTrend, netWorth, projectOutlook } from './financials.ts';

test('on-pace: booked meets the expected run-rate', () => {
  // $250k goal, $132k booked over 6 months.
  const t = computeGoalTrend(250_000, 132_000, 6);
  assert.equal(t.expectedByNow, 125_000); // 250k × 6/12
  assert.equal(t.projectedAnnual, 264_000); // 132k / 6 × 12
  assert.equal(t.delta, 14_000); // 264k − 250k
  assert.ok(t.onTrack);
  assert.ok(t.pacePct > 1);
});

test('behind pace: booked trails expectation', () => {
  const t = computeGoalTrend(250_000, 80_000, 6);
  assert.equal(t.expectedByNow, 125_000);
  assert.equal(t.projectedAnnual, 160_000);
  assert.ok(t.delta < 0);
  assert.ok(!t.onTrack);
});

test('zero months elapsed never divides by zero', () => {
  const t = computeGoalTrend(250_000, 0, 0);
  assert.equal(t.projectedAnnual, 0);
  assert.equal(t.pacePct, 0);
  assert.ok(Number.isFinite(t.delta));
});

test('monthsElapsed is clamped to a full year', () => {
  const t = computeGoalTrend(120_000, 120_000, 18);
  assert.equal(t.expectedByNow, 120_000); // clamped to 12 months, not 18
});

test('projectOutlook sums a flat goal with no growth or returns', () => {
  const o = projectOutlook({
    annualGoal: 100_000,
    startNetWorth: 0,
    annualSavings: 0,
    years: 3,
    incomeGrowth: 0,
    returnRate: 0,
  });
  assert.equal(o.incomeTarget, 100_000);
  assert.equal(o.cumulativeIncome, 300_000); // 3 × 100k
  assert.equal(o.projectedNetWorth, 0);
});

test('projectOutlook grows income and compounds net worth', () => {
  const o = projectOutlook({
    annualGoal: 100_000,
    startNetWorth: 100_000,
    annualSavings: 0,
    years: 2,
    incomeGrowth: 0.1,
    returnRate: 0.1,
  });
  assert.equal(o.incomeTarget, 110_000); // year 2 goal = 100k × 1.1
  assert.equal(o.cumulativeIncome, 210_000); // 100k + 110k
  assert.equal(o.projectedNetWorth, 121_000); // 100k × 1.1 × 1.1
});

test('a longer horizon never projects less net worth than a shorter one', () => {
  const base = { annualGoal: 250_000, startNetWorth: 510_000, annualSavings: 76_800 };
  const three = projectOutlook({ ...base, years: 3 });
  const ten = projectOutlook({ ...base, years: 10 });
  assert.ok(ten.projectedNetWorth > three.projectedNetWorth);
  assert.ok(ten.cumulativeIncome > three.cumulativeIncome);
});

test('netWorth only counts connected accounts (assets minus liabilities)', () => {
  const accounts = [
    { balance: 48_250, connected: true },
    { balance: 182_400, connected: true },
    { balance: -318_000, connected: false }, // not linked -> excluded
  ];
  assert.equal(netWorth(accounts), 230_650);
});
