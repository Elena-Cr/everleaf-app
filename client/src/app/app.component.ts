import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CareLogFormComponent } from './Components/care-log-form/care-log-form.component';
import { ProblemFormComponent } from './Components/problem-form/problem-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CareLogFormComponent, ProblemFormComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
