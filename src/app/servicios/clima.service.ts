// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Clima } from '../interfaces/clima';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ClimaService {
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly API_KEY = environment.openWeatherApiKey;

  constructor(private http: HttpClient) {}

  // getCurrentWeather(city: string) {
  //   return this.http.get(`${this.API_URL}/weather?q=${city}&units=metric&appid=${this.API_KEY}`);
  // }

  getForecast(city: string) {
    return this.http.get(`${this.API_URL}/forecast?q=${city}&units=metric&appid=${this.API_KEY}`);
  }

  getWeatherByCoords(lat: number, lon: number) {
    return this.http.get(`${this.API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`);
  }

  // En weather.service.ts
  getCurrentWeather(city: string): Observable<Clima> {  // Especifica el tipo de retorno
    return this.http.get<Clima>(`${this.API_URL}/weather?q=${city}&units=metric&appid=${this.API_KEY}`);
  }
}
