"use client";
import { useEffect } from "react";

export function useKeyboardSave(onSave: () => void | Promise<void>) {
  useEffect(() => {
    // Create keyboard handler for saving.
    const handler = (e: KeyboardEvent) => {
      // Get current OS.
      const isMac = window.navigator.platform.toUpperCase().includes("Mac");

      // Get the key.
      const key = e.key?.toLowerCase();

      // Set valid shortcut combos.
      const shortcut =
        (isMac && e.metaKey && key === "s") ||
        (!isMac && e.ctrlKey && key === "s");

      if (!shortcut) return;
      e.preventDefault();
      if (e.repeat) return;
      void onSave();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);
}
