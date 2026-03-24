import { notFound } from "next/navigation";
import Link from "next/link";
import { getBook, getAllBooks } from "@/lib/books";
import SentimentChart from "@/components/dashboard/SentimentChart";
import CharacterNetwork from "@/components/dashboard/CharacterNetwork";
import ThemeCloud from "@/components/dashboard/ThemeCloud";
import QuoteCarousel from "@/components/dashboard/QuoteCarousel";
import StatCard from "@/components/dashboard/StatCard";

export function generateStaticParams() {
  return getAllBooks().map((b) => ({ slug: b.slug }));
}

export default async function BookDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const avgSentiment =
    book.sentimentArc.reduce((s, p) => s + p.sentiment, 0) /
    book.sentimentArc.length;

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Library
        </Link>
        <span className="mx-2">›</span>
        <span className="text-ink">{book.title}</span>
      </nav>

      {/* Book Header */}
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div
          className="flex h-40 w-28 flex-shrink-0 items-end rounded-lg p-3 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${book.coverColor}, ${book.coverColor}cc)`,
          }}
        >
          <span className="font-serif text-sm font-bold leading-tight text-white drop-shadow">
            {book.title}
          </span>
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
          <p className="mt-1 text-ink-muted">
            {book.author} · {book.year}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-light">
            {book.synopsis}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {book.genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-parchment px-2.5 py-0.5 text-xs text-ink-muted"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Chapters" value={book.chapterCount} />
        <StatCard label="Characters" value={book.characters.length} />
        <StatCard label="Themes" value={book.themes.length} />
        <StatCard
          label="Avg Sentiment"
          value={avgSentiment > 0 ? `+${avgSentiment.toFixed(2)}` : avgSentiment.toFixed(2)}
          sub={avgSentiment > 0.1 ? "Mostly positive" : avgSentiment < -0.1 ? "Mostly dark" : "Mixed"}
        />
      </div>

      {/* Visualizations */}
      <div className="space-y-8">
        <SentimentChart data={book.sentimentArc} />

        <div className="grid gap-8 lg:grid-cols-2">
          <CharacterNetwork
            characters={book.characters}
            relationships={book.relationships}
          />
          <ThemeCloud themes={book.themes} />
        </div>

        <QuoteCarousel quotes={book.quotes} />
      </div>

      {/* Chapter List */}
      <section className="mt-12">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Chapters</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {book.chapters.map((ch) => (
            <Link
              key={ch.number}
              href={`/books/${book.slug}/chapters/${ch.number}`}
              className="group rounded-lg border border-parchment-dark bg-white p-4 transition hover:border-accent/30 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">
                  Chapter {ch.number}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    ch.sentiment > 0.2
                      ? "bg-sentiment-positive"
                      : ch.sentiment < -0.2
                      ? "bg-sentiment-negative"
                      : "bg-sentiment-neutral"
                  }`}
                />
              </div>
              <h3 className="mt-1 text-sm font-medium group-hover:text-accent">
                {ch.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                {ch.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Reading view link */}
      <div className="mt-8 text-center">
        <Link
          href={`/books/${book.slug}/read`}
          className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-light"
        >
          Read with Annotations →
        </Link>
      </div>
    </div>
  );
}
