import { createAction, props } from '@ngrx/store';

const setHue = createAction('[ColorSelector] Set hue', props<{ hue: number }>());
const setSaturation = createAction('[ColorSelector] Set saturation', props<{ saturation: number }>());
const setLight = createAction('[ColorSelector] Set light', props<{ light: number }>());

const nextRandom = createAction('[ColorSelector] New random');

export const EditorColorActions = {
  setHue, setSaturation, setLight,
  nextRandom,
};