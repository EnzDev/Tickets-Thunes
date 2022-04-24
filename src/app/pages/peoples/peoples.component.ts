import { Component, OnInit } from '@angular/core';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectColor, selectPeoples, State } from '@store';
import { EditorColorActions } from '@store/editor-color/editor-color.actions';
import { PeopleActions } from '@store/peoples/people.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-peoples',
  templateUrl: './peoples.component.html',
  styleUrls: [ './peoples.component.css' ],
})
export class PeoplesComponent implements OnInit {
  public peoples$: Observable<People[]> = this.store$.select(selectPeoples);

  public currentColor$ = this.store$.select(selectColor);

  constructor(
    private store$: Store<State>,
  ) { }

  ngOnInit(): void {
  }

  public addPeople({ value: name }: HTMLInputElement, color: string) {
    this.store$.dispatch(PeopleActions.addPeople({
      people: {
        id: Math.floor(Math.random() * 0xFFFFFF),
        name,
        color,
      },
    }));

    this.store$.dispatch(EditorColorActions.nextRandom());
  }

  deletePeople(people: People): void {
    this.store$.dispatch(PeopleActions.deletePeople({ id: people.id }));
  }
}
