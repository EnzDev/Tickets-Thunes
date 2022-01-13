import { Note } from '@models/note';
import { People } from '@models/people';
import { createAction, props } from '@ngrx/store';

const addPeople = createAction('[NoteLink] Add people link', props<{ note_id: Note['id'], people_id: People['id'] }>());
const removePeople = createAction('[NoteLink] Remove people link', props<{ note_id: Note['id'], people_id: People['id'] }>());
const deleteAll = createAction('[NoteLink] Remove all links');

export const NotePeopleLinkActions = {
  addPeople, removePeople, deleteAll
};