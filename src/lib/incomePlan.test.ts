import assert from 'node:assert/strict';
import test from 'node:test';
import type { CreditPackage } from '../types';
import {
  CLOSE_RATE,
  computePlan,
  DEFAULT_PLAN_INPUTS,
  leadsPerMonth,
  monthlyLeadCost,
  recommendPackage,
  SHOW_RATE,
} from './incomePlan.ts';

const PACKAGES: CreditPackage[] = [
  { id: 'single-state', name: 'Single-State Leads', tagline: '', pricePerLead: 75, credits: 10, perks: [] },
  { id: 'multi-state', name: 'Multi-State Leads', tagline: '', pricePerLead: 60, credits: 10, perks: [], highlight: true },
  { id: 'national', name: 'National Leads', tagline: '', pricePerLead: 50, credits: 10, perks: [] },
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

test('intake flows through to the right tier end-to-end', () => {
  // Defaults: 450 leads/yr -> 38/mo (high) -> National (lowest cost per lead).
  const big = computePlan(DEFAULT_PLAN_INPUTS);
  assert.equal(big.leadsNeeded, 450);
  const bigRec = recommendPackage(big.leadsNeeded, PACKAGES);
  assert.equal(bigRec.id, 'national');
  assert.equal(monthlyLeadCost(big.leadsNeeded, bigRec), 1900); // 38 × $50

  // $100k goal -> 20 deals -> 180 leads -> 15/mo (mid) -> Multi-State (popular).
  const mid = computePlan({ netIncomeGoal: 100_000, avgSale: 25_000, commissionPct: 20 });
  assert.equal(mid.leadsNeeded, 180);
  assert.equal(recommendPackage(mid.leadsNeeded, PACKAGES).id, 'multi-state');

  // $60k goal -> 12 deals -> 108 leads -> 9/mo (low) -> Single-State (targeted).
  const small = computePlan({ netIncomeGoal: 60_000, avgSale: 25_000, commissionPct: 20 });
  assert.equal(small.leadsNeeded, 108);
  assert.equal(recommendPackage(small.leadsNeeded, PACKAGES).id, 'single-state');
});

test('monthlyLeadCost = leads/month × per-lead price', () => {
  const national = PACKAGES.find((p) => p.id === 'national')!;
  assert.equal(monthlyLeadCost(450, national), 1900); // 38 × $50
  assert.equal(monthlyLeadCost(0, national), 0);
});

test('leadsPerMonth rounds up', () => {
  assert.equal(leadsPerMonth(450), 38); // 450/12 = 37.5 -> 38
  assert.equal(leadsPerMonth(12), 1);
  assert.equal(leadsPerMonth(13), 2);
});

test('recommendPackage maps monthly volume to a tier', () => {
  assert.equal(recommendPackage(450, PACKAGES).id, 'national'); // 38/mo (high)
  assert.equal(recommendPackage(180, PACKAGES).id, 'multi-state'); // 15/mo (mid)
  assert.equal(recommendPackage(48, PACKAGES).id, 'single-state'); // 4/mo (low)
  // boundaries: 30/mo -> National ; just under 10/mo -> Single-State
  assert.equal(recommendPackage(360, PACKAGES).id, 'national'); // 30/mo
  assert.equal(recommendPackage(108, PACKAGES).id, 'single-state'); // 9/mo
});
