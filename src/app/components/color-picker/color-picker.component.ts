import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { People } from '@models/people';
import { hsla, parseToHsla, toHex } from 'color2k';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: [ './color-picker.component.css' ],
})
export class ColorPickerComponent implements AfterViewInit {
  @Output()
  public selectedColor = new EventEmitter<string>();

  @Input()
  public initialColor ?: string | null;

  public hue$: Subject<number> = new Subject();
  public satLight$: Subject<[ number, number ]> = new Subject();

  public color$ = combineLatest([ this.hue$, this.satLight$ ]).pipe(
    map(([ hue, [ sat, light ] ]) => toHex(hsla(hue, sat, light, 1))),
  );

  public people$: Observable<People> = this.color$.pipe(
    map((color) => (<People>{
      id: -1,
      name: 'Color',
      color: color,
    })),
  );

  constructor() { }

  ngAfterViewInit(): void {
    // Check for initial color and retrieve hue and lightness
    const [ hue, sat, light ] = parseToHsla(this.initialColor ?? '#fff');

    this.hue$.next(hue);
    this.satLight$.next([ sat, light ]);
  }

  setHue($event: number): void {
    this.hue$.next($event);
  }

  setSL($event: [ number, number ]): void {
    this.satLight$.next($event);
  }
}
