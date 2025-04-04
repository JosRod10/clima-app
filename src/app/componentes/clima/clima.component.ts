import { Component, OnInit } from '@angular/core';
import { ClimaService } from '../../servicios/clima.service';
import { GeolocationService } from '../../servicios/geolocation.service';
import { Clima } from '../../interfaces/clima';
import { Forecast } from '../../interfaces/forecast';
import { ProcessedForecast } from '../../interfaces/processedforecast';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports:[FormsModule, CommonModule],
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.scss']
})
export class ClimaComponent implements OnInit {
  currentWeather?: Clima;
  forecast: ProcessedForecast[] = [];
  city = '';
  darkMode = false;
  loading = false;
  error = '';

  constructor(
    private weatherService: ClimaService,
    private geolocation: GeolocationService
  ) {}

  ngOnInit(): void {
    this.getLocation();
  }

  // Cambia las llamadas a subscribe en tu componente por esta estructura:

search(): void {
  if (!this.city.trim()) return;
  
  this.loading = true;
  this.error = '';
  
  this.weatherService.getCurrentWeather(this.city).subscribe({
    next: (data: any) => {  // Cambia 'any' por 'Weather' si tienes la interfaz
      this.currentWeather = data as Clima; // Conversión de tipo explícita
      this.loadForecast();
    },
    error: (err: any) => {
      this.error = 'Ciudad no encontrada. Intenta con otro nombre.';
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}

// Aplica el mismo patrón para loadForecast y getLocation

  // Componente completo con tipado seguro
loadForecast(): void {
  this.weatherService.getForecast(this.city).subscribe({
    next: (data: unknown) => {  // unknown es más seguro que any
      this.forecast = this.processForecast(data as Forecast);
      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {  // Tipo específico para errores HTTP
      this.error = 'Error al cargar el pronóstico: ' + err.message;
      this.loading = false;
    }
  });
}

getLocation(): void {
  this.loading = true;
  this.geolocation.getCurrentPosition().then(
    (coords) => {
      this.weatherService.getWeatherByCoords(coords.latitude, coords.longitude)
        .subscribe({
          next: (data: unknown) => {
            this.currentWeather = data as Clima;
            this.city = this.currentWeather.name;
            this.loadForecast();
          },
          error: (err) => {
            this.error = 'Error al obtener clima por ubicación';
            this.loading = false;
          }
        });
    },
    (err) => {
      this.error = 'Debes permitir acceso a tu ubicación';
      this.loading = false;
    }
  );
}

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute(
      'data-bs-theme', 
      this.darkMode ? 'dark' : 'light'
    );
  }

  private processForecast(data: Forecast): ProcessedForecast[] {
    const dailyForecast: { [key: string]: ProcessedForecast } = {};
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toLocaleDateString('es-ES', options);
      
      if (!dailyForecast[dateString]) {
        dailyForecast[dateString] = {
          date: dateString,
          temp: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          items: [item]
        };
      } else {
        // Promedia la temperatura y usa el ícono del período más reciente
        dailyForecast[dateString].temp = (dailyForecast[dateString].temp + item.main.temp) / 2;
        dailyForecast[dateString].icon = item.weather[0].icon;
        dailyForecast[dateString].items.push(item);
      }
    });

    return Object.values(dailyForecast).slice(0, 5); // Solo 5 días
  }
}