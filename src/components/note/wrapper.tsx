"use client";

import type { ReadNote } from "~/lib/types";
import { useOptimistic, useState, useTransition } from "react";
import { updateNote } from "~/app/actions";

import NoteTitleEditor from "~/components/note/title-editor";
import NoteSaveStatus from "~/components/note/save-status";

interface NoteWrapperProps {
  initialNote: ReadNote;
}

export default function NoteWrapper({ initialNote }: NoteWrapperProps) {
  // Track server errors.
  const [isError, setIsError] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Single source of truth with optimistic updates
  const [note, updateOptimisticNote] = useOptimistic(
    initialNote,
    (currentNote, updatedFields: Partial<ReadNote>) => ({
      ...currentNote,
      ...updatedFields,
    }),
  );

  // Tracks if changes have been made relative to the initial note.
  const isDirty = JSON.stringify(note) !== JSON.stringify(initialNote);

  // Save to server
  const saveNote = async (updatedNote: ReadNote) => {
    startTransition(async () => {
      // Optimistically update the note.
      updateOptimisticNote(updatedNote);

      // Try updating the note on the server.
      try {
        await updateNote(updatedNote.id, {
          title: updatedNote.title,
          content: updatedNote.content ?? "",
          tags: updatedNote.tags,
          archived: updatedNote.archived,
        });

        // Catch any errors.
      } catch (error) {
        setIsError(true);
        console.error("Failed to save note:", error);
      }
    });
  };

  return (
    <div className="relative flex flex-col rounded-lg border border-stone-400/25 p-6 shadow-sm">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[image:var(--paper-texture)] opacity-25" />

      {/* Save Status */}
      <NoteSaveStatus
        isPending={isPending}
        isDirty={isDirty}
        isError={isError}
      />

      {/* Title Editor - handles its own logic */}
      <NoteTitleEditor
        initialValue={note.title}
        onSave={(newTitle: string) => saveNote({ ...note, title: newTitle })}
        disabled={isPending}
      />

      {/* Debug */}
      <div className="mt-4 text-xs text-stone-400">
        Current: {note.title} | Original: {initialNote.title}
      </div>
    </div>
  );
}
