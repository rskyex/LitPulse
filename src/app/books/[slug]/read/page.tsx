"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { Book, Chapter, Annotation } from "@/lib/types";

const annotationTypeColors: Record<string, { bg: string; label: string }> = {
  theme: { bg: "annotation-theme", label: "Theme" },
  "literary-device": { bg: "annotation-literary-device", label: "Literary Device" },
  "character-development": { bg: "annotation-character-development", label: "Character Dev." },
  foreshadowing: { bg: "annotation-foreshadowing", label: "Foreshadowing" },
};

function renderAnnotatedText(text: string, annotations: Annotation[], selectedId: string | null, onSelect: (id: string) => void) {
  if (!annotations.length) {
    return text.split("\n\n").map((p, i) => (
      <p key={i} className="mb-5 leading-8">{p}</p>
    ));
  }

  const sorted = [...annotations].sort((a, b) => a.startOffset - b.startOffset);
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  sorted.forEach((ann) => {
    if (ann.startOffset > cursor) {
      parts.push(
        <span key={`text-${cursor}`}>
          {text.slice(cursor, ann.startOffset)}
        </span>
      );
    }
    const snippet = text.slice(ann.startOffset, ann.endOffset);
    const colors = annotationTypeColors[ann.type];
    parts.push(
      <span
        key={ann.id}
        className={`${colors?.bg || ""} cursor-pointer rounded-sm px-0.5 transition ${
          selectedId === ann.id ? "ring-2 ring-accent" : ""
        }`}
        onClick={() => onSelect(ann.id)}
        title={ann.label}
      >
        {snippet}
      </span>
    );
    cursor = ann.endOffset;
  });

  if (cursor < text.length) {
    parts.push(<span key={`text-${cursor}`}>{text.slice(cursor)}</span>);
  }

  // Wrap in paragraphs by splitting on double newlines within parts
  // Simplified: render as a single block with the annotated spans
  return <div className="leading-8">{parts}</div>;
}

export default function ReadingViewPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center text-ink-muted">Loading...</div>}>
      <ReadingView />
    </Suspense>
  );
}

function ReadingView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const initialChapter = searchParams.get("chapter");

  const [book, setBook] = useState<Book | null>(null);
  const [currentChapterNum, setCurrentChapterNum] = useState<number>(1);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import(`@/data/json/${slug}.json`).then((mod) => {
      const data = mod.default as unknown as Book;
      setBook(data);
      if (initialChapter) {
        const num = parseInt(initialChapter, 10);
        if (data.chapters.find((c) => c.number === num)) {
          setCurrentChapterNum(num);
        }
      } else if (data.chapters.length > 0) {
        setCurrentChapterNum(data.chapters[0].number);
      }
    });
  }, [slug, initialChapter]);

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(Math.min(1, Math.max(0, progress)));
  }, []);

  if (!book) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-muted">
        Loading...
      </div>
    );
  }

  const chapter: Chapter | undefined = book.chapters.find(
    (c) => c.number === currentChapterNum
  );

  if (!chapter) {
    return (
      <div className="text-center text-ink-muted">
        <p>Chapter not available in this preview.</p>
        <Link href={`/books/${slug}`} className="mt-4 inline-block text-accent">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const selectedAnn = chapter.annotations.find(
    (a) => a.id === selectedAnnotation
  );

  return (
    <div>
      {/* Progress bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-parchment-dark">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <nav className="text-sm text-ink-muted">
          <Link href="/" className="hover:text-ink">Library</Link>
          <span className="mx-2">›</span>
          <Link href={`/books/${slug}`} className="hover:text-ink">{book.title}</Link>
          <span className="mx-2">›</span>
          <span className="text-ink">Reading</span>
        </nav>

        {/* Chapter selector */}
        <select
          value={currentChapterNum}
          onChange={(e) => {
            setCurrentChapterNum(parseInt(e.target.value, 10));
            setSelectedAnnotation(null);
          }}
          className="rounded-lg border border-parchment-dark bg-white px-3 py-1.5 text-sm"
        >
          {book.chapters.map((c) => (
            <option key={c.number} value={c.number}>
              Ch. {c.number}: {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Two-pane layout */}
      <div className="flex gap-6">
        {/* Reader pane */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto rounded-xl border border-parchment-dark bg-white p-8"
          style={{ maxHeight: "75vh" }}
        >
          <h2 className="mb-2 text-sm text-ink-muted">
            Chapter {chapter.number}
          </h2>
          <h1 className="mb-6 font-serif text-2xl font-bold">{chapter.title}</h1>
          <div className="font-serif text-base text-ink-light">
            {renderAnnotatedText(
              chapter.text,
              chapter.annotations,
              selectedAnnotation,
              setSelectedAnnotation
            )}
          </div>
        </div>

        {/* Annotation sidebar */}
        <aside className="hidden w-80 flex-shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-parchment-dark bg-white p-5">
            <h3 className="mb-4 font-serif text-lg font-semibold">
              Annotations
            </h3>

            {/* Legend */}
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(annotationTypeColors).map(([type, { label }]) => (
                <span
                  key={type}
                  className={`${annotationTypeColors[type].bg} rounded px-2 py-0.5 text-xs`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Selected annotation detail */}
            {selectedAnn ? (
              <div className="mb-4 rounded-lg bg-parchment p-3">
                <p className="text-xs font-medium text-accent">
                  {annotationTypeColors[selectedAnn.type]?.label}
                </p>
                <p className="mt-1 text-sm font-medium">{selectedAnn.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                  {selectedAnn.note}
                </p>
              </div>
            ) : (
              <p className="mb-4 text-xs text-ink-muted">
                Click a highlighted passage to see its analysis
              </p>
            )}

            {/* All annotations list */}
            <div className="space-y-2">
              {chapter.annotations.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAnnotation(a.id)}
                  className={`w-full rounded-lg p-2 text-left text-xs transition ${
                    selectedAnnotation === a.id
                      ? "bg-accent/10 ring-1 ring-accent/30"
                      : "hover:bg-parchment"
                  }`}
                >
                  <span className="font-medium">{a.label}</span>
                  <span className="ml-2 text-ink-muted">
                    ({annotationTypeColors[a.type]?.label})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
