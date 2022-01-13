import { Theme } from '@models/theme';
import { createAction, props } from '@ngrx/store';

const setTheme = createAction('[Theme] Set theme', props<{ theme: Theme['theme'] }>());

export const ThemeActions = {
  setTheme,
};