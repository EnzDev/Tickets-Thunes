import { People } from '@models/people';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

const addPeople = createAction('[People] Add people', props<{ people: People }>());
const updatePeople = createAction('[People] Set people', props<{ people: Update<People> }>());
const deletePeople = createAction('[People] Delete people', props<{ id: People['id'] }>());
const deleteAllPeople = createAction('[People] Clear peoples');

const startEdit = createAction('[People] Start edit people', props<{ id: People['id'] }>());
const stopEdit = createAction('[People] Stop edit people');

export const PeopleActions = {
  addPeople,
  updatePeople,
  deletePeople,
  deleteAllPeople,

  startEdit,
  stopEdit,
};