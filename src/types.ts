export type LeadStatus = 'Available' | 'Contacted' | 'Delivered' | 'Appointment Set';

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  'Available',
  'Contacted',
  'Delivered',
  'Appointment Set',
];

export interface Lead {
  id: string;
  name: string;
  age: number;
  city: string;
  state: string;
  product: string; // what they're interested in
  estimatedValue: number; // potential commission value
  source: string;
  receivedAt: string; // ISO date
  status: LeadStatus;
  notes: string;
  phone: string;
  email: string;
  summary: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  perks: string[];
  highlight?: boolean;
}

export interface PlanInputs {
  netIncomeGoal: number; // desired yearly net income
  avgSale: number; // avg sale value
  avgCommissionPct: number; // commission %
  closeRatePct: number; // leads -> deal conversion
}

export interface PlanResults {
  projectedIncome: number;
  dealsNeeded: number;
  leadsNeeded: number;
  commissionPerDeal: number;
}
