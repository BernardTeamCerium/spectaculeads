import { CreditPackage } from '../types';

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
