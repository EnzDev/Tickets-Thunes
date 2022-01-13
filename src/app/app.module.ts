import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { effects, metaReducers, reducers } from '@store';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { LightnessPointerComponent } from './components/color-picker/lightness-pointer/lightness-pointer.component';
import { ColoredCircleComponent } from './components/colored-circle/colored-circle.component';
import { PeopleComponent } from './pages/peoples/people/people.component';
import { PeoplesComponent } from './pages/peoples/peoples.component';
import { IfNotNullDirective } from './directives/if-not-null.directive';
import { TicketComponent } from './pages/ticket/ticket.component';
import { NoteComponent } from './pages/ticket/note/note.component';
import { ResultsComponent } from './pages/results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    PeopleComponent,
    PeoplesComponent,
    ColorPickerComponent,
    ColorSliderComponent,
    LightnessPointerComponent,
    ColoredCircleComponent,
    IfNotNullDirective,
    TicketComponent,
    NoteComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatToolbarModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
