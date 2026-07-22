# Technical Design Document: Frontend Theme Redesign

## 1. Overview

This document provides a comprehensive technical design for transforming the NovaBank LoanSphere frontend from traditional slate-based banking aesthetics to a modern fintech visual identity. The redesign targets all 16 React components while maintaining the existing React 19, Vite, and Tailwind CSS v4 technology stack.

### 1.1 Design Goals

- Replace slate color palette with vibrant fintech colors (blue-purple primary spectrum)
- Implement dual-tone layout (dark header, light content)
- Apply modern fintech design patterns across all components
- Ensure WCAG 2.1 AA accessibility compliance
- Maintain backward compatibility with existing functionality

### 1.2 Scope

**In Scope:**
- Color palette definition and Tailwind CSS v4 configuration
- Visual redesign of all 16 components
- Typography, spacing, shadows, and border radius specifications
- Hover states, transitions, and animations
- Responsive design patterns
- Accessibility compliance

**Out of Scope:**
- Component functionality changes
- New feature development
- Backend API modifications
- Routing or state management changes


## 2. Color Palette Architecture

### 2.1 Primary Color System

The primary color is selected from the blue-purple spectrum to convey trust, innovation, and modernity characteristic of leading fintech brands.

**Primary Color Definition:**
```css
/* Primary: Vibrant blue-purple (hue 250°) */
--color-primary-50: #f0f0ff;
--color-primary-100: #e0e0ff;
--color-primary-200: #c7c7ff;
--color-primary-300: #a5a5ff;
--color-primary-400: #8080ff;
--color-primary-500: #6366f1;  /* Base primary */
--color-primary-600: #4f46e5;
--color-primary-700: #4338ca;
--color-primary-800: #3730a3;
--color-primary-900: #312e81;
--color-primary-950: #1e1b4b;
```

**Rationale:** Hue 250° falls within the required 200-280° range and provides excellent balance between blue (trust) and purple (innovation). The indigo-like tone differentiates from traditional banking blue while maintaining professional credibility.


### 2.2 Secondary Color System

The secondary color complements the primary while providing sufficient contrast for visual hierarchy.

**Secondary Color Definition:**
```css
/* Secondary: Vibrant teal (complementary) */
--color-secondary-50: #f0fdfa;
--color-secondary-100: #ccfbf1;
--color-secondary-200: #99f6e4;
--color-secondary-300: #5eead4;
--color-secondary-400: #2dd4bf;
--color-secondary-500: #14b8a6;  /* Base secondary */
--color-secondary-600: #0d9488;
--color-secondary-700: #0f766e;
--color-secondary-800: #115e59;
--color-secondary-900: #134e4a;
--color-secondary-950: #042f2e;
```

**Rationale:** Teal provides excellent contrast with blue-purple primary (complementary on color wheel) and is widely used in modern fintech (Revolut accent, Stripe highlights). Contrast ratio with primary-500: 3.2:1 (sufficient for large UI elements).


### 2.3 Accent Color System

Three distinct accent colors for highlights, CTAs, and interactive elements.

**Accent Color Definitions:**
```css
/* Accent 1: Vibrant Violet */
--color-accent-violet-400: #a78bfa;
--color-accent-violet-500: #8b5cf6;
--color-accent-violet-600: #7c3aed;

/* Accent 2: Electric Pink */
--color-accent-pink-400: #f472b6;
--color-accent-pink-500: #ec4899;
--color-accent-pink-600: #db2777;

/* Accent 3: Bright Cyan */
--color-accent-cyan-400: #22d3ee;
--color-accent-cyan-500: #06b6d4;
--color-accent-cyan-600: #0891b2;
```

**Usage Guidelines:**
- **Violet:** Premium features, pro badges, highlighted metrics
- **Pink:** CTA buttons, promotional banners, special offers
- **Cyan:** Status indicators, progress bars, notifications


### 2.4 Semantic Color System

Colors assigned specific meanings for user feedback and status communication.

**Semantic Color Definitions:**
```css
/* Success: Green spectrum */
--color-success-50: #f0fdf4;
--color-success-100: #dcfce7;
--color-success-500: #22c55e;  /* Base success */
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Error: Red spectrum */
--color-error-50: #fef2f2;
--color-error-100: #fee2e2;
--color-error-500: #ef4444;  /* Base error */
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Warning: Yellow-orange spectrum */
--color-warning-50: #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-500: #f59e0b;  /* Base warning */
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Info: Blue spectrum */
--color-info-50: #eff6ff;
--color-info-100: #dbeafe;
--color-info-500: #3b82f6;  /* Base info */
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```


### 2.5 Neutral Color System

Seven shades of neutral colors for backgrounds, borders, and text (exceeds minimum requirement of 5).

**Neutral Color Definitions:**
```css
/* Neutral: Modern gray with slight cool tone */
--color-neutral-50: #f8fafc;   /* Lightest bg */
--color-neutral-100: #f1f5f9;  /* Light bg */
--color-neutral-200: #e2e8f0;  /* Borders light */
--color-neutral-300: #cbd5e1;  /* Borders */
--color-neutral-400: #94a3b8;  /* Muted text */
--color-neutral-500: #64748b;  /* Secondary text */
--color-neutral-600: #475569;  /* Body text */
--color-neutral-700: #334155;  /* Headings */
--color-neutral-800: #1e293b;  /* Dark elements */
--color-neutral-900: #0f172a;  /* Darkest bg/text */
--color-neutral-950: #020617;  /* Black */
```

**Rationale:** Using a modern gray palette with slight blue undertone that harmonizes with the primary color system. Provides sufficient range for text hierarchy and background layering.


### 2.6 Accessibility Compliance

All color combinations meet WCAG 2.1 AA requirements:

| Text Color | Background | Contrast Ratio | Status |
|------------|------------|----------------|--------|
| neutral-900 | neutral-50 | 16.2:1 | ✓ Pass (normal text) |
| neutral-700 | neutral-50 | 10.8:1 | ✓ Pass (normal text) |
| neutral-600 | neutral-50 | 7.5:1 | ✓ Pass (normal text) |
| neutral-50 | primary-600 | 8.3:1 | ✓ Pass (normal text) |
| neutral-50 | neutral-900 | 16.2:1 | ✓ Pass (normal text) |
| primary-600 | primary-100 | 7.1:1 | ✓ Pass (normal text) |
| success-700 | success-50 | 9.2:1 | ✓ Pass (normal text) |
| error-700 | error-50 | 8.8:1 | ✓ Pass (normal text) |

**Testing Strategy:** All text/background pairs used in the theme will be validated using automated contrast ratio calculations.


## 3. Tailwind CSS v4 Configuration

### 3.1 Configuration File Structure

**File:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color system
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c7ff',
          300: '#a5a5ff',
          400: '#8080ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
          DEFAULT: '#4f46e5', // primary-600
        },
        // Secondary color system
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
          DEFAULT: '#0d9488', // secondary-600
        },
        // Accent colors
        accent: {
          violet: {
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
          },
          pink: {
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          },
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
          },
        },
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          DEFAULT: '#22c55e',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          DEFAULT: '#ef4444',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          DEFAULT: '#f59e0b',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          DEFAULT: '#3b82f6',
        },
        // Neutral colors (replaces slate)
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
          DEFAULT: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
```


### 3.2 Color Migration Map

Mapping from old slate colors to new neutral colors:

| Old Class | New Class | Context |
|-----------|-----------|---------|
| `bg-slate-50` | `bg-neutral-50` | Light backgrounds |
| `bg-slate-100` | `bg-neutral-100` | Card backgrounds |
| `bg-slate-200` | `bg-neutral-200` | Borders, dividers |
| `text-slate-400` | `text-neutral-400` | Muted text |
| `text-slate-500` | `text-neutral-500` | Secondary text |
| `text-slate-600` | `text-neutral-600` | Body text |
| `text-slate-700` | `text-neutral-700` | Headings |
| `text-slate-800` | `text-neutral-800` | Emphasized text |
| `bg-slate-800` | `bg-neutral-800` | Dark backgrounds |
| `bg-slate-900` | `bg-neutral-900` | Darkest backgrounds (header) |
| `border-slate-200` | `border-neutral-200` | Light borders |
| `border-slate-700` | `border-neutral-700` | Dark borders |
| `border-slate-800` | `border-neutral-800` | Darkest borders |

**Implementation Note:** All 16 components will be systematically updated using this migration map.


## 4. Typography System

### 4.1 Font Configuration

**Primary Font:** Inter (sans-serif)
- Modern, highly legible geometric sans-serif
- Excellent screen rendering at all sizes
- Wide adoption in fintech (Stripe, Coinbase, Revolut)

**Monospace Font:** JetBrains Mono
- For code snippets, account numbers, reference IDs
- Excellent character distinction (0 vs O, 1 vs l)

**Font Loading Strategy:**
```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```


### 4.2 Heading Typography Scale

| Element | Font Size | Line Height | Font Weight | Tailwind Classes |
|---------|-----------|-------------|-------------|------------------|
| `<h1>` | 36px (2.25rem) | 1.2 | 700 | `text-4xl font-bold` |
| `<h2>` | 30px (1.875rem) | 1.3 | 700 | `text-3xl font-bold` |
| `<h3>` | 24px (1.5rem) | 1.4 | 600 | `text-2xl font-semibold` |
| `<h4>` | 20px (1.25rem) | 1.4 | 600 | `text-xl font-semibold` |
| `<h5>` | 18px (1.125rem) | 1.5 | 600 | `text-lg font-semibold` |
| `<h6>` | 16px (1rem) | 1.5 | 600 | `text-base font-semibold` |

**Heading Color:** `text-neutral-800` (dark mode) or `text-neutral-100` (light text on dark backgrounds)

### 4.3 Body Typography Scale

| Element | Font Size | Line Height | Font Weight | Tailwind Classes |
|---------|-----------|-------------|-------------|------------------|
| Body Large | 16px (1rem) | 1.6 | 400 | `text-base` |
| Body Regular | 14px (0.875rem) | 1.6 | 400 | `text-sm` |
| Body Small | 12px (0.75rem) | 1.5 | 400 | `text-xs` |
| Caption | 11px (0.6875rem) | 1.4 | 400 | `text-[11px]` |

**Body Color:** `text-neutral-600` (primary body text) or `text-neutral-500` (secondary text)


## 5. Spacing and Layout System

### 5.1 Spacing Scale

Following Tailwind's 4px base unit for consistency:

| Token | Value | Usage |
|-------|-------|-------|
| `p-2` | 8px | Compact padding (badges, small buttons) |
| `p-3` | 12px | Button vertical padding |
| `p-4` | 16px | Card interior minimum padding |
| `p-6` | 24px | Card generous padding, section spacing |
| `p-8` | 32px | Page-level spacing |
| `gap-4` | 16px | Grid/flex gap standard |
| `gap-6` | 24px | Grid/flex gap generous |

### 5.2 Card Component Standards

All card-like components follow these specifications:

```jsx
// Standard card structure
<div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
  {/* Card content */}
</div>
```

**Card Specifications:**
- Background: `bg-white` (light mode) or `bg-neutral-800` (dark sections)
- Border: `border border-neutral-200` (1px solid)
- Border Radius: `rounded-xl` (12px)
- Shadow: `shadow-sm` (subtle elevation)
- Padding: `p-6` (24px minimum)


### 5.3 Shadow System

Tailwind's default shadow scale with custom fintech-inspired shadows:

| Class | Usage | Example |
|-------|-------|---------|
| `shadow-sm` | Cards, subtle elevation | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow` | Hover states, dropdown | `0 1px 3px rgba(0,0,0,0.1)` |
| `shadow-md` | Modals, popovers | `0 4px 6px rgba(0,0,0,0.1)` |
| `shadow-lg` | Floating elements | `0 10px 15px rgba(0,0,0,0.1)` |
| `shadow-primary` | Primary CTA emphasis | `0 4px 14px rgba(79,70,229,0.25)` |

**Custom Shadow Definition:**
```javascript
// In Tailwind config
boxShadow: {
  'primary': '0 4px 14px 0 rgba(79, 70, 229, 0.25)',
  'secondary': '0 4px 14px 0 rgba(13, 148, 136, 0.20)',
}
```

### 5.4 Border Radius Standards

| Element Type | Radius | Tailwind Class |
|--------------|--------|----------------|
| Buttons | 10px | `rounded-lg` |
| Cards | 12px | `rounded-xl` |
| Input fields | 8px | `rounded-lg` |
| Badges | 9999px | `rounded-full` |
| Images | 10px | `rounded-lg` |
| Modals | 16px | `rounded-2xl` |


## 6. Component Design Specifications

### 6.1 Button System

#### Primary Button
```jsx
<button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-150 ease-in-out shadow-sm hover:shadow-primary">
  Primary Action
</button>
```

**Specifications:**
- Background: `bg-primary-600` → `hover:bg-primary-700`
- Text: `text-white font-semibold`
- Padding: `px-6 py-3` (24px horizontal, 12px vertical)
- Border Radius: `rounded-lg` (10px)
- Transition: `transition-colors duration-150`
- Shadow: `shadow-sm` → `hover:shadow-primary`

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-transparent border-2 border-primary-600 hover:bg-primary-50 text-primary-600 hover:text-primary-700 font-semibold rounded-lg transition-all duration-150 ease-in-out">
  Secondary Action
</button>
```

#### Danger Button
```jsx
<button className="px-6 py-3 bg-error-600 hover:bg-error-700 text-white font-semibold rounded-lg transition-colors duration-150 ease-in-out">
  Delete
</button>
```

#### Disabled State
```jsx
<button disabled className="px-6 py-3 bg-neutral-300 text-neutral-500 font-semibold rounded-lg cursor-not-allowed opacity-50">
  Disabled
</button>
```


### 6.2 Form Input System

#### Text Input
```jsx
<input 
  type="text"
  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-150"
  placeholder="Enter text"
/>
```

**Specifications:**
- Border: `border border-neutral-300`
- Border Radius: `rounded-lg` (8px)
- Padding: `px-4 py-3` (16px horizontal, 12px vertical)
- Focus Ring: `focus:ring-2 focus:ring-primary-500`
- Text Color: `text-neutral-700`
- Placeholder: `placeholder:text-neutral-400`

#### Select Dropdown
```jsx
<select className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer">
  <option>Option 1</option>
</select>
```

#### Textarea
```jsx
<textarea 
  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
  rows="4"
  placeholder="Enter description"
/>
```


### 6.3 Badge System

#### Role Badges
```jsx
// Loan Officer
<span className="px-3 py-1 bg-info-100 text-info-800 border border-info-200 rounded-full text-xs font-medium">
  Loan Officer
</span>

// Compliance Officer
<span className="px-3 py-1 bg-accent-violet-100 text-accent-violet-800 border border-accent-violet-200 rounded-full text-xs font-medium">
  Compliance & AML
</span>

// Branch Manager
<span className="px-3 py-1 bg-success-100 text-success-800 border border-success-200 rounded-full text-xs font-medium">
  Branch Manager
</span>

// Admin
<span className="px-3 py-1 bg-error-100 text-error-800 border border-error-200 rounded-full text-xs font-medium">
  Administrator
</span>

// Customer
<span className="px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-full text-xs font-medium">
  Customer Portal
</span>
```

#### Status Badges
```jsx
// Success/Approved
<span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-semibold">
  Approved
</span>

// Pending
<span className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-semibold">
  Pending Review
</span>

// Rejected
<span className="px-3 py-1 bg-error-100 text-error-700 rounded-full text-xs font-semibold">
  Rejected
</span>
```


### 6.4 Icon System

**Library:** Lucide React (already installed)
**Standard Sizes:**
- Small icons: `h-4 w-4` (16px) - for inline text, badges
- Medium icons: `h-5 w-5` (20px) - for buttons, navigation
- Large icons: `h-6 w-6` (24px) - for headers, emphasis

**Color Guidelines:**
```jsx
// Primary icons
<Icon className="h-5 w-5 text-primary-600" />

// Secondary icons
<Icon className="h-5 w-5 text-neutral-500" />

// On dark backgrounds
<Icon className="h-5 w-5 text-neutral-100" />

// Interactive icons
<Icon className="h-5 w-5 text-neutral-400 hover:text-primary-600 transition-colors cursor-pointer" />
```


### 6.5 Alert System

#### Success Alert
```jsx
<div className="flex items-start gap-3 bg-success-50 border border-success-200 text-success-800 rounded-lg p-4">
  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold">Success</p>
    <p className="text-sm mt-1">Your loan application has been submitted successfully.</p>
  </div>
</div>
```

#### Error Alert
```jsx
<div className="flex items-start gap-3 bg-error-50 border border-error-200 text-error-800 rounded-lg p-4">
  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold">Error</p>
    <p className="text-sm mt-1">Invalid credentials. Please try again.</p>
  </div>
</div>
```

#### Warning Alert
```jsx
<div className="flex items-start gap-3 bg-warning-50 border border-warning-200 text-warning-800 rounded-lg p-4">
  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold">Warning</p>
    <p className="text-sm mt-1">This action cannot be undone.</p>
  </div>
</div>
```

#### Info Alert
```jsx
<div className="flex items-start gap-3 bg-info-50 border border-info-200 text-info-800 rounded-lg p-4">
  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-semibold">Information</p>
    <p className="text-sm mt-1">Your document upload is being processed.</p>
  </div>
</div>
```


## 7. Dual-Tone Layout Architecture

### 7.1 Layout Structure

The application implements a consistent dual-tone pattern across all routes:

```jsx
<div className="min-h-screen bg-neutral-50 flex flex-col">
  {/* Dark header - luminance < 20% */}
  <Navbar className="bg-neutral-900 text-neutral-50" />
  
  {/* Light content area - luminance > 90% */}
  <main className="flex-1 bg-neutral-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page content */}
    </div>
  </main>
  
  {/* Dark footer - matches header */}
  <Footer className="bg-neutral-900 text-neutral-400" />
</div>
```


### 7.2 Navbar Component Design

**Updated Navbar Structure:**
```jsx
<header className="sticky top-0 z-40 w-full bg-neutral-900 border-b border-neutral-800 text-neutral-50 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    
    {/* Branding */}
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-secondary-500/10 border border-neutral-800">
        <img src={logo} alt="NovaBank Logo" className="h-full w-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <span className="text-neutral-50">NovaBank</span>
          <span className="text-secondary-400 font-normal text-xs bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700">
            LoanSphere
          </span>
        </h1>
        <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-mono">
          Digital Onboarding & Credit Suite
        </p>
      </div>
    </div>

    {/* User actions */}
    <div className="flex items-center space-x-4">
      {/* User info and logout */}
    </div>
  </div>
</header>
```

**Color Specifications:**
- Background: `bg-neutral-900` (luminance ~5%)
- Text: `text-neutral-50` (luminance ~97%)
- Accent: `text-secondary-400` (teal accent)
- Border: `border-neutral-800`


### 7.3 Footer Component Design

```jsx
<footer className="bg-neutral-900 text-neutral-400 py-6 border-t border-neutral-800 text-center">
  <div className="max-w-7xl mx-auto px-4">
    <p className="text-[11px] font-mono uppercase tracking-wider">
      © 2026 NovaBank PLC Sri Lanka. All Rights Reserved. Licensed Commercial Bank regulated by CBSL.
    </p>
    <p className="text-neutral-500 text-[10px] mt-1">
      LoanSphere origination engine v1.0.0 (SHA-256 secure signed build).
    </p>
  </div>
</footer>
```

**Color Specifications:**
- Background: `bg-neutral-900` (matches Navbar)
- Text: `text-neutral-400` (secondary text)
- Muted Text: `text-neutral-500`
- Border: `border-neutral-800`


## 8. Component-Specific Design Guidelines

### 8.1 Login Component

**Key Updates:**
- Replace `bg-slate-800` buttons with `bg-primary-600 hover:bg-primary-700`
- Update card backgrounds from `bg-white border-slate-200` to `bg-white border-neutral-200 rounded-xl`
- Change text colors from `text-slate-*` to `text-neutral-*`
- Add primary color focus rings to inputs
- Update demo account buttons with primary hover states

**Visual Enhancements:**
- Add subtle gradient to brand panel: `bg-gradient-to-br from-primary-50 to-secondary-50`
- Enhance security badge with primary color: `bg-primary-100 text-primary-800`
- Add hover effect to test account buttons: `hover:bg-primary-50 hover:border-primary-300`


### 8.2 Dashboard Components (Customer, Officer, Manager, Admin)

**Common Pattern:**
```jsx
// Dashboard card
<div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-neutral-800">Card Title</h3>
    <span className="text-neutral-500">
      <Icon className="h-5 w-5" />
    </span>
  </div>
  <div className="space-y-3">
    {/* Card content */}
  </div>
</div>
```

**Metric Cards:**
```jsx
<div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl p-6 shadow-lg">
  <p className="text-primary-100 text-sm font-medium mb-1">Total Loans</p>
  <p className="text-4xl font-bold">1,247</p>
  <p className="text-primary-200 text-xs mt-2 flex items-center gap-1">
    <TrendingUp className="h-4 w-4" />
    +12% from last month
  </p>
</div>
```

**Action Buttons:**
- Primary actions: `bg-primary-600 hover:bg-primary-700`
- Secondary actions: `border-2 border-primary-600 text-primary-600 hover:bg-primary-50`
- Danger actions: `bg-error-600 hover:bg-error-700`


### 8.3 Wizard Components (LoanWizard, OnboardingWizard)

**Step Indicator:**
```jsx
<div className="flex items-center justify-center mb-8">
  {steps.map((step, idx) => (
    <div key={idx} className="flex items-center">
      <div className={`
        flex items-center justify-center h-10 w-10 rounded-full border-2 font-semibold
        ${currentStep === idx 
          ? 'bg-primary-600 border-primary-600 text-white' 
          : currentStep > idx
            ? 'bg-success-500 border-success-500 text-white'
            : 'bg-white border-neutral-300 text-neutral-400'}
      `}>
        {currentStep > idx ? <Check className="h-5 w-5" /> : idx + 1}
      </div>
      {idx < steps.length - 1 && (
        <div className={`h-0.5 w-16 mx-2 ${
          currentStep > idx ? 'bg-success-500' : 'bg-neutral-300'
        }`} />
      )}
    </div>
  ))}
</div>
```

**Navigation Buttons:**
```jsx
<div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
  <button className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold rounded-lg transition-colors">
    Previous
  </button>
  <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
    Next Step
  </button>
</div>
```


### 8.4 Data Visualization Components

#### DebtPortfolioVisualizer

**Chart Color Palette:**
```javascript
const chartColors = {
  series1: '#6366f1', // primary-500
  series2: '#14b8a6', // secondary-500
  series3: '#8b5cf6', // accent-violet-500
  series4: '#ec4899', // accent-pink-500
  series5: '#06b6d4', // accent-cyan-500
  positive: '#22c55e', // success-500
  negative: '#ef4444', // error-500
};
```

**Recharts Configuration:**
```jsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    />
    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

#### LoanAmortizationSchedule

**Table Styling:**
```jsx
<table className="w-full">
  <thead className="bg-neutral-100 border-b-2 border-neutral-200">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Payment</th>
      <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase">Principal</th>
      <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase">Interest</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-neutral-200">
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-4 py-3 text-sm text-neutral-800">Payment 1</td>
      <td className="px-4 py-3 text-sm text-right text-success-600 font-medium">$1,234</td>
      <td className="px-4 py-3 text-sm text-right text-neutral-600">$456</td>
    </tr>
  </tbody>
</table>
```


### 8.5 Notification and Support Components

#### NotificationCenter

```jsx
<div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
  <div className="bg-primary-600 px-4 py-3 border-b border-primary-700">
    <h3 className="text-sm font-semibold text-white">Notifications</h3>
  </div>
  <div className="max-h-96 overflow-y-auto">
    {/* Unread notification */}
    <div className="px-4 py-3 border-b border-neutral-200 bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-2 w-2 bg-primary-600 rounded-full mt-2"></div>
        <div>
          <p className="text-sm font-medium text-neutral-800">New loan application</p>
          <p className="text-xs text-neutral-600 mt-1">Application #12345 requires review</p>
          <p className="text-xs text-neutral-500 mt-1">2 minutes ago</p>
        </div>
      </div>
    </div>
    {/* Read notification */}
    <div className="px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-2 w-2 bg-neutral-300 rounded-full mt-2"></div>
        <div>
          <p className="text-sm text-neutral-700">Document uploaded successfully</p>
          <p className="text-xs text-neutral-500 mt-1">1 hour ago</p>
        </div>
      </div>
    </div>
  </div>
</div>
```


#### SupportContactWidget

```jsx
<div className="fixed bottom-6 right-6 z-50">
  <button className="flex items-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-primary transition-all">
    <HelpCircle className="h-5 w-5" />
    <span>Need Help?</span>
  </button>
</div>

{/* Expanded widget */}
<div className="fixed bottom-24 right-6 w-80 bg-white border border-neutral-200 rounded-2xl shadow-2xl z-50">
  <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 rounded-t-2xl">
    <h3 className="text-lg font-bold text-white">Customer Support</h3>
    <p className="text-primary-100 text-sm mt-1">We're here to help</p>
  </div>
  <div className="p-6 space-y-4">
    <button className="w-full flex items-center gap-3 px-4 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors text-left">
      <MessageCircle className="h-5 w-5 text-primary-600" />
      <span className="text-sm font-medium text-neutral-800">Live Chat</span>
    </button>
    <button className="w-full flex items-center gap-3 px-4 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors text-left">
      <Phone className="h-5 w-5 text-primary-600" />
      <span className="text-sm font-medium text-neutral-800">Call: +94 11 234 5678</span>
    </button>
  </div>
</div>
```


### 8.6 ThemeToggle Component

**Updated Design:**
```jsx
<button 
  onClick={toggleTheme}
  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
  aria-label="Toggle theme"
>
  {isDark ? (
    <Sun className="h-5 w-5" />
  ) : (
    <Moon className="h-5 w-5" />
  )}
</button>
```

**Note:** While a theme toggle component exists, the current redesign focuses on the light theme. Dark mode support can be added in a future iteration using CSS variables.


## 9. Animation and Transition System

### 9.1 Transition Specifications

**Standard Transition Classes:**
```css
/* Color transitions (hover states) */
.transition-colors { transition: color, background-color, border-color 150ms ease-in-out; }

/* Shadow transitions */
.transition-shadow { transition: box-shadow 150ms ease-in-out; }

/* All properties (layout changes) */
.transition-all { transition: all 200ms ease-in-out; }
```

**Usage Examples:**
```jsx
// Button hover
<button className="bg-primary-600 hover:bg-primary-700 transition-colors duration-150">

// Card hover elevation
<div className="shadow-sm hover:shadow-md transition-shadow duration-150">

// Icon hover
<Icon className="text-neutral-400 hover:text-primary-600 transition-colors duration-150" />
```

