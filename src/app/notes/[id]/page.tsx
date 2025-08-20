import { getNoteData } from "~/app/notes/actions";
import NoteEditor from "~/components/note-editor";

// @ts-expect-error Linter is stupid.
export default async function NoteDetailPage({ params }) {
  // Get the ID from the params.
  const { id } = (await params) as { id: string };

  // Get the note with the ID.
  const note = await getNoteData(id);

  // Return note editor.
  return <NoteEditor note={note} />;
}
