import type { BookSummary } from "@/lib/types";
import BookCard from "./BookCard";

export default function BookGrid({ books }: { books: BookSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {books.map((book) => (
        <BookCard key={book.slug} book={book} />
      ))}
    </div>
  );
}
