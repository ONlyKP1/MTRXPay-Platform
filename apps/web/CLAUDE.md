# MTRX Pay - Merchant Dashboard

## Project Overview
React merchant dashboard for MTRX Pay (Matrix Pay), a premium B2B payment orchestration platform for high-value merchants and underserved industries.

## Tech Stack
- React 19 + TypeScript
- Vite
- React Router
- React Hook Form + Zod validation
- SumSub SDK for KYC/KYB

## Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

---

# MIDAS Brand Guidelines

## The Brand Position

### Sovereign & Sophisticated

Our brand is built on two reinforcing pillars:

| Pillar | Tagline | Description |
|--------|---------|-------------|
| **Sovereign** | Empowerment & Control | We give control back to the pioneer. Our technology makes it impossible for funds to be arbitrarily frozen or seized. |
| **Sophisticated** | Competence & Trust | We are not a risky startup; we are a serious, institutional-grade platform. Our sophistication is proven through superior engineering and deep expertise. |

---

## The Visual Identity

### A Visual Language of Trust and Innovation

### Colour Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Deep Midnight** | `#021B3A` | Primary background |
| **Metallic Gold** | `#D4AF37` | Primary accent, borders, headings |
| **Charcoal Black** | `#333333` | Secondary text, dark elements |
| **Electric Blue** | `#00ADEF` | Secondary accent, info states |

### CSS Variables
```css
:root {
  --navy: #021B3A;
  --gold: #D4AF37;
  --charcoal: #333333;
  --electric-blue: #00ADEF;
}
```

### Typography & Voice

**Fonts:**
| Font | Style | Usage |
|------|-------|-------|
| **Cormorant Garamond** | Serif | Headings, display text - for authority |
| **Work Sans** | Sans-Serif | Body text, UI elements - for clarity |
| **Italiana** | Serif | Logo, brand mark |

**Tone of Voice:**
- Direct
- Empowering
- Reliable
- Respectful
- Competent

---

## Design Patterns

### Cards
- Dark background (`--navy-light`)
- Gold border (`1px solid var(--gold)`)
- 16px border radius
- Hover: highlight gold border

### Buttons
| Type | Style |
|------|-------|
| **Primary** | Gold background, dark text, uppercase |
| **Secondary** | Transparent with gold border, gold text |

### Headings
- Cormorant Garamond, italic style
- Gold color for emphasis

### Section Labels
- Uppercase, wide letter-spacing (2-3px)
- Muted text color

---

## Project Structure
```
src/
├── App.tsx              # Main routing
├── index.css            # All styles (CSS variables)
├── components/
│   ├── common/          # Shared UI components
│   └── PasswordGate.tsx # Dev password protection
├── context/
│   ├── AuthContext.tsx  # Authentication state
│   └── KYCContext.tsx   # KYC/KYB flow state
└── pages/
    ├── LandingPage.tsx
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    ├── DashboardPage.tsx
    ├── SubscriptionsPage.tsx
    ├── AccountTypePage.tsx
    ├── IndustrySelectPage.tsx
    ├── KYCIndividualPage.tsx
    └── KYBPage.tsx
```

## Key Features
- Multi-currency support (GBP, EUR, USD, AED)
- 72-hour escrow release tracking
- Merchant trust level scoring
- KYC/KYB integration with SumSub
- Industry-specific onboarding for high-risk sectors

## Target Industries
- Cryptocurrency & Web3
- Gaming & iGaming
- Adult Entertainment
- CBD & Cannabis
- Nutraceuticals
- Forex & Trading
- Travel & Tourism
- E-commerce & Retail
- SaaS & Technology
