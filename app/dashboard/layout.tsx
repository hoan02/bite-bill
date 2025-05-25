export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4  dark:bg-transparent">
      {children}
    </section>
  );
}
