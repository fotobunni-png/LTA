# Project Prompt History

This document logs all user prompts provided during the development of **Singapore Commuter Transit Pulse**.

---

## Prompt 1: Initial Application Design & Implementation

```text
Build me an app with screens that look like this.

---
name: Singapore Commuter Transit Pulse
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#4f434f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#817380'
  outline-variant: '#d3c1d0'
  surface-tint: '#8d3d99'
  primary: '#4d005b'
  on-primary: '#ffffff'
  primary-container: '#6a1a78'
  on-primary-container: '#e48cee'
  inverse-primary: '#f9acff'
  secondary: '#bb0119'
  on-secondary: '#ffffff'
  secondary-container: '#e0292e'
  on-secondary-container: '#fffbff'
  tertiary: '#202b3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#364154'
  on-tertiary-container: '#a2adc4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd6fe'
  primary-fixed-dim: '#f9acff'
  on-primary-fixed: '#35003f'
  on-primary-fixed-variant: '#72227f'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#930011'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  capacity-seats: '#16A34A'
  capacity-standing: '#D97706'
  capacity-limited: '#DC2626'
  bus-wheelchair: '#0284C7'
  interchange-navy: '#0F172A'
  surface-subtle: '#F8FAFC'
  surface-border: '#E2E8F0'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  service-number-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.03em
  service-number-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 20px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-eta:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a civic-grade, high-legibility public transit dashboard engineered for commuters, station controllers, and fleet dispatchers across Singapore. It balances the civic authority of Singapore's mass transit infrastructure with clean, real-time ergonomics.

The visual style is Corporate / Modern utilitarian with high-density data legibility. The interface eschews decorative visual clutter in favor of immediate glanceability under varying lighting conditions—such as direct equatorial sunlight or subterranean MRT/bus interchange platforms. Critical information (bus arrival minutes, capacity tiers, line transfer badges) is strictly codified with high-contrast chromatic signifiers, robust tabular alignments, and structured cards.

## Colors

The palette balances institutional identity with real-time transit status metrics:

- Primary (`#6A1A78`): The signature SBS Transit deep purple anchors primary navigation bars, active route chips, bus service number identifiers, and core system branding.
- Secondary (`#D8232A`): The vibrant transit red designates express services, rapid operational notices, urgent disruption banners, and terminal destination badges.
- Tertiary (`#1E293B`): Dark slate navy provides structure for telemetry overlays, data tables, header rails, and map interface toolbars.
- Neutral (`#64748B`): Slate neutral governs secondary metadata, scheduled interval stops, and tabular borders.

### Transit Capacity Status Hierarchy
Crowding metrics must strictly employ the following accessible status tokens:
- `capacity-seats` (`#16A34A`): Seats Available.
- `capacity-standing` (`#D97706`): Standing Available.
- `capacity-limited` (`#DC2626`): Limited Standing / Approaching Full Capacity.
- `bus-wheelchair` (`#0284C7`): Wheelchair Accessible Bus (WAB) badge indicator.

## Typography

The typographic hierarchy uses Space Grotesk for display numbers, route labels, and ETA indicators to give service numbers (e.g., 65, 147, NR2) unmistakable clarity and a geometric transit feel. Plus Jakarta Sans serves as the body workhorse, offering clear open counters and high legibility across dense stops, timetables, and street names.

Numbers indicating arrival timings (Arr, 2 min, 14 min) must always render in tabular numerals (font-variant-numeric: tabular-nums) with Space Grotesk to prevent alignment jitter during real-time web-socket updates.

## Layout & Spacing

The dashboard operates on a strict 12-column responsive grid:
- Mobile (< 768px): Single column stream with sticky top transit search and bottom sheet ETA drawer. Margins are 1rem (16px) with space-sm (8px) card gap spacing.
- Tablet (768px - 1024px): 2-column split (4-column scrollable bus stop list, 8-column route map preview).
- Desktop (> 1024px): 12-column asymmetric layout (3 columns for stop search & bookmarks, 5 columns for live service arrival tables, 4 columns for interactive route corridor map and interchange connections).

Vertical baseline rhythm locks to a strict 4px/8px incremental scale to preserve tabular alignment across telemetry columns.

## Elevation & Depth

Visual hierarchy uses tonal layered surfaces and crisp low-contrast hairline borders (1px solid #E2E8F0) rather than heavy skeuomorphic shadows, keeping high data density crisp and glare-resistant:

- Surface Floor (`#F8FAFC`): Canvas level for map backdrops and background tracks.
- Base Cards (`#FFFFFF`): Pure white containers for arrival listings, delimited by clean 1px borders in #E2E8F0.
- Raised Interactive Surfaces: Floating search boxes and active stop chips use a clean ambient drop shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08).
- Flyouts & Route Detail Drawers: Layered overlays feature 0 12px 28px -4px rgba(15, 23, 42, 0.16) with a top 2px stroke matching Primary Purple (#6A1A78) or Interchange Navy (#0F172A).

## Shapes

The roundedness tier is set to 2 (Rounded). 
- Bus service badges, pill statuses, and quick-filter chips utilize rounded-full (9999px) to emulate standard Singapore physical transit signage.
- Stop cards, arrival tables, and map overlay viewports take standard rounded-lg (0.5rem / 8px) geometry.
- Large modal sheets and primary summary panels use rounded-xl (1rem / 16px).

## Components

### Bus Service Route Badges
- Compact Badge: Rounded rectangle (rounded-md, 6px) with high-contrast background: Purple (#6A1A78) for Trunk routes, Red (#D8232A) for Express/Fast-Forward routes, and Navy (#1E293B) for Feeder/Industrial loops. White text in service-number-sm.
- Hero Service Header: Large purple container with service-number-lg text, paired with destination stop name and directional badge (Loop vs. Terminal 1/2).

### Arrival Timing & Capacity Indicator Cards
- Arranged horizontally in three sequential arrival slots (Next Bus, 2nd Bus, 3rd Bus).
- Arrival text (Arr, 3m, 11m) displayed in label-eta with tabular numbers.
- Underneath each time stamp, render a status pill featuring the capacity color token:
  - Green border and dot for capacity-seats ("Seats")
  - Amber border and dot for capacity-standing ("Standing")
  - Red solid tint with white icon for capacity-limited ("Full")
- Wheelchair accessible buses show a discrete blue wheelchair glyph alongside the capacity pill.

### Search & Station Input Fields
- White background with 1.5px border in #CBD5E1, transitioning to #6A1A78 with a 3px outer ring in rgba(106, 26, 120, 0.15) on focus. Includes left-anchored bus stop code icon and clear button.

### Transit Stop Lists & Accordions
- Alternating subtle rows (#FFFFFF to #F8FAFC) with vertical transit line spine on the left connecting circular node dots (8px diameter, hollow for intermediate stops, filled with red/purple rings for interchange hubs).

### Action Buttons & Filters
- Primary Action: Solid #6A1A78 background with #FFFFFF text, rounded-lg, hover state shifts to #541460.
- Secondary Action: #1E293B background with white text for telemetry export and map layer toggle.
- Filter Chips: Pill shape (rounded-full), #F1F5F9 neutral background with #475569 text; turns solid #6A1A78 with white text when active.
```

---

## Prompt 2: Remote Git Push to GitHub

```text
Git push https://[REDACTED_GITHUB_TOKEN]@github.com/fotobunni-png/LTA.git
```

---

## Prompt 3: Backend API Setup & LTA DataMall v3 Integration

```text
1) create a /api folder under the main project to store all the apis
2) create a /api/health.js to monitor if the apis are working.

3) Integrate the LTA bus information API endpoint GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121. Header: AccountKey: [your key from the email]. BusStopCode is the only required parameter. Add &ServiceNo=7 to ask about one service only. Refreshes every 20 seconds. JSON comes back by default. I will add the LTA_ACCOUNT_KEY in Vercel environment variables later.
```

---

## Prompt 4: Sync & Push to GitHub

```text
git push
```

---

## Prompt 5: Generate Prompt Log Document

```text
create a prompt.md containing all my prompts located at project main
```
