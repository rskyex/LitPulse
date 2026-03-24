import type { Book, BookSummary, Chapter } from "./types";

import prideAndPrejudice from "../data/json/pride-and-prejudice.json";
import frankenstein from "../data/json/frankenstein.json";
import theGreatGatsby from "../data/json/the-great-gatsby.json";
import aTaleOfTwoCities from "../data/json/a-tale-of-two-cities.json";

const books: Book[] = [
  prideAndPrejudice as unknown as Book,
  frankenstein as unknown as Book,
  theGreatGatsby as unknown as Book,
  aTaleOfTwoCities as unknown as Book,
];

export function getAllBooks(): BookSummary[] {
  return books.map(({ slug, title, author, year, coverColor, synopsis, genres, chapterCount }) => ({
    slug,
    title,
    author,
    year,
    coverColor,
    synopsis,
    genres,
    chapterCount,
  }));
}

export function getBook(slug: string): Book | null {
  return books.find((b) => b.slug === slug) ?? null;
}

export function getChapter(slug: string, chapterNum: number): (Chapter & { bookTitle: string; bookSlug: string; totalChapters: number }) | null {
  const book = getBook(slug);
  if (!book) return null;
  const chapter = book.chapters.find((c) => c.number === chapterNum);
  if (!chapter) return null;
  return { ...chapter, bookTitle: book.title, bookSlug: book.slug, totalChapters: book.chapters.length };
}
