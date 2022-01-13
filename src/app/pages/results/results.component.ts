import { Component, OnInit } from '@angular/core';
import { People } from '@models/people';
import { Store } from '@ngrx/store';
import { selectNoteLinks, selectNotes, selectPeoples, State } from '@store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Sum {
  people: People,
  value: number,
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: [ './results.component.css' ],
})
export class ResultsComponent implements OnInit {

  private notes$ = this.store$.select(selectNotes);
  private peoples$ = this.store$.select(selectPeoples);
  private links$ = this.store$.select(selectNoteLinks);

  public sums$: Observable<{ peoples: Sum[]; total: number }> = combineLatest([
    this.notes$,
    this.peoples$,
    this.links$,
  ]).pipe(
    map(([ notes, peoples, links ]) => {
      let peopleMap: { [p: number]: Sum } = {};

      for (const note of notes) {
        // Seek all notes links
        const cLinks = links.filter(l => l.note_id === note.id);
        const concerned = peoples.filter(p => cLinks.map(l => l.people_id).includes(p.id));
        for (let p of concerned) {
          peopleMap = {
            ...peopleMap,
            [p.id]: { people: p, value: (peopleMap[p.id]?.value ?? 0) + note.price / concerned.length },
          };
        }
      }

      const total = notes.reduce((acc, n) => acc + n.price, 0);

      return {
        total,
        peoples: Object.values(peopleMap).map((x) => ({
          ...x,
          value: this.round(x.value),
        })),
      };
    }),
  );

  public diff$ = this.sums$.pipe(
    map(sums => sums.total - sums.peoples.reduce((acc, n) => acc + n.value, 0)),
    map(diff => this.round(diff ?? 0, 3) ?? 0),
    map(diff => ({ ok: diff === 0, v: diff })),
  );

  constructor(
    private store$: Store<State>,
  ) { }

  public round(value: number, prec ?: number): number {
    if (value < Number('1e-5')) return 0;
    return Number(`${ Math.round(Number(`${ value.toString() }e${ prec ?? 2 }`)) }e-${ prec ?? 2 }`);
  }

  ngOnInit(): void {
  }

}
