import { Theme } from '@models/theme';
import { Action, createReducer, on } from '@ngrx/store';
import { ThemeActions } from './theme.actions';

export const FEATURE_KEY = 'theme';

export interface State extends Theme {}


export const initialState: State = {
  theme: 'light',
};

const themeReducer = createReducer(
  initialState,
  on(ThemeActions.setTheme, (state, { theme }) => ({
    ...state,
    theme: theme,
  })),
  on(ThemeActions.setScreenShot, (state, { screenshot }) => ({
    ...state,
    screenshot: screenshot,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return themeReducer(state, action);
}
