import { Theme } from '@models/theme';
import { createAction, props } from '@ngrx/store';

const setTheme = createAction('[Theme] Set theme', props<{ theme: Theme['theme'] }>());
const setScreenShot = createAction('[Theme] Set screenshot', props<{ screenshot: boolean }>());

export const ThemeActions = {
  setTheme,
  setScreenShot,
};