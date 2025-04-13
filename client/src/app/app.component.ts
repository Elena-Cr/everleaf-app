import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CareLogFormComponent } from './Components/care-log-form/care-log-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CareLogFormComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
