import { ApplicationRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CheckForUpdateService {

  constructor(appRef: ApplicationRef, private updates: SwUpdate, private snackbar: MatSnackBar) {
    if (!environment.production) return;

    updates.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.debug(`Downloading new app version: ${ evt?.version?.hash }`);
          break;
        case 'VERSION_READY':
          console.debug(`Current app version: ${ evt?.currentVersion?.hash }`);
          console.debug(`New app version ready for use: ${ evt?.latestVersion?.hash }`);
          this.updateApplication();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.debug(`:( Failed to install app version '${ evt?.version?.hash }': ${ evt?.error }`);
          break;
      }
    });


    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()` every 10 minutes.
    const everyFiveMinutesOnceAppIsStable$ = concat(
      appRef.isStable.pipe(first(isStable => isStable)),
      interval(10 * 60 * 1000),
    );

    everyFiveMinutesOnceAppIsStable$.pipe(
      tap(() => console.debug('Checking for updates...')),
    ).subscribe(() => updates.checkForUpdate());
  }

  private updateApplication() {
    let snack = this.snackbar.open(
      'An update is available.',
      'Update now ?',
      { duration: 2 * 60 * 1000, politeness: 'polite' },
    );

    snack.onAction()
      .pipe(
        takeUntil(snack.afterDismissed()),
        mergeMap(() => fromPromise(this.updates.activateUpdate()).pipe(
          tap(() => document.location.reload()),
        )),
      ).subscribe();
  }
}