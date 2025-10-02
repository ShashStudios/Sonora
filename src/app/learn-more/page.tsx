import Link from "next/link";

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Learn More</h1>
        <p className="text-gray-700 text-center mt-4 max-w-3xl mx-auto">
          Bridge is the first AI-native marketplace. Discover, compare, and deploy AI services in minutes.
          We help buyers evaluate vendors with real signal and help sellers reach the right customers.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Discover Vendors</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Browse curated AI tools across categories with transparent info and live comparisons.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Compare Easily</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Shortlist and compare features, pricing, and fit with clean, structured views.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Deploy Fast</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Move from discovery to adoption quickly with streamlined vendor outreach.
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/market"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-11 px-6"
          >
            Become a Seller
          </Link>
        </div>
      </div>
    </div>
  );
}
