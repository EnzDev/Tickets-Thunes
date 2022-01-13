import { People } from '@models/people';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { PeopleActions } from './people.actions';

export const FEATURE_KEY = 'people';

export interface State extends EntityState<People> {}

export const adapter: EntityAdapter<People> = createEntityAdapter<People>();

export const initialState: State = adapter.getInitialState();

const peopleReducer = createReducer(
  initialState,
  on(PeopleActions.addPeople, (state, {people}) => adapter.addOne(people, state)),
  on(PeopleActions.updatePeople, (state, {people}) => adapter.updateOne(people, state)),
  on(PeopleActions.deletePeople, (state, {id}) => adapter.removeOne(id, state)),
  on(PeopleActions.deleteAllPeople, (state, {}) => adapter.removeAll(state)),
)

export function reducer(state: State | undefined, action: Action) {
  return peopleReducer(state, action);
}

export const {selectAll, selectTotal, selectEntities} = adapter.getSelectors()