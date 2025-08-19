import type { notes, tags } from "~/server/db/schema";

export type NewNote = typeof notes.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Tag = typeof tags.$inferSelect;
