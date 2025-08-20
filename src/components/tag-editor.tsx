"use client";

import type { ReadNote } from "~/lib/types";

export default function TagEditor({ note }: { note: ReadNote }) {
  return (
    <div className="mt-6">
      {note.tags.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  );
}
