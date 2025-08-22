"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

interface NoteTitleEditorProps {
  initialValue: string;
  onSave: (newTitle: string) => void;
  disabled?: boolean;
}

export default function NoteTitleEditor({
  initialValue,
  onSave,
  disabled,
}: NoteTitleEditorProps) {
  // States track title and editing status.
  const [title, setTitle] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  // Hooks handle focusing input when entering.
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Function handles trimming title or setting default, and saving when there are changes.
  const handleSave = () => {
    // Trim the title or set default.
    const trimmedTitle = title.trim() || "Untitled";

    // Only save the title if current title differs from initial.
    if (trimmedTitle !== initialValue) {
      onSave(trimmedTitle);
    }

    // Exit editing state.
    setIsEditing(false);
  };

  // Function handles pressing Enter or Escape while in input.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    // If user presses enter, save the note.
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }

    // If the user presses Escape, reset the title and
    else if (e.key === "Escape") {
      e.preventDefault();
      setTitle(initialValue);
      setIsEditing(false);
    }
  };

  // Function changes title on input change.
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <input
      type="text"
      value={title}
      ref={inputRef}
      disabled={disabled}
      onBlur={handleSave}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Enter Title"
      className="text-accent hover:border-b-accent-hover/25 border-b border-transparent text-3xl font-bold transition-colors outline-none disabled:opacity-50"
    />
  );
}
