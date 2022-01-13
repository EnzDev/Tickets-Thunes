import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectNotes, State } from '@store';
import { NotePeopleLinkActions } from '@store/note-people-link/note-people-link.actions';
import { NotesActions } from '@store/notes/notes.actions';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: [ './ticket.component.css' ],
})
export class TicketComponent {
  public notes$ = this.store$.select(selectNotes);

  constructor(
    private store$: Store<State>,
  ) { }

  testAdd($event: InputEvent, elm: HTMLInputElement, text: HTMLInputElement) {
    if($event.inputType === 'insertLineBreak') {
      this.addNote(elm, text);
    }
  }

  addNote(elm: HTMLInputElement, text: HTMLInputElement): void {
    const price = elm.valueAsNumber;
    const hasText = !text.value.match(/^\W*$/)
    const details = hasText ? text.value : undefined;

    elm.value = '';
    text.value = '';

    // Give focus to input
    (hasText ? text : elm)?.focus();

    this.store$.dispatch(NotesActions.addNote({ price, details }));
  }

  clear(): void {
    this.store$.dispatch(NotesActions.deleteAllNotes());
    this.store$.dispatch(NotePeopleLinkActions.deleteAll());
  }
}
