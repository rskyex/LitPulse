import type { Quote } from "@/lib/types";

export default function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="rounded-xl border border-parchment-dark bg-white p-5">
      <h3 className="mb-4 font-serif text-lg font-semibold">Notable Passages</h3>
      <p className="mb-4 text-xs text-ink-muted">
        Key quotes that reveal character and theme
      </p>
      <div className="space-y-4">
        {quotes.slice(0, 4).map((quote, i) => (
          <blockquote
            key={i}
            className="border-l-3 border-accent/40 pl-4"
          >
            <p className="font-serif text-sm italic leading-relaxed text-ink-light">
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="mt-2 flex items-center justify-between text-xs text-ink-muted">
              <span>
                {quote.character && (
                  <span className="font-medium text-ink">{quote.character} — </span>
                )}
                Chapter {quote.chapter}
              </span>
            </footer>
            <p className="mt-1 text-xs text-ink-muted/80">{quote.significance}</p>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
