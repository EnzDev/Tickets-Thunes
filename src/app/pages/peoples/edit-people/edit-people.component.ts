import { Component, Input } from '@angular/core';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectColor, State } from '@store';
import { EditorColorActions } from '@store/editor-color/editor-color.actions';
import { PeopleActions } from '@store/peoples/people.actions';

@Component({
  selector: 'app-edit-people',
  templateUrl: './edit-people.component.html',
})
export class EditPeopleComponent {

  @Input()
  public id: People['id'] = 0xDEAD_BEEF;

  @Input()
  public name: People['name'] = '';

  public currentColor$ = this.store$.select(selectColor);

  constructor(
    private store$: Store<State>,
  ) { }

  stopEditPeople(): void {
    this.store$.dispatch(PeopleActions.stopEdit());
  }

  savePeople(color: string): void {
    this.store$.dispatch(PeopleActions.updatePeople({
      people: {
        id: this.id,
        changes: { name: this.name, color },
      },
    }));
    this.store$.dispatch(EditorColorActions.nextRandom());
  }
}
