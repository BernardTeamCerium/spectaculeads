import assert from 'node:assert/strict';
import test from 'node:test';
import type { CreditPackage } from '../types';
import {
  CLOSE_RATE,
  computePlan,
  DEFAULT_PLAN_INPUTS,
  leadsPerMonth,
  packsPerMonth,
  recommendPackage,
  SHOW_RATE,
} from './incomePlan.ts';

const PACKAGES: CreditPackage[] = [
  { id: 'starter', name: 'Starter', price: 49.99, credits: 5, perks: [] },
  { id: 'plus', name: 'Plus', price: 99.99, credits: 10, perks: [] },
  { id: 'pro', name: 'Pro', price: 199.99, credits: 20, perks: [] },
];

test('rates are both 33% (one in three)', () => {
  assert.equal(SHOW_RATE, 1 / 3);
  assert.equal(CLOSE_RATE, 1 / 3);
});

test('worked example: $250k goal / $25k sale / 20% commission defaults', () => {
  const r = computePlan(DEFAULT_PLAN_INPUTS);
  assert.equal(r.dealsNeeded, 50);
  assert.equal(r.appointmentsNeeded, 150);
  assert.equal(r.leadsNeeded, 450);
  assert.equal(r.projectedIncome, 250_000);
  assert.equal(r.salesVolume, 1_250_000);
});

test('deals = income ÷ commission, rounded up', () => {
  // commission = 60k × 50% = 30k ; 100k / 30k = 3.33 -> 4 deals
  const r = computePlan({ netIncomeGoal: 100_000, avgSale: 60_000, commissionPct: 50 });
  assert.equal(r.dealsNeeded, 4);
  // appointments = ceil(4 / (1/3)) = 12 ; leads = ceil(12 / (1/3)) = 36
  assert.equal(r.appointmentsNeeded, 12);
  assert.equal(r.leadsNeeded, 36);
});

test('projected income always meets or exceeds the goal', () => {
  for (const goal of [50_000, 137_500, 250_000, 1_000_000]) {
    const r = computePlan({ netIncomeGoal: goal, avgSale: 25_000, commissionPct: 20 });
    assert.ok(r.projectedIncome >= goal, `projected ${r.projectedIncome} >= goal ${goal}`);
  }
});

test('more deals never means fewer leads/appointments (monotonic)', () => {
  let prevLeads = 0;
  let prevAppts = 0;
  for (const goal of [50_000, 100_000, 250_000, 500_000, 1_000_000]) {
    const r = computePlan({ netIncomeGoal: goal, avgSale: 25_000, commissionPct: 20 });
    assert.ok(r.leadsNeeded >= prevLeads);
    assert.ok(r.appointmentsNeeded >= prevAppts);
    prevLeads = r.leadsNeeded;
    prevAppts = r.appointmentsNeeded;
  }
});

test('guards against divide-by-zero commission', () => {
  const r = computePlan({ netIncomeGoal: 250_000, avgSale: 25_000, commissionPct: 0 });
  assert.ok(Number.isFinite(r.dealsNeeded));
  assert.ok(Number.isFinite(r.leadsNeeded));
});

test('intake flows through to the right package end-to-end', () => {
  // Defaults: 450 leads/yr -> 38/mo -> bigger than any pack -> Pro (largest).
  const big = computePlan(DEFAULT_PLAN_INPUTS);
  assert.equal(big.leadsNeeded, 450);
  const bigRec = recommendPackage(big.leadsNeeded, PACKAGES);
  assert.equal(bigRec.id, 'pro');
  assert.equal(packsPerMonth(big.leadsNeeded, bigRec), 2); // ceil(38 / 20)

  // $60k goal, 20% of $25k = $5k comm -> 12 deals -> 108 leads -> 9/mo -> Plus.
  const mid = computePlan({ netIncomeGoal: 60_000, avgSale: 25_000, commissionPct: 20 });
  assert.equal(mid.leadsNeeded, 108);
  const midRec = recommendPackage(mid.leadsNeeded, PACKAGES);
  assert.equal(midRec.id, 'plus');
  assert.equal(packsPerMonth(mid.leadsNeeded, midRec), 1); // 10 credits covers 9/mo

  // $30k goal -> 6 deals -> 54 leads -> 5/mo -> Starter (5) exactly covers it.
  const small = computePlan({ netIncomeGoal: 30_000, avgSale: 25_000, commissionPct: 20 });
  assert.equal(small.leadsNeeded, 54);
  assert.equal(recommendPackage(small.leadsNeeded, PACKAGES).id, 'starter');
});

test('packsPerMonth is at least 1 and covers the monthly need', () => {
  assert.equal(packsPerMonth(450, PACKAGES[2]), 2); // 38/mo, 20-credit pack
  assert.equal(packsPerMonth(0, PACKAGES[0]), 1); // never zero
  // packs × credits always covers the monthly target
  for (const leads of [12, 54, 108, 450, 5000]) {
    const rec = recommendPackage(leads, PACKAGES);
    assert.ok(packsPerMonth(leads, rec) * rec.credits >= leadsPerMonth(leads));
  }
});

test('leadsPerMonth rounds up', () => {
  assert.equal(leadsPerMonth(450), 38); // 450/12 = 37.5 -> 38
  assert.equal(leadsPerMonth(12), 1);
  assert.equal(leadsPerMonth(13), 2);
});

test('recommendPackage picks the smallest package that covers monthly need', () => {
  // defaults -> 450 leads -> 38/mo -> exceeds all -> Pro (largest)
  assert.equal(recommendPackage(450, PACKAGES).id, 'pro');
  // 48 leads/yr -> 4/mo -> Starter (5)
  assert.equal(recommendPackage(48, PACKAGES).id, 'starter');
  // 108 leads/yr -> 9/mo -> Plus (10)
  assert.equal(recommendPackage(108, PACKAGES).id, 'plus');
});
