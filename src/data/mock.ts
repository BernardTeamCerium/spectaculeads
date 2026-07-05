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
    perks: ['10 verified leads', 'Priority delivery', 'Chat support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199.99,
    credits: 20,
    perks: ['20 verified leads', 'Instant delivery', 'Dedicated support', 'Lead replacement'],
    highlight: true,
  },
];

/** ISO timestamp N hours before now — keeps the demo inbox looking fresh. */
const hoursAgo = (h: number): string => new Date(Date.now() - h * 3600 * 1000).toISOString();

/** Sample leads: a mix of verticals, asset bands, and all four statuses. */
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
    date: hoursAgo(2),
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
    date: hoursAgo(6),
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
    date: hoursAgo(20),
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
    date: hoursAgo(27),
    closedAmount: 2400,
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
    date: hoursAgo(33),
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
    date: hoursAgo(45),
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
    date: hoursAgo(52),
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
    date: hoursAgo(58),
    closedAmount: 3600,
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
    date: hoursAgo(70),
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
    date: hoursAgo(76),
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
    date: hoursAgo(90),
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
    date: hoursAgo(98),
    closedAmount: 2800,
  },
  {
    id: 'l13',
    firstName: 'Wei',
    lastName: 'Chen',
    state: 'CA',
    vertical: 'IUL',
    assets: '$500k–$1M',
    phone: '(415) 555-0184',
    status: 'Available',
    date: hoursAgo(4),
  },
  {
    id: 'l14',
    firstName: 'Danielle',
    lastName: 'Foster',
    state: 'TX',
    vertical: 'Medicare',
    assets: '$100k–$250k',
    phone: '(214) 555-0150',
    status: 'Available',
    date: hoursAgo(11),
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

/** How many fresh leads a single purchase drops into the inbox. */
export const LEADS_PER_PURCHASE = 2;

/** Rotating pool of candidate leads used when a purchase delivers new leads. */
const FRESH_LEAD_POOL: Omit<Lead, 'id' | 'status' | 'date'>[] = [
  { firstName: 'Nina', lastName: 'Alvarez', state: 'NM', vertical: 'Retirement', assets: '$250k–$500k', phone: '(505) 555-0211' },
  { firstName: 'Caleb', lastName: 'Watson', state: 'OH', vertical: 'Life', assets: '$100k–$250k', phone: '(614) 555-0233' },
  { firstName: 'Maya', lastName: 'Schmidt', state: 'WI', vertical: 'Annuities', assets: '$500k–$1M', phone: '(414) 555-0245' },
  { firstName: 'Omar', lastName: 'Haddad', state: 'MI', vertical: 'IUL', assets: '$250k–$500k', phone: '(313) 555-0257' },
  { firstName: 'Bridget', lastName: 'Flynn', state: 'PA', vertical: 'Medicare', assets: 'Under $100k', phone: '(215) 555-0269' },
  { firstName: 'Andre', lastName: 'Mensah', state: 'MD', vertical: 'Life', assets: '$100k–$250k', phone: '(410) 555-0271' },
  { firstName: 'Lucia', lastName: 'Romano', state: 'NV', vertical: 'Retirement', assets: '$1M+', phone: '(702) 555-0283' },
  { firstName: 'Trevor', lastName: 'Park', state: 'UT', vertical: 'Final Expense', assets: 'Under $100k', phone: '(801) 555-0295' },
];

let freshLeadCursor = 0;

/**
 * Generate `count` brand-new "Available" leads (unique ids, current timestamp)
 * to drop into the inbox after a purchase. Draws from a rotating pool so
 * repeated purchases surface different people.
 */
export function generateLeads(count: number): Lead[] {
  const now = Date.now();
  const leads: Lead[] = [];
  for (let i = 0; i < count; i++) {
    const template = FRESH_LEAD_POOL[freshLeadCursor % FRESH_LEAD_POOL.length];
    freshLeadCursor += 1;
    leads.push({
      ...template,
      id: `gen_${now}_${i}`,
      status: 'Available',
      date: new Date(now).toISOString(),
    });
  }
  return leads;
}
