export type LeadStatus = 'Available' | 'Contacted' | 'Delivered' | 'Appointment Set';

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  'Available',
  'Contacted',
  'Delivered',
  'Appointment Set',
];

/** Insurance / financial product verticals a lead is interested in. */
export type Vertical = 'Retirement' | 'Annuities' | 'Life' | 'Medicare' | 'IUL' | 'Final Expense';

/** Investable-assets bracket for a lead. */
export type AssetRange =
  | 'Under $100k'
  | '$100k–$250k'
  | '$250k–$500k'
  | '$500k–$1M'
  | '$1M+';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  state: string; // 2-letter code
  vertical: Vertical;
  assets: AssetRange;
  phone: string;
  status: LeadStatus;
  notes?: string;
  date: string; // ISO date the lead was received
}

export type LicenseStatus = 'none' | 'pending' | 'verified';

export interface Advisor {
  name: string;
  email: string;
  state: string; // 2-letter code
  credits: number;
  license: {
    status: LicenseStatus;
    state: string; // licensed state, e.g. "CA"
    type: string; // e.g. "Life & Health"
  };
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  perks: string[];
  highlight?: boolean;
}

/** A completed (mock) credit purchase, recorded in live state. */
export interface Transaction {
  id: string;
  packageId: string;
  packageName: string;
  credits: number;
  amount: number;
  date: string; // ISO timestamp
}

export interface PlanInputs {
  netIncomeGoal: number; // desired NET yearly income ($)
  avgSale: number; // average sale amount ($)
  avgCommission: number; // average commission per sale ($)
}

export interface PlanResults {
  projectedIncome: number; // income from hitting dealsNeeded
  dealsNeeded: number;
  appointmentsNeeded: number;
  leadsNeeded: number;
  salesVolume: number; // dealsNeeded * avgSale (context only)
}
