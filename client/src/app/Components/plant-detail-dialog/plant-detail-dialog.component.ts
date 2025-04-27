import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Plant } from '../../Models/plant';

@Component({
  selector: 'app-plant-detail-dialog',
  templateUrl: './plant-detail-dialog.component.html',
  styleUrls: ['./plant-detail-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class PlantDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PlantDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public plant: Plant
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
