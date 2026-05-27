import { WeatherCondition } from "@/types/weather";

export const PERIOD_LABELS = {
  dawn: "Dawn",
  morning: "Morning",
  afternoon: "Afternoon",
  night: "Night",
} as const;

export function getConditionLabel(condition?: WeatherCondition) {
  if (!condition) {
    return "Loading";
  }

  const labels: Record<WeatherCondition, string> = {
    sunny: "Clear",
    cloudy: "Cloudy",
    rainy: "Rain",
    snowy: "Snow",
    stormy: "Storm",
    windy: "Wind",
    foggy: "Fog",
    hail: "Hail",
    drizzle: "Clouds",
    thunderstorm: "Storm",
  };

  return labels[condition];
}
