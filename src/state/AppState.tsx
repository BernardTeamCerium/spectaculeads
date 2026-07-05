import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEMO_ADVISOR, generateLeads, LEADS_PER_PURCHASE, SAMPLE_LEADS } from '../data/mock';
import { computePlan, DEFAULT_PLAN_INPUTS } from '../lib/incomePlan';
import { CreditPackage, Lead, LeadStatus, License, PlanInputs, PlanResults, Transaction } from '../types';

export type { LicenseStatus } from '../types';
export { computePlan } from '../lib/incomePlan';

interface UserProfile {
  name: string;
  email: string;
  company: string;
  licenseState: string;
}

/** Derive a friendly company name from the advisor's email domain. */
function companyFromEmail(email: string): string {
  const domain = email.split('@')[1] ?? '';
  const base = domain.split('.')[0] ?? '';
  if (!base) return 'Independent Advisor';
  return base
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface AppStateShape {
  // auth
  signedIn: boolean;
  signIn: (email?: string) => void;
  signOut: () => void;

  // profile
  user: UserProfile;
  updateUser: (partial: Partial<UserProfile>) => void;

  // credits
  credits: number;
  transactions: Transaction[];
  addCredits: (n: number) => void;
  spendCredit: () => boolean;
  purchasePackage: (pkg: CreditPackage) => void;

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

  // licenses
  licenses: License[];
  submitLicense: (input: { state: string; type: string; fileName: string }) => void;
  verifyLicense: (id: string) => void;

  // demo
  resetDemo: () => void;
}

const seedLicenses = (): License[] => [
  {
    id: 'lic_seed',
    state: DEMO_ADVISOR.license.state,
    type: DEMO_ADVISOR.license.type,
    status: DEMO_ADVISOR.license.status === 'verified' ? 'verified' : 'pending',
  },
];


const AppStateContext = createContext<AppStateShape | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [credits, setCredits] = useState(DEMO_ADVISOR.credits);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leads, setLeads] = useState<Lead[]>(SAMPLE_LEADS);
  const [planInputs, setPlanInputsState] = useState<PlanInputs>(DEFAULT_PLAN_INPUTS);
  const [planComplete, setPlanComplete] = useState(false);
  const [licenses, setLicenses] = useState<License[]>(seedLicenses);
  const [user, setUser] = useState<UserProfile>({
    name: DEMO_ADVISOR.name,
    email: DEMO_ADVISOR.email,
    company: companyFromEmail(DEMO_ADVISOR.email),
    licenseState: DEMO_ADVISOR.license.state,
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

  const updateUser = useCallback(
    (partial: Partial<UserProfile>) => setUser((u) => ({ ...u, ...partial })),
    []
  );

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

  /**
   * Complete a (mock) purchase: credit the account, log the transaction, and
   * drop a couple of fresh "Available" leads into the inbox.
   */
  const purchasePackage = useCallback((pkg: CreditPackage) => {
    setCredits((c) => c + pkg.credits);
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        packageId: pkg.id,
        packageName: pkg.name,
        credits: pkg.credits,
        amount: pkg.price,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
    setLeads((prev) => [...generateLeads(LEADS_PER_PURCHASE), ...prev]);
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

  const submitLicense = useCallback(
    (input: { state: string; type: string; fileName: string }) => {
      setLicenses((prev) => [
        {
          id: `lic_${Date.now()}`,
          state: input.state,
          type: input.type,
          status: 'pending',
          fileName: input.fileName,
          submittedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const verifyLicense = useCallback((id: string) => {
    setLicenses((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'verified' } : l))
    );
  }, []);

  /** Restore the whole demo to its starting state (for repeatable walkthroughs). */
  const resetDemo = useCallback(() => {
    setCredits(DEMO_ADVISOR.credits);
    setTransactions([]);
    setLeads(SAMPLE_LEADS);
    setPlanInputsState(DEFAULT_PLAN_INPUTS);
    setPlanComplete(false);
    setLicenses(seedLicenses());
  }, []);

  const planResults = useMemo(() => computePlan(planInputs), [planInputs]);

  const value = useMemo<AppStateShape>(
    () => ({
      signedIn,
      signIn,
      signOut,
      user,
      updateUser,
      credits,
      transactions,
      addCredits,
      spendCredit,
      purchasePackage,
      leads,
      updateLeadStatus,
      updateLeadNotes,
      planInputs,
      setPlanInputs,
      planResults,
      planComplete,
      setPlanComplete,
      licenses,
      submitLicense,
      verifyLicense,
      resetDemo,
    }),
    [
      signedIn,
      signIn,
      signOut,
      user,
      updateUser,
      credits,
      transactions,
      addCredits,
      spendCredit,
      purchasePackage,
      leads,
      updateLeadStatus,
      updateLeadNotes,
      planInputs,
      setPlanInputs,
      planResults,
      planComplete,
      licenses,
      submitLicense,
      verifyLicense,
      resetDemo,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp(): AppStateShape {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useApp must be used within AppStateProvider');
  return ctx;
}
