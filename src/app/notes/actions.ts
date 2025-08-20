"use server";

import { auth } from "@clerk/nextjs/server";
import type { Page, ReadNote } from "~/lib/types";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createNote(formData: FormData) {
  // Get user token.
  const authInfo = await getTokenAndUser();

  // Make request to backend.
  const response = await fetch(`${process.env.NOTES_API_URL}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authInfo.tokenId}`,
    },
    body: JSON.stringify({
      title: formData.get("title"),
      content: formData.get("content"),
      tags: formData.get("tags"),
    }),
  });

  // Check status of response.
  if (!response.ok) {
    throw new Error("Failed to create note.");
  }

  const data = (await response.json()) as unknown;
  console.log(data, response.status);
}

export async function getNoteData(id: string): Promise<ReadNote> {
  // Get user token.
  const authInfo = await getTokenAndUser();

  const response = await fetch(`${process.env.NOTES_API_URL}/api/notes/${id}`, {
    headers: { Authorization: `Bearer ${authInfo.tokenId}` },
    next: { revalidate: 30, tags: [`note:${authInfo.userId}:${id}`] },
  });

  // Check status of response.
  if (!response.ok) {
    throw new Error("Failed to get note.");
  }

  return (await response.json()) as ReadNote;
}

export async function listNotesData(
  page = 0,
  size = 50,
  sort = "createdAt,desc",
): Promise<Page<ReadNote>> {
  // Get user token.
  const authInfo = await getTokenAndUser();

  const response = await fetch(
    `${process.env.NOTES_API_URL}/api/notes?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
    {
      headers: { Authorization: `Bearer ${authInfo.tokenId}` },
      cache: "no-store",
    },
  );

  // Check status of response.
  if (!response.ok) {
    throw new Error("Failed to list notes.");
  }

  return (await response.json()) as Page<ReadNote>;
}

export async function updateNote(
  id: string,
  input: { title: string; content: string | null; tags: string[] },
): Promise<ReadNote> {
  // Get token and user.
  const { tokenId, userId } = await getTokenAndUser();

  const response = await fetch(`${process.env.NOTES_API_URL}/api/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenId}`,
    },
    body: JSON.stringify({
      title: input.title,
      content: input.content ?? "",
      tags: input.tags,
    }),
  });

  // Check status of response.
  if (!response.ok) {
    throw new Error("Failed to patch note.");
  }

  // Revalidate tags and path.
  revalidateTag(`notes:${userId}`);
  revalidateTag(`note:${userId}:${id}`);
  revalidatePath(`/notes/${id}`);

  return (await response.json()) as ReadNote;
}

export async function deleteNote(id: string) {
  // Get token and user.
  const { tokenId, userId } = await getTokenAndUser();

  const response = await fetch(`${process.env.NOTES_API_URL}/api/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${tokenId}` },
  });

  // Check status of response.
  if (!response.ok) {
    throw new Error("Failed to delete note.");
  }

  // Revalidate tags.
  revalidateTag(`notes:${userId}`);
  revalidateTag(`note:${userId}:${id}`);
}

/**
 * Function handles retrieving user JWT from Clerk.
 */
async function getTokenAndUser(): Promise<{ tokenId: string; userId: string }> {
  const { userId, getToken } = await auth();

  // Make sure user is authenticated.
  if (!userId) {
    throw new Error("User not authenticated.");
  }

  // Get the user's token.
  const token = await getToken();

  if (!token) {
    throw new Error("Failed to retrieve user token.");
  }

  return { tokenId: token, userId: userId };
}
