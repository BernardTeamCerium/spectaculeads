# Spectaculeads — Prototype

A clickable **demo** of Spectaculeads, a lead-generation app for financial advisors.
Built with **Expo + React Native (TypeScript)** and **Expo Router**. Runs on **web, iOS, and Android**.

> ⚠️ Prototype only. Everything runs on **mock data and local state** — there is no backend,
> no real authentication, and no real payment processing.

## Run it

```bash
npm install
npm run web      # open in a browser
npm start        # then scan the QR code with Expo Go (iOS/Android)
```

## What's in the demo

Bottom tab navigation: **Home · Plan · Leads · Buy · Profile**

1. **Splash** — the "SL" mark spins up with the tagline _"Your income goal, delivered."_, then routes to login.
2. **Login** — fake auth; any input signs you in.
3. **Income by Design** — welcome → 3 slider steps (net income goal, average sale, commission & close rate)
   → results (projected income, deals/leads needed) → a recommended credit package.
4. **Your Plan** — yearly / quarterly / monthly breakdown tabs.
5. **Buy Leads** — credit packages (Starter $49.99/5, Plus $99.99/10, Pro $199.99/20) + a mock checkout flow.
6. **Lead Inbox** — filterable lead list and a detail view with the status workflow
   (Available → Contacted → Delivered → Appointment Set) and editable notes (local state).
7. **Profile** — user info, credits remaining, mock license upload, and verified-license states.

## Project structure

```
app/                       # Expo Router routes
  _layout.tsx              # root stack: fonts, providers, splash control
  index.tsx                # animated splash
  login.tsx
  (tabs)/                  # bottom tab navigator + 5 tab screens
  income/                  # Income by Design flow (welcome / steps / results)
  lead/[id].tsx            # lead detail
  checkout.tsx             # mock checkout (modal)
src/
  theme.ts                 # brand colors, fonts, spacing
  state/AppState.tsx       # local app state (auth, credits, leads, plan, license)
  components/              # Logo, Button, Slider, shared UI
  data/                    # mock leads + credit packages
  utils/format.ts          # currency / time helpers
```

## Brand

- Navy `#191C3B` · Indigo `#20234E` · Teal `#27B7CE` (light `#5FD3E3`, deep `#1A8AA0`)
- Light screens: bg `#EAEDF3`, text `#1A1D3A`, muted `#6E7388`, white cards
- Headings in **Sora**, body in **Figtree**
