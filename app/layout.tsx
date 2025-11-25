// Root layout that wraps everything and handles locale redirects
// Note: HTML structure is in the [locale]/layout.tsx to support i18n
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
