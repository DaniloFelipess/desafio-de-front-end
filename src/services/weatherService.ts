import { WEATHER_TIMES } from '@/constants';
import { City, CityWeather, HourlyWeather, WeatherCondition } from '@/types/weather';

const DEFAULT_API_BASE = 'https://api.open-meteo.com/v1';
const DEFAULT_API_TIMEOUT_MS = 1200;
const API_BASE = process.env.WEATHER_API_BASE_URL ?? DEFAULT_API_BASE;
const API_TIMEOUT_MS = getApiTimeout();

interface OpenMeteoResponse {
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}

function getApiTimeout() {
  const timeout = Number(process.env.WEATHER_API_TIMEOUT_MS);

  if (Number.isFinite(timeout) && timeout > 0) {
    return timeout;
  }

  return DEFAULT_API_TIMEOUT_MS;
}

export const fetchWeatherData = async (city: City): Promise<CityWeather> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      latitude: String(city.latitude),
      longitude: String(city.longitude),
      current: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m',
      hourly: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m',
      daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
      timezone: 'auto',
      forecast_days: '1',
    });

    const response = await fetch(`${API_BASE}/forecast?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 900 },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return parseWeatherData(await response.json(), city);
  } catch {
    return getFallbackWeather(city);
  } finally {
    clearTimeout(timeout);
  }
};

function parseWeatherData(response: OpenMeteoResponse, city: City): CityWeather {
  const currentIndex = findCurrentHourIndex(response);
  const dailyIndex = 0;
  const currentTemperature =
    response.current?.temperature_2m ?? response.hourly.temperature_2m[currentIndex];
  const currentWeatherCode =
    response.current?.weather_code ?? response.hourly.weather_code[currentIndex];
  const currentHumidity =
    response.current?.relative_humidity_2m ?? response.hourly.relative_humidity_2m[currentIndex];
  const currentWindSpeed =
    response.current?.wind_speed_10m ?? response.hourly.wind_speed_10m[currentIndex];

  const hourly: HourlyWeather[] = WEATHER_TIMES.map(({ key, hour }) => {
    const index = findClosestHourIndex(response.hourly.time, hour);

    return {
      time: key,
      temperature: Math.round(response.hourly.temperature_2m[index]),
      condition: mapWeatherCode(response.hourly.weather_code[index]),
    };
  });

  return {
    city,
    current: {
      temperature: Math.round(currentTemperature),
      condition: mapWeatherCode(currentWeatherCode),
      humidity: Math.round(currentHumidity),
      windSpeed: Number(currentWindSpeed.toFixed(2)),
      feelsLike: Math.round(currentTemperature),
      temperatureMax: Math.round(response.daily.temperature_2m_max[dailyIndex]),
      temperatureMin: Math.round(response.daily.temperature_2m_min[dailyIndex]),
      sunrise: formatTime(response.daily.sunrise[dailyIndex]),
      sunset: formatTime(response.daily.sunset[dailyIndex]),
    },
    hourly,
  };
}

function findCurrentHourIndex(response: OpenMeteoResponse) {
  if (response.current?.time) {
    const currentIndex = response.hourly.time.findIndex(
      (time) => time === response.current?.time,
    );

    if (currentIndex >= 0) {
      return currentIndex;
    }
  }

  const now = new Date();
  return findClosestHourIndex(response.hourly.time, now.getHours());
}

function findClosestHourIndex(times: string[], targetHour: number) {
  const target = `${String(targetHour).padStart(2, '0')}:00`;
  const exactIndex = times.findIndex((time) => time.endsWith(`T${target}`));

  if (exactIndex >= 0) {
    return exactIndex;
  }

  return Math.min(targetHour, Math.max(times.length - 1, 0));
}

function formatTime(value?: string) {
  if (!value) {
    return '--:--';
  }

  const [, time = value] = value.split('T');
  const [hour = '--', minute = '--'] = time.split(':');
  const hourNumber = Number(hour);

  if (Number.isNaN(hourNumber)) {
    return `${hour}:${minute}`;
  }

  const period = hourNumber >= 12 ? 'PM' : 'AM';
  const hour12 = hourNumber % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${minute} ${period}`;
}

function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0) return 'sunny';
  if ([1, 2].includes(code)) return 'drizzle';
  if (code === 3) return 'cloudy';
  if ([45, 48].includes(code)) return 'foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';

  return 'cloudy';
}

function getFallbackWeather(city: City): CityWeather {
  const fallbackByCode: Record<string, Omit<CityWeather, 'city'>> = {
    NG: makeFallback(38, 'sunny', [31, 37, 40, 33], 24, '06:11 AM', '06:02 PM', 32),
    US: makeFallback(-8, 'snowy', [-13, -9, -6, -12], 74, '09:41 AM', '03:25 PM', 1.8),
    GB: makeFallback(9, 'cloudy', [7, 9, 11, 8], 76, '07:44 AM', '04:10 PM', 3.1),
    BR: makeFallback(28, 'drizzle', [26, 29, 30, 27], 78, '05:04 AM', '05:26 PM', 4.2),
    CA: makeFallback(-4, 'snowy', [-8, -8, -4, -1], 95, '12:38 PM', '10:13 PM', 1.69),
    RU: makeFallback(-18, 'snowy', [-23, -20, -16, -21], 82, '09:58 AM', '03:08 PM', 1.4),
  };

  return {
    city,
    ...(fallbackByCode[city.code] ?? makeFallback(18, 'cloudy', [16, 18, 20, 17], 60, '06:00 AM', '06:00 PM', 2)),
  };
}

function makeFallback(
  temperature: number,
  condition: WeatherCondition,
  hourlyTemperatures: [number, number, number, number],
  humidity: number,
  sunrise: string,
  sunset: string,
  windSpeed: number,
): Omit<CityWeather, 'city'> {
  return {
    current: {
      temperature,
      condition,
      humidity,
      windSpeed,
      feelsLike: temperature,
      temperatureMax: temperature + 4,
      temperatureMin: temperature - 5,
      sunrise,
      sunset,
    },
    hourly: WEATHER_TIMES.map(({ key }, index) => ({
      time: key,
      temperature: hourlyTemperatures[index],
      condition: key === 'night' ? 'stormy' : index === 1 ? 'sunny' : 'drizzle',
    })),
  };
}

