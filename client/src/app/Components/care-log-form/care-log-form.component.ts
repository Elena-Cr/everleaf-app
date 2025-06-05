import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { trigger, state, style, transition, animate} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CareLogService } from '../../Services/carelog.service';
import { CareLog } from '../../Models/care-log';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
  ],
  templateUrl: './care-log-form.component.html',
  styleUrls: ['./care-log-form.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('in', style({ opacity: 1 })),
      transition('void => in', [animate('300ms ease-in')]),
    ]),
  ],
})
export class CareLogFormComponent implements OnInit {
  careLogForm!: FormGroup;
  statusMessage = '';

  constructor(
    private fb: FormBuilder,
    private careLogService: CareLogService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CareLogFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { plantId: number }
  ) {}

  ngOnInit(): void {
    this.careLogForm = this.fb.group({
      type: ['', [Validators.required]],
      date: ['', [Validators.required, this.dateNotInFutureValidator()]],
      plantId: [this.data.plantId, Validators.required],
      notes: ['', [Validators.maxLength(500)]],
    });
  }

  private dateNotInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const today = new Date();
      const inputDate = new Date(control.value);
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  // Convert UTC date to local date string in ISO format - ensures consistent data storage and display
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
        date: this.toLocalDate(formValue.date),
      };

      this.careLogService.createCareLog(payload).subscribe({
        next: () => {
          this.snackBar.open('✅ Care log submitted!', 'Close', {duration: 3000});
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('❌ Failed to submit care log.', 'Close', {duration: 3000});
        },
      });
    }
  }
}
