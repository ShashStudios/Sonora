import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-white">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, transparent 0%, transparent 15%, rgba(0,0,0,0.03) 25%),
              radial-gradient(circle at 80% 80%, transparent 0%, transparent 20%, rgba(0,0,0,0.02) 35%),
              linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px',
            maskImage: 'radial-gradient(ellipse 120% 100% at 50% 0%, black 0%, black 40%, transparent 70%)'
          }}
        />
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-10">
        <Image
          src="/bridge.png"
          alt="Bridge logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-gray-600 text-sm font-medium text-center sm:text-left">
          Client Portal for Hotel Pro Forma Evaluations
        </p>
        <div className="font-mono text-sm/6 text-center sm:text-left">
          <p className="mb-2 tracking-[-.01em]">&gt; Build professional hotel financial projections</p>
          <p className="mb-2 tracking-[-.01em]">&gt; Real-time calculations and visualizations</p>
          <p className="tracking-[-.01em]">&gt; Export comprehensive reports instantly</p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/forma"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
            Get started
          </Link>
              <Link
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="/learn-more"
              >
                Learn more
              </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center relative z-10">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.bridgemarketplace.com/lender-inquiries"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Lender
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.bridgemarketplace.com/hotel-financing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
          Hospitality
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.bridgemarketplace.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          www.bridgemarketplace.com
        </a>
      </footer>
    </div>
  );
}
