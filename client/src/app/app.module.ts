import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CareLogFormComponent } from './Components/care-log-form/care-log-form.component';
import { ProblemFormComponent } from './Components/problem-form/problem-form.component';

@NgModule({
  declarations: [CareLogFormComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppComponent,
    ProblemFormComponent,
  ],
  providers: [],
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule {}
