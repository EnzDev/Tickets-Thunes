import { Component } from '@angular/core';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectEditedPeopleId, selectPeoples, State } from '@store';
import { EditorColorActions } from '@store/editor-color/editor-color.actions';
import { PeopleActions } from '@store/peoples/people.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-peoples',
  templateUrl: './peoples.component.html',
  styleUrls: [ './peoples.component.css' ],
})
export class PeoplesComponent {
  public peoples$: Observable<People[]> = this.store$.select(selectPeoples);
  public edited$: Observable<People['id'] | undefined> = this.store$.select(selectEditedPeopleId);

  constructor(
    private store$: Store<State>,
  ) { }

  deletePeople(people: People): void {
    this.store$.dispatch(PeopleActions.deletePeople({ id: people.id }));
  }

  startEditPeople(people: People): void {
    this.store$.dispatch(EditorColorActions.setColor({color: people.color}))
    this.store$.dispatch(PeopleActions.startEdit({ id: people.id }));
  }
}
