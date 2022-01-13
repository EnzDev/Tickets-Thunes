import { getId, NotePeopleLink } from '@models/note-people-link';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { PeopleActions } from '@store/peoples/people.actions';
import { NotePeopleLinkActions } from './note-people-link.actions';

export const FEATURE_KEY = 'note_link';

export interface State extends EntityState<NotePeopleLink> {}

export const adapter: EntityAdapter<NotePeopleLink> = createEntityAdapter<NotePeopleLink>({
  selectId: getId,
});

export const initialState: State = adapter.getInitialState();

const noteReducer = createReducer(
  initialState,
  on(NotePeopleLinkActions.deleteAll, (state) => adapter.removeAll(state)),
  on(NotePeopleLinkActions.addPeople, (state, { note_id, people_id }) =>
    adapter.addOne({ note_id: note_id, people_id }, state),
  ),
  on(NotePeopleLinkActions.removePeople, (state, { note_id, people_id }) =>
    adapter.removeOne(getId({ note_id, people_id }), state),
  ),
  on(PeopleActions.deletePeople, (state, { id }) =>
    adapter.removeMany((link) => link.people_id === id, state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return noteReducer(state, action);
}

export const { selectAll, selectTotal } = adapter.getSelectors();