import { notFound } from "next/navigation";
import Link from "next/link";
import { getChapter, getBook } from "@/lib/books";

export default async function ChapterExplorer({
  params,
}: {
  params: Promise<{ slug: string; chapterNum: string }>;
}) {
  const { slug, chapterNum } = await params;
  const num = parseInt(chapterNum, 10);
  const chapter = getChapter(slug, num);
  if (!chapter) notFound();

  const book = getBook(slug)!;
  const chapterNumbers = book.chapters.map((c) => c.number);
  const currentIndex = chapterNumbers.indexOf(num);
  const prevChapter = currentIndex > 0 ? chapterNumbers[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapterNumbers.length - 1 ? chapterNumbers[currentIndex + 1] : null;

  const characters = book.characters.filter((c) =>
    chapter.characterIds.includes(c.id)
  );

  const sentimentColor =
    chapter.sentiment > 0.2
      ? "text-sentiment-positive"
      : chapter.sentiment < -0.2
      ? "text-sentiment-negative"
      : "text-sentiment-neutral";

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">Library</Link>
        <span className="mx-2">›</span>
        <Link href={`/books/${slug}`} className="hover:text-ink">{chapter.bookTitle}</Link>
        <span className="mx-2">›</span>
        <span className="text-ink">Chapter {chapter.number}</span>
      </nav>

      {/* Chapter header */}
      <header className="mb-8">
        <p className="text-sm text-ink-muted">Chapter {chapter.number}</p>
        <h1 className="mt-1 font-serif text-3xl font-bold">{chapter.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-light">
          {chapter.summary}
        </p>
      </header>

      {/* Meta panels */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {/* Sentiment */}
        <div className="rounded-xl border border-parchment-dark bg-white p-4">
          <p className="text-xs text-ink-muted">Emotional Tone</p>
          <p className={`mt-1 text-2xl font-bold ${sentimentColor}`}>
            {chapter.sentiment > 0 ? "+" : ""}
            {chapter.sentiment.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {chapter.sentiment > 0.3
              ? "Uplifting"
              : chapter.sentiment > 0
              ? "Mildly positive"
              : chapter.sentiment > -0.3
              ? "Somber undertone"
              : "Dark / tense"}
          </p>
        </div>

        {/* Characters */}
        <div className="rounded-xl border border-parchment-dark bg-white p-4">
          <p className="text-xs text-ink-muted">Characters Present</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {characters.map((c) => (
              <span
                key={c.id}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                  c.role === "protagonist"
                    ? "bg-accent"
                    : c.role === "antagonist"
                    ? "bg-sentiment-negative"
                    : "bg-ink-muted"
                }`}
              >
                {c.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div className="rounded-xl border border-parchment-dark bg-white p-4">
          <p className="text-xs text-ink-muted">Dominant Themes</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chapter.dominantThemes.map((t) => {
              const theme = book.themes.find((th) => th.name === t);
              return (
                <span
                  key={t}
                  className="rounded-full px-2.5 py-0.5 text-xs"
                  style={{
                    backgroundColor: theme ? `${theme.color}20` : "#f0e9df",
                    color: theme?.color || "#78716c",
                  }}
                >
                  {t}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chapter text preview */}
      {chapter.text && (
        <div className="mb-8 rounded-xl border border-parchment-dark bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">Text Preview</h2>
          <div className="font-serif text-sm leading-7 text-ink-light">
            {chapter.text
              .split("\n\n")
              .slice(0, 3)
              .map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
          </div>
          <Link
            href={`/books/${slug}/read?chapter=${chapter.number}`}
            className="mt-2 inline-block text-sm text-accent hover:text-accent-light"
          >
            Read full chapter with annotations →
          </Link>
        </div>
      )}

      {/* Annotations summary */}
      {chapter.annotations.length > 0 && (
        <div className="mb-8 rounded-xl border border-parchment-dark bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">
            Literary Analysis Notes
          </h2>
          <div className="space-y-3">
            {chapter.annotations.map((a) => (
              <div key={a.id} className="flex gap-3">
                <span
                  className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                    a.type === "theme"
                      ? "bg-accent"
                      : a.type === "literary-device"
                      ? "bg-pink-500"
                      : a.type === "foreshadowing"
                      ? "bg-sentiment-neutral"
                      : "bg-sentiment-positive"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-ink-muted">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevChapter ? (
          <Link
            href={`/books/${slug}/chapters/${prevChapter}`}
            className="rounded-lg border border-parchment-dark px-4 py-2 text-sm transition hover:border-accent/30"
          >
            ← Chapter {prevChapter}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/books/${slug}`}
          className="text-sm text-ink-muted hover:text-ink"
        >
          Back to Dashboard
        </Link>
        {nextChapter ? (
          <Link
            href={`/books/${slug}/chapters/${nextChapter}`}
            className="rounded-lg border border-parchment-dark px-4 py-2 text-sm transition hover:border-accent/30"
          >
            Chapter {nextChapter} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
