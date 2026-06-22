import { Advisor, CreditPackage, Lead } from '../types';

/**
 * Mock data for the Spectaculeads prototype.
 *
 * Everything here is sample content only. Screens import these as the *initial*
 * values for local React state (see `src/state/AppState.tsx`) and then mutate
 * their own copies — this module is never written to directly.
 */

/** The signed-in demo advisor. */
export const DEMO_ADVISOR: Advisor = {
  name: 'Alex Rivera',
  email: 'alex.rivera@riverafinancial.com',
  state: 'CA',
  credits: 7,
  license: {
    status: 'verified',
    state: 'CA',
    type: 'Life & Health',
  },
};

/** Credit packages available for purchase. */
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49.99,
    credits: 5,
    perks: ['5 verified leads', 'Standard delivery', 'Email support'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 99.99,
    credits: 10,
    perks: ['10 verified leads', 'Priority delivery', 'Chat support', 'Best value'],
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199.99,
    credits: 20,
    perks: ['20 verified leads', 'Instant delivery', 'Dedicated support', 'Lead replacement'],
  },
];

/** ~12 sample leads with a mix of verticals, asset bands, and statuses. */
export const SAMPLE_LEADS: Lead[] = [
  {
    id: 'l1',
    firstName: 'Marcus',
    lastName: 'Bell',
    state: 'TX',
    vertical: 'Life',
    assets: '$250k–$500k',
    phone: '(512) 555-0142',
    status: 'Available',
    date: '2026-06-21T14:32:00Z',
  },
  {
    id: 'l2',
    firstName: 'Priya',
    lastName: 'Nair',
    state: 'CA',
    vertical: 'Retirement',
    assets: '$500k–$1M',
    phone: '(408) 555-0198',
    status: 'Contacted',
    notes: 'Left voicemail Monday. Rolling over a 401k from a previous employer.',
    date: '2026-06-21T09:10:00Z',
  },
  {
    id: 'l3',
    firstName: 'Derrick',
    lastName: 'Coleman',
    state: 'GA',
    vertical: 'Final Expense',
    assets: 'Under $100k',
    phone: '(404) 555-0173',
    status: 'Delivered',
    notes: 'Sent quote packet. Following up Thursday to walk through options.',
    date: '2026-06-20T17:45:00Z',
  },
  {
    id: 'l4',
    firstName: 'Sofia',
    lastName: 'Ramirez',
    state: 'FL',
    vertical: 'Life',
    assets: '$100k–$250k',
    phone: '(305) 555-0120',
    status: 'Appointment Set',
    notes: 'Booked Zoom for Friday 11am. Wants to understand cash value growth.',
    date: '2026-06-20T12:05:00Z',
  },
  {
    id: 'l5',
    firstName: 'James',
    lastName: "O'Connor",
    state: 'CO',
    vertical: 'Annuities',
    assets: '$1M+',
    phone: '(303) 555-0166',
    status: 'Available',
    date: '2026-06-19T20:18:00Z',
  },
  {
    id: 'l6',
    firstName: 'Aisha',
    lastName: 'Thompson',
    state: 'NC',
    vertical: 'Life',
    assets: '$100k–$250k',
    phone: '(704) 555-0111',
    status: 'Available',
    date: '2026-06-19T08:52:00Z',
  },
  {
    id: 'l7',
    firstName: 'Robert',
    lastName: 'Kim',
    state: 'WA',
    vertical: 'Retirement',
    assets: '$500k–$1M',
    phone: '(206) 555-0188',
    status: 'Contacted',
    notes: 'Comparing IRA vs. brokerage. Prefers email.',
    date: '2026-06-18T16:40:00Z',
  },
  {
    id: 'l8',
    firstName: 'Elena',
    lastName: 'Petrova',
    state: 'NY',
    vertical: 'IUL',
    assets: '$250k–$500k',
    phone: '(212) 555-0154',
    status: 'Appointment Set',
    notes: 'In-person meeting set for next Tuesday.',
    date: '2026-06-18T11:22:00Z',
  },
  {
    id: 'l9',
    firstName: 'David',
    lastName: 'Okafor',
    state: 'IL',
    vertical: 'Medicare',
    assets: 'Under $100k',
    phone: '(312) 555-0137',
    status: 'Delivered',
    date: '2026-06-17T19:05:00Z',
  },
  {
    id: 'l10',
    firstName: 'Hannah',
    lastName: 'Goldberg',
    state: 'MA',
    vertical: 'Annuities',
    assets: '$1M+',
    phone: '(617) 555-0179',
    status: 'Contacted',
    notes: 'Wants a guaranteed-income illustration before committing.',
    date: '2026-06-17T10:48:00Z',
  },
  {
    id: 'l11',
    firstName: 'Tyler',
    lastName: 'Nguyen',
    state: 'AZ',
    vertical: 'Life',
    assets: '$100k–$250k',
    phone: '(602) 555-0163',
    status: 'Available',
    date: '2026-06-16T22:14:00Z',
  },
  {
    id: 'l12',
    firstName: 'Grace',
    lastName: 'Sullivan',
    state: 'OR',
    vertical: 'Retirement',
    assets: '$250k–$500k',
    phone: '(503) 555-0195',
    status: 'Appointment Set',
    notes: 'Referred by an existing client. Very engaged.',
    date: '2026-06-16T13:30:00Z',
  },
];

/** Convenience helper for displaying a lead's full name. */
export function fullName(lead: Pick<Lead, 'firstName' | 'lastName'>): string {
  return `${lead.firstName} ${lead.lastName}`;
}

/** Initials for avatars, e.g. "MB". */
export function initials(lead: Pick<Lead, 'firstName' | 'lastName'>): string {
  return `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();
}
