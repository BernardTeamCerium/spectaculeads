import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MOCK_LEADS } from '../data/leads';
import { Lead, LeadStatus, PlanInputs, PlanResults } from '../types';

export type LicenseStatus = 'none' | 'pending' | 'verified';

interface UserProfile {
  name: string;
  email: string;
  company: string;
  licenseState: string;
}

interface AppStateShape {
  // auth
  signedIn: boolean;
  signIn: (email?: string) => void;
  signOut: () => void;

  // profile
  user: UserProfile;

  // credits
  credits: number;
  addCredits: (n: number) => void;
  spendCredit: () => boolean;

  // leads
  leads: Lead[];
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadNotes: (id: string, notes: string) => void;

  // plan
  planInputs: PlanInputs;
  setPlanInputs: (p: Partial<PlanInputs>) => void;
  planResults: PlanResults;
  planComplete: boolean;
  setPlanComplete: (v: boolean) => void;

  // license
  licenseStatus: LicenseStatus;
  submitLicense: () => void;
  verifyLicense: () => void;
}

const DEFAULT_INPUTS: PlanInputs = {
  netIncomeGoal: 120000,
  avgSale: 2500,
  avgCommissionPct: 80,
  closeRatePct: 25,
};

/** Pure calc so screens and tests can reuse it. */
export function computePlan(inputs: PlanInputs): PlanResults {
  const commissionPerDeal = Math.max(
    1,
    (inputs.avgSale * inputs.avgCommissionPct) / 100
  );
  const dealsNeeded = Math.ceil(inputs.netIncomeGoal / commissionPerDeal);
  const closeRate = Math.max(1, inputs.closeRatePct) / 100;
  const leadsNeeded = Math.ceil(dealsNeeded / closeRate);
  const projectedIncome = dealsNeeded * commissionPerDeal;
  return { projectedIncome, dealsNeeded, leadsNeeded, commissionPerDeal };
}

const AppStateContext = createContext<AppStateShape | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [credits, setCredits] = useState(8);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [planInputs, setPlanInputsState] = useState<PlanInputs>(DEFAULT_INPUTS);
  const [planComplete, setPlanComplete] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>('none');
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    company: 'Rivera Financial Group',
    licenseState: 'TX',
  });

  const signIn = useCallback((email?: string) => {
    if (email && email.includes('@')) {
      const handle = email.split('@')[0].replace(/[._]/g, ' ');
      const name = handle
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setUser((u) => ({ ...u, email, name: name || u.name }));
    }
    setSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    setSignedIn(false);
    setPlanComplete(false);
  }, []);

  const addCredits = useCallback((n: number) => setCredits((c) => c + n), []);

  const spendCredit = useCallback(() => {
    let ok = false;
    setCredits((c) => {
      if (c > 0) {
        ok = true;
        return c - 1;
      }
      return c;
    });
    return ok;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const updateLeadNotes = useCallback((id: string, notes: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  }, []);

  const setPlanInputs = useCallback((p: Partial<PlanInputs>) => {
    setPlanInputsState((prev) => ({ ...prev, ...p }));
  }, []);

  const submitLicense = useCallback(() => setLicenseStatus('pending'), []);
  const verifyLicense = useCallback(() => setLicenseStatus('verified'), []);

  const planResults = useMemo(() => computePlan(planInputs), [planInputs]);

  const value = useMemo<AppStateShape>(
    () => ({
      signedIn,
      signIn,
      signOut,
      user,
      credits,
      addCredits,
      spendCredit,
      leads,
      updateLeadStatus,
      updateLeadNotes,
      planInputs,
      setPlanInputs,
      planResults,
      planComplete,
      setPlanComplete,
      licenseStatus,
      submitLicense,
      verifyLicense,
    }),
    [
      signedIn,
      signIn,
      signOut,
      user,
      credits,
      addCredits,
      spendCredit,
      leads,
      updateLeadStatus,
      updateLeadNotes,
      planInputs,
      setPlanInputs,
      planResults,
      planComplete,
      licenseStatus,
      submitLicense,
      verifyLicense,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp(): AppStateShape {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useApp must be used within AppStateProvider');
  return ctx;
}
