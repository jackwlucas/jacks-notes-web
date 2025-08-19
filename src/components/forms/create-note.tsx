import { createNote } from "~/app/notes/actions";
import { Button, Field, Input, Label } from "@headlessui/react";

export default function CreateNoteForm() {
  return (
    <form action={createNote} className="max-w-md space-y-4 bg-white p-4">
      <Field className="flex flex-col">
        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          className="rounded border border-zinc-300 p-2 py-1"
        />
      </Field>

      <Field className="flex flex-col">
        <Label>Content</Label>
        <Input
          type="text"
          name="content"
          className="rounded border border-zinc-300 p-2 py-1"
        />
      </Field>

      <Button
        type="submit"
        className="rounded bg-teal-200 px-4 py-1 hover:cursor-pointer hover:bg-teal-300"
      >
        Create Note
      </Button>
    </form>
  );
}
