"use client";
import { useEffect, useRef, useState } from "react";

interface TitleEditorProps {
  value: string;
  onChange: (next: string) => void;
}

export default function TitleEditor({ value, onChange }: TitleEditorProps) {
  // States track editing and local changes.
  const [isEditing, setIsEditing] = useState(false);
  const [local, setLocal] = useState(value);

  // Ref for input.
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect handles focusing input on edit.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Effect handles setting local value when exiting edit.
  useEffect(() => {
    if (!isEditing) setLocal(value);
  }, [value, isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={local}
        onChange={(e) => {
          const val = e.target.value;
          setLocal(val);
          onChange(val);
        }}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") setIsEditing(false);
        }}
        className="text-accent bg-primary-100 ring-accent cursor-text px-1.5 py-1 text-2xl font-bold ring-2 transition outline-none"
      />
    );
  }

  return (
    <h2
      onClick={() => setIsEditing(true)}
      className="text-accent hover:bg-primary-100/50 hover:ring-accent/50 cursor-text px-1.5 py-1 text-2xl font-bold transition hover:ring-2"
    >
      {local}
    </h2>
  );
}
