import Link from "next/link";
import type { BookSummary } from "@/lib/types";

export default function BookCard({ book }: { book: BookSummary }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-parchment-dark bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Color header acting as book cover */}
      <div
        className="flex h-48 items-end p-5"
        style={{
          background: `linear-gradient(135deg, ${book.coverColor}, ${book.coverColor}cc)`,
        }}
      >
        <div>
          <h3 className="font-serif text-xl font-bold leading-tight text-white drop-shadow">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-white/80">{book.author}, {book.year}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-light">
          {book.synopsis}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {book.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-ink-muted"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
          <span>{book.chapterCount} chapters</span>
          <span className="text-accent transition group-hover:translate-x-1">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
