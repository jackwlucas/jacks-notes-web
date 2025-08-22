import React from "react";
import { useState } from "react";
import { XIcon } from "lucide-react";

interface TagEditorProps {
  initialTags: string[];
  onSave: (newTags: string[]) => void;
  disabled?: boolean;
}

export default function TagEditor({
  initialTags,
  onSave,
  disabled,
}: TagEditorProps) {
  // States track current tags and the tag input.
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState("");

  // Save on debounce.
  const handleSave = () => {
    // Only save if tags actually changed
    if (JSON.stringify(tags) !== JSON.stringify(initialTags)) {
      onSave(tags);
    }
  };

  //
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  //
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // On Escape, exit the input.
    if (e.key === "Escape") {
      e.preventDefault();

      setInputValue("");
      e.currentTarget.blur();
    }

    // On Enter, create a new tag.
    else if (e.key === "Enter") {
      e.preventDefault();

      const trimmedTag = inputValue.trim();

      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setInputValue("");
      } else {
        setInputValue("");
      }
    }

    // On Backspace with an empty input, delete the last tag.
    else if (e.key === "Backspace") {
      if (inputValue === "" && tags.length > 0) {
        setTags(tags.slice(0, -1));
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onSave(newTags);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="text-accent bg-accent-soft border-accent inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="group hover:bg-accent-hover inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full p-[2px] transition-colors"
          >
            <XIcon className="group-hover:text-accent-foreground transition-colors" />
          </button>
        </span>
      ))}

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        disabled={disabled}
        onBlur={handleSave}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Add tag..."
        className="h-[30px] min-w-16 flex-grow border-none bg-transparent text-sm outline-none"
      />
    </div>
  );
}
