import { Action, ActionReducer } from '@ngrx/store';

const localStorageKey = '__application_store__';

function setSavedState(state: any, localStorageKey: string) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}

function getSavedState(localStorageKey: string): any | null {
  const storage = localStorage.getItem(localStorageKey);
  return !!storage ? JSON.parse(storage) : null;
}

export function storageMetaReducer<S, A extends Action = Action>(reducer: ActionReducer<S, A>): ActionReducer<any> {
  let onInit = true; // after load/refresh…

  return function (state: S, action: A): S {
    // reduce the nextState.
    const nextState = reducer(state, action);
    // init the application state.
    if (onInit) {
      onInit = false;
      return getSavedState(localStorageKey) ?? nextState;
    }

    // save the next state to the application storage.
    setSavedState(nextState, localStorageKey);

    return nextState;
  } as ActionReducer<S>;
}