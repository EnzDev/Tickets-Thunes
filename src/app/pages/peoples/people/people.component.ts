import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { People } from '@models/people';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: [ './people.component.css' ],
})
export class PeopleComponent implements OnInit, OnChanges {
  @Input()
  public people !: People;
  public peopleStyle: any;

  @Input()
  public grayed: boolean = false;

  @Output()
  public clicked = new EventEmitter<void>()

  constructor() {

  }

  ngOnInit(): void {
    this.peopleStyle = {
      'background-color': this.people.color,
      'color': this.getBestColor(this.people.color),
    };

    if(this.grayed) {
      this.peopleStyle = {
        'background-color': this.grayColor(this.people.color),
        'color': this.getBestColor(this.grayColor(this.people.color)),
      }
    }
  }

  ngOnChanges() {
    this.peopleStyle = {
      'background-color': this.people.color,
      'color': this.getBestColor(this.people.color),
    };

    if(this.grayed) {
      this.peopleStyle = {
        'background-color': this.grayColor(this.people.color),
        'color': this.getBestColor(this.grayColor(this.people.color)),
      }
    }
  }

  /**
   * Use light reflectancy to estimate if we need to use black or white
   * as foreground color on the provided color.
   * @see https://www.designworkplan.com/read/signage-and-color-contrast for reference
   * @param color The background color to match
   * @private
   */
  private getBestColor(color: string): string {
    let rHex, gHex, bHex;
    if (color.length === 4)
      [ rHex, gHex, bHex ] = color.slice(1, 4);
    else {
      rHex = color.slice(1, 3);
      gHex = color.slice(3, 5);
      bHex = color.slice(5, 7);
    }

    const [ rv, gv, bv ] = [ rHex, gHex, bHex ].map(c => Number(`0x${ c }`) / 255);

    const lr = 21.25 * rv + 71.54 * gv + 7.21 * bv;
    return lr > 70 ? '#000' : '#fff';
  }

  private grayColor(color: string): string {
    let rHex, gHex, bHex;
    if (color.length === 4)
      [ rHex, gHex, bHex ] = color.slice(1, 4);
    else {
      rHex = color.slice(1, 3);
      gHex = color.slice(3, 5);
      bHex = color.slice(5, 7);
    }

    const [ rv, gv, bv ] = [ rHex, gHex, bHex ].map(c => Number(`0x${ c }`) / 255);
    const mean = Math.floor((rv + gv + bv) / 3).toString(16).padStart(2, '0')
    return `0x${mean}${mean}${mean}`
  }
}
