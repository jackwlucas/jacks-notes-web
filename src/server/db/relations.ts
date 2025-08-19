import { relations } from "drizzle-orm/relations";
import { notes, noteTags, tags } from "./schema";

export const noteTagsRelations = relations(noteTags, ({one}) => ({
	note: one(notes, {
		fields: [noteTags.noteId],
		references: [notes.id]
	}),
	tag: one(tags, {
		fields: [noteTags.tagId],
		references: [tags.id]
	}),
}));

export const notesRelations = relations(notes, ({many}) => ({
	noteTags: many(noteTags),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	noteTags: many(noteTags),
}));