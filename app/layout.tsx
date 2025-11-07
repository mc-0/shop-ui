import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shop UI - Recipe & Grocery Manager',
  description: 'Manage your recipes, groceries, and shopping lists',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
