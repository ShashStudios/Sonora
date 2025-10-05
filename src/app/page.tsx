import Image from "next/image";
import Link from "next/link";
// removed unused imports

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

      {/* Floating Navigation Bar */}
      <nav className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 bg-white rounded-full px-8 py-3 shadow-lg border border-gray-100 w-[90%] max-w-6xl">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-black">
              SONORA
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
          </div>

          {/* Get Started Button */}
          <Link
            href="/market"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </Link>
        </div>
      </nav>
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center relative z-10">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-black text-center max-w-4xl mt-32 whitespace-nowrap">
          The First AI Native Marketplace
        </h1>

        {/* Sub-headline */}
        <p className="text-xl text-black text-center mb-6 max-w-2xl -mt-8">
          Powering the AI economy by connecting creators, developers, and businesses. All in one place.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row justify-center">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/shop"
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
            Start Shopping
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#7ed957] text-black gap-2 hover:bg-[#6bc84a] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/learn-more"
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
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
            Become a Seller
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center relative z-10">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://x.com/ShashPanigrahi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Shash on X"
        >
          <Image
            aria-hidden
            src="/x.svg"
            alt="X logo"
            width={16}
            height={16}
          />
          Shash
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://x.com/EliotShytaj"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Eliot on X"
        >
          <Image
            aria-hidden
            src="/x.svg"
            alt="X logo"
            width={16}
            height={16}
          />
          Eliot
        </a>
      </footer>
    </div>
  );
}
