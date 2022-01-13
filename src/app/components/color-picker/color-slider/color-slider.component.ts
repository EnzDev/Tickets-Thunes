import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: [ './color-slider.component.css' ],
})
export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas')
  public readonly canvas ?: ElementRef<HTMLCanvasElement>;

  private selectedHeight: number = 0;
  private selecting = false;

  public readonly width = 30;
  public readonly height = 150;

  @Output()
  public hue: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  public initialHue ?: number | null;

  constructor() { }

  ngAfterViewInit() {
    this.selectedHeight = (this.initialHue ?? 0) * this.height / 360
    this.draw();
  }

  draw() {
    if (!this.canvas) return;
    let canvasContext = this.canvas.nativeElement.getContext('2d')!!;

    canvasContext.clearRect(0, 0, this.width, this.height);

    // Hue wheel
    const gradient = canvasContext.createLinearGradient(0, 0, 0, this.height);

    [ '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000' ].forEach(
      (color, index) => (gradient.addColorStop(index / 6, color)),
    );

    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, this.width, this.height);

    // Draw selection rectangle
    canvasContext.beginPath();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'white';
    canvasContext.rect(0, this.selectedHeight - 5, this.width, 10);
    canvasContext.stroke();
    canvasContext.closePath();
  }

  @HostListener('window:mouseup', [ '$event' ])
  endSelecting(_: MouseEvent) {
    this.selecting = false;

    this.draw();
  }

  startSelecting(evt: MouseEvent) {
    this.selecting = true;
    this.selectedHeight = evt.offsetY;
    this.hue.emit(this.selectedHeight * 360 / this.height);
    this.draw();
  }

  moveColor($event: MouseEvent): void {
    if (!this.selecting) return;
    this.selectedHeight = $event.offsetY;
    this.hue.emit(this.selectedHeight * 360 / this.height);
    this.draw();
  }
}
