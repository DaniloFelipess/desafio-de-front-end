import { City } from '@/types/weather';

export const CITIES: Record<string, City> = {
  dallol: {
    name: 'Dallol',
    code: 'NG',
    country: 'Nigeria',
    latitude: 14.2919,
    longitude: 40.5065,
  },
  fairbanks: {
    name: 'Fairbanks',
    code: 'US',
    country: 'United States',
    latitude: 64.8378,
    longitude: -147.7164,
  },
  london: {
    name: 'Londres',
    code: 'GB',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  recife: {
    name: 'Recife',
    code: 'BR',
    country: 'Brazil',
    latitude: -8.0726,
    longitude: -34.8767,
  },
  vancouver: {
    name: 'Vancouver',
    code: 'CA',
    country: 'Canada',
    latitude: 49.2827,
    longitude: -123.1207,
  },
  yakutsk: {
    name: 'Yakutsk',
    code: 'RU',
    country: 'Russia',
    latitude: 62.0355,
    longitude: 129.7015,
  },
};

export const WEATHER_TIMES = [
  { key: 'dawn', hour: 3, label: 'Dawn' },
  { key: 'morning', hour: 9, label: 'Morning' },
  { key: 'afternoon', hour: 15, label: 'Afternoon' },
  { key: 'night', hour: 21, label: 'Night' },
] as const;

