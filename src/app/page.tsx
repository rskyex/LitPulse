import { getAllBooks } from "@/lib/books";
import BookGrid from "@/components/library/BookGrid";

export default function HomePage() {
  const books = getAllBooks();

  return (
    <div>
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl font-bold tracking-tight">
          <span className="text-accent">Lit</span>Pulse
        </h1>
        <p className="mt-4 text-lg text-ink-light">
          See the hidden structure of classic literature.
        </p>
        <p className="mt-2 max-w-xl mx-auto text-sm text-ink-muted">
          Explore emotional arcs, character networks, thematic patterns, and
          notable passages through interactive visualization — no literary
          degree required.
        </p>
      </div>

      {/* Library Grid */}
      <section>
        <h2 className="mb-6 font-serif text-2xl font-semibold">Library</h2>
        <BookGrid books={books} />
      </section>
    </div>
  );
}
