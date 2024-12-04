import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Patient } from '../../interfaces/interfaces';
import { PatientsService } from '../../services/patients-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-patients-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './patients-detail.component.html',
  styleUrl: './patients-detail.component.scss'
})
export class PatientsDetailComponent {
  patient: Patient;
  isSaving = false;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['name', 'value', 'alarm'];


  constructor(
    public dialogRef: MatDialogRef<PatientsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    private patientsService: PatientsService
  ) {
    this.patient = { ...data.patient };
  }

  save() {
    this.isSaving = true;
    this.errorMessage = null;

    this.patientsService.update(this.patient).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close('updated');
      },
      error: (err) => {
        console.error('Error during update:', err);
        this.errorMessage = 'Error while saving. Please try again.';
        this.isSaving = false;
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
