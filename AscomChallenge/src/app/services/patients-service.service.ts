import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/interfaces';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private readonly baseUrl = environment.apiBaseUrl;

  // (url sbagliato per simulare errori)
  //private readonly baseUrl = "";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const user = environment.apiUser;
    const password = environment.apiPassword;
    const encodedCredentials = btoa(`${user}:${password}`);
    return new HttpHeaders({
      Authorization: `Basic ${encodedCredentials}`,
    });
  }

  getList(): Observable<Patient[]> {
    const url = `${this.baseUrl}/Patient/GetList`;
    return this.http.get<Patient[]>(url, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<Patient> {
    const url = `${this.baseUrl}/Patient/Get/${id}`;
    return this.http.get<Patient>(url, { headers: this.getAuthHeaders() });
  }

  add(patient: Patient): Observable<any> {
    const url = `${this.baseUrl}/Patient/Add`;
    return this.http.post(url, patient, { headers: this.getAuthHeaders() });
  }

  update(patient: Patient): Observable<any> {
    const url = `${this.baseUrl}/Patient/Update`;
    return this.http.post(url, patient, { headers: this.getAuthHeaders() });
  }
}
