import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LitPulse — Interactive Literary Analysis",
  description:
    "Explore the hidden structure of classic literature through interactive visualization. Sentiment arcs, character networks, thematic maps, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment text-ink antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        <footer className="border-t border-parchment-dark py-8 text-center text-sm text-ink-muted">
          <p>LitPulse — Revealing the hidden structure of literature</p>
          <p className="mt-1 text-xs">All texts are in the public domain</p>
        </footer>
      </body>
    </html>
  );
}
