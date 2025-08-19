"use client";

import type { Page, ReadNote } from "~/lib/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

interface NotesListProps {
  notes: Page<ReadNote>;
}

export default function NotesList({ notes }: NotesListProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {notes.content.map((n) => {
        const noteSelected = pathname.includes(n.id);

        return (
          <li key={n.id}>
            <Link
              prefetch
              href={`/notes/${n.id}`}
              aria-current={noteSelected ? "page" : undefined}
              className={clsx(
                "block truncate px-2 py-1 text-sm transition-colors",
                noteSelected
                  ? "bg-accent text-primary-50"
                  : "hover:bg-accent/25",
              )}
            >
              {n.title ?? "(Untitled)"}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
