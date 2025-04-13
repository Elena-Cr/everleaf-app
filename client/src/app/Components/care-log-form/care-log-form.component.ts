import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CareLogService } from '../../Services/carelog.service';
import { CareLog } from '../../Models/care-log';

@Component({
  selector: 'app-care-log-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './care-log-form.component.html',
  styleUrls: ['./care-log-form.component.css'],
})
export class CareLogFormComponent implements OnInit {
  @Input() plantId!: number;

  careLogForm!: FormGroup;
  statusMessage = '';

  constructor(
    private fb: FormBuilder,
    private careLogService: CareLogService
  ) {}

  ngOnInit(): void {
    this.careLogForm = this.fb.group({
      type: ['', Validators.required],
      date: [new Date(), Validators.required], // ✅ set current date
      notes: [''],
      plantId: [this.plantId, Validators.required],
    });
  }

  toLocalDate(date: Date): string {
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return `${localISO}T00:00:00`;
  }

  submitCareLog(): void {
    if (this.careLogForm.valid) {
      const formValue = this.careLogForm.value;

      const payload: CareLog = {
        ...formValue,
        date: this.toLocalDate(formValue.date), // ✅ convert the selected date properly
      };

      this.careLogService.createCareLog(payload).subscribe({
        next: () => (this.statusMessage = '✅ Care log submitted!'),
        error: () => (this.statusMessage = '❌ Failed to submit care log.'),
      });
    }
  }
}
