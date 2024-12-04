import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientsListComponent } from "./components/patients-list/patients-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PatientsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AscomChallenge';
}
