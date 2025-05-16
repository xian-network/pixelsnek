# Visual Overhaul & Reusable Components Implementation Checklist

## Phase 1: Core Component Development & Theming

This phase focuses on building the foundational elements of your new design system.

**A. Global Setup & Theming:**
- [ ] **1. `Theme Service/Store` (`src/lib/stores/theme.js`):**
    - [ ] Implement a Svelte store to manage and toggle between light and dark modes.
    - [ ] Persist the user's theme preference (e.g., using `localStorage`).
    - [ ] Define CSS custom properties (variables) for all theme-dependent colors.
    - [ ] Automatically update `<html>` element's `data-theme` attribute.
- [ ] **2. `Color Palette Definition` (in a global CSS file, e.g., `src/app.css` or `src/lib/styles/theme.css`):**
    - [ ] Define exact color values for primary, secondary, accent, text, background, surface, and border colors.
    - [ ] Create distinct palettes for both light and dark themes using CSS variables.
- [ ] **3. `Typography System` (in global CSS):**
    - [ ] Choose and integrate suitable modern sans-serif web fonts (e.g., via `@font-face` or a font service).
    - [ ] Establish a typographic scale: define standard sizes, weights, and line heights for H1-H6, body text, subtitles, captions.
- [ ] **4. `Global CSS Reset/Normalize` (in global CSS):**
    - [ ] Apply a CSS reset (e.g., `normalize.css` or a custom reset) for consistent base styling.
- [ ] **5. `Layout & Spacing System` (defined as CSS variables or utility classes):**
    - [ ] Define a consistent spacing scale (e.g., multiples of 4px or 8px) for margins, paddings, gaps.

**B. Reusable Basic UI Elements (Svelte Components):**
- [ ] **1. `Button Component` (`src/lib/components/Button.svelte`):**
    - [ ] **Props**: `variant` (e.g., `'primary-m'`, `'primary-medium'`, `'primary-icon'`, `'faded-small'`, `'text'`), `size`, `iconLeft`, `iconRight`, `disabled`, `href`, `onClick`.
    - [ ] **States**: Implement styles for `normal`, `hover`, `pressed`, `disabled` for each variant.
    - [ ] **Transitions**: Performant CSS transitions for state changes.
    - [ ] **Accessibility**: Keyboard accessible, appropriate ARIA attributes.
- [ ] **2. `Icon Component` (`src/lib/components/Icon.svelte`):**
    - [ ] **Props**: `name` (or `src`), `size`, `color`.
    - [ ] Flexible SVG icon rendering.
- [ ] **3. `Input Component` (`src/lib/components/Input.svelte`):**
    - [ ] **Props**: `type`, `placeholder`, `value`, `disabled`, `iconLeft`, `iconRight`.
    - [ ] Styled for light/dark modes.
    - [ ] **States**: `normal`, `focus`, `disabled`, `error`.

**C. Reusable Interactive Components (Svelte Components):**
- [ ] **1. `Tabs Component` (`src/lib/components/Tabs.svelte`):**
    - [ ] **Variant**: "01 Tabs Faded/Phantom S".
    - [ ] **Props**: `items` (array: `{id, label}`), `activeTabId`.
    - [ ] **Events**: `tabChange`.
    - [ ] **Styling**: Selected/unselected states, smooth active indicator transition.
- [ ] **2. `Disclosure Component` (Accordion) (`src/lib/components/Disclosure.svelte`):**
    - [ ] **Variant**: "02 Disclosure L".
    - [ ] **Props**: `title`, `initiallyOpen`.
    - [ ] **Slot**: Default content slot.
    - [ ] **Styling**: Collapsed/expanded states (plus/minus icon).
    - [ ] **Transitions**: Smooth expand/collapse animation.
- [ ] **3. `Dropdown Component` (`src/lib/components/Dropdown.svelte`):**
    - [ ] **Variant**: "03 Dropdown Faded M".
    - [ ] **Props**: `items`, `selectedItem`, `placeholder`.
    - [ ] **Events**: `select`.
    - [ ] **Styling**: Collapsed/expanded states.
    - [ ] **Transitions**: Smooth show/hide animation.
- [ ] **4. `Modal Component` (`src/lib/components/Modal.svelte`):**
    - [ ] **Props**: `isOpen`, `title` (optional).
    - [ ] **Events**: `close`.
    - [ ] **Slots**: header, body, footer.
    - [ ] **Transitions**: Performant open/close animations.
    - [ ] **Accessibility**: Focus trapping, Esc to close, ARIA roles.

**D. Card Components (Svelte Components):**
- [ ] **1. `NFTCard Component` (`src/lib/components/cards/NFTCard.svelte`):**
    - [ ] **Props**: `imageUrl`, `title`, `collectionName`, `creatorAvatarUrl`, `creatorName`, `currentBid`, `currencySymbol`, `timeLeft`, `onBidClick`, `onInfoClick`.
    - [ ] **Styling**: Match mockup, responsive.
    - [ ] **Hover Effects**: Subtle, performant.
    - [ ] **Slot**: For action buttons.
- [ ] **2. `NFTItemPreviewCard Component` (`src/lib/components/cards/NFTItemPreviewCard.svelte`):**
    - [ ] **Props**: `imageUrl`, `title` (optional), `linkUrl`.
    - [ ] Simpler design, image-focused, hover effects.

**E. Navigation Components (Svelte Components):**
- [ ] **1. `Header Component` (`src/lib/components/layout/Header.svelte`):**
    - [ ] **Responsive Design**: Desktop/mobile views.
    - [ ] **Desktop**: Logo, nav links, search, theme toggle, "Connect" button.
    - [ ] **Mobile**: Logo, hamburger menu.
    - [ ] Integrated theme toggle.
- [ ] **2. `MobileMenu Component` (`src/lib/components/layout/MobileMenu.svelte`):**
    - [ ] Activated by hamburger.
    - [ ] Nav links, theme toggle, "Connect" button.
    - [ ] **Transitions**: Smooth slide/fade animation.
- [ ] **3. `Footer Component` (`src/lib/components/layout/Footer.svelte`):**
    - [ ] Links, copyright, branding. Modern style.

**F. Component Test Page (`src/routes/components-showcase/+page.svelte`):**
- [ ] Create a new SvelteKit route.
- [ ] Instantiate each new component:
    - [ ] All `Button` variants and states.
    - [ ] `Input`, `Tabs`, `Disclosure`, `Dropdown`, `Modal` (interactive).
    - [ ] `NFTCard`, `NFTItemPreviewCard` examples.
    - [ ] `Header` and `Footer`.
- [ ] Prominent theme switcher on this page.

## Phase 2: Application-Wide Integration & Refinement

Once the components are built and approved on the test page, we'll integrate them throughout the application.

**A. Homepage Overhaul (`src/routes/+page.svelte`):**
- [ ] Replace existing header/footer with new components.
- [ ] Reconstruct hero section with new styles and components.
- [ ] Update "Popular NFT items" with `NFTCard` components.
- [ ] Ensure consistent theme-aware styling.

**B. NFT Detail Page Overhaul (e.g., `src/routes/nft/[id]/+page.svelte`):**
- [ ] Integrate new `Header` and `Footer`.
- [ ] Rebuild main NFT info display (image, text, bid details, buttons).
- [ ] Restyle "Description" section.
- [ ] Implement "NFT item from X Collection" with `NFTItemPreviewCard`.
- [ ] Restyle "Bid history" table.
- [ ] Update social sharing icons.

**C. Other Pages/Sections (Identify and list relevant routes):**
- [ ] Systematically update UI elements on pages like "My Bids", "Statistic", "How To", "Create an NFT".
- [ ] Apply new typography, spacing, color theme.
- [ ] Update forms, lists, interactive elements.

**D. Interaction Transitions Review & Refinement:**
- [ ] Thoroughly test all interaction transitions.
- [ ] Optimize for performance (CSS transitions/animations).
- [ ] Ensure transitions enhance UX.

**E. Final Review & Comprehensive Testing:**
- [ ] **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge.
- [ ] **Responsive Testing**: Mobile, tablet, desktop, ultra-wide.
- [ ] **Accessibility (A11y) Audit**:
    - [ ] Keyboard navigation.
    - [ ] Color contrast.
    - [ ] ARIA attributes.
    - [ ] Screen reader testing.
- [ ] **Functional Testing**: Confirm all features work.
- [ ] **Visual Consistency**: Uniform design language.
- [ ] **Performance Audit**: Load times, rendering speed. 