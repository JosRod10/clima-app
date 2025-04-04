export interface Forecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      icon: string;
      description: string;
    }>;
  }>;
  city: {
    name: string;
  };
}