import type { ReadNote } from "~/lib/types";

type Patch = Partial<Pick<ReadNote, "title" | "content" | "tags" | "archived">>;

export async function patchNote(id: string, patch: Patch): Promise<ReadNote> {
  // Make request to endpoint.
  const response = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  // Throw error on bad response.
  if (!response.ok) {
    throw new Error("Failed to patch note.");
  }

  return (await response.json()) as ReadNote;
}
