import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-parchment-dark bg-parchment/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-accent">
            Lit<span className="text-ink">Pulse</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-ink-muted">
          <Link href="/" className="transition hover:text-ink">
            Library
          </Link>
          <span className="hidden text-xs text-ink-muted/60 sm:inline">
            Interactive Literary Analysis
          </span>
        </div>
      </div>
    </nav>
  );
}
