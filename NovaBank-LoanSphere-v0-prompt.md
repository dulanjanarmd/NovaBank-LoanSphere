# v0 Prompt — NovaBank-LoanSphere Frontend

Copy everything in the code block below and paste it into a new v0.dev chat. It's written as a single master prompt; v0 works best with one clear, detailed brief rather than the raw SRS, so this translates the SRS into UI/UX instructions, page list, and component specs.

---

```
Build the frontend for "NovaBank-LoanSphere" — a Digital Loan Origination and
Account Opening System for a Sri Lankan bank. This is a UI-only build: use
realistic mock data and local component state (no real backend calls). Stack:
React + Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui components,
lucide-react icons, recharts for charts. Mobile-first, fully responsive,
WCAG 2.1 AA accessible.

DESIGN DIRECTION
- Tone: trustworthy, modern digital-bank aesthetic — not generic SaaS. Think
  Wise/Revolut-level polish applied to a conservative banking context.
- Primary color: deep navy blue (#1F3864) with a bright accent blue (#2E74B5)
  for CTAs and active states. Neutral grays for backgrounds/text. Use a single
  success green and warning amber, sparingly, for status only.
- Typography: clean sans-serif (Inter or similar), clear hierarchy, generous
  whitespace. Avoid dense enterprise-dashboard clutter on customer-facing
  screens; staff screens can be denser (data-table heavy).
- Use card-based layouts, subtle shadows, rounded corners (not overly
  playful — this is a bank).
- Every screen needs a clear "you are here" indicator (breadcrumb, stepper,
  or sidebar highlight).

INFORMATION ARCHITECTURE — build these two portals as separate route groups:

1) CUSTOMER PORTAL (public-facing, mobile-first)
   - Landing page: hero explaining digital account opening + loan products
     (Personal, Home, Vehicle, SME), trust signals (CBSL-compliant, secure,
     bank branding), CTA buttons "Open an Account" / "Apply for a Loan".
   - Register / Login: NIC + mobile + email fields, OTP verification step
     (mock 6-digit input UI), password fields, forgot-password flow.
   - Account Opening Wizard (multi-step, progress stepper at top):
     Step 1 Personal Details → Step 2 e-KYC (NIC front/back upload dropzones,
     webcam-style selfie capture mock with liveness prompt text, OCR-extracted
     fields shown as editable/confirmable) → Step 3 Product Selection (cards
     for savings account types) → Step 4 Terms & Consent (scrollable T&C box,
     PDPA consent checkbox) → Step 5 Review & Submit (summary, edit links) →
     Confirmation screen with generated reference number (format
     NBLS-DAO-YYYYMMDD-XXXXX).
   - Loan Application Wizard: loan-type selector (4 illustrated cards:
     Personal, Home, Vehicle, SME) → dynamic multi-step form that changes
     fields based on type (income/employment for Personal; property
     value/location for Home; vehicle make/model/dealer for Vehicle;
     business registration/turnover for SME) → live indicative EMI calculator
     widget (amount/tenure/rate sliders, updates monthly installment in
     real time) → dynamic document checklist (checkboxes/upload slots that
     change per loan type) → Review & Submit → Confirmation with reference
     number (NBLS-LN-[TYPE]-YYYYMMDD-XXXXX).
   - Application Status Tracker: timeline/stepper UI showing
     Submitted → Under Review → Credit Assessment → Approved →
     Signed → Disbursed, with current stage highlighted, mock dates,
     and a "documents requested" alert state variant.
   - Document Center: list of uploaded documents with status badges
     (Not Uploaded / Uploaded / Verified / Rejected), re-upload action.
   - e-Signature screen: agreement preview (mock PDF viewer panel), OTP
     confirmation modal, "Sign & Accept" button, signed confirmation state.
   - Notifications inbox: list of milestone notifications with read/unread
     state, icons per type (approval, document request, disbursement).
   - Customer dashboard/home (post-login): summary cards for active
     applications + accounts, quick actions to start new applications.

2) STAFF PORTAL (internal, sidebar-nav layout, role-based views)
   Build a shared shell: left sidebar nav (collapsible on mobile), top bar
   with user role badge + notifications bell + logout. Sidebar items adapt
   per role:
   - Loan Officer: Application Queue (data table: ref, customer, type,
     amount, status, SLA countdown, filters), Applicant 360° View (tabs:
     Personal Info / KYC / Documents / Credit Assessment), Credit Dashboard
     (score gauge, DTI/LTV bars, CRIB summary card, KYC risk badge),
     Decision panel (Approve / Reject / Conditional / Return-for-Info with
     required comment field).
   - Compliance/AML Officer: Compliance Queue (flagged/high-risk cases
     table), Case Detail view (screening hit details, source-of-funds,
     risk tier badge, decision + mandatory justification textarea).
   - Branch Manager: Approval Queue (within authority limit), Branch
     Pipeline Analytics dashboard (charts: applications by status, TAT
     trend line, approval/decline rate by product — use recharts).
   - Admin: Product Configuration (table + edit drawer for loan/account
     products — rates, fees, min/max, tenure), User & Role Management
     (table with role dropdown), Workflow Parameters (threshold sliders/
     inputs for approval limits, SLA days, score bands), System Health
     (integration status cards for CBS/CRIB/e-KYC/SMS/Email with
     green/amber/red indicators), Audit Log viewer (filterable table,
     export button).
   - Shared: Reporting & Analytics page with KPI cards (applications this
     month, approval rate, avg TAT, disbursed value) plus 2-3 charts.

COMPONENT / INTERACTION NOTES
- Use a persistent multi-step wizard component (stepper + progress bar)
  shared across account opening and loan application flows.
- All data tables: sortable columns, status badges with color coding,
  pagination, search/filter bar.
- Use skeleton loaders for any async-feeling transitions (e.g., "verifying
  documents", "calculating credit score").
- Status badge color convention: Draft=gray, Submitted=blue,
  Under Review=amber, Approved=green, Rejected=red, Disbursed=teal.
- Include a role switcher in the staff portal top bar (for demo purposes)
  so all four staff views are easy to preview without real auth.
- Populate every table/list/dashboard with realistic mock Sri Lankan
  banking data (Sinhala/English names, LKR currency formatting, NIC-style
  IDs) — no lorem ipsum.

Build this as a navigable multi-page app with working client-side routing
between all listed screens, not a single static mockup.
```

---

**A few practical tips before you paste this in:**

- v0 tends to do better output when it can build incrementally rather than everything at once. If the full prompt produces something shallow, split it into two follow-up prompts: (1) the **Customer Portal** block, get that solid first, then (2) the **Staff Portal** block referencing "match the design system from the customer portal."
- Since this is a portfolio piece, after the first generation you can ask v0 targeted follow-ups like *"add the EMI calculator with live slider updates to the loan wizard"* or *"make the credit dashboard use a radial gauge for the score"* rather than re-running the whole prompt.
- v0 won't implement the actual Spring Boot/JWT/MySQL backend from the SRS — this prompt is scoped intentionally to UI-only with mock data, matching how v0 is meant to be used. When you're ready to wire it to your real Spring Boot APIs, that's a separate integration step.
