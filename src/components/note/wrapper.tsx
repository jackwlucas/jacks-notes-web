"use client";

import type { ReadNote } from "~/lib/types";
import { useOptimistic, useState, useTransition } from "react";
import { updateNote } from "~/app/actions";

import NoteTitleEditor from "~/components/note/title-editor";
import NoteSaveStatus from "~/components/note/save-status";
import TagEditor from "~/components/note/tag-editor";

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

      <NoteSaveStatus
        isPending={isPending}
        isDirty={isDirty}
        isError={isError}
      />

      <NoteTitleEditor
        initialValue={note.title}
        onSave={(newTitle: string) => saveNote({ ...note, title: newTitle })}
        disabled={isPending}
      />

      <div className="bg-primary-100 border-primary-200 mt-6 rounded-md border p-3">
        <div className="grid grid-cols-[auto_1fr] gap-3 text-sm">
          <p className="text-primary-500 mt-1 font-medium">Tags</p>
          <TagEditor
            initialTags={note.tags}
            onSave={(newTags) => saveNote({ ...note, tags: newTags })}
            disabled={isPending}
          />

          <div className="bg-primary-200 col-span-2 h-[1px]" />

          <p className="text-primary-500 font-medium">Created</p>
          <p className="text-stone-500">
            {new Date(note.createdAt).toLocaleString()}
          </p>
          <p className="text-primary-500 font-medium">Updated</p>
          <p className="text-stone-500">
            {new Date(note.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Debug */}
      <div className="mt-4 text-xs text-stone-400">
        Current: {note.title} | Original: {initialNote.title}
      </div>
    </div>
  );
}
