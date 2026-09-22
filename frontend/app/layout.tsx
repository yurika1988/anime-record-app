import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anime Record App',
  description: 'Anime record application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
