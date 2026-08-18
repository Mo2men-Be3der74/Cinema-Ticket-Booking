# LUMA CINEMA — Design System

## Color Palette (CSS Custom Properties)
```css
--color-matte-noir: #0A0A0C
--color-flat-charcoal: #141518
--color-slate-neutral: #8E8E93
--color-slate-muted: #545458
--color-hairline-border: #22242A
--color-primary: #FFFFFF
--color-secondary-bg: #1A1B1E
--color-dark-hover: #EAEAEA
```

## Typography
- **Font Family**: Inter (Regular 400, Medium 500, Semibold 600)
- **Heading Scale**: 
  - Hero: 96px / text-9xl (tracking-tighter)
  - H1: 48px / text-4xl (font-medium, tracking-tight)
  - H2: 32px / text-2xl (font-medium, tracking-tight)
  - Body: 16px / text-base (tracking-normal)
- **Special**: Tabular figures for prices, dates, seat numbers (font-variant-numeric: tabular-nums)
- **Tracking**: 
  - Headings: tracking-tighter / tracking-tight
  - UI labels: tracking-widest
  - Navigation: tracking-wide

## Layout & Spacing
- **Container**: 1440px max-width (mx-auto)
- **Padding**: 12px (px-12) for main sections, 6px (px-6) for responsive
- **Spacing System**: 8px base unit
- **Grid**: 12-column flexible grid

## Border & Corners
- **Hairline Border**: 1px solid #22242A (applied to cards, inputs, buttons)
- **Border Radius**: 
  - Cards & inputs: rounded-[6px] to rounded-[8px]
  - Tags: rounded-[2px] to rounded-[4px]
  - Buttons: rounded-[4px]
- **Zero Effects**: No glowing, no shadows, no gradient borders

---

# Reusable Component HTML

## Header Component