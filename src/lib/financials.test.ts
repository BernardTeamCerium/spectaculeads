import assert from 'node:assert/strict';
import test from 'node:test';
import { computeGoalTrend, netWorth } from './financials.ts';

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

test('netWorth only counts connected accounts (assets minus liabilities)', () => {
  const accounts = [
    { balance: 48_250, connected: true },
    { balance: 182_400, connected: true },
    { balance: -318_000, connected: false }, // not linked -> excluded
  ];
  assert.equal(netWorth(accounts), 230_650);
});
