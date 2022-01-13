import { Component, OnInit } from '@angular/core';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectPeoples, State } from '@store';
import { PeopleActions } from '@store/peoples/people.actions';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-peoples',
  templateUrl: './peoples.component.html',
  styleUrls: [ './peoples.component.css' ],
})
export class PeoplesComponent implements OnInit {
  public peoples$: Observable<People[]> = this.store$.select(selectPeoples);

  public currentColor$ = new BehaviorSubject<string>(this.getRandomColor());

  constructor(
    private store$: Store<State>,
  ) { }

  ngOnInit(): void {
  }

  getRandomColor() {
    return '#' + [ 0, 0, 0 ]
      .map(() => Math.floor(0xff * Math.random()))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('');
  }

  public addPeople(newPeopleInput: HTMLInputElement) {
    this.store$.dispatch(PeopleActions.addPeople({
      people: {
        id: Math.floor(Math.random() * 0xFFFF),
        name: newPeopleInput.value,
        color: this.currentColor$.value,
      },
    }));
    this.currentColor$.next(this.getRandomColor());
  }

  deletePeople(people: People): void {
    this.store$.dispatch(PeopleActions.deletePeople({id: people.id}))
  }
}
