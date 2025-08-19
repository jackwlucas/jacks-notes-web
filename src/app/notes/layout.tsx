import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { listNotesData } from "~/app/notes/actions";
import Sidebar from "~/components/sidebar";

export default async function NotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Guard route.
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Get notes.
  const notesPage = await listNotesData(0, 100);

  return (
    <div className="mx-auto grid h-[100dvh] w-full max-w-7xl grid-cols-[300px_1fr]">
      <Sidebar notes={notesPage} />
      <main className="overflow-y-auto p-8">{children}</main>
    </div>
  );
}
