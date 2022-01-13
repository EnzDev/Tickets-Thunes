import { Note } from '@models/note';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { NotesActions } from './notes.actions';

export const FEATURE_KEY = 'note';

export interface State extends EntityState<Note> {}

export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>();

export const initialState: State = adapter.getInitialState();


const noteReducer = createReducer(
  initialState,
  on(
    NotesActions.addNote,
    (state, { details, price }) => adapter.addOne(
      {
        id: Math.floor(Math.random() * 1000),
        details,
        price,
      },
      state,
    ),
  ),
  on(NotesActions.updateNote, (state, { people }) => adapter.updateOne(people, state)),
  on(NotesActions.deleteNote, (state, { id }) => adapter.removeOne(id, state)),
  on(NotesActions.deleteAllNotes, (state, {}) => adapter.removeAll(state)),
);

export function reducer(state: State | undefined, action: Action) {
  return noteReducer(state, action);
}

export const { selectAll, selectTotal } = adapter.getSelectors();