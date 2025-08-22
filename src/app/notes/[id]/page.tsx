import { getNote } from "~/app/actions";
import NoteWrapper from "~/components/note/wrapper";

// @ts-expect-error Linter is stupid.
export default async function NoteDetailPage({ params }) {
  // Get the ID from the params.
  const { id } = (await params) as { id: string };

  // Get the note with the ID.
  const note = await getNote(id);

  // Return note editor.
  return <NoteWrapper initialNote={note} />;
}
