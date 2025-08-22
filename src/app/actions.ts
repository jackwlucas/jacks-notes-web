"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Page, ReadNote } from "~/lib/types";

const API_BASE_URL = process.env.NOTES_API_URL;

/**
 * Get a paginated list of notes
 * Matches NoteController.listNotes()
 */
export async function getNotes(params?: {
  page?: number;
  size?: number;
  tag?: string;
}): Promise<Page<ReadNote>> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set("page", params.page.toString());
  }

  if (params?.size !== undefined) {
    searchParams.set("size", params.size.toString());
  }

  if (params?.tag) {
    searchParams.set("tag", params.tag);
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/api/notes${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return (await response.json()) as Page<ReadNote>;
}

/**
 * Get a single note by ID
 * Matches NoteController.getNoteById()
 */
export async function getNote(noteId: string): Promise<ReadNote> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return (await response.json()) as ReadNote;
}

/**
 * Create a new note
 * Matches NoteController.createNote()
 */
export async function createNote(data: {
  title: string;
  content?: string;
  tags?: string[];
}): Promise<ReadNote> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const note = (await response.json()) as ReadNote;

  // Revalidate the notes list
  revalidatePath("/notes");

  return note;
}

/**
 * Update a note using PATCH
 * Matches NoteController.patchNote()
 */
export async function updateNote(
  noteId: string,
  updates: {
    title?: string;
    content?: string;
    tags?: string[];
    archived?: boolean;
  },
): Promise<ReadNote> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const note = (await response.json()) as ReadNote;

  // Revalidate both the specific note and the notes list
  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/notes");

  return note;
}

/**
 * Replace a note completely using PUT
 * Matches NoteController.updateNote()
 */
export async function replaceNote(
  noteId: string,
  data: {
    title: string;
    content: string;
    tags: string[];
    archived: boolean;
  },
): Promise<ReadNote> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const note = (await response.json()) as ReadNote;

  // Revalidate both the specific note and the notes list
  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/notes");

  return note;
}

/**
 * Delete a note
 * Matches NoteController.deleteNoteById()
 */
export async function deleteNote(noteId: string): Promise<void> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // Revalidate the notes list
  revalidatePath("/notes");
}
