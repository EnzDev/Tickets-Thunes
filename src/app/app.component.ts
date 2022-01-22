import { Component, ElementRef, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { selectTheme, State } from '@store';
import { ThemeActions } from '@store/theme/theme.actions';
import html2canvas from 'html2canvas';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
})
export class AppComponent {
  title = 'TicketThunes';
  public darkMode$ = this.store$.select(selectTheme).pipe(
    map((theme) => theme === 'dark'),
  );
  public shouldOpen = false;

  @ViewChild('saveScreen', { read: ElementRef })
  public saveScreen ?: ElementRef;

  constructor(private mo: MediaObserver, private store$: Store<State>) {
  }

  get mediaShort() { return this.mo.isActive('lt-md'); }

  toggleSideNav(): void {
    this.shouldOpen = !this.shouldOpen;
  }

  setTheme($event: MatSlideToggleChange): void {
    this.store$.dispatch(ThemeActions.setTheme({
      theme: $event.checked ? 'dark' : 'light',
    }));
  }

  /**
   * Generate a canvas from the DOM using html2canvas
   * And export as image
   */
  public async save() {
    let canvas = await html2canvas(this.saveScreen!.nativeElement, {
      height: Array.from(this.saveScreen!.nativeElement.children).map((value: any) => value.offsetHeight).reduce((
        a,
        b,
      ) => a + b),
      windowHeight: Array.from(this.saveScreen!.nativeElement.children).map((value: any) => value.offsetHeight).reduce(
        (a, b) => a + b),
      allowTaint: false,
      logging: true,
      removeContainer: false,
      scale: 2,
    });

    const a = document.createElement('a');
    const now = new Date();
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    const time = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
    ].join('h')

    // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
    a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
    a.download = `ticket-thunes_${ date }_${ time }.jpg`;
    a.click();

    a.remove();
    canvas.remove();
  }
}
