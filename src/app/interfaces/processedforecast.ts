export interface ProcessedForecast {
    date: string;
    temp: number;
    icon: string;
    description: string;
    items: Array<{
      dt: number;
      main: { temp: number };
      weather: Array<{ icon: string; description: string }>;
    }>;
  }
