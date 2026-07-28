# Mock CBT — SBI PO Preliminary Online Examination Platform

**Mock CBT** is a production-oriented, mobile-first Computer Based Test (CBT) web application engineered for conducting, monitoring, and analyzing online mock tests for **SBI PO Preliminary** exam preparation.

---

## Key Features

- **Strict SBI PO Preliminary Pattern**:
  - Total Questions: 100 MCQs | Total Duration: 60 Minutes | Total Marks: 100 | Negative Marking: -0.25 Marks
  - Section Breakdown:
    1. **English Language**: 30 questions, 20 minutes
    2. **Quantitative Aptitude**: 35 questions, 20 minutes
    3. **Reasoning Ability**: 35 questions, 20 minutes
- **Enforced Single-Confirmation Lock-Once Answer Rule**:
  - Once a candidate confirms an option choice, it is locked permanently across the UI, API, repository, and database Row Level Security (RLS) layers to prevent unfair reattempt behavior.
- **Dual-Mode PDF Source Ingestion**:
  - Ingests memory-based question paper PDFs directly from a dedicated local workspace folder (`/source-files/pdfs`) or via browser file upload.
  - Maintains complete source traceability linked to source file IDs and local file paths.
- **Full Admin Product Layer**:
  - [/admin/dashboard](file:///e:/Vardhan%20Freelance/SBI%20CBT%20mock%20test/app/admin/dashboard/page.tsx): Comprehensive operational metrics, source imports, and candidate attempt monitors.
  - [/admin/sources](file:///e:/Vardhan%20Freelance/SBI%20CBT%20mock%20test/app/admin/sources/page.tsx): PDF source tracking and status verification (`draft`, `parsed`, `under review`, `verified`, `published`, `failed`).
  - [/admin/questions](file:///e:/Vardhan%20Freelance/SBI%20CBT%20mock%20test/app/admin/questions/page.tsx): Central question bank management with search, subject/difficulty/verification filters, bulk verification, and long-format editor for Reading Comprehension passages, Data Interpretation table datasets, and floor/box puzzles.
  - [/admin/tests](file:///e:/Vardhan%20Freelance/SBI%20CBT%20mock%20test/app/admin/tests/page.tsx): Test builder with section count validation (30 English, 35 Quant, 35 Reasoning) and instant publish toggles.
  - [/admin/candidates](file:///e:/Vardhan%20Freelance/SBI%20CBT%20mock%20test/app/admin/candidates/page.tsx): Candidate directory with search, attempt scorecards, subject weakness areas, and growth analytics.
- **Candidate Product Layer**:
  - Candidate Home Dashboard, published test catalog, test instruction page with declaration agreement, live CBT attempt engine with 20-min section timers, detailed scorecards with question-by-question solution explanations, performance tracking, and candidate profile.
- **Security & Legal Compliance**:
  - Role-based authorization middleware ([middleware.ts](file:///e:/Vardhan%20Freelance/SBI%20CBT%20mock%20test/middleware.ts)), strict path traversal security on file routes, Privacy Policy (`/privacy`), Terms & Conditions (`/terms`), Cookie Notice Policy (`/cookies`), and interactive Cookie Banner.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Parser**: `pdf-parse`
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)

---

## Project Structure

```text
├── app/
│   ├── admin/                  # Admin Management & Monitoring Routes
│   │   ├── dashboard/          # Operations Overview Dashboard
│   │   ├── sources/            # Source Ingestion & Review Pages
│   │   ├── questions/          # Question Bank & Long-Format Editor
│   │   ├── tests/              # Test Builder & Pattern Validation
│   │   └── candidates/         # Candidate Directory & Scorecards
│   ├── api/
│   │   ├── attempts/lock/      # Answer Lock API Route
│   │   ├── sources/local/      # Local Workspace Folder Scanner API
│   │   └── sources/upload/     # Browser Upload API Route
│   ├── attempts/[id]/          # Live CBT Exam Engine Route
│   ├── dashboard/              # Candidate Home Dashboard
│   ├── tests/                  # Published Tests Catalog & Instructions
│   ├── results/                # Scorecard History & Detailed Analysis
│   ├── performance/            # Candidate Growth Analytics
│   ├── profile/                # Candidate Profile
│   ├── cookies/                # Cookie Notice Policy Page
│   ├── privacy/                # Privacy Policy Page
│   └── terms/                  # Terms & Conditions Page
├── components/
│   ├── admin/                  # Admin UI & Dual-Mode PDF Uploader
│   ├── layout/                 # Cookie Banner & Global Navigation
│   ├── test/                   # Live CBT Exam Engine & Question Palette
│   └── ui/                     # Shared UI Components
├── lib/
│   ├── pdf/                    # Multi-Format Question Parser Engine
│   ├── repository/             # Data Provider & Lock Persistence Layer
│   ├── scoring/                # SBI PO Preliminary Scoring Engine
│   └── storage/                # Question Bank Seed Data & Storage Keys
├── scripts/
│   └── test-engine-audit.ts    # Automated Engine Integrity Test Suite
├── source-files/pdfs/          # Local Workspace PDF Ingestion Directory
├── sql/
│   └── schema.sql              # Supabase Postgres Database Schema & RLS Policies
├── .env.example                # Environment Variable Template
├── middleware.ts               # Role Authorization Security Middleware
└── README.md
```

---

## Local Setup Instructions

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone <repository-url>
   cd "SBI CBT mock test"
   npm install
   ```

2. **Environment Configuration**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Execute Automated Engine Audit**:
   ```bash
   npx tsx scripts/test-engine-audit.ts
   ```

5. **Run Production Build Verification**:
   ```bash
   npm run build
   ```

---

## PDF Source Ingestion Modes

- **Development Local Workspace Mode**:
  - Place memory-based paper PDFs or `.txt` files directly into `/source-files/pdfs/`.
  - Open `/admin/sources`, select the **Workspace Directory** tab, scan files, and trigger automated question parsing.
- **Production Upload Mode**:
  - If deployed on serverless hosting platforms (e.g. Vercel), switch to **Upload / Paste Mode** on `/admin/sources` to upload PDFs directly via browser multipart requests.

---

## Deployment Note (Vercel / Next.js Host)

1. Import repository into **Vercel**.
2. Add environment variables from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Deploy! All routes compile statically/dynamically with 0 build errors.
