import React, { Suspense } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4  dark:bg-transparent">
      <Button className="fixed top-5" variant={"outline"} asChild>
        <Link href={"/"}>
          <Icons.arrowLeft className="h-2 w-2" />
          Back
        </Link>
      </Button>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </section>
  );
}
