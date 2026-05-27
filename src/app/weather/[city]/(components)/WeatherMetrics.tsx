import { WeatherData } from "@/types/weather";
import { WeatherMetric } from "./WeatherMetric";

type WeatherMetricsProps = {
  current?: WeatherData;
};

export function WeatherMetrics({ current }: WeatherMetricsProps) {
  return (
    <div className="mt-9 grid grid-cols-2 gap-y-4 text-center md:grid-cols-4 md:gap-y-0">
      <WeatherMetric
        label="Wind speed"
        value={current ? `${current.windSpeed} m/s` : ""}
        separatorClassName="block"
      />
      <WeatherMetric
        label="Sunrise"
        value={current?.sunrise ?? ""}
        separatorClassName="hidden md:block"
      />
      <WeatherMetric
        label="Sunset"
        value={current?.sunset ?? ""}
        separatorClassName="block"
      />
      <WeatherMetric
        label="Humidity"
        value={current ? `${current.humidity}%` : ""}
      />
    </div>
  );
}
