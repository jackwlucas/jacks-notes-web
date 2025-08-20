"use client";

import type { ReadNote } from "~/lib/types";
import { useState, useCallback } from "react";
import { patchNote } from "~/lib/patch-note";
import { useKeyboardSave } from "~/hooks/useKeyboardSave";

import TitleEditor from "~/components/title-editor";
import TagEditor from "~/components/tag-editor";
import ContentEditor from "~/components/content-editor";

export default function NoteEditor({ note: initialNote }: { note: ReadNote }) {
  const [note, setNote] = useState<ReadNote>(initialNote);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Define callback for useKeyboardSave.
  const onSave = useCallback(async () => {
    try {
      // Start save.
      setIsSaving(true);
      setError(null);

      // Patch the note.
      const patchedNote = await patchNote(note.id, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        archived: note.archived,
      });

      // Set current note to patched note.
      setNote(patchedNote);

      // Catch any errors.
    } catch {
      setError("Failed to save note.");

      // Complete save.
    } finally {
      setIsSaving(false);
    }
  }, [note]);

  // Initialize keyboard saving.
  useKeyboardSave(onSave);

  return (
    <div className="relative flex flex-col border border-stone-400/25 p-6 shadow-sm">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[image:var(--paper-texture)] opacity-25" />

      {/* Title */}
      <TitleEditor
        value={note.title}
        onChange={(v) => setNote((n) => ({ ...n, title: v }))}
      />

      {/* Metadata */}
      <div className="bg-primary-100 border-primary-200 mt-6 grid w-fit grid-cols-[0.75fr_1fr] gap-y-1.5 border p-3 text-sm">
        <p className="text-primary-500 font-medium">Created At</p>
        <p className="text-stone-500">
          {new Date(note.createdAt).toLocaleString()}
        </p>
        <p className="text-primary-500 font-medium">Updated At</p>
        <p className="text-stone-500">
          {new Date(note.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Tags */}
      <TagEditor note={note} />

      {/* Content */}
      <ContentEditor note={note} />
    </div>
  );
}
