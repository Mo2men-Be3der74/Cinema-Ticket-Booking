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
```html
<header class="fixed top-0 left-0 right-0 h-[56px] bg-[#0A0A0C] border-b border-[#22242A] z-50 px-6 flex items-center justify-between">
  <div class="flex items-center gap-12">
    <a href="#" id="nav-logo" class="text-xl font-medium tracking-tight">LUMA</a>
    <nav class="hidden md:flex items-center gap-8">
      <a href="#" id="nav-movies" class="text-xs font-medium tracking-wide uppercase hover:text-white transition-colors">Movies</a>
      <a href="#" id="nav-theaters" class="text-xs font-medium tracking-wide uppercase text-[#8E8E93] hover:text-white transition-colors">Theaters</a>
      <a href="#" id="nav-concessions" class="text-xs font-medium tracking-wide uppercase text-[#8E8E93] hover:text-white transition-colors">Concessions</a>
    </nav>
  </div>
  
  <div class="flex items-center gap-6">
    <div class="relative hidden sm:block">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#545458]">
        <iconify-icon icon="lucide:search" width="14"></iconify-icon>
      </div>
      <input 
        type="text" 
        placeholder="Search movies..."
        class="bg-[#141518] border border-[#22242A] text-xs py-1.5 pl-9 pr-12 rounded-[4px] w-64 focus:outline-none focus:border-white transition-colors placeholder:text-[#545458]"
      >
      <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <span class="text-[10px] bg-[#22242A] text-[#8E8E93] px-1 py-0.5 rounded border border-[#32343a] font-variant-numeric: tabular-nums; font-medium">⌘K</span>
      </div>
    </div>
    <a href="#" id="nav-profile" class="w-8 h-8 rounded-full border border-[#22242A] flex items-center justify-center text-[#8E8E93] hover:border-white hover:text-white transition-colors">
      <iconify-icon icon="lucide:user" width="16"></iconify-icon>
    </a>
  </div>
</header>
```

## Footer Component
```html
<footer class="px-12 py-20 border-t border-[#22242A] mt-10">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-white">Experience</p>
      <ul class="space-y-3">
        <li><a href="#imax" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">IMAX Laser</a></li>
        <li><a href="#dolby" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">Dolby Cinema</a></li>
        <li><a href="#lounge" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">The Lounge</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-white">Company</p>
      <ul class="space-y-3">
        <li><a href="#about" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">About Luma</a></li>
        <li><a href="#careers" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">Careers</a></li>
        <li><a href="#press" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">Press</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-white">Social</p>
      <ul class="space-y-3">
        <li><a href="https://instagram.com" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">Instagram</a></li>
        <li><a href="https://twitter.com" class="text-xs text-[#8E8E93] hover:text-white transition-colors uppercase tracking-widest">Twitter / X</a></li>
      </ul>
    </div>
    <div class="text-right">
      <h2 class="text-3xl font-medium tracking-tighter mb-4 text-white">LUMA</h2>
      <p class="text-[10px] text-[#545458] uppercase tracking-widest leading-relaxed">
        Cinema, Distilled.<br>
        © 2026 Luma Cinema Group.<br>
        All Rights Reserved.
      </p>
    </div>
  </div>
</footer>
```

## Button Styles

### Primary CTA Button (White)
```html
<a href="#" class="bg-white text-black text-xs font-semibold px-10 py-4 uppercase tracking-[0.2em] hover:bg-[#EAEAEA] transition-colors">
  Reserve Tickets
</a>
```

### Secondary Button (Outline)
```html
<button class="border border-[#22242A] text-white text-[10px] font-semibold px-4 py-2.5 uppercase tracking-widest rounded-[4px] hover:bg-[#22242A] transition-colors">
  Cancel Selection
</button>
```

## Card Styles

### Movie Card (2:3 Vertical)
```html
<a href="#" class="group">
  <div class="aspect-[2/3] w-full bg-[#141518] border border-[#22242A] rounded-[6px] overflow-hidden mb-4 relative">
    <img src="..." alt="Movie" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0">
    <div class="absolute bottom-3 left-3">
      <span class="text-[9px] bg-white text-black px-1.5 py-0.5 rounded-[2px] font-bold tracking-tighter uppercase">19:30</span>
    </div>
  </div>
  <h3 class="text-sm font-medium tracking-tight mb-1 group-hover:text-white transition-colors">OPPENHEIMER</h3>
  <p class="text-[11px] text-[#8E8E93] uppercase tracking-wider font-variant-numeric: tabular-nums; font-medium">3h 00m • R-RATED</p>
</a>
```

### Product Card (Grid)
```html
<div class="bg-[#141518] border border-[#22242A] rounded-[8px] overflow-hidden flex flex-col">
  <div class="aspect-square relative bg-[#1A1B1E] p-8">
    <span class="absolute top-3 right-3 text-[9px] font-bold tracking-tighter font-variant-numeric: tabular-nums; bg-[#22242A] text-[#8E8E93] px-1.5 py-0.5 rounded-[2px] border border-[#32343a]">840 KCAL</span>
    <img src="..." alt="Snack" class="w-full h-full object-contain grayscale opacity-90">
  </div>
  <div class="p-6 flex-grow flex flex-col">
    <h3 class="text-sm font-medium tracking-tight mb-2">CARAMEL POPCORN & LARGE SLUSHIE COMBO</h3>
    <div class="mt-auto flex items-center justify-between">
      <span class="text-sm font-medium font-variant-numeric: tabular-nums;">$14.50</span>
      <div class="flex items-center gap-3 border border-[#22242A] rounded-[4px] px-1 py-1">
        <button class="w-6 h-6 flex items-center justify-center text-[#8E8E93] hover:text-white transition-colors"><iconify-icon icon="lucide:minus" width="14"></iconify-icon></button>
        <span class="text-xs font-medium font-variant-numeric: tabular-nums; w-4 text-center">1</span>
        <button class="w-6 h-6 flex items-center justify-center text-[#8E8E93] hover:text-white transition-colors"><iconify-icon icon="lucide:plus" width="14"></iconify-icon></button>
      </div>
    </div>
  </div>
</div>
```

## Seat Grid Cell Styles

### Available Seat
```html
<div class="w-10 h-10 border border-[#22242A] rounded-[4px] flex items-center justify-center text-[10px] text-[#8E8E93] hover:bg-white hover:text-black transition-colors cursor-pointer font-variant-numeric: tabular-nums;">A1</div>
```

### Selected Seat
```html
<div class="w-10 h-10 bg-white border border-white flex items-center justify-center text-[10px] text-black font-semibold font-variant-numeric: tabular-nums;">A3</div>
```

### Occupied Seat (Striped)
```html
<div class="w-10 h-10 bg-[rgba(20,21,24,0.3)] border border-[#22242A] rounded-[4px] flex items-center justify-center text-[10px] text-[rgba(142,142,147,0.2)] font-variant-numeric: tabular-nums;" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(34, 36, 42, 0.4) 4px, rgba(34, 36, 42, 0.4) 5px);"></div>
```
