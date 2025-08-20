"use client";

import type { ReadNote } from "~/lib/types";

export default function ContentEditor({ note }: { note: ReadNote }) {
  return <p className="mt-6">{note.content}</p>;
}
