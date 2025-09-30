▌ You are building locally in `~/projects/hotel-pro-forma-builder`
▌ (React + Tailwind frontend; lightweight Node.js/JS financial logic;
▌ export features supported; deployable to Vercel/Netlify).
▌
▌ ## Mission
▌ 1) Provide hotel developers with an **interactive MVP** to generate
▌    a simple 5-year pro forma forecast.
▌ 2) Support **intuitive inputs** (sliders + numeric fields) that
▌    update outputs in real time.
▌ 3) Automatically calculate and present **key metrics, revenue,
▌    expenses, and NOI** with charts/tables.
▌ 4) Provide **export functionality** (CSV/PDF) for offline use.
▌
▌ ## Context & reality
▌ - This is a **Minimum Viable Product (MVP)**: focus on usability,
▌   speed, and clarity, not full financial depth.
▌ - Audience: hotel owners, developers, and feasibility analysts
▌   needing a quick way to stress-test assumptions.
▌ - Constraints:
▌   - 5-year horizon only (future version may allow 10+).
▌   - Expense categories are **pre-defined**, not user-customizable.
▌   - Export is functional but minimal (CSV polished, PDF basic).
▌ - AI tools permitted: Cursor, Windsurf, Bolt, Lovable.dev,
▌   Flutter — max $40 reimbursable spend.
▌
▌ ## Features (MVP)
▌ - **Inputs**:
▌   - Number of Rooms
▌   - Base Occupancy Rate (%)
▌   - Base ADR ($)
▌   - ADR Growth Rate (% slider)
▌   - Occupancy Growth Rate (% slider)
▌   - Expense Growth Rate (%)
▌
▌ - **Outputs**:
▌   - Key Metrics: Occupancy, ADR, RevPAR, Occupied Rooms
▌   - Revenue Summary: Rooms Revenue, Other Revenue, Total Revenue
▌   - Expenses Summary: Payroll, Utilities, Marketing
▌   - NOI + NOI Margin
▌
▌ - **Visualizations**:
▌   - RevPAR & Occupancy trend chart
▌   - Revenue vs. Expense growth chart
▌   - NOI margin chart
▌
▌ - **Export**:
▌   - CSV (ready)
▌   - PDF (basic version)
▌
▌ ## Tech stack
▌ - React + Vite + TailwindCSS
▌ - Recharts (charts/graphs)
▌ - Node.js (calculation helpers; optional headless mode)
▌ - Deployment: Vercel or Netlify
▌ - AI tool support: Cursor (coding/refactor), Bolt (scaffolding)
▌
▌ ## Project structure
▌ ```
▌ hotel-pro-forma/
▌ ├── public/              # static assets
▌ ├── src/
▌ │   ├── components/      # sliders, tables, charts
▌ │   ├── pages/           # main UI
▌ │   ├── utils/           # financial formulas
▌ │   └── App.jsx
▌ ├── package.json
▌ └── README.md
▌ ```
▌
▌ ## Core calculations
▌ - RevPAR = ADR × Occupancy%
▌ - Occupied Rooms = Rooms × Occupancy%
▌ - Rooms Revenue = Occupied Rooms × ADR
▌ - Other Revenue = % of Rooms Revenue (assumption)
▌ - Total Revenue = Rooms Revenue + Other Revenue
▌ - Expenses = Base × (1 + growth)^years
▌ - NOI = Total Revenue – Expenses
▌
▌ ## Install & run
▌ ### Prereqs
▌ - Node.js 18+
▌ - npm or yarn
▌
▌ ### Commands
▌ ```bash
▌ git clone https://github.com/your-username/hotel-pro-forma-builder.git
▌ cd hotel-pro-forma-builder
▌ npm install
▌ npm run dev
▌ ```
▌ Visit → http://localhost:5173/
▌
▌ ## Questions to clarify
▌ - Should we add custom expense/revenue categories (e.g., F&B,
▌   parking)?
▌ - Do users expect sensitivity analysis (e.g., -10% occupancy)?
▌ - Is Excel export required alongside CSV/PDF?
▌
▌ ## Known issues
▌ - 5-year limit (no 10-year support yet)
▌ - Expenses static (not editable)
▌ - Export: PDF lacks polish
▌
▌ ## Future improvements
▌ - Multi-scenario analysis (base/upside/downside)
▌ - Financing module (debt service, equity IRR)
▌ - Customizable expense categories
▌ - Mobile-friendly dashboards
▌ - Polished PDF reporting
▌
▌ ## License
▌ MIT License — free to use and modify.
