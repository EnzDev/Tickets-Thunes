import { Type } from '@angular/core';
import { Note } from '@models/note';
import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { storageMetaReducer } from '@store/storage.metareducer';
import { environment } from 'src/environments/environment';

import * as fromPeople from './peoples/peoples.reducer';
import * as fromTheme from './theme/theme.reducer';
import * as fromEditorColor from './editor-color/editor-color.reducer';
import * as fromNotes from './notes/notes.reducer';
import * as fromNoteLinks from './note-people-link/note-people-link.reducer';



export interface State {
  [fromPeople.FEATURE_KEY]: fromPeople.State;
  [fromTheme.FEATURE_KEY]: fromTheme.State;
  [fromNotes.FEATURE_KEY]: fromNotes.State;
  [fromNoteLinks.FEATURE_KEY]: fromNoteLinks.State;
  [fromEditorColor.FEATURE_KEY]: fromEditorColor.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromPeople.FEATURE_KEY]: fromPeople.reducer,
  [fromTheme.FEATURE_KEY]: fromTheme.reducer,
  [fromNotes.FEATURE_KEY]: fromNotes.reducer,
  [fromNoteLinks.FEATURE_KEY]: fromNoteLinks.reducer,
  [fromEditorColor.FEATURE_KEY]: fromEditorColor.reducer,
};

export const effects: Type<any>[] = [];

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storageMetaReducer]
  : [storageMetaReducer];

// Selectors
export const selectPeopleState = createFeatureSelector<fromPeople.State>(fromPeople.FEATURE_KEY);
export const selectPeoples = createSelector(
  selectPeopleState,
  fromPeople.selectAll,
);
export const selectPeoplesById = createSelector(
  selectPeopleState,
  fromPeople.selectEntities,
);

export const selectThemeState = createFeatureSelector<fromTheme.State>(fromTheme.FEATURE_KEY);
export const selectTheme = createSelector(
  selectThemeState,
  (themeState) => themeState.theme
);
export const selectScreenshot = createSelector(
  selectThemeState,
  (themeState) => !!themeState.screenshot
);

export const selectNotesState = createFeatureSelector<fromNotes.State>(fromNotes.FEATURE_KEY);
export const selectNotes = createSelector(
  selectNotesState,
  fromNotes.selectAll,
);
export const selectNoteById = (id: Note['id']) => createSelector(
  selectNotes,
  (notes) => notes.find(thisNote => thisNote.id === id)
);

export const selectNoteLinksState = createFeatureSelector<fromNoteLinks.State>(fromNoteLinks.FEATURE_KEY);
export const selectNoteLinks = createSelector(
  selectNoteLinksState,
  fromNoteLinks.selectAll,
);
export const selectNotesByNoteId = (id: Note['id']) => createSelector(
  selectNoteLinks,
  (notesLinks) => notesLinks.filter(thisLink => thisLink.note_id === id)
);

export const selectColorState = createFeatureSelector<fromEditorColor.State>(fromEditorColor.FEATURE_KEY);
export const selectColor = createSelector(
  selectColorState,
  (colorState) => colorState.color
);