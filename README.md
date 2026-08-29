# GATE ZERO (`GATEZERO.IN`)
### Cultural Access & Ticketing System // India & International

**“THE GATE BETWEEN YOU AND THE EXPERIENCE.”**

---

## Overview

**GATE ZERO** is a full-stack, brutalist-editorial event-discovery and ticketing platform designed for underground electronic music, warehouse gatherings, coastal festivals, raw stand-up comedy, audiovisual masterclasses, and independent culture across India (Mumbai, Bengaluru, Delhi NCR, Goa, Pune, Hyderabad, and Dubai).

---

## Key Features

### 1. Public Discovery & Visual Identity
- **Brutalist Editorial Aesthetic**: Absolute black architectural backdrops (`#050505`), signal lime accents (`#C8FF16`), monospaced technical codes (`GZ-MUM-001`, `ACCESS HASH`), industrial grid overlays, and oversized Swiss typography.
- **Dynamic Search Console**: Multi-parameter search by event title, artist lineup, venue, city, and category.
- **Tactical Radar & Interactive Map**: Multi-city coordinate pins across Mumbai, Bengaluru, Delhi, Goa, and Pune with instant previews.
- **Discovery Engine**: Grid, list, and map views with filters for venue format (Warehouse, Rooftop, Secret Location), age restriction (18+, 21+, All Ages), max price slider, verified hosts only, and instant active filter chips.

### 2. Event Experience & Secret Tiers
- **Detailed Event Transmissions**: Lineup set times, audio-visual specs (Funktion-One, 32-channel spatial audio), run-of-show timeline, venue directions, dress code, phone tape policy, safety guidelines, and accordion FAQs.
- **Dynamic Ticket Selector**: Multiple tiers (Early Bird, Phase 1/2/3, VIP Deck, Group Passes, and **Secret Passcode-Locked Tiers** unlocked with codes like `VIPACCESS` or `BLACKOUT`).
- **Realtime Availability**: Live stock indicators, inventory counts, and instant subtotal math with 18% GST and platform security fees.

### 3. Customer Checkout & Digital Passes
- **Distraction-Free Checkout**: Attendee information capture for every pass, organizer compliance questions (Emergency contact, age confirmation).
- **Promo Code Engine**: Real-time validation for codes like `GATEZERO10` (10% off), `UNDERGROUND` (₹300 off), and promoter codes like `PRIYA10`.
- **Payment Sandbox**: UPI (VPA IDs, QR), Indian & International Cards, Net Banking, and simulated Razorpay / Stripe rails.
- **Instant Digital QR Passes**: Cryptographically signed SVG QR codes rendered instantly, printable PDF passcards, and Google/Apple Calendar export.

### 4. Role-Based Dashboards & Portals

| Role | Demo Identity | Dashboard Route | Key Capabilities |
|---|---|---|---|
| **Attendee** | `alex.chen@gatezero.in` | `/tickets` | Interactive pass wallet, dynamic QR codes, 1-click pass transfer, refund claims, itemized GST receipts. |
| **Organizer** | `karan@subkulture.in` (SubKulture India) | `/organizer/dashboard` | Gross sales analytics (₹48.5L), hourly velocity charts, event creation, attendee database with CSV export, broadcasts. |
| **Promoter / Affiliate** | `priya.affiliate@gatezero.in` (Priya Sharma) | `/promoter` | Unique referral links (`?ref=PRIYA10`), 10% commission tracking, click logs, and payout requests. |
| **Door Staff** | `staff.reayroad@gatezero.in` (Rajesh Shinde) | `/checkin` | Optical QR viewfinder, test scan triggers, duplicate scan detection, live house headcount bar, undo check-in. |
| **Platform Super Admin** | `admin@gatezero.in` (Dev Malik) | `/admin` | GMV metrics (₹68.4L), organizer KYC verification (PAN/GSTIN), event approvals, settlement releases, and audit logs. |

---

## Technical Stack

- **Framework**: Next.js 16 (App Router, Server Components & Dynamic Route Handlers)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom brutalist dark-light theme, grid overlays, and scanline animations
- **QR Engine**: `qrcode` (SVG and High-Contrast Data URLs)
- **Celebration Effects**: `canvas-confetti`
- **Icons**: `lucide-react`
- **Data Layer**: High-performance persistent JSON storage with atomic writes and in-memory fallback

---

## Seeded Demo Content

1. **Steelworks: After Dark** (`GZ-MUM-001`) — Raw industrial techno inside a disused forging mill at Reay Road Docklands, Mumbai.
2. **The Fifth Room: Immersive Sonic Lab** (`GZ-BLR-002`) — 32-channel spatial audio & modular synthesizers in Indiranagar, Bengaluru.
3. **OFF/GRID Goa: 3-Day Coastal Festival** (`GZ-GOA-003`) — Sunset-to-sunrise electronic festival on Vagator red cliffs.
4. **KHAOS Delhi: Brutalist Design & Bass** (`GZ-DEL-004`) — UK Garage, DnB & brutalist typography installations at Dhan Mill Compound, New Delhi.
5. **Decibel Underground: Warehouse Series** (`GZ-PNE-005`) — Hard techno and acid 303 in Koregaon Park, Pune.
6. **Unfiltered: Late Night Stand-Up** (`GZ-MUM-006`) — Intimate dark comedy basement in Bandra, Mumbai.
7. **SYNTHEX: Modular Synthesizer Workshop** (`GZ-BLR-007`) — Eurorack patching masterclass in Koramangala, Bengaluru.
8. **Future Culture Summit 2026** (`GZ-MUM-008`) — AI music & fashion conference at BKC, Mumbai.
9. **Blackout Session: Private Rooftop** (`GZ-MUM-009`) — Password-protected vinyl listening experience in Colaba, Mumbai.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the local product
npm run dev

# 3. Production build
npm run build
npm run start -- -p 3000 -H 0.0.0.0
```

Access the application at `http://localhost:3000` or the live environment preview.

Demo OTP login: any 4+ digit code. Seed identities: `alex.chen@gatezero.in`, `karan@subkulture.in`, `priya.affiliate@gatezero.in`, `staff.reayroad@gatezero.in`, `admin@gatezero.in`. Promo codes: `GATEZERO10`, `UNDERGROUND`, `BLRTECHNO`, `PRIYA10`. Secret tiers: `VIPACCESS`, `BLACKOUT`.
