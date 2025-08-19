import { getNoteData } from "~/app/notes/actions";

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const note = await getNoteData(params.id);

  // Get dates and tags for note.
  const createdAt = note.createdAt;
  const updatedAt = note.updatedAt;
  const tags = note.tags;

  return (
    <article className="max-w-3xl border border-zinc-800/10 p-8 shadow-lg">
      <h2 className="mb-3 text-3xl font-bold">{note.title}</h2>
      <div className="mb-6 text-sm text-neutral-500">
        <p>Created At - {new Date(createdAt).toLocaleString()}</p>
        <p>Updated At - {new Date(updatedAt).toLocaleString()}</p>

        {tags.length > 0 && <> · {tags.map((t) => `#${t}`).join(" ")}</>}
      </div>
      <div className="prose max-w-none whitespace-pre-wrap">{note.content}</div>
    </article>
  );
}
