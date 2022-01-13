import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

type Point = { x: number, y: number }

@Component({
  selector: 'app-lightness-pointer',
  templateUrl: './lightness-pointer.component.html',
  styleUrls: [ './lightness-pointer.component.css' ],
})
export class LightnessPointerComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvas')
  public readonly canvas ?: ElementRef<HTMLCanvasElement>;

  @Input()
  public hue: number = 0;

  @Input()
  public initialSL ?: [ number, number ] | null;

  @Output()
  public color: EventEmitter<[ number, number ]> = new EventEmitter<[ number, number ]>();

  public readonly size = 150;

  private selectedPoint: Point = { x: 0, y: 0 };
  private selecting = false;

  constructor() { }

  ngOnInit(): void {
    if (!!this.initialSL) {
      const [ saturation, lightness ] = this.initialSL;
      const x = saturation * this.size;
      const y = -(2 * this.size) * lightness + this.size;

      this.selectedPoint = { x, y };
    }
  }

  ngAfterViewInit() {
    this.pushColor();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.hue?.currentValue) this.hue = changes.hue.currentValue

    this.pushColor();
    this.draw();
  }

  draw() {
    if (!this.canvas) return;
    let canvasContext = this.canvas.nativeElement.getContext('2d')!!;

    canvasContext.fillStyle = `hsla(${ this.hue }, 100%, 50%, 1)`;
    canvasContext.fillRect(0, 0, this.size, this.size);

    const white = canvasContext.createLinearGradient(0, 0, this.size, 0);
    white.addColorStop(0, '#FFFFFFFF');
    white.addColorStop(1, '#FFFFFF00');

    canvasContext.fillStyle = white;
    canvasContext.fillRect(0, 0, this.size, this.size);

    const black = canvasContext.createLinearGradient(0, 0, 0, this.size);
    black.addColorStop(0, '#00000000');
    black.addColorStop(1, '#000000FF');

    canvasContext.fillStyle = black;
    canvasContext.fillRect(0, 0, this.size, this.size);

    canvasContext.strokeStyle = 'white';
    canvasContext.fillStyle = 'white';
    canvasContext.beginPath();

    canvasContext.arc(
      this.selectedPoint.x,
      this.selectedPoint.y,
      10,
      0,
      2 * Math.PI,
    );
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
  }

  @HostListener('window:mouseup', [ '$event' ])
  endSelecting(_: MouseEvent) {
    this.selecting = false;

    this.draw();
  }

  startSelecting($event: MouseEvent) {
    this.selecting = true;
    this.selectedPoint = {
      x: $event.offsetX,
      y: $event.offsetY,
    };

    this.pushColor();
    this.draw();
  }

  moveColor($event: MouseEvent): void {
    if (!this.selecting) return;
    this.selectedPoint = {
      x: $event.offsetX,
      y: $event.offsetY,
    };

    this.pushColor();
    this.draw();
  }

  private pushColor(): void {
    const { x, y } = this.selectedPoint;
    this.color.emit([ x / this.size, (y - this.size) / (-2 * this.size) ]);
  }
}
