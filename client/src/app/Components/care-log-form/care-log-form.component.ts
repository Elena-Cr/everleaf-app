import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CareLogService } from '../../Services/carelog.service';

@Component({
  selector: 'app-care-log-form',
  templateUrl: './care-log-form.component.html',
})
export class CareLogFormComponent implements OnInit {
  @Input() plantId!: number;
  careLogForm!: FormGroup;
  statusMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private careLogService: CareLogService
  ) {}

  ngOnInit(): void {
    this.careLogForm = this.fb.group({
      action: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
      plantId: [this.plantId, Validators.required],
    });
  }

  submitCareLog(): void {
    if (this.careLogForm.valid) {
      this.careLogService.createCareLog(this.careLogForm.value).subscribe({
        next: () => (this.statusMessage = 'Care activity logged successfully!'),
        error: () => (this.statusMessage = 'Failed to log care activity.'),
      });
    }
  }
}
