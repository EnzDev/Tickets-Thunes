import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-colored-circle',
  templateUrl: './colored-circle.component.html',
  styleUrls: [ './colored-circle.component.css' ],
})
export class ColoredCircleComponent implements OnInit, OnChanges {

  @Input()
  public color: string | null = null;

  public color$ = new BehaviorSubject<string>(this.color ?? '#fff');

  ngOnChanges(changes: SimpleChanges): void {
    this.color$.next(changes.color.currentValue);
  }

  ngOnInit(): void {
    this.color && this.color$.next(this.color);
  }

}
