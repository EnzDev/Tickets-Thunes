import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectColor, State } from '@store';
import { EditorColorActions } from '@store/editor-color/editor-color.actions';
import { PeopleActions } from '@store/peoples/people.actions';

@Component({
  selector: 'app-new-people',
  templateUrl: './new-people.component.html',
})
export class NewPeopleComponent {
  public currentColor$ = this.store$.select(selectColor);

  constructor(
    private store$: Store<State>,
  ) { }

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
}
