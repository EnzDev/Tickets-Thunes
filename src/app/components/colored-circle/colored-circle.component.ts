import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-colored-circle',
  templateUrl: './colored-circle.component.html',
  styleUrls: [ './colored-circle.component.css' ],
})
export class ColoredCircleComponent implements OnInit, OnChanges {

  @Input()
  public color: string | null = '#fff';

  public color$ = new Subject<string>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.color$.next(changes.color.currentValue);
  }

  ngOnInit(): void {
    this.color && this.color$.next(this.color);
  }

}
