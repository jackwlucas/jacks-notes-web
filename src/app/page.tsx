// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-3xl font-bold">My Notes</h1>
      <p className="mb-6 text-neutral-600">
        Fast, private notes with tags. Built with Next.js + Spring Boot.
      </p>

      {userId ? (
        <Link
          href="/notes"
          className="inline-block rounded-md border px-4 py-2 hover:bg-neutral-100"
        >
          Go to Notes
        </Link>
      ) : (
        <Link
          href="/sign-in"
          className="inline-block rounded-md border px-4 py-2 hover:bg-neutral-100"
        >
          Sign in to continue
        </Link>
      )}
    </main>
  );
}
