import { Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectColorState, State } from '@store';
import { EditorColorActions } from '@store/editor-color/editor-color.actions';
import { combineLatest, interval, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

const SIZE_HEIGHT = 150;
const SIZE_WIDTH = 30;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: [ './color-picker.component.css' ],
})
export class ColorPickerComponent implements OnDestroy {
  public color$ = this.store$.select(selectColorState).pipe(
    map(({ color }) => color),
  );

  private canvasReady$ = new Subject<void>();

  private refreshSub = combineLatest([
    this.store$.select(selectColorState),
    interval(300).pipe( // Regular check until canvas is ready
      takeUntil(this.canvasReady$),
    ),
  ]).pipe(
    filter(() => !!this.canvasColor && !!this.canvasLight),
    tap(() => this.canvasReady$.next()),
  ).subscribe({
    next: ([ { hue, saturation, light } ]) => {
      this.drawHue((hue * SIZE_HEIGHT) / 360);

      let x = saturation * SIZE_HEIGHT;
      let y = SIZE_HEIGHT - 2 * light * SIZE_HEIGHT;

      this.drawPicker(x, y, hue);
    },
  });

  public readonly height = SIZE_HEIGHT;
  public readonly width = SIZE_WIDTH;

  public people$: Observable<People> = this.store$.select(selectColorState).pipe(
    map(({ color }) => (<People>{
      id: -1,
      name: 'Change color',
      color: color,
    })),
  );

  @ViewChild('canvasColor')
  public readonly canvasColor ?: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasLight')
  public readonly canvasLight ?: ElementRef<HTMLCanvasElement>;

  public selecting: false | 'color' | 'light' = false;

  @Input()
  public update: number | null = -1;

  constructor(private store$: Store<State>) {}

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  /**
   * Stop the selection when the mouse is released
   * @param _ unused mouse event
   */
  @HostListener('window:mouseup', [ '$event' ])
  endSelecting(_: MouseEvent) {
    this.selecting = false;
  }

  /**
   * Update the color when the mouse is moved while selecting
   * @param event The mouse event
   */
  move(event: MouseEvent): void {
    if (this.selecting === 'light') this.updateSaturationLight(event);
    if (this.selecting === 'color') this.updateColor(event);
  }

  /**
   * Update the saturation and the light when the mouse is moved while selecting
   * @param evt
   */
  updateSaturationLight(evt: MouseEvent) {
    this.store$.dispatch(EditorColorActions.setSaturation({ saturation: evt.offsetX / SIZE_HEIGHT }));
    this.store$.dispatch(EditorColorActions.setLight({ light: (evt.offsetY - SIZE_HEIGHT) / (-2 * SIZE_HEIGHT) }));
  }

  /**
   * Update the hue when the mouse is moved while selecting
   * @param evt
   */
  updateColor(evt: MouseEvent) {
    this.store$.dispatch(EditorColorActions.setHue({ hue: (evt.offsetY * 360) / SIZE_HEIGHT }));
  }

  /**
   * Chose another color
   */
  nextColor() {
    this.store$.dispatch(EditorColorActions.nextRandom());
  }

  /* ****** DRAWER FUNCTIONS ****** */

  /**
   * Draw the Hue selector
   * @param height The height of the cursor to draw depending on the hue and the height of the selector
   */
  drawHue(height: number) {
    if (!this.canvasColor) return;
    let canvasContext = this.canvasColor.nativeElement.getContext('2d')!!;

    canvasContext.clearRect(0, 0, SIZE_WIDTH, SIZE_HEIGHT);

    // Hue wheel
    const gradient = canvasContext.createLinearGradient(0, 0, 0, SIZE_HEIGHT);

    [ '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000' ].forEach(
      (color, index) => (gradient.addColorStop(index / 6, color)),
    );

    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, SIZE_WIDTH, SIZE_HEIGHT);

    // Draw selection rectangle
    canvasContext.beginPath();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'white';
    canvasContext.rect(0, height - 5, SIZE_WIDTH, 10);
    canvasContext.stroke();
    canvasContext.closePath();
  }

  /**
   * Draw the light and saturation picker
   * @param x The x position of the cursor to draw depending on the saturation and the width of the selector
   * @param y The y position of the cursor to draw depending on the light and the height of the selector
   * @param hue The hue of the color
   */
  drawPicker(x: number, y: number, hue: number) {
    if (!this.canvasLight) return;

    let size = SIZE_HEIGHT;
    let canvasContext = this.canvasLight.nativeElement.getContext('2d')!!;

    canvasContext.fillStyle = `hsla(${ hue }, 100%, 50%, 1)`;
    canvasContext.fillRect(0, 0, size, size);

    const white = canvasContext.createLinearGradient(0, 0, size, 0);
    white.addColorStop(0, '#FFFFFFFF');
    white.addColorStop(1, '#FFFFFF00');

    canvasContext.fillStyle = white;
    canvasContext.fillRect(0, 0, size, size);

    const black = canvasContext.createLinearGradient(0, 0, 0, size);
    black.addColorStop(0, '#00000000');
    black.addColorStop(1, '#000000FF');

    canvasContext.fillStyle = black;
    canvasContext.fillRect(0, 0, size, size);

    canvasContext.strokeStyle = 'white';
    canvasContext.fillStyle = 'white';
    canvasContext.beginPath();

    canvasContext.arc(x, y, 10, 0, 2 * Math.PI);
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
  }

}
