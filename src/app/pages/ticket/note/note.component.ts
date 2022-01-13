import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Note } from '@models/note';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectNoteById, selectNotesByNoteId, selectPeoples, selectPeoplesById, State } from '@store';
import { NotePeopleLinkActions } from '@store/note-people-link/note-people-link.actions';
import { NotesActions } from '@store/notes/notes.actions';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: [ './note.component.css' ],
})
export class NoteComponent implements OnInit, OnChanges {

  @Input()
  public id ?: Note['id'];
  public id$ = new BehaviorSubject<Note['id'] | null>(null);

  public note$ = this.id$.pipe(
    filter(id => !!id),
    switchMap((id) => this.store$.select(selectNoteById(id!))),
  );

  public selectedPeoples$: Observable<People[]> = combineLatest([
    this.note$,
    this.store$.select(selectPeoplesById),
  ]).pipe(
    filter(([ note ]) => !!note),
    switchMap(([ note, peoples ]) => this.store$.select(selectNotesByNoteId(note!.id))
      .pipe(map((noteLinks) => noteLinks
        .map((link) => peoples[link.people_id])
        .filter(p => !!p) as People[],
      )),
    ),
  );

  public otherPeople$: Observable<People[]> = combineLatest([
    this.note$,
    this.store$.select(selectPeoples),
  ]).pipe(
    filter(([ note ]) => !!note),
    switchMap(([ note, peoples ]) => this.store$.select(selectNotesByNoteId(note!.id))
      .pipe(map((noteLinks) => {
        const ids = noteLinks.map((link) => link.people_id);
        return peoples.filter(people => !ids.includes(people.id));
      })),
    ),
  );


  constructor(
    private store$: Store<State>,
  ) { }

  ngOnInit(): void {
    if (!!this.id) {
      this.id$.next(this.id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.id?.currentValue) {
      this.id$.next(changes.id.currentValue);
    }
  }

  removePeople(people ?: People): void {
    if (!people) return;
    this.store$.dispatch(NotePeopleLinkActions.removePeople({ note_id: this.id!, people_id: people.id }));
  }

  addPeople(people ?: People): void {
    if (!people) return;
    this.store$.dispatch(NotePeopleLinkActions.addPeople({ note_id: this.id!, people_id: people.id }));
  }

  delete(): void {
    this.store$.dispatch(NotesActions.deleteNote({ id: this.id! }));

  }
}
