import { Note } from '@models/note';
import { People } from '@models/people';

export interface NotePeopleLink {
  note_id: Note['id'],
  people_id: People['id'],
}

export const getId = (link: NotePeopleLink) => `${ link.people_id }_${ link.note_id }`
