import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import ReactMarkdown from "react-markdown";

interface ContentEditorProps {
  initialContent: string;
  onSave: (newContent: string) => void;
  disabled?: boolean;
}

export default function ContentEditor({
  initialContent,
  onSave,
  disabled,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const debouncedContent = useDebounce(content, 1000);

  // Ref and Effect handle dynamically resizing the textarea relative to content.
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    const handleSave = async () => {
      if (debouncedContent !== initialContent) {
        try {
          setContent(debouncedContent);
          onSave(debouncedContent);
        } catch {
          setContent(initialContent);
          console.error("Failed to save content.");
        }
      }
    };

    void handleSave();
  }, [debouncedContent, initialContent, onSave]);

  // Function handles textarea change.
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  if (isEditing) {
    return (
      <div className="mt-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={onChange}
          disabled={disabled}
          className="min-h-[100px] w-full resize-none overflow-hidden outline-none"
          placeholder="Type here to get started..."
          rows={1}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div
        onClick={startEditing}
        className="min-h-[100px] cursor-text rounded p-2 transition-colors hover:bg-gray-50"
      >
        {content ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-500 italic">Click to add content...</p>
        )}
      </div>
    </div>
  );
}
