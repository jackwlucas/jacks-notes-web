import NotesList from "~/components/notes-list";
import type { Page, ReadNote } from "~/lib/types";

interface SideBarProps {
  notes: Page<ReadNote>;
}

export default function Sidebar({ notes }: SideBarProps) {
  return (
    <aside className="relative shadow-xl">
      {/* Textures */}
      <div className="absolute inset-0 -z-10 h-screen w-full bg-[image:var(--paper-texture)] opacity-30" />
      <div className="spine-pattern absolute h-full w-10 border-r-[0.4px] border-r-white shadow" />

      {/* Content */}
      <div className="ml-10 px-4 py-8">
        <h1 className="ml-2 text-2xl font-bold text-stone-800">My Notes</h1>
        <div className="my-4 h-[1px] w-full bg-stone-400" />
        <NotesList notes={notes} />
      </div>
    </aside>
  );
}
