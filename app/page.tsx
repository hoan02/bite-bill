import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="grid place-content-center min-h-screen gap-2">
      <Button asChild>
        <Link href={"/login"}>Get Started</Link>
      </Button>

      {session && (
        <Button asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
      )}
    </div>
  );
}
