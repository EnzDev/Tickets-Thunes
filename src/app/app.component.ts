import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { selectTheme, State } from '@store';
import { ThemeActions } from '@store/theme/theme.actions';
import html2canvas from 'html2canvas';
import { Observable, of, Subscription } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
})
export class AppComponent implements OnDestroy {

  title = 'TicketThunes';
  public darkMode$ = this.store$.select(selectTheme).pipe(
    map((theme) => theme === 'dark'),
  );
  public shouldOpen = false;

  @ViewChild('saveScreen', { read: ElementRef })
  public saveScreen ?: ElementRef;

  private sub ?: Subscription;

  get mediaShort() { return this.mo.isActive('lt-md'); }

  constructor(private mo: MediaObserver, private store$: Store<State>) {
  }

  toggleSideNav(): void {
    this.shouldOpen = !this.shouldOpen;
  }

  setTheme($event: MatSlideToggleChange): void {
    this.store$.dispatch(ThemeActions.setTheme({
      theme: $event.checked ? 'dark' : 'light',
    }));
  }

  public save() {
    if (!this.sub || this.sub.closed) {
      this.sub = this.makeSave().subscribe();
    }
  }

  private makeSave(): Observable<void> {
    if (this.saveScreen) {
      return fromPromise(html2canvas(this.saveScreen.nativeElement, {
        height: Array.from(this.saveScreen.nativeElement.children).map((value: any) => value.offsetHeight).reduce((a,b) => a + b),
        windowHeight: Array.from(this.saveScreen.nativeElement.children).map((value: any) => value.offsetHeight).reduce((a,b) => a + b),
        allowTaint: true,
        logging: true,
        removeContainer: false,
        scale: 2,
      })).pipe(
        map((canvas) => {
          const a = document.createElement('a');
          const now = new Date();
          const date = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0'),
          ].join('-');

          // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
          a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
          a.download = `ticket-thunes_${ date }.jpg`;
          a.click();
        }),
      );
    } else {
      return of();
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
