export default function DashboardPage() {
  const lenders = [
    { name: "Bank of America", description: "Mortgage • Small Business • Commercial", updated: "Updated 2d ago" },
    { name: "Wells Fargo", description: "SBA • CRE • Lines of Credit", updated: "Updated 5d ago" },
    { name: "Chase", description: "Startup • Growth • Enterprise", updated: "Updated 1w ago" },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Lenders</h1>
          <p className="text-gray-600 text-sm">Active institutions and products</p>
        </header>

        <section className="grid w-full max-w-3xl gap-4">
          {lenders.map((lender) => (
            <div
              key={lender.name}
              className="flex flex-col gap-2 rounded-xl border border-black/5 bg-white/90 p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{lender.name}</span>
                <span className="text-xs uppercase tracking-wide text-blue-600">Active</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{lender.description}</p>
              <span className="text-xs text-gray-400">{lender.updated}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
