export interface WeatherData {
  currentTime?: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  temperatureMax?: number;
  temperatureMin?: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyWeather {
  time: "dawn" | "morning" | "afternoon" | "night";
  temperature: number;
  condition: WeatherCondition;
}

export interface CityWeather {
  city: City;
  current: WeatherData;
  hourly: HourlyWeather[];
}

export interface City {
  name: string;
  code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "stormy"
  | "windy"
  | "foggy"
  | "hail"
  | "drizzle"
  | "thunderstorm";

