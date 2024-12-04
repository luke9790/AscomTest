import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../interfaces/interfaces';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PatientsService } from '../../services/patients-service.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientsDetailComponent } from '../patients-detail/patients-detail.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['familyName', 'givenName', 'birthDate', 'sex', 'parametersCount', 'alarm'];
  activeFilters: { column: string; value: string }[] = [];
  patients = new MatTableDataSource<Patient>([]);
  isLoading = 0; // Per gestire la vista dinamicamente (0 loading, 1 recupero ok, 2 errore recupero)
  errorMessage: string | null = null;
  

  @ViewChild(MatSort) sort!: MatSort;

  filterableColumns = [
    { value: 'familyName', viewValue: 'Surname' },
    { value: 'givenName', viewValue: 'Name' },
    { value: 'birthDate', viewValue: 'Birth Date' },
    { value: 'sex', viewValue: 'Sex' },
    { value: 'alarm', viewValue: 'Status' },
  ];

  private filterSubject = new Subject<{ index: number; column: string; value: string }>();

  constructor(
    private patientsService: PatientsService,
    private dialog: MatDialog
  ) {
    this.filterSubject.pipe(debounceTime(300)).subscribe(({ index, column, value }) => {
      this.activeFilters[index] = { column, value };
      this.applyFilters();
    });

    this.patients.filterPredicate = (data: Patient, filter: string): boolean => {
      const filters = JSON.parse(filter) as { column: string; value: string }[];
      return filters.every(filter => {
        const column = filter.column;
        const value = filter.value.toLowerCase();
        switch (column) {
          case 'familyName':
            return data.familyName?.toLowerCase().startsWith(value);
          case 'givenName':
            return data.givenName?.toLowerCase().startsWith(value);
          case 'birthDate': {
            if (!value) return true;
          
            const formattedDate = data.birthDate.split('T')[0];
            const filterValue = value.trim();
          
            if (filterValue.startsWith('>')) {
              const dateValue = filterValue.slice(1).trim();
              if (!dateValue) return true;
              return formattedDate > dateValue;
            } else if (filterValue.startsWith('<')) {
              const dateValue = filterValue.slice(1).trim();
              if (!dateValue) return true;
              return formattedDate < dateValue;
            } else {
              return formattedDate.startsWith(filterValue);
            }
          }
          case 'sex':
            return data.sex?.toLowerCase() === value || value === '';
          case 'alarm':
            if (!value) return true;
            return (value === 'ok' && !this.hasAlarm(data)) || (value === 'warning' && this.hasAlarm(data));
          default:
            return true;
        }
      });
    };
  }

  ngOnInit() {
    this.fetchPatients();
  }

  ngAfterViewInit() {
    this.patients.sort = this.sort;

    this.patients.sortData = (data: Patient[], sort: MatSort) => {
      const active = sort.active;
      const direction = sort.direction;

      return data.sort((a, b) => {
        let valueA: any = (a as any)[active];
        let valueB: any = (b as any)[active];


        if (active === 'birthDate') {
          valueA = new Date(a.birthDate).getTime();
          valueB = new Date(b.birthDate).getTime();
        } else if (active === 'parametersCount') {
          valueA = a.parameters?.length || 0;
          valueB = b.parameters?.length || 0;
        } else if (active === 'alarm') {
          valueA = this.hasAlarm(a) ? 1 : 0;
          valueB = this.hasAlarm(b) ? 1 : 0;
        } else {
          valueA = (valueA || '').toString().toLowerCase();
          valueB = (valueB || '').toString().toLowerCase();
        }

        const comparator = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return direction === 'asc' ? comparator : -comparator;
      });
    };
  }

  ngAfterViewChecked() {
    if (this.patients && this.sort && this.patients.sort !== this.sort) {
      this.patients.sort = this.sort;
    }
  }
  

  fetchPatients() {
    this.isLoading = 0;
    this.errorMessage = null;

    this.patientsService.getList().subscribe({
      next: (data) => {
        //console.log('Data received:', data);
        this.patients.data = data;
        this.isLoading = 1;
      },
      error: (err) => {
        console.error('Error while fetching patients:', err);
        this.errorMessage = 'Unable to load patients. Please try again later.';
        this.isLoading = 2;
      },
    });
  }

  addFilter() {
    if (this.activeFilters.length < this.filterableColumns.length) {
      this.activeFilters.push({ column: '', value: '' });
    }
  }

  removeFilter(index: number) {
    this.activeFilters.splice(index, 1);
    this.applyFilters();
  }

  applyFilters() {
    this.patients.filter = JSON.stringify(this.activeFilters);
  }

  updateFilter(index: number, column: string, value: string) {
    this.filterSubject.next({ index, column, value });
  }

  hasAlarm(patient: Patient): boolean {
    return patient.parameters.some(p => p.alarm);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  openDetailDialog(patient: Patient) {
    const dialogRef = this.dialog.open(PatientsDetailComponent, {
      width: '600px',
      data: { patient },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.fetchPatients();
      }
    });
  }
  
}
