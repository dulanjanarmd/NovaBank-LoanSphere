# Implementation Plan: Frontend Theme Redesign

## Overview

This plan implements a comprehensive visual redesign of the NovaBank LoanSphere frontend, transforming it from traditional slate-based banking aesthetics to a modern fintech visual identity. The implementation covers Tailwind CSS v4 configuration, dual-tone layout architecture, and systematic redesign of all 17 React components (16 components + App.jsx).

The tasks are organized to enable early validation of the theme system before component-level changes, with incremental integration that maintains functionality throughout the redesign process.

## Tasks

- [x] 1. Configure Tailwind CSS v4 theme system
  - [x] 1.1 Update tailwind.config.js with complete color palette
    - Define primary color system (blue-purple spectrum, hue 250°)
    - Define secondary color system (teal complementary)
    - Define three accent color systems (violet, pink, cyan)
    - Define semantic color systems (success, error, warning, info)
    - Define neutral color system with 11 shades
    - Configure Inter font family as primary sans-serif
    - Configure JetBrains Mono as monospace font
    - Add custom shadow definitions (shadow-primary, shadow-secondary)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.3, 6.1, 6.2_

  - [x] 1.2 Update index.html with Google Fonts preconnect and stylesheet links
    - Add preconnect links for fonts.googleapis.com and fonts.gstatic.com
    - Add Inter font link (weights 400, 500, 600, 700)
    - Add JetBrains Mono font link (weights 400, 500)
    - _Requirements: 6.1, 6.4, 6.5_

- [x] 2. Implement dual-tone layout architecture
  - [x] 2.1 Update Navbar component with dark theme
    - Replace slate-900 backgrounds with neutral-900
    - Apply neutral-50 text colors for high contrast
    - Update logo container with neutral-800 border and shadow
    - Style NovaBank branding with neutral-50 text
    - Style LoanSphere badge with secondary-400 accent, neutral-800 background
    - Update subtitle with neutral-400, uppercase, font-mono styling
    - Ensure border-neutral-800 for all dividers
    - Add shadow-lg for depth
    - _Requirements: 2.1, 2.2, 2.6, 3.10, 4.1, 4.2_

  - [x] 2.2 Update App.jsx with dual-tone layout structure
    - Apply bg-neutral-50 to main content wrapper
    - Ensure min-h-screen and flex flex-col structure
    - Add proper padding and max-width constraints to content areas
    - Verify routing maintains layout consistency
    - _Requirements: 2.3, 2.4, 2.6, 9.1, 9.2_

  - [x] 2.3 Add footer component with dark theme (if exists, or document skip)
    - Apply bg-neutral-900 background matching Navbar
    - Use neutral-400 for primary text, neutral-500 for muted text
    - Add border-neutral-800 top border
    - Implement font-mono uppercase styling for legal text
    - _Requirements: 2.5, 2.6, 3.10_

- [-] 3. Checkpoint - Verify theme foundation and layout
  - Ensure Tailwind config compiles without errors
  - Verify fonts load correctly in browser
  - Confirm dual-tone layout renders with correct color contrast
  - Validate Navbar and App.jsx display properly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 4. Redesign authentication components
  - [~] 4.1 Update Login component
    - Replace all slate-* colors with neutral-* equivalents
    - Update primary action buttons to bg-primary-600 hover:bg-primary-700
    - Apply border-neutral-200 rounded-xl to card containers
    - Add focus:ring-2 focus:ring-primary-500 to all inputs
    - Update demo account buttons with hover:bg-primary-50 hover:border-primary-300
    - Apply gradient bg-gradient-to-br from-primary-50 to-secondary-50 to brand panel
    - Update security badge to bg-primary-100 text-primary-800
    - Ensure all text uses neutral-* color scale
    - _Requirements: 1.7, 3.8, 4.1, 4.3, 7.2, 7.3, 7.4, 7.7_

- [ ] 5. Redesign dashboard components (group 1: customer-facing)
  - [~] 5.1 Update DashboardCustomer component
    - Replace slate colors with neutral palette
    - Apply card styling: bg-white border-neutral-200 rounded-xl shadow-sm p-6
    - Add hover:shadow-md transition-shadow to interactive cards
    - Update metric cards with gradient: from-primary-500 to-primary-700
    - Style headings with text-neutral-800 font-semibold
    - Apply primary-600 to primary action buttons
    - Use semantic colors for status indicators (success, warning, error)
    - Ensure all icons use consistent sizing (h-5 w-5)
    - _Requirements: 1.7, 3.3, 4.1, 4.2, 4.4, 4.5, 7.2_

  - [~] 5.2 Update QuickAccountOpen component
    - Apply card-based layout with rounded-xl and shadow-sm
    - Update form inputs with border-neutral-300 rounded-lg
    - Add focus:ring-2 focus:ring-primary-500 to inputs
    - Style submit button with bg-primary-600 hover:bg-primary-700
    - Apply placeholder:text-neutral-400 to all inputs
    - Use text-neutral-700 for input values
    - Ensure 16px minimum padding for form containers
    - _Requirements: 1.7, 3.14, 4.1, 4.4, 7.2, 7.7_

- [ ] 6. Redesign dashboard components (group 2: officer-facing)
  - [~] 6.1 Update OfficerConsole component
    - Apply dual-tone aware styling (works on light bg-neutral-50)
    - Update dashboard cards with border-neutral-200 rounded-xl
    - Style application list items with hover:bg-neutral-50
    - Update status badges with semantic colors and rounded-full
    - Apply primary-600 to action buttons with transitions
    - Use text-neutral-800 for headings, neutral-600 for body
    - Implement consistent spacing with gap-6 for card grids
    - _Requirements: 1.7, 3.12, 4.1, 4.2, 4.4, 7.2_

  - [~] 6.2 Update ComplianceConsole component
    - Apply accent-violet colors for compliance-specific branding
    - Update alert components with semantic color backgrounds
    - Style risk indicators with appropriate warning/error colors
    - Apply card layouts with rounded-xl and shadows
    - Update action buttons with primary and danger variants
    - Use table styling with neutral-100 header backgrounds
    - Ensure compliance badges use accent-violet-100/800 color pair
    - _Requirements: 1.7, 3.2, 4.1, 4.2, 4.4, 7.2_

  - [~] 6.3 Update ManagerDashboard component
    - Apply success-themed metric cards for approved loans
    - Update overview cards with gradient backgrounds
    - Style performance metrics with primary color accents
    - Apply table headers with bg-neutral-100 text-neutral-700
    - Update filter buttons with border-neutral-300 hover:bg-neutral-50
    - Use chart colors from design specification
    - Ensure team member cards have consistent spacing and shadows
    - _Requirements: 1.7, 3.9, 4.1, 4.2, 4.4, 8.4_

- [ ] 7. Redesign administrative components
  - [~] 7.1 Update AdminConsole component
    - Apply error-themed badges for admin-level access indicators
    - Update user management table with neutral-100 headers
    - Style system settings cards with rounded-xl borders
    - Apply danger buttons (bg-error-600) for destructive actions
    - Update configuration forms with focus rings
    - Use monospace font for system IDs and technical values
    - Ensure audit log entries have neutral-50 hover states
    - _Requirements: 1.7, 3.1, 4.1, 4.2, 7.2, 7.4_

- [ ] 8. Redesign wizard and multi-step components
  - [~] 8.1 Update LoanWizard component
    - Implement step indicator with primary-600 active state, success-500 completed state
    - Update step circles: h-10 w-10 rounded-full border-2
    - Style progress connector lines with conditional colors
    - Apply card styling to each step content area
    - Update Previous button: border-neutral-300 hover:bg-neutral-50
    - Update Next button: bg-primary-600 hover:bg-primary-700 shadow-sm
    - Add border-neutral-200 divider between steps and navigation
    - Ensure form inputs have consistent focus ring styling
    - _Requirements: 1.7, 3.7, 4.1, 4.2, 4.3, 7.7_

  - [~] 8.2 Update OnboardingWizard component
    - Apply same step indicator pattern as LoanWizard
    - Update document upload areas with dashed border-neutral-300
    - Style verification status badges with semantic colors
    - Apply gradient to welcome/completion screens
    - Update navigation buttons with consistent primary styling
    - Ensure uploaded file list items have neutral-50 hover state
    - Add success checkmarks with success-500 color
    - _Requirements: 1.7, 3.13, 4.1, 4.2, 4.3, 7.7_

- [ ] 9. Redesign data visualization components
  - [~] 9.1 Update DebtPortfolioVisualizer component
    - Configure Recharts with primary-500 color as primary series
    - Apply secondary-500, accent-violet-500, accent-pink-500, accent-cyan-500 for additional series
    - Update CartesianGrid stroke to neutral-200 (e2e8f0)
    - Style axis ticks with neutral-500 text, fontSize 12
    - Update Tooltip contentStyle: white bg, neutral-200 border, rounded-lg, shadow
    - Apply success-500 for positive values, error-500 for negative values
    - Use rounded bar corners: radius={[8, 8, 0, 0]}
    - Ensure legend uses neutral-700 text
    - _Requirements: 1.7, 3.4, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [~] 9.2 Update LoanAmortizationSchedule component
    - Apply table header styling: bg-neutral-100 border-b-2 border-neutral-200
    - Style header cells: text-neutral-700 font-semibold uppercase text-xs
    - Update body rows with hover:bg-neutral-50 transition-colors
    - Apply divide-y divide-neutral-200 to tbody
    - Use success-600 font-medium for principal amounts
    - Use neutral-600 for interest amounts
    - Style total row with bg-neutral-100 font-bold
    - Ensure proper spacing: px-4 py-3 for all cells
    - _Requirements: 1.7, 3.5, 8.1, 8.2, 8.3, 8.5_

- [ ] 10. Redesign utility and feature components
  - [~] 10.1 Update LoanEligibilityCalculator component
    - Apply card container with rounded-xl shadow-sm p-6
    - Update range sliders with primary-600 accent color
    - Style input fields with focus:ring-primary-500
    - Apply gradient to eligibility result card
    - Update calculate button with bg-primary-600 hover:bg-primary-700
    - Use success-500 for approved results, warning-500 for conditional, error-500 for declined
    - Add icons with consistent h-5 w-5 sizing
    - Ensure result text has neutral-800 color for headings
    - _Requirements: 1.7, 3.6, 4.1, 4.2, 4.4, 7.2, 7.7_

  - [~] 10.2 Update RateFluctuationNotifier component
    - Apply info-50 background for rate update notifications
    - Style rate increase indicators with error-600 and TrendingUp icon
    - Style rate decrease indicators with success-600 and TrendingDown icon
    - Update notification card with border-neutral-200 rounded-xl
    - Apply font-mono to numeric rate values
    - Use neutral-600 for timestamp text
    - Add hover:bg-info-100 transition to interactive notifications
    - _Requirements: 1.7, 3.15, 4.1, 4.5, 8.5_

- [ ] 11. Redesign notification and support components
  - [~] 11.1 Update NotificationCenter component
    - Apply dropdown container: bg-white border-neutral-200 rounded-xl shadow-lg
    - Style header with bg-primary-600 text-white px-4 py-3
    - Update unread notifications with bg-primary-50 and primary-600 dot indicator
    - Style read notifications with neutral-50 hover state and neutral-300 dot
    - Apply text-neutral-800 font-medium for notification titles
    - Use text-neutral-600 for message body, text-neutral-500 for timestamps
    - Add border-b border-neutral-200 between notification items
    - Ensure max-h-96 overflow-y-auto for scrollable list
    - _Requirements: 1.7, 3.11, 4.1, 4.2, 4.3_

  - [~] 11.2 Update SupportContactWidget component
    - Style floating button: bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg
    - Add hover:shadow-primary transition
    - Update expanded widget with rounded-2xl shadow-2xl
    - Apply gradient header: from-primary-600 to-primary-700
    - Style contact option buttons with border-neutral-200 hover:bg-neutral-50
    - Use primary-600 for icons in contact options
    - Apply text-white for header, neutral-800 for buttons
    - Position fixed bottom-6 right-6
    - _Requirements: 1.7, 3.16, 4.1, 4.2, 4.3, 7.1_

  - [~] 11.3 Update ThemeToggle component
    - Apply bg-neutral-800 hover:bg-neutral-700 to toggle button
    - Use text-neutral-300 hover:text-white for icon color
    - Ensure rounded-lg border radius
    - Add transition-colors duration-150
    - Use h-5 w-5 for Sun/Moon icons
    - Apply p-2 padding
    - Note: Focus on light theme styling per design doc
    - _Requirements: 1.7, 3.17, 4.1, 4.3_

- [ ] 12. Final integration and validation
  - [~] 12.1 Perform global color migration verification
    - Search codebase for any remaining slate-* color references
    - Replace any missed slate colors with neutral equivalents per migration map
    - Verify no hard-coded color values exist (search for #-prefixed hex codes)
    - Ensure all components use theme tokens from Tailwind config
    - _Requirements: 1.7, 5.2, 11.4_

  - [~] 12.2 Validate accessibility compliance
    - Test contrast ratios for all text/background combinations
    - Verify focus indicators are visible on all interactive elements
    - Ensure all interactive elements have proper hover states
    - Test keyboard navigation through all components
    - Validate touch target sizes (minimum 44x44px) on mobile viewports
    - _Requirements: 1.6, 6.6, 7.1, 9.4_

  - [ ]* 12.3 Perform cross-browser visual testing
    - Test theme rendering in Chrome, Firefox, Safari, Edge
    - Verify font loading and fallback behavior
    - Test responsive breakpoints (mobile 375px, tablet 768px, desktop 1440px)
    - Validate shadow and gradient rendering across browsers
    - Check transition smoothness and timing
    - _Requirements: 9.1, 9.2, 9.3, 10.1, 10.2_

  - [ ]* 12.4 Validate animation and transition timing
    - Verify hover transitions complete within 150-200ms
    - Test modal/dialog open animations (under 250ms)
    - Ensure ease-in-out timing functions are applied consistently
    - Test with prefers-reduced-motion media query
    - Verify no animations cause layout shift or jank
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [~] 13. Final checkpoint - Complete validation
  - Ensure all 17 components render without console errors
  - Verify routing and navigation maintain layout consistency
  - Confirm all form validation logic still functions correctly
  - Test data visualization components display properly
  - Validate dual-tone layout across all routes
  - Ensure backward compatibility with existing functionality
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional validation tasks that can be skipped for faster delivery
- Each implementation task includes specific requirements references for traceability
- The 17 components include all 16 listed components plus App.jsx for layout structure
- Checkpoints at tasks 3 and 13 ensure incremental validation
- Color migration map from design document guides all slate-to-neutral replacements
- No property-based tests are included as this is a visual redesign without behavioral changes
- Focus remains on visual styling; no changes to component logic, props, or APIs
- Tailwind CSS v4 utility classes are used exclusively; custom CSS is avoided
- The implementation maintains React 19, Vite, and existing tech stack compatibility

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "2.2", "2.3"]
    },
    {
      "id": 2,
      "tasks": ["4.1"]
    },
    {
      "id": 3,
      "tasks": ["5.1", "5.2"]
    },
    {
      "id": 4,
      "tasks": ["6.1", "6.2", "6.3"]
    },
    {
      "id": 5,
      "tasks": ["7.1"]
    },
    {
      "id": 6,
      "tasks": ["8.1", "8.2"]
    },
    {
      "id": 7,
      "tasks": ["9.1", "9.2"]
    },
    {
      "id": 8,
      "tasks": ["10.1", "10.2"]
    },
    {
      "id": 9,
      "tasks": ["11.1", "11.2", "11.3"]
    },
    {
      "id": 10,
      "tasks": ["12.1", "12.2", "12.3", "12.4"]
    }
  ]
}
```
