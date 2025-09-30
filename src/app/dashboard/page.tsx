const lenders = [
  {
    name: "Bank of America",
    description: "Mortgage • Small Business • Commercial",
    updated: "Updated 2 days ago",
  },
  {
    name: "JPMorgan Chase",
    description: "Corporate Banking • Asset Management",
    updated: "Updated yesterday",
  },
  {
    name: "Citi",
    description: "Consumer Lending • Treasury Services",
    updated: "Updated 4 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-white via-white to-white p-10 dark:from-black dark:via-neutral-950 dark:to-neutral-950">
      <header className="flex w-full max-w-3xl flex-col items-start gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Client Portal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quick snapshot of the financial institutions your clients interact with.
        </p>
      </header>

      <section className="grid w-full max-w-3xl gap-4">
        {lenders.map((lender) => (
          <div
            key={lender.name}
            className="flex flex-col gap-2 rounded-xl border border-black/5 bg-white/90 p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{lender.name}</span>
              <span className="text-xs uppercase tracking-wide text-blue-600">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {lender.description}
            </p>
            <span className="text-xs text-gray-400">{lender.updated}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
