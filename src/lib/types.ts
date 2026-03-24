export interface Book {
  slug: string;
  title: string;
  author: string;
  year: number;
  coverColor: string;
  synopsis: string;
  chapterCount: number;
  genres: string[];
  characters: Character[];
  relationships: Relationship[];
  themes: Theme[];
  sentimentArc: SentimentPoint[];
  chapters: Chapter[];
  quotes: Quote[];
}

export type BookSummary = Pick<
  Book,
  "slug" | "title" | "author" | "year" | "coverColor" | "synopsis" | "genres" | "chapterCount"
>;

export interface Character {
  id: string;
  name: string;
  description: string;
  role: "protagonist" | "antagonist" | "supporting";
}

export interface Relationship {
  source: string;
  target: string;
  type: "romantic" | "familial" | "rivalry" | "friendship" | "mentor";
  strength: number;
  description: string;
}

export interface SentimentPoint {
  chapter: number;
  sentiment: number;
  label?: string;
}

export interface Theme {
  name: string;
  frequency: number;
  color: string;
  keywords: string[];
}

export interface Chapter {
  number: number;
  title: string;
  summary: string;
  sentiment: number;
  characterIds: string[];
  dominantThemes: string[];
  text: string;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  startOffset: number;
  endOffset: number;
  type: "theme" | "literary-device" | "character-development" | "foreshadowing";
  label: string;
  note: string;
}

export interface Quote {
  text: string;
  chapter: number;
  character?: string;
  significance: string;
}
