import { Action, createReducer, on } from '@ngrx/store';
import { EditorColorActions } from '@store/editor-color/editor-color.actions';
import { hsla, toHex } from 'color2k';

export const FEATURE_KEY = 'color-picker';

export interface State {
  color: string,
  hue: number,
  light: number,
  saturation: number,
}

const randomNormals = () => {
  let u1 = 0, u2 = 0;
  //Convert [0,1) to (0,1)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const R = Math.sqrt(-2.0 * Math.log(u1));
  const ome = 2.0 * Math.PI * u2;
  return [ R * Math.cos(ome), R * Math.sin(ome) ];
};

const randomSkewNormal = (eps: number, ome: number, alph = 0) => {
  const [ u0, v ] = randomNormals();
  if (alph === 0) {
    return eps + ome * u0;
  }
  const et = alph / Math.sqrt(1 + alph * alph);
  const u1 = et * u0 + Math.sqrt(1 - et * et) * v;
  const z = u0 >= 0 ? u1 : -u1;
  return eps + ome * z;
};


function getStateRandomColor(): State {
  let light = randomSkewNormal(0.35, .15);
  while (light < 0 || light > 0.5) light = randomSkewNormal(0.35, .15);

  let saturation = randomSkewNormal(0.7, 0.25);
  while (saturation < 0 || saturation > 1) saturation = randomSkewNormal(0.7, 0.25);

  let hue = Math.floor(360 * Math.random());

  return {
    hue, saturation, light,
    color: toHex(hsla(hue, saturation, light, 1)),
  };
}

export const initialState: State = getStateRandomColor();

const editorColorReducer = createReducer(
  initialState,
  on(EditorColorActions.setSaturation, (state, { saturation }) => ({
    ...state,
    saturation,
    color: toHex(hsla(state.hue, saturation, state.light, 1)),
  })),
  on(EditorColorActions.setHue, (state, { hue }) => ({
    ...state,
    hue,
    color: toHex(hsla(hue, state.saturation, state.light, 1)),
  })),
  on(EditorColorActions.setLight, (state, { light }) => ({
    ...state,
    light,
    color: toHex(hsla(state.hue, state.saturation, light, 1)),
  })),
  on(EditorColorActions.nextRandom, () => getStateRandomColor()),
);

export function reducer(state: State | undefined, action: Action) {
  return editorColorReducer(state, action);
}
