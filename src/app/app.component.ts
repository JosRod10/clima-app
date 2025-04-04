import { Component } from '@angular/core';
import { ClimaComponent } from './componentes/clima/clima.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ClimaComponent],
  template: '<app-clima></app-clima>'
})
export class AppComponent {}
