# 🎨 Aethyr Frontend Redesign Plan

> Compiled from design interview on 2026-07-09. Updated with visual validation audit findings.
> **27 total design decisions. 0 gaps remaining.**

---

## 📐 Design System Changes

### 1. Color Palette Overhaul

| Token | Current | New | Rationale |
|-------|---------|-----|-----------|
| **Page background** | `#030712` (space-950) | `#0f172a` (slate-900) | Lightened to reduce "cave" effect; proven dark-mode standard (Vercel, Linear) |
| **Card surface** | `rgba(17, 24, 39, 0.6)` | `#1e293b` (slate-800) | Solid, distinguishable card backgrounds |
| **Elevated/hover** | N/A | `#334155` (slate-700) | New elevation level for interactive states |
| **Card borders** | `rgba(31, 41, 55, 0.5)` (gray-700) | `rgba(45, 212, 191, 0.15)` (teal-tinted) | Cohesive with teal accent system; eliminates harsh white outlines |
| **Accent colors** | Keep existing teal/indigo/cyan | Same | These work well with the new palette |
| **Input borders (rest)** | `border-space-700/50` | `rgba(45, 212, 191, 0.10)` | Dimmer teal tint, unified with card system |
| **Input borders (focus)** | `focus:border-primary-indigo` | `rgba(45, 212, 191, 0.25)` | Brightens on focus for clear feedback |

**Files to modify:**
- [globals.css](file:///home/pablo-pica/Documents/programming/aethyr/src/styles/globals.css) — update `@theme` tokens, `body` bg, glass classes, scrollbar colors

### 2. Typography Scale

| Element | Current | New | Tailwind Class |
|---------|---------|-----|----------------|
| **Body text** | ~13px | **16px** | `text-base` |
| **Labels/captions** | ~11px | **14px** | `text-sm` |
| **Section headers** | ~15px | **20px semibold** | `text-xl font-semibold` |
| **Balance number** | ~24px | **28-32px bold** | `text-3xl font-bold` |
| **Header subtitle** | ~10px | **12px tracking-wider** | `text-xs tracking-wider` |
| **Action buttons** | 9px (`text-[9px]`) | **14px bold** | `text-sm font-bold` |
| **Status badges** | 10px (`text-[10px]`) | **12px bold** | `text-xs font-bold` |

### 3. Corner Radius Token System

| Element | Radius | Tailwind | CSS Custom Property |
|---------|--------|----------|--------------------|
| Containers / Cards | 16px | `rounded-2xl` | `--radius-card: 16px` |
| Inputs / Buttons | 12px | `rounded-xl` | `--radius-input: 12px` |
| Badges / Pills | 9999px | `rounded-full` | `--radius-pill: 9999px` |
| Tooltips / Toasts | 12px | `rounded-xl` | `--radius-toast: 12px` |

### 4. Glass Card System (Updated)

```css
.glass-card {
  background-color: #1e293b;
  border: 1px solid rgba(45, 212, 191, 0.15);
  border-radius: var(--radius-card, 16px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.glass-card-interactive:hover {
  border-color: rgba(45, 212, 191, 0.3);
  box-shadow: 0 0 20px rgba(45, 212, 191, 0.08);
}
```

### 5. Focus State System (WCAG 2.4.7)

All interactive elements receive:
```css
focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:outline-none
```

Applied globally via a base layer rule and explicitly on: buttons, links, toggles, tab nav items, inputs, cards with onClick handlers.

### 6. Toggle Switch Sizing

| Property | Current | New |
|----------|---------|-----|
| Toggle dimensions | `w-10 h-6` (40×24px) | `w-12 h-7` (48×28px) |
| Touch area | None | 44×44px wrapper with transparent padding |
| Thumb size | Small | Proportionally larger |

---

## 🧩 New Shared UI Components

### 4. BottomSheet Component
**File:** `src/components/ui/BottomSheet.tsx`
- Slide-up from bottom, covers 60-70% of screen
- Dark glass background matching card surface (`#1e293b`)
- **Drag handle bar** at top: 40px × 4px, `rgba(100, 116, 139, 0.4)`, centered
- Backdrop overlay: `rgba(0, 0, 0, 0.5)` with blur
- Swipe-down to dismiss gesture
- Used by: Wallet Picker, Profile/Account, AI Console expansion

### 5. CustomNumberInput Component
**File:** `src/components/ui/CustomNumberInput.tsx`
- Text input with `type="text"` and numeric validation (no native spinners)
- Teal-outlined rounded **+/−** icon buttons flanking the input
- Hides all native browser number spinners (`-moz-appearance: textfield`)
- Used by: Send Amount, Custom Slippage

### 6. SegmentedControl Component
**File:** `src/components/ui/SegmentedControl.tsx`
- Pill-style toggle bar with smooth sliding indicator
- Supports semantic color per segment (e.g., teal, cyan, purple for roles)
- Active segment: filled with the semantic color
- Inactive: ghost/outlined
- Used by: Role Selector, Network Selector, Slippage Presets

### 7. ConfirmationDialog Component
**File:** `src/components/ui/ConfirmationDialog.tsx`
- **Tiered confirmations:**
  - **Inline (tap-twice):** Button changes text to "Confirm [action]?" on first tap, executes on second
  - **Modal dialog:** Full modal with amount, recipient, warning text, Confirm/Cancel buttons
- Used by: All milestone actions (Release, Dispute, Submit Work, Resolve)

### 8. Toast Component (Redesigned)
**File:** `src/components/ui/Toast.tsx`
- **Position:** Bottom slide-up, just above the bottom nav
- Color-coded: Teal (success), Red (error), Indigo (info)
- Auto-dismiss after 4 seconds with progress bar timer
- Max 2 visible; new toasts replace oldest
- Swipe-down to dismiss
- **Error deduplication:** Form validation → inline only. System/wallet errors → toast only.

### 9. InfoTooltip Component
**File:** `src/components/ui/InfoTooltip.tsx`
- Small `(i)` icon next to technical terms
- Tap/hover reveals explanatory popup
- Used by: Slippage, DEX routing, Escrow lock, basis points

---

## 🏗️ Structural Changes

### 10. Bottom Navigation — 4 Tabs

**Current:** Send/Swap | Activity | Settings
**New:** Send | Escrow | Activity | Settings

**File:** [BottomNav.tsx](file:///home/pablo-pica/Documents/programming/aethyr/src/components/BottomNav.tsx)
- Add `escrow` tab with Lock/Shield icon
- Update `TabId` type to include `"escrow"`
- Ensure icons are consistent size and have active/inactive states

### 11. Header Bar Redesign

**Current:** Static dark header with logo + wallet pill
**New:**
- Fixed position with frosted glass effect (`backdrop-blur-lg`)
- Logo left, wallet pill right
- On scroll: gains bottom border `rgba(45, 212, 191, 0.1)` and subtle shadow
- Network badge ("Testnet") visible near wallet pill

**Wallet button states:**
- **Disconnected:** Filled gradient button (teal→indigo) with wallet icon + "Connect Wallet" text. Prominent and inviting CTA.
- **Connected:** Subtle glass pill showing **Stellar identicon** (colored circle from address hash) + truncated address (`GBZX...MADI`). Tapping opens the account bottom sheet.

### 12. Profile/Account — Bottom Sheet

**Current:** Right-side sliding drawer ([ProfileDrawer.tsx](file:///home/pablo-pica/Documents/programming/aethyr/src/components/ProfileDrawer.tsx))
**New:** Bottom sheet (using BottomSheet component)
- Identicon + full address with copy button
- Balance summary
- Network badge
- Disconnect button (red ghost)
- Styled cohesively with the wallet picker bottom sheet

### 13. Wallet Picker — Custom Bottom Sheet

**Current:** StellarWalletsKit default light modal (jarring against dark UI)
**New:** Custom dark bottom sheet
- Dark glass background
- Wallet options as list items with icons + name
- "Install ↗" badge for missing wallets
- Green dot status indicator for detected wallets
- Drag handle + close button

---

## 📱 Tab-by-Tab Redesign

### 14. Send Tab (Simplified)

**Remove:** Full AI Console block, Milestone Builder, escrow-related fields
**Keep:** Balance card, Recipient, Amount, Route toggle, CTA button
**Add:** AI Smart Strip (collapsed)

**Layout order:**
1. Balance card (gradient border, larger number)
2. AI Smart Strip (48px, collapsible, rotating placeholder)
3. Recipient input
4. Send Amount (CustomNumberInput with XLM badge)
5. Route via Contract toggle
6. CTA button (full-width, teal→indigo gradient, 56px height)
7. Route Path visualization (if route is active)
8. Fee comparison card (side-by-side)

**AI Smart Strip design:**
- Teal-tinted glass card, 48px height
- Sparkle icon + placeholder text: rotating between "Send 50 XLM to G…" / "Escrow 100 USDC…"
- Tap to expand inline → full command input + "Parse Command" button
- After parsing: auto-fills form below and collapses

**Balance card upgrade:**
- Animated gradient border (teal → indigo) with subtle glow rotation
- Balance number: 28-32px bold
- Chain icon with teal glow ring

**Route Path visualization:**
- Horizontal flow: rounded asset pills (icon + name) connected by styled arrows
- Rate labels on the arrows
- **Flowing dots animation** along the path (CSS keyframes)

**Fee comparison:**
- Side-by-side card: Aethyr (left, teal highlight, checkmark) vs competitor (right, muted, strikethrough)
- "You save X%" badge

**CTA button:**
- Full-width, 56px height, teal→indigo gradient
- Bold white text + right arrow icon
- Loading state: spinner replaces text
- Disabled state: grayed with message ("Enter recipient to continue")

### 15. Escrow Tab (NEW)

**File:** `src/components/EscrowTab.tsx` or inline in page.tsx

**Layout:**
1. Section header: "Create Escrow"
2. Collapsible creation form:
   - Recipient input
   - Lock Amount (CustomNumberInput)
   - MilestoneBuilder component (moved from Send tab)
   - "Create Escrow Lock" CTA
3. Section header: "Active Escrows" (with count badge)
4. Active escrow cards (expandable accordion):
   - Each card shows: contract hash, total locked, milestone progress bar
   - Accordion expand reveals: role selector (SegmentedControl) + milestone cards

**Role selector (per escrow):**
- Positioned **above** the milestone list, directly below the escrow summary card header
- SegmentedControl with semantic colors:
  - Client: teal
  - Freelancer: cyan
  - Mediator: purple
  - Auto: slate
- Subtitle text below explaining the role's capabilities
- Reduces nesting — no more box-in-box pattern

**Milestone cards (accordion children):**
- Glass mini-cards with:
  - Status icon (circle: open=gray, submitted=yellow, released=teal, disputed=red)
  - Milestone name (16px)
  - Weight badge (`30%`)
  - Progress bar (filled portion = weight)
  - Action buttons (semantic hierarchy):
    - ✅ Primary positive (Release, Submit Work): Filled teal
    - ⚠️ Caution (Flag Dispute): Outlined amber
    - 🔴 Destructive (Refund): Ghost/outlined red
  - Tiered confirmations on all actions

**"Refund Expired Escrow" placement:**
- Full-width footer action **inside** the escrow card, below all milestones
- Red ghost button with warning icon
- Only visible when escrow `isExpired === true`
- Positioned consistently as a card footer (not floating)

### 16. Activity Tab (Simplified)

**Remove:** Escrow milestone management, role selector
**Keep:** Transaction history feed
**Add:** Rich transaction cards, empty state

**Transaction cards:**
- Left color bar: teal (escrow), indigo (swap), cyan (send)
- Type icon + type label + timestamp
- Amount bold right-aligned
- Compact hash preview
- Tap to expand: full hash, explorer link, details
- Staggered fade-in animation on tab switch

**"Live" indicator (replaces "Live Syncing"):**
- Pulsing green dot (4px, `bg-emerald-400`) + "Live" text badge in header
- Dot pulses when actively syncing; stays solid when caught up
- Replaces the unclear "⊙ Live Syncing" text

**Empty state:**
- Illustrated icon (receipt/transaction icon in muted teal)
- "No transactions yet" heading
- "Send your first payment to see it here" subtext

### 17. Settings Tab (Polished)

**Grouped card sections:**

1. **Network** section:
   - "Network Environment" header
   - "Current active blockchain rail" subtitle
   - SegmentedControl: Testnet | Futurenet | Local
   - Active network badge

2. **Trading** section:
   - "Slippage Tolerance" header
   - "Allowed trade price impact" subtitle
   - SegmentedControl: 0.5% | 1.0% | 3.0%
   - Custom slippage: CustomNumberInput with "%" suffix

3. **AI Features** section:
   - "AI Intent Assist" header
   - "Plain text payment command parsing" subtitle
   - Toggle switch (teal when active)

4. **About** section:
   - App version
   - "Designed for Stellar JTM" subtitle
   - Links: GitHub, Documentation

**Each group** is a glass card with consistent padding (16px), 14px labels, 20px section headers.

---

## ✨ Animation & Micro-interaction Spec

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Tab transitions | Crossfade | 200ms | ease-in-out |
| Card accordion | Slide-down | 300ms | ease-out |
| Success checkmark | Scale-in + particle burst | 500ms | spring |
| Route path dots | Flowing along path | 2s loop | linear |
| Balance border | Gradient rotation | 4s loop | linear |
| AI strip pulse | Gentle opacity pulse | 2s loop | ease-in-out |
| Toast slide | Slide up from bottom | 250ms | ease-out |
| Bottom sheet | Slide up | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Staggered list items | Fade-in + translateY | 150ms/item | ease-out |
| Skeleton shimmer | Horizontal sweep | 1.5s loop | linear |

All animations respect `prefers-reduced-motion: reduce`.

---

## 🧪 Testing Strategy

**Approach:** Refactor-safe — update tests alongside component changes.

| Phase | Tests Affected | Action |
|-------|---------------|--------|
| New UI primitives | None existing | Write new test files for each component (BottomSheet, CustomNumberInput, SegmentedControl, Toast, ConfirmationDialog, InfoTooltip) |
| Header refactor | Header-related tests | Update DOM selectors |
| Send tab refactor | Send form tests | Update selectors, add AI strip tests |
| New Escrow tab | None existing | Write new comprehensive test suite |
| Activity tab refactor | Transaction list tests | Update selectors, add empty state tests |
| Settings tab refactor | Settings tests | Update selectors |
| page.tsx split | All page tests | Migrate tests to component-level files |

**Test count target:** 24 existing → 40+ after overhaul.

---

## 📋 Implementation Order

### Phase 1: Foundation (Design Tokens + Shared Components)
1. Update `globals.css` with new color palette, typography scale, glass card system
2. Build `BottomSheet.tsx` + tests
3. Build `CustomNumberInput.tsx` + tests
4. Build `SegmentedControl.tsx` + tests
5. Build `ConfirmationDialog.tsx` + tests
6. Build `Toast.tsx` (redesigned) + tests
7. Build `InfoTooltip.tsx` + tests

### Phase 2: Shell (Header + Navigation)
8. Redesign header with frosted glass + identicon
9. Update `BottomNav.tsx` for 4 tabs (add Escrow)
10. Convert `ProfileDrawer` → bottom sheet
11. Build custom wallet picker bottom sheet

### Phase 3: Send Tab
12. Simplify Send tab layout (remove escrow fields)
13. Implement AI Smart Strip (collapsed/expandable)
14. Upgrade balance card (gradient border, larger number)
15. Replace native number inputs with CustomNumberInput
16. Add address input truncation (middle ellipsis + copy + expand on tap)
17. Redesign CTA button
18. Enhance route path visualization (pills + flowing dots)
19. Redesign fee comparison (side-by-side card)

### Phase 4: Escrow Tab (NEW)
20. Build Escrow tab structure (creation form + active escrows)
21. Move MilestoneBuilder to Escrow tab
22. Implement accordion milestone cards
23. Add role selector with SegmentedControl
24. Wire up tiered confirmations
25. Add empty state

### Phase 5: Activity Tab
26. Simplify Activity tab (remove milestone management)
27. Redesign transaction cards (left color bar, expandable)
28. Add empty state
29. Add staggered animations

### Phase 6: Settings Tab
30. Restructure into grouped card sections
31. Replace inputs with SegmentedControl and CustomNumberInput
32. Add InfoTooltips for technical terms

### Phase 7: Polish & Accessibility
33. Implement success screen with particle burst + summary card
34. Add loading skeletons throughout
35. Implement inline form validation
36. Apply focus-visible states globally (WCAG 2.4.7)
37. Resize toggle switches to 48×28px with 44px touch wrapper
38. Add "Live" indicator (pulsing dot) to Activity tab
39. Add remaining animations
40. Final cross-browser testing (Firefox, Chrome, Safari)
41. Full test suite run (target: all green, 40+ tests)

---

> [!IMPORTANT]
> This plan involves refactoring a 58K monolith (`page.tsx`) into smaller components. Each phase is independently testable and deployable. Tests must stay green throughout.

> [!TIP]
> The estimated scope is significant. Consider using `/goal` to run this as a long-running task, or `/plan` to break phases into individual work sessions.
