import { Note } from '@models/note';
import { People } from '@models/people';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

const addNote = createAction('[Note] Add note', props<{ price: number, details?: String }>());

const addPeople = createAction('[Note] Add people', props<{ id: number, people: People['id'] }>());
const removePeople = createAction('[Note] Add people', props<{ id: number, people: People['id'] }>());

const updateNote = createAction('[Note] Update note', props<{ people: Update<Note> }>());
const deleteNote = createAction('[Note] Delete note', props<{ id: Note['id'] }>());
const deleteAllNotes = createAction('[Note] Clear notes');

export const NotesActions = {
  addNote, updateNote, deleteNote, deleteAllNotes,
  addPeople, removePeople,
};